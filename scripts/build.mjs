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
import { CLUSTERS, MENU, BOOK, clusterOf, primaryCta, nextSteps, nextBlock, stickyCta, TRUST, isPost, isQuestion, concernsBlock, ASSURE } from "./ia.mjs";
import { PRICING, AGREEMENT, HUBS, FAQ_HUB, RESTAURANT_AI } from "./pages-extra.mjs";
import { SEO_PAGES } from "./pages-seo.mjs";
import { declutter, declutterReport, declutterLate, lateReport, scrubStory, STORY } from "./declutter.mjs";
import { locationPages } from "./locations.mjs";
import { heroArt, iconFor } from "./visuals.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url)).split("\\").join("/");
const read = (f, d) => existsSync(ROOT + f) ? JSON.parse(readFileSync(ROOT + f, "utf8")) : d;
const PAGES = read("content/pages.json");
const REDIRECTS = read("data/redirects.json");
const IMAGES = read("data/images.json");
const KW = read("data/keywords.json", {});
const CEDITS = read("data/content-edits.json", {});
const CUTS = read("data/cut-edits.json", {});
const ADDS = read("data/additions.json", {});
const FAQX = read("data/faq-extra.json", {}); // extra questions per page (every page ends with a full FAQ)
function extraFaq(p, html) {
  const list = FAQX[p]; if (!list?.length) return html;
  const have = new Set([...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) => strip(m[1]).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()));
  const items = list.filter(({ q }) => !have.has(q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())).map(({ q, a }) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  if (!items) return html;
  // join the last FAQ block on the page; otherwise add one
  const secs = [...html.matchAll(/<section>(?:(?!<section>)[\s\S])*?<\/section>/g)].filter((m) => /<details>/.test(m[0]));
  // right after the block's last question, so a closing line or CTA under the FAQ stays at the end
  if (secs.length) { const m = secs[secs.length - 1]; const end = m.index + m[0].lastIndexOf("</details>") + "</details>".length; return html.slice(0, end) + items + html.slice(end); }
  return html + `<section><h2>Frequently asked questions</h2>${items}</section>`;
} // extra sections + FAQs for pages that were too thin to rank
/** Pages captured as one flat run of elements get a <section> per H2 (first chunk = hero), so later steps
 *  (FAQ merging, table of contents, mid-page CTA, alternating backgrounds) work on them too. */
function sectionize(html) {
  if (/<section[\s>]/.test(html)) return html;
  const parts = html.split(/(?=<h2[\s>])/);
  if (parts.length < 2) return html;
  const balanced = (s) => ["div", "details", "ul", "ol", "table", "a"].every((t) => (s.match(new RegExp(`<${t}\\b`, "g")) || []).length === (s.match(new RegExp(`</${t}>`, "g")) || []).length);
  if (!parts.every(balanced)) return html;
  return parts.map((s) => `<section>${s}</section>`).join("");
}
function addContent(p, html) {
  html = sectionize(html);
  const a = ADDS[p]; if (!a) return html;
  const faqAt = html.search(/<section>(?:(?!<\/section>)[\s\S])*?<details>/);
  if (a.add) html = faqAt >= 0 ? html.slice(0, faqAt) + a.add + html.slice(faqAt) : html + a.add;
  if (a.faq?.length) {
    const items = a.faq.map(({ q, a: ans }) => `<details><summary>${esc(q)}</summary><p>${esc(ans)}</p></details>`).join("");
    const at = html.search(/<section>(?:(?!<\/section>)[\s\S])*?<details>/);
    if (at >= 0) { const end = html.indexOf("</section>", at); html = html.slice(0, end) + items + html.slice(end); }
    else html += `<section><h2>Frequently asked questions</h2>${items}</section>`;
  }
  return html;
} // second pass: fluff cuts, applied after declutter()
const LOC = read("data/locations.json");
const NO_ART = new Set(["/contact", "/thank-you", "/agreement-builder", "/sitemap", "/faq", "/blog", "/careers"]);
const NOINDEX = new Set(["/thank-you", "/agreement-builder"]);

// ── pages that are written here rather than captured ──
const byPath = Object.fromEntries(PAGES.map((p) => [p.path, p]));
byPath["/pricing"] = { ...(byPath["/pricing"] || { path: "/pricing" }), title: PRICING.title, desc: PRICING.desc, h1: PRICING.h1, html: PRICING.html, hand: true };
byPath["/agreement-builder"] = { ...(byPath["/agreement-builder"] || { path: "/agreement-builder" }), title: AGREEMENT.title, desc: AGREEMENT.desc, h1: AGREEMENT.h1, html: AGREEMENT.html, hand: true };
{ const R = RESTAURANT_AI; byPath[R.path] = { path: R.path, title: R.title, desc: R.desc, h1: R.h1, html: R.html, hand: true, name: "AI ordering for restaurants" }; }
// town pages + state hubs (data/locations.json)
const LOCS = locationPages(LOC, (h) => !!byPath[h] || h === "/casper-va");
for (const x of LOCS.pages) { byPath[x.path] = { ...x, generated: true }; KW[x.path] = { ...LOCS.kw[x.path], ...(KW[x.path] || {}) }; }
KW["/georgetown-ma"] = { ...(KW["/georgetown-ma"] || {}), cluster: "local" }; if (byPath["/georgetown-ma"]) byPath["/georgetown-ma"].parent = "/massachusetts";
KW["/service-areas"] = { ...(KW["/service-areas"] || {}), cluster: "local" };
for (const [p, h] of Object.entries(HUBS)) byPath[p] = { path: p, title: h.title, desc: h.desc, h1: h.h1, html: "", hub: true };
byPath["/faq"] = { path: "/faq", title: FAQ_HUB.title, desc: FAQ_HUB.desc, h1: FAQ_HUB.h1, html: "", hub: true };
for (const [p, h] of [...Object.entries(HUBS), ["/faq", FAQ_HUB]]) KW[p] = { keyword: h.keyword, title: h.title, desc: h.desc, h1: h.h1, intro: h.intro, cluster: h.cluster || "resources", ...(KW[p] || {}) };
KW["/pricing"] = { cluster: "about", ...(KW["/pricing"] || {}), title: PRICING.title, desc: PRICING.desc, h1: PRICING.h1, intro: null };
KW["/agreement-builder"] = { cluster: "about", noindex: true };
// keyword pages from Search Console demand (scripts/pages-seo.mjs)
for (const S of SEO_PAGES) { byPath[S.path] = { path: S.path, title: S.title, desc: S.desc, h1: S.h1, html: S.html, hand: true, name: S.name };
  KW[S.path] = { ...(KW[S.path] || {}), keyword: S.keyword, secondary: S.secondary, title: S.title, desc: S.desc, h1: S.h1, intro: S.intro, cluster: S.cluster, next: S.next }; }
