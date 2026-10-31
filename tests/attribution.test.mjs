// node --test tests/   — attribution capture in static/assets/forms.js, run in a fake browser (node:vm)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const SRC = readFileSync(new URL("../static/assets/forms.js", import.meta.url), "utf8");

function storage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
}
const brokenStorage = { getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("QuotaExceededError"); } };

// Load forms.js as if a page at `url` was opened. Pass the same ls/ss to simulate later page views.
function open(url, { referrer = "", ls = storage(), ss = storage() } = {}) {
  const u = new URL(url);
  const doc = { referrer, querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute() {} }), head: { appendChild() {} }, body: { appendChild() {} } };
  const win = { localStorage: ls, sessionStorage: ss, location: { pathname: u.pathname, search: u.search, hash: u.hash }, document: doc };
  win.window = win;
  vm.runInNewContext(SRC, Object.assign(win, { URLSearchParams, JSON, Date, Promise, setTimeout, Object, String, Array, Error }));
  return { cf: win.casperForms, ls, ss, submitFields: () => win.casperForms.payload("Contact Us Form", { name: "Jane Smith", email: "jane@example.com" }, ["website_contact"]) };
}

test("a tagged landing fills every attribution field and adds the utm tag", () => {
  const { submitFields } = open("https://casperb2b.com/tools/website-grader?utm_source=facebook&utm_medium=paid&utm_campaign=oct-grader&utm_content=ad1&utm_term=web+grader&fbclid=FB123", { referrer: "https://l.facebook.com/" });
  const p = submitFields();
  assert.equal(p.utm_source, "facebook"); assert.equal(p.utm_medium, "paid"); assert.equal(p.utm_campaign, "oct-grader");
  assert.equal(p.utm_content, "ad1"); assert.equal(p.utm_term, "web grader"); assert.equal(p.fbclid, "FB123"); assert.equal(p.gclid, "");
  assert.equal(p.landing_page, "/tools/website-grader"); assert.equal(p.referrer, "https://l.facebook.com/");
  assert.equal(p.first_utm_source, "facebook"); assert.equal(p.first_utm_campaign, "oct-grader");
  assert.deepEqual(p.tags, ["website_contact", "source_contact_us_form", "utm_facebook"]);
  assert.equal(p.source_page, "/tools/website-grader"); // path only, no query string
  assert.equal(p.first_name, "Jane"); assert.equal(p.last_name, "Smith");
});

test("first touch and landing page are never overwritten; last touch follows the latest tagged visit", () => {
  const ls = storage();
  open("https://casperb2b.com/?utm_source=linkedin-page&utm_campaign=launch", { referrer: "https://www.linkedin.com/", ls });
  // next day, a new session from a Google ad
  const later = open("https://casperb2b.com/services/seo?utm_source=google&utm_campaign=seo-ma&gclid=G1", { referrer: "https://www.google.com/", ls });
  const p = later.submitFields();
  assert.equal(p.utm_source, "google"); assert.equal(p.gclid, "G1");
  assert.equal(p.first_utm_source, "linkedin-page"); assert.equal(p.first_utm_campaign, "launch");
  assert.equal(p.landing_page, "/"); assert.equal(p.referrer, "https://www.linkedin.com/");
  assert.ok(p.tags.includes("utm_google") && !p.tags.includes("utm_linkedin_page"));
});

test("untagged page views in the same session keep the session's last touch", () => {
  const ls = storage(), ss = storage();
  open("https://casperb2b.com/?utm_source=facebook", { ls, ss });
  const p = open("https://casperb2b.com/contact", { ls, ss, referrer: "https://casperb2b.com/" }).submitFields();
  assert.equal(p.utm_source, "facebook"); assert.ok(p.tags.includes("utm_facebook"));
});

test("an organic visitor: empty utm fields, no utm tag, landing + referrer still recorded", () => {
  const p = open("https://casperb2b.com/blog/stop-missing-calls", { referrer: "https://www.bing.com/" }).submitFields();
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "first_utm_source", "first_utm_campaign"]) assert.equal(p[k], "", k);
  assert.equal(p.landing_page, "/blog/stop-missing-calls"); assert.equal(p.referrer, "https://www.bing.com/");
  assert.ok(!p.tags.some((t) => t.startsWith("utm_")));
});

test("organic first visit, tagged visit later: first_utm_* is the first tagged visit", () => {
  const ls = storage();
  open("https://casperb2b.com/", { ls, referrer: "https://www.google.com/" });
  const p = open("https://casperb2b.com/pricing?utm_source=newsletter&utm_campaign=nov", { ls }).submitFields();
  assert.equal(p.first_utm_source, "newsletter"); assert.equal(p.landing_page, "/"); assert.equal(p.referrer, "https://www.google.com/");
});

test("blocked storage (private mode) never throws; the current visit's tags are lost but the form still submits", () => {
  const { submitFields } = open("https://casperb2b.com/?utm_source=facebook", { ls: brokenStorage, ss: brokenStorage, referrer: "https://x.com/" });
  const p = submitFields();
  assert.equal(p.email, "jane@example.com"); assert.equal(p.landing_page, "/"); assert.equal(p.referrer, "https://x.com/");
});

test("form data wins over attribution fields of the same name", () => {
  const { cf } = open("https://casperb2b.com/?utm_source=facebook");
  const p = cf.payload("SEO Audit Page", { email: "a@b.co", referrer: "typed by visitor" });
  assert.equal(p.referrer, "typed by visitor");
});

test("utm tag naming", () => {
  const { cf } = open("https://casperb2b.com/");
  assert.equal(cf.sourceTag("facebook"), "utm_facebook");
  assert.equal(cf.sourceTag("LinkedIn Page"), "utm_linkedin_page");
  assert.equal(cf.sourceTag("linkedin_profile"), "utm_linkedin_profile");
  assert.equal(cf.sourceTag("  --News.Letter!! "), "utm_news_letter");
  assert.equal(cf.sourceTag(""), "");
});
