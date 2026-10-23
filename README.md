# casperb2b.com — CasperB2B marketing site

Static rebuild of casperb2b.com (previously a JavaScript-only React app on the GHL "Vibe" builder that showed 9 words to
crawlers). Built by `npm ci && npm run build` (`node scripts/build.mjs`) into `dist/` and published by GitHub Actions to
GitHub Pages (custom domain casperb2b.com). No framework and no runtime dependencies.

CasperB2B (services company) and CasperPortal (casperportal.com, separate software platform) are separate. This site
only describes CasperPortal the way casperb2b.com always has, and links out to it.

## Build and check
- `npm run build` — writes `dist/`: 169 pages (168 in sitemap.xml; /thank-you is noindex), 865 redirect pages, 404.html,
  sitemap.xml, robots.txt (all crawlers incl. AI crawlers allowed), llms.txt, CNAME, IndexNow key file.
  The build fails on: a page without exactly one H1, a title over 60 or description over 155 characters, duplicate
  titles/descriptions, an llms.txt link to a page that is not built, a content edit that no longer matches.
- `npm run check` — internal link check (scripts/linkcheck.mjs). Fails on links to missing pages, links that land on a
  redirect page instead of the final URL, and pages with fewer than 3 in-content links to other pages.
- `npm run images` — one-time image import (needs network + sharp): downloads every image the content uses from the old
  CDNs, converts to WebP into `static/img/`, records sizes in `data/images.json`. Already committed; rerun only after
  changing content.
- Deploy: push to `main`. `.github/workflows/deploy.yml` builds, publishes to Pages, then pings IndexNow
  (key file `static/78ac1779d5ca276756ec512bd5fde53e.txt`, URL list `data/urls.txt` written by the build).

## Where things live
- `content/pages.json` — the live site's content, one entry per URL, captured from the rendered pages (Playwright) with
  accordions and tabs expanded, then cleaned of the old app's header/footer/widgets. Edit copy here.
- `content/llms.txt` — published as /llms.txt (started from the audit draft, corrected to the final pages and facts).
- `data/redirects.json` — old URL → new URL. Every entry becomes a redirect page (meta refresh + canonical + noindex).
- `scripts/lib.mjs` — page shell (header menus = live dropdowns, footer, talk widget), JSON-LD, form builders.
- `scripts/build.mjs` — page assembly, link/image rewriting, titles/descriptions, related links, schema, sitemap, the
  content-conflict edits (`EDITS`), 404, robots, llms.txt.
- `scripts/tools.mjs` + `static/assets/tools.js` — the free tools (calculators, quizzes, checklists), ported from the old
  React bundle (same questions, scoring, formulas and result copy).
- `static/assets/` — site.css, site.js (menus, mobile drawer, "Let's talk" widget), forms.js, tools.js, t.js.

## Pages (169)
Home, About, Our Team, Our Process, Jared Casper (/author/jared-casper), Mark Casper, Contact, Pricing, CasperPortal
(/software/casperportal, /compare/casperportal, /setup, /features, /integrations + 6), Casper VA (overview, roles,
hiring guide, vs agency + 21 role pages), Services (/services + 22 service pages, /ai-services, /seo-audit,
/solutions, /strategy + 3), Problems (hub + 7), Industries (/niches + 19), /service-areas, /georgetown-ma,
/carsalessoftware-setup, Blog (/blog + 20 posts) and 9 articles at the root (/the-49k-story, /motivation-drivers,
/the-cost-of-inaction, /the-premium-on-execution, /vanity-metrics, /leadership-removing-friction, /roi-of-dedicated-va,
/in-defense-of-holding-grudges, /what-is-an-ai-chatbot-and-do-i-need-one), Free tools (/tools + 17, /quiz), Glossary,
News, Newsletter, Portfolio, Affiliate (+ terms, kit), Brand kit, Privacy, Terms, HTML sitemap, Thank-you (noindex).
Full list: dist/sitemap.xml or /sitemap.

