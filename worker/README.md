# casperb2b-forms (Cloudflare Worker)

`https://casperb2b-forms.carsalenow.workers.dev/` sits between every casperb2b.com form (`static/assets/forms.js`) and the
GoHighLevel inbound webhook ("Website Lead Capture" workflow).

```
browser ──POST JSON──▶ Worker: origin check → Turnstile → spam rules (src/spam.js) ──▶ GHL webhook
```

- **Forwarded:** every field the site sends, unchanged, minus the bot-check fields (`_ts _hp _t _tl _gotcha`).
  `source_page` is reduced to the path (no query string or #hash).
- **Dropped as spam (answers 200 so bots get no signal, nothing reaches GHL):** honeypot filled · under 3 s from page
  load to submit · first/last name of 12+ random letters (`gibberishScore` ≥ 3) · 3+ dots before the @.
  Each drop logs one line: `{"event":"lead_rejected","reasons":[…],"source_form","source_page","email_domain"}`.
- **Turnstile failure:** 403 `{"ok":false,"error":"captcha"}` (the form asks the visitor to redo the check).
- **No notifications here.** Internal alerts come from the GHL workflow "Internal Alert — Lead Captured".

Tests: `npm test` in the repo root (tests/spam.test.mjs, tests/worker.test.mjs, tests/attribution.test.mjs).

## Deploy

```bash
cd worker
npx wrangler@latest login
npx wrangler@latest secret list          # must show TURNSTILE_SECRET and GHL_WEBHOOK_URL (see below)
npx wrangler@latest deploy --dry-run     # bundles without uploading
npx wrangler@latest deploy
```

**Before the first deploy from this repo:** this code replaces the Worker that was edited in the dashboard. Download a
backup first (Cloudflare dashboard → Workers & Pages → casperb2b-forms → Edit code → Download). Then check the secret
names with `wrangler secret list`. This code reads `TURNSTILE_SECRET` (or `TURNSTILE_SECRET_KEY`) and `GHL_WEBHOOK_URL`
(or `GHL_WEBHOOK`). If the existing Worker uses other names, add the values under these names; they are the same
values, so nothing changes in GHL or Turnstile:

```bash
npx wrangler@latest secret put GHL_WEBHOOK_URL      # paste the current webhook URL
npx wrangler@latest secret put TURNSTILE_SECRET     # paste the current Turnstile secret key
```

If either is missing, the Worker answers 500 and the form shows "please call us": it fails closed instead of losing
leads without anyone noticing. `keep_vars = true` in wrangler.toml keeps any plain variables set in the dashboard.

Undo a bad deploy: `npx wrangler@latest rollback` (or Deployments → previous version in the dashboard).
Watch it live: `npx wrangler@latest tail` (shows the lead_forwarded / lead_rejected lines).

## Test lead with curl

Production needs a real Turnstile token, so a plain curl is refused with 403 `captcha`, which confirms the bot check is on:

```bash
curl -s -X POST https://casperb2b-forms.carsalenow.workers.dev/ -H 'Origin: https://casperb2b.com' -H 'Content-Type: application/json' -d '{"email":"test@casperb2b.com","_ts":"none"}'
```

To post a full test lead end to end, run the Worker locally with Cloudflare's always-pass Turnstile test secret and the
real GHL webhook. The contact lands in GHL tagged `utm_facebook`:

```bash
cd worker
printf 'TURNSTILE_SECRET=1x0000000000000000000000000000000AA\nGHL_WEBHOOK_URL=<the GHL webhook URL>\n' > .dev.vars   # git-ignored
npx wrangler@latest dev --port 8787
```

```bash
curl -s -X POST http://127.0.0.1:8787/ -H 'Origin: https://casperb2b.com' -H 'Content-Type: application/json' -d '{"first_name":"Test","last_name":"Lead","email":"test+fb@casperb2b.com","phone":"","message":"Test lead, please ignore","source_form":"Contact Us Form","source_page":"/contact?topic=seo","tags":["website_contact","source_contact_us_form","utm_facebook"],"utm_source":"facebook","utm_medium":"paid","utm_campaign":"test","utm_content":"","utm_term":"","gclid":"","fbclid":"","landing_page":"/","referrer":"https://l.facebook.com/","first_utm_source":"facebook","first_utm_campaign":"test","_ts":"XXXX.DUMMY.TOKEN.XXXX","_hp":"","_t":5000,"_tl":8000}'
```

Expected: `{"ok":true}` and a new GHL contact "Test Lead" with `utm_source = facebook`. Leave out `_tl`/`_t` or send a
gibberish name and you also get `{"ok":true}`, but nothing reaches GHL and the dev console prints `lead_rejected`.
