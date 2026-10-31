// casperb2b.com forms → Cloudflare Worker (bot check) → GoHighLevel inbound webhook. Same JSON payload as before.
// Every <form class="lead" data-form-id="…"> is handled here; tools.js reuses window.casperSubmit for its result forms.
// Bot protection: Cloudflare Turnstile ("I'm not a robot", verified server-side by the Worker), a hidden honeypot
// field, and a minimum fill time. The GHL webhook URL lives only in the Worker, never in this public file.
// Nothing is sent until the visitor presses the submit button.
(function () {
  var ENDPOINT = "https://casperb2b-forms.carsalenow.workers.dev/"; // ← your Worker URL
  var SITEKEY = "0x4AAAAAAFkKgu6V0ZL0bVaL";                               // ← Turnstile site key (public)
  var APPEARANCE = "interaction-only"; // "interaction-only" = shows only when Cloudflare is unsure; "always" = always-visible box
  var ERR = "Something went wrong. Please call us directly at 1-207-222-7737.";
  var BOT_ERR = "Please complete the \"I'm not a robot\" check and try again.";
  var HP = "_gotcha";
  var loadedAt = Date.now();
  var recent = {};

  // ---- Attribution -------------------------------------------------------------------------------
  // First touch (localStorage, never overwritten): the first visit that carried utm/gclid/fbclid tags.
  // Landing (localStorage, never overwritten): the first page this browser saw on the site + its referrer.
  // Last touch (sessionStorage): the most recent tagged URL in this browsing session.
  var AKEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
  var FT = "cb2b_first_touch", LAND = "cb2b_landing", LT = "cb2b_last_touch";
  function store(kind) { try { return window[kind] || null; } catch (e) { return null; } }
  function readJSON(st, k) { try { var v = st && st.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function writeJSON(st, k, v) { try { if (st) st.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function tagParams(search) {
    var o = null;
    try { var q = new URLSearchParams(search || ""); AKEYS.forEach(function (k) { var v = (q.get(k) || "").trim(); if (v) { (o = o || {})[k] = v.slice(0, 150); } }); } catch (e) {}
    return o;
  }
  function capture(loc, referrer, ls, ss) {
    var now = new Date().toISOString(), t = tagParams(loc.search);
    if (!readJSON(ls, LAND)) writeJSON(ls, LAND, { landing_page: loc.pathname, referrer: String(referrer || "").slice(0, 300), at: now });
    if (t) {
      if (!readJSON(ls, FT)) { var ft = { at: now }; for (var k in t) ft[k] = t[k]; writeJSON(ls, FT, ft); }
      var lt = { at: now, landing_page: loc.pathname }; for (var j in t) lt[j] = t[j]; writeJSON(ss, LT, lt);
    }
  }
  // The fields every submit carries (empty strings when unknown, so GHL field mapping stays stable).
  function attribution(ls, ss, loc, referrer) {
    var lt = readJSON(ss, LT) || {}, ft = readJSON(ls, FT) || {}, land = readJSON(ls, LAND) || {};
    var o = {};
    AKEYS.forEach(function (k) { o[k] = lt[k] || ""; });
    o.landing_page = land.landing_page || (loc && loc.pathname) || "";
    o.referrer = land.landing_page ? (land.referrer || "") : String(referrer || "");
    o.first_utm_source = ft.utm_source || ""; o.first_utm_campaign = ft.utm_campaign || "";
    return o;
  }
  // utm_source=LinkedIn-Page → "utm_linkedin_page"
  function sourceTag(src) { var t = String(src || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40); return t ? "utm_" + t : ""; }
  capture(location, document.referrer, store("localStorage"), store("sessionStorage"));

  // ---- Turnstile ---------------------------------------------------------------------------------
  var tsLoad;
  function loadTurnstile() {
    if (!tsLoad) tsLoad = new Promise(function (res, rej) {
      window.__casperTsReady = res;
      var s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__casperTsReady";
      s.async = true; s.defer = true; s.onerror = function () { tsLoad = null; rej(new Error("turnstile")); };
      document.head.appendChild(s);
    });
    return tsLoad;
  }
  // One widget per host (a form, or a floating box for tools.js calls). Renders lazily on first interaction.
  function widget(host, box) {
    if (host.__ts) return host.__ts;
    var st = host.__ts = { token: "", waiters: [], id: null };
    function flush(t) { st.waiters.splice(0).forEach(function (w) { w(t); }); }
    st.ready = loadTurnstile().then(function () {
      st.id = window.turnstile.render(box, {
        sitekey: SITEKEY, appearance: APPEARANCE, "refresh-expired": "auto", action: "form",
        callback: function (t) { st.token = t; flush(t); },
        "expired-callback": function () { st.token = ""; },
        "error-callback": function () { st.token = ""; flush(""); }
      });
    }).catch(function () { flush(""); });
    return st;
  }
  function takeToken(st) {
    function done(t) { st.token = ""; if (st.id != null) try { window.turnstile.reset(st.id); } catch (e) {} return t; }
    if (st.token) return Promise.resolve(done(st.token));
    return st.ready.then(function () {
      return new Promise(function (res) {
        var timer = setTimeout(function () { res(""); }, 45000);
        st.waiters.push(function (t) { clearTimeout(timer); res(t); });
      });
    }).then(function (t) { return t ? done(t) : ""; });
  }
  var floatHost;
  function globalWidget() {
    if (!floatHost) {
      floatHost = document.createElement("div");
      floatHost.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:2147483000";
      document.body.appendChild(floatHost);
    }
    return widget(floatHost, floatHost);
  }

  // ---- Submit ------------------------------------------------------------------------------------
  function payload(formId, data, tags, notes) {
    var name = data.name || "";
    var first = data.first_name || data.firstName || (name ? name.split(" ")[0] : "");
    var last = data.last_name || data.lastName || (name ? name.split(" ").slice(1).join(" ") : "");
    var a = attribution(store("localStorage"), store("sessionStorage"), location, document.referrer), utmTag = sourceTag(a.utm_source);
    var p = { first_name: first, last_name: last, email: data.email || "", phone: data.phone || data.phoneNumber || "", message: data.message || data.calendar_notes || data.notes || "",
      source_form: formId, source_page: location.pathname, submitted_at: new Date().toISOString(),
      tags: (tags || []).concat(["source_" + formId.toLowerCase().replace(/\s+/g, "_")], utmTag ? [utmTag] : []), notes: notes || data.notes || "" };
    for (var ak in a) p[ak] = a[ak];
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) p[k] = data[k];
    delete p.name;
    return p;
  }
  function submit(formId, data, tags, notes, st, hp) {
    var key = formId + JSON.stringify(data);
    if (recent[key]) return Promise.resolve(true);
    var p = payload(formId, data, tags, notes);
    return takeToken(st || globalWidget()).then(function (token) {
      if (!token) return "captcha";
      // _t: ms since the visitor first touched this form; _tl: ms since the page loaded (the Worker's fill-time check)
      p._ts = token; p._hp = hp || ""; p._t = Date.now() - (st && st.started || loadedAt); p._tl = Date.now() - loadedAt;
      return fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) })
        .then(function (r) {
          if (r.ok) { recent[key] = 1; setTimeout(function () { delete recent[key]; }, 10000); return true; }
          return r.status === 403 ? "captcha" : false;
        })
        .catch(function () { return false; });
    });
  }
  // Put the Turnstile box just above a form's submit button and start it on first interaction.
  function arm(f) {
    if (f.__arm) return f.__arm;
    var btn = f.querySelector("button[type=submit]");
    var box = document.createElement("div");
    box.className = "cf-ts"; box.style.cssText = "margin:6px 0";
    if (btn && btn.parentNode) btn.parentNode.insertBefore(box, btn); else f.appendChild(box);
    function start() { var st = widget(f, box); if (!st.started) st.started = Date.now(); return st; }
    f.addEventListener("focusin", start, { once: true });
    f.addEventListener("pointerdown", start, { once: true });
    return (f.__arm = start);
  }
  // casperSubmit(formId, data, tags, notes[, form]) → Promise<boolean>. Pass the tool's own form so the
  // "I'm not a robot" check (when Cloudflare asks for one) shows inside it instead of a corner box.
  window.casperSubmit = function (formId, data, tags, notes, form) {
    var st = form ? arm(form)() : null;
    return submit(formId, data, tags, notes, st).then(function (r) { return r === true; });
  };
  document.querySelectorAll("form[data-bot-check]").forEach(arm);
  // for tests and debugging in the console: casperForms.payload("Test", { email: "a@b.co" })
  window.casperForms = { capture: capture, attribution: attribution, sourceTag: sourceTag, payload: payload, tagParams: tagParams };

  // ---- Wire up forms -----------------------------------------------------------------------------
  function fill(tpl, data) { return tpl.replace(/\{([\w.]+)(?:\|(\w*))?\}/g, function (_, k, d) { return data[k] ? data[k] : (d || ""); }); }
  document.querySelectorAll("form.lead[data-form-id]").forEach(function (f) {
    var btn = f.querySelector("button[type=submit]");
    // honeypot: invisible to people, tempting to bots
    var hp = document.createElement("input");
    hp.type = "text"; hp.name = HP; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0";
    f.appendChild(hp);
    var start = arm(f); // Turnstile box sits just above the submit button

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector(".form-msg");
      var bad = Array.prototype.filter.call(f.elements, function (el) { return el.willValidate && !el.checkValidity(); });
      Array.prototype.forEach.call(f.elements, function (el) { if (el.willValidate && el.name !== HP) el.setAttribute("aria-invalid", String(!el.checkValidity())); });
      if (bad.length) { msg.className = "form-msg err"; msg.textContent = "Please check the highlighted fields."; bad[0].focus(); return; }
      var data = {};
      Array.prototype.forEach.call(f.elements, function (el) {
        if (!el.name || el.type === "submit" || el.name === HP || el.name.indexOf("cf-turnstile") === 0) return;
        if (el.type === "checkbox") { if (el.checked) data[el.name] = (data[el.name] ? data[el.name] + ", " : "") + el.value; } else data[el.name] = el.value.trim();
      });
      if (f.dataset.extra) { try { var x = JSON.parse(f.dataset.extra); for (var k in x) data[k] = x[k]; } catch (er) {} }
      var tags = (f.dataset.tags || "").split(",").filter(Boolean).map(function (t) { return fill(t, data).replace(/\s+/g, "_").toLowerCase(); });
      if (f.dataset.notes) data.calendar_notes = fill(f.dataset.notes, data);
      if (window.csoTrack) try { window.csoTrack.event("form_submit", f.dataset.formId, { page: location.pathname }); } catch (er) {}
      start();
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending...";
      submit(f.dataset.formId, data, tags, null, f.__ts, hp.value).then(function (r) {
        var ok = r === true;
        btn.disabled = false; btn.textContent = label;
        msg.className = "form-msg " + (ok ? "ok" : "err"); msg.textContent = ok ? f.dataset.success : (r === "captcha" ? BOT_ERR : ERR);
        var next = f.querySelector(".form-next"); if (next) next.hidden = !ok; // "Book a 15-minute fit call" after a successful send
        if (ok) { f.reset(); if (window.csoTrack) window.csoTrack.event("lead", f.dataset.formId); f.dispatchEvent(new CustomEvent("casper:sent", { bubbles: true })); }
      });
    });
  });
})();
