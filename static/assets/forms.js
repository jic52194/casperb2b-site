// casperb2b.com forms → the same GoHighLevel inbound webhook and the same JSON payload the live site's React app sent
// (src: submitToCrm in the old bundle). Every <form class="lead" data-form-id="…"> is handled here; tools.js reuses
// window.casperSubmit for its result forms. Nothing is sent until the visitor presses the submit button.
(function () {
  var HOOK = "https://services.leadconnectorhq.com/hooks/TLBXLD9M7LensL45PB90/webhook-trigger/bee537ba-8323-4437-9b8a-6d861e808c0e";
  var ERR = "Something went wrong. Please call us directly at 1-207-222-7737.";
  var recent = {};
  function submit(formId, data, tags, notes) {
    var key = formId + JSON.stringify(data);
    if (recent[key]) return Promise.resolve(true);
    var name = data.name || "";
    var first = data.first_name || data.firstName || (name ? name.split(" ")[0] : "");
    var last = data.last_name || data.lastName || (name ? name.split(" ").slice(1).join(" ") : "");
    var p = { first_name: first, last_name: last, email: data.email || "", phone: data.phone || data.phoneNumber || "", message: data.message || data.calendar_notes || data.notes || "",
      source_form: formId, source_page: location.pathname, submitted_at: new Date().toISOString(),
      tags: (tags || []).concat(["source_" + formId.toLowerCase().replace(/\s+/g, "_")]), notes: notes || data.notes || "" };
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) p[k] = data[k];
    delete p.name;
    return fetch(HOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) })
      .then(function (r) { if (r.ok) { recent[key] = 1; setTimeout(function () { delete recent[key]; }, 10000); } return r.ok; })
      .catch(function () { return false; });
  }
  window.casperSubmit = submit;

  function fill(tpl, data) { return tpl.replace(/\{([\w.]+)(?:\|(\w*))?\}/g, function (_, k, d) { return data[k] ? data[k] : (d || ""); }); }
  document.querySelectorAll("form.lead[data-form-id]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector(".form-msg"), btn = f.querySelector("button[type=submit]");
      var bad = Array.prototype.filter.call(f.elements, function (el) { return el.willValidate && !el.checkValidity(); });
      Array.prototype.forEach.call(f.elements, function (el) { if (el.willValidate) el.setAttribute("aria-invalid", String(!el.checkValidity())); });
      if (bad.length) { msg.className = "form-msg err"; msg.textContent = "Please check the highlighted fields."; bad[0].focus(); return; }
      var data = {};
      Array.prototype.forEach.call(f.elements, function (el) { if (el.name && el.type !== "submit") { if (el.type === "checkbox") { if (el.checked) data[el.name] = (data[el.name] ? data[el.name] + ", " : "") + el.value; } else data[el.name] = el.value.trim(); } });
      if (f.dataset.extra) { try { var x = JSON.parse(f.dataset.extra); for (var k in x) data[k] = x[k]; } catch (er) {} }
      var tags = (f.dataset.tags || "").split(",").filter(Boolean).map(function (t) { return fill(t, data).replace(/\s+/g, "_").toLowerCase(); });
      if (f.dataset.notes) data.calendar_notes = fill(f.dataset.notes, data);
      if (window.csoTrack) try { window.csoTrack.event("form_submit", f.dataset.formId, { page: location.pathname }); } catch (er) {}
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending...";
      submit(f.dataset.formId, data, tags).then(function (ok) {
        btn.disabled = false; btn.textContent = label;
        msg.className = "form-msg " + (ok ? "ok" : "err"); msg.textContent = ok ? f.dataset.success : ERR;
        if (ok) { f.reset(); if (window.csoTrack) window.csoTrack.event("lead", f.dataset.formId); f.dispatchEvent(new CustomEvent("casper:sent", { bubbles: true })); }
      });
    });
  });
})();
