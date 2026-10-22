// Builds casperb2b.com into dist/ (static, GitHub Pages): node scripts/build.mjs
// content/pages.json = the live site's rendered content (one entry per kept URL, already cleaned of the old app's chrome);
// data/redirects.json = old URL → new URL for every stub, duplicate or merged page (served as redirect pages);
// data/images.json = original image URL → optimized local copy (scripts/images.mjs).
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SITE, NAME, OUT, TODAY, PHONE_TEL, EMAIL, ORG, ORG_REF, MENUS, urls, write, page, redirect, esc, ld, strip, leadForm, newsletterForm } from "./lib.mjs";
import { TOOLS, toolPage } from "./tools.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (f) => JSON.parse(readFileSync(ROOT + f, "utf8"));
const PAGES = read("content/pages.json");
const REDIRECTS = read("data/redirects.json");
const IMAGES = read("data/images.json");
const BY = Object.fromEntries(PAGES.map((p) => [p.path, p]));
const KEEP = new Set(PAGES.map((p) => p.path));

rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
cpSync(ROOT + "static/", OUT, { recursive: true });

// ── names, titles, descriptions ──
const NAV = new Map(MENUS.flatMap(([, items]) => items).map(([n, h]) => [h, n]));
const HUBS = { "/services": "Services", "/casper-va": "Casper VA", "/blog": "Blog", "/niches": "Industries", "/problems": "Problems We Solve", "/tools": "Free Tools", "/integrations": "Integrations", "/strategy": "Strategy" };
const ARTICLES = ["/the-cost-of-inaction", "/the-premium-on-execution", "/vanity-metrics", "/leadership-removing-friction", "/roi-of-dedicated-va", "/in-defense-of-holding-grudges", "/motivation-drivers", "/the-49k-story", "/what-is-an-ai-chatbot-and-do-i-need-one"];
const isPost = (p) => /^\/blog\/[^/]+$/.test(p) || ARTICLES.includes(p);
const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();
const clip = (s, n) => s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "") + "…";
const shortName = (p) => p === "/" ? "Home" : HUBS[p] || NAV.get(p) || clean(BY[p]?.h1 || p).replace(/[.:]$/, "").slice(0, 70);

