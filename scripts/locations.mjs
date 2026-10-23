// Town pages (/<town>-ma, /<town>-nh) and state hubs (/massachusetts, /new-hampshire) from data/locations.json.
// Each page carries the town's own facts (county, ZIP codes, neighborhoods, nearby towns, a local note) — no invented
// clients, stats or office claims. CasperB2B works with these towns remotely; it has no storefront there.
import { esc } from "./lib.mjs";

const ST = { ma: "MA", nh: "NH" };
const SERVICES = (t) => [
  ["/services/local-seo", "Local SEO", `so you show up when people search "your service + ${t.name}"`],
  ["/services/web-development", "Websites", "built to turn visitors into calls and booked jobs"],
  ["/services/lead-generation", "Lead follow-up", "every call, text and form answered fast — missed-call text back included"],
  ["/services/reputation-management", "Reviews", "a steady flow of new Google reviews from real customers"],
  ["/services/cybersecurity", "Cybersecurity & IT", "protection from phishing, ransomware and data loss"],
  ["/casper-va", "Virtual assistants", "a dedicated, trained assistant who works inside your systems"],
];

export function locationPages(L, exists) {
  const bySlug = Object.fromEntries(L.towns.map((t) => [t.slug, t]));
  const pages = [], kw = {};
  for (const t of L.towns) {
    if (t.existing) continue;
    const s = L.states[t.st], st = ST[t.st], place = `${t.name}, ${st}`, p = "/" + t.slug;
    const near = t.near.filter((n) => bySlug[n]).map((n) => `<a href="/${n}">${esc(bySlug[n].name)}, ${ST[bySlug[n].st]}</a>`);
    const areas = t.villages.length ? t.villages.join(", ") : `${t.name} center`;
    const an = /^[aeiou]/i.test(t.name) ? "an" : "a";
    const link = (h, txt) => exists(h) ? `<a href="${h}">${txt}</a>` : txt;
    const html = `<section><p class="eyebrow">${esc(t.disambig || `${t.name}, ${s.name}`)}</p><h1>SEO Company & Web Design in ${esc(place)}</h1>
<p>${esc(t.note)}</p></section>
<section><h2>SEO for ${esc(t.name)} businesses</h2><p>When someone searches for your service plus "${esc(t.name)}", you want to be the business they find. We research the exact searches your ${esc(t.name)} customers use, then build and run everything Google looks at:</p>
<ul><li>${link("/services/business-listings", "Google Business Profile")} optimization: categories, services, photos and review replies</li><li>A page for each service and each town you serve, written to rank and to convert</li><li>On-page SEO and ${link("/services/local-seo", "local SEO")}: titles, headings, schema markup and internal links</li><li>Technical fixes: crawl errors, slow pages, broken links and mobile issues</li><li>Consistent listings across directories, plus monthly reporting from Google Search Console and Analytics</li></ul>
<p>Local SEO typically shows meaningful improvement in 3–6 months of consistent work; quick wins like Google Business Profile fixes can show sooner. ${link("/services/seo", "See our SEO services")}.</p></section>
<section><h2>Web design for ${esc(t.name)} businesses</h2><p>Your website should turn ${esc(t.name)} visitors into calls and booked jobs. Every site we build is mobile-first, built for sub-3-second load times, SEO-ready from day one, and has click-to-call, forms and tracking that show which pages bring in leads. Pricing is a clear, fixed-price proposal after a 15-minute fit call. ${link("/services/web-development", "See our web design service")}.</p></section>
<section><h2>Lead follow-up, IT and cybersecurity for ${esc(t.name)} businesses</h2><ul>${SERVICES(t).slice(2).filter(([h]) => exists(h)).map(([h, n, d]) => `<li><a href="${h}">${n}</a> — ${esc(d)}.</li>`).join("")}${exists("/services/managed-it") ? `<li><a href="/services/managed-it">Managed IT</a> — devices, accounts, backups and support handled for you.</li>` : ""}</ul>
<p>Everything is set up and run for you. You get a personal reply within 1 business day, and the work starts from a signed scope.</p></section>
<section><h2>How we work with ${esc(t.name)} businesses</h2><ol><li><strong>Discovery & audit</strong> — we review your website, Google presence and current systems.</li><li><strong>Strategy & blueprint</strong> — a written plan with the highest-impact fixes first.</li><li><strong>Execution & launch</strong> — we build and launch it for you and train your team.</li><li><strong>Optimization & reporting</strong> — monthly reporting and quarterly reviews.</li></ol>${exists("/our-process") ? `<p><a href="/our-process">Read our full process</a>.</p>` : ""}</section>
<section><h2>${esc(t.name)} at a glance</h2><ul class="kv"><li><span>County</span><span>${esc(t.county)}, ${esc(s.name)}</span></li><li><span>ZIP code${t.zips.length > 1 ? "s" : ""}</span><span>${t.zips.join(", ")}</span></li><li><span>Areas we name in your pages and listings</span><span>${esc(areas)}</span></li>${near.length ? `<li><span>Nearby towns we also cover</span><span>${near.join(", ")}</span></li>` : ""}</ul></section>
<section><h2>Questions from ${esc(t.name)} businesses</h2>
<details><summary>Do you work with businesses in ${esc(place)}?</summary><p>Yes. We work with ${esc(t.name)} businesses remotely — by phone, video and screen-share — from our base in Georgetown, MA, and we also cover ${near.length ? near.slice(0, 3).join(", ") : "the surrounding towns"}. Start with a free 15-minute fit call.</p></details>
<details><summary>Can my ${esc(t.name)} business rank on Google without a storefront?</summary><p>Yes. Regular Google results rank pages, not buildings: a page for each service and each town you serve, consistent listings, and steady reviews. A Google Business Profile can hide your address if you serve customers at their location, but Google still needs a real business address to verify it. See <a href="/get-my-business-on-google">how to get your business on Google</a>.</p></details>
<details><summary>How much does local SEO cost for ${an} ${esc(t.name)} business?</summary><p>A local SEO campaign for a small business typically costs between $800 and $2,500 per month, depending on how competitive your service is in ${esc(t.name)} and how many towns you want to rank in. <a href="/how-much-does-seo-cost">What that money actually pays for</a>.</p></details>
<details><summary>How long does SEO take for ${an} ${esc(t.name)} business?</summary><p>Local SEO typically shows meaningful improvement in 3–6 months of consistent work. Quick wins, like fixing your Google Business Profile and listings, can show sooner. Anyone who guarantees #1 on Google in 30 days is not being straight with you.</p></details>
<details><summary>Do you build websites for ${esc(t.name)} businesses?</summary><p>Yes. We design and build mobile-first websites for ${esc(place)} businesses, with SEO structure, fast load times and lead capture built in, quoted as a clear fixed-price proposal after a 15-minute fit call.</p></details>
</section>`;
    pages.push({ path: p, title: "", desc: "", h1: `SEO Company & Web Design in ${place}`, name: place, html, location: t, parent: s.path });
    const tn = t.name.toLowerCase();
    kw[p] = { keyword: `seo company ${tn} ${t.st}`, secondary: [`seo ${tn} ${t.st}`, `web design ${tn} ${t.st}`, `digital marketing ${tn} ${t.st}`, `managed it services ${tn} ${t.st}`],
      title: `${place} SEO Company & Web Design | CasperB2B`, desc: `SEO company and web design for ${place} businesses: rank on Google, turn visits into calls and answer every lead, set up and run for you.`,
      intro: `CasperB2B is an SEO and web design company for ${place} businesses: local SEO that gets you found on Google, websites that turn visitors into calls, and lead follow-up and IT that keep customers from slipping away — all set up and run for you.`,
      cluster: "local", next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" } };
  }
  for (const [code, s] of Object.entries(L.states)) {
    const towns = L.towns.filter((t) => t.st === code);
    const other = Object.values(L.states).find((x) => x !== s);
    const html = `<section><p class="eyebrow">${esc(s.name)}</p><h1>Marketing, SEO & IT for ${esc(s.name)} businesses</h1>
<p>We work with businesses across ${esc(s.region)} — and remotely with businesses anywhere in the U.S. and worldwide. Pick your town for local details, or <a href="${other.path}">see ${esc(other.name)}</a>.</p></section>
<section><h2>Towns we cover in ${esc(s.name)}</h2><div class="grid g3">${towns.map((t) => `<a class="card-link" href="/${t.slug}"><h3>${esc(t.name)}, ${ST[t.st]}</h3><p>${esc(t.county)} · ${t.zips.join(", ")}</p></a>`).join("")}</div></section>`;
    pages.push({ path: s.path, title: "", desc: "", h1: `Marketing, SEO & IT for ${s.name} businesses`, name: s.name, html, parent: "/service-areas" });
    kw[s.path] = { keyword: `digital marketing agency ${s.name.toLowerCase()}`, secondary: [`small business marketing ${s.name.toLowerCase()}`, `seo company ${s.name.toLowerCase()}`, `it services ${s.name.toLowerCase()}`],
      title: `Digital Marketing Agency in ${s.name} | CasperB2B`, desc: `Local SEO, websites, lead follow-up and IT for ${s.name} businesses in ${towns.length} towns, plus remote clients worldwide. Book a free 15-minute fit call.`,
      intro: `CasperB2B is a founder-led marketing, SEO and IT company working with small businesses across ${s.region}, set up and run for you.`,
      cluster: "local", next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" } };
  }
  return { pages, kw, slugs: L.towns.map((t) => t.slug) };
}
