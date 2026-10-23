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

// Owner decision 2026-10-23: the $49,000 unpaid-work story is not on the site. Removes the smallest block that mentions it
// (a section whose heading is about it, an FAQ, a card, a list item, a paragraph). build.mjs fails if any mention survives.
export const STORY = /\$\s?49(?:,000|k)\b|\b49K story|\$49,000/i;
const SCRUB = [
  /<p>\d{4}<\/p><h[34]>[^<]*\$\s?49(?:,000|k)[^<]*<\/h[34]>(?:<p>(?:(?!<\/p>)[\s\S])*<\/p>)?/gi, // a dated timeline entry
  /<section>(?:(?!<\/section>)[\s\S])*?<h2>[^<]*\$49(?:,000|k)[\s\S]*?<\/section>/gi,
  /<details>(?:(?!<\/details>)[\s\S])*?\$\s?49(?:,000|k)[\s\S]*?<\/details>/gi,
  /<div class="card">(?:(?!<div|<\/div>)[\s\S])*?\$\s?49(?:,000|k)(?:(?!<div|<\/div>)[\s\S])*?<\/div>/gi,
  /<a class="card-link"[^>]*>(?:(?!<\/a>)[\s\S])*?\$\s?49(?:,000|k)[\s\S]*?<\/a>/gi,
  /<li>(?:(?!<\/?li>)[\s\S])*?\$\s?49(?:,000|k)(?:(?!<\/?li>)[\s\S])*?<\/li>/gi,
  /(?:<p>·<\/p>)?<a [^>]*>[^<]*\$\s?49(?:,000|k)[^<]*<\/a>/gi,
  /<(p|h3|h4|blockquote)[^>]*>(?:(?!<\/\1>)[\s\S])*?\$\s?49(?:,000|k)[\s\S]*?<\/\1>/gi,
];
export function scrubStory(html) {
  for (const re of SCRUB) html = html.replace(re, "");
  return html.replace(/<div class="grid g\d">\s*<\/div>/g, "").replace(/<ul>\s*<\/ul>/g, "").replace(/<section>\s*(?:<p class="eyebrow">[^<]*<\/p>\s*)?<\/section>/g, "");
}
