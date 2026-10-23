// Information architecture for casperb2b.com: the header menu (grouped by what the visitor wants), cluster hubs,
// the one primary call to action per page, the "next best step" block and the trust block.
// Every page belongs to one cluster. data/keywords.json (from the keyword plan, see KEYWORDS.md) can set a page's
// cluster and its next steps; otherwise the rules below decide.
import { esc, PHONE, PHONE_TEL } from "./lib.mjs";

export const BOOK = "/contact"; // the 15-minute fit call form (GHL webhook); there is no separate calendar embed
export const BOOK_LABEL = "Book My 15-Minute Fit Call";

// cluster key → menu label, hub page, default next steps, primary CTA, contact-form topic preselect
export const CLUSTERS = {
  customers: { name: "Get more customers", hub: "/how-to-get-more-customers", topic: "marketing",
    next: { service: "/services/lead-generation", tool: "/quiz", article: "/make-my-phone-ring" } },
  marketing: { name: "Marketing & SEO", hub: "/marketing-and-seo", topic: "seo",
    next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/how-much-does-seo-cost" } },
  ai: { name: "AI, apps & automation", hub: "/ai-services", topic: "automation",
    next: { service: "/services/ai-automation", tool: "/tools/ai-search-readiness", article: "/what-is-an-ai-chatbot-and-do-i-need-one" } },
  cyber: { name: "Cybersecurity & IT", hub: "/cybersecurity-and-it", topic: "cybersecurity",
    next: { service: "/services/cybersecurity", tool: "/tools/cyber-risk-quiz", article: "/is-my-business-too-small-to-hack" } },
  va: { name: "Staffing & VAs", hub: "/staffing", topic: "va",
    next: { service: "/staffing/it-staffing", tool: "/tools/roi-calculator", article: "/casper-va/hiring-guide" } },
  tools: { name: "Free tools", hub: "/tools", topic: "other",
    next: { service: "/services", tool: "/quiz", article: "/how-to-get-more-customers" } },
  resources: { name: "Resources", hub: "/resources", topic: "other",
    next: { service: "/services", tool: "/quiz", article: "/blog" } },
  local: { name: "Service areas", hub: "/service-areas", topic: "marketing",
    next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" } },
  about: { name: "About", hub: "/about-us", topic: "other",
    next: { service: "/services", tool: "/quiz", article: "/our-process" } },
};

// Header menu, in visitor-goal order. Items must be built pages (the build fails otherwise).
export const MENU = [
  ["customers", [["How to get more customers", "/how-to-get-more-customers"], ["Make my phone ring", "/make-my-phone-ring"], ["Local lead generation", "/services/lead-generation"], ["B2B pipeline generation", "/b2b-growth"], ["B2B lead generation", "/services/b2b-lead-generation"], ["Appointment setting", "/services/appointment-setting"], ["Demand generation", "/services/demand-generation"], ["Account-based marketing", "/services/account-based-marketing"], ["Get more 5-star reviews", "/how-to-get-more-5-star-reviews"], ["Industries we serve", "/niches"], ["Find my biggest revenue leak", "/quiz"]]],
  ["marketing", [["Marketing & SEO overview", "/marketing-and-seo"], ["SEO services", "/services/seo"], ["Local SEO", "/services/local-seo"], ["Get on Google Maps", "/get-my-business-on-google"], ["PPC & Google Ads", "/services/ppc"], ["Website design", "/services/web-development"], ["Email marketing", "/services/email-marketing"], ["Social media", "/services/social-media-growth"], ["Free SEO audit", "/seo-audit"], ["What does SEO cost?", "/how-much-does-seo-cost"]]],
  ["ai", [["AI services overview", "/ai-services"], ["AI automation", "/services/ai-automation"], ["AI chatbots", "/services/ai-chatbots"], ["Do I need an AI chatbot?", "/what-is-an-ai-chatbot-and-do-i-need-one"], ["Will AI replace my business?", "/will-ai-replace-my-business"], ["Custom apps", "/services/custom-apps"], ["Mobile app development", "/services/mobile-app-development"], ["App maintenance & support", "/services/application-maintenance"], ["Software testing & QA", "/services/software-testing"], ["Analytics & data", "/services/analytics-data"], ["AI search readiness check", "/tools/ai-search-readiness"]]],
  ["cyber", [["Cybersecurity & IT overview", "/cybersecurity-and-it"], ["Cybersecurity services", "/services/cybersecurity"], ["Managed IT", "/services/managed-it"], ["IT infrastructure", "/services/it-infrastructure"], ["Cloud computing", "/services/cloud-computing"], ["Backup & recovery", "/services/backup-and-recovery"], ["Performance monitoring", "/services/performance-monitoring"], ["Website care (CasperCare)", "/caspercare"], ["Too small to get hacked?", "/is-my-business-too-small-to-hack"], ["What if I get hacked?", "/what-happens-if-i-get-hacked"], ["Do I need an IT person?", "/do-i-need-an-it-person"], ["Cyber risk quiz", "/tools/cyber-risk-quiz"]]],
  ["va", [["Staffing overview", "/staffing"], ["IT staffing", "/staffing/it-staffing"], ["Contingent staffing", "/staffing/contingent-staffing"], ["Project staffing", "/staffing/project-staffing"], ["Direct hire", "/staffing/direct-hire"], ["AI, ML & data staffing", "/staffing/ai-ml-data-staffing"], ["Cloud staffing", "/staffing/cloud-staffing"], ["Casper VA: dedicated remote staff", "/casper-va"], ["VA roles", "/casper-va/roles"], ["Join our talent network", "/careers"]]],
  ["tools", [["All free tools", "/tools"], ["Revenue leak quiz", "/quiz"], ["Website grader", "/tools/website-grader"], ["SEO checklist", "/tools/seo-checklist"], ["ROI calculator", "/tools/roi-calculator"], ["Marketing budget calculator", "/tools/marketing-budget-calculator"], ["AI search readiness", "/tools/ai-search-readiness"], ["Cyber risk quiz", "/tools/cyber-risk-quiz"]]],
  ["resources", [["All resources", "/resources"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Glossary", "/glossary"], ["Should I hire an agency?", "/should-i-hire-an-agency-or-do-it-myself"], ["What does a website cost?", "/how-much-does-a-website-cost"], ["Newsletter", "/newsletter"], ["Service areas", "/service-areas"], ["Massachusetts", "/massachusetts"], ["New Hampshire", "/new-hampshire"]]],
  ["about", [["About CasperB2B", "/about-us"], ["Our process", "/our-process"], ["What we do for you", "/done-for-you"], ["After you sign", "/onboarding"], ["Portfolio", "/portfolio"], ["How pricing works", "/pricing"], ["Jared Casper", "/author/jared-casper"], ["Press kit", "/press-kit"], ["Contact", "/contact"]]],
];

const ARTICLES = ["/the-cost-of-inaction", "/the-premium-on-execution", "/vanity-metrics", "/leadership-removing-friction", "/roi-of-dedicated-va", "/in-defense-of-holding-grudges", "/motivation-drivers", "/what-is-an-ai-chatbot-and-do-i-need-one"];
export const isPost = (p) => /^\/blog\/[^/]+$/.test(p) || ARTICLES.includes(p);
export const isQuestion = (p) => /^\/(how-|why-|is-|should-|make-my-|get-my-|keep-my-|what-happens-|do-i-need-|will-ai-)/.test(p);

/** Cluster for a page: keywords.json wins, then path rules. */
export function clusterOf(p, kw = {}) {
  if (kw[p]?.cluster && CLUSTERS[kw[p].cluster]) return kw[p].cluster;
  for (const [k, c] of Object.entries(CLUSTERS)) if (c.hub === p) return k;
  if (p.startsWith("/casper-va") || p === "/roi-of-dedicated-va") return "va";
  if (p.startsWith("/tools") || p === "/quiz") return "tools";
  if (/cyber|hack|managed-it|cloud-computing|it-person|caspercare|phishing|antivirus|data-breach|secure-crm/.test(p)) return "cyber";
  if (/\bai\b|ai-|chatbot|automation|custom-apps|analytics|crm/.test(p)) return "ai";
  if (/^\/(problems|niches)|more-customers|more-patients|more-clients|more-buyers|restaurant|phone-ring|reviews|competitors|growing|lead-generation|reputation|conversion|missed|follow-up/.test(p)) return "customers";
  if (/^\/(services|seo|strategy)|seo|google|website|web-|ppc|social|email|marketing|logo|brand-style|graphic|listings|content|speed|georgetown|landing/.test(p)) return "marketing";
  if (isPost(p) || /^\/(blog|glossary|faq|newsletter|news|resources|service-areas)/.test(p)) return "resources";
  return "about";
}

/** The page's one primary CTA: tools convert inside the tool, everything else books the fit call. */
export function primaryCta(p, cluster) {
  const topic = CLUSTERS[cluster]?.topic || "other";
  if (p === BOOK || p === "/thank-you") return null;
  if (p === "/careers") return { href: "/careers#apply", label: "Apply to the Talent Network" }; // candidates, not buyers
  return { href: `${BOOK}?topic=${topic}`, label: BOOK_LABEL };
}

/** Next best step: most relevant service, tool, article + booking. Never links the page to itself. */
export function nextSteps(p, cluster, kw = {}, exists = () => true) {
  const d = CLUSTERS[cluster]?.next || CLUSTERS.about.next, own = kw[p]?.next || {};
  const alt = { service: ["/services", "/done-for-you"], tool: ["/quiz", "/tools"], article: ["/how-to-get-more-customers", "/blog"] };
  const pick = (k) => [own[k], d[k], ...alt[k]].find((x) => x && x !== p && exists(x));
  return { service: pick("service"), tool: pick("tool"), article: pick("article") };
}

// Trust block: only verifiable facts (founders, real portfolio, how to reach a person).
export const TRUST = `<div class="trust" aria-label="Why CasperB2B"><ul>
<li><b>Founder-led.</b> Built by <a href="/author/jared-casper">Jared Casper</a> (Founder) and <a href="/mark-casper">Mark Casper</a> (Co-Founder).</li>
<li><b>Real projects.</b> We built and run <a href="/portfolio">CarSales AI, FMYCAR, NextWeigh, MC Sales Training and FBK Marketing</a>.</li>
<li><b>A person answers.</b> Every request gets a personal reply within 1 business day. Call or text <a href="tel:${PHONE_TEL}" data-cta="trust-call">${PHONE}</a>.</li>
<li><b>Done for you.</b> We build, set up and run the system — <a href="/done-for-you">see exactly what we do</a>.</li></ul></div>`;

export function nextBlock(p, steps, names, descs, cta) {
  const card = (kind, label, href) => href ? `<a class="card-link step" href="${href}" data-cta="next-${kind}"><p class="eyebrow">${label}</p><h3>${esc(names(href))}</h3><p>${esc(descs(href))}</p></a>` : "";
  return `<section class="next" aria-labelledby="next-h"><h2 id="next-h">Your next best step</h2><div class="grid g4">${card("service", "Service", steps.service)}${card("tool", "Free tool", steps.tool)}${card("article", "Read next", steps.article)}<a class="card-link step book" href="${cta ? cta.href : BOOK}" data-cta="next-book"><p class="eyebrow">Talk to us</p><h3>Book a 15-minute fit call</h3><p>Tell us what's leaking time or revenue. You get a personal reply within 1 business day.</p></a></div>${TRUST}</section>`;
}

/** Sticky mobile CTA bar (hidden on wide screens by CSS). */
export const stickyCta = (cta) => cta ? `<div class="mcta" role="region" aria-label="Quick contact"><a class="btn" href="${cta.href}" data-cta="sticky">${esc(cta.label)}</a><a class="btn ghost call" href="tel:${PHONE_TEL}" data-cta="sticky-call" aria-label="Call ${PHONE}">Call</a></div>` : "";
