// Keyword pages, batch 4: state-level service pages (web design, SEO, managed IT for MA and NH) that sit above the
// town pages and link down to every one of them, plus plumber marketing. Every fact is already stated on
// casperb2b.com (/services/web-development, /services/seo, /services/local-seo, /services/managed-it,
// /niches/hvac-home-services, /north-shore-ma). No prices, no build timelines, no ranking promises.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LOC = JSON.parse(readFileSync(fileURLToPath(new URL("../data/locations.json", import.meta.url)), "utf8"));
const towns = (st) => LOC.towns.filter((t) => t.st === st);
// Georgetown keeps its hand-written pages; every other town has /<slug>/web-development and /<slug>/managed-it
const webOf = (t) => (t.slug === "georgetown-ma" ? "/web-design-georgetown-ma" : `/${t.slug}/web-development`);
const itOf = (t) => (t.slug === "georgetown-ma" ? "/managed-it-georgetown-ma" : `/${t.slug}/managed-it`);
const list = (ts, href, label) => ts.map((t) => `<a href="${href(t)}">${label(t.name)}</a>`).join(" · ");

const STATES = {
  ma: {
    slug: "massachusetts", name: "Massachusetts", short: "Massachusetts", abbr: "MA", hub: "/massachusetts",
    region: "Massachusetts' North Shore and Merrimack Valley",
    more: `See every town on the <a href="/north-shore-ma">North Shore and Merrimack Valley</a> page, or our <a href="/massachusetts">Massachusetts</a> overview. We also serve <a href="/new-hampshire">southern New Hampshire</a> and work remotely with businesses anywhere in the U.S.`,
    where: { q: "Do you only work with North Shore businesses?", a: `No. CasperB2B was founded in Georgetown, MA, and most of our local work is on the North Shore and in the Merrimack Valley, but we work with businesses across Massachusetts, New Hampshire and the rest of the U.S. by phone, video and screen-share.` },
  },
  nh: {
    slug: "new-hampshire", name: "New Hampshire", short: "southern New Hampshire", abbr: "NH", hub: "/new-hampshire",
    region: "southern New Hampshire, from Nashua, Salem and Manchester to Concord and Portsmouth on the Seacoast",
    more: `See our <a href="/new-hampshire">New Hampshire</a> overview. We also serve <a href="/massachusetts">Massachusetts</a>, including the <a href="/north-shore-ma">North Shore</a> just over the border, and work remotely with businesses anywhere in the U.S.`,
    where: { q: "Do you work with New Hampshire businesses even though you were founded in Massachusetts?", a: `Yes. CasperB2B was founded in Georgetown, MA, just south of the New Hampshire line, and our mailing address is in Nashua, NH. We work with businesses across southern New Hampshire by phone, video and screen-share.` },
  },
};

const faq = (items) => `<section><h2>Questions</h2>${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`;
const ctas = (topic, href, label) => `<p class="ctas"><a class="btn" href="/contact?topic=${topic}">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="${href}">${label}</a></p>`;