## Merged / dropped pages (all redirect, nothing 404s)
- Blog: 5 posts that only fell back to the /blog index, 11 stub posts ("Full article available on the dedicated page"),
  their "-duplicate" aliases, 6 fallback "spotlight" posts and /blog/topic/* → the full article where one exists
  (e.g. /blog/the-cost-of-inaction → /the-cost-of-inaction) or the closest real page.
  11 more posts whose body was one title-swapped template ("Why … Matters for Local Business Growth") were treated as
  duplicates and merged too: cybersecurity-essentials, map-customer-journey-before-crm, motivation-drivers,
  ppc-north-shore (these 4 were in the old sitemap), contact-page-killing-conversions, why-unified-crm,
  haverhill-local-seo, truth-about-buying-google-reviews, ultimate-b2b-follow-ups, logo-vs-brand-identity,
  in-defense-of-holding-grudges.
- Casper VA: the 17 long role URLs from the old sitemap showed the generic /casper-va page → redirected to the real role
  pages (e.g. /casper-va/seo-specialist → /casper-va/seo); devops/ecommerce/medical-billing/real-estate → /casper-va/roles.
- Template-generated pages (same text with the town/industry name swapped, 75–100% identical): town hubs
  (except /georgetown-ma), town × service pages, /faq/<town|industry>, /strategy/<town>,
  /compare/national-agencies/<town>, and 85 of 104 /niches pages → /service-areas, the matching /services page,
  /strategy, /contact or /niches. The 19 industry pages with their own copy were kept.
- Aliases and broken URLs: /jared-casper → /author/jared-casper, /services/seo-services → /services/seo,
  /services/ppc-management|ppc-advertising → /services/ppc, /services/website-development → /services/web-development,
  /services/chatbot-development → /services/ai-chatbots, /reputation-management → /services/reputation-management,
  /tools/incident-response-team (empty) → /tools/breach-response-plan, /coverage-map → /service-areas,
  /faq → /niches, 404s (/compare, /software, /search, /salem-ma, /salisbury-ma, /north-andover-ma, bare town names).

## Forms, embeds and widgets (kept working)
All forms POST the same JSON payload as the old React app (`first_name, last_name, email, phone, message, source_form,
source_page, submitted_at, tags[…, source_<formId>], notes` + the form's own fields) to the same GoHighLevel inbound
webhook: `https://services.leadconnectorhq.com/hooks/TLBXLD9M7LensL45PB90/webhook-trigger/bee537ba-8323-4437-9b8a-6d861e808c0e`
(the CasperB2B GHL location's "website form" workflow), with the same formId each form used before:

| Form (formId) | Page |
|---|---|
| Contact Us Form (tags website_contact, service_<choice>) | /contact |
| Newsletter Subscription - Footer (newsletter_subscriber, footer_signup) | footer of every page |
| Newsletter Subscription - Archive Page | /newsletter |
| SEO Audit Page (website_seo_audit) | /seo-audit |
| SEO Audit Widget / Marketing PDF Download / Sales PDF Download | /strategy/seo, /strategy/marketing, /strategy/sales |
| Partner Program Application | /affiliate |
| Security Checklist Download | /cybersecurity-hesitancy |
| Is CasperB2B Right For Me Quiz (website_quiz, quiz_result_<tier>) | /quiz |
| ROI Calculator Lead, Website Cost Estimate, Digital Maturity Quiz Results, AI Search Readiness Audit, Motivation Quiz Complete, Breach Response Plan Generator, SEO Checklist Download, Strategy Audit Submission, Keyword Research Request, Competitor Comparison Request, Website Grader Tool | the matching /tools/* page |

Other embeds: /agreement-builder embeds `https://casperportal.com/agreement-builder` (iframe, as before); YouTube embeds
on the pages that had them; the home video plays from the same GHL media URL. The old floating "Let's talk" widget is a
small call/text button (tel/sms to 1-207-222-7737). There was no GHL chat widget or booking calendar on the old site.

Analytics: `<script src="/assets/t.js" data-site="casperb2b" data-banner="1">` (first-party analytics + cookie notice).
The copy of t.js only differs in the cookie-notice wording/privacy link when the host is not fmycar/carsalessoftware.
The old site also loaded GA4 `G-6E61E6C8B7` and GTM `GTM-K9J8L7M` (plus Meta Pixel / LinkedIn tags with placeholder
IDs); to keep GA4 add `data-ga4="G-6E61E6C8B7"` to the t.js tag in scripts/lib.mjs.

## Content decisions for the owner
- Kept out of the copy because two pages disagree (see `EDITS` in build.mjs):
  - VA pricing: /pricing said "VA rates start at $800/mo" and "From $1,097/mo total" (home: "From $1,097/mo"), but the
    Data Entry Specialist role is $700/mo. Per-role prices are kept.
- Mark Casper is Co-Founder (owner decision): "Co-Founder" on /about-us and /mark-casper, jobTitle "Co-Founder" in his
  Person schema, and listed with Jared as founder in the Organization schema. His page also shows a different phone
  (1-240-628-7246) — kept.
- Portfolio (owner decision): /portfolio, the home logo strip and the "Real projects we actually built" blocks list the
  recent setups first — CarSales AI (carsalessoftware.com), FMYCAR (+ cars.fmycar.com marketplace), NextWeigh (health
  and fitness coaching by text, not "industrial scales"), MC Sales Training, FBK Marketing — each described with its
  own homepage wording, then the earlier projects. CasperPortal is not a portfolio item. No metrics or quotes.
- Removed "[TODO: …]" placeholder lines that the live VA role pages displayed.
- Website Grader and Compare My Business showed invented scores (from the URL length / random numbers); they now send
  the same request and show only the checklist. Removed the grader's "Your data is never stored or shared" line, since
  the URL is sent to the CRM.
- /tools describes tools with "15 towns / 14 industries / 15 ranking factors"; the tools themselves don't match those counts.
- Done-for-you plans: Premium is $199/mo + $3,500 setup, below the $297/mo software-only price. Copy kept as published.
- Organization schema keeps the Nashua mailing address but drops the Georgetown geo coordinates (they didn't match).

## DNS (casperb2b.com → GitHub Pages)
- Apex A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `www` CNAME → `<github-user>.github.io` (fmycar.com uses jic52194.github.io)
- In the repo's Settings → Pages: source "GitHub Actions", custom domain casperb2b.com, enforce HTTPS.
