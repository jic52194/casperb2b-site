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
    const html = `<section><p class="eyebrow">${esc(t.disambig || `${t.name}, ${s.name}`)}</p><h1>SEO Company in ${esc(place)}</h1>
<p>${esc(t.note)}</p></section>
<section><h2>SEO for ${esc(t.name)} businesses</h2><p>When someone searches for your service plus "${esc(t.name)}", you want to be the business they find. We research the exact searches your ${esc(t.name)} customers use, then build and run everything Google looks at:</p>
<ul><li>${link("/services/business-listings", "Google Business Profile")} optimization: categories, services, photos and review replies</li><li>A page for each service and each town you serve, written to rank and to convert</li><li>On-page SEO and ${link("/services/local-seo", "local SEO")}: titles, headings, schema markup and internal links</li><li>Technical fixes: crawl errors, slow pages, broken links and mobile issues</li><li>Consistent listings across directories, plus monthly reporting from Google Search Console and Analytics</li></ul>
<p>Local SEO typically shows meaningful improvement in 3–6 months of consistent work; quick wins like Google Business Profile fixes can show sooner. ${link("/services/seo", "See our SEO services")}.</p></section>
<section><h2>Web design for ${esc(t.name)} businesses</h2><p>Your website should turn ${esc(t.name)} visitors into calls and booked jobs. Every site we build is mobile-first, built for sub-3-second load times, SEO-ready from day one, and has click-to-call, forms and tracking that show which pages bring in leads. Pricing is a clear, fixed-price proposal after a 15-minute fit call. <a href="${p}/web-development">Web design in ${esc(t.name)}</a>.</p></section>
<section><h2>Lead follow-up, IT and cybersecurity for ${esc(t.name)} businesses</h2><p>Need IT support or security? See <a href="${p}/managed-it">managed IT and cybersecurity in ${esc(t.name)}</a>.</p><ul>${SERVICES(t).slice(2).filter(([h]) => exists(h)).map(([h, n, d]) => `<li><a href="${h}">${n}</a> — ${esc(d)}.</li>`).join("")}${exists("/services/managed-it") ? `<li><a href="/services/managed-it">Managed IT</a> — devices, accounts, backups and support handled for you.</li>` : ""}</ul>
<p>Everything is set up and run for you. You get a personal reply within 1 business day, and the work starts from a signed scope.</p></section>
<section><h2>How we work with ${esc(t.name)} businesses</h2><ol><li><strong>Discovery & audit</strong> — we review your website, Google presence and current systems.</li><li><strong>Strategy & blueprint</strong> — a written plan with the highest-impact fixes first.</li><li><strong>Execution & launch</strong> — we build and launch it for you and train your team.</li><li><strong>Optimization & reporting</strong> — monthly reporting and quarterly reviews.</li></ol>${exists("/our-process") ? `<p><a href="/our-process">Read our full process</a>.</p>` : ""}</section>
<section><h2>${esc(t.name)} at a glance</h2><ul class="kv"><li><span>County</span><span>${esc(t.county)}, ${esc(s.name)}</span></li><li><span>ZIP code${t.zips.length > 1 ? "s" : ""}</span><span>${t.zips.join(", ")}</span></li><li><span>Areas we name in your pages and listings</span><span>${esc(areas)}</span></li>${near.length ? `<li><span>Nearby towns we also cover</span><span>${near.join(", ")}</span></li>` : ""}</ul></section>
<section><h2>Questions from ${esc(t.name)} businesses</h2>
<details><summary>Do you work with businesses in ${esc(place)}?</summary><p>Yes. We work with ${esc(t.name)} businesses remotely — by phone, video and screen-share — from our base in Georgetown, MA, and we also cover ${near.length ? near.slice(0, 3).join(", ") : "the surrounding towns"}. Start with a free 15-minute fit call.</p></details>
<details><summary>Can my ${esc(t.name)} business rank on Google without a storefront?</summary><p>Yes. Regular Google results rank pages, not buildings: a page for each service and each town you serve, consistent listings, and steady reviews. A Google Business Profile can hide your address if you serve customers at their location, but Google still needs a real business address to verify it. See <a href="/get-my-business-on-google">how to get your business on Google</a>.</p></details>
<details><summary>How much does local SEO cost for ${an} ${esc(t.name)} business?</summary><p>A local SEO campaign for a small business typically costs between $800 and $2,500 per month, depending on how competitive your service is in ${esc(t.name)} and how many towns you want to rank in. <a href="/how-much-does-seo-cost">What that money actually pays for</a>.</p></details>
<details><summary>How long does SEO take for ${an} ${esc(t.name)} business?</summary><p>Local SEO typically shows meaningful improvement in 3–6 months of consistent work. Quick wins, like fixing your Google Business Profile and listings, can show sooner. Anyone who guarantees #1 on Google in 30 days is not being straight with you.</p></details>
<details><summary>Do you build websites for ${esc(t.name)} businesses?</summary><p>Yes. We design and build mobile-first websites for ${esc(place)} businesses, with SEO structure, fast load times and lead capture built in, quoted as a clear fixed-price proposal after a 15-minute fit call. <a href="${p}/web-development">Web design in ${esc(t.name)}</a>.</p></details>
</section>`;
    pages.push({ path: p, title: "", desc: "", h1: `SEO Company in ${place}`, name: place, html, location: t, parent: s.path });
    const tn = t.name.toLowerCase();
    kw[p] = { keyword: `seo company ${tn} ${t.st}`, secondary: [`seo ${tn} ${t.st}`, `local seo ${tn} ${t.st}`, `best seo ${tn}`, `digital marketing ${tn} ${t.st}`],
      title: `SEO Company in ${place} | CasperB2B`, desc: `SEO company for ${place} businesses: local SEO, Google Business Profile and pages that rank and turn searches into calls, set up and run for you.`,
      intro: `CasperB2B is an SEO company for ${place} businesses: we get you found on Google for the services you sell in ${t.name}, then make sure every call and form turns into a customer — all set up and run for you.`,
      cluster: "local", next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" } };
  }
  // town × service pages, only for the two services with real local search demand (Search Console: "web design <town>",
  // "managed it services <town>", "cybersecurity services in <town>"). SEO lives on the town page itself.
  // a town with hand-written pages (Georgetown) keeps them: /web-design-<slug>, /managed-it-<slug>
  const subPath = (slug, sub) => bySlug[slug].existing ? (exists(`/${sub === "web-development" ? "web-design" : "managed-it"}-${slug}`) ? `/${sub === "web-development" ? "web-design" : "managed-it"}-${slug}` : null) : `/${slug}/${sub}`;
  for (const t of L.towns) {
    if (t.existing) continue;
    const s = L.states[t.st], st = ST[t.st], place = `${t.name}, ${st}`, town = "/" + t.slug, tn = t.name.toLowerCase();
    const an = /^[aeiou]/i.test(t.name) ? "an" : "a";
    const nearT = t.near.filter((n) => bySlug[n]).slice(0, 4);
    const areas = t.villages.length ? t.villages.join(", ") : `${t.name} center`;
    const ln = (h, txt) => exists(h) ? `<a href="${h}">${txt}</a>` : txt;
    const nearLinks = (sub, label) => { const l = nearT.map((n) => [n, subPath(n, sub)]).filter(([, h]) => h); return l.length ? `<p>${label}: ${l.map(([n, h]) => `<a href="${h}">${esc(bySlug[n].name)}, ${ST[bySlug[n].st]}</a>`).join(", ")}.</p>` : ""; };
    const steps = `<ol><li><strong>Discovery & audit</strong> — we review what you have today and what it needs to do.</li><li><strong>Strategy & blueprint</strong> — a written plan with the highest-impact work first.</li><li><strong>Execution & launch</strong> — we build and launch it for you and train your team.</li><li><strong>Optimization & reporting</strong> — monthly reporting and quarterly reviews.</li></ol>`;
    const at = `<p class="fine">${esc(t.county)}, ${esc(s.name)} · ZIP ${t.zips.join(", ")} · ${esc(areas)}. We work with ${esc(t.name)} businesses remotely from our base in Georgetown, MA.</p>`;

    const web = `${town}/web-development`;
    pages.push({ path: web, title: "", desc: "", h1: `Web Design in ${place}`, name: `Web design in ${place}`, location: t, parent: town, html:
`<section><p class="eyebrow">${esc(place)}</p><h1>Web Design in ${esc(place)}</h1>
<p>Your website is often the first thing a ${esc(t.name)} customer sees, so it has to load fast, show up on Google and make calling you easy.</p></section>
<section><h2>Websites built for ${esc(t.name)} businesses</h2><ul><li><strong>Custom design</strong> that reflects your brand, not a template that looks like everyone else's.</li><li><strong>Mobile-first</strong>, because most local searches happen on a phone.</li><li><strong>Fast</strong>: images, code and hosting tuned for sub-3-second load times.</li><li><strong>SEO-ready structure</strong>: clean URLs, proper headings, schema markup and a page for each service you offer in ${esc(t.name)}.</li><li><strong>Lead capture</strong>: click-to-call, forms and chat, tested before launch.</li><li><strong>Tracking</strong>: Google Analytics, Search Console and conversion tracking so you can see which pages bring in leads.</li></ul></section>
<section><h2>What a ${esc(t.name)} business website should include</h2><p>Customers search by service and town ("roofer ${esc(t.name)} ${st}"), so your site needs a page for each service, the towns and areas you serve (${esc(areas)}${nearT.length ? ", " + nearT.map((n) => esc(bySlug[n].name)).join(", ") : ""}), clear prices or next steps, real reviews and a phone number that's one tap away on mobile. Your site and your ${ln("/services/business-listings", "Google Business Profile")} should show the same name, address and phone.</p></section>
<section><h2>How much does a website cost for ${an} ${esc(t.name)} business?</h2><p>A professional website for a local small business typically costs between $2,500 and $8,000, with lead-generation builds commonly in the $3,500–$8,000 range. Hosting and maintenance usually run $50–$200 a month. We quote your exact price as a fixed-price proposal after a 15-minute fit call. ${ln("/how-much-does-a-website-cost", "See what drives website cost")}.</p></section>
<section><h2>How a website project works</h2>${steps}<p>A proper lead-generation website takes 4–8 weeks to build, including writing the content, designing the pages and optimizing for Google. Once it's paid for, you own 100% of your website and your domain.</p></section>
<section><h2>More for ${esc(t.name)} businesses</h2><p><a href="${town}">SEO company in ${esc(t.name)}</a> · <a href="${town}/managed-it">Managed IT & cybersecurity in ${esc(t.name)}</a>${exists("/services/web-development") ? ` · <a href="/services/web-development">Web design services</a>` : ""}</p>${nearLinks("web-development", "Web design nearby")}${at}</section>
<section><h2>Web design questions from ${esc(t.name)} businesses</h2>
<details><summary>Do you design websites for ${esc(place)} businesses?</summary><p>Yes. We design and build mobile-first, SEO-ready websites for ${esc(t.name)} businesses and work with you remotely by phone, video and screen-share.</p></details>
<details><summary>How long does a new website take?</summary><p>A proper lead-generation website takes 4 to 8 weeks to build, including content, design and optimizing for Google.</p></details>
<details><summary>Do I own my website when it's done?</summary><p>Yes. Once the project is paid for, you own 100% of your website and your domain.</p></details>
<details><summary>Is a Wix or Squarespace site good enough?</summary><p>It's fine for a brand-new business that just needs a link on a business card. If you rely on Google to bring in ${esc(t.name)} customers, a DIY site often lacks the structure needed to rank locally.</p></details>
</section>` });
    kw[web] = { keyword: `web design ${tn} ${t.st}`, secondary: [`website design ${tn} ${t.st}`, `web design company ${tn}`, `website designer ${tn}`],
      title: `Web Design in ${place} | CasperB2B`, desc: `Web design for ${place} businesses: fast, mobile-first, SEO-ready websites built to turn visitors into calls. You own it. Fixed-price quote.`,
      intro: `CasperB2B designs and builds websites for ${place} businesses: custom, mobile-first and SEO-ready, with click-to-call and forms built in, so your site turns ${t.name} searches into calls and booked jobs.`,
      cluster: "local", next: { service: "/services/web-development", tool: "/tools/website-grader", article: "/how-much-does-a-website-cost" } };

    const it = `${town}/managed-it`;
    pages.push({ path: it, title: "", desc: "", h1: `Managed IT & Cybersecurity in ${place}`, name: `Managed IT in ${place}`, location: t, parent: town, html:
`<section><p class="eyebrow">${esc(place)}</p><h1>Managed IT & Cybersecurity in ${esc(place)}</h1>
<p>Most attacks on small businesses are automated: they look for weak passwords, missing multi-factor authentication and unpatched software. Proactive IT closes those doors before they cost you.</p></section>
<section><h2>Managed IT for ${esc(t.name)} businesses</h2><p>We act as your IT department for a flat monthly fee, typically priced per user or per device:</p><ul><li><strong>Monitoring & maintenance</strong> of computers, servers and network, with updates and patches applied.</li><li><strong>Help desk & remote support</strong> for day-to-day issues, without waiting for a technician to drive out.</li><li><strong>Microsoft 365 / Google Workspace</strong> and cloud storage set up and managed.</li><li><strong>Backups</strong> managed and restores tested.</li><li><strong>Technology planning</strong> so you buy the right tools at the right time.</li><li><strong>Remote workers</strong> supported and secured wherever they work.</li></ul><p>No lock-in: all documentation, credentials and configurations are yours. ${ln("/services/managed-it", "See managed IT services")}.</p></section>
<section><h2>Cybersecurity for ${esc(t.name)} businesses</h2><p>We assess access, email, devices and backups, fix the highest-risk gaps first and set up controls your team can maintain:</p><ul><li>Multi-factor authentication on every critical account</li><li>Access control, including removing access the day someone leaves</li><li>Endpoint protection (antivirus/EDR) on company devices</li><li>Email security: SPF, DKIM and DMARC plus phishing filters</li><li>Automated, tested backups</li><li>Awareness training so your team can spot phishing</li></ul><p>${ln("/services/cybersecurity", "See cybersecurity services")}${exists("/tools/cyber-risk-quiz") ? ` or take the <a href="/tools/cyber-risk-quiz">free cyber risk quiz</a>` : ""}.</p></section>
<section><h2>How we start with ${an} ${esc(t.name)} business</h2>${steps}</section>
<section><h2>More for ${esc(t.name)} businesses</h2><p><a href="${town}">SEO company in ${esc(t.name)}</a> · <a href="${web}">Web design in ${esc(t.name)}</a></p>${nearLinks("managed-it", "Managed IT nearby")}${at}</section>
<section><h2>IT and security questions from ${esc(t.name)} businesses</h2>
<details><summary>Do you provide managed IT for ${esc(place)} businesses?</summary><p>Yes. We monitor, maintain and support ${esc(t.name)} businesses remotely, with fast remote help desk support and proactive patching, for a flat monthly fee.</p></details>
<details><summary>Can a small business afford managed IT?</summary><p>Managed IT is typically priced per user or per device, so it scales with your business. For most small businesses the cost is comparable to a few hours of emergency IT support a month, with full proactive coverage.</p></details>
<details><summary>How is managed IT different from break-fix support?</summary><p>Break-fix support charges you after something breaks. Managed IT monitors and maintains your systems to catch problems early, for a flat monthly fee: less downtime and more predictable costs.</p></details>
<details><summary>Is my ${esc(t.name)} business too small to be hacked?</summary><p>No. Most attacks are automated and look for unlocked doors like weak passwords and missing multi-factor authentication, regardless of business size.</p></details>
</section>` });
    kw[it] = { keyword: `managed it services ${tn} ${t.st}`, secondary: [`cybersecurity services ${tn} ${t.st}`, `it support ${tn} ${t.st}`, `it company ${tn}`],
      title: `Managed IT & Cybersecurity in ${place} | CasperB2B`, desc: `Managed IT and cybersecurity for ${place} businesses: monitoring, help desk, Microsoft 365, backups and MFA for a flat monthly fee.`,
      intro: `CasperB2B provides managed IT and cybersecurity for ${place} businesses: proactive monitoring, remote help desk, Microsoft 365 and backups, and the security controls that stop most attacks, for a flat monthly fee.`,
      cluster: "local", next: { service: "/services/managed-it", tool: "/tools/cyber-risk-quiz", article: "/is-my-business-too-small-to-hack" } };
  }
  for (const [code, s] of Object.entries(L.states)) {
    const towns = L.towns.filter((t) => t.st === code);
    const other = Object.values(L.states).find((x) => x !== s);
    const html = `<section><p class="eyebrow">${esc(s.name)}</p><h1>Marketing, SEO & IT for ${esc(s.name)} businesses</h1>
<p>We work with businesses across ${esc(s.region)} — and remotely with businesses anywhere in the U.S. and worldwide. Pick your town for local details, or <a href="${other.path}">see ${esc(other.name)}</a>.${code === "ma" ? ` On the North Shore? See <a href="/north-shore-ma">North Shore and Merrimack Valley</a>.` : ""} For local Google Ads, see <a href="/ppc-management-massachusetts">PPC management in MA & NH</a>.</p></section>
<section><h2>Towns we cover in ${esc(s.name)}</h2><div class="grid g3">${towns.map((t) => `<a class="card-link" href="/${t.slug}"><h3>${esc(t.name)}, ${ST[t.st]}</h3><p>${esc(t.county)} · ${t.zips.join(", ")}</p></a>`).join("")}</div></section>
<section><h2>Core services across ${esc(s.name)}</h2><div class="grid g3"><a class="card-link" href="/web-design-${s.path.slice(1)}"><h3>Web design</h3><p>Mobile-first, fast, SEO-ready websites, quoted as one fixed price.</p></a><a class="card-link" href="/seo-company-${s.path.slice(1)}"><h3>SEO</h3><p>Google Business Profile, service and town pages, monthly reporting.</p></a><a class="card-link" href="/managed-it-services-${s.path.slice(1)}"><h3>Managed IT</h3><p>Monitoring, help desk, Microsoft 365 and backups for a flat monthly fee.</p></a></div></section>`;
    pages.push({ path: s.path, title: "", desc: "", h1: `Marketing, SEO & IT for ${s.name} businesses`, name: s.name, html, parent: "/service-areas" });
    kw[s.path] = { keyword: `digital marketing agency ${s.name.toLowerCase()}`, secondary: [`small business marketing ${s.name.toLowerCase()}`, `marketing company ${s.name.toLowerCase()}`], // seo company / managed it services <state> have their own pages (pages-seo-state.mjs)
      title: `Digital Marketing Agency in ${s.name} | CasperB2B`, desc: `Local SEO, websites, lead follow-up and IT for ${s.name} businesses in ${towns.length} towns, plus remote clients worldwide. Book a free 15-minute fit call.`,
      intro: `CasperB2B is a founder-led marketing, SEO and IT company working with small businesses across ${s.region}, set up and run for you.`,
      cluster: "local", next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" } };
  }
  return { pages, kw, slugs: L.towns.map((t) => t.slug) };
}