KW[RESTAURANT_AI.path] = { cluster: "ai", ...(KW[RESTAURANT_AI.path] || {}), keyword: RESTAURANT_AI.keyword, title: RESTAURANT_AI.title, desc: RESTAURANT_AI.desc, h1: RESTAURANT_AI.h1, intro: null, next: { service: "/niches/restaurants", tool: "/tools/roi-calculator", article: "/how-to-fill-my-restaurant-on-weeknights" } };
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
// old town × service URLs → the matching town service page when one exists, else the town page
const TOWN_SUB = [[/^\/(cybersecurity|data-protection|cloud-computing|hosting-support|it-support|managed-it|backup-and-recovery|it-infrastructure)$/, "managed-it"], [/^\/(web-development|website-development|web-design|speed-optimization|conversion-optimization)$/, "web-development"]];
for (const k of Object.keys(REDIRECTS)) { const m = k.match(/^\/(?:strategy\/ai\/|strategy\/|faq\/|compare\/national-agencies\/|blog\/spotlight-)?([a-z-]+-(?:ma|nh))(\/.*)?$/); if (!(m && KEEP.has("/" + m[1]) && LOCS.slugs.includes(m[1]))) continue;
  const sub = k.startsWith("/" + m[1] + "/") && m[2] ? TOWN_SUB.find(([re]) => re.test(m[2])) : null; const to = sub && `/${m[1]}/${sub[1]}`; REDIRECTS[k] = to && KEEP.has(to) ? to : "/" + m[1]; }
for (const k of Object.keys(REDIRECTS)) REDIRECTS[k] = finalTarget(REDIRECTS[k]);

const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();
const clip = (s, n) => s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "") + "…";
const CL = (p) => clusterOf(p, KW);

// menu + footer from the IA (every item must be a built page)
for (const [k, items] of MENU) for (const [, h] of items) if (h && !KEEP.has(h)) throw new Error(`menu links to a page that is not built: ${h}`);
NAV.menus = MENU.map(([k, items]) => [CLUSTERS[k].name, items]);
// the footer carries the whole menu; the long Marketing & SEO menu splits in two so the columns stay even
NAV.footer = MENU.flatMap(([k, items]) => {
  const cut = items.findIndex(([a, h]) => !h && /^advertising$/i.test(a));
  return cut > 0 ? [[CLUSTERS[k].name, items.slice(0, cut)], ["Advertising & design", items.slice(cut)]] : [[CLUSTERS[k].name, items]];
});
const NAVNAME = new Map(MENU.flatMap(([, items]) => items).filter(([, h]) => h).map(([n, h]) => [h, n]));

// ── names, titles, descriptions ──
const HUBNAME = Object.fromEntries(Object.values(CLUSTERS).map((c) => [c.hub, c.name]));
const CRUMB_NAME = { "/services": "Services", "/niches": "Industries", "/problems": "Problems we solve", "/blog": "Blog", "/strategy": "Strategy", "/casper-va": "Casper VA" };
const shortName = (p) => p === "/" ? "Home" : BY[p]?.name || CRUMB_NAME[p] || HUBNAME[p] || NAVNAME.get(p) || clean(KW[p]?.h1 || BY[p]?.h1 || p).replace(/[.:]$/, "").slice(0, 70);
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
  if (KW[p]?.desc) return fitDesc(KW[p].desc.replace(/\bnationwide\b/g, "worldwide"));
  let d = clean(BY[p].desc);
  if (!d || /^CasperB2B protects small businesses from cyber threats/.test(d) && p !== "/") d = firstPara(html);
  return fitDesc(d);
}
// card blurbs drop the meta description's closing call to action ("Book a free 15-minute fit call.") so they never end "…Book a free…"
const dropCta = (s) => String(s || "").replace(/\s*(?:Book|Request|Get|Schedule|Call)\b[^.!?]*(?:fit call|call|consultation|audit|quote|demo)[^.!?]*[.!?]?\s*$/i, "").trim();
const cardDesc = (p) => { const d = dropCta(fitDesc(KW[p]?.desc || BY[p]?.desc || firstPara(BY[p]?.html || ""))); return d.length <= 150 ? d : clip(d, 140); };

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
// stock photos the old site captioned as "CasperB2B team" — not real staff, so never shown
const NOT_OUR_TEAM = ["65a3a0d913b3b931caa99c9e", // generic "service results" stand-in
  "6633f4c6a63e94209e806c1d", "653b16a9cc8c12dc5f1cd56d", "653b1780c3c1a190996b29a5", "653b186d28812040cc078f25", "6540ad401eae187a62401831"];
