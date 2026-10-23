// Shared layout + helpers for casperb2b.com (static build). Brand: orange #f97316 on navy #030712 / white, Inter.
// CasperB2B is the services company. CasperPortal (casperportal.com) is a separate software platform: this site only
// describes it the way casperb2b.com does today and links out to it; nothing here speaks for casperportal.com.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const SITE = "https://casperb2b.com";
export const NAME = "CasperB2B";
export const PHONE = "1-207-222-7737";
export const PHONE_VANITY = "1-207-2-CASPER";
export const PHONE_TEL = "+12072227737";
export const EMAIL = "contact@casperb2b.com";
export const MAIL_ADDR = { street: "252 Daniel Webster Hwy #1093", city: "Nashua", region: "NH", zip: "03060" };
export const OUT = fileURLToPath(new URL("../dist/", import.meta.url));
export const BUILT = new Date().toISOString();
export const TODAY = BUILT.slice(0, 10);
export const LOGO = "/img/logo.png"; // 240px-wide copy of the live logo (scripts/images.mjs map → static/img/logo.png)
export const OG_DEFAULT = "/og.png"; // the live site's Open Graph card

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
export const strip = (h) => String(h).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

// Header menus and footer columns: set by build.mjs from scripts/ia.mjs (grouped by visitor goal).
// menus/footer = [[label, [[name, path], ...]], ...]
export const NAV = { menus: [], footer: [] };

export const ORG_ID = `${SITE}/#organization`;
export const ORG = {
  "@type": "Organization", "@id": ORG_ID, name: NAME, legalName: NAME, url: SITE + "/",
  logo: { "@type": "ImageObject", url: SITE + LOGO }, image: SITE + OG_DEFAULT,
  description: "CasperB2B is a business services company providing website design, CRM setup, marketing automation, SEO, cybersecurity, and implementation services for businesses worldwide, with a local focus on Massachusetts and New Hampshire.",
  slogan: "Get found. Answer every lead. Stay secure.",
  knowsAbout: ["Local SEO", "Search engine optimization", "Generative engine optimization", "Website design", "Google Ads", "Email marketing", "CRM setup", "Marketing automation", "AI chatbots", "Missed-call text back", "Reputation management", "Cybersecurity for small businesses", "Managed IT services", "Virtual assistants", "B2B lead generation", "B2B appointment setting", "Demand generation", "Account-based marketing", "Mobile app development", "Software testing", "IT infrastructure", "Data backup and recovery", "IT staffing", "Contingent staffing", "Direct hire recruiting", "Cloud staffing"],
  telephone: PHONE_TEL, email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: MAIL_ADDR.street, addressLocality: MAIL_ADDR.city, addressRegion: MAIL_ADDR.region, postalCode: MAIL_ADDR.zip, addressCountry: "US", description: "Mailing address" },
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: PHONE_TEL, email: EMAIL, areaServed: "Worldwide", availableLanguage: "English" }],
  areaServed: [{ "@type": "Place", name: "Worldwide" }, { "@type": "Country", name: "United States" }, { "@type": "State", name: "Massachusetts" }, { "@type": "State", name: "New Hampshire" }],
  founder: [{ "@type": "Person", "@id": `${SITE}/author/jared-casper#person`, name: "Jared Casper", jobTitle: "Founder", url: `${SITE}/author/jared-casper` }, { "@type": "Person", "@id": `${SITE}/mark-casper#person`, name: "Mark Casper", jobTitle: "Co-Founder", url: `${SITE}/mark-casper` }],
  sameAs: ["https://www.linkedin.com/in/jaredcasper94/", "https://www.facebook.com/jaredcasper94/"],
};
export const ORG_REF = { "@type": "Organization", "@id": ORG_ID, name: NAME, url: SITE + "/" };

export const urls = []; // [path, lastmod] of indexable pages, for sitemap.xml
export function write(path, html) {
  const file = join(OUT, path === "/" ? "index.html" : path.endsWith("/") ? path + "index.html" : path + (/\.[a-z0-9]+$/i.test(path) ? "" : "/index.html"));
  mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html);
  // GitHub Pages answers /pricing with a 301 to /pricing/ when only pricing/index.html exists; a sibling pricing.html
  // makes /pricing itself a 200, matching every canonical, link and sitemap entry.
  if (path !== "/" && !path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) writeFileSync(join(OUT, path + ".html"), html);
}

