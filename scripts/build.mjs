// Builds casperb2b.com into dist/ (static, GitHub Pages): node scripts/build.mjs
// content/pages.json   = page bodies (live-site capture + pages migrated from the newer source, see README);
// data/keywords.json   = keyword plan per page (primary keyword, title, meta, H1, answer-first intro, cluster, next steps, FAQ);
// data/content-edits.json = exact find/replace corrections per page (invented stats, our prices, placeholders, dead CTAs);
// data/redirects.json  = old URL → new URL (served as redirect pages); data/images.json = image URL → local copy.
// Also writes KEYWORDS.md and LINKS.md (generated from the same data) and fails on anything that would ship broken.
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, NAME, OUT, TODAY, PHONE_TEL, ORG, ORG_REF, NAV, urls, write, page, redirect, esc, strip, leadForm, newsletterForm } from "./lib.mjs";
import { TOOLS, toolPage } from "./tools.mjs";
import { CLUSTERS, MENU, BOOK, clusterOf, primaryCta, nextSteps, nextBlock, stickyCta, TRUST, isPost, isQuestion } from "./ia.mjs";
import { PRICING, AGREEMENT, HUBS, FAQ_HUB } from "./pages-extra.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url)).split("\\").join("/");
const read = (f, d) => existsSync(ROOT + f) ? JSON.parse(readFileSync(ROOT + f, "utf8")) : d;
const PAGES = read("content/pages.json");
const REDIRECTS = read("data/redirects.json");
const IMAGES = read("data/images.json");
const KW = read("data/keywords.json", {});
const CEDITS = read("data/content-edits.json", {});
const NOINDEX = new Set(["/thank-you", "/agreement-builder"]);

// ── pages that are written here rather than captured ──
const byPath = Object.fromEntries(PAGES.map((p) => [p.path, p]));
byPath["/pricing"] = { ...(byPath["/pricing"] || { path: "/pricing" }), title: PRICING.title, desc: PRICING.desc, h1: PRICING.h1, html: PRICING.html, hand: true };
byPath["/agreement-builder"] = { ...(byPath["/agreement-builder"] || { path: "/agreement-builder" }), title: AGREEMENT.title, desc: AGREEMENT.desc, h1: AGREEMENT.h1, html: AGREEMENT.html, hand: true };
for (const [p, h] of Object.entries(HUBS)) byPath[p] = { path: p, title: h.title, desc: h.desc, h1: h.h1, html: "", hub: true };
byPath["/faq"] = { path: "/faq", title: FAQ_HUB.title, desc: FAQ_HUB.desc, h1: FAQ_HUB.h1, html: "", hub: true };
for (const [p, h] of [...Object.entries(HUBS), ["/faq", FAQ_HUB]]) KW[p] = { keyword: h.keyword, title: h.title, desc: h.desc, h1: h.h1, intro: h.intro, cluster: h.cluster || "resources", ...(KW[p] || {}) };
KW["/pricing"] = { cluster: "about", ...(KW["/pricing"] || {}), title: PRICING.title, desc: PRICING.desc, h1: PRICING.h1, intro: null };
KW["/agreement-builder"] = { cluster: "about", noindex: true };
const ALL = Object.values(byPath);
const BY = byPath;
const KEEP = new Set(ALL.map((p) => p.path));
for (const p of Object.keys(REDIRECTS)) if (KEEP.has(p)) delete REDIRECTS[p];

rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
cpSync(ROOT + "static/", OUT, { recursive: true });

// redirect chains resolve to their final page (no hops, no redirect into a missing page)
function finalTarget(to, seen = new Set()) {
  const p = (to.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/");
  if (KEEP.has(p)) return to;
  if (REDIRECTS[p] && !seen.has(p)) { seen.add(p); return finalTarget(REDIRECTS[p], seen); }
  throw new Error(`redirect ends at a page that is not built: ${to}`);
}
for (const k of Object.keys(REDIRECTS)) REDIRECTS[k] = finalTarget(REDIRECTS[k]);

const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();
const clip = (s, n) => s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "") + "…";
const CL = (p) => clusterOf(p, KW);

// menu + footer from the IA (every item must be a built page)
for (const [k, items] of MENU) for (const [, h] of items) if (!KEEP.has(h)) throw new Error(`menu links to a page that is not built: ${h}`);
NAV.menus = MENU.map(([k, items]) => [CLUSTERS[k].name, items]);
NAV.footer = MENU.map(([k, items]) => [CLUSTERS[k].name, items.slice(0, 5)]);
const NAVNAME = new Map(MENU.flatMap(([, items]) => items).map(([n, h]) => [h, n]));