let imgCount = 0;
function rewriteMedia(html) {
  html = html.replace(/<img src="([^"]*)" alt="([^"]*)"[^>]*>/g, (all, src, alt) => {
    const m = IMAGES[src.replace(/&amp;/g, "&")] || (src.startsWith("/img/") ? { src, w: 0, h: 0 } : null); if (!m) return "";
    if (NOT_OUR_TEAM.some((id) => m.src.includes(id))) return ""; // stock photos that were captioned as our team
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
/** Heading levels only step down one at a time (a11y + outline): a skipped level is renamed, its size kept via class. */
function fixHeadings(html) {
  let prev = 0;
  return html.replace(/<h([1-4])((?: class="[^"]*")?)>([\s\S]*?)<\/h\1>/g, (all, lv, cls, inner) => {
    let l = +lv;
    if (prev && l > prev + 1) { const keep = cls ? cls : ` class="h${l}"`; l = prev + 1; prev = l; return `<h${l}${keep}>${inner}</h${l}>`; }
    prev = l; return all;
  });
}
/** Pages captured without an opening <section>: wrap everything up to the first H2 as the hero; drop back-links and a
 *  duplicate title above the H1 (the breadcrumb already does that job). */
function normalizeHero(html) {
  const h1 = html.indexOf("<h1"); if (h1 < 0) return html;
  let pre = html.slice(0, h1).replace(/<p><a href="[^"]*">Back to [^<]*<\/a><\/p>/g, "").replace(/^\s*<a href="\/blog">Blog<\/a>/, "");
  const title = strip(html.slice(h1).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "").toLowerCase();
  pre = pre.replace(/<p>([^<]{8,120})<\/p>/g, (m, t) => title.startsWith(t.trim().toLowerCase().replace(/[.:]$/, "")) ? "" : m);
  html = pre + html.slice(h1);
  if (html.trimStart().startsWith("<section>")) return html;
  const at = html.indexOf("<h1");
  const nextH2 = html.indexOf("<h2", at), nextSec = html.indexOf("<section", at);
  const cut = [nextH2, nextSec].filter((x) => x > 0).sort((x, y) => x - y)[0] ?? html.length;
  // don't split an open tag: back up to the nearest boundary between top-level blocks
  let end = cut; const head = html.slice(0, end);
  const opens = (head.match(/<(div|details|ul|ol|table)\b/g) || []).length, closes = (head.match(/<\/(div|details|ul|ol|table)>/g) || []).length;
  if (opens !== closes) return html; // unusual markup: leave it as captured
  return "<section>" + head + "</section>" + html.slice(end);
}
// ── reading + conversion aids ──
const slug = (s) => strip(s).toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const MID = { customers: ["Want more calls without more work?", "We set it up and run it for you."], marketing: ["Want this done for you?", "We plan it, build it and report on it every month."],
  ai: ["Want this automated for you?", "We build the workflow and keep it running."], cyber: ["Not sure how exposed you are?", "We'll tell you what to fix first."],
  va: ["Need the right person on your team?", "Tell us the role. We'll match and support them."], local: ["Want to be the one they find?", "Local SEO, website and follow-up, done for you."],
  resources: ["Rather have someone just handle it?", "That's what we do."], about: ["Want to see if we're a fit?", "15 minutes, no pressure."], tools: ["Want help with what you found?", "We'll walk you through it."] };
const MONTH = new Date(TODAY + "T12:00:00Z").toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
function pageAids(p, html, cluster, cta) {
  if (TOOLS[p] || HUBS[p] || ["/", "/contact", "/thank-you", "/agreement-builder", "/privacy", "/terms", "/affiliate-terms", "/sitemap", "/faq", "/blog"].includes(p)) return html;
  // ids on H2s + "On this page" when a page has 4+ sections worth jumping to
  const used = new Set(), heads = [];
  html = html.replace(/<h2((?: class="[^"]*")?)>([\s\S]*?)<\/h2>/g, (all, cls, inner) => {
    let id = slug(inner) || "section"; while (used.has(id)) id += "-2"; used.add(id); heads.push([id, strip(inner)]);
    return `<h2${cls} id="${id}">${inner}</h2>`;
  });
  const end = html.indexOf("</section>");
  const toc = heads.filter(([, t]) => t.length < 80);
  if (toc.length >= 4 && end > 0) html = html.slice(0, end + 10) + `<nav class="toc" aria-label="On this page"><p>On this page</p><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol></nav>` + html.slice(end + 10);
  // visible freshness on articles and answers
  if ((isPost(p) || isQuestion(p)) && !/Last updated|Updated /.test(strip(html.slice(0, 3000)))) html = html.replace(/(<p class="answer">[\s\S]*?<\/p>)/, (m) => m + `<p class="updated">Updated <time datetime="${TODAY}">${MONTH}</time> · by <a href="/author/jared-casper">Jared Casper</a></p>`);
  // one mid-page reminder on long pages (same single action as every other CTA on the page)
  const secs = [...html.matchAll(/<section>/g)].map((m) => m.index);
  if (cta && secs.length >= 5 && !/class="cta-band"/.test(html)) {
    const [h, s] = MID[cluster] || MID.about, at = secs[3];
    html = html.slice(0, at) + `<aside class="cta-band" aria-label="Book a call"><div><b>${esc(h)}</b><span>${esc(s)} A personal reply within 1 business day.</span></div><a class="btn" href="${cta.href}" data-cta="mid">${esc(cta.label)}</a></aside>` + html.slice(at);
  }
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
function applyContentEdits(p, html, set = CEDITS) {
  for (const e of set[p] || []) {
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
  const garbled = text.match(/$[0-9][0-9,]*$[0-9]|$[0-9,]+(?:er month|onth)\b/);
  if (garbled) throw new Error(`${p}: garbled money text: ${garbled[0]}`);
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
  fields: [{ name: "name", label: "Your Name", required: true, autocomplete: "name", placeholder: "Jane Smith" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email", placeholder: "jane@yourbusiness.com" }, { name: "phone", label: "Phone (optional — fastest reply)", type: "tel", autocomplete: "tel", placeholder: "(555) 123-4567" },
    { name: "service_requested", label: "What do you need help with?", type: "select", options: [["marketing", "Getting more customers"], ["seo", "SEO & Google visibility"], ["website", "A new or better website"], ["automation", "AI, CRM & automation"], ["restaurant", "AI order-taking for my restaurant"], ["va", "A virtual assistant"], ["cybersecurity", "Cybersecurity & IT"], ["other", "Not sure yet"]] },
    { name: "calendar_notes", label: "Anything we should know? (optional)", type: "textarea", rows: 3, placeholder: "What is leaking time or revenue right now?" }] });
const PAGE_FORMS = {
  "/contact": () => CONTACT_FORM,
  "/careers": () => `<div id="apply">` + leadForm({ id: "Talent Network Application", tags: ["talent_network"], submit: "Join the Talent Network", success: "Thanks — your profile is in. We'll reach out when a role fits your skills.",
    fields: [{ name: "name", label: "Your Name", required: true, autocomplete: "name" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "phone", label: "Phone (optional)", type: "tel", autocomplete: "tel" },
      { name: "contact.role", label: "Role or skills", required: true, placeholder: "e.g. DevOps engineer, AWS, Terraform" }, { name: "contact.profile_url", label: "LinkedIn or resume link (optional)", type: "url", placeholder: "https://" }, { name: "contact.location", label: "Where are you based? (optional)", autocomplete: "address-level2" }] }) + `</div>`,
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
  if (BY[p]?.location) return [...BY[p].location.near.map((n) => "/" + n).filter((x) => KEEP.has(x)), BY[p].parent];
  if (/^\/(massachusetts|new-hampshire)$/.test(p)) return ["/massachusetts", "/new-hampshire", "/service-areas", "/georgetown-ma"];
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
  // same-topic siblings first (rotating from this page's position so neighbours differ), then the rest of the family
  const all = family(p), same = all.filter((x) => CL(x) === CL(p)), rest = all.filter((x) => CL(x) !== CL(p));
  const i = Math.max(0, same.indexOf(p));
  const ring = same.length ? same.map((_, k) => same[(i + 1 + k) % same.length]) : [];
  const fam = [...ring, ...rest].filter((x, k, a) => x !== p && !exclude.has(x) && a.indexOf(x) === k);
  const pick = [];
  for (let k = 0; k < fam.length && pick.length < 3; k++) pick.push(fam[k]);
  const hub = CLUSTERS[CL(p)]?.hub; if (hub && hub !== p && KEEP.has(hub) && !pick.includes(hub) && !exclude.has(hub)) pick.push(hub);
  for (const x of ["/services", "/how-to-get-more-customers", "/tools", "/blog"]) if (pick.length < 3 && x !== p && !pick.includes(x) && !exclude.has(x)) pick.push(x);
  return pick;
}
const related = (p, picks) => picks.length ? `<section class="related"><h2>Related in ${esc(CLUSTERS[CL(p)]?.name || "this topic")}</h2><div class="grid g${Math.min(picks.length, 4)}">${picks.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div></section>` : "";

// "Keep reading" card halfway down long pages, for readers who leave before the end blocks. It suggests a guide in the
// same topic and the matching service, skipping pages this page already links to or suggests at the end.
const READS = () => ALL.map((x) => x.path).filter((x) => (isPost(x) || isQuestion(x)) && KEEP.has(x) && !NOINDEX.has(x) && !KW[x]?.noindex);
let readPool = null;
const STOP = new Set("what with your that this from have does will when they them their more much should into about small business businesses services service company near best how why".split(" "));
function midRead(p, html, cluster, steps, picks) {
  const starts = [...html.matchAll(/<section[\s>]/g)].map((m) => m.index);
  if (starts.length < 4 || /class="midread"/.test(html)) return html;
  const linked = new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1].replace(/\/+$/, "") || "/"));
  const taken = new Set([p, ...Object.values(steps), ...picks, ...linked]);
  readPool ||= READS();
  const same = readPool.filter((x) => CL(x) === cluster && !taken.has(x)), any = readPool.filter((x) => !taken.has(x));
  // industry guides (dental, law firm, HVAC...) only on pages about that industry
  const NICHE = /dental|patients|law-firm|hvac|real-estate|restaurant/;
  const fits = (x) => { const m = x.match(NICHE); return !m || p.includes(m[0]) || (m[0] === "patients" && p.includes("dental")); };
  const pool = (same.filter(fits).length ? same : any).filter(fits); if (!pool.length) return html;
  // most relevant guide: the one sharing the most keyword words with this page (ties broken per page, so suggestions vary)
  const words = (x) => new Set(clean([KW[x]?.keyword, ...(KW[x]?.secondary || []), KW[x]?.h1 || BY[x]?.h1, x.replace(/[/-]/g, " ")].join(" ")).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(" ").filter((w) => w.length > 3 && !STOP.has(w)));
  const mine = words(p);
  let h = 0; for (const ch of p) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const score = (x) => [...words(x)].filter((w) => mine.has(w)).length;
  // with no keyword match, prefer general guides over industry-specific ones (dental, law firm, HVAC...)
  const niche = (x) => /dental|patients|law-firm|hvac|real-estate|restaurant|spotlight/.test(x) ? 1 : 0;
  const ranked = pool.map((x, k) => [x, score(x), niche(x), (k + h) % pool.length]).sort((a, b) => b[1] - a[1] || a[2] - b[2] || a[3] - b[3]);
  const read = ranked[0][0];
  const svc = [steps.service, CLUSTERS[cluster]?.next?.service, "/services"].find((x) => x && x !== p && KEEP.has(x));
  const card = `<aside class="midread" aria-label="Keep reading"><p class="eyebrow">Keep reading</p><a class="mr-main" href="${read}" data-cta="midread-article"><b>${esc(shortName(read))}</b><span>${esc(cardDesc(read))}</span></a>${svc ? `<p class="mr-alt">Rather have it done for you? <a href="${svc}" data-cta="midread-service">See ${esc(shortName(svc))}</a></p>` : ""}</aside>`;
  const at = starts[Math.floor(starts.length / 2)];
  return html.slice(0, at) + card + html.slice(at);
}

// Hero design: a dark navy hero ("hx") with a neon accent on the headline. Pages whose hero holds a form or a tool keep
// a light hero ("hx-light") so form fields stay readable. A photo that opens the hero sits beside the text ("hx-img").
const H1_ACCENT = { "/ai-restaurant-ordering": "best AI employee" }; // hand-picked accent phrases
function accentH1(h, p) {
  return h.replace(/<h1>([^<]+)<\/h1>/, (all, t) => {
    let m; const pick = H1_ACCENT[p];
    if (pick && t.includes(pick)) return `<h1>${t.replace(pick, `<span class="hl">${pick}</span>`)}</h1>`;
    if ((m = t.match(/^(.{6,}?:\s*)(.{6,})$/))) return `<h1>${m[1]}<span class="hl">${m[2]}</span></h1>`;
    if ((m = t.match(/^(.+\sin\s)([^]{3,40})$/)) && !/\sin\s/.test(m[2])) return `<h1>${m[1]}<span class="hl">${m[2]}</span></h1>`;
    const w = t.trim().split(/\s+/); if (w.length < 4) return all;
    return `<h1>${w.slice(0, -2).join(" ")} <span class="hl">${w.slice(-2).join(" ")}</span></h1>`;
  });
}
function heroDesign(p, html) {
  if (!html.startsWith("<section>")) return html;
  const end = html.indexOf("</section>"), first = end > 0 ? html.slice(0, end) : "";
  if (!/<h1[\s>]/.test(first)) return html;
  const light = !!TOOLS[p] || /<form|class="tool/.test(first);
  const img = /^<section>\s*<img\b/.test(first);
  const cls = [light ? "hx-light" : "hx", img ? "hx-img" : ""].filter(Boolean).join(" ");
  return `<section class="${cls}">` + accentH1(html.slice("<section>".length), p);
}

// ── hubs ──
const kind = (x) => /^\/(staffing\/.|b2b-growth$)/.test(x) ? "Services" : BY[x]?.location ? (BY[x].location.st === "nh" ? "New Hampshire towns" : "Massachusetts towns") : /^\/(massachusetts|new-hampshire)$/.test(x) ? "States" : x === "/georgetown-ma" ? "Massachusetts towns" : x.startsWith("/tools") || x === "/quiz" ? "Free tools" : /^\/(services|ai-services|seo-audit|caspercare|done-for-you)|-georgetown-ma$|^\/casper-va\/(?!hiring|vs-agency)/.test(x) ? "Services" : isQuestion(x) ? "Questions answered" : isPost(x) ? "Guides & articles" : /^\/problems/.test(x) ? "Problems we fix" : /^\/niches/.test(x) ? "Industries" : "More";
const KIND_ORDER = ["States", "Massachusetts towns", "New Hampshire towns", "Services", "Questions answered", "Problems we fix", "Industries", "Free tools", "Guides & articles", "More"];
function clusterListing(cluster, self) {
  const members = all.filter((x) => CL(x) === cluster && x !== self && x !== "/");
  const groups = KIND_ORDER.map((k) => [k, members.filter((x) => kind(x) === k)]).filter(([, xs]) => xs.length);
  return `<section class="hub-group"><h2>Everything in ${esc(CLUSTERS[cluster].name)}</h2>${groups.map(([k, xs]) => `<h3>${k}</h3><div class="grid g3">${xs.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div>`).join("")}</section>`;
}
function allServices() {
  const svc = all.filter((x) => kind(x) === "Services" && !/^\/casper-va\/./.test(x) && !BY[x]?.location && !/-georgetown-ma$/.test(x) && x !== "/services");
  return `<section class="hub-group"><h2>Every CasperB2B service</h2>${Object.entries(CLUSTERS).map(([k, c]) => { const xs = svc.filter((x) => CL(x) === k); return xs.length ? `<h3>${esc(c.name)}</h3><div class="grid g3">${xs.map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div>` : ""; }).join("")}</section>`;
}
function hubHtml(p) {
  const h = HUBS[p], c = CLUSTERS[h.cluster];
  const start = (MENU.find(([k]) => k === h.cluster) || [, []])[1].filter(([, x]) => x && x !== p);
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
const PROJECTS = [["CarSales AI", "https://carsalessoftware.com", "AI-first car sales software for dealerships"], ["FMYCAR", "https://fmycar.com", "Independent car-buying help and a marketplace of cars from local dealers"], ["NextWeigh", "https://nextweigh.com", "A health and fitness program: habit coaching by text"], ["MC Sales Training", "https://mcsalestraining.com", "An 8-week sales challenge with live coaching"], ["FBK Marketing", "https://fbkmarketing.com", "Social media content for business owners"]];
const FIRST_LIVE = "2026-10-23"; // first published on this static site (pages without their own date)
const JARED = { "@type": "Person", "@id": `${SITE}/author/jared-casper#person`, name: "Jared Casper", url: `${SITE}/author/jared-casper` };
function faqSchema(html) {
  const qs = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => [strip(m[1]), strip(m[2])]).filter(([q, a]) => q && a);
  return qs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;
}
const isService = (p) => !!BY[p]?.location || /^\/staffing(\/|$)/.test(p) ||  /^\/services\/[^/]+$/.test(p) || /^\/(ai-services|seo-audit|caspercare|done-for-you|casper-va)$/.test(p) || /^\/casper-va\/(?!roles|hiring-guide|vs-agency)[^/]+$/.test(p) || /-georgetown-ma$/.test(p);
function schemaFor(p, html, title, desc) {
  const s = [];
  if (p === "/" || p === "/about-us") s.push({ "@context": "https://schema.org", ...ORG });
  if (p === "/") s.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE + "/", name: NAME, alternateName: ["Casper B2B", "casperb2b.com"], publisher: ORG_REF, inLanguage: "en-US" });
  if (isPost(p) || isQuestion(p)) {
    const date = (html.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/) || [])[0];
    const iso = date ? new Date(date + " 12:00 UTC").toISOString().slice(0, 10) : undefined;
    const img = (html.match(/<img src="([^"]+)"/) || [])[1];
    s.push({ "@context": "https://schema.org", "@type": isPost(p) ? "BlogPosting" : "Article", headline: strip((html.match(/<h1>([\s\S]*?)<\/h1>/) || [, title])[1]).slice(0, 110), description: desc, url: SITE + p, mainEntityOfPage: SITE + p, author: JARED, publisher: ORG_REF, datePublished: iso || FIRST_LIVE, dateModified: TODAY, image: SITE + (img || "/og.png"), inLanguage: "en-US", ...(KW[p]?.keyword ? { about: KW[p].keyword } : {}) });
  }
  if (p === "/author/jared-casper") s.push({ "@context": "https://schema.org", ...JARED, jobTitle: "Founder", worksFor: ORG_REF, sameAs: ["https://www.linkedin.com/in/jaredcasper94/", "https://www.facebook.com/jaredcasper94/"], image: SITE + "/img/jared-casper.webp" });
  if (p === "/portfolio" || p === "/") s.push({ "@context": "https://schema.org", "@type": "ItemList", name: "Projects built by CasperB2B", itemListElement: PROJECTS.map(([name, url, about], i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "CreativeWork", name, url, about, creator: ORG_REF } })) });
  if (p === "/mark-casper") s.push({ "@context": "https://schema.org", "@type": "Person", "@id": `${SITE}/mark-casper#person`, name: "Mark Casper", jobTitle: "Co-Founder", url: SITE + p, worksFor: ORG_REF, image: SITE + "/img/6961d9d4f13bc3f87b316c89-7ea04d.webp" });
  if (isService(p)) s.push({ "@context": "https://schema.org", "@type": "Service", name: shortName(p), serviceType: KW[p]?.keyword || shortName(p), description: desc, url: SITE + p, provider: ORG_REF,
    areaServed: BY[p]?.location ? { "@type": "City", name: `${BY[p].location.name}, ${LOC.states[BY[p].location.st].name}`, containedInPlace: { "@type": "AdministrativeArea", name: `${BY[p].location.county}, ${LOC.states[BY[p].location.st].name}` } } : /georgetown/.test(p) ? { "@type": "City", name: "Georgetown, Massachusetts" } : { "@type": "Place", name: "Worldwide" } });
  if (Object.values(CLUSTERS).some((c) => c.hub === p) || p === "/faq") s.push({ "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: SITE + p, about: KW[p]?.keyword, isPartOf: { "@id": `${SITE}/#website` } });
  const faq = faqSchema(html); if (faq) s.push(faq);
  return s;
}

// ── build every page ──
const titles = new Map(), descs = new Map(), report = [], linksReport = [];
let wordsCut = 0;
const HUB_OF = new Set(Object.values(CLUSTERS).map((c) => c.hub));
for (const P of ALL) {
  const p = P.path;
  const cluster = CL(p), cta = primaryCta(p, cluster);
  let html = P.html;
  if (HUBS[p]) html = hubHtml(p);
  else if (p === "/faq") html = faqHub();
  else if (P.generated) { /* town + state pages are built clean */ }
  else if (!P.hand) { html = applyContentEdits(p, html); const w0 = strip(html).split(" ").length; html = addContent(p, declutterLate(p, applyContentEdits(p, declutter(p, html).html, CUTS))); wordsCut += w0 - strip(html).split(" ").length; }
  html = scrubStory(keywordize(p, html)).replace(/\bbusinesses nationwide\b/g, "businesses worldwide").replace(/we serve businesses nationwide/g, "we work with businesses worldwide").replace(/\bnationwide\b(?![^<]*Affiliate)/g, "worldwide");
  if (p === "/blog") html = blogIndex(html);
  if (TOOLS[p]) html = toolPage(p, html);
  html = extraFaq(p, html);
  html = placeForms(p, html);
  html = normalizeHero(polish(rewriteMedia(rewriteLinks(html))));
  // list items captured as <li><p>→</p><p>text</p></li>: drop the arrow paragraph and unwrap a lone <p>
  html = html.replace(/<li>\s*<p>\s*(?:→|✓|✔|•|►|▶|-|–)\s*<\/p>\s*/g, "<li>").replace(/<li>\s*<p>((?:(?!<\/?p\b)[\s\S])*)<\/p>\s*<\/li>/g, "<li>$1</li>");
  // nothing left behind when an image, link or claim was removed: empty cards, empty grids, heading-only sections
  html = html.replace(/<a class="card-link" href="[^"]*"(?: rel="noopener")?>\s*<\/a>/g, "").replace(/<div class="card">\s*<\/div>/g, "").replace(/<div class="grid[^"]*">\s*<\/div>/g, "").replace(/<section>(?:\s*(?:<p class="eyebrow">[^<]*<\/p>|<h[234]>[^<]*<\/h[234]>))*\s*<\/section>/g, "");
  html = fixHeadings(html).replace(/<img ([^>]*?)alt="Jared Casper"/g, (m, pre) => `<img ${pre}alt=""`); // avatar next to the byline text
  html = oneCta(html, cta);
  // the primary CTA is visible in the first screen of every page (tools convert inside the tool)
  if (cta && !TOOLS[p] && !["/agreement-builder", "/thank-you"].includes(p)) {
    const end = html.indexOf("</section>"), first = end > 0 ? html.slice(0, end) : "";
    if (first && !/<a class="btn" href="\/contact/.test(first)) {
      // right under the answer-first paragraph (or the H1), so it is in the first screen
      const btn = `<p class="ctas"><a class="btn" href="${cta.href}" data-cta="hero">${esc(cta.label)}</a></p>`;
      const m = first.match(/<p class="answer">[\s\S]*?<\/p>/) || first.match(/<h1>[\s\S]*?<\/h1>(?:<p>[\s\S]*?<\/p>)?/);
      const at = m ? m.index + m[0].length : end;
      html = html.slice(0, at) + btn + html.slice(at);
    }
  }
  // risk reversal right under the first-screen CTA (free, no obligation, reply time)
  if (cta && !TOOLS[p] && !NOINDEX.has(p)) { const end = html.indexOf("</section>"); const m = end > 0 && !/15-minute fit call ·/.test(html.slice(0, end)) && html.slice(0, end).match(/<p class="ctas">[\s\S]*?<\/p>/); if (m) html = html.slice(0, m.index + m[0].length) + ASSURE + html.slice(m.index + m[0].length); }
  if (p === "/sitemap") html = htmlSitemap(html);
  // visuals: an outcome illustration beside the hero (pages without their own hero media) and an icon on every card
  if (!NO_ART.has(p) && !/^\/(privacy|terms|affiliate-terms)$/.test(p)) {
    const end = html.indexOf("</section>"), first = end > 0 ? html.slice(0, end) : "";
    if (first.startsWith("<section>") && /<h1/.test(first) && !/<(img|video|iframe)\b/.test(first)) {
      html = "<section>" + heroArt(CLUSTERS[cluster] ? cluster : "about", p) + html.slice("<section>".length);
      // a card grid inside the hero would be squeezed into the text column beside the art: start a new section at the grid (with its lead-in heading or paragraph)
      const g = html.indexOf('<div class="grid'), e = html.indexOf("</section>");
      if (g > 0 && g < e) { const lead = html.slice(0, g).match(/<(h2|p)>(?:(?!<\/?(?:h2|p)\b)[\s\S])*<\/\1>$/); const cut = lead ? g - lead[0].length : g; html = html.slice(0, cut) + "</section><section>" + html.slice(cut); }
    }
  }
  html = heroDesign(p, html);
  // fit / not-fit cards: clean headings (captured as "✓We are a fit if..." / "—We are NOT a fit if...") and mark the not-fit card
  html = html.replace(/<div class="card"><h3>[^<a-zA-Z]*We are a fit if\.*…?<\/h3>/g, `<div class="card fit"><h3>We're a fit if…</h3>`)
    .replace(/<div class="card"><h3>[^<a-zA-Z]*We are NOT a fit if\.*…?<\/h3>/g, `<div class="card nofit"><h3>We're not a fit if…</h3>`);
  html = html.replace(/<div class="card( fit| nofit)?">((?:<p class="eyebrow">[^<]*<\/p>)?<h3>([\s\S]*?)<\/h3>)/g, (all, cls = "", inner, h) => `<div class="card${cls}">${iconFor(cls === " nofit" ? "shield" : h)}${inner}`);
  html = pageAids(p, html, cluster, cta);
  if (p === BOOK) html = html.replace("</section>", `<div class="founder-card"><img src="/img/t-jared-casper.jpg" alt="Jared Casper, Founder of CasperB2B" width="96" height="96" decoding="async"><div><p class="eyebrow">Who you'll talk to</p><p><b>Jared Casper</b>, Founder. He reads every request and replies personally within 1 business day.</p></div></div></section>`);
  if (HUB_OF.has(p) && p !== "/about-us" || p === "/about-us") html += clusterListing(cluster, p);
  if (p === "/services") html += allServices();
  if (p === "/") { // every service line in one screen, right after the hero
    const LINES = [["Get more customers", "/how-to-get-more-customers", "phone", "Answer every call, follow up fast and win the local search."], ["Marketing & SEO", "/marketing-and-seo", "search", "Local SEO, websites, Google Ads, email and social media."], ["B2B pipeline", "/b2b-growth", "target", "B2B lead generation, appointment setting and account-based marketing."], ["AI, apps & automation", "/ai-services", "bot", "AI chatbots, automated follow-up, custom and mobile apps."], ["Cybersecurity & IT", "/cybersecurity-and-it", "shield", "Protection, backups, managed IT and infrastructure."], ["Staffing & VAs", "/staffing", "users", "IT and contract staffing, direct hire and dedicated remote team members."], ["Free tools", "/tools", "gauge", "Quizzes and calculators that show where you're losing revenue."], ["Massachusetts & New Hampshire", "/service-areas", "pin", "Local pages for the towns we serve — and remote work worldwide."]].filter(([, h]) => KEEP.has(h));
    const grid = `<section class="lines"><h2>What we do</h2><div class="grid g4">${LINES.map(([n, h, icon, d]) => `<a class="card-link" href="${h}">${iconFor(icon)}<h3>${esc(n)}</h3><p>${esc(d)}</p></a>`).join("")}</div></section>`;
    // the restaurant offer, right after the service lines (no price here: the price guard keeps prices off "/")
    const feature = KEEP.has(RESTAURANT_AI.path) ? `<section class="feature-band"><p class="eyebrow">New for restaurants</p><h2>An AI employee that takes your orders</h2><p>We install AI that takes your restaurant's orders and books reservations, and notifies your team the moment each one comes in. One low monthly price.</p><p class="ctas"><a class="btn ghost" href="${RESTAURANT_AI.path}" data-cta="home-restaurant">See AI ordering for restaurants</a></p></section>` : "";
    const end = html.indexOf("</section>"); if (end > 0) html = html.slice(0, end + 10) + grid + feature + html.slice(end + 10);
  }
  if (p === "/niches") html += `<section class="hub-group"><h2>Every industry we work with</h2><div class="grid g3">${all.filter((x) => /^\/niches\/./.test(x)).map((x) => `<a class="card-link" href="${x}"><h3>${esc(shortName(x))}</h3><p>${esc(cardDesc(x))}</p></a>`).join("")}</div></section>`;
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
  if (P.parent && P.parent !== hub && KEEP.has(P.parent)) crumbs.push([shortName(P.parent), P.parent]);
  const segs = p.split("/").filter(Boolean);
  for (let i = 1; i < segs.length; i++) { const pre = "/" + segs.slice(0, i).join("/"); if (KEEP.has(pre) && !crumbs.some(([, x]) => x === pre)) crumbs.push([shortName(pre), pre]); }
  if (p !== "/") crumbs.push([shortName(p), p]);
  const noindex = NOINDEX.has(p) || !!KW[p]?.noindex;
  const steps = nextSteps(p, cluster, KW, (x) => KEEP.has(x) && !NOINDEX.has(x));
  const plain = ["/thank-you", "/agreement-builder"].includes(p);
  const picks = p === "/" || plain || p === BOOK ? [] : relatedPicks(p, new Set(Object.values(steps)));
  if (!plain && !noindex && p !== "/" && p !== BOOK && !TOOLS[p] && !HUBS[p]) html = midRead(p, html, cluster, steps, picks);
  const concerns = !plain && p !== BOOK && !noindex && !TOOLS[p] && !/^\/(privacy|terms|affiliate-terms|sitemap|blog|faq)$/.test(p) ? concernsBlock(p, cluster, cta, iconFor) : "";
  const tail = p === BOOK ? TRUST : plain ? "" : concerns + related(p, picks) + nextBlock(p, steps, shortName, cardDesc, cta);
  const body = `<div class="content${isPost(p) ? " article" : ""}${isPost(p) || isQuestion(p) ? " longread" : ""}" data-path="${p}">${html}${tail}</div>`;
  if (STORY.test(strip(html)) || STORY.test(title + " " + desc)) throw new Error(`${p}: still mentions the $49,000 story: ${(strip(html).match(new RegExp(".{0,60}" + STORY.source + ".{0,40}", "i")) || [""])[0]}`);
  write(p, page({ path: p, title, desc, body, crumbs: p === "/" ? null : crumbs, noindex, ogType: isPost(p) ? "article" : "website", schema: noindex ? [] : schemaFor(p, html, title, desc), cta: cta || { href: BOOK, label: "Book My 15-Minute Fit Call" }, sticky: stickyCta(cta) }));
  report.push([p, title.length, desc.length]);
  if (!noindex) linksReport.push({ p, cluster, title, h1: strip((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || ""), steps, picks, cta: cta?.href || "" });
}

// ── redirects for every old / merged URL ──
for (const [from, to] of Object.entries(REDIRECTS)) write(from, redirect(to));

// ── 404 ──
writeFileSync(join(OUT, "404.html"), page({ path: "/404", title: "Page Not Found | CasperB2B", desc: "We couldn't find the page you're looking for. Let's get you back on track to scaling your business.", noindex: true, sticky: stickyCta({ href: BOOK, label: "Book My 15-Minute Fit Call" }),
  body: `<div class="content"><section><p class="eyebrow">404</p><h1>Page not found</h1><p>We couldn't find the page you're looking for. Let's get you back on track.</p><p class="ctas"><a class="btn" href="${BOOK}" data-cta="404">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/">Return Home</a></p></section><section><h2>Popular pages</h2><div class="grid g4">${MENU.map(([k]) => [CLUSTERS[k].name, CLUSTERS[k].hub]).map(([n, h]) => `<a class="card-link" href="${h}"><h3>${esc(n)}</h3><p>${esc(cardDesc(h))}</p></a>`).join("")}</div></section></div>` }).replace(/<link rel="canonical"[^>]*>/, "")
  // GitHub Pages paths are case-sensitive and old links use capitals (e.g. /SEO-audit): retry the lowercase path once
  .replace("</head>", `<script>(function(){var p=location.pathname;if(/[A-Z]/.test(p))location.replace(p.toLowerCase()+location.search+location.hash)})()</script></head>`));

// ── sitemap.xml, robots.txt, llms.txt, CNAME, url list for IndexNow ──
const list = urls.filter(([p]) => p !== "/404");
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map(([p, d]) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `# casperb2b.com — everyone welcome, including AI search and answer engines\nUser-agent: *\nAllow: /\n\n${["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"].map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(OUT, "CNAME"), "casperb2b.com\n");
writeFileSync(join(ROOT, "data/urls.txt"), list.map(([p]) => SITE + (p === "/" ? "/" : p)).join("\n") + "\n");
const indexed = new Set(list.map(([p]) => p));
const llmsHead = readFileSync(ROOT + "content/llms.txt", "utf8").trim();
const llmsLine = (p) => `- [${shortName(p)}](${SITE}${p === "/" ? "/" : p}): ${cardDesc(p)}`;
const llms = llmsHead + "\n\n" + Object.keys(CLUSTERS).map((k) => { const items = linksReport.filter((r) => r.cluster === k).map((r) => r.p).sort((a, b) => (b === CLUSTERS[k].hub) - (a === CLUSTERS[k].hub) || (kind(a) > kind(b) ? 1 : -1)); return items.length ? `## ${CLUSTERS[k].name}\n${items.map(llmsLine).join("\n")}` : ""; }).filter(Boolean).join("\n\n") + `\n\n## Optional\n- [Sitemap](${SITE}/sitemap.xml)\n- [CasperPortal (sister product)](https://casperportal.com)\n`;
for (const m of llms.matchAll(/\]\(https:\/\/casperb2b\.com([^)]*)\)/g)) { const p = m[1].replace(/\/$/, "") || "/"; if (!indexed.has(p) && p !== "/sitemap.xml") throw new Error("llms.txt links to a page that is not indexed: " + p); }
writeFileSync(join(OUT, "llms.txt"), llms);
// llms-full.txt: plain text of every indexable page (body only), for AI assistants
const bodyText = (p) => strip(((readFileSync(join(OUT, p === "/" ? "index.html" : p.slice(1) + ".html"), "utf8").match(/<main[\s\S]*?<\/main>/) || [""])[0])
  .replace(/<nav class="crumbs[\s\S]*?<\/nav>/, "").replace(/<section class="(?:related|next)"[\s\S]*?<\/section>/g, "").replace(/<form[\s\S]*?<\/form>/g, "").replace(/<script[\s\S]*?<\/script>/g, ""));
writeFileSync(join(OUT, "llms-full.txt"), llmsHead + "\n\n" + linksReport.map((r) => `---\n# ${r.h1}\nURL: ${SITE}${r.p === "/" ? "/" : r.p}\nTopic: ${CLUSTERS[r.cluster]?.name || r.cluster}\n\n${bodyText(r.p)}\n`).join("\n"));

// ── KEYWORDS.md + LINKS.md (generated; commit them with content changes) ──
const kwRows = linksReport.map((r) => ({ ...r, kw: KW[r.p]?.keyword || "", sec: (KW[r.p]?.secondary || []).join("; ") }));
const dupKw = Object.entries(kwRows.reduce((a, r) => { if (r.kw) (a[r.kw] ||= []).push(r.p); return a; }, {})).filter(([, ps]) => ps.length > 1);
if (dupKw.length) throw new Error("two pages target the same primary keyword: " + JSON.stringify(dupKw));
const md = (s) => String(s).replace(/\|/g, "\\|");
const merged = Object.entries(REDIRECTS).filter(([from]) => !/-(ma|nh)(\/|$)|^\/(faq|playbooks|features|georgetown-ma|strategy\/ai|compare\/national)/.test(from));
writeFileSync(join(ROOT, "KEYWORDS.md"), `# KEYWORDS.md — one primary keyword per indexable page\n\nGenerated by \`npm run build\` from data/keywords.json (edit that file, not this one). ${kwRows.length} indexable pages; the build fails if two pages share a primary keyword, a title is over 60 characters or a description over 155.\n\nEvery page gets: the title and meta description below, an H1 aligned to the keyword, an answer-first intro (the page's opening or \`intro\` in keywords.json), FAQPage schema where it has questions, Service schema on service pages, Article/BlogPosting schema on questions and articles, BreadcrumbList everywhere and Organization on home and About.\n\n${Object.keys(CLUSTERS).map((k) => `## ${CLUSTERS[k].name}\n\n| Page | Primary keyword | Secondary | Title | H1 |\n|---|---|---|---|---|\n${kwRows.filter((r) => r.cluster === k).map((r) => `| ${r.p} | ${md(r.kw || "—")} | ${md(r.sec)} | ${md(r.title)} | ${md(r.h1)} |`).join("\n")}\n`).join("\n")}\n## Merged and moved URLs (redirect → page that now owns the keyword)\n\nTown × service, town FAQ, playbook and CasperPortal feature URLs are omitted here (all in data/redirects.json, ${Object.keys(REDIRECTS).length} in total).\n\n| Old URL | Now |\n|---|---|\n${merged.map(([a, b]) => `| ${a} | ${b} |`).join("\n")}\n`);
const inbound = {}; for (const r of linksReport) for (const x of [...Object.values(r.steps), ...r.picks]) if (x) inbound[x] = (inbound[x] || 0) + 1;
writeFileSync(join(ROOT, "LINKS.md"), `# LINKS.md — navigation and internal linking\n\nGenerated by \`npm run build\` (from scripts/ia.mjs and data/keywords.json).\n\n## Rules\n- Header menu grouped by visitor goal (below). Mobile: same groups in the drawer.\n- Every page: breadcrumb (Home › topic hub › section › page), a "Related in <topic>" block (same-topic siblings + the hub), and a "Your next best step" block linking the most relevant service, free tool, article and the booking page, plus the trust block.\n- One primary CTA per page: "Book My 15-Minute Fit Call" → /contact?topic=<topic> (header button, in-page buttons, sticky mobile bar, footer). Other buttons are secondary. Tools convert inside the tool with a short form.\n- Every page is one click from booking (header CTA + sticky mobile bar) — \`npm run check\` fails otherwise.\n- Topic hubs list every page in their topic, so every page is within two clicks of the menu.\n\n## Header menu\n\n${MENU.map(([k, items]) => `- **${CLUSTERS[k].name}** (hub: ${CLUSTERS[k].hub})\n${items.map(([n, h]) => h ? `  - ${n} — ${h}` : `  - **${n}**`).join("\n")}`).join("\n")}\n\n## Next best step and related links per page\n\n| Page | Topic | Service | Tool | Read next | Related | Inbound (from these blocks) |\n|---|---|---|---|---|---|---|\n${linksReport.map((r) => `| ${r.p} | ${r.cluster} | ${r.steps.service || ""} | ${r.steps.tool || ""} | ${r.steps.article || ""} | ${r.picks.join(", ")} | ${inbound[r.p] || 0} |`).join("\n")}\n`);

const long = report.filter(([, t, d]) => t > 60 || d > 155);
if (long.length) throw new Error("title/description too long: " + JSON.stringify(long));
const declutterHits = declutterReport(); if (lateReport().length) throw new Error("late declutter rules matched nothing: " + lateReport().join(" | "));
console.log(`decluttered: ${declutterHits} boilerplate blocks, ${wordsCut} words cut`);
console.log(`built ${ALL.length} pages (${list.length} in sitemap), ${Object.keys(REDIRECTS).length} redirects → dist/`);