// footer: spread the menu groups over k stacks of similar height; each stack keeps menu order
// (tries every assignment; fine for the ~8 groups a footer has). Items keep { g, i } so phones can show menu order.
function footStacks(groups, k) {
  const xs = groups.map((g, i) => ({ g, i, w: g[1].length + g[1].filter(([, h]) => !h).length * 0.6 + 3 }));
  const a = new Array(xs.length).fill(0); let best = Infinity, pick = [];
  const rec = (j) => {
    if (j === xs.length) { const s = new Array(k).fill(0); xs.forEach((x, t) => (s[a[t]] += x.w)); const m = Math.max(...s); if (m < best) { best = m; pick = [...a]; } return; }
    for (let c = 0; c < k; c++) { a[j] = c; rec(j + 1); if (j === 0) break; } // first group always in column 1
  };
  rec(0);
  return Array.from({ length: k }, (_, c) => xs.filter((_, t) => pick[t] === c)).filter((c) => c.length).sort((p, q) => p[0].i - q[0].i);
}
const footGroup = ({ g: [n, items], i }) => `<details class="fgroup" open style="order:${i}"><summary>${esc(n)}</summary><ul>${items.map(([a, h]) => h ? `<li><a href="${h}">${esc(a)}</a></li>` : `<li class="foot-head">${esc(a)}</li>`).join("")}</ul></details>`;
const SVG = (d, extra = "") => `<svg viewBox="0 0 24 24" aria-hidden="true"${extra}>${d}</svg>`;
const ICO = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
};
const SOCIAL = [
  ["LinkedIn", "https://www.linkedin.com/in/jaredcasper94/", '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/>'],
  ["Facebook", "https://www.facebook.com/jaredcasper94/", '<path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.55.45-1 1-1z"/>'],
];
// facts only (founder-led, reply time and signed scope are stated on /contact and /about-us)
const PROOF = [
  [ICO.user, "Founder-led", "You work directly with Jared and Mark Casper."],
  [ICO.clock, "Personal reply in 1 business day", "Every request is answered by a person."],
  [ICO.doc, "Signed scope before work starts", "You know what you get before you commit."],
  [ICO.globe, "Local in MA & NH, remote worldwide", "Founded in Georgetown, MA."],
];
const navLink = (n, h, path) => h ? `<a href="${h}"${path === h ? ' aria-current="page"' : ""}>${esc(n)}</a>` : `<span class="drop-head">${esc(n)}</span>`;

/** The page shell. crumbs = [[name, path], ...] (visible breadcrumb + BreadcrumbList). */
export function page({ path, title, desc, body, schema = [], crumbs, noindex = false, ogType = "website", image, lastmod = TODAY, cta = { href: "/contact", label: "Book My 15-Minute Fit Call" }, sticky = "" }) {
  const ctaHref = cta ? cta.href : "/contact";
  const url = SITE + (path === "/" ? "/" : path);
  const og = SITE + (image || OG_DEFAULT);
  const nodes = [{ "@context": "https://schema.org", "@type": "WebPage", "@id": url + "#webpage", url, name: title, description: desc, inLanguage: "en-US", dateModified: lastmod,
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, name: NAME, url: SITE + "/" }, publisher: ORG_REF }, ...schema];
  if (crumbs && crumbs.length > 1) nodes.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + (p === "/" ? "/" : p) })) });
  if (!noindex) urls.push([path, lastmod]);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">