function webPage(S, ts) {
  const h1 = `Web Design for ${S.name} Small Businesses`;
  return {
    path: `/web-design-${S.slug}`, cluster: "local", name: `Web design in ${S.name}`,
    keyword: `web design ${S.name.toLowerCase()}`,
    secondary: [`web design company ${S.name.toLowerCase()}`, `website design ${S.name.toLowerCase()}`, `small business website design ${S.abbr.toLowerCase()}`, `web designer ${S.name.toLowerCase()}`],
    title: `Web Design Company in ${S.name} | CasperB2B`,
    desc: `Small business web design in ${S.name}: mobile-first, fast, SEO-ready websites with click-to-call and lead tracking, quoted as one fixed price.`,
    h1,
    intro: `CasperB2B designs and builds websites for small businesses across ${S.region}. Every site is mobile-first, built for sub-3-second load times, structured for local SEO from day one and wired with click-to-call, forms and tracking, so you can see which pages bring in leads. You own the site, the domain and the content.`,
    next: { service: "/services/web-development", tool: "/tools/website-grader", article: "/how-much-does-a-website-cost" },
    html: `<section><p class="eyebrow">Web design · ${S.abbr}</p><h1>${h1}</h1>
<p>Most small business websites in ${S.short} look fine and do very little: they load slowly on a phone, don't say which towns you serve and make it hard to call. Your website should work like your best salesperson. We build it that way, then make sure people can find it.</p>
${ctas("web", "/services/web-development", "See website development")}</section>
<section><h2>What every website we build includes</h2><div class="grid g2">
<div class="card"><h3>Conversion-focused design</h3><p>Every page guides visitors toward calling, filling out a form or booking, with a design that reflects your brand instead of a generic template.</p></div>
<div class="card"><h3>Mobile-first</h3><p>Most local searches happen on a phone, so the site is built for small screens first and tested on every size.</p></div>
<div class="card"><h3>Speed</h3><p>Images, code and hosting optimized for sub-3-second load times. Fast sites rank better and convert better.</p></div>
<div class="card"><h3>SEO-ready structure</h3><p>Clean URLs, proper headings, schema markup and a page for each service and the towns you serve, built in from day one.</p></div>
<div class="card"><h3>Lead capture</h3><p>Forms, click-to-call buttons and chat, integrated and tested so no interested visitor slips away.</p></div>
<div class="card"><h3>Analytics and tracking</h3><p>Google Analytics, Search Console and conversion tracking set up, so you know which pages produce calls and forms.</p></div>
</div></section>
<section><h2>Web design by town in ${S.name}</h2><p>Each town page covers what customers there search for and the nearby towns your site should show up in:</p><p>${list(ts, webOf, (n) => `Web design in ${n}`)}</p><p>${S.more}</p></section>
<section><h2>One fixed price, and the site is yours</h2><p>Website projects are quoted on a 15-minute fit call as a clear, fixed-price proposal, and nothing starts until you've seen the full price and signed the scope. You own your website, your domain and all your content, and we don't lock you into a platform you can't control. Want typical market ranges first? See <a href="/how-much-does-a-website-cost">how much a small business website costs</a>.</p></section>
<section><h2>How a website project runs</h2><ol><li><strong>Fit call.</strong> Fifteen minutes on your business, your customers and what the site has to do.</li><li><strong>Signed scope.</strong> Pages, features and a fixed price in writing before work starts.</li><li><strong>Discovery and design.</strong> We plan the pages and design them with your input at each stage.</li><li><strong>Build and review.</strong> We build the site and you review it before anything goes live.</li><li><strong>Launch and tracking.</strong> The site goes live with analytics, Search Console and conversion tracking working.</li></ol></section>
<section><h2>After launch</h2><p>A new site is the start, not the finish. We offer <a href="/services/hosting-support">managed hosting and support</a> with security updates, daily backups and ongoing maintenance, and <a href="/seo-company-${S.slug}">SEO for ${S.name} businesses</a> to grow the traffic the site turns into leads. Curious how your current site scores? Run it through the free <a href="/tools/website-grader">website grader</a>.</p></section>
${faq([
  [`Do you build websites for small businesses in ${S.name}?`, `Yes. We design and build mobile-first websites for small businesses across ${S.region}, with SEO structure, fast load times and lead capture built in.`],
  [`How much does a website cost in ${S.name}?`, `It depends on the pages and features you need. We quote every project as a clear, fixed-price proposal after a 15-minute fit call. For typical market ranges, see <a href="/how-much-does-a-website-cost">how much a small business website costs</a>.`],
  ["Will I own my website when it's done?", "Yes. You own your website, your domain and all your content, and we don't lock you into a platform you can't control."],
  ["Can you improve my existing website instead of rebuilding it?", "Yes. We assess your current site first and only recommend a rebuild when the foundation makes it more cost-effective than fixing what's there."],
  ["Will my new website show up on Google?", `It's built SEO-ready, with clean structure, fast load times, schema markup and pages for your services and towns. Ranking well usually takes ongoing work too; see <a href="/seo-company-${S.slug}">SEO in ${S.name}</a>. No honest company can guarantee a specific ranking.`],
  ["Can I update the website myself?", "Yes. We build on user-friendly platforms and provide training videos, so your team can change text, swap images or add posts without code."],
  ["Do you offer hosting and maintenance?", "Yes. We offer fully managed hosting, security updates, daily backups and ongoing maintenance, so you don't have to deal with the technical side."],
  [S.where.q, S.where.a],
])}`,
  };
}

function seoPage(S, ts) {
  const h1 = `SEO Company in ${S.name}`;
  return {
    path: `/seo-company-${S.slug}`, cluster: "local", name: `SEO in ${S.name}`,
    keyword: `seo company ${S.name.toLowerCase()}`,
    secondary: [`seo services ${S.name.toLowerCase()}`, `seo agency ${S.name.toLowerCase()}`, `local seo ${S.name.toLowerCase()}`, `small business seo ${S.abbr.toLowerCase()}`],
    title: `SEO Company in ${S.name} | CasperB2B`,
    desc: `SEO for ${S.name} small businesses: Google Business Profile, service and town pages, technical fixes and monthly reports tied to calls and forms.`,
    h1,
    intro: `CasperB2B is an SEO company for small businesses across ${S.region}. We fix the technical problems holding your site back, build a page for each service and town you serve, optimize your Google Business Profile and report every month on rankings, traffic and the calls and forms they produce.`,
    next: { service: "/services/seo", tool: "/tools/seo-checklist", article: "/how-much-does-seo-cost" },
    html: `<section><p class="eyebrow">SEO · ${S.abbr}</p><h1>${h1}</h1>
