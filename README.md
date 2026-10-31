# casperb2b.com — CasperB2B marketing site

Static site for casperb2b.com. Built by `npm ci && npm run build` (`node scripts/build.mjs`) into `dist/` and published by
GitHub Actions to GitHub Pages (custom domain casperb2b.com). No framework and no runtime dependencies.

CasperB2B (services company) and CasperPortal (casperportal.com, sister software product with its own site) are separate.
This site links to CasperPortal once, in the footer ("Sister product"). CasperPortal's product pages are not on this site.

## Build and check
- `npm run build` — writes `dist/`: 247 pages (244 in sitemap.xml; /thank-you, /agreement-builder and /affiliate-kit are
  noindex), ~1,165 redirect pages, 404.html, sitemap.xml, robots.txt (AI crawlers allowed), llms.txt + llms-full.txt (full text of every indexable page, for AI assistants), CNAME, IndexNow key
  file — and regenerates **KEYWORDS.md** and **LINKS.md** in the repo root (commit them).
  The build fails on: a page without exactly one H1; a title over 60 or description over 155 characters; duplicate titles,
  descriptions or primary keywords; a content edit that no longer matches; **any CasperB2B price on a page** (prices are
  hidden — owner decision); a menu item or redirect that points at a page that isn't built; an llms.txt link to a page
  that isn't indexed.
- `npm run check` — internal link check (scripts/linkcheck.mjs). Fails on links to missing pages, links to redirect pages,
  pages with fewer than 3 in-content links, and any page without a link to the booking page (/contact).
- `npm run images` — one-time image import (network + sharp). Already committed.
- Deploy: push to `main`. `.github/workflows/deploy.yml` builds, publishes to Pages, then pings IndexNow.

## Where things live
- `content/pages.json` — page bodies, one entry per URL: the live site's rendered content plus 31 pages migrated from the
  newer source (B) — see "Migration" below.
- `data/keywords.json` — keyword plan per page: primary keyword, secondary, title, meta description, H1, answer-first
  intro, topic cluster, next best steps (service / tool / article), extra FAQs. **Edit this to change SEO targeting.**
- `data/content-edits.json` — exact find/replace corrections per page (invented stats and claims removed, our prices
  removed, placeholders and dead CTAs fixed). Each must match exactly once or the build fails.
- `data/cut-edits.json` — second pass of exact edits (fluff, repetition, broken structure), applied after `scripts/declutter.mjs` strips template boilerplate repeated across pages. Dead declutter rules fail the build.
- `data/locations.json` — the 27 MA/NH towns (county, ZIP codes, neighborhoods, nearby towns, a local note); `scripts/locations.mjs` builds the town pages (/<town>-ma, /<town>-nh) and the state hubs /massachusetts and /new-hampshire. Old town sub-URLs redirect to the town page.
- `data/additions.json` — extra sections and FAQs for pages that were too thin to rank (inserted before the page FAQ).
- `data/redirects.json` — old URL → new URL (chains are resolved at build time).
- `scripts/ia.mjs` — information architecture: the header menu grouped by visitor goal, topic clusters and hubs, the one
  primary CTA per page, the "Your next best step" block, the trust block and the sticky mobile CTA.