// Titles must be ≤ 60 chars and unique; the live titles are kept wherever they fit. Hand-set where the live one ran long.
const TITLE_OVERRIDE = {
  "/": "CasperB2B | Marketing, Automation & Cybersecurity",
  "/contact": "Contact CasperB2B | Request a 15-Minute Fit Call",
  "/pricing": "Pricing & Plans | CasperPortal + Casper VA | CasperB2B",
  "/blog/automate-lead-follow-up": "How to Automate Lead Follow-Up | CasperB2B",
  "/blog/email-automation-campaigns": "Email Automation: 3 Campaigns You Should Be Running",
  "/blog/high-converting-landing-page": "High-Converting Landing Pages for Home Services",
  "/blog/implement-missed-call-text-back": "How to Implement Missed-Call Text Back | CasperB2B",
  "/georgetown-ma": "Digital Marketing, Web Design & SEO in Georgetown MA",
  "/niches/real-estate-agents": "Digital Marketing for Real Estate Agents | CasperB2B",
  "/niches/real-estate-development": "Digital Marketing for Real Estate Development | CasperB2B",
};
function makeTitle(p) {
  if (TITLE_OVERRIDE[p]) return [TITLE_OVERRIDE[p]];
  const raw = clean(BY[p].title).replace(/\s+—\s+CasperB2B.*$/i, "");
  const segs = raw.split(/\s+\|\s+/);
  const core = [segs[0], ...segs.slice(1).filter((s) => !/casper\s?b2b|casper va services/i.test(s))].join(" | ");
  const h1 = clean(BY[p].h1);
  const cands = [core + " | CasperB2B", core, segs[0] + " | CasperB2B", segs[0], h1 + " | CasperB2B", h1].filter((c) => c && !/^CasperB2B \| CasperB2B/.test(c));
  const base = segs[0];
  const shorter = [base.replace(/\s*\([^)]*\)?.*$/, ""), base.split(/:\s|\s[—–]\s/)[0], (base.match(/^[^?]*\?/) || [""])[0]].map(clean).filter((x) => x.length >= 20);
  for (const s of shorter) cands.push(s + " | CasperB2B", s);
  const fit = cands.filter((c) => c.length <= 60);
  const cut = base.slice(0, 60); const i = Math.max(cut.lastIndexOf(":"), cut.lastIndexOf(" —"), cut.lastIndexOf("?"));
  if (!fit.length) console.warn("TITLECUT", p, "|", base, "|", h1);
  fit.push(i > 30 ? cut.slice(0, i + (cut[i] === "?" ? 1 : 0)).trim() : cut.replace(/\s+\S*$/, "").replace(/[,:;—–-]$/, "").trim());
  return fit;
}
function firstPara(html) { const m = html.match(/<p(?: class="(?!eyebrow)[^"]*")?>([\s\S]*?)<\/p>/g) || []; for (const x of m) { const t = strip(x); if (t.length > 60) return t; } return ""; }
function makeDesc(p, html) {
  let d = clean(BY[p].desc);
  if (!d || /^CasperB2B protects small businesses from cyber threats/.test(d) && p !== "/") d = firstPara(html);
  return fitDesc(d);
}
function fitDesc(d) {
  d = clean(d); if (d.length <= 155) return d;
  const cut = d.slice(0, 155); const s = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (s >= 80) return cut.slice(0, s + 1);
  return cut.slice(0, 152).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "") + "…";
}

// ── link + media rewriting ──
const STATIC_OK = (p) => existsSync(join(ROOT, "static", p)) || /^\/(sitemap\.xml|robots\.txt|llms\.txt)$/.test(p);
function resolve(href) {
  let h = (href || "").replace(/&amp;/g, "&").trim();
  if (!h || h.startsWith("#")) return { kind: "same", href: h };
  if (/^tel:/i.test(h)) return { kind: "ext", href: "tel:" + PHONE_TEL.replace(/^\+1/, "+1") };
  if (/^(mailto|sms):/i.test(h)) return { kind: "ext", href: h };
  const m = h.match(/^https?:\/\/(www\.)?casperb2b\.com(.*)$/i); if (m) h = m[2] || "/";
  if (/^https?:/i.test(h)) return { kind: "ext", href: h };
  if (!h.startsWith("/")) h = "/" + h;
  const [pq, hash] = h.split("#"); let p = pq.split("?")[0].replace(/\/+$/, "") || "/";
  if (KEEP.has(p)) return { kind: "page", href: p + (hash ? "#" + hash : "") };
  if (REDIRECTS[p]) return { kind: "moved", href: REDIRECTS[p] };
  if (STATIC_OK(p)) return { kind: "page", href: p };
  return { kind: "gone" };
}
const extAttrs = (h) => /^https?:/.test(h) ? ' rel="noopener"' : "";
function rewriteLinks(html) {
  html = html.replace(/<a class="card-link" href="([^"]*)">([\s\S]*?)<\/a>/g, (all, href, inner) => {
    const r = resolve(href);
    if (r.kind === "page" || r.kind === "ext" || r.kind === "same") return `<a class="card-link" href="${esc(r.href)}"${extAttrs(r.href)}>${inner}</a>`;
    if (/<h[2-4]>/.test(inner)) return ""; // a listing card for a page that no longer exists
    return `<div class="card">${inner}</div>`;
  });
  return html.replace(/<a href="([^"]*)"((?: class="[^"]*")?)>([\s\S]*?)<\/a>/g, (all, href, cls, inner) => {
    const r = resolve(href);
    if (r.kind === "gone") return inner;
    return `<a href="${esc(r.href)}"${cls}${extAttrs(r.href)}>${inner}</a>`;
  });
}
let imgCount = 0;
function rewriteMedia(html) {
  html = html.replace(/<img src="([^"]*)" alt="([^"]*)"[^>]*>/g, (all, src, alt) => {
    const m = IMAGES[src.replace(/&amp;/g, "&")]; if (!m) return "";
    const eager = imgCount++ === 0;
    return `<img src="${m.src}" alt="${alt}" width="${m.w}" height="${m.h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  });
  html = html.replace(/<video src="([^"]*)" poster="([^"]*)"><\/video>/g, (all, src, poster) => {
    const pm = IMAGES[poster.replace(/&amp;/g, "&")];
    return `<div class="video"><video controls preload="none" playsinline src="${src}"${pm ? ` poster="${pm.src}"` : ""} aria-label="CasperB2B overview video"></video></div>`;
  });
  html = html.replace(/<iframe src="([^"]*)" title="([^"]*)"><\/iframe>/g, (all, src, title) => {
    if (/youtube\.com\/embed/.test(src)) return `<div class="embed"><iframe src="${src}" title="${title || "YouTube video"}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    return `<div class="embed tall"><iframe src="${src}" title="${title || "Agreement builder"}" loading="lazy"></iframe></div>`;
  });
  return html;
}
function polish(html) {
  // author line: "By Jared Casper • Last updated: …" and the post header (avatar + name + date + read time)
  html = html.replace(/<p>By Jared Casper<\/p>(?:<p>•<\/p>)?<p>(Last updated: [^<]+)<\/p>/g, '<p class="byline">By <a href="/author/jared-casper">Jared Casper</a> · $1</p>');
  html = html.replace(/<a class="card-link" href="\/author\/jared-casper">(?:<img [^>]*>)?<p class="eyebrow">Jared Casper<\/p><\/a>((?:<p class="eyebrow">[^<]{3,30}<\/p>){0,2})/g, (all, rest) => `<p class="byline">By <a href="/author/jared-casper">Jared Casper</a>${[...rest.matchAll(/<p class="eyebrow">([^<]+)<\/p>/g)].map((m) => " · " + m[1]).join("")}</p>`);
  html = html.replace(/<p>(?:\d{1,2}\.?|•)<\/p>/g, "");
  html = html.replace(/<p>((?:From )?\$[\d,.]+)<\/p><p>(\/(?:mo|month|hr|yr))<\/p>/g, '<p class="price">$1<span>$2</span></p>');
  html = html.replace(/<p>((?:From )?\$[\d,.]+(?:\/mo)?)<\/p>/g, '<p class="price">$1</p>');
  html = html.replace(/<p class="ctas">(\s*)<a href="([^"]*)">/g, '<p class="ctas">$1<a class="btn" href="$2">');
  html = html.replace(/<p>(<a href="[^"]*">[^<]{2,60}<\/a>)<\/p>/g, (all, a) => /Request|Book|Get |Start|Talk|Schedule|Build|Discuss|Apply|Join|Download/i.test(a) ? `<p class="ctas">${a.replace("<a ", '<a class="btn" ')}</p>` : all);
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap" tabindex="0" role="region" aria-label="Comparison table"><table>$1</table></div>');
  html = html.replace(/<div class="grid (g\d)">((?:<a class="card-link" href="[^"]*"(?: rel="noopener")?><img [^>]*><\/a>)+)<\/div>/g, '<div class="grid $1 logos">$2</div>');
  // a lone phone/email "card" link → a plain link
  html = html.replace(/<a class="card-link" href="((?:tel|mailto):[^"]*)"><p>([^<]+)<\/p><\/a>/g, '<p class="contact-line"><a href="$1">$2</a></p>');
  // grids of tiny stat cards ("24/7 · Cyber Defense") stay side by side on phones
  html = html.replace(/<div class="grid (g\d)">((?:<div class="card">(?:<p(?: class="eyebrow")?>[^<]{1,24}<\/p>){1,2}<\/div>)+)<\/div>/g, '<div class="grid $1 mini">$2</div>');
  // runs of 3+ short label paragraphs → a tag list
  html = html.replace(/(?:<p>[^<.:?!]{2,32}<\/p>){3,}/g, (run) => `<ul class="tags">${[...run.matchAll(/<p>([^<]+)<\/p>/g)].map((m) => `<li>${m[1]}</li>`).join("")}</ul>`);
  return html;
}

// ── content conflicts (two pages disagree): both statements are kept out of the copy and listed in README.md ──
const EDITS = {
  // VA pricing: /pricing says "VA rates start at $800/mo" (and so "From $1,097/mo" total) while the Data Entry Specialist role is $700/mo.
  "/": [[/<p>From \$1,097\/mo<\/p>/, ""]],
  "/pricing": [[/<p>From \$1,097\/mo total<\/p>/, ""], [/ VA rates start at \$800\/mo\./, ""]],
  // Mark Casper's role: "Co-Founder & Sales Strategist" on /about-us vs "Advisor, CasperB2B" on /mark-casper.
  "/about-us": [[/<p class="eyebrow">Co-Founder &amp; Sales Strategist<\/p>/, ""], [/alt="Mark Casper — Co-Founder &amp; Sales Strategist at CasperB2B"/, 'alt="Mark Casper"'], [/<h3>Meet the Founders<\/h3>/, ""]],
  "/mark-casper": [[/<p>Advisor, CasperB2B<\/p>/, ""], [/<p class="eyebrow">Founder Profile<\/p>|<p>Founder Profile<\/p>/, ""]],
};
function applyEdits(p, html) { for (const [re, to] of EDITS[p] || []) { if (!re.test(html)) throw new Error(`edit did not match on ${p}: ${re}`); html = html.replace(re, to); } return html; }

// ── forms placed where the live pages had them ──
const CONTACT_FORM = leadForm({ id: "Contact Us Form", tags: ["website_contact", "service_{service_requested|general}"], submit: "Request My 15-Minute Fit Call",
  success: "Request received. Expect a personal reply within 1 business day. If a call is the right next step, we’ll include a booking link.",
  note: "We’ll use your details only to respond to this request. Marketing updates are optional.",
  fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name", placeholder: "John" }, { name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", placeholder: "Doe" },
    { name: "email", label: "Email Address", type: "email", required: true, autocomplete: "email", placeholder: "john@example.com" }, { name: "phone", label: "Phone Number (Optional)", type: "tel", autocomplete: "tel", placeholder: "(555) 123-4567" },
    { name: "service_requested", label: "What are you looking for? (Optional)", type: "select", options: [["marketing", "Marketing & Lead Gen"], ["seo", "SEO & Local Search"], ["website", "Website Development"], ["automation", "CRM & Automation (CasperPortal)"], ["va", "Virtual Assistants"], ["cybersecurity", "Cybersecurity & IT"], ["other", "Other / Not Sure"]] },
    { name: "calendar_notes", label: "What would you like help with?", type: "textarea", required: true, placeholder: "Tell us what is leaking time or revenue..." }] });
