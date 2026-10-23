// Internal link check for dist/ (run after a build: `npm run check`). For every indexable page in sitemap.xml:
//   • counts distinct OTHER casperb2b.com pages linked from the article body (inside <main>, excluding the breadcrumb),
//     and flags any page with fewer than MIN (a dead end);
//   • resolves every internal href on the page (header, body, footer) to a file in dist/ and flags missing targets;
//   • flags #fragment links whose target page has no element with that id.
// No network calls: links to other hosts are not fetched.
//   • flags internal links that land on a redirect page (old URL) instead of the final page.
// Exit code 1 when a page links to a missing page or a redirect page, or is a dead end, so it can gate a deploy.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../dist/", import.meta.url));
const MIN = Number(process.env.MIN_LINKS || 3);
const HOST = /^https?:\/\/(www\.)?casperb2b\.com(?=\/|$)/i;

const locs = [...readFileSync(join(OUT, "sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/casperb2b\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
const isFile = (f) => existsSync(f) && statSync(f).isFile();
/** URL path → the file GitHub Pages would serve for it, or null. */
function fileFor(p) {
  if (p === "/" || p === "") return join(OUT, "index.html");
  if (p.endsWith("/")) return isFile(join(OUT, p, "index.html")) ? join(OUT, p, "index.html") : null;
  if (isFile(join(OUT, p))) return join(OUT, p);
  if (isFile(join(OUT, p + ".html"))) return join(OUT, p + ".html");
  if (isFile(join(OUT, p, "index.html"))) return join(OUT, p, "index.html");
  return null;
}
const norm = (p) => (p === "/" ? "/" : p.replace(/\/index\.html$/, "/").replace(/\.html$/, ""));
const idCache = new Map();
const idsOf = (file) => { if (!idCache.has(file)) idCache.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))); return idCache.get(file); };

const pages = [], missing = [], badHash = [], toRedirect = [], noBooking = [];
const isRedirect = (f) => f.endsWith(".html") && /http-equiv="refresh"/.test(readFileSync(f, "utf8").slice(0, 600));
for (const path of locs) {
  const file = fileFor(path); if (!file) { missing.push([path, "(sitemap entry has no file)"]); continue; }
  const html = readFileSync(file, "utf8");
  const main = (html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "").replace(/<nav class="crumbs[^"]*"[\s\S]*?<\/nav>/, "");
  const self = norm(path).replace(/\/$/, "") || "/";
  const targets = new Set();
  for (const [scope, src] of [["main", main], ["page", html]]) {
    for (const m of src.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      let href = m[1].replace(/&amp;/g, "&");
      if (HOST.test(href)) href = href.replace(HOST, "") || "/";
      if (!href.startsWith("/") || href.startsWith("//")) continue; // external, mailto:, tel:, sms:, same-page #anchors
      const [pq, hash] = href.split("#"); const p = pq.split("?")[0];
      const f = fileFor(p);
      if (scope === "page") {
        if (!f) missing.push([path, href]);
        else if (isRedirect(f)) toRedirect.push([path, href]);
        else if (hash && f.endsWith(".html") && !idsOf(f).has(decodeURIComponent(hash))) badHash.push([path, href]);
        continue;
      }
      const key = norm(p).replace(/\/$/, "") || "/";
      if (f && f.endsWith(".html") && key !== self) targets.add(key);
    }
  }
  if (path !== "/contact" && !/href="\/contact(\?[^"]*)?"/.test(html)) noBooking.push(path); // booking must be one click away
  pages.push({ path, n: targets.size });
}

const dead = pages.filter((p) => p.n < MIN);
const uniq = (xs) => [...new Map(xs.map((x) => [x.join(" → "), x])).values()];
const avg = pages.reduce((s, p) => s + p.n, 0) / (pages.length || 1);
const sorted = pages.map((p) => p.n).sort((a, b) => a - b);
const summary = { pages: pages.length, avgInContentLinks: +avg.toFixed(1), minInContentLinks: sorted[0] ?? 0, medianInContentLinks: sorted[Math.floor(sorted.length / 2)] ?? 0,
  deadEnds: dead.length, pagesWithoutBookingLink: noBooking.length, linksToMissingPages: uniq(missing).length, linksToRedirects: uniq(toRedirect).length, brokenFragments: uniq(badHash).length };
if (process.argv.includes("--json")) { console.log(JSON.stringify(summary)); }
else {
  console.log(`linkcheck: ${summary.pages} indexable pages · in-content links to other pages: avg ${summary.avgInContentLinks}, median ${summary.medianInContentLinks}, min ${summary.minInContentLinks}`);
  console.log(`  pages with < ${MIN} in-content links: ${dead.length}${dead.length ? "\n    " + dead.map((p) => `${p.path} (${p.n})`).join("\n    ") : ""}`);
  console.log(`  pages without a link to the booking page (/contact): ${noBooking.length}${noBooking.length ? "\n    " + noBooking.join("\n    ") : ""}`);
  console.log(`  links to missing pages: ${summary.linksToMissingPages}${missing.length ? "\n    " + uniq(missing).slice(0, 40).map((x) => x.join(" → ")).join("\n    ") : ""}`);
  console.log(`  links to redirect pages: ${summary.linksToRedirects}${toRedirect.length ? "\n    " + uniq(toRedirect).slice(0, 40).map((x) => x.join(" → ")).join("\n    ") : ""}`);
  console.log(`  #fragment links with no matching id (warning): ${summary.brokenFragments}${badHash.length ? "\n    " + uniq(badHash).slice(0, 40).map((x) => x.join(" → ")).join("\n    ") : ""}`);
}
if (dead.length || missing.length || toRedirect.length || noBooking.length) process.exitCode = 1;
