const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

const REGION = "us-central1"; // if change to au: https://australia-southeast1-<project>.cloudfunctions.net/sendEmail
const cfg = functions.config();
const SENDGRID_KEY = cfg?.sendgrid?.key;
const ALLOW_ORIGINS = (cfg?.allowed?.origins || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

sgMail.setApiKey(SENDGRID_KEY);

const allowCors = (req, res) => {
  const origin = req.get("origin") || "";
  if (ALLOW_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
};
const chunk = (arr, n) => (arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []);


exports.sendEmail = functions.region(REGION).https.onRequest(async (req, res) => {
  const origin = req.get("origin") || "";

  if (req.method === "OPTIONS") {
    if (ALLOW_ORIGINS.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Vary", "Origin");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Max-Age", "3600");
    return res.status(204).send(""); 
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  if (ALLOW_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");

  try {
    const { to, subject, text, html, filename, fileBase64, mimeType, from } = req.body || {};
    if (!to || !subject) {
      return res.status(400).json({ ok: false, error: "Missing 'to' or 'subject'." });
    }

    const msg = {
      to,
      from: from || "wangxijia99@gmail.com", 
      subject,
      text,
      html,
    };

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


// === Bulk Email endpoint ===
exports.sendBulkEmail = functions.region(REGION).https.onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    allowCors(req, res);
    return res.status(204).send("");
  }
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  allowCors(req, res);

  try {
    const {
      to,                // string | string[]  
      subject,           // string             
      text,              // string             
      html,              // string             
      from,              // string             
      filename,          // string             
      fileBase64,        // string (base64)    
      mimeType,          // string mime        
      dryRun = false,    // boolean            
      batchSize = 500    // number             
    } = req.body || {};

    let recipientList = [];
    if (Array.isArray(to)) {
      recipientList = to.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
    } else if (typeof to === "string") {
      recipientList = to.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (!recipientList.length) {
      return res.status(400).json({ ok: false, error: "Missing 'to' recipients." });
    }
    if (!subject) {
      return res.status(400).json({ ok: false, error: "Missing 'subject'." });
    }
    if (!text && !html) {
      return res.status(400).json({ ok: false, error: "Either 'text' or 'html' is required." });
    }

    const seen = new Set();
    recipientList = recipientList.filter(e => {
      const k = e.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

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
        subject,
        text,
        html,
        attachments,
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