const PAGE_FORMS = {
  "/contact": () => CONTACT_FORM,
  "/newsletter": () => leadForm({ id: "Newsletter Subscription - Archive Page", tags: ["newsletter_subscriber"], submit: "Subscribe Now", success: "Subscribed! You'll receive our next growth insights email.", note: "Unsubscribe at any time.",
    fields: [{ name: "first_name", label: "First Name", autocomplete: "given-name" }, { name: "email", label: "Email Address", type: "email", required: true, autocomplete: "email" }] }),
  "/seo-audit": () => leadForm({ id: "SEO Audit Page", tags: ["website_seo_audit"], submit: "Get My Free SEO Audit", success: "Request received. Expect a personal reply within 1 business day.",
    fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "last_name", label: "Last Name", autocomplete: "family-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "phone", label: "Phone", type: "tel", autocomplete: "tel" }, { name: "website", label: "Website URL", type: "url", required: true, placeholder: "https://" }, { name: "primary_goal", label: "Primary goal", type: "textarea" }] }),
  "/affiliate": () => leadForm({ id: "Partner Program Application", submit: "Submit Application", success: "Application submitted successfully! We'll review and get back to you within 24 hours.",
    fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "last_name", label: "Last Name", required: true, autocomplete: "family-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "phone", label: "Phone", type: "tel", autocomplete: "tel" }, { name: "website", label: "Website or social profile", type: "url" }, { name: "contact.promotion_strategy", label: "How will you promote CasperB2B?", type: "textarea", required: true }] }),
  "/cybersecurity-hesitancy": () => leadForm({ id: "Security Checklist Download", submit: "Send Me the Checklist", success: "Checklist sent to your inbox!",
    fields: [{ name: "first_name", label: "Name", required: true, autocomplete: "given-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "phone", label: "Phone", type: "tel", autocomplete: "tel" }] }),
  "/strategy/marketing": () => leadForm({ id: "Marketing PDF Download", submit: "Send Me the PDF", success: "Sent! Check your inbox.", fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }] }),
  "/strategy/sales": () => leadForm({ id: "Sales PDF Download", submit: "Send Me the PDF", success: "Sent! Check your inbox.", fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }] }),
  "/strategy/seo": () => leadForm({ id: "SEO Audit Widget", submit: "Get My Free SEO Audit", success: "Request received. Expect a personal reply within 1 business day.", fields: [{ name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "website", label: "Website URL", type: "url", required: true, placeholder: "https://" }] }),
};
function placeForms(p, html) {
  return html.replace(/<div data-form="(\w+)"><\/div>/g, (all, kind) => {
    if (PAGE_FORMS[p]) return PAGE_FORMS[p]();
    if (kind === "newsletter") return newsletterForm("Blog Newsletter Signup", ["newsletter_subscriber"], "pg");
    return "";
  });
}

// ── related links (every page ends with at least three in-content links to related pages) ──
const all = [...KEEP].filter((p) => !["/thank-you"].includes(p));
const family = (p) => {
  const f = (re) => all.filter((x) => re.test(x));
  if (p.startsWith("/services/") || p === "/ai-services") return f(/^\/services\/|^\/ai-services$/);
  if (p.startsWith("/casper-va/")) return f(/^\/casper-va\/./);
  if (p.startsWith("/problems/")) return f(/^\/problems\/./);
  if (p.startsWith("/niches/")) return f(/^\/niches\/./);
  if (isPost(p)) return all.filter(isPost);
  if (p.startsWith("/tools/")) return f(/^\/tools\/./);
  if (p.startsWith("/integrations/")) return f(/^\/integrations\/./);
  if (p.startsWith("/strategy/")) return f(/^\/strategy\/./);
  return ["/pricing", "/software/casperportal", "/casper-va", "/services", "/contact", "/blog"];
};
const parentHub = (p) => { const seg = "/" + p.split("/")[1]; return HUBS[seg] && seg !== p ? seg : null; };
function related(p) {
  const fam = family(p).filter((x) => x !== p);
  const i = Math.max(0, family(p).indexOf(p));
  const pick = [];
  for (let k = 0; k < fam.length && pick.length < 3; k++) pick.push(fam[(i + k) % fam.length]);
  const hub = parentHub(p); if (hub && !pick.includes(hub)) pick.push(hub);
  if (pick.length < 3) for (const x of ["/pricing", "/services", "/contact", "/casper-va"]) if (x !== p && !pick.includes(x) && pick.length < 4) pick.push(x);
  return `<section class="related"><h2>Keep exploring</h2><div class="grid g${Math.min(pick.length, 4)}">${pick.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(clip(fitDesc(BY[x]?.desc || ""), 120))}</p></a>`).join("")}</div></section>`;
}

// ── page-specific bodies ──
function blogIndex(html) {
  const hero = (html.match(/^<section>[\s\S]*?<\/section>/) || [""])[0];
  const posts = all.filter(isPost).map((p) => {
    const h = BY[p].html; const date = (h.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/) || [""])[0];
    return { p, date, t: date ? Date.parse(date) : 0 };
  }).sort((a, b) => b.t - a.t || a.p.localeCompare(b.p));
  const card = ({ p, date }) => `<a class="card-link" href="${p}"><h3>${esc(clean(BY[p].h1))}</h3><p>${esc(fitDesc(BY[p].desc || firstPara(BY[p].html)))}</p>${date ? `<p class="fine">${esc(date)}</p>` : ""}</a>`;
  return hero + `<section><h2>Guides and articles</h2><div class="grid g3">${posts.filter((x) => x.p.startsWith("/blog/")).map(card).join("")}</div></section>`
    + `<section><h2>Founder essays</h2><p>Leadership, motivation and execution, from Jared Casper.</p><div class="grid g3">${posts.filter((x) => !x.p.startsWith("/blog/")).map(card).join("")}</div></section>`;
}
function htmlSitemap(html) {
  const hero = "<section>" + ((html.match(/<h1>[\s\S]*?<\/h1>(?:<p>[\s\S]*?<\/p>)?/) || ["<h1>Sitemap</h1>"])[0]) + "</section>";
  const groups = [["Company", (p) => ["/", "/about-us", "/our-team", "/our-process", "/author/jared-casper", "/mark-casper", "/contact", "/news", "/newsletter", "/portfolio", "/the-49k-story", "/affiliate", "/affiliate-terms", "/affiliate-kit", "/brand-kit", "/privacy", "/terms"].includes(p)],
    ["Software & pricing", (p) => /^\/(software|compare|pricing|setup|agreement-builder|integrations|features|carsalessoftware-setup)/.test(p)], ["Virtual assistants", (p) => p.startsWith("/casper-va")],
    ["Services", (p) => /^\/(services|ai-services|seo-audit|solutions|strategy|georgetown-ma|service-areas|serious-business-owners|cybersecurity-hesitancy)/.test(p)], ["Problems we solve", (p) => p.startsWith("/problems")],
    ["Industries", (p) => p.startsWith("/niches")], ["Free tools", (p) => p.startsWith("/tools") || p === "/quiz"], ["Blog & guides", (p) => isPost(p) || ["/blog", "/glossary"].includes(p)]];
  const used = new Set();
  let out = hero;
  for (const [name, test] of groups) { const items = all.filter((p) => test(p) && !used.has(p) && p !== "/sitemap"); items.forEach((p) => used.add(p)); out += `<section><h2>${name}</h2><ul class="cols-list">${items.map((p) => `<li><a href="${p}">${esc(shortName(p))}</a></li>`).join("")}</ul></section>`; }
  const rest = all.filter((p) => !used.has(p) && p !== "/sitemap");
  if (rest.length) out += `<section><h2>More</h2><ul>${rest.map((p) => `<li><a href="${p}">${esc(shortName(p))}</a></li>`).join("")}</ul></section>`;
  return out;
}

// ── schema ──
const JARED = { "@type": "Person", "@id": `${SITE}/author/jared-casper#person`, name: "Jared Casper", url: `${SITE}/author/jared-casper` };
function faqSchema(html) {
  const qs = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => [strip(m[1]), strip(m[2])]).filter(([q, a]) => q && a);
  return qs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;
}
function schemaFor(p, html, title, desc) {
  const s = [];
  if (p === "/") s.push({ "@context": "https://schema.org", ...ORG }, { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE + "/", name: NAME, publisher: ORG_REF, inLanguage: "en-US" });
  if (isPost(p)) {
    const date = (html.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/) || [])[0];
    const iso = date ? new Date(date + " 12:00 UTC").toISOString().slice(0, 10) : undefined;
    const img = (html.match(/<img src="([^"]+)"/) || [])[1];
    s.push({ "@context": "https://schema.org", "@type": "BlogPosting", headline: clean(BY[p].h1).slice(0, 110), description: desc, url: SITE + p, mainEntityOfPage: SITE + p, author: JARED, publisher: ORG_REF, ...(iso ? { datePublished: iso } : {}), image: SITE + (img || "/og.png"), inLanguage: "en-US" });
  }
  if (p === "/author/jared-casper") s.push({ "@context": "https://schema.org", ...JARED, jobTitle: "Founder", worksFor: ORG_REF, sameAs: ["https://www.linkedin.com/in/jaredcasper94/", "https://www.facebook.com/jaredcasper94/"], image: SITE + "/img/jared-casper.webp" });
  if (p === "/mark-casper") s.push({ "@context": "https://schema.org", "@type": "Person", "@id": `${SITE}/mark-casper#person`, name: "Mark Casper", url: SITE + p, worksFor: ORG_REF });
  if (/^\/services\/[^/]+$/.test(p) || p === "/ai-services") s.push({ "@context": "https://schema.org", "@type": "Service", name: shortName(p), description: desc, url: SITE + p, provider: ORG_REF, areaServed: { "@type": "Country", name: "United States" } });
  const faq = faqSchema(html); if (faq) s.push(faq);
  return s;
}

// ── build every page ──
const titles = new Map(), descs = new Map(), report = [];
for (const P of PAGES) {
  const p = P.path;
  let html = applyEdits(p, P.html);
  if (p === "/blog") html = blogIndex(html);
  if (TOOLS[p]) html = toolPage(p, html);
  html = placeForms(p, html);
  html = polish(rewriteMedia(rewriteLinks(html)));
  if (p === "/sitemap") html = htmlSitemap(html);
  imgCount = 0;
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new Error(`${p}: ${h1s} h1`);
  let title = makeTitle(p).find((t) => !titles.has(t)) || makeTitle(p)[0];
  if (titles.has(title)) throw new Error(`duplicate title ${title} (${p}, ${titles.get(title)})`);
  titles.set(title, p);
  let desc = makeDesc(p, html);
  if (descs.has(desc)) desc = fitDesc(firstPara(html) || title);
  if (descs.has(desc)) throw new Error(`duplicate description on ${p} and ${descs.get(desc)}`);
  descs.set(desc, p);
  const crumbs = [["Home", "/"]];
  const segs = p.split("/").filter(Boolean);
  for (let i = 1; i < segs.length; i++) { const pre = "/" + segs.slice(0, i).join("/"); if (KEEP.has(pre)) crumbs.push([shortName(pre), pre]); }
  if (p !== "/") crumbs.push([shortName(p), p]);
  const body = `<div class="content${isPost(p) ? " article" : ""}">${html}${["/", "/thank-you"].includes(p) ? "" : related(p)}</div>`;
  const noindex = p === "/thank-you";
  write(p, page({ path: p, title, desc, body, crumbs: p === "/" ? null : crumbs, noindex, ogType: isPost(p) ? "article" : "website", schema: schemaFor(p, html, title, desc) }));
  report.push([p, title.length, desc.length]);
}

// ── redirects for every stub / duplicate / merged URL from the old site ──
for (const [from, to] of Object.entries(REDIRECTS)) { if (KEEP.has(from)) continue; write(from, redirect(to)); }

// ── 404 ──
writeFileSync(join(OUT, "404.html"), page({ path: "/404", title: "Page Not Found | CasperB2B", desc: "We couldn't find the page you're looking for. Let's get you back on track to scaling your business.", noindex: true,
  body: `<div class="content"><section><p class="eyebrow">404</p><h1>Page not found</h1><p>We couldn't find the page you're looking for. Let's get you back on track to scaling your business.</p><p class="ctas"><a class="btn" href="/">Return Home</a> <a class="btn ghost" href="/contact">Contact Support</a></p></section><section><h2>Popular pages</h2><div class="grid g3">${[["Services", "/services", "Explore what we do"], ["CasperPortal", "/software/casperportal", "Our all-in-one CRM"], ["Casper VAs", "/casper-va", "Hire a dedicated VA"], ["Free Tools", "/tools", "Audits, calculators & more"], ["Pricing", "/pricing", "Plans and setup options"], ["Contact", "/contact", "Get in touch with us"]].map(([n, h, d]) => `<a class="card-link" href="${h}"><h3>${n}</h3><p>${d}</p></a>`).join("")}</div></section></div>` }).replace(/<link rel="canonical"[^>]*>/, ""));

// ── sitemap.xml, robots.txt, llms.txt, CNAME, url list for IndexNow ──
const list = urls.filter(([p]) => p !== "/404");
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map(([p, d]) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `# casperb2b.com — everyone welcome, including AI search and answer engines\nUser-agent: *\nAllow: /\n\n${["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"].map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(OUT, "CNAME"), "casperb2b.com\n");
mkdirSync(join(ROOT, "data"), { recursive: true });
writeFileSync(join(ROOT, "data/urls.txt"), list.map(([p]) => SITE + (p === "/" ? "/" : p)).join("\n") + "\n");
const llms = readFileSync(ROOT + "content/llms.txt", "utf8");
for (const m of llms.matchAll(/\]\(https:\/\/casperb2b\.com([^)]*)\)/g)) { const p = m[1].replace(/\/$/, "") || "/"; if (!KEEP.has(p)) throw new Error("llms.txt links to a page that is not built: " + p); }
writeFileSync(join(OUT, "llms.txt"), llms);

const long = report.filter(([, t, d]) => t > 60 || d > 155);
if (long.length) throw new Error("title/description too long: " + JSON.stringify(long));
console.log(`built ${PAGES.length} pages, ${Object.keys(REDIRECTS).length} redirects, sitemap ${list.length} URLs → dist/`);