// ── names, titles, descriptions ──
const HUBNAME = Object.fromEntries(Object.values(CLUSTERS).map((c) => [c.hub, c.name]));
const shortName = (p) => p === "/" ? "Home" : HUBNAME[p] || NAVNAME.get(p) || clean(KW[p]?.h1 || BY[p]?.h1 || p).replace(/[.:]$/, "").slice(0, 70);
const TITLE_OVERRIDE = {
  "/": "CasperB2B | Marketing, Automation & Cybersecurity",
  "/contact": "Contact CasperB2B | Request a 15-Minute Fit Call",
};
function makeTitle(p) {
  if (KW[p]?.title) return [KW[p].title];
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
  fit.push(i > 30 ? cut.slice(0, i + (cut[i] === "?" ? 1 : 0)).trim() : cut.replace(/\s+\S*$/, "").replace(/[,:;—–-]$/, "").trim());
  return fit;
}
function firstPara(html) { const m = html.match(/<p(?: class="(?!eyebrow)[^"]*")?>([\s\S]*?)<\/p>/g) || []; for (const x of m) { const t = strip(x); if (t.length > 60) return t; } return ""; }
function fitDesc(d) {
  d = clean(d); if (d.length <= 155) return d;
  const cut = d.slice(0, 155); const s = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (s >= 80) return cut.slice(0, s + 1);
  return cut.slice(0, 152).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "") + "…";
}
function makeDesc(p, html) {
  if (KW[p]?.desc) return fitDesc(KW[p].desc);
  let d = clean(BY[p].desc);
  if (!d || /^CasperB2B protects small businesses from cyber threats/.test(d) && p !== "/") d = firstPara(html);
  return fitDesc(d);
}
const cardDesc = (p) => clip(fitDesc(KW[p]?.desc || BY[p]?.desc || firstPara(BY[p]?.html || "")).replace(/…$/, ""), 130) || clip(fitDesc(KW[p]?.desc || BY[p]?.desc || firstPara(BY[p]?.html || "")), 130);

// ── link + media rewriting ──
const STATIC_OK = (p) => existsSync(join(ROOT, "static", p)) || /^\/(sitemap\.xml|robots\.txt|llms\.txt)$/.test(p);
function resolve(href) {
  let h = (href || "").replace(/&amp;/g, "&").trim();
  if (!h || h.startsWith("#")) return { kind: "same", href: h };
  if (/^tel:/i.test(h)) return { kind: "ext", href: "tel:" + PHONE_TEL };
  if (/^(mailto|sms):/i.test(h)) return { kind: "ext", href: h };
  const m = h.match(/^https?:\/\/(www\.)?casperb2b\.com(.*)$/i); if (m) h = m[2] || "/";
  if (/^https?:\/\/(www\.)?casperportal\.com/i.test(h)) return { kind: "gone" }; // one sister-product link only: the footer
  if (/^https?:/i.test(h)) return { kind: "ext", href: h };
  if (!h.startsWith("/")) h = "/" + h;
  const [pq, hash] = h.split("#"); const q = pq.includes("?") ? "?" + pq.split("?")[1] : ""; let p = pq.split("?")[0].replace(/\/+$/, "") || "/";
  if (p === "/agreement-builder") return { kind: "gone" }; // locked: never linked from content
  if (KEEP.has(p)) return { kind: "page", href: p + (p === BOOK ? q : "") + (hash ? "#" + hash : "") };
  if (REDIRECTS[p]) return { kind: "moved", href: REDIRECTS[p] };
  if (STATIC_OK(p)) return { kind: "page", href: p };
  return { kind: "gone" };
}
const extAttrs = (h) => /^https?:/.test(h) ? ' rel="noopener"' : "";
function rewriteLinks(html) {
  html = html.replace(/<a class="card-link" href="([^"]*)">([\s\S]*?)<\/a>/g, (all, href, inner) => {
    const r = resolve(href);
    if (r.kind === "page" || r.kind === "ext" || r.kind === "same" || r.kind === "moved") return `<a class="card-link" href="${esc(r.href)}"${extAttrs(r.href)}>${inner}</a>`;
    if (/<h[2-4]>/.test(inner)) return "";
    return `<div class="card">${inner}</div>`;
  });
  // links: <a href> with attributes in either order
  html = html.replace(/<a((?:\s+(?:class|data-cta)="[^"]*")*)\s+href="([^"]*)"((?:\s+(?:class|data-cta)="[^"]*")*)>([\s\S]*?)<\/a>/g, (all, pre, href, post, inner) => {
    const r = resolve(href);
    if (r.kind === "gone") return /class="[^"]*btn/.test(pre + post) ? "" : inner;
    return `<a href="${esc(r.href)}"${pre}${post}${extAttrs(r.href)}>${inner}</a>`;
  });
  return html.replace(/<p class="ctas">\s*<\/p>/g, "");
}
let imgCount = 0;
function rewriteMedia(html) {
  html = html.replace(/<img src="([^"]*)" alt="([^"]*)"[^>]*>/g, (all, src, alt) => {
    const m = IMAGES[src.replace(/&amp;/g, "&")] || (src.startsWith("/img/") ? { src, w: 0, h: 0 } : null); if (!m) return "";
    const eager = imgCount++ === 0;
    return `<img src="${m.src}" alt="${alt}"${m.w ? ` width="${m.w}" height="${m.h}"` : ""}${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  });
  html = html.replace(/<video src="([^"]*)" poster="([^"]*)"><\/video>/g, (all, src, poster) => {
    const pm = IMAGES[poster.replace(/&amp;/g, "&")];
    return `<div class="video"><video controls preload="none" playsinline src="${src}"${pm ? ` poster="${pm.src}"` : ""} aria-label="CasperB2B overview video"></video></div>`;
  });
  html = html.replace(/<iframe src="([^"]*)" title="([^"]*)"><\/iframe>/g, (all, src, title) => {
    if (/youtube\.com\/embed/.test(src)) return `<div class="embed"><iframe src="${src}" title="${title || "YouTube video"}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    if (/agreement-builder/.test(src)) return ""; // the agreement builder is locked
    return `<div class="embed tall"><iframe src="${src}" title="${title || "Embedded content"}" loading="lazy"></iframe></div>`;
  });
  return html;
}
function polish(html) {
  html = html.replace(/<p>By Jared Casper<\/p>(?:<p>•<\/p>)?<p>(Last updated: [^<]+)<\/p>/g, '<p class="byline">By <a href="/author/jared-casper">Jared Casper</a> · $1</p>');
  html = html.replace(/<a class="card-link" href="\/author\/jared-casper">(?:<img [^>]*>)?<p class="eyebrow">Jared Casper<\/p><\/a>((?:<p class="eyebrow">[^<]{3,30}<\/p>){0,2})/g, (all, rest) => `<p class="byline">By <a href="/author/jared-casper">Jared Casper</a>${[...rest.matchAll(/<p class="eyebrow">([^<]+)<\/p>/g)].map((m) => " · " + m[1]).join("")}</p>`);
  html = html.replace(/<p>(?:\d{1,2}\.?|•)<\/p>/g, "");
  html = html.replace(/<p class="ctas">(\s*)<a href="([^"]*)">/g, '<p class="ctas">$1<a class="btn" href="$2">');
  html = html.replace(/<p>(<a href="[^"]*">[^<]{2,60}<\/a>)<\/p>/g, (all, a) => /Request|Book|Get |Start|Talk|Schedule|Build|Discuss|Apply|Join|Download/i.test(a) ? `<p class="ctas">${a.replace("<a ", '<a class="btn" ')}</p>` : all);
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap" tabindex="0" role="region" aria-label="Comparison table"><table>$1</table></div>');
  html = html.replace(/<div class="grid (g\d)">((?:<a class="card-link" href="[^"]*"(?: rel="noopener")?><img [^>]*><\/a>)+)<\/div>/g, '<div class="grid $1 logos">$2</div>');
  html = html.replace(/<a class="card-link" href="((?:tel|mailto):[^"]*)"><p>([^<]+)<\/p><\/a>/g, '<p class="contact-line"><a href="$1">$2</a></p>');
  html = html.replace(/<div class="grid (g\d)">((?:<div class="card">(?:<p(?: class="eyebrow")?>[^<]{1,24}<\/p>){1,2}<\/div>)+)<\/div>/g, '<div class="grid $1 mini">$2</div>');
  html = html.replace(/(?:<p>[^<.:?!]{2,32}<\/p>){3,}/g, (run) => `<ul class="tags">${[...run.matchAll(/<p>([^<]+)<\/p>/g)].map((m) => `<li>${m[1]}</li>`).join("")}</ul>`);
  return html;
}
/** One primary CTA per page: buttons that book go to the page's booking link; every other button becomes secondary. */
function oneCta(html, cta) {
  return html.replace(/<a href="([^"]*)" class="btn( ghost| alt)?"([^>]*)>/g, '<a class="btn$2" href="$1"$3>').replace(/<a class="btn( ghost| alt)?" href="([^"]*)"((?: data-cta="[^"]*")?)/g, (all, kind, href, rest) => {
    if (href.startsWith(BOOK) && cta) return `<a class="btn" href="${href === BOOK ? cta.href : href}" data-cta="content"`;
    return `<a class="btn ghost" href="${href}"${rest}`;
  });
}

// ── content corrections ──
function applyContentEdits(p, html) {
  for (const e of CEDITS[p] || []) {
    const n = html.split(e.find).length - 1;
    if (n !== 1) throw new Error(`content edit on ${p} matched ${n} times: ${e.find.slice(0, 90)}`);
    html = html.replace(e.find, () => e.replace);
  }
  return html;
}
// Owner decision: CasperB2B's own prices are not shown anywhere (kept privately in _private/prices.md).
const OUR_PRICES = [/\$297\b/, /\$1,?097\b/, /\$399\s*\/\s*mo/, /\$199\s*\/\s*mo/, /\$1,500 one-time setup/, /\$3,500 one-time setup/, /VA rates start at/, /flat rate of \$\d/, /Monthly Investment/];
const VA_PRICE = /\$\d[\d,]*\s*(?:\/\s*mo\b|per month)/;
function priceGuard(p, html) {
  const text = strip(html);
  for (const re of OUR_PRICES) if (re.test(text)) throw new Error(`${p}: shows a CasperB2B price (${re}) — prices are hidden`);
  if (/^\/(casper-va|pricing|done-for-you|onboarding|caspercare|$)/.test(p) && VA_PRICE.test(text)) throw new Error(`${p}: shows a monthly price: ${text.match(VA_PRICE)[0]}`);
}
function keywordize(p, html) {
  const k = KW[p] || {};
  if (k.h1) {
    const cur = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1];
    if (cur !== undefined && strip(cur) !== clean(k.h1)) html = html.replace(/<h1>[\s\S]*?<\/h1>/, () => `<h1>${esc(clean(k.h1))}</h1>`);
  }
  if (k.intro) html = html.replace(/(<h1>[\s\S]*?<\/h1>)/, (h) => `${h}<p class="answer">${esc(clean(k.intro))}</p>`);
  if (k.faq?.length && !/<details>/.test(html)) html += `<section><h2>Frequently asked questions</h2>${k.faq.map(({ q, a }) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>`;
  return html;
}

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
    fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "website", label: "Website URL", type: "url", required: true, placeholder: "https://" }, { name: "primary_goal", label: "Primary goal (optional)", type: "textarea" }] }),
  "/affiliate": () => leadForm({ id: "Partner Program Application", submit: "Submit Application", success: "Application submitted successfully! We'll review and get back to you within 24 hours.",
    fields: [{ name: "first_name", label: "First Name", required: true, autocomplete: "given-name" }, { name: "last_name", label: "Last Name", required: true, autocomplete: "family-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "phone", label: "Phone", type: "tel", autocomplete: "tel" }, { name: "website", label: "Website or social profile", type: "url" }, { name: "contact.promotion_strategy", label: "How will you promote CasperB2B?", type: "textarea", required: true }] }),
  "/cybersecurity-hesitancy": () => leadForm({ id: "Security Checklist Download", submit: "Send Me the Checklist", success: "Checklist sent to your inbox!",
    fields: [{ name: "first_name", label: "Name", required: true, autocomplete: "given-name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }] }),
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

// ── related links (siblings in the same topic) ──
const all = [...KEEP].filter((p) => !NOINDEX.has(p) && !["/privacy", "/terms", "/affiliate-terms", "/sitemap"].includes(p));
const family = (p) => {
  const f = (re) => all.filter((x) => re.test(x));
  if (/-georgetown-ma$|^\/georgetown-ma$/.test(p)) return f(/-georgetown-ma$|^\/georgetown-ma$/);
  if (p.startsWith("/services/") || p === "/ai-services") return f(/^\/services\/|^\/ai-services$/).filter((x) => CL(x) === CL(p)).concat(f(/^\/services\//).filter((x) => CL(x) !== CL(p)));
  if (p.startsWith("/casper-va/")) return f(/^\/casper-va\/./);
  if (p.startsWith("/problems/")) return f(/^\/problems\/./);
  if (p.startsWith("/niches/")) return f(/^\/niches\/./);
  if (isQuestion(p)) return all.filter((x) => isQuestion(x) && CL(x) === CL(p)).concat(all.filter((x) => isQuestion(x) && CL(x) !== CL(p)));
  if (isPost(p)) return all.filter((x) => isPost(x) && CL(x) === CL(p)).concat(all.filter((x) => isPost(x) && CL(x) !== CL(p)));
  if (p.startsWith("/tools/")) return f(/^\/tools\/./);
  if (p.startsWith("/strategy/")) return f(/^\/strategy\/./);
  return all.filter((x) => CL(x) === CL(p));
};
function relatedPicks(p, exclude) {
  const fam = family(p).filter((x) => x !== p && !exclude.has(x));
  const i = Math.max(0, family(p).indexOf(p));
  const pick = [];
  for (let k = 0; k < fam.length && pick.length < 3; k++) pick.push(fam[(i + k) % fam.length]);
  const hub = CLUSTERS[CL(p)]?.hub; if (hub && hub !== p && KEEP.has(hub) && !pick.includes(hub) && !exclude.has(hub)) pick.push(hub);
  for (const x of ["/services", "/how-to-get-more-customers", "/tools", "/blog"]) if (pick.length < 3 && x !== p && !pick.includes(x) && !exclude.has(x)) pick.push(x);
  return pick;
}
const related = (p, picks) => picks.length ? `<section class="related"><h2>Related in ${esc(CLUSTERS[CL(p)]?.name || "this topic")}</h2><div class="grid g${Math.min(picks.length, 4)}">${picks.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div></section>` : "";

// ── hubs ──
const kind = (x) => x.startsWith("/tools") || x === "/quiz" ? "Free tools" : /^\/(services|ai-services|seo-audit|caspercare|done-for-you)|-georgetown-ma$|^\/casper-va\/(?!hiring|vs-agency)/.test(x) ? "Services" : isQuestion(x) ? "Questions answered" : isPost(x) ? "Guides & articles" : /^\/problems/.test(x) ? "Problems we fix" : /^\/niches/.test(x) ? "Industries" : "More";
const KIND_ORDER = ["Services", "Questions answered", "Problems we fix", "Industries", "Free tools", "Guides & articles", "More"];
function clusterListing(cluster, self) {
  const members = all.filter((x) => CL(x) === cluster && x !== self && x !== "/");
  const groups = KIND_ORDER.map((k) => [k, members.filter((x) => kind(x) === k)]).filter(([, xs]) => xs.length);
  return `<section class="hub-group"><h2>Everything in ${esc(CLUSTERS[cluster].name)}</h2>${groups.map(([k, xs]) => `<h3>${k}</h3><div class="grid g3">${xs.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div>`).join("")}</section>`;
}
function hubHtml(p) {
  const h = HUBS[p], c = CLUSTERS[h.cluster];
  const start = (MENU.find(([k]) => k === h.cluster) || [, []])[1].filter(([, x]) => x !== p);
  return `<section><p class="eyebrow">${esc(c.name)}</p><h1>${esc(h.h1)}</h1><p class="ctas"><a class="btn" href="${BOOK}">Book My 15-Minute Fit Call</a></p></section>`
    + `<section><h2>Start here</h2><div class="grid g4">${start.map(([n, x]) => `<a class="card-link" href="${x}"><h3>${esc(n)}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div></section>`;
}
function faqHub() {
  const seen = new Set(), groups = {};
  const order = ["customers", "marketing", "ai", "cyber", "va", "tools", "resources", "about"];
  const pages = all.filter((x) => !["/faq", "/glossary", "/blog"].includes(x)).sort((a, b) => (isQuestion(b) - isQuestion(a)) || a.localeCompare(b));
  for (const x of pages) {
    const src = BY[x].html + (KW[x]?.faq?.length ? KW[x].faq.map(({ q, a }) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("") : "");
    const html = applyContentEdits(x, BY[x].hub ? "" : BY[x].html === src ? src : src);
    for (const m of html.matchAll(/<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)) {
      const q = strip(m[1]), a = strip(m[2]); const key = q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!q || !a || seen.has(key) || /\$\d/.test(a) || a.length < 40) continue;
      const c = CL(x); (groups[c] ||= []);
      if (groups[c].length >= 10) continue;
      seen.add(key); groups[c].push({ q, a: clip(a, 320), x });
    }
  }
  return `<section><p class="eyebrow">FAQ</p><h1>${esc(FAQ_HUB.h1)}</h1><p class="ctas">${order.filter((c) => groups[c]).map((c) => `<a href="#${c}">${esc(CLUSTERS[c].name)}</a>`).join(" · ")}</p></section>`
    + order.filter((c) => groups[c]).map((c) => `<section class="faq-group"><h2 id="${c}">${esc(CLUSTERS[c].name)}</h2>${groups[c].map(({ q, a, x }) => `<details><summary>${esc(q)}</summary><p>${esc(a)} <a href="${x}">Full answer: ${esc(shortName(x))} →</a></p></details>`).join("")}</section>`).join("");
}

// ── page-specific bodies ──
function blogIndex(html) {
  const hero = (html.match(/^<section>[\s\S]*?<\/section>/) || [""])[0];
  const posts = all.filter(isPost).map((p) => {
    const h = BY[p].html; const date = (h.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/) || [""])[0];
    return { p, date, t: date ? Date.parse(date) : 0 };
  }).sort((a, b) => b.t - a.t || a.p.localeCompare(b.p));
  const card = ({ p, date }) => `<a class="card-link" href="${p}"><h3>${esc(shortName(p))}</h3><p>${esc(cardDesc(p))}</p>${date ? `<p class="fine">${esc(date)}</p>` : ""}</a>`;
  return hero + `<section><h2>Guides and articles</h2><div class="grid g3">${posts.filter((x) => x.p.startsWith("/blog/")).map(card).join("")}</div></section>`
    + `<section><h2>Founder essays</h2><p>Leadership, motivation and execution, from Jared Casper.</p><div class="grid g3">${posts.filter((x) => !x.p.startsWith("/blog/")).map(card).join("")}</div></section>`
    + `<section><h2>Questions small business owners ask</h2><div class="grid g3">${all.filter(isQuestion).map((p) => `<a class="card-link" href="${p}"><h3>${esc(shortName(p))}</h3><p>${esc(cardDesc(p))}</p></a>`).join("")}</div></section>`;
}
function htmlSitemap(html) {
  const hero = "<section>" + ((html.match(/<h1>[\s\S]*?<\/h1>(?:<p>[\s\S]*?<\/p>)?/) || ["<h1>Sitemap</h1>"])[0]) + "</section>";
  return hero + Object.entries(CLUSTERS).map(([k, c]) => { const items = all.filter((p) => CL(p) === k && p !== "/sitemap"); return items.length ? `<section><h2>${esc(c.name)}</h2><ul class="cols-list">${items.map((p) => `<li><a href="${p}">${esc(shortName(p))}</a></li>`).join("")}</ul></section>` : ""; }).join("")
    + `<section><h2>Legal</h2><ul class="cols-list"><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li><li><a href="/affiliate-terms">Affiliate terms</a></li></ul></section>`;
}

// ── schema ──
const JARED = { "@type": "Person", "@id": `${SITE}/author/jared-casper#person`, name: "Jared Casper", url: `${SITE}/author/jared-casper` };
function faqSchema(html) {
  const qs = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => [strip(m[1]), strip(m[2])]).filter(([q, a]) => q && a);
  return qs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;
}
const isService = (p) => /^\/services\/[^/]+$/.test(p) || /^\/(ai-services|seo-audit|caspercare|done-for-you|casper-va)$/.test(p) || /^\/casper-va\/(?!roles|hiring-guide|vs-agency)[^/]+$/.test(p) || /-georgetown-ma$/.test(p);
function schemaFor(p, html, title, desc) {
  const s = [];
  if (p === "/" || p === "/about-us") s.push({ "@context": "https://schema.org", ...ORG });
  if (p === "/") s.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE + "/", name: NAME, publisher: ORG_REF, inLanguage: "en-US" });
  if (isPost(p) || isQuestion(p)) {
    const date = (html.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/) || [])[0];
    const iso = date ? new Date(date + " 12:00 UTC").toISOString().slice(0, 10) : undefined;
    const img = (html.match(/<img src="([^"]+)"/) || [])[1];
    s.push({ "@context": "https://schema.org", "@type": isPost(p) ? "BlogPosting" : "Article", headline: strip((html.match(/<h1>([\s\S]*?)<\/h1>/) || [, title])[1]).slice(0, 110), description: desc, url: SITE + p, mainEntityOfPage: SITE + p, author: JARED, publisher: ORG_REF, ...(iso ? { datePublished: iso } : {}), dateModified: TODAY, image: SITE + (img || "/og.png"), inLanguage: "en-US", ...(KW[p]?.keyword ? { about: KW[p].keyword } : {}) });
  }
  if (p === "/author/jared-casper") s.push({ "@context": "https://schema.org", ...JARED, jobTitle: "Founder", worksFor: ORG_REF, sameAs: ["https://www.linkedin.com/in/jaredcasper94/", "https://www.facebook.com/jaredcasper94/"], image: SITE + "/img/jared-casper.webp" });
  if (p === "/mark-casper") s.push({ "@context": "https://schema.org", "@type": "Person", "@id": `${SITE}/mark-casper#person`, name: "Mark Casper", jobTitle: "Co-Founder", url: SITE + p, worksFor: ORG_REF, image: SITE + "/img/6961d9d4f13bc3f87b316c89-7ea04d.webp" });
  if (isService(p)) s.push({ "@context": "https://schema.org", "@type": "Service", name: shortName(p), serviceType: KW[p]?.keyword || shortName(p), description: desc, url: SITE + p, provider: ORG_REF,
    areaServed: /georgetown/.test(p) ? { "@type": "City", name: "Georgetown, Massachusetts" } : { "@type": "Country", name: "United States" } });
  if (Object.values(CLUSTERS).some((c) => c.hub === p) || p === "/faq") s.push({ "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: SITE + p, about: KW[p]?.keyword, isPartOf: { "@id": `${SITE}/#website` } });
  const faq = faqSchema(html); if (faq) s.push(faq);
  return s;
}

// ── build every page ──
const titles = new Map(), descs = new Map(), report = [], linksReport = [];
const HUB_OF = new Set(Object.values(CLUSTERS).map((c) => c.hub));
for (const P of ALL) {
  const p = P.path;
  const cluster = CL(p), cta = primaryCta(p, cluster);
  let html = P.html;
  if (HUBS[p]) html = hubHtml(p);
  else if (p === "/faq") html = faqHub();
  else if (!P.hand) html = applyContentEdits(p, html);
  html = keywordize(p, html);
  if (p === "/blog") html = blogIndex(html);
  if (TOOLS[p]) html = toolPage(p, html);
  html = placeForms(p, html);
  html = polish(rewriteMedia(rewriteLinks(html)));
  html = oneCta(html, cta);
  // the primary CTA is visible in the first screen of every page (tools convert inside the tool)
  if (cta && !TOOLS[p] && !["/agreement-builder", "/thank-you"].includes(p)) {
    const end = html.indexOf("</section>"), first = end > 0 ? html.slice(0, end) : "";
    if (first && !/<a class="btn" href="\/contact/.test(first)) html = html.slice(0, end) + `<p class="ctas"><a class="btn" href="${cta.href}" data-cta="hero">${esc(cta.label)}</a></p>` + html.slice(end);
  }
  if (p === "/sitemap") html = htmlSitemap(html);
  if (HUB_OF.has(p) && p !== "/about-us" || p === "/about-us") html += clusterListing(cluster, p);
  imgCount = 0;
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new Error(`${p}: ${h1s} h1: ${(html.match(/<h1[\s>][\s\S]{0,80}/g) || []).join(" ;; ")}`);
  priceGuard(p, html);
  let title = makeTitle(p).find((t) => !titles.has(t)) || makeTitle(p)[0];
  if (titles.has(title)) throw new Error(`duplicate title ${title} (${p}, ${titles.get(title)})`);
  titles.set(title, p);
  let desc = makeDesc(p, html);
  if (descs.has(desc)) desc = fitDesc(firstPara(html) || title);
  if (descs.has(desc)) throw new Error(`duplicate description on ${p} and ${descs.get(desc)}`);
  descs.set(desc, p);
  // breadcrumbs: Home › topic hub › parent sections › page
  const crumbs = [["Home", "/"]];
  const hub = CLUSTERS[cluster]?.hub;
  if (hub && hub !== p && KEEP.has(hub)) crumbs.push([shortName(hub), hub]);
  const segs = p.split("/").filter(Boolean);
  for (let i = 1; i < segs.length; i++) { const pre = "/" + segs.slice(0, i).join("/"); if (KEEP.has(pre) && !crumbs.some(([, x]) => x === pre)) crumbs.push([shortName(pre), pre]); }
  if (p !== "/") crumbs.push([shortName(p), p]);
  const noindex = NOINDEX.has(p) || !!KW[p]?.noindex;
  const steps = nextSteps(p, cluster, KW, (x) => KEEP.has(x) && !NOINDEX.has(x));
  const plain = ["/thank-you", "/agreement-builder"].includes(p);
  const picks = p === "/" || plain || p === BOOK ? [] : relatedPicks(p, new Set(Object.values(steps)));
  const tail = p === BOOK ? TRUST : plain ? "" : related(p, picks) + nextBlock(p, steps, shortName, cardDesc, cta);
  const body = `<div class="content${isPost(p) ? " article" : ""}">${html}${tail}</div>`;
  write(p, page({ path: p, title, desc, body, crumbs: p === "/" ? null : crumbs, noindex, ogType: isPost(p) ? "article" : "website", schema: noindex ? [] : schemaFor(p, html, title, desc), cta: cta || { href: BOOK, label: "Book My 15-Minute Fit Call" }, sticky: stickyCta(cta) }));
  report.push([p, title.length, desc.length]);
  if (!noindex) linksReport.push({ p, cluster, title, h1: strip((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || ""), steps, picks, cta: cta?.href || "" });
}

// ── redirects for every old / merged URL ──
for (const [from, to] of Object.entries(REDIRECTS)) write(from, redirect(to));

// ── 404 ──
writeFileSync(join(OUT, "404.html"), page({ path: "/404", title: "Page Not Found | CasperB2B", desc: "We couldn't find the page you're looking for. Let's get you back on track to scaling your business.", noindex: true, sticky: stickyCta({ href: BOOK, label: "Book My 15-Minute Fit Call" }),
  body: `<div class="content"><section><p class="eyebrow">404</p><h1>Page not found</h1><p>We couldn't find the page you're looking for. Let's get you back on track.</p><p class="ctas"><a class="btn" href="${BOOK}" data-cta="404">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/">Return Home</a></p></section><section><h2>Popular pages</h2><div class="grid g4">${MENU.map(([k]) => [CLUSTERS[k].name, CLUSTERS[k].hub]).map(([n, h]) => `<a class="card-link" href="${h}"><h3>${esc(n)}</h3><p>${esc(cardDesc(h))}</p></a>`).join("")}</div></section></div>` }).replace(/<link rel="canonical"[^>]*>/, ""));

// ── sitemap.xml, robots.txt, llms.txt, CNAME, url list for IndexNow ──
const list = urls.filter(([p]) => p !== "/404");
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map(([p, d]) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `# casperb2b.com — everyone welcome, including AI search and answer engines\nUser-agent: *\nAllow: /\n\n${["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"].map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(OUT, "CNAME"), "casperb2b.com\n");
writeFileSync(join(ROOT, "data/urls.txt"), list.map(([p]) => SITE + (p === "/" ? "/" : p)).join("\n") + "\n");
const indexed = new Set(list.map(([p]) => p));
const llmsHead = readFileSync(ROOT + "content/llms.txt", "utf8").trim();
const llmsLine = (p) => `- [${shortName(p)}](${SITE}${p === "/" ? "/" : p}): ${cardDesc(p)}`;
const llms = llmsHead + "\n\n" + MENU.map(([k]) => { const items = linksReport.filter((r) => r.cluster === k).map((r) => r.p).sort((a, b) => (b === CLUSTERS[k].hub) - (a === CLUSTERS[k].hub) || (kind(a) > kind(b) ? 1 : -1)); return items.length ? `## ${CLUSTERS[k].name}\n${items.map(llmsLine).join("\n")}` : ""; }).filter(Boolean).join("\n\n") + `\n\n## Optional\n- [Sitemap](${SITE}/sitemap.xml)\n- [CasperPortal (sister product)](https://casperportal.com)\n`;
for (const m of llms.matchAll(/\]\(https:\/\/casperb2b\.com([^)]*)\)/g)) { const p = m[1].replace(/\/$/, "") || "/"; if (!indexed.has(p) && p !== "/sitemap.xml") throw new Error("llms.txt links to a page that is not indexed: " + p); }
writeFileSync(join(OUT, "llms.txt"), llms);

// ── KEYWORDS.md + LINKS.md (generated; commit them with content changes) ──
const kwRows = linksReport.map((r) => ({ ...r, kw: KW[r.p]?.keyword || "", sec: (KW[r.p]?.secondary || []).join("; ") }));
const dupKw = Object.entries(kwRows.reduce((a, r) => { if (r.kw) (a[r.kw] ||= []).push(r.p); return a; }, {})).filter(([, ps]) => ps.length > 1);
if (dupKw.length) throw new Error("two pages target the same primary keyword: " + JSON.stringify(dupKw));
const md = (s) => String(s).replace(/\|/g, "\\|");
const merged = Object.entries(REDIRECTS).filter(([from]) => !/-(ma|nh)(\/|$)|^\/(faq|playbooks|features|georgetown-ma|strategy\/ai|compare\/national)/.test(from));
writeFileSync(join(ROOT, "KEYWORDS.md"), `# KEYWORDS.md — one primary keyword per indexable page\n\nGenerated by \`npm run build\` from data/keywords.json (edit that file, not this one). ${kwRows.length} indexable pages; the build fails if two pages share a primary keyword, a title is over 60 characters or a description over 155.\n\nEvery page gets: the title and meta description below, an H1 aligned to the keyword, an answer-first intro (the page's opening or \`intro\` in keywords.json), FAQPage schema where it has questions, Service schema on service pages, Article/BlogPosting schema on questions and articles, BreadcrumbList everywhere and Organization on home and About.\n\n${MENU.map(([k]) => `## ${CLUSTERS[k].name}\n\n| Page | Primary keyword | Secondary | Title | H1 |\n|---|---|---|---|---|\n${kwRows.filter((r) => r.cluster === k).map((r) => `| ${r.p} | ${md(r.kw || "—")} | ${md(r.sec)} | ${md(r.title)} | ${md(r.h1)} |`).join("\n")}\n`).join("\n")}\n## Merged and moved URLs (redirect → page that now owns the keyword)\n\nTown × service, town FAQ, playbook and CasperPortal feature URLs are omitted here (all in data/redirects.json, ${Object.keys(REDIRECTS).length} in total).\n\n| Old URL | Now |\n|---|---|\n${merged.map(([a, b]) => `| ${a} | ${b} |`).join("\n")}\n`);
const inbound = {}; for (const r of linksReport) for (const x of [...Object.values(r.steps), ...r.picks]) if (x) inbound[x] = (inbound[x] || 0) + 1;
writeFileSync(join(ROOT, "LINKS.md"), `# LINKS.md — navigation and internal linking\n\nGenerated by \`npm run build\` (from scripts/ia.mjs and data/keywords.json).\n\n## Rules\n- Header menu grouped by visitor goal (below). Mobile: same groups in the drawer.\n- Every page: breadcrumb (Home › topic hub › section › page), a "Related in <topic>" block (same-topic siblings + the hub), and a "Your next best step" block linking the most relevant service, free tool, article and the booking page, plus the trust block.\n- One primary CTA per page: "Book My 15-Minute Fit Call" → /contact?topic=<topic> (header button, in-page buttons, sticky mobile bar, footer). Other buttons are secondary. Tools convert inside the tool with a short form.\n- Every page is one click from booking (header CTA + sticky mobile bar) — \`npm run check\` fails otherwise.\n- Topic hubs list every page in their topic, so every page is within two clicks of the menu.\n\n## Header menu\n\n${MENU.map(([k, items]) => `- **${CLUSTERS[k].name}** (hub: ${CLUSTERS[k].hub})\n${items.map(([n, h]) => `  - ${n} — ${h}`).join("\n")}`).join("\n")}\n\n## Next best step and related links per page\n\n| Page | Topic | Service | Tool | Read next | Related | Inbound (from these blocks) |\n|---|---|---|---|---|---|---|\n${linksReport.map((r) => `| ${r.p} | ${r.cluster} | ${r.steps.service || ""} | ${r.steps.tool || ""} | ${r.steps.article || ""} | ${r.picks.join(", ")} | ${inbound[r.p] || 0} |`).join("\n")}\n`);

const long = report.filter(([, t, d]) => t > 60 || d > 155);
if (long.length) throw new Error("title/description too long: " + JSON.stringify(long));
console.log(`built ${ALL.length} pages (${list.length} in sitemap), ${Object.keys(REDIRECTS).length} redirects → dist/`);