<p>When someone in ${S.short} searches for what you sell, three businesses show up in the map pack and a handful more on page one. SEO is the work that puts you there and keeps you there, measured in calls and forms, not vanity metrics.</p>
${ctas("seo", "/services/seo", "See SEO services")}</section>
<section><h2>What our SEO work includes</h2><div class="grid g2">
<div class="card"><h3>Local keyword strategy</h3><p>The exact searches your customers use for your services in the towns you serve, not generic terms that never call.</p></div>
<div class="card"><h3>Google Business Profile</h3><p>The right categories, photos, descriptions and a steady flow of genuine reviews, to compete for the top 3 map results.</p></div>
<div class="card"><h3>Service and town pages</h3><p>A useful page for each service and each town you actively serve, not thin pages Google ignores.</p></div>
<div class="card"><h3>Technical fixes</h3><p>Crawl errors, slow load times, broken links, duplicate content and mobile problems found and fixed.</p></div>
<div class="card"><h3>Local citations</h3><p>Consistent name, address and phone across directories, so Google trusts where you are and what you do.</p></div>
<div class="card"><h3>Monthly reporting</h3><p>Ranking changes, organic traffic, click-through rates and the calls and forms that came from search.</p></div>
</div></section>
<section><h2>SEO by town in ${S.name}</h2><p>Each town page covers local search there, plus web design and IT for that town:</p><p>${list(ts, (t) => `/${t.slug}`, (n) => `SEO in ${n}`)}</p><p>${S.more}</p></section>
<section><h2>How long SEO takes</h2><p>Local SEO typically shows meaningful improvement in 3–6 months with consistent effort, and quick wins like Google Business Profile fixes can show movement within weeks. No reputable SEO company can guarantee a specific ranking, because Google's algorithm is outside anyone's control. What we commit to is the method and the transparency: you see what we did each month and what it produced.</p><p>Not sure where you stand? Start with the free <a href="/tools/seo-checklist">SEO checklist</a> or a full <a href="/seo-audit">SEO audit</a>, and see <a href="/how-much-does-seo-cost">what SEO costs for a small business</a>.</p></section>
<section><h2>SEO plus ads</h2><p>Ads bring traffic the day they launch and stop the day you stop paying. SEO builds traffic that keeps coming without a per-click cost. Most local businesses do best running ads for their highest-value services while SEO grows. See <a href="/ppc-management-massachusetts">PPC management in MA & NH</a>. Need a faster, better site to rank? See <a href="/web-design-${S.slug}">web design in ${S.name}</a>.</p></section>
${faq([
  [`How long does SEO take for a ${S.name} business?`, "Local SEO typically shows meaningful improvement in 3–6 months with consistent effort. Quick wins like Google Business Profile fixes can show movement within weeks."],
  ["Do you guarantee first-page rankings?", "No. No reputable SEO company can guarantee rankings, because Google's algorithm is outside anyone's control. We commit to the method and show you exactly what we did and what it produced each month."],
  ["How much does SEO cost?", `It depends on how many locations you have and how competitive your market is. You get a fixed, written monthly scope after a 15-minute fit call, and monthly plans are month-to-month. See <a href="/how-much-does-seo-cost">what SEO costs for a small business</a>.`],
  ["Can you help us rank in several towns?", "Yes. If you serve multiple towns or have several locations, we build a page for each town you actually serve and optimize each Google Business Profile."],
  ["We already tried SEO and it didn't work. What's different?", "Most bad experiences come from keyword reports and blog posts with no strategy behind them. We start with a full audit, find what's actually holding your rankings back and build the plan around fixing that."],
  ["How will I know SEO is working?", "Monthly reporting shows ranking changes, organic traffic, click-through rates and the form and call conversions that came from search."],
  ["Do reviews affect local rankings?", "Yes. A steady flow of genuine reviews is one of the local signals Google weighs, and it helps searchers choose you once they find you."],
  [S.where.q, S.where.a],
])}`,
  };
}

function itPage(S, ts) {
  const h1 = `Managed IT Services in ${S.name}`;
  const maRule = S.abbr === "MA"
    ? [["Are there data security rules for Massachusetts businesses?", `Yes. Businesses that hold personal information about Massachusetts residents fall under the state's data security regulation, 201 CMR 17.00. Our <a href="/blog/massachusetts-cybersecurity-guide">Massachusetts cybersecurity guide</a> explains what it asks for in plain English. This is general information, not legal advice.`]]
    : [["Do you support businesses with offices in both New Hampshire and Massachusetts?", "Yes. Our remote monitoring and help desk work the same wherever your people are, so one team covers every office and remote worker."]];
  return {
    path: `/managed-it-services-${S.slug}`, cluster: "local", name: `Managed IT in ${S.name}`,
    keyword: `managed it services ${S.name.toLowerCase()}`,
    secondary: [`it support ${S.name.toLowerCase()} small business`, `managed service provider ${S.name.toLowerCase()}`, `it company ${S.name.toLowerCase()}`, `small business it services ${S.abbr.toLowerCase()}`],
    title: `Managed IT Services in ${S.name} | CasperB2B`,
    desc: `Managed IT for ${S.name} small businesses: monitoring, help desk, Microsoft 365, backups and security for a flat monthly fee, with no lock-in.`,
    h1,
    intro: `CasperB2B works as the IT department for small businesses across ${S.region}. We monitor and patch your computers and network, run your help desk remotely, manage Microsoft 365 or Google Workspace and your backups, and help you plan technology purchases, for a flat monthly fee typically priced per user or per device.`,
    next: { service: "/services/managed-it", tool: "/tools/cyber-risk-quiz", article: "/is-my-business-too-small-to-hack" },
    html: `<section><p class="eyebrow">Managed IT · ${S.abbr}</p><h1>${h1}</h1>
<p>Most small businesses in ${S.short} run IT the expensive way: call someone when something breaks, pay emergency rates and lose a day of work. Managed IT flips that. We look after your systems every day so most problems never happen, and when they do, help is a call or a screen-share away.</p>
${ctas("it", "/services/managed-it", "See managed IT")}</section>
<section><h2>What's included</h2><div class="grid g2">
<div class="card"><h3>Monitoring and maintenance</h3><p>Computers, servers and network monitored proactively, with updates and patches applied to keep them secure.</p></div>
<div class="card"><h3>Help desk and remote support</h3><p>Fast remote help for day-to-day issues, without waiting for a technician to drive out.</p></div>
<div class="card"><h3>Microsoft 365 and Google Workspace</h3><p>Email, accounts and cloud storage set up, managed and kept tidy as people join and leave.</p></div>
<div class="card"><h3>Backups</h3><p>Backups managed and restores tested, so a lost laptop or ransomware attack doesn't mean lost work.</p></div>
<div class="card"><h3>Security</h3><p>Updates and patches kept current and backups protected, with full protection available through our <a href="/services/cybersecurity">cybersecurity services</a>.</p></div>
<div class="card"><h3>Technology planning</h3><p>Advice on what to buy and when, so you invest in the right tools at the right time.</p></div>
</div></section>
<section><h2>Managed IT by town in ${S.name}</h2><p>${list(ts, itOf, (n) => `Managed IT in ${n}`)}</p><p>${S.more}</p></section>
<section><h2>No lock-in</h2><p>All documentation, credentials and configurations are yours, and we don't tie you to proprietary systems, so moving to or from our service is straightforward. You get a fixed, written quote before any work starts. Comparing options? See <a href="/outsourced-it-support-small-business">outsourced IT support for small business</a> and <a href="/do-i-need-an-it-person">whether you need an in-house IT person</a>.</p></section>
<section><h2>Are you a target?</h2><p>Yes, whatever your size. Automated attacks scan every business for weak passwords, missing updates and missing backups. Read <a href="/is-my-business-too-small-to-hack">why small businesses get hacked</a>, or take the free <a href="/tools/cyber-risk-quiz">cyber risk quiz</a> to see where you stand.</p></section>
${faq([
  [`Do you provide managed IT for small businesses in ${S.name}?`, `Yes. We look after small businesses across ${S.region}, with monitoring and help desk support delivered remotely.`],
  ["How is managed IT priced?", "As a flat monthly fee, typically priced per user or per device, so it scales with your team. You get a fixed, written quote before any work starts."],
  ["What's the difference between managed IT and break-fix support?", "Break-fix charges you after something breaks. Managed IT monitors and maintains your systems to catch problems early for a flat monthly fee, which means less downtime and more predictable costs."],
  ["Is managed IT worth it for a five-person office?", "Usually, yes. Even a business with five computers and Microsoft 365 needs updates, backups, security and someone to call, and that's where most small offices get caught out."],
  ["Do you support remote and hybrid workers?", "Yes. Our remote monitoring and management tools let us support, secure and update laptops wherever your people work."],
  ["What if we want to switch providers later?", "You can. All documentation, credentials and configurations are yours, and we don't lock you into proprietary systems."],
  ...maRule,
  [S.where.q, S.where.a],
])}`,
  };
}

