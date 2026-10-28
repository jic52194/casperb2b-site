// Keyword pages built from Search Console demand (2026-10): phrases that already earn impressions but had no page of
// their own. Every fact here is already stated elsewhere on casperb2b.com (/services/ppc, /b2b-growth, /niches/*,
// /problems/missed-calls, cost pages). build.mjs adds each entry as a page and a keyword-plan row.
// Essex County towns with their own page (North Shore + Merrimack Valley); Georgetown keeps its hand-written page
const ESSEX = [["/georgetown-ma", "Georgetown"], ["/haverhill-ma", "Haverhill"], ["/newburyport-ma", "Newburyport"], ["/newbury-ma", "Newbury"], ["/amesbury-ma", "Amesbury"], ["/salisbury-ma", "Salisbury"], ["/rowley-ma", "Rowley"], ["/ipswich-ma", "Ipswich"], ["/boxford-ma", "Boxford"], ["/groveland-ma", "Groveland"], ["/topsfield-ma", "Topsfield"], ["/north-andover-ma", "North Andover"], ["/andover-ma", "Andover"], ["/methuen-ma", "Methuen"], ["/danvers-ma", "Danvers"], ["/peabody-ma", "Peabody"], ["/beverly-ma", "Beverly"], ["/salem-ma", "Salem"]];
const TOWNS = [["/andover-ma", "Andover"], ["/north-andover-ma", "North Andover"], ["/methuen-ma", "Methuen"], ["/haverhill-ma", "Haverhill"], ["/beverly-ma", "Beverly"], ["/newburyport-ma", "Newburyport"], ["/salem-nh", "Salem, NH"], ["/bedford-nh", "Bedford, NH"], ["/portsmouth-nh", "Portsmouth, NH"]];

