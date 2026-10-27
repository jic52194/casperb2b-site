// Hand-written pages and hub copy that are not captured content: /pricing (no published prices — owner decision),
// the locked /agreement-builder, the new cluster hubs and /faq. Only verifiable facts; no prices, no invented numbers.

export const PRICING = {
  title: "How CasperB2B Pricing Works | Get a Fixed Quote",
  desc: "CasperB2B quotes every project and VA role after a free 15-minute fit call. See what we quote, what affects cost, and how to get a fixed price.",
  h1: "How CasperB2B pricing works",
  html: `<section><p class="eyebrow">Pricing</p><h1>How CasperB2B pricing works</h1>
<p>CasperB2B quotes every engagement after a free 15-minute fit call, based on exactly what you need built, set up or run. We don't publish a price list because no two businesses need the same scope — you get a fixed, written quote before any work starts.</p>
<p class="ctas"><a class="btn" href="/contact?topic=other">Book My 15-Minute Fit Call</a></p></section>
<section><h2>What we quote</h2><div class="grid g3">
<div class="card"><h3>Done-for-you setup</h3><p>We build your system — CRM, lead capture, automated follow-up, booking and review requests — for a one-time setup fee plus a monthly plan. <a href="/done-for-you">See everything we set up</a>.</p></div>
<div class="card"><h3>Dedicated virtual assistants</h3><p>Each <a href="/casper-va/roles">Casper VA role</a> is a flat monthly rate. We handle recruiting, HR and payroll, so there are no payroll taxes, benefits or hidden fees, and no long-term contract.</p></div>
<div class="card"><h3>Marketing & SEO</h3><p><a href="/services/local-seo">Local SEO</a>, <a href="/services/ppc">Google Ads</a>, email and social media are quoted as a monthly scope with clear deliverables you can see every month.</p></div>
<div class="card"><h3>Websites</h3><p>A <a href="/services/web-development">website build</a> is a fixed quote based on page count, features and content. Plan yours with the <a href="/tools/website-cost-estimator">website project planner</a>.</p></div>
<div class="card"><h3>Cybersecurity & IT</h3><p><a href="/services/cybersecurity">Cybersecurity</a> and <a href="/services/managed-it">managed IT</a> are quoted monthly, based on your users, devices and the protection you need.</p></div>
<div class="card"><h3>AI & automation</h3><p><a href="/services/ai-automation">Automations</a>, <a href="/services/ai-chatbots">AI chatbots</a> and <a href="/services/custom-apps">custom apps</a> are scoped per workflow, with a fixed build price.</p></div>
</div></section>
<section><h2>What affects your price</h2><ul>
<li>How much we build versus how much you run yourself.</li>
<li>The number of locations, service areas and pages.</li>
<li>The tools you already pay for, and which ones we can replace. Add up your current spend with the <a href="/tools/tech-stack-roi">tech stack cost calculator</a>.</li>
<li>For virtual assistants: the role and the hours you need.</li>
<li>Your marketing budget for ads. Work out a realistic one with the <a href="/tools/marketing-budget-calculator">marketing budget calculator</a>.</li>
</ul></section>
<section><h2>How to get your quote</h2><ol>
<li><strong>Book a 15-minute fit call.</strong> Tell us what's leaking time or revenue.</li>
<li><strong>We review your setup.</strong> Website, listings, lead flow and tools.</li>
<li><strong>You get a signed scope with a fixed price.</strong> We start only after the agreement is signed.</li>
</ol><p class="ctas"><a class="btn" href="/contact?topic=other">Book My 15-Minute Fit Call</a></p></section>
<section><h2>Pricing questions</h2>
<details><summary>Why doesn't CasperB2B publish prices?</summary><p>Because the right scope is different for every business. A quote after a 15-minute fit call is fixed and written, so you know the full cost before any work starts.</p></details>
<details><summary>Is there a setup fee?</summary><p>Done-for-you builds include a one-time setup fee for the work of building your system, plus a monthly plan. Your quote shows both before you sign.</p></details>
<details><summary>Do I have to sign a long-term contract?</summary><p>No. Casper VA roles have no long-term contract, and monthly plans are month-to-month. Every engagement starts from a signed scope so both sides know exactly what's included.</p></details>
<details><summary>Can I get a quote without a call?</summary><p>Yes. Send the details through the <a href="/contact">contact form</a> and you'll get a personal reply within 1 business day. Most quotes are faster after a 15-minute call.</p></details>
</section>`,
};

