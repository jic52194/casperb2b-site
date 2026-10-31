// node --test tests/   — the casperb2b-forms Worker's request handling, with Turnstile and GHL mocked
import test from "node:test";
import assert from "node:assert/strict";
import worker, { cleanPath, forwardBody } from "../worker/src/index.js";

const ENV = { TURNSTILE_SECRET: "test-secret", GHL_WEBHOOK_URL: "https://ghl.invalid/hook" };
const ORIGIN = "https://casperb2b.com";

// Replace fetch: Turnstile passes unless the token is "bad"; GHL answers `ghlStatus`. Records what reached GHL.
function mockFetch({ ghlStatus = 200 } = {}) {
  const sent = [];
  globalThis.fetch = async (url, init) => {
    if (String(url).includes("turnstile")) {
      const ok = init.body.get("response") !== "bad";
      return new Response(JSON.stringify(ok ? { success: true } : { success: false, "error-codes": ["invalid-input-response"] }));
    }
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response("{}", { status: ghlStatus });
  };
  return sent;
}
const post = (body, origin = ORIGIN) => worker.fetch(new Request("https://casperb2b-forms.carsalenow.workers.dev/", { method: "POST", headers: { origin, "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) }), ENV);

const LEAD = { first_name: "Jane", last_name: "Smith", email: "jane@example.com", phone: "", message: "Need SEO", source_form: "Contact Us Form",
  source_page: "/contact?topic=seo#request", tags: ["website_contact", "source_contact_us_form", "utm_facebook"], notes: "",
  utm_source: "facebook", utm_medium: "paid", utm_campaign: "oct", utm_content: "", utm_term: "", gclid: "", fbclid: "FB1",
  landing_page: "/tools/website-grader", referrer: "https://l.facebook.com/", first_utm_source: "facebook", first_utm_campaign: "oct",
  service_requested: "seo", "contact.business_name": "Acme", _ts: "tok", _hp: "", _t: 2500, _tl: 12000 };

test("a real lead is forwarded with every field unchanged, bot-check fields removed, source_page path-only", async () => {
  const sent = mockFetch();
  const r = await post(LEAD);
  assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true });
  assert.equal(sent.length, 1); assert.equal(sent[0].url, ENV.GHL_WEBHOOK_URL);
  const { _ts, _hp, _t, _tl, ...expected } = LEAD;
  assert.deepEqual(sent[0].body, { ...expected, source_page: "/contact" });
  assert.equal(r.headers.get("access-control-allow-origin"), ORIGIN);
});

test("spam answers 200 but is not forwarded", async () => {
  for (const bad of [{ _hp: "x" }, { _tl: 800 }, { first_name: "KVduYVMwTrYUKFZpOlOghdjL" }, { email: "k.v.d.u@gmail.com" }]) {
    const sent = mockFetch();
    const r = await post({ ...LEAD, ...bad });
    assert.equal(r.status, 200, JSON.stringify(bad)); assert.deepEqual(await r.json(), { ok: true });
    assert.equal(sent.length, 0, `forwarded spam: ${JSON.stringify(bad)}`);
  }
});

test("Turnstile failure is a 403 captcha error (forms.js shows the retry message)", async () => {
  const sent = mockFetch();
  const r = await post({ ...LEAD, _ts: "bad" });
  assert.equal(r.status, 403); assert.deepEqual(await r.json(), { ok: false, error: "captcha", codes: ["invalid-input-response"] });
  assert.equal(sent.length, 0);
});

test("other origins, bad JSON and GHL errors", async () => {
  mockFetch();
  assert.equal((await post(LEAD, "https://evil.example")).status, 403);
  assert.equal((await post("{nope")).status, 400);
  assert.equal((await post("[1,2]")).status, 400);
  mockFetch({ ghlStatus: 500 });
  assert.equal((await post(LEAD)).status, 502);
});

test("preflight", async () => {
  const r = await worker.fetch(new Request("https://x/", { method: "OPTIONS", headers: { origin: ORIGIN } }), ENV);
  assert.equal(r.status, 204); assert.equal(r.headers.get("access-control-allow-methods"), "POST, OPTIONS");
});

test("missing secrets fail closed with 500", async () => {
  mockFetch();
  const r = await worker.fetch(new Request("https://x/", { method: "POST", headers: { origin: ORIGIN }, body: JSON.stringify(LEAD) }), {});
  assert.equal(r.status, 500);
});

test("cleanPath / forwardBody", () => {
  assert.equal(cleanPath("/contact?topic=seo"), "/contact");
  assert.equal(cleanPath("https://casperb2b.com/tools/roi-calculator/?utm_source=x#y"), "/tools/roi-calculator/");
  assert.equal(cleanPath(""), "");
  assert.deepEqual(forwardBody({ a: 1, _ts: "t", _gotcha: "", source_page: "/x?y=1" }), { a: 1, source_page: "/x" });
});
