// Keyword pages built from Search Console demand (2026-10): phrases that already earn impressions but had no page of
// their own. Every fact here is already stated elsewhere on casperb2b.com (/services/ppc, /b2b-growth, /niches/*,
// /problems/missed-calls, cost pages). build.mjs adds each entry as a page and a keyword-plan row.
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
];