export const AGREEMENT = {
  title: "Build Your Agreement — Client Access | CasperB2B",
  desc: "The CasperB2B agreement builder is available to approved clients after a 15-minute fit call. Book your call to get a private link.",
  h1: "Build your agreement",
  html: `<section><p class="eyebrow">Client access</p><h1>Build your agreement</h1>
<div class="locked"><p><strong>The agreement builder is locked.</strong> It's available to approved clients after a 15-minute fit call.</p>
<p>Book your fit call. If we're the right team for the job, we'll send you a private link to build, review and sign your agreement.</p>
<p class="ctas"><a class="btn" href="/contact?topic=other">Book My 15-Minute Fit Call</a></p>
<p class="fine">Already a client? Use the private link we sent you, or call or text 1-207-222-7737.</p></div>
<p>Want to know what happens next? Read <a href="/onboarding">what happens after you sign</a>, <a href="/pricing">how pricing works</a> and <a href="/our-process">our process</a>.</p></section>`,
};

// New cluster hubs (the other clusters use an existing page as their hub)
export const HUBS = {
  "/marketing-and-seo": { cluster: "marketing", keyword: "small business marketing and seo services", title: "Small Business Marketing & SEO Services | CasperB2B",
    desc: "Local SEO, Google Maps, websites, Google Ads, email and social media for small businesses — set up and run for you. Book a free 15-minute fit call.",
    h1: "Marketing & SEO for small businesses",
    intro: "CasperB2B helps small businesses get found and chosen online: local SEO and Google Maps, websites that turn visitors into calls, Google Ads, email and social media — set up and run for you." },
  "/cybersecurity-and-it": { cluster: "cyber", keyword: "small business cybersecurity and it support", title: "Small Business Cybersecurity & IT Support | CasperB2B",
    desc: "Protection from phishing, ransomware and data loss, plus day-to-day managed IT for small businesses. Book a free 15-minute fit call.",
    h1: "Cybersecurity & IT support for small businesses",
    intro: "CasperB2B protects small businesses from the threats that actually hit them — phishing, ransomware, weak passwords and missing backups — and handles day-to-day IT so your team can keep working." },
  "/resources": { cluster: "resources", keyword: "small business growth resources", title: "Free Small Business Growth Guides & Resources | CasperB2B",
    desc: "Plain-English guides and answers on getting customers, marketing, AI, cybersecurity and hiring help for small businesses. Free, no sign-up.",
    h1: "Free guides, answers and resources",
    intro: "Plain-English answers to the questions small business owners ask most about getting customers, marketing, AI, cybersecurity and hiring help — written by the CasperB2B team." },
};

export const FAQ_HUB = { keyword: "small business marketing questions", title: "Small Business Marketing, SEO & IT FAQ | CasperB2B",
  desc: "Short, direct answers to the questions small business owners ask about SEO, websites, leads, AI, cybersecurity and virtual assistants.",
  h1: "Frequently asked questions",
  intro: "Short, direct answers to the questions small business owners ask us most, grouped by goal. Every answer links to the page with the full explanation." };

