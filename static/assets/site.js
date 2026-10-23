// casperb2b.com UI: header dropdowns, mobile drawer, "Let's talk" widget, cookie settings link. No dependencies.
(function () {
  var menus = document.querySelectorAll(".menu");
  function closeAll(except) { menus.forEach(function (m) { if (m !== except) { m.classList.remove("open"); m.querySelector("button").setAttribute("aria-expanded", "false"); } }); }
  menus.forEach(function (m) {
    var b = m.querySelector("button");
    b.addEventListener("click", function (e) { e.stopPropagation(); var open = !m.classList.contains("open"); closeAll(m); m.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open)); });
    m.addEventListener("mouseenter", function () { if (matchMedia("(hover:hover)").matches) { closeAll(m); m.classList.add("open"); b.setAttribute("aria-expanded", "true"); } });
    m.addEventListener("mouseleave", function () { if (matchMedia("(hover:hover)").matches) { m.classList.remove("open"); b.setAttribute("aria-expanded", "false"); } });
  });
  document.addEventListener("click", function () { closeAll(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); toggleTalk(false); } });

  var burger = document.querySelector("[data-burger]"), drawer = document.querySelector("[data-drawer]");
  if (burger && drawer) burger.addEventListener("click", function () {
    var open = drawer.hasAttribute("hidden"); if (open) drawer.removeAttribute("hidden"); else drawer.setAttribute("hidden", "");
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  var talk = document.querySelector("[data-talk]"), tb = talk && talk.querySelector(".talk-btn"), tp = talk && talk.querySelector(".talk-panel");
  function toggleTalk(open) { if (!tp) return; if (open === undefined) open = tp.hasAttribute("hidden"); if (open) tp.removeAttribute("hidden"); else tp.setAttribute("hidden", ""); tb.setAttribute("aria-expanded", String(open)); }
  if (tb) tb.addEventListener("click", function (e) { e.stopPropagation(); toggleTalk(); });

  document.querySelectorAll("[data-cookie-settings]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); window.dispatchEvent(new Event("cso:consent-open")); }); });
  // CTA analytics: every primary/secondary call to action reports a click to t.js (first-party analytics)
  function track(type, label, props) { try { if (window.csoTrack) window.csoTrack.event(type, label, props); } catch (e) {} }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-cta], a.btn, button.btn");
    if (!a || a.type === "submit") return;
    track("cta_click", (a.textContent || "").trim().slice(0, 60), { cta: a.getAttribute("data-cta") || "content", href: a.getAttribute("href") || "", page: location.pathname });
  }, true);
  window.casperTrack = track;

  // header: compact with a shadow once the page scrolls; reading progress on long articles
  var top = document.querySelector(".top"), longread = document.querySelector(".longread"), bar;
  if (longread) { bar = document.createElement("div"); bar.className = "progress-bar"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar); }
  function onScroll() {
    var y = window.scrollY || 0;
    if (top) top.classList.toggle("scrolled", y > 12);
    if (bar) { var h = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%"; }
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // reveal on scroll (content stays visible without JS, for crawlers, in print and with reduced motion)
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var sel = ".content>section:not(:first-child)>h2, .content>section:not(:first-child)>p, .card, .card-link, .content>section>ol>li, details, .cta-band, .toc, .trust, .table-wrap, .tool, form.lead, .founder-card";
    var els = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (el) { return !el.closest(".content>section:first-child") || el.matches(".card,.card-link"); });
    document.documentElement.classList.add("motion");
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (el.matches(".card,.card-link,li")) el.style.transitionDelay = (sib % 4) * 70 + "ms";
      el.classList.add("rv"); io.observe(el);
    });
    window.addEventListener("beforeprint", function () { els.forEach(function (el) { el.classList.add("in"); }); });
    // jump links and fast scrolling: anything already above the fold reveals at once
    var pending = false;
    function sweep() { pending = false; var vh = window.innerHeight; els.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < vh) { el.classList.add("in"); io.unobserve(el); } }); }
    window.addEventListener("scroll", function () { if (!pending) { pending = true; setTimeout(sweep, 150); } }, { passive: true });
    window.addEventListener("hashchange", sweep);
  }

  // printing: open every FAQ so answers are on paper, then put them back
  var opened = [];
  window.addEventListener("beforeprint", function () { document.querySelectorAll("details:not([open])").forEach(function (d) { d.setAttribute("open", ""); opened.push(d); }); });
  window.addEventListener("afterprint", function () { opened.forEach(function (d) { d.removeAttribute("open"); }); opened = []; });

  // /contact?topic=seo preselects "What are you looking for?"
  var topic = new URLSearchParams(location.search).get("topic"), sel = document.querySelector("select[name=service_requested]");
  if (topic && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === topic) sel.value = topic; });
})();
