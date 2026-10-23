// Shared layout + helpers for casperb2b.com (static build). Brand: orange #f97316 on navy #030712 / white, Inter.
// CasperB2B is the services company. CasperPortal (casperportal.com) is a separate software platform: this site only
// describes it the way casperb2b.com does today and links out to it; nothing here speaks for casperportal.com.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const SITE = "https://casperb2b.com";
export const NAME = "CasperB2B";
export const PHONE = "1-207-222-7737";
export const PHONE_VANITY = "1-207-2-CASPER";
export const PHONE_TEL = "+12072227737";
export const EMAIL = "contact@casperb2b.com";
export const MAIL_ADDR = { street: "252 Daniel Webster Hwy #1093", city: "Nashua", region: "NH", zip: "03060" };
export const OUT = new URL("../dist/", import.meta.url).pathname;
export const BUILT = new Date().toISOString();
export const TODAY = BUILT.slice(0, 10);
export const LOGO = "/img/logo.png"; // 240px-wide copy of the live logo (scripts/images.mjs map → static/img/logo.png)
export const OG_DEFAULT = "/og.png"; // the live site's Open Graph card

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
export const strip = (h) => String(h).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

// Header menus exactly as the live site's dropdowns; footer columns as the live footer.
export const MENUS = [
  ["Software", [["What is CasperPortal", "/software/casperportal"], ["Pricing & Plans", "/pricing"], ["Contact Sales", "/contact"], ["Compare vs other CRMs", "/compare/casperportal"], ["Build Your Agreement", "/agreement-builder"]]],
  ["Virtual Assistants", [["Overview", "/casper-va"], ["Core VA Roles", "/casper-va/roles"], ["Hiring Guide", "/casper-va/hiring-guide"], ["VA vs Agency", "/casper-va/vs-agency"]]],
  ["Problems We Solve", [["Missed Calls", "/problems/missed-calls"], ["Missed Leads", "/problems/missed-leads"], ["No Follow-Up", "/problems/no-follow-up"], ["No Pipeline Visibility", "/problems/no-pipeline-visibility"], ["Too Many Tools", "/problems/too-many-tools"], ["Low Conversion", "/problems/low-conversion"], ["Reviews Stagnant", "/problems/reviews-stagnant"]]],
  ["Services", [["Lead Generation", "/services/lead-generation"], ["Email Marketing", "/services/email-marketing"], ["Reputation Management", "/services/reputation-management"], ["Social Media Growth", "/services/social-media-growth"], ["SEO Services", "/services/seo"], ["Local SEO", "/services/local-seo"], ["PPC Management", "/services/ppc"], ["Social Media Ads", "/services/social-media-ads"], ["Web Development", "/services/web-development"], ["Graphic Design", "/services/graphic-design"], ["Cybersecurity", "/services/cybersecurity"], ["Managed IT", "/services/managed-it"], ["AI Chatbots", "/ai-services"]]],
];
export const FOOTER = [
  ["Software", [["What is CasperPortal", "/software/casperportal"], ["Pricing", "/pricing"], ["Contact Sales", "/contact"], ["Compare vs other CRMs", "/compare/casperportal"], ["Build Your Agreement", "/agreement-builder"]]],
  ["Virtual Assistants", [["Overview", "/casper-va"], ["Core VA Roles", "/casper-va/roles"], ["Hiring Guide", "/casper-va/hiring-guide"], ["VA vs Agency", "/casper-va/vs-agency"]]],
  ["Problems We Solve", MENUS[2][1]],
  ["Services", [["Lead Generation", "/services/lead-generation"], ["SEO Services", "/services/seo"], ["PPC Management", "/services/ppc"], ["Web Development", "/services/web-development"], ["Cybersecurity", "/services/cybersecurity"], ["Managed IT", "/services/managed-it"]]],
  ["Company", [["About", "/about-us"], ["Our Team", "/our-team"], ["Contact", "/contact"], ["Blog", "/blog"], ["Free Tools", "/tools"]]],
];