<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="${NAME}"><meta property="og:locale" content="en_US"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(NAME)} — Business Growth Services">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${og}">
<meta name="theme-color" content="#f97316"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${TODAY}">
${nodes.map(ld).join("")}
</head><body>
<a class="skip" href="#main">Skip to main content</a>
<header class="top"><div class="wrap row">
<a class="logo" href="/" aria-label="${NAME} home"><img src="${LOGO}" alt="${NAME}" width="80" height="56"></a>
<a class="topphone" href="tel:${PHONE_TEL}" data-cta="header-call"><span class="tp-ico">${SVG(ICO.phone)}</span><span><small>Talk to a founder</small>${PHONE}</span></a>
<a class="btn sm topcta" href="${ctaHref}" data-cta="header">Book a Fit Call</a>
<button class="burger" type="button" data-burger aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button></div>
<nav class="mainnav" aria-label="Main"><div class="wrap">${NAV.menus.map(([n, items], i) => `<div class="menu${i >= NAV.menus.length - 2 ? " end" : ""}${items.some(([, h]) => !h) ? " grouped" : ""}${items.some(([, h]) => h === path) ? " current" : ""}"><button type="button" aria-expanded="false" aria-haspopup="true">${esc(n)}</button><div class="drop">${items.map(([a, h]) => navLink(a, h, path)).join("")}</div></div>`).join("")}</div></nav>
<nav class="drawer" id="drawer" data-drawer aria-label="Mobile" hidden>${NAV.menus.map(([n, items]) => `<details><summary>${esc(n)}</summary>${items.map(([a, h]) => navLink(a, h, path)).join("")}</details>`).join("")}<a class="btn" href="${ctaHref}" data-cta="drawer">Book My 15-Minute Fit Call</a><a class="drawer-call" href="tel:${PHONE_TEL}" data-cta="drawer-call">${SVG(ICO.phone)}Call ${PHONE}</a></nav></header>
<div class="print-head" aria-hidden="true"><img src="${LOGO}" alt="" width="57" height="40"><span>casperb2b.com · ${PHONE} · ${EMAIL}</span><span class="print-url">${url}</span></div>
<main id="main" tabindex="-1">${crumbs && crumbs.length > 1 ? `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map(([n, p], i) => `<li>${i < crumbs.length - 1 ? `<a href="${p}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join("")}</ol></nav>` : ""}${body}</main>
<footer class="foot">
<div class="wrap">
<div class="foot-cta"><div><h2>Ready to grow your business?</h2><p>Tell us what's leaking time or revenue. In 15 minutes we'll tell you what to fix first — and whether we're the right team to fix it.</p><p class="ctas"><a class="btn" href="${ctaHref}" data-cta="footer">Book My 15-Minute Fit Call</a> <a href="/quiz" data-cta="footer-quiz">Not ready? Find your biggest revenue leak →</a></p></div>
<div class="news"><h2 class="h3">Get Growth Insights</h2><p>Get the growth strategy that actually works for local businesses. One email per week.</p>${newsletterForm("Newsletter Subscription - Footer", ["newsletter_subscriber", "footer_signup"], "foot")}</div></div>
<ul class="foot-proof">${PROOF.map(([i, b, s]) => `<li><span class="fp-ico">${SVG(i)}</span><span><b>${esc(b)}</b>${esc(s)}</span></li>`).join("")}</ul>
<div class="foot-main">
<div class="foot-brand"><a class="logo" href="/" aria-label="${NAME} home"><img src="${LOGO}" alt="${NAME}" width="80" height="56" loading="lazy"></a>
<p class="foot-tag">Founder-led marketing, IT and staffing for small businesses — set up and run for you.</p>
<ul class="foot-contact"><li>${SVG(ICO.phone)}<a href="tel:${PHONE_TEL}" data-cta="footer-call">${PHONE_VANITY}<span>${PHONE}</span></a></li><li>${SVG(ICO.mail)}<a href="mailto:${EMAIL}">${EMAIL}</a></li><li>${SVG(ICO.pin)}<span>${esc(MAIL_ADDR.street)}, ${MAIL_ADDR.city}, ${MAIL_ADDR.region} ${MAIL_ADDR.zip}<small>Mailing address</small></span></li></ul>
<div class="foot-actions"><a class="btn sm" href="${ctaHref}" data-cta="footer-brand">Book a Fit Call</a><span class="foot-social">${SOCIAL.map(([n, h, d]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="Jared Casper on ${n}">${SVG(d)}</a>`).join("")}</span></div></div>
${(() => { // "Free tools" sits under the brand block (fills that column); the rest pair up into 4 even stacks
  const all = NAV.footer.map((g, i) => ({ g, i })), side = all.filter(({ g }) => /^free tools$/i.test(g[0]));
  return `<nav class="foot-side" aria-label="Free tools">${side.map(footGroup).join("")}</nav><nav class="cols" aria-label="Footer">${footStacks(all.filter((x) => !side.includes(x)).map((x) => x.g), 4)
    .map((stack) => `<div class="fcol">${stack.map((x) => footGroup({ g: x.g, i: all.find((y) => y.g === x.g).i })).join("")}</div>`).join("")}</nav>`;
})()}
</div>
<div class="foot-bottom"><p class="fine">© ${TODAY.slice(0, 4)} Casper B2B. All rights reserved. Sister product: <a href="https://casperportal.com" rel="noopener">CasperPortal</a>, our all-in-one CRM software.</p>
<p class="legal"><a href="/service-areas">Service Areas</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/affiliate">Partner program</a><a href="/sitemap">Sitemap</a><a href="#" data-cookie-settings>Cookie settings</a></p>
<a class="totop" href="#main">${SVG(ICO.up)}Back to top</a></div>
</div></footer>${sticky}
<div class="talk" data-talk><button type="button" class="talk-btn" aria-expanded="false" aria-controls="talk-panel"><img src="/img/jared-casper.webp" alt="" width="36" height="36" loading="lazy"><span>Let's talk</span></button>
<div class="talk-panel" id="talk-panel" hidden><p class="talk-who"><b>Jared Casper</b><span>Founder of CasperB2B</span></p><p>I help businesses build systems that actually bring in customers.</p><p class="ctas"><a class="btn sm" href="tel:${PHONE_TEL}">Call (207) 222-7737</a> <a class="btn sm ghost" href="sms:${PHONE_TEL}">Text us</a></p><p class="fine">Text us from your phone at (207) 222-7737</p></div></div>
<script src="/assets/site.js?v=${TODAY}" defer></script><script src="/assets/forms.js?v=${TODAY}" defer></script><script src="/assets/t.js" data-site="casperb2b" data-banner="1" defer></script>
</body></html>`;
}

// ── forms: every form posts the same JSON payload the live site sent to its GoHighLevel inbound webhook (see forms.js) ──
export const WEBHOOK = "https://services.leadconnectorhq.com/hooks/TLBXLD9M7LensL45PB90/webhook-trigger/bee537ba-8323-4437-9b8a-6d861e808c0e";
let formN = 0;
const field = ({ name, label, type = "text", required = false, options, placeholder = "", autocomplete = "", rows }) => {
  const id = `f${++formN}-${name.replace(/[^a-z0-9]+/gi, "-")}`;
  const req = required ? " required" : "";
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : "";
  if (type === "select") return `<div class="field"><label for="${id}">${esc(label)}</label><select id="${id}" name="${esc(name)}"${req}><option value="">Select an option...</option>${options.map((o) => Array.isArray(o) ? `<option value="${esc(o[0])}">${esc(o[1])}</option>` : `<option>${esc(o)}</option>`).join("")}</select></div>`;
  if (type === "textarea") return `<div class="field wide"><label for="${id}">${esc(label)}</label><textarea id="${id}" name="${esc(name)}" rows="${rows || 4}"${req}${placeholder ? ` placeholder="${esc(placeholder)}"` : ""}></textarea></div>`;
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${esc(name)}" type="${type}"${req}${ac}${placeholder ? ` placeholder="${esc(placeholder)}"` : ""}></div>`;
};
/** A lead form. spec = { id (live formId), fields, tags, submit, success, notes (template with {field} placeholders), note } */
export function leadForm(spec) {
  return `<form class="lead" data-form-id="${esc(spec.id)}" data-tags="${esc((spec.tags || []).join(","))}"${spec.notes ? ` data-notes="${esc(spec.notes)}"` : ""} data-success="${esc(spec.success || "Request received. Expect a personal reply within 1 business day.")}" novalidate>
<div class="fields">${spec.fields.map(field).join("")}</div>
<button class="btn" type="submit">${esc(spec.submit || "Submit")}</button>${spec.note ? `<p class="fine">${esc(spec.note)}</p>` : ""}<p class="form-msg" role="status" aria-live="polite"></p></form>`;
}
export function newsletterForm(id, tags, key = "n") {
  const fid = `nl-${key}-${++formN}`;
  return `<form class="lead inline" data-form-id="${esc(id)}" data-tags="${esc(tags.join(","))}" data-success="Subscribed! You'll receive our next growth insights email." novalidate><label class="sr-only" for="${fid}">Email address</label><input id="${fid}" type="email" name="email" placeholder="Enter your email" autocomplete="email" required><button class="btn" type="submit">Subscribe</button><p class="form-msg" role="status" aria-live="polite"></p></form>`;
}

/** Redirect page for a legacy URL (GitHub Pages serves it with a 200, so it carries canonical + meta refresh + noindex). */
export const redirect = (to) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved | ${NAME}</title><meta name="robots" content="noindex"><link rel="canonical" href="${SITE}${to === "/" ? "/" : to}"><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(to)}+location.hash)</script></head><body><p>This page moved to <a href="${to}">${SITE}${to}</a>.</p></body></html>`;