export const SEO_PAGES = [
  {
    path: "/b2b-ppc-management", cluster: "marketing", name: "B2B PPC management",
    keyword: "b2b ppc management",
    secondary: ["b2b ppc services", "b2b paid search management", "ppc management for b2b", "b2b google ads management"],
    title: "B2B PPC Management Services | CasperB2B",
    desc: "B2B PPC management: Google Ads and paid social built for long sales cycles, tracked into your CRM and reported as pipeline, not clicks.",
    h1: "B2B PPC Management",
    intro: "B2B PPC management is running paid search and paid social for a company that sells to other businesses, where one deal is worth a lot, buyers research for weeks and several people sign off. CasperB2B builds and manages those campaigns, sends every lead into your CRM and reports on pipeline, not clicks.",
    next: { service: "/services/ppc", tool: "/tools/marketing-budget-calculator", article: "/b2b-growth" },
    html: `<section><p class="eyebrow">Paid advertising for B2B</p><h1>B2B PPC Management</h1>
<p>Most PPC advice is written for shops and local services where someone clicks and buys the same day. B2B is different: higher deal values, longer sales cycles and a buying committee instead of one person. Your campaigns need to be built for that.</p>
<p class="ctas"><a class="btn" href="/contact?topic=marketing">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/services/ppc">See PPC management</a></p></section>
<section><h2>Why B2B PPC is different</h2><ul><li><strong>Long sales cycles:</strong> a click today may become a deal in months, so you need tracking that follows the lead into your CRM.</li><li><strong>Buying committees:</strong> several people research before anyone fills out a form, so ads and landing pages have to answer different questions.</li><li><strong>Fewer, more valuable searches:</strong> broad keywords waste budget fast; high-intent, specific terms and a strong negative-keyword list matter more.</li><li><strong>Lead quality over lead volume:</strong> a cheap lead that never becomes an opportunity is expensive. We judge campaigns by cost per acquisition and return on ad spend, not cost per click.</li></ul></section>
<section><h2>What we manage for you</h2><div class="grid g2">
<div class="card"><h3>Campaign architecture</h3><p>Structured ad groups, match types and negative keywords built for budget efficiency from day one.</p></div>
<div class="card"><h3>High-intent targeting</h3><p>Search terms that signal buying intent, not general awareness searches that drain the budget.</p></div>
<div class="card"><h3>Ad copy and landing pages</h3><p>Ads that speak to the exact problem your buyer has, and landing pages that match the ad so the click turns into a conversation.</p></div>
<div class="card"><h3>Call, form and CRM tracking</h3><p>Every call and form is tracked to the campaign that produced it and flows into your CRM, so you see which ads create opportunities.</p></div>
<div class="card"><h3>Bid management</h3><p>Manual and automated bidding, adjusted on performance data to lower your cost per lead over time.</p></div>
<div class="card"><h3>Monthly reporting</h3><p>Impressions, clicks, conversions, cost per lead and, with our analytics team, the opportunities and revenue behind them.</p></div>
</div></section>
<section><h2>Measure pipeline, not clicks</h2><p>A B2B campaign is working when it creates qualified opportunities, not when it gets cheap clicks. We connect your ads to your CRM, agree in writing what counts as a qualified lead, and adjust every week based on what your sales team says was real. That feedback loop is what stops the budget leaking into searches that never buy.</p><p>Ad spend is paid to the ad platform separately from the management fee. New campaigns typically need about 30 days of data before meaningful optimization, and performance generally improves over the first 60–90 days.</p></section>
<section><h2>How an engagement runs</h2><ol><li><strong>Fit call.</strong> Fifteen minutes to understand your offer, buyer and current pipeline.</li><li><strong>Signed scope.</strong> Targets, the definition of a qualified lead, channels and reporting, in writing before work starts.</li><li><strong>Build and launch.</strong> Account structure, keywords, ads, landing pages and tracking, then a controlled launch.</li><li><strong>Weekly feedback.</strong> Your sales team tells us which leads were real, and we adjust targeting and bids.</li><li><strong>Pipeline reporting.</strong> Opportunities and revenue, not just clicks.</li></ol></section>
<section><h2>When PPC is the right channel</h2><p>Paid search works best when buyers already search for what you sell. If they don't search yet, <a href="/services/demand-generation">demand generation</a> builds interest first; if you sell to a short list of large accounts, <a href="/services/account-based-marketing">account-based marketing</a> fits better; and if your reps need meetings rather than inbound leads, look at <a href="/services/appointment-setting">appointment setting</a>. See all six on our <a href="/b2b-growth">B2B pipeline generation</a> page.</p></section>
<section><h2>B2B PPC questions</h2>
<details><summary>How much should a B2B company spend on Google Ads?</summary><p>It depends on your market, offer and competition. We recommend a budget based on search volume and competitive cost-per-click data, and we never recommend a budget we don't believe can produce a positive return. Try our <a href="/tools/marketing-budget-calculator">marketing budget calculator</a> for a starting point.</p></details>
<details><summary>Is ad spend included in PPC management?</summary><p>Usually not. Your ad budget is paid directly to the ad platform, separately from the management fee. CasperB2B quotes management on a 15-minute fit call.</p></details>
<details><summary>How long before B2B PPC produces leads?</summary><p>Ads can drive leads within days of launch. Campaigns typically need about 30 days of data for meaningful optimization, and performance generally improves over the first 60–90 days.</p></details>
<details><summary>We tried Google Ads and wasted the budget. What's different?</summary><p>Most waste comes from keywords that are too broad, landing pages that don't match the ad and no conversion tracking. We audit past campaigns, find where the money went and rebuild for your market, with every lead tracked into your CRM.</p></details>
<details><summary>Do I need to manage the campaigns myself?</summary><p>No. We handle setup, monitoring, optimization and reporting. You review monthly reports and we flag decisions that need your input.</p></details>
</section>`,
  },
  {
    path: "/contractor-marketing", cluster: "customers", name: "Contractor marketing",
    keyword: "contractor marketing massachusetts",
    secondary: ["digital marketing for contractors", "contractor seo", "lead generation for contractors", "hvac contractor lead generation massachusetts", "contractor marketing new hampshire"],
    title: "Contractor Marketing in Massachusetts & NH | CasperB2B",
    desc: "Contractor marketing for Massachusetts and New Hampshire trades: websites, local SEO, Google Ads, reviews and missed-call text back, done for you.",
    h1: "Contractor Marketing in Massachusetts & New Hampshire",
    intro: "Contractor marketing is everything that turns a homeowner's search into a booked job: a website that shows your work, pages that rank for your service in each town, a Google Business Profile with steady reviews, ads for high-value jobs and fast follow-up on every call and quote. CasperB2B sets it up and runs it for contractors across Massachusetts and New Hampshire.",
    next: { service: "/services/local-seo", tool: "/quiz", article: "/make-my-phone-ring" },
    html: `<section><p class="eyebrow">Trades & home services</p><h1>Contractor Marketing in Massachusetts & New Hampshire</h1>
<p>Contractors win work from two places: referrals and the internet. Referrals you already earn. The internet side, showing up when someone searches "roofer near me" or "electrician ${"Andover"}", and answering before they call the next company, is what we build and run for you.</p>
<p class="ctas"><a class="btn" href="/contact?topic=marketing">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/quiz">Find my biggest revenue leak</a></p></section>
<section><h2>Who we help</h2><div class="grid g3">
<a class="card-link" href="/niches/construction-companies"><h3>Construction & remodeling</h3><p>Portfolio websites, service-area pages and quote follow-up for builders and general contractors.</p></a>
<a class="card-link" href="/niches/hvac-home-services"><h3>HVAC & home services</h3><p>Rank for heating and cooling searches and catch every call during the busy season.</p></a>
<a class="card-link" href="/niches/roofing-companies"><h3>Roofing</h3><p>Local SEO, reviews and ads for high-value roof replacement jobs.</p></a>
<a class="card-link" href="/niches/electricians"><h3>Electricians</h3><p>Show up for urgent and planned electrical work in every town you serve.</p></a>
<a class="card-link" href="/niches/pest-control"><h3>Pest control</h3><p>Fast response and recurring-service follow-up for pest control companies.</p></a>
<a class="card-link" href="/how-to-get-more-customers-for-my-hvac-business"><h3>Getting more HVAC customers</h3><p>The step-by-step version for heating and cooling companies.</p></a>
</div></section>
<section><h2>What we set up for contractors</h2><ul>
<li><strong>A website that wins bids:</strong> project portfolio with photos, clear service pages and one-tap calling on mobile.</li>
<li><strong>Service-area pages:</strong> a page for each service in each town you work in (for example "general contractor Georgetown MA"), because that is how homeowners search.</li>
<li><strong>Google Business Profile and reviews:</strong> correct categories, photos and a steady flow of new reviews after every finished job.</li>
<li><strong>Google Ads for high-value jobs:</strong> targeted at searches with real buying intent, with every call and form tracked.</li>
<li><strong>Missed-call text back:</strong> when you can't pick up on a job site, the caller gets a text right away instead of calling the next contractor. <a href="/problems/missed-calls">How missed-call text back works</a>.</li>
<li><strong>Quote follow-up:</strong> automated check-ins with people who got a quote but haven't decided, so you stay top of mind.</li>
</ul></section>
<section><h2>Contractor marketing by town</h2><p>We work with contractors across the North Shore, Merrimack Valley and southern New Hampshire, remotely from our base in Georgetown, MA. See what we do in your area:</p><p>${TOWNS.map(([h, n]) => `<a href="${h}">${n}</a>`).join(" · ")} · <a href="/service-areas">all service areas</a></p></section>
<section><h2>What contractor marketing costs</h2><p>Typical market ranges: a local SEO campaign for a small business runs about $800–$2,500 a month, and a lead-generating website about $2,500–$8,000 to build. Ad spend is paid to Google separately. CasperB2B quotes your exact scope as a fixed, written price after a 15-minute fit call. See <a href="/how-much-does-seo-cost">what SEO costs</a> and <a href="/how-much-does-a-website-cost">what a website costs</a>.</p></section>
<section><h2>How we work with contractors</h2><ol><li><strong>Discovery & audit</strong> of your website, Google presence and how leads reach you today.</li><li><strong>Strategy & blueprint:</strong> a written plan with the highest-impact fixes first.</li><li><strong>Execution & launch:</strong> we build it, launch it and train your team.</li><li><strong>Optimization & reporting:</strong> monthly reporting and quarterly reviews.</li></ol></section>
<section><h2>Contractor marketing questions</h2>
<details><summary>What is the best marketing for contractors?</summary><p>For most contractors: a fast website with your work on it, a page for each service in each town you serve, an active Google Business Profile with steady reviews, and fast follow-up on every call and quote. Ads add volume for high-value jobs once those basics are in place.</p></details>
<details><summary>How do contractors get more leads online?</summary><p>Rank in Google and the map results for your service plus town, make calling you one tap on mobile, answer every missed call with an instant text, and follow up on quotes automatically.</p></details>
<details><summary>How long does contractor SEO take?</summary><p>Local SEO typically shows meaningful improvement in 3–6 months of consistent work. Quick wins, like fixing your Google Business Profile and listings, can show sooner.</p></details>
<details><summary>Do you work with contractors outside Massachusetts and New Hampshire?</summary><p>Yes. Our local focus is Massachusetts and New Hampshire, and we work remotely with businesses anywhere in the U.S.</p></details>
</section>`,
  },
  {
    path: "/b2b-marketing-agency-massachusetts", cluster: "customers", name: "B2B marketing in Massachusetts",
    keyword: "b2b marketing agency massachusetts",
    secondary: ["b2b lead generation boston", "b2b marketing companies in new england", "b2b marketing agency boston", "b2b lead generation massachusetts"],
    title: "B2B Marketing Agency in Massachusetts | CasperB2B",
    desc: "B2B marketing and lead generation for Massachusetts and New England companies: lead generation, appointment setting, ABM and paid search into your CRM.",
    h1: "B2B Marketing Agency in Massachusetts",
    intro: "CasperB2B is a B2B marketing and lead generation company founded in Georgetown, Massachusetts. We help companies that sell to other businesses, in Boston, across Massachusetts and New England and beyond, fill their pipeline with qualified leads, booked meetings and engaged target accounts, delivered into their CRM.",
    next: { service: "/b2b-growth", tool: "/tools/marketing-budget-calculator", article: "/services/b2b-lead-generation" },
    html: `<section><p class="eyebrow">B2B growth · Massachusetts & New England</p><h1>B2B Marketing Agency in Massachusetts</h1>
<p>Selling to other businesses means long sales cycles, buying committees and a pipeline that has to be built on purpose. We run the parts that fill it, from researched target lists to booked meetings, and report on opportunities and revenue rather than clicks.</p>
<p class="ctas"><a class="btn" href="/contact?topic=marketing">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/b2b-growth">See all B2B services</a></p></section>
<section><h2>What we run for B2B companies</h2><div class="grid g2">
<a class="card-link" href="/services/b2b-lead-generation"><h3>B2B lead generation</h3><p>Researched decision-makers who match your ideal customer profile, reached by email, LinkedIn and phone, delivered to your CRM.</p></a>
<a class="card-link" href="/services/appointment-setting"><h3>Appointment setting</h3><p>SDRs book qualified meetings with decision-makers onto your calendar, with handover notes.</p></a>
<a class="card-link" href="/services/outbound-prospecting"><h3>Outbound prospecting</h3><p>Cold email, LinkedIn and calling sequences on sound deliverability, with every reply handled.</p></a>
<a class="card-link" href="/services/demand-generation"><h3>Demand generation</h3><p>Content, LinkedIn and ads that build interest before buyers are in market.</p></a>
<a class="card-link" href="/services/account-based-marketing"><h3>Account-based marketing</h3><p>Coordinated plays aimed at the buying committees inside a list of high-value accounts.</p></a>
<a class="card-link" href="/b2b-ppc-management"><h3>B2B PPC management</h3><p>Paid search and paid social for long sales cycles, tracked into your CRM.</p></a>
</div></section>
<section><h2>Which one to start with</h2><ul><li><strong>Your reps have time but nobody to call:</strong> start with <a href="/services/b2b-lead-generation">B2B lead generation</a>.</li><li><strong>Your reps should be closing, not prospecting:</strong> start with <a href="/services/appointment-setting">appointment setting</a>.</li><li><strong>Buyers already search for what you sell:</strong> add <a href="/b2b-ppc-management">B2B PPC</a>.</li><li><strong>You sell to a short list of large accounts:</strong> use <a href="/services/account-based-marketing">account-based marketing</a>.</li></ul></section>
<section><h2>How every engagement runs</h2><ol><li><strong>Fit call.</strong> Fifteen minutes to understand your offer, buyer and current pipeline.</li><li><strong>Signed scope.</strong> Targets, what counts as a qualified lead or meeting, channels and reporting, in writing before work starts.</li><li><strong>Build and launch.</strong> Profile, list, messaging and infrastructure, then a controlled launch.</li><li><strong>Weekly feedback.</strong> Your sales team tells us which leads and meetings were real, and we adjust.</li><li><strong>Pipeline reporting.</strong> Opportunities and revenue, set up with our analytics team.</li></ol></section>
<section><h2>Industries we focus on</h2><p>Long sales cycles and multi-person buying committees change how pipeline work should run. We have dedicated pages for <a href="/niches/saas">SaaS lead generation</a>, <a href="/niches/cybersecurity-companies">lead generation for cybersecurity companies</a> and <a href="/niches/fintech">fintech lead generation</a>, plus <a href="/niches/consulting-firms">consulting firms</a> and <a href="/niches/it-services">IT services</a>.</p></section>
<section><h2>Boston, Massachusetts and beyond</h2><p>We were founded in Georgetown, Massachusetts, north of Boston, and work remotely with B2B companies across Massachusetts, New Hampshire and New England, and anywhere in the U.S. Outreach and campaigns target your buyers wherever they are, not just where we are.</p><p>Want a dedicated person on your team instead of a managed service? A <a href="/casper-va/sdr">Casper VA SDR</a> works inside your team.</p></section>
<section><h2>B2B marketing questions</h2>
<details><summary>What does a B2B marketing agency do?</summary><p>It builds and runs the work that fills a B2B sales pipeline: target lists, outreach, meeting booking, paid search, content and account-based plays, measured by qualified opportunities and revenue.</p></details>
<details><summary>Do you work with Boston companies?</summary><p>Yes. We're based north of Boston in Georgetown, MA, and work with companies in Boston, across Massachusetts and New England, and remotely anywhere in the U.S.</p></details>
<details><summary>How do you define a qualified lead?</summary><p>In writing, before work starts. Every lead is tagged marketing-qualified, sales-qualified or callback-ready so your team knows who to call first.</p></details>
<details><summary>What does B2B lead generation cost?</summary><p>It depends on your targets, channels and volume. CasperB2B quotes every engagement as a fixed, written scope after a 15-minute fit call. See <a href="/pricing">how pricing works</a>.</p></details>
</section>`,
  },
  {
    path: "/outsourced-it-support-small-business", cluster: "cyber", name: "Outsourced IT support",
    keyword: "outsourced it support for small business",
    secondary: ["outsourced it for small business north shore ma", "it support for small business massachusetts", "managed it new hampshire", "small business it support north shore"],
    title: "Outsourced IT Support for Small Business | CasperB2B",
    desc: "Outsourced IT support for small businesses in Massachusetts and New Hampshire: help desk, monitoring, Microsoft 365, backups and security, flat monthly fee.",
    h1: "Outsourced IT Support for Small Business",
    intro: "Outsourced IT support means a team outside your company acts as your IT department: they monitor and patch your computers, answer your team's help desk requests, manage Microsoft 365 or Google Workspace and backups, and keep you secure, usually for a flat monthly fee. CasperB2B does this for small businesses across the North Shore, Merrimack Valley and southern New Hampshire.",
    next: { service: "/services/managed-it", tool: "/tools/cyber-risk-quiz", article: "/do-i-need-an-it-person" },
    html: `<section><p class="eyebrow">Cybersecurity & IT · MA & NH</p><h1>Outsourced IT Support for Small Business</h1>
<p>Most small businesses don't need a full-time IT person. They need computers that stay patched, someone to call when something breaks, backups that actually restore and security that blocks the common attacks. That is what outsourced IT covers.</p>
<p class="ctas"><a class="btn" href="/contact?topic=cybersecurity">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/tools/cyber-risk-quiz">Take the cyber risk quiz</a></p></section>
<section><h2>What outsourced IT support includes</h2><ul>
<li><strong>Monitoring and maintenance</strong> of computers, servers and network, with updates and patches applied before problems hit.</li>
<li><strong>Help desk and remote support</strong> for your team's day-to-day issues, without waiting for a technician to drive out.</li>
<li><strong>Microsoft 365 or Google Workspace</strong> and cloud storage set up, managed and secured.</li>
<li><strong>Backups</strong> managed and restores tested, so data can actually come back.</li>
<li><strong>Security basics:</strong> multi-factor authentication, endpoint protection, email security and access removed the day someone leaves.</li>
<li><strong>Technology planning</strong> so you buy the right tools at the right time, and support for remote workers wherever they are.</li>
</ul><p>No lock-in: all documentation, credentials and configurations are yours. See <a href="/services/managed-it">managed IT</a>, <a href="/services/cybersecurity">cybersecurity</a> and <a href="/services/it-infrastructure">IT infrastructure</a> for the detail.</p></section>
<section><h2>Outsourced IT vs. hiring an IT person</h2><p>A full-time hire gives you one person's skills and availability. Outsourced IT gives you a team, proactive monitoring and a predictable monthly cost, typically priced per user or per device. For most small businesses, the cost is comparable to a few hours of emergency IT support a month. Not sure which you need? Read <a href="/do-i-need-an-it-person">do I need an IT person?</a></p></section>
<section><h2>Outsourced IT vs. break-fix</h2><p>Break-fix support charges you after something breaks. Managed, outsourced IT monitors and maintains your systems to catch problems early, for a flat monthly fee: less downtime and more predictable costs.</p></section>
<section><h2>Where we support small businesses</h2><p>We support businesses remotely across the North Shore, Merrimack Valley and southern New Hampshire from our base in Georgetown, MA. Local pages: <a href="/salem-ma/managed-it">Salem, MA</a> · <a href="/andover-ma/managed-it">Andover</a> · <a href="/danvers-ma/managed-it">Danvers</a> · <a href="/newburyport-ma/managed-it">Newburyport</a> · <a href="/haverhill-ma/managed-it">Haverhill</a> · <a href="/beverly-ma/managed-it">Beverly</a> · <a href="/salem-nh/managed-it">Salem, NH</a> · <a href="/portsmouth-nh/managed-it">Portsmouth, NH</a> · <a href="/managed-it-georgetown-ma">Georgetown</a>.</p></section>
<section><h2>How we start</h2><ol><li><strong>Fit call.</strong> Fifteen minutes on your team, devices and what keeps breaking.</li><li><strong>Assessment.</strong> We inventory devices, accounts, network, backups and who has admin access.</li><li><strong>Signed scope.</strong> What we manage, response expectations and the monthly price, in writing.</li><li><strong>Onboarding.</strong> Monitoring, backups and security controls set up, documented and handed over.</li></ol></section>
<section><h2>Outsourced IT questions</h2>
<details><summary>What does outsourced IT support cost for a small business?</summary><p>It's typically priced per user or per device, so it scales with your team. CasperB2B quotes a flat monthly price in writing after a 15-minute fit call.</p></details>
<details><summary>Can you support our remote employees?</summary><p>Yes. Remote monitoring and management tools let us support, secure and update laptops wherever your team works.</p></details>
<details><summary>What if we want to switch IT providers later?</summary><p>All documentation, credentials and configurations are yours, so moving to or from our service is straightforward.</p></details>
<details><summary>Is my business too small to be hacked?</summary><p>No. Most attacks are automated and look for weak passwords, missing multi-factor authentication and unpatched software, regardless of size. See <a href="/is-my-business-too-small-to-hack">is my business too small to hack?</a></p></details>
</section>`,
  },
  {
    path: "/ppc-management-massachusetts", cluster: "marketing", name: "PPC management in MA & NH",
    keyword: "ppc management massachusetts",
    secondary: ["google ads agency north shore", "adwords management north shore", "ppc agency portsmouth nh", "seacoast nh ppc agency", "ppc services massachusetts", "google ads management new hampshire"],
    title: "PPC & Google Ads Management in MA & NH | CasperB2B",
    desc: "PPC and Google Ads management for North Shore, Merrimack Valley and southern NH businesses: high-intent ads, call tracking and monthly reporting.",
    h1: "PPC & Google Ads Management in Massachusetts & New Hampshire",
    intro: "CasperB2B manages Google Ads and paid social for businesses across Massachusetts' North Shore and Merrimack Valley and southern New Hampshire, from Portsmouth and the Seacoast to Nashua and Manchester. We target the searches people make when they're ready to buy in your towns, track every call and form, and report cost per lead every month.",
    next: { service: "/services/ppc", tool: "/tools/marketing-budget-calculator", article: "/how-much-does-seo-cost" },
    html: `<section><p class="eyebrow">Paid advertising · MA & NH</p><h1>PPC & Google Ads Management in Massachusetts & New Hampshire</h1>
<p>Local Google Ads work when they show up for the right searches in the right towns and every lead is tracked. They fail when the targeting is too broad, the landing page doesn't match the ad and nobody can tell which campaign produced a call. We fix all three.</p>
<p class="ctas"><a class="btn" href="/contact?topic=marketing">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/services/ppc">See PPC management</a></p></section>
<section><h2>What local PPC management includes</h2><ul>
<li><strong>Location targeting</strong> set to the towns and service areas you actually work in, not the whole state.</li>
<li><strong>High-intent keywords</strong> such as "[your service] near me" or "[your service] [town]", with negative keywords to cut wasted clicks.</li>
<li><strong>Ad copy and landing pages</strong> that match each search, so the click turns into a call or form.</li>
<li><strong>Call and form tracking</strong>, so every lead is attributed to the campaign that produced it and lands in your CRM.</li>
<li><strong>Bid management</strong> adjusted on performance data to lower cost per lead over time.</li>
<li><strong>Monthly reporting</strong> on impressions, clicks, conversions and cost per lead.</li>
</ul></section>
<section><h2>Where we run campaigns</h2><p><strong>Massachusetts:</strong> the North Shore and Merrimack Valley, including ${ESSEX.slice(0, 12).map(([h, n]) => `<a href="${h}">${n}</a>`).join(", ")} and more (<a href="/north-shore-ma">all North Shore towns</a>).</p><p><strong>New Hampshire:</strong> <a href="/portsmouth-nh">Portsmouth</a> and the Seacoast, <a href="/salem-nh">Salem</a>, <a href="/nashua-nh">Nashua</a>, <a href="/manchester-nh">Manchester</a>, <a href="/bedford-nh">Bedford</a> and the rest of <a href="/new-hampshire">southern New Hampshire</a>.</p><p>We also run campaigns remotely for businesses anywhere in the U.S.</p></section>
<section><h2>How fast PPC works and what it costs</h2><p>Unlike SEO, Google Ads can drive leads within days of launch. New campaigns typically need about 30 days of data for meaningful optimization, and performance generally improves over the first 60–90 days. Your ad budget is paid to Google separately from the management fee; we recommend a budget based on local search volume and competitive cost-per-click data, and quote management on a 15-minute fit call. Get a starting point with our <a href="/tools/marketing-budget-calculator">marketing budget calculator</a>.</p></section>
<section><h2>PPC plus SEO</h2><p>Ads buy you visibility now; <a href="/services/local-seo">local SEO</a> builds visibility you don't pay for per click. Most local businesses do best running ads for their highest-value services while SEO grows. Selling to other businesses? See <a href="/b2b-ppc-management">B2B PPC management</a>.</p></section>
<section><h2>Local PPC questions</h2>
<details><summary>Do you manage Google Ads for businesses on the North Shore?</summary><p>Yes. We manage Google Ads for businesses across the North Shore and Merrimack Valley, remotely from our base in Georgetown, MA.</p></details>
<details><summary>Do you run PPC for Portsmouth and Seacoast NH businesses?</summary><p>Yes. We run campaigns for businesses in Portsmouth, the Seacoast and across southern New Hampshire.</p></details>
<details><summary>How much should I spend on Google Ads?</summary><p>It depends on your market, service and competition. We recommend a budget based on local search volume and cost-per-click data, and never one we don't believe can produce a positive return.</p></details>
<details><summary>Is ad spend included in PPC management?</summary><p>Usually not. Your ad budget goes directly to Google; the management fee is separate and quoted on a 15-minute fit call.</p></details>
<details><summary>What is a good cost per lead?</summary><p>It depends on your margins. If a $50 lead turns into a $5,000 job, that's a great cost per lead. We focus on cost per acquisition and return on ad spend, not the cheapest clicks.</p></details>
</section>`,
  },
  {
    path: "/north-shore-ma", cluster: "local", name: "North Shore, MA",
    keyword: "digital marketing agency north shore ma",
    secondary: ["north shore marketing agency", "seo north shore ma", "reputation management north shore massachusetts", "it support north shore ma", "web design north shore ma"],
    title: "Digital Marketing Agency, North Shore MA | CasperB2B",
    desc: "SEO, web design, Google Ads, reviews and IT for North Shore and Merrimack Valley businesses, from a Georgetown, MA team. Free 15-minute fit call.",
    h1: "Digital Marketing Agency on the North Shore, MA",
    intro: "CasperB2B is a digital marketing and IT company founded in Georgetown, Massachusetts, in the middle of the North Shore. We help North Shore and Merrimack Valley businesses get found on Google, turn visitors into calls, keep reviews coming and keep their systems secure, all set up and run for them.",
    next: { service: "/services/local-seo", tool: "/tools/website-grader", article: "/get-my-business-on-google" },
    html: `<section><p class="eyebrow">Essex County, Massachusetts</p><h1>Digital Marketing Agency on the North Shore, MA</h1>
<p>North Shore customers search by town: "roofer Beverly", "accountant Newburyport", "IT support Danvers". The businesses that show up for those searches, answer fast and have the reviews win the work. We build and run that for you.</p>
<p class="ctas"><a class="btn" href="/contact?topic=marketing">Book My 15-Minute Fit Call</a> <a class="btn ghost" href="/tools/website-grader">Grade my website</a></p></section>
<section><h2>What we do for North Shore businesses</h2><div class="grid g2">
<a class="card-link" href="/services/local-seo"><h3>Local SEO</h3><p>Rank in Google and the map results for your service in every North Shore town you serve.</p></a>
<a class="card-link" href="/services/web-development"><h3>Web design</h3><p>Fast, mobile-first websites built to turn visitors into calls and booked jobs.</p></a>
<a class="card-link" href="/ppc-management-massachusetts"><h3>Google Ads</h3><p>Ads targeted to your towns, with every call and form tracked.</p></a>
<a class="card-link" href="/services/reputation-management"><h3>Reviews & reputation</h3><p>A steady flow of new Google reviews and fast, professional replies.</p></a>
<a class="card-link" href="/problems/missed-calls"><h3>Missed-call text back</h3><p>Every missed call gets an instant text so the customer doesn't call the next business.</p></a>
<a class="card-link" href="/outsourced-it-support-small-business"><h3>IT support & cybersecurity</h3><p>Help desk, monitoring, backups and security for a flat monthly fee.</p></a>
</div></section>
<section><h2>North Shore and Merrimack Valley towns we serve</h2><p>Each town page covers SEO, web design and IT for that town:</p><p>${ESSEX.map(([h, n]) => `<a href="${h}">${n}</a>`).join(" · ")}</p><p>We also serve <a href="/new-hampshire">southern New Hampshire</a> and work remotely with businesses anywhere in the U.S. See <a href="/service-areas">all service areas</a>.</p></section>
<section><h2>Why a North Shore team</h2><p>CasperB2B was founded in Georgetown, MA, so we know how customers here search and which neighboring towns your business should show up in. Every request gets a personal reply within 1 business day, and work starts from a signed scope. We work with you by phone, video and screen-share.</p></section>
<section><h2>How we work</h2><ol><li><strong>Discovery & audit</strong> of your website, Google presence and systems.</li><li><strong>Strategy & blueprint:</strong> a written plan with the highest-impact fixes first.</li><li><strong>Execution & launch:</strong> we build and launch it for you and train your team.</li><li><strong>Optimization & reporting:</strong> monthly reporting and quarterly reviews.</li></ol></section>
<section><h2>North Shore questions</h2>
<details><summary>Where is CasperB2B based?</summary><p>CasperB2B was founded in Georgetown, Massachusetts, on the North Shore. We work with North Shore businesses remotely by phone, video and screen-share.</p></details>
<details><summary>Do you do reputation management for North Shore businesses?</summary><p>Yes. We set up automated review requests after every job and help you reply to reviews quickly and professionally. See <a href="/services/reputation-management">reputation management</a>.</p></details>
<details><summary>How much does local SEO cost on the North Shore?</summary><p>A local SEO campaign for a small business typically costs between $800 and $2,500 per month, depending on how competitive your service is and how many towns you want to rank in.</p></details>
<details><summary>Do you also provide IT support?</summary><p>Yes. We provide managed IT and cybersecurity for small businesses across the North Shore. See <a href="/outsourced-it-support-small-business">outsourced IT support</a>.</p></details>
</section>`,
  },
];