// Dedicated restaurant offer page. Owner decision (2026-10-26): this one page shows its price ($149/month).
export const RESTAURANT_AI = {
  path: "/ai-restaurant-ordering",
  keyword: "ai phone ordering for restaurants",
  title: "AI Order Taking for Restaurants, $149/mo | CasperB2B",
  desc: "We install an AI employee that takes your restaurant's orders and books reservations for $149/month, and alerts your team the moment each one comes in.",
  h1: "The best AI employee your restaurant will ever hire",
  html: `<section><p class="eyebrow">AI for restaurants</p><h1>The best AI employee your restaurant will ever hire</h1>
<p class="answer">CasperB2B installs AI that takes your restaurant's orders and books reservations for you, for <strong>$149 per month</strong>. Every time an order is placed or a table is booked, your team gets an internal notification right away, so nothing slips through during the rush.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a> <a class="btn ghost" href="#how-it-works">See how it works</a></p></section>
<section><h2>What your AI employee does</h2><div class="grid g3">
<div class="card"><h3>Takes your orders</h3><p>Customers place their order with the AI instead of waiting on hold or getting a busy signal. Your staff stays focused on the food and the guests in front of them.</p></div>
<div class="card"><h3>Books reservations</h3><p>Guests can book a table any time, including before you open and after you close, without anyone on your team picking up the phone.</p></div>
<div class="card"><h3>Notifies your team instantly</h3><p>The moment an order is made or a reservation is booked, your team gets an internal notification with the details, so the kitchen and front of house always know what's coming.</p></div>
<div class="card"><h3>Never calls in sick</h3><p>It works every shift, every day, through the dinner rush and the slow afternoons, and it never needs a break.</p></div>
<div class="card"><h3>Never misses a call</h3><p>When every line is busy on a Friday night, the AI still answers. A missed call is a missed order; this employee doesn't miss them.</p></div>
<div class="card"><h3>Set up for your restaurant</h3><p>We install it and set it up around your restaurant. You don't need to learn new software or hire anyone to run it.</p></div>
</div></section>
<section><h2>How it works</h2><ol>
<li><strong>Book a 15-minute call.</strong> Tell us how you take orders and reservations today.</li>
<li><strong>We install your AI employee.</strong> We set it up for your restaurant and choose who on your team gets the notifications.</li>
<li><strong>It starts taking orders.</strong> Orders and reservations come in, and your team is notified the moment each one is made.</li>
</ol><p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a></p></section>
<section><h2>One simple price</h2><div class="card price-card"><p class="eyebrow">AI order-taking for restaurants</p><p class="price"><strong>$149</strong> <span>per month</span></p><ul>
<li>We install and set it up for you</li>
<li>Takes customer orders</li>
<li>Books reservations</li>
<li>Internal notifications for every order and reservation</li>
</ul><p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a></p></div></section>
<section><h2>Want more customers too?</h2><p>Your AI employee handles the orders. If you also want more people calling in the first place, see our <a href="/niches/restaurants">restaurant marketing</a> and the guide on <a href="/how-to-fill-my-restaurant-on-weeknights">how to fill your restaurant on slow weeknights</a>. Curious how this compares to a website chatbot? Read about <a href="/services/ai-chatbots">AI chatbots</a>.</p></section>
<section><h2>Questions restaurant owners ask</h2>
<details><summary>How much does the AI order-taker cost?</summary><p>$149 per month. We install it and set it up for you.</p></details>
<details><summary>What does it do?</summary><p>It takes your customers' orders and books reservations, and sends your team an internal notification every time an order is made or a reservation is booked.</p></details>
<details><summary>Will my team know when an order comes in?</summary><p>Yes. Every order and every reservation triggers an internal notification to your team right away, so nothing gets missed.</p></details>
<details><summary>Do I have to set it up myself?</summary><p>No. We install it for you. Book a 15-minute call and we'll take it from there.</p></details>
<details><summary>How do I get started?</summary><p><a href="/contact">Book a 15-minute call</a> or call or text 1-207-222-7737. You'll get a personal reply within 1 business day.</p></details>
</section>`,
};
