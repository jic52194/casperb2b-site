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
    const html = `<section><p class="eyebrow">${esc(t.disambig || `${t.name}, ${s.name}`)}</p><h1>Marketing, SEO & IT for ${esc(place)} businesses</h1>
<p>${esc(t.note)}</p></section>
<section><h2>What we do for ${esc(t.name)} businesses</h2><ul>${SERVICES(t).filter(([h]) => exists(h)).map(([h, n, d]) => `<li><a href="${h}">${n}</a> — ${esc(d)}.</li>`).join("")}</ul>
<p>Everything is set up and run for you. You get a personal reply within 1 business day, and the work starts from a signed scope.</p></section>
<section><h2>${esc(t.name)} at a glance</h2><ul class="kv"><li><span>County</span><span>${esc(t.county)}, ${esc(s.name)}</span></li><li><span>ZIP code${t.zips.length > 1 ? "s" : ""}</span><span>${t.zips.join(", ")}</span></li><li><span>Areas we name in your pages and listings</span><span>${esc(areas)}</span></li>${near.length ? `<li><span>Nearby towns we also cover</span><span>${near.join(", ")}</span></li>` : ""}</ul></section>
<section><h2>Questions from ${esc(t.name)} businesses</h2>
<details><summary>Do you work with businesses in ${esc(place)}?</summary><p>Yes. We work with ${esc(t.name)} businesses remotely — by phone, video and screen-share — from our base in Georgetown, MA, and we also cover ${near.length ? near.slice(0, 3).join(", ") : "the surrounding towns"}. Start with a free 15-minute fit call.</p></details>
<details><summary>Can my ${esc(t.name)} business rank on Google without a storefront?</summary><p>Yes. Regular Google results rank pages, not buildings: a page for each service and each town you serve, consistent listings, and steady reviews. A Google Business Profile can hide your address if you serve customers at their location, but Google still needs a real business address to verify it. See <a href="/get-my-business-on-google">how to get your business on Google</a>.</p></details>
<details><summary>How much does local SEO cost for a ${esc(t.name)} business?</summary><p>A local SEO campaign for a small business typically costs between $800 and $2,500 per month, depending on how competitive your service is in ${esc(t.name)} and how many towns you want to rank in. <a href="/how-much-does-seo-cost">What that money actually pays for</a>.</p></details>
</section>`;
    pages.push({ path: p, title: "", desc: "", h1: `Marketing, SEO & IT for ${place} businesses`, name: place, html, location: t, parent: s.path });
    kw[p] = { keyword: `digital marketing ${t.name.toLowerCase()} ${t.st}`, secondary: [`seo ${t.name.toLowerCase()} ${t.st}`, `web design ${t.name.toLowerCase()} ${t.st}`, `it support ${t.name.toLowerCase()} ${t.st}`],
      title: `Digital Marketing & SEO in ${place} | CasperB2B`, desc: `Local SEO, websites, lead follow-up and IT for ${place} businesses, set up and run for you by CasperB2B. Book a free 15-minute fit call.`,
      intro: `CasperB2B helps ${place} businesses get found on Google, answer every lead fast and stay secure — local SEO, websites, follow-up automation, cybersecurity and dedicated virtual assistants, set up and run for you.`,
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
