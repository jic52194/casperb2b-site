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

  // /contact?topic=seo preselects "What are you looking for?"
  var topic = new URLSearchParams(location.search).get("topic"), sel = document.querySelector("select[name=service_requested]");
  if (topic && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === topic) sel.value = topic; });
})();
