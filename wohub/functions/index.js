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