export const ORG_ID = `${SITE}/#organization`;
export const ORG = {
  "@type": "Organization", "@id": ORG_ID, name: NAME, legalName: NAME, url: SITE + "/",
  logo: { "@type": "ImageObject", url: SITE + LOGO }, image: SITE + OG_DEFAULT,
  description: "CasperB2B is a business services company providing website design, CRM setup, marketing automation, SEO, cybersecurity, and implementation services for businesses nationwide.",
  telephone: PHONE_TEL, email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: MAIL_ADDR.street, addressLocality: MAIL_ADDR.city, addressRegion: MAIL_ADDR.region, postalCode: MAIL_ADDR.zip, addressCountry: "US", description: "Mailing address" },
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: PHONE_TEL, email: EMAIL, areaServed: "US", availableLanguage: "English" }],
  areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "AdministrativeArea", name: "North Shore, Massachusetts" }, { "@type": "AdministrativeArea", name: "Southern New Hampshire" }],
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

const navLink = (n, h, path) => `<a href="${h}"${path === h ? ' aria-current="page"' : ""}>${esc(n)}</a>`;

/** The page shell. crumbs = [[name, path], ...] (visible breadcrumb + BreadcrumbList). */
export function page({ path, title, desc, body, schema = [], crumbs, noindex = false, ogType = "website", image, lastmod = TODAY }) {
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
<meta name="theme-color" content="#f97316"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${TODAY}">
${nodes.map(ld).join("")}
</head><body>
<a class="skip" href="#main">Skip to main content</a>
<header class="top"><div class="wrap row">
<a class="logo" href="/" aria-label="${NAME} home"><img src="${LOGO}" alt="${NAME} logo" width="63" height="44"><span>Casper<b>B2B</b></span></a>
<nav class="mainnav" aria-label="Main">${MENUS.map(([n, items]) => `<div class="menu"><button type="button" aria-expanded="false" aria-haspopup="true">${esc(n)}</button><div class="drop">${items.map(([a, h]) => navLink(a, h, path)).join("")}</div></div>`).join("")}</nav>
<a class="btn sm topcta" href="/contact">Request My 15-Minute Fit Call</a>
<button class="burger" type="button" data-burger aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button></div>
<nav class="drawer" id="drawer" data-drawer aria-label="Mobile" hidden>${MENUS.map(([n, items]) => `<details><summary>${esc(n)}</summary>${items.map(([a, h]) => navLink(a, h, path)).join("")}</details>`).join("")}<a href="/about-us">About</a><a href="/blog">Blog</a><a href="/tools">Free Tools</a><a class="btn" href="/contact">Request My 15-Minute Fit Call</a></nav></header>
<main id="main" tabindex="-1">${crumbs && crumbs.length > 1 ? `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map(([n, p], i) => `<li>${i < crumbs.length - 1 ? `<a href="${p}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join("")}</ol></nav>` : ""}${body}</main>
<footer class="foot">
<div class="wrap">
<div class="foot-cta"><div><h2>Ready to grow your business?</h2><p>Stop wasting money on random marketing. Get a structured plan from a team you can trust.</p><p class="ctas"><a class="btn" href="/contact">Request My 15-Minute Fit Call</a> <a class="btn ghost" href="/quiz">Find My Biggest Revenue Leak</a></p></div>
<div class="news"><h2 class="h3">Get Growth Insights</h2><p>Get the growth strategy that actually works for local businesses. One email per week.</p>${newsletterForm("Newsletter Subscription - Footer", ["newsletter_subscriber", "footer_signup"], "foot")}</div></div>
<nav class="cols" aria-label="Footer">${FOOTER.map(([n, items]) => `<div><h2 class="h4">${esc(n)}</h2><ul>${items.map(([a, h]) => `<li><a href="${h}">${esc(a)}</a></li>`).join("")}</ul></div>`).join("")}</nav>
<div class="foot-bottom"><div class="contact"><a class="logo" href="/"><img src="${LOGO}" alt="" width="63" height="44" loading="lazy"><span>Casper<b>B2B</b></span></a>
<p><a href="tel:${PHONE_TEL}">${PHONE_VANITY} (${PHONE})</a><br>${esc(MAIL_ADDR.street)}, ${MAIL_ADDR.city}, ${MAIL_ADDR.region} ${MAIL_ADDR.zip} (Mailing)<br><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
<div><p class="legal"><a href="/service-areas">Service Areas</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/agreement-builder">Agreement Builder</a><a href="/sitemap">Sitemap</a><a href="#" data-cookie-settings>Cookie settings</a></p>
<p class="fine">© ${TODAY.slice(0, 4)} Casper B2B. All rights reserved. CasperPortal is a separate software platform at <a href="https://casperportal.com" rel="noopener">casperportal.com</a>.</p></div></div>
</div></footer>
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
