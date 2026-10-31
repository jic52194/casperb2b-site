// casperb2b-forms — Cloudflare Worker between casperb2b.com's forms (static/assets/forms.js) and the GoHighLevel inbound
// webhook ("Website Lead Capture" workflow).
//
//   POST JSON from https://casperb2b.com  →  Turnstile check  →  spam rules (src/spam.js)  →  forward to GHL
//
// Responses (forms.js relies on these):
//   204  OPTIONS preflight
//   200  {"ok":true}                 forwarded, or quietly dropped as spam (bots get no signal)
//   403  {"ok":false,"error":"captcha","codes":[…]}   Turnstile failed → the form asks the visitor to retry the check
//   403  {"ok":false,"error":"origin"}                 not called from casperb2b.com
//   400 / 413 / 405                  bad JSON / too big / wrong method
//   502  {"ok":false}                GHL did not accept the lead → the form shows "please call us"
//
// Secrets (set with `wrangler secret put`, never in this file):
//   TURNSTILE_SECRET   Turnstile secret key        (TURNSTILE_SECRET_KEY also accepted)
//   GHL_WEBHOOK_URL    GoHighLevel inbound webhook (GHL_WEBHOOK also accepted)
// The Worker sends no email, SMS or push notifications; GHL's "Internal Alert — Lead Captured" workflow does that.
import { spamReasons, emailDomain } from "./spam.js";

const ORIGINS = new Set(["https://casperb2b.com", "https://www.casperb2b.com"]);
const INTERNAL = ["_ts", "_hp", "_t", "_tl", "_gotcha"]; // bot-check fields: used here, never forwarded
const MAX_BODY = 32_000;

function cors(origin) {
  return {
    "access-control-allow-origin": ORIGINS.has(origin) ? origin : "https://casperb2b.com",
    "vary": "Origin",
    "access-control-allow-headers": "Content-Type",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-max-age": "86400",
  };
}
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "content-type": "application/json" } });

// "/contact?topic=seo#x" → "/contact"; full URLs → their path. Anything odd → "".
export function cleanPath(x) {
  let s = String(x ?? "").trim();
  if (!s) return "";
  try { if (/^https?:\/\//i.test(s)) s = new URL(s).pathname; } catch { return ""; }
  return s.split(/[?#]/)[0].slice(0, 300);
}

// The exact body GHL receives: every field the site sent, unchanged, minus the bot-check fields, with source_page path-only.
export function forwardBody(p) {
  const out = {};
  for (const [k, v] of Object.entries(p)) if (!INTERNAL.includes(k)) out[k] = v;
  if ("source_page" in out) out.source_page = cleanPath(out.source_page);
  return out;
}

async function verifyTurnstile(token, secret, ip) {
  if (!token) return { success: false, "error-codes": ["missing-input-response"] };
  const form = new FormData();
  form.append("secret", secret); form.append("response", String(token));
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    return await r.json();
  } catch {
    return { success: false, "error-codes": ["siteverify-unreachable"] };
  }
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST") return json({ ok: false, error: "POST only" }, 405, origin);
    if (!ORIGINS.has(origin)) return json({ ok: false, error: "origin" }, 403, origin);

    const secret = env.TURNSTILE_SECRET || env.TURNSTILE_SECRET_KEY;
    const webhook = env.GHL_WEBHOOK_URL || env.GHL_WEBHOOK;
    if (!secret || !webhook) { console.error(JSON.stringify({ event: "config_error", missing: [!secret && "TURNSTILE_SECRET", !webhook && "GHL_WEBHOOK_URL"].filter(Boolean) })); return json({ ok: false }, 500, origin); }

    let p;
    try {
      const text = await req.text();
      if (text.length > MAX_BODY) return json({ ok: false, error: "too big" }, 413, origin);
      p = JSON.parse(text);
      if (!p || typeof p !== "object" || Array.isArray(p)) throw new Error("not an object");
    } catch { return json({ ok: false, error: "bad json" }, 400, origin); }

    const ts = await verifyTurnstile(p._ts, secret, req.headers.get("cf-connecting-ip"));
    if (!ts.success) return json({ ok: false, error: "captcha", codes: ts["error-codes"] || [] }, 403, origin);

    const reasons = spamReasons(p);
    if (reasons.length) {
      // no PII: reasons, form, page and the email's domain only
      console.log(JSON.stringify({ event: "lead_rejected", reasons, source_form: String(p.source_form || "").slice(0, 80), source_page: cleanPath(p.source_page), email_domain: emailDomain(p.email) }));
      return json({ ok: true }, 200, origin);
    }

    const body = forwardBody(p);
    try {
      const r = await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) { console.error(JSON.stringify({ event: "ghl_error", status: r.status, source_form: body.source_form })); return json({ ok: false }, 502, origin); }
    } catch (e) {
      console.error(JSON.stringify({ event: "ghl_unreachable", source_form: body.source_form }));
      return json({ ok: false }, 502, origin);
    }
    console.log(JSON.stringify({ event: "lead_forwarded", source_form: body.source_form, source_page: body.source_page, utm_source: body.utm_source || "" }));
    return json({ ok: true }, 200, origin);
  },
};
