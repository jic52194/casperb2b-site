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
<p class="answer">CasperB2B installs AI that answers your restaurant's phone calls and text messages, takes orders and books reservations for you, for <strong>$149 per month</strong>. Every time an order is placed or a table is booked, your team gets an internal notification right away, so nothing slips through during the rush.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a> <a class="btn ghost" href="#how-it-works">See how it works</a></p></section>
<section><h2>What your AI employee does</h2><div class="grid g3">
<div class="card"><h3>Takes your orders</h3><p>Customers call or text to place their order with the AI instead of waiting on hold or getting a busy signal. Your staff stays focused on the food and the guests in front of them.</p></div>
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
<section><h2>Go deeper</h2><p>See it from every angle: the <a href="/ai-receptionist-for-restaurants">AI receptionist for restaurants</a>, the <a href="/restaurant-phone-ordering-system">restaurant phone ordering system</a>, the <a href="/restaurant-answering-service">restaurant answering service</a> and the <a href="/ai-reservation-system-for-restaurants">AI reservation system</a>.</p></section>
<section><h2>Want more customers too?</h2><p>Your AI employee handles the orders. If you also want more people calling in the first place, see our <a href="/niches/restaurants">restaurant marketing</a> and the guide on <a href="/how-to-fill-my-restaurant-on-weeknights">how to fill your restaurant on slow weeknights</a>. Curious how this compares to a website chatbot? Read about <a href="/services/ai-chatbots">AI chatbots</a>.</p></section>
<section><h2>Questions restaurant owners ask</h2>
<details><summary>How much does the AI order-taker cost?</summary><p>$149 per month. We install it and set it up for you.</p></details>
<details><summary>What does it do?</summary><p>It answers phone calls and text messages, takes your customers' orders and books reservations, and sends your team an internal notification every time an order is made or a reservation is booked.</p></details>
<details><summary>Will my team know when an order comes in?</summary><p>Yes. Every order and every reservation triggers an internal notification to your team right away, so nothing gets missed.</p></details>
<details><summary>Do I have to set it up myself?</summary><p>No. We install it for you. Book a 15-minute call and we'll take it from there.</p></details>
<details><summary>How do I get started?</summary><p><a href="/contact">Book a 15-minute call</a> or call or text 1-207-222-7737. You'll get a personal reply within 1 business day.</p></details>
</section>`,
};

// Restaurant keyword pages (2026-10-28): one search intent each, all selling the same product as /ai-restaurant-ordering.
// Product facts (owner-confirmed): answers phone calls and text messages, takes orders, books reservations, sends the
// team an internal notification for every order and reservation, installed by CasperB2B, $149 per month.
// No invented integrations, payments, languages or statistics.
const R = "/ai-restaurant-ordering";
const SIB = {
  receptionist: ["/ai-receptionist-for-restaurants", "AI receptionist for restaurants"],
  phone: ["/restaurant-phone-ordering-system", "restaurant phone ordering system"],
  answering: ["/restaurant-answering-service", "restaurant answering service"],
  reservations: ["/ai-reservation-system-for-restaurants", "AI reservation system"],
};
const sibs = (skip) => Object.entries(SIB).filter(([k]) => k !== skip).map(([, [h, t]]) => `<a href="${h}">${t}</a>`).join(", ");
const priceBlock = (what) => `<section><h2>One simple price</h2><div class="card price-card"><p class="eyebrow">${what}</p><p class="price"><strong>$149</strong> <span>per month</span></p><ul>
<li>We install and set it up for you</li><li>Answers phone calls and text messages</li><li>Takes orders and books reservations</li><li>Internal notifications for every order and reservation</li></ul>
<p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a></p></div></section>`;
const keepGoing = (skip) => `<section><h2>Keep exploring</h2><p>See the full offer on <a href="${R}">AI order-taking for restaurants</a>, or read about the ${sibs(skip)}. Want more guests calling in the first place? Start with <a href="/niches/restaurants">restaurant marketing</a> and <a href="/how-to-fill-my-restaurant-on-weeknights">how to fill slow weeknights</a>.</p></section>`;
const start = `<details><summary>How do I get started?</summary><p><a href="/contact">Book a 15-minute call</a> or call or text 1-207-222-7737. You'll get a personal reply within 1 business day.</p></details>`;