- `scripts/pages-extra.mjs` — hand-written pages: /pricing (no prices), the locked /agreement-builder, the hubs
  /marketing-and-seo, /cybersecurity-and-it, /resources, and /faq (built from the site's own Q&A).
- `scripts/lib.mjs` — page shell (two-row header, drawer, footer, forms). `scripts/build.mjs` — assembly, schema,
  sitemap, llms.txt, KEYWORDS.md, LINKS.md. `scripts/tools.mjs` + `static/assets/tools.js` — the free tools.
- `content/llms.txt` — the facts header of /llms.txt; the page lists are generated.
- `_private/` (git-ignored, never published): `prices.md` — every CasperB2B price on record. `_sources/` (git-ignored):
  the two source zips.

## Navigation and conversion (details in LINKS.md)
- Menu by visitor goal: Get more customers · Marketing & SEO · AI & automation · Cybersecurity & IT · Virtual assistants ·
  Free tools · Resources · About. Hubs: /how-to-get-more-customers, /marketing-and-seo, /ai-services,
  /cybersecurity-and-it, /casper-va, /tools, /resources, /about-us — each lists every page in its topic.
- Every page: breadcrumb (Home › hub › section › page), "Related in <topic>", "Your next best step" (service, free tool,
  article, booking) and the trust block (founders, real portfolio, personal reply within 1 business day, phone).
- One primary CTA: "Book My 15-Minute Fit Call" → `/contact?topic=<topic>` (preselects the contact form's topic) in the
  header, the hero, the sticky mobile bar and the footer. Other buttons are secondary (ghost).
- Tools and quizzes end in a short lead form. Analytics: t.js page views + `cta_click` (every CTA, with `data-cta`
  position), `form_submit` and `lead` events (forms.js).

## Forms (Cloudflare Worker → GoHighLevel)
All forms POST the same JSON payload as the old React app (`first_name, last_name, email, phone, message, source_form,
source_page, submitted_at, tags[…, source_<formId>], notes` + the form's own fields) to the `casperb2b-forms` Cloudflare
Worker (source in `worker/`, deploy notes in `worker/README.md`). The Worker checks Cloudflare Turnstile, then drops spam
(honeypot, under 3 s, gibberish names, 3+ dots in the email) with a 200, and forwards everything else unchanged to the
GoHighLevel inbound webhook. **The GHL webhook URL is a secret: keep it only in the Worker's settings,
never in this public repo.** Tool results (calculator numbers, quiz scores) arrive in `message` / `calendar_notes`.
Every payload also carries attribution: `utm_source utm_medium utm_campaign utm_content utm_term gclid fbclid` (last
tagged visit this session, sessionStorage), `first_utm_source first_utm_campaign` (first tagged visit ever, localStorage),
`landing_page referrer` (first page this browser saw + its referrer), and a `utm_<source>` tag. Tests: `npm test`.

| Form (formId) | Page |
|---|---|
| Contact Us Form (tags website_contact, service_<choice>) | /contact — the booking page (there is no calendar embed in either source) |
| Newsletter Subscription - Footer / - Archive Page | footer of every page / /newsletter |
| SEO Audit Page; SEO Audit Widget; Marketing PDF Download; Sales PDF Download | /seo-audit, /strategy/seo, /strategy/marketing, /strategy/sales |
| Partner Program Application | /affiliate |
| Security Checklist Download | /cybersecurity-hesitancy |
| Is CasperB2B Right For Me Quiz | /quiz |
| ROI Calculator Lead, Website Cost Estimate, Digital Maturity Quiz Results, AI Search Readiness Audit, Motivation Quiz Complete, Breach Response Plan Generator, SEO Checklist Download, Strategy Audit Submission, Keyword Research Request, Competitor Comparison Request, Website Grader Tool | the matching /tools/* page |
| **New formIds (same webhook):** Bundle Builder Request, Tech Stack ROI Consolidation Request, LTV CAC Calculator Lead, Marketing Budget Calculator Lead, Content Idea Generator Lead, Motivation Quiz Lead, Cyber Risk Quiz Lead | the tools that previously ended without a form |

Analytics: `<script src="/assets/t.js" data-site="casperb2b" data-banner="1">`. Events go to the Supabase `track` edge function
(project carsales-ai-os, table `web_events`). That function only accepts sites and event types on its allow-lists:
`casperb2b` plus the `lead` and `cta_click` events were added 2026-10-31 (before that every casperb2b event was rejected).
If the function is redeployed from another repo, keep those entries. To keep GA4 add
`data-ga4="G-6E61E6C8B7"` to the t.js tag in scripts/lib.mjs.

## Migration from the two source zips (2026-10-23)
- Source A (original, 55 pages) and source B (newer clone, 137 routes) were built and rendered headlessly; every route
  and every link B's pages expose was captured and compared with the live content.
- The 169 live pages already matched B (B only added widgets, `[TODO]` placeholders and prices), so the live copy stayed.
- **Added from B (31):** 16 question pages (how to get more customers + HVAC/dental/law firm/real estate/restaurant
  versions, 5-star reviews, beat competitors, why isn't my business growing, make my phone ring, get on Google, why can't
  people find me, is marketing worth it, agency vs DIY, website cost, SEO cost), 4 cybersecurity questions + will AI
  replace my business, 4 Georgetown MA pages (cybersecurity, managed IT, SEO, web design), /done-for-you, /onboarding,
  /press-kit, /services/analytics-data, /services/custom-apps, /caspercare. **New hubs:** /marketing-and-seo,
  /cybersecurity-and-it, /resources, /faq.
- **Not migrated, redirected:** CasperPortal product pages (/software/casperportal, /compare/*, /features/*,
  /integrations/*, /setup → /services/ai-automation, /problems/too-many-tools, /done-for-you); /local-directory (invented
  businesses), /templates (downloads that don't exist), /playbooks/* (thin templates gated on a PDF that doesn't exist),
  /strategy deep dives (duplicate the service pages), /strategy/ai/<town>, state hubs, Georgetown CRM pages,
  /brand-guidelines → /brand-kit, B's template blog posts.
- **Merged (cannibalization):** /our-team → /about-us, /services/google-ads-setup → /services/ppc,
  /blog/implement-missed-call-text-back → /blog/stop-missing-calls.
- Editorial pass on every page (876 exact edits): removed CasperB2B prices, unverifiable stats, invented claims and
  results, review-gating language, placeholders, dead links and CTAs to the locked agreement builder.

## Positioning
- Serves businesses worldwide (remote), with a local focus on Massachusetts (North Shore, Merrimack Valley) and New Hampshire (southern NH, Seacoast). Organization schema: areaServed Worldwide + US + MA + NH, knowsAbout. No Google Business Profile (no staffed address), so local reach comes from town pages, consistent facts and reviews rather than the Map Pack.
- Portfolio projects are listed as CreativeWork items created by CasperB2B (ItemList schema on / and /portfolio) to tie the entities together.
- Contact form (the booking form): name, email, optional phone, topic, optional note — same GHL payload (name splits into first/last).

## Owner decisions in force
- The $49,000 unpaid-work story is removed (2026-10-23): /the-49k-story redirects to /about-us, `scrubStory()` in scripts/declutter.mjs strips any block that mentions it, and the build fails if a mention survives.
- Prices hidden everywhere (kept in `_private/prices.md`). /pricing explains how quotes work. General market ranges on
  "how much does X cost" pages stay; affiliate commissions on /affiliate stay.
- Build Your Agreement is locked: /agreement-builder is a noindex "client access" page, not linked anywhere, no embed.
- NextWeigh = health & fitness program CasperB2B built. Portfolio led by CarSales AI, FMYCAR, NextWeigh, MC Sales
  Training, FBK Marketing. Mark Casper = Co-Founder.

## DNS (casperb2b.com → GitHub Pages)
- Apex A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `www` CNAME → `<github-user>.github.io` (fmycar.com uses jic52194.github.io)
- In the repo's Settings → Pages: source "GitHub Actions", custom domain casperb2b.com, enforce HTTPS.

## Link styling strategy (2026-10-27)
In-text links to other pages are drawn as a neon-green highlighter stroke (`static/assets/site.css`, "neon highlighter
links"), so readers can see at a glance which keywords lead somewhere and keep reading from page to page. On hover the
stroke fills the whole word. Buttons, cards, the table of contents, breadcrumbs and dark panels are excluded.
Together with "Keep reading" (mid-page), "Related in <topic>", "Your next best step" and "Common concerns, answered",
every page offers a next read and a booking path at the top, middle and end.
