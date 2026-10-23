// Removes template boilerplate that was repeated across many captured pages (generic process steps, "why trust us"
// blocks, timelines, before/after grids, duplicate CTA boxes, link lists the build already adds). Every page already
// gets one hero CTA, "Related in <topic>", "Your next best step" and a trust block from the build, so these only add bloat.
// Each rule must remove something on at least one page, or the build fails (so dead rules don't pile up).

// whole <section>s whose html contains the marker (scope = path regex, default all pages)
const SECTIONS = [
  [/What to Expect — and When/],
  [/Why growing businesses trust CasperB2B/],
  [/Let&#39;s Build Your Growth Plan|Let's Build Your Growth Plan/],
  [/<h2>Related Resources<\/h2>/],
  [/A transparent, step-by-step approach to delivering results/],
  [/<h2>Other Industries We Serve<\/h2>/],
  [/<h2>Ready to Grow Your [^<]*\?<\/h2>/],
  [/<h2>Related Services for /],
  [/Fragmented &amp; Inconsistent/],
  [/<h2>Is this happening in your business\?<\/h2>/],
  [/>Related Local Services/],
  [/<h2>Latest Insights<\/h2>/, /^\/about-us$/],
  [/Want to see your workflow mapped/],
  [/<h2>The Ecosystem<\/h2>/],
  [/<h2>Why we do things differently<\/h2>/, /^\/(seo-audit|pricing)$/],
  [/<h2>Real projects we actually built<\/h2>/, /^\/(seo-audit|georgetown-ma|services)$/],
];
// fragments inside sections
const FRAGMENTS = [
  [/<p>✓? ?Done-for-you execution<\/p><p>Fast turnaround<\/p><p>North Shore focused<\/p><p>1-207-2-CASPER<\/p>/g],
  [/\s*<a href="\/contact">or request a free technical audit →<\/a>/g],
  [/<h[23]>Ready to grow your business\?<\/h[23]><p>Stop wasting money on random marketing\.[^<]*<\/p>(?:<p class="ctas">[\s\S]*?<\/p>)?/g],
  [/<p>Every service includes the strategy, execution, and reporting needed to move your business forward\.<\/p>/g],
  [/<h2>The Process<\/h2><h3>1\. Consultation<\/h3>[\s\S]*?<h3>4\. Ongoing Support<\/h3><p>[^<]*<\/p>/g, /^\/casper-va\/./],
  [/<p>By Jared Casper · Last updated: October 2026<\/p>/g, /^\/(services|seo-audit|ai-services)/],
];
const used = new Map();
const mark = (k, n) => used.set(k, (used.get(k) || 0) + n);
export function declutter(p, html) {
  const before = html.length;
  const parts = html.split(/(?=<section>)/);
  html = parts.filter((s, i) => {
    if (i === 0 && !s.startsWith("<section>")) return true;
    if (/<h1[\s>]/.test(s)) return true; // never drop the hero
    for (const [re, scope] of SECTIONS) if ((!scope || scope.test(p)) && re.test(s)) { mark("S" + re, 1); return false; }
    return true;
  }).join("");
  for (const [re, scope] of FRAGMENTS) if (!scope || scope.test(p)) { const n = (html.match(re) || []).length; if (n) { mark("F" + re, n); html = html.replace(re, ""); } }
  html = html.replace(/<section>\s*<\/section>/g, "");
  return { html, removed: before - html.length };
}
export function declutterReport() {
  const dead = [...SECTIONS.map(([re]) => "S" + re), ...FRAGMENTS.map(([re]) => "F" + re)].filter((k) => !used.has(k));
  if (dead.length) throw new Error("declutter rules that removed nothing (delete them): " + dead.join(" | "));
  return [...used.values()].reduce((a, b) => a + b, 0);
}

// late pass, after the per-page cut edits (for sections those edits touched but kept)
const LATE = [[/North Shore Coverage Map/, /^\/(service-areas|georgetown-ma)$/], [/<h2>Find Your Town<\/h2>/, /^\/service-areas$/]];
export function declutterLate(p, html) {
  return html.split(/(?=<section>)/).filter((s) => { if (/<h1[\s>]/.test(s)) return true; for (const [re, scope] of LATE) if (scope.test(p) && re.test(s)) { mark("L" + re, 1); return false; } return true; }).join("");
}
export function lateReport() { return LATE.filter(([re]) => !used.has("L" + re)).map(([re]) => String(re)); }