export const RESTAURANT_KW = [
{
  path: SIB.receptionist[0], key: "receptionist",
  keyword: "ai receptionist for restaurants",
  secondary: ["restaurant ai phone assistant", "virtual receptionist for restaurants", "ai host for restaurant phone"],
  title: "AI Receptionist for Restaurants, $149/mo | CasperB2B",
  desc: "An AI receptionist for restaurants that answers calls and texts, takes orders, books tables and alerts your team. Installed for you, $149/month.",
  h1: "An AI receptionist that answers every call and text",
  accent: "answers every call and text",
  html: `<section><p class="eyebrow">AI receptionist for restaurants</p><h1>An AI receptionist that answers every call and text</h1>
<p class="answer">An AI receptionist for restaurants answers your phone calls and text messages, takes orders, books reservations and tells your team the moment each one comes in. CasperB2B installs it for <strong>$149 per month</strong>, so your host stand and kitchen stay focused on the guests in front of them.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Get My AI Receptionist</a> <a class="btn ghost" href="#what-it-handles">See what it handles</a></p></section>
<section><h2>What it handles</h2><div class="grid g2">
<div class="card"><h3>Phone calls</h3><p>It picks up when your line rings, so guests aren't stuck on hold or sent to voicemail while your staff is busy.</p></div>
<div class="card"><h3>Text messages</h3><p>Guests who would rather text get an answer too. Orders and bookings that start by text are handled the same way as calls.</p></div>
<div class="card"><h3>Orders</h3><p>It takes the order from the guest and passes it to your team, so the kitchen knows what's coming.</p></div>
<div class="card"><h3>Reservations</h3><p>It books tables for guests who call or text, including before you open and after you close.</p></div>
</div></section>
<section><h2>Your team always knows</h2><p>Every time the AI receptionist takes an order or books a table, your team gets an internal notification right away. You choose who receives them, such as the kitchen for orders and the front of house for bookings, so nothing slips through during the rush.</p></section>
<section><h2>AI receptionist vs. the usual options</h2><div class="table-wrap"><table><thead><tr><th></th><th>AI receptionist</th><th>Staff answering between tables</th><th>Voicemail</th></tr></thead><tbody>
<tr><td>Answers during the rush</td><td>Yes</td><td>When someone is free</td><td>No</td></tr>
<tr><td>Takes the order or booking</td><td>Yes</td><td>Yes</td><td>No, the guest has to call back</td></tr>
<tr><td>Handles text messages</td><td>Yes</td><td>Rarely</td><td>No</td></tr>
<tr><td>Team notified instantly</td><td>Yes, every time</td><td>Depends on the shift</td><td>Only when someone checks</td></tr>
<tr><td>Cost</td><td>$149 per month</td><td>Staff time pulled off the floor</td><td>Free, but missed orders</td></tr>
</tbody></table></div></section>
<section><h2>How it works</h2><ol>
<li><strong>Book a 15-minute call.</strong> Tell us how you take orders and reservations today.</li>
<li><strong>We install your AI receptionist.</strong> We set it up for your restaurant and choose who on your team gets the notifications.</li>
<li><strong>It starts answering.</strong> Calls and texts are answered, orders and bookings are taken, and your team is notified each time.</li>
</ol></section>
${priceBlock("AI receptionist for restaurants")}
<section><h2>AI receptionist questions</h2>
<details><summary>What is an AI receptionist for a restaurant?</summary><p>It's AI that answers your restaurant's phone calls and text messages, takes orders, books reservations and notifies your team about each one, so guests get an answer even when nobody can pick up.</p></details>
<details><summary>Does it answer phone calls or only texts?</summary><p>Both. It answers phone calls and text messages.</p></details>
<details><summary>How much does an AI receptionist cost?</summary><p>CasperB2B's AI receptionist for restaurants is $149 per month, and we install it for you.</p></details>
<details><summary>Will my staff know about every order and reservation?</summary><p>Yes. Each order and reservation sends an internal notification to the people on your team you choose, right away.</p></details>
<details><summary>Do I need to learn new software?</summary><p>No. We install and set it up for you. Your team just receives the notifications.</p></details>
${start}
</section>
${keepGoing("receptionist")}`,
},
{
  path: SIB.phone[0], key: "phone",
  keyword: "restaurant phone ordering system",
  secondary: ["automated phone ordering for restaurants", "ai phone orders", "take phone orders automatically"],
  title: "Restaurant Phone Ordering System with AI | CasperB2B",
  desc: "A restaurant phone ordering system that uses AI to take orders by phone and text and alerts your kitchen instantly. Installed for you, $149/month.",
  h1: "A phone ordering system that takes orders while you cook",
  accent: "takes orders while you cook",
  html: `<section><p class="eyebrow">Restaurant phone ordering</p><h1>A phone ordering system that takes orders while you cook</h1>
<p class="answer">CasperB2B's restaurant phone ordering system uses AI to answer calls and text messages and take your customers' orders. The moment an order is placed, your team gets an internal notification. We install it for <strong>$149 per month</strong>, so the phone stops pulling your staff off the line.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Get My AI Order-Taker</a> <a class="btn ghost" href="#how-an-order-flows">See how an order flows</a></p></section>
<section><h2>The problem with phone orders</h2><p>Phone orders arrive at the worst possible moment: when the dining room is full and the kitchen is slammed. Someone has to stop what they're doing to answer, write the order down and get it to the kitchen. If nobody can pick up, the customer hangs up and orders somewhere else.</p><p>An AI ordering system answers instead, so your staff stays where they're needed.</p></section>
<section><h2>How an order flows</h2><ol>
<li><strong>A customer calls or texts.</strong> The AI answers right away, with no hold music and no busy signal.</li>
<li><strong>The AI takes the order.</strong> The customer tells it what they want, the same way they would tell your staff.</li>
<li><strong>Your team is notified.</strong> An internal notification with the order goes to the people you choose, so the kitchen knows what's coming.</li>
</ol></section>
<section><h2>What you get</h2><div class="grid g3">
<div class="card"><h3>Orders by phone</h3><p>Every call gets answered, even during the busiest part of the night.</p></div>
<div class="card"><h3>Orders by text</h3><p>Customers who prefer texting can order that way too.</p></div>
<div class="card"><h3>Instant kitchen alerts</h3><p>Your team is notified the moment each order is placed.</p></div>
<div class="card"><h3>Reservations too</h3><p>The same AI books tables, so one system covers orders and bookings.</p></div>
<div class="card"><h3>Installed for you</h3><p>We set it up for your restaurant. There's no software for you to learn.</p></div>
<div class="card"><h3>One flat price</h3><p>$149 per month for the whole system.</p></div>
</div></section>
<section><h2>Phone ordering options compared</h2><div class="table-wrap"><table><thead><tr><th></th><th>AI phone ordering</th><th>Staff on the phone</th><th>Third-party ordering apps</th></tr></thead><tbody>
<tr><td>Answers during the rush</td><td>Yes</td><td>Only if someone is free</td><td>Not for phone calls</td></tr>
<tr><td>Customers keep calling you directly</td><td>Yes</td><td>Yes</td><td>No, they order through the app</td></tr>
<tr><td>Handles text messages</td><td>Yes</td><td>Rarely</td><td>No</td></tr>
<tr><td>Kitchen notified instantly</td><td>Yes</td><td>Depends who answered</td><td>Through the app's own device</td></tr>
<tr><td>Cost</td><td>$149 per month</td><td>Staff time off the floor</td><td>Many charge a fee on every order</td></tr>
</tbody></table></div></section>
${priceBlock("Restaurant phone ordering system")}
<section><h2>Phone ordering questions</h2>
<details><summary>What is a restaurant phone ordering system?</summary><p>It's a way to take orders over the phone without tying up your staff. CasperB2B's version uses AI to answer calls and texts, take the order and notify your team right away.</p></details>
<details><summary>Can customers order by text as well as by phone?</summary><p>Yes. The AI takes orders by phone call and by text message.</p></details>
<details><summary>How does the kitchen find out about a new order?</summary><p>Every order sends an internal notification to the people on your team you choose, the moment it's placed.</p></details>
<details><summary>Does it replace my online ordering?</summary><p>It handles the customers who call or text. If you also take orders online, that keeps working the way it does today.</p></details>
<details><summary>How much does it cost?</summary><p>$149 per month, and we install it for you.</p></details>
${start}
</section>
${keepGoing("phone")}`,
},
{
  path: SIB.answering[0], key: "answering",
  keyword: "restaurant answering service",
  secondary: ["answering service for restaurants", "restaurant missed calls", "after hours restaurant phone answering"],
  title: "Restaurant Answering Service That Takes Orders | CasperB2B",
  desc: "A restaurant answering service that does more than take messages: AI answers calls and texts, takes orders, books tables and alerts your team. $149/mo.",
  h1: "A restaurant answering service that never puts guests on hold",
  accent: "never puts guests on hold",
  html: `<section><p class="eyebrow">Restaurant answering service</p><h1>A restaurant answering service that never puts guests on hold</h1>
<p class="answer">CasperB2B's restaurant answering service uses AI to answer your calls and text messages when your team can't. Instead of just taking a message, it takes the order or books the table, then notifies your team right away. It's installed for you for <strong>$149 per month</strong>.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Stop Missing Calls</a> <a class="btn ghost" href="#more-than-a-message">See the difference</a></p></section>
<section><h2>When restaurant calls get missed</h2><ul>
<li><strong>The dinner rush.</strong> Every hand is on a plate or a table, and the phone keeps ringing.</li>
<li><strong>Before you open.</strong> Guests call to book while your team is still prepping.</li>
<li><strong>After you close.</strong> Someone wants to book tomorrow night and gets voicemail.</li>
<li><strong>Short-staffed shifts.</strong> The person who usually answers is covering the floor.</li>
</ul><p>Each of those calls is an order or a booking that could go to another restaurant.</p></section>
<section><h2>More than a message</h2><p>A traditional answering service usually takes a message and passes it along, which means someone on your team still has to call the guest back. CasperB2B's AI handles the request itself:</p><div class="grid g3">
<div class="card"><h3>Takes the order</h3><p>The guest places the order on the call or by text.</p></div>
<div class="card"><h3>Books the table</h3><p>Reservations are booked on the spot.</p></div>
<div class="card"><h3>Tells your team</h3><p>An internal notification goes out for every order and reservation.</p></div>
</div></section>
<section><h2>Answering options compared</h2><div class="table-wrap"><table><thead><tr><th></th><th>AI answering service</th><th>Traditional answering service</th><th>Voicemail</th></tr></thead><tbody>
<tr><td>Answers the call</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Takes the order or booking</td><td>Yes</td><td>Usually takes a message</td><td>No</td></tr>
<tr><td>Handles text messages</td><td>Yes</td><td>Varies</td><td>No</td></tr>
<tr><td>Your team notified</td><td>Instantly, every time</td><td>When the message is passed on</td><td>When someone checks</td></tr>
<tr><td>Call-backs needed</td><td>No</td><td>Often</td><td>Always</td></tr>
</tbody></table></div></section>
${priceBlock("Restaurant answering service")}
<section><h2>Answering service questions</h2>
<details><summary>What does a restaurant answering service do?</summary><p>It answers your restaurant's calls when your team can't. CasperB2B's AI version also answers text messages and takes the order or books the table itself, instead of just taking a message.</p></details>
<details><summary>Does it work after we close?</summary><p>Yes. Guests can call or text to book a table before you open and after you close.</p></details>
<details><summary>Will I find out about every order and booking?</summary><p>Yes. Every order and reservation sends an internal notification to the people on your team you choose.</p></details>
<details><summary>How is this different from voicemail?</summary><p>Voicemail makes the guest wait for a call-back, and many never leave a message. The AI answers, takes the order or booking and notifies your team, so there's nothing to call back.</p></details>
<details><summary>How much does it cost?</summary><p>$149 per month, and we install it for you.</p></details>
${start}
</section>
${keepGoing("answering")}`,
},
{
  path: SIB.reservations[0], key: "reservations",
  keyword: "ai reservation system for restaurants",
  secondary: ["automated restaurant reservations by phone", "restaurant booking by text", "ai table booking"],
  title: "AI Reservation System for Restaurants | CasperB2B",
  desc: "An AI reservation system for restaurants: guests book a table by phone call or text, and your team is notified instantly. Installed for you, $149/month.",
  h1: "Reservations booked by phone and text, without picking up",
  accent: "without picking up",
  html: `<section><p class="eyebrow">AI reservations for restaurants</p><h1>Reservations booked by phone and text, without picking up</h1>
<p class="answer">CasperB2B's AI reservation system lets guests book a table by calling or texting your restaurant. The AI answers, books the reservation and sends your team an internal notification right away. It's installed for you for <strong>$149 per month</strong>, and it takes orders too.</p>
<p class="price-tag"><strong>$149</strong> per month · we install it for you</p>
<p class="ctas"><a class="btn" href="/contact">Get My AI Reservations</a> <a class="btn ghost" href="#how-a-booking-works">See how booking works</a></p></section>
<section><h2>Why guests still call to book</h2><p>Plenty of guests would rather call or text than fill in a form, especially for a special occasion, a big group or a last-minute table. Those calls tend to come in when your host is busiest. When nobody answers, the booking goes somewhere else.</p></section>
<section><h2>How a booking works</h2><ol>
<li><strong>The guest calls or texts.</strong> The AI answers right away.</li>
<li><strong>The AI books the table.</strong> The guest asks for a reservation and the AI handles it.</li>
<li><strong>Front of house is notified.</strong> An internal notification goes to the people you choose the moment the reservation is booked.</li>
</ol></section>
<section><h2>What you get</h2><div class="grid g2">
<div class="card"><h3>Bookings any time</h3><p>Guests can book before you open, during service and after you close.</p></div>
<div class="card"><h3>By phone or text</h3><p>Guests book whichever way they prefer.</p></div>
<div class="card"><h3>Instant notifications</h3><p>Your team knows about every new reservation right away.</p></div>
<div class="card"><h3>Orders included</h3><p>The same AI takes orders, so one system covers both.</p></div>
</div></section>
<section><h2>Reservation options compared</h2><div class="table-wrap"><table><thead><tr><th></th><th>AI reservations</th><th>Host answers the phone</th><th>Voicemail</th></tr></thead><tbody>
<tr><td>Books during service</td><td>Yes</td><td>Only if the host is free</td><td>No</td></tr>
<tr><td>Books after hours</td><td>Yes</td><td>No</td><td>No, the guest waits for a call-back</td></tr>
<tr><td>Bookings by text</td><td>Yes</td><td>Rarely</td><td>No</td></tr>
<tr><td>Team notified</td><td>Instantly</td><td>If it gets written down</td><td>When someone checks</td></tr>
</tbody></table></div></section>
${priceBlock("AI reservation system")}
<section><h2>Reservation questions</h2>
<details><summary>What is an AI reservation system for restaurants?</summary><p>It's AI that books tables for guests who call or text your restaurant, and notifies your team about each new reservation.</p></details>
<details><summary>Can guests book by text message?</summary><p>Yes. Guests can book by phone call or by text message.</p></details>
<details><summary>Who gets notified about new reservations?</summary><p>The people on your team you choose, such as your host or manager. They're notified the moment each reservation is booked.</p></details>
<details><summary>Does it take food orders too?</summary><p>Yes. The same AI takes orders as well as reservations. See <a href="${R}">AI order-taking for restaurants</a>.</p></details>
<details><summary>How much does it cost?</summary><p>$149 per month, and we install it for you.</p></details>
${start}
</section>
${keepGoing("reservations")}`,
},
];
