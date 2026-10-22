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
})();