const plumber = {
  path: "/plumber-marketing", cluster: "customers", name: "Plumber marketing",
  keyword: "plumber marketing",
  secondary: ["marketing for plumbers", "plumbing marketing agency", "plumber seo", "plumbing leads massachusetts", "plumber marketing new hampshire"],
  title: "Plumber Marketing in MA & NH | CasperB2B",
  desc: "Plumber marketing for Massachusetts and New Hampshire plumbing companies: local SEO, Google Ads for urgent calls, reviews and missed-call text back.",
  h1: "Marketing for Plumbers in Massachusetts & New Hampshire",
  intro: "Plumber marketing is how a plumbing company turns \"plumber near me\" searches and urgent calls into booked jobs: town pages that rank, a Google Business Profile with steady reviews, ads for urgent and high-value work, and an instant text back to every call you miss while you're on a job. CasperB2B sets it up and runs it for plumbing companies across Massachusetts and New Hampshire.",
  next: { service: "/services/local-seo", tool: "/quiz", article: "/make-my-phone-ring" },
  html: `<section><p class="eyebrow">Trades · Plumbing</p><h1>Marketing for Plumbers in Massachusetts & New Hampshire</h1>
<p>Plumbing customers rarely shop around for long. A burst pipe or a dead water heater means they call the first plumber who shows up on Google and answers. Plumber marketing is making sure that's you, and that a call you can't pick up still turns into a job.</p>
${ctas("marketing", "/contractor-marketing", "See contractor marketing")}</section>
<section><h2>Where plumbing companies lose jobs</h2><ul><li>Missing calls while on a job, so the customer calls the next plumber.</li><li>Not showing up for "plumber near me" or "[service] [town]" searches.</li><li>Too few recent Google reviews compared with the competition.</li><li>Quotes for bigger jobs, like water heaters or bathroom work, going cold with no follow-up.</li><li>Slow months with nothing in place to bring past customers back.</li></ul></section>
<section><h2>What we set up and run</h2><div class="grid g2">
<div class="card"><h3>Town and service pages</h3><p>Pages built for the searches people make, such as "water heater replacement Haverhill MA", in every town you serve.</p></div>
<div class="card"><h3>Google Business Profile and reviews</h3><p>A fully optimized profile and an automatic review request by text after every completed job.</p></div>
<div class="card"><h3>Google Ads for urgent work</h3><p>Local Services Ads and Search Ads aimed at high-intent searches, with every call tracked. See <a href="/ppc-management-massachusetts">PPC management in MA & NH</a>.</p></div>
<div class="card"><h3>Missed-call text back</h3><p>An automatic text within seconds of a missed call, so the customer waits for you instead of calling a competitor. See <a href="/problems/missed-calls">missed calls</a>.</p></div>
<div class="card"><h3>Quote follow-up</h3><p>Automated text and email check-ins on open estimates, so big jobs don't quietly go cold.</p></div>
<div class="card"><h3>Seasonal campaigns</h3><p>Email and text campaigns to past customers for maintenance and seasonal work, to fill the slow months.</p></div>
</div></section>
<section><h2>A website that books jobs</h2><p>A mobile-first site with click-to-call on every page, a fast booking form and a page for each service and town gives your ads and SEO somewhere to send people. See <a href="/web-design-massachusetts">web design in Massachusetts</a> or <a href="/web-design-new-hampshire">New Hampshire</a>, and <a href="/services/local-seo">local SEO</a> to rank it.</p></section>
<section><h2>Where we work</h2><p>We work with plumbing companies across <a href="/massachusetts">Massachusetts</a>, including the <a href="/north-shore-ma">North Shore and Merrimack Valley</a>, and <a href="/new-hampshire">southern New Hampshire</a>, and remotely anywhere in the U.S. Also in the trades? See <a href="/niches/hvac-home-services">HVAC and home services</a> and all <a href="/contractor-marketing">contractor marketing</a>.</p></section>
${faq([
  ["How do plumbers get more calls from Google?", "Rank for the searches people make when they need a plumber: an optimized Google Business Profile with steady reviews, a page for each service and town you serve, and a fast mobile site with click-to-call. Ads cover urgent searches while SEO grows."],
  ["Should a plumbing company run Google Ads or do SEO?", "Usually both. Ads bring calls the day they launch and stop when you stop paying; SEO builds calls you don't pay for per click. Most plumbers run ads for urgent and high-value work while SEO grows."],
  ["What happens when I miss a call while I'm on a job?", "Missed-call text back sends the caller an automatic text within seconds saying you'll be in touch shortly, which keeps them from calling the next plumber."],
  ["How do I get more Google reviews for my plumbing business?", "Ask every happy customer, every time. We automate it with a text review request after each completed job, so it happens without anyone remembering to ask."],
  ["Do you build websites for plumbers?", "Yes. Mobile-first sites with click-to-call, a fast booking form and service and town pages, quoted as one fixed price after a 15-minute fit call."],
  ["How do you follow up on quotes customers haven't accepted?", "Automated text and email check-ins on every open estimate, so bigger jobs like water heaters don't go cold because nobody followed up."],
  ["How much does plumber marketing cost?", "It depends on what you need. You get a fixed, written quote after a 15-minute fit call, and nothing starts until you've signed the scope."],
  ["Do you work with plumbers outside Massachusetts and New Hampshire?", "Yes. Our local focus is MA and NH, but we work remotely with businesses anywhere in the U.S."],
])}`,
};

export const STATE_PAGES = [
  webPage(STATES.ma, towns("ma")), webPage(STATES.nh, towns("nh")),
  seoPage(STATES.ma, towns("ma")), seoPage(STATES.nh, towns("nh")),
  itPage(STATES.ma, towns("ma")), itPage(STATES.nh, towns("nh")),
  plumber,
];
