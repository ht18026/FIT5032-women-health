// index.js — Cloud Functions Gen1 (us-central1)
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

const REGION = "us-central1"; // back to US Gen1
const cfg = functions.config();
const SENDGRID_KEY = cfg?.sendgrid?.key;
const ALLOW_ORIGINS = (cfg?.allowed?.origins || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowCors = (req, res) => {
  const origin = req.get("origin") || "";
  if (ALLOW_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
};
const chunk = (arr, n) => (arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []);

exports.sendEmail = functions.region(REGION).https.onRequest(async (req, res) => {
  if (req.method === "OPTIONS") { allowCors(req, res); return res.status(204).send(""); }
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  allowCors(req, res);

  try {
    if (!SENDGRID_KEY) return res.status(500).json({ ok: false, error: "SENDGRID key not configured" });
    sgMail.setApiKey(SENDGRID_KEY);

    const { to, subject, text, html, filename, fileBase64, mimeType, from } = req.body || {};
    if (!to || !subject) return res.status(400).json({ ok: false, error: "Missing 'to' or 'subject'." });

    const msg = { to, from: from || "wangxijia99@gmail.com", subject, text, html };
    if (fileBase64) {
      msg.attachments = [{
        content: fileBase64,
        filename: filename || "attachment",
        type: mimeType || "application/octet-stream",
        disposition: "attachment",
      }];
    }

    await sgMail.send(msg);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

exports.sendBulkEmail = functions.region(REGION).https.onRequest(async (req, res) => {
  if (req.method === "OPTIONS") { allowCors(req, res); return res.status(204).send(""); }
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  allowCors(req, res);

  try {
    if (!SENDGRID_KEY) return res.status(500).json({ ok: false, error: "SENDGRID key not configured" });
    sgMail.setApiKey(SENDGRID_KEY);

    const {
      to, subject, text, html, from,
      filename, fileBase64, mimeType,
      dryRun = false, batchSize = 500
    } = req.body || {};

    let recipientList = [];
    if (Array.isArray(to)) recipientList = to.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
    else if (typeof to === "string") recipientList = to.split(",").map(s => s.trim()).filter(Boolean);

    if (!recipientList.length) return res.status(400).json({ ok: false, error: "Missing 'to' recipients." });
    if (!subject) return res.status(400).json({ ok: false, error: "Missing 'subject'." });
    if (!text && !html) return res.status(400).json({ ok: false, error: "Either 'text' or 'html' is required." });

    const seen = new Set();
    recipientList = recipientList.filter(e => { const k = e.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

    let attachments;
    if (fileBase64) {
      attachments = [{
        content: fileBase64,
        filename: filename || "attachment",
        type: mimeType || "application/octet-stream",
        disposition: "attachment",
      }];
    }

    const batches = chunk(recipientList, Math.max(1, Math.min(batchSize, 1000)));
    let total = 0;
    for (const list of batches) {
      const msg = {
        from: from || "wangxijia99@gmail.com",
        subject, text, html, attachments,
        personalizations: list.map(email => ({ to: [{ email }] })),
        mailSettings: dryRun ? { sandboxMode: { enable: true } } : undefined,
      };
      await sgMail.send(msg);
      total += list.length;
    }

    return res.json({ ok: true, sent: total, batchCount: batches.length, dryRun });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

exports.getUserCounts = functions.region(REGION).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const email = context.auth?.token?.email || null;
  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "Please sign in.");
  }

  let isAdmin = context.auth?.token?.admin === true;
  const db = admin.firestore();

  let foundRole = null;
  let foundDocPath = null;

  if (!isAdmin) {
    const doc1 = await db.doc(`users/${uid}`).get();
    if (doc1.exists) {
      foundRole = String(doc1.data()?.role || "").toLowerCase().trim();
      foundDocPath = doc1.ref.path;
      if (foundRole === "admin") isAdmin = true;
    }
  }

  if (!isAdmin) {
    const q1 = await db.collection("users").where("uid", "==", uid).limit(1).get();
    if (!q1.empty) {
      const d = q1.docs[0];
      foundRole = String(d.data()?.role || "").toLowerCase().trim();
      foundDocPath = d.ref.path;
      if (foundRole === "admin") isAdmin = true;
    }
  }

  if (!isAdmin && email) {
    const q2 = await db.collection("users").where("email", "==", email).limit(1).get();
    if (!q2.empty) {
      const d2 = q2.docs[0];
      foundRole = String(d2.data()?.role || "").toLowerCase().trim();
      foundDocPath = d2.ref.path;
      if (foundRole === "admin") isAdmin = true;
    }
    if (!isAdmin) {
      const doc2 = await db.doc(`users/${email}`).get();
      if (doc2.exists) {
        foundRole = String(doc2.data()?.role || "").toLowerCase().trim();
        foundDocPath = doc2.ref.path;
        if (foundRole === "admin") isAdmin = true;
      }
    }
  }

  functions.logger.info("admin check", { uid, email, foundRole, foundDocPath, claim: context.auth?.token?.admin });

  if (!isAdmin) {
    throw new functions.https.HttpsError("permission-denied", "UNAUTHORISED: Admin only");
  }

  const snap = await db.collection("users").get();
  const counts = { admin: 0, staff: 0, volunteer: 0, member: 0, unknown: 0 };
  snap.forEach(d => {
    const r = String(d.data()?.role || "member").toLowerCase().trim();
    counts[r in counts ? r : "unknown"] += 1;
  });
  return { userCounts: counts };
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.genaiText = functions.region(REGION).https.onRequest(async (req, res) => {
  if (req.method === "OPTIONS") { allowCors(req, res); return res.status(204).send(""); }
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  allowCors(req, res);

  try {
    const GEMINI_KEY = cfg?.gemini?.key;
    if (!GEMINI_KEY) return res.status(500).json({ ok: false, error: "GEMINI key not configured" });

    const {
      prompt,           // string
      system,           // string
      history = [],     
      model = "gemini-2.0-flash", 
      temperature = 0.3,
      maxOutputTokens = 1024,
      jsonSchema = null 
    } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ ok: false, error: "Missing 'prompt'." });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);

    const modelOpts = { model };
    if (system) modelOpts.systemInstruction = system;

    const gModel = genAI.getGenerativeModel(modelOpts);

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        const r = (h.role === "model" || h.role === "assistant") ? "model" : "user";
        const t = (h.text ?? h.content ?? "").toString();
        if (t) contents.push({ role: r, parts: [{ text: t }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const generationConfig = {
      temperature,
      maxOutputTokens,
    };

    
    if (jsonSchema && typeof jsonSchema === "object") {
      generationConfig.responseMimeType = "application/json";
      generationConfig.responseSchema   = jsonSchema;
    }

    const result = await gModel.generateContent({ contents, generationConfig });
    const response = result?.response || result;
    const text = typeof response.text === "function" ? response.text() : response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.json({
      ok: true,
      model,
      text,
      usage: response?.usageMetadata || undefined,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e?.message || "GenAI error" });
  }
});
