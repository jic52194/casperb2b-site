// casperb2b.com free tools: calculators, quizzes and checklists. Formulas, scoring and result copy are ported from the
// live site's React app. Lead forms inside a tool are sent by forms.js; this script only adds the tool's numbers/answers
// to the form (data-extra / data-notes) right before the visitor presses submit.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var usd = function (n, d) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(n); };
  var fmt = function (n, d) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: d || 0 }).format(n); };
  var v = function (root, id) { var el = $("#t-" + id, root); var x = parseFloat(el && el.value); return isNaN(x) ? 0 : x; };
  var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
  var extra = function (root, obj, notes) { $$("form.lead", root).forEach(function (f) { f.dataset.extra = JSON.stringify(obj); if (notes != null) f.dataset.notes = notes; }); };
  var show = function (root) { var r = $("[data-result]", root); r.hidden = false; r.focus(); r.scrollIntoView({ behavior: "smooth", block: "start" }); return r; };
  function answers(form) { var o = {}; $$("input", form).forEach(function (i) { if ((i.type === "radio" || i.type === "checkbox") && i.checked) { if (i.type === "checkbox") (o[i.name] = o[i.name] || []).push(i.value); else o[i.name] = i.value; } }); return o; }
  function requireAll(form) {
    var names = {}; $$("input[type=radio]", form).forEach(function (i) { names[i.name] = names[i.name] || !!form.querySelector('input[name="' + i.name + '"]:checked'); });
    var missing = Object.keys(names).filter(function (n) { return !names[n]; });
    var msg = $(".form-msg", form);
    if (missing.length) { msg.className = "form-msg err"; msg.textContent = "Please answer every question (" + missing.length + " left)."; form.querySelector('input[name="' + missing[0] + '"]').focus(); return false; }
    msg.textContent = ""; return true;
  }
  function retake(root) { $$("[data-retake]", root).forEach(function (b) { b.addEventListener("click", function () { var f = $("form.quiz", root); f.reset(); $("[data-result]", root).hidden = true; f.scrollIntoView({ behavior: "smooth" }); }); }); }
  function li(arr) { return arr.map(function (x) { var l = document.createElement("li"); l.textContent = x; return l.outerHTML; }).join(""); }

  var T = {
    roi: function (root) {
      var ctr = function (p) { return [0, .32, .24, .18, .11, .08, .05, .04, .03, .02, .01][p] || .005; };
      function run() {
        var l = v(root, "searches"), cur = v(root, "current"), tgt = v(root, "target"), n = v(root, "conv"), o = v(root, "value");
        var N = ctr(cur), V = ctr(tgt), S = l * N, w = l * V, C = S * (n / 100), k = w * (n / 100), c = k * o - C * o;
        set("o-visitors", "+" + fmt(Math.round(w - S))); set("s-visitors", "Jumping from " + (N * 100).toFixed(1) + "% to " + (V * 100).toFixed(1) + "% CTR");
        set("o-customers", "+" + fmt(Math.round(k - C))); set("s-customers", "Based on " + n + "% conversion rate");
        set("o-revenue", usd(c)); set("s-revenue", "That's " + usd(c * 12) + " in new revenue per year.");
        extra(root, { "contact.industry": "N/A", "contact.business_name": "N/A" }, "Monthly Searches: " + l + ", Current Rank: " + cur + ", Target Rank: " + tgt + ", Conv Rate: " + n + "%, Cust Value: " + o + ", Potential Revenue: " + c);
      }
      root.addEventListener("input", run); run();
    },
    ltv: function (root) {
      function run() {
        var l = v(root, "arpa"), i = v(root, "margin"), a = v(root, "churn"), c = v(root, "spend"), o = v(root, "newc");
        var u = a > 0 ? l * (i / 100) / (a / 100) : 0, d = o > 0 ? c / o : 0, h = d > 0 ? u / d : 0;
        set("o-ltv", usd(u)); set("o-cac", usd(d)); set("o-ratio", fmt(h, 1) + " : 1");
        set("s-ratio", h < 1 ? "Critical: Losing Money" : h < 3 ? "Warning: Low Efficiency" : h <= 5 ? "Healthy: Ideal Growth" : "Caution: Underinvesting in Growth");
      }
      root.addEventListener("input", run); run();
    },
    budget: function (root) {
      function run() {
        var n = v(root, "value"), i = v(root, "cpa"), o = v(root, "lts"), c = v(root, "ctl"), t = v(root, "budget");
        var p = n * (i / 100), g = p * (o / 100), m = g * (c / 100), b = m > 0 ? t / m : 0, h = b * (c / 100), j = h * (o / 100), f = j * n, S = t > 0 ? (f - t) / t * 100 : 0;
        set("o-cpc", usd(m, 2)); set("o-cpl", usd(g, 2)); set("o-cpa", usd(p, 2)); set("o-proj-h", "Budget Projection (" + usd(t, 2) + "/mo)");
        set("o-clicks", fmt(b)); set("o-leads", fmt(h)); set("o-sales", fmt(j)); set("o-rev", usd(f, 2)); set("o-roi", fmt(S) + "%");
      }
      root.addEventListener("input", run); run();
    },
    stack: function (root) {
      function run() {
        var total = 0; $$("input[type=number]", root).forEach(function (i) { total += parseFloat(i.value) || 0; });
        set("o-current", usd(total) + "/mo"); set("o-yearly", usd(total * 12));
        extra(root, {}, "Current tool spend: " + usd(total) + "/mo (" + usd(total * 12) + "/yr)");
      }
      root.addEventListener("input", run); run();
    },
    webcost: function (root) {
      var labels = {}; $$("label.opt", root).forEach(function (l) { var i = $("input", l); labels[i.value] = l.textContent.trim(); });
      var std = $("input[name=type][value=standard]", root); if (std) std.checked = true;
      function run() {
        var a = ($("input[name=type]:checked", root) || {}).value || "standard", r = v(root, "pages"), o = $$("input[name=addon]:checked", root).map(function (x) { return x.value; });
        set("o-total", labels[a] || a); set("s-total", r + (r === 1 ? " page" : " pages"));
        var ul = $("[data-scope]", root); if (ul) ul.innerHTML = ["Mobile-First Design Included", "Secure Hosting Setup", "Standard Lead Forms"].concat(o.map(function (k) { return labels[k] || k; })).map(function (x) { return "<li>" + x.replace(/</g, "&lt;") + "</li>"; }).join("");
        extra(root, {}, "Project: " + (labels[a] || a) + ", Pages: " + r + ", Features: " + o.map(function (k) { return labels[k] || k; }).join(", "));
      }
      root.addEventListener("input", run); root.addEventListener("change", run); run();
    },
    cyber: function (root) {
      var form = $("form.quiz", root); retake(root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (!requireAll(form)) return;
        var i = 0; $$("input[type=radio]:checked", form).forEach(function (x) { i += +x.value; });
        var band = "Low", txt = "Your business has strong foundational security. However, cyber threats evolve daily. A professional audit can ensure there are no hidden blind spots.";
        if (i > 0 && i <= 20) { band = "Medium"; txt = "Your business has some security measures, but there are clear vulnerabilities that hackers could exploit. You need to close these gaps before you become a target."; }
        else if (i > 20) { band = "High"; txt = "Your business is highly vulnerable to ransomware, data breaches, and extended downtime. If an automated attack scans your network today, you are at severe risk."; }
        var r = show(root); $("[data-band]", r).textContent = band + " Risk"; $("[data-text]", r).textContent = txt;
      });
    },
    maturity: function (root) {
      var form = $("form.quiz", root); retake(root);
      var fb = {}; $$("fieldset", form).forEach(function (fs) { $$("label.opt", fs).forEach(function (l) { var i = $("input", l); fb[i.name + ":" + i.value] = 1; }); });
      var FEED = { website: ["Your website is likely driving customers to your competitors.", "You have a conversion problem. Your CTAs and messaging need work.", "Great foundation! Focus on scaling traffic."], seo: ["You are invisible to high-intent local searchers.", "You need better citation consistency and GBP optimization.", "Excellent visibility. Keep managing your reviews."], crm: ["You are wasting your marketing budget without a follow-up system.", "Leads are definitely falling through the cracks. You need automation.", "Perfect. Your speed-to-lead is a competitive advantage."], reputation: ["Customers are choosing competitors because they look 'safer'.", "You need a proactive review generation strategy to stand out.", "You are the trusted choice in your market."] };
      var LABEL = { website: "Website Performance", seo: "Local SEO Visibility", crm: "Lead Management", reputation: "Online Reputation" };
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (!requireAll(form)) return;
        var a = answers(form), p = 0; Object.keys(a).forEach(function (k) { p += +a[k]; });
        var o = p / 40 * 100;
        var g = o >= 90 ? ["Elite", "Your digital engine is running at full capacity."] : o >= 70 ? ["Growth-Ready", "Solid foundation, but significant gaps are limiting your scale."] : o >= 40 ? ["Vulnerable", "You are likely losing more leads than you are capturing."] : ["Critical", "Your online presence is actively hurting your business growth."];
        var r = show(root); $("[data-band]", r).textContent = o + "% · Your Score: " + g[0]; $("[data-text]", r).textContent = g[1];
        $("[data-feedback]", r).innerHTML = Object.keys(LABEL).map(function (k) { var el = document.createElement("li"); el.innerHTML = "<b></b> "; el.firstChild.textContent = LABEL[k] + ":"; el.appendChild(document.createTextNode(FEED[k][+a[k] / 5])); return el.outerHTML; }).join("");
        extra(root, { "contact.quiz_score": String(p), "contact.quiz_grade": g[0] }, "Quiz Results: " + JSON.stringify(a));
      });
    },
    motivation: function (root) {
      var P = {
        Rewards: ["The Pragmatic Architect", "The Reward-Driven Leader", "You are motivated by the outcome. You are practical, outcome-focused, and driven by upside. You see business as a vehicle for freedom, security, and growth. You aren't greedy; you're realistic about what it takes to win.", "Focus on ROI, clear financial goals, and efficient systems that maximize your return on time and money.", ["Highly pragmatic", "Excellent at prioritizing high-ROI tasks", "Decisive when the math makes sense"], ["May overlook long-term brand building", "Can struggle to retain talent if money is the only incentive", "Might burn out if the financial upside drops temporarily"], "Automated CRM pipelines, advanced analytics dashboards, and high-converting performance marketing funnels."],
        Ideology: ["The Visionary Crusader", "The Mission-Driven Leader", "You are motivated by belief. You act because you believe something is right, necessary, or meaningful. For you, business is an extension of your identity and your values. You're chasing alignment, not just attention.", "Focus on brand storytelling, mission-aligned marketing, and building a community that shares your vision.", ["Incredible resilience during hard times", "Naturally attracts loyal customers and employees", "Creates highly authentic marketing"], ["Can be overly stubborn about 'the right way'", "May undercharge or neglect the financial mechanics of the business", "Might delay launching because it isn't 'perfect'"], "Content-rich website, community management platforms, and deep email nurture sequences."],
        Coercion: ["The Crisis Commander", "The Pressure-Driven Leader", "You are motivated by necessity. You move best when the stakes are high and the deadlines are real. You aren't motivated by fear, but by the reality of consequences. You move before you're forced to, but the pressure is your fuel.", "Focus on accountability systems, strict deadlines, and clear risk-management strategies to stay ahead of the curve.", ["Incredible execution when the clock is ticking", "Highly realistic about market threats", "Great at solving immediate crises"], ["Can create a stressful culture for the team", "May struggle to work on long-term strategy when there is no immediate fire", "Prone to burnout from constant adrenaline"], "Strict project management tools, automated deadline reminders, and secure cybersecurity/backup systems."],
        Ego: ["The Undeniable Authority", "The Excellence-Driven Leader", "You are motivated by standards. You need to prove your excellence and dominate your field. You want your name attached to something undeniable. Your ego isn't arrogance; it's a commitment to being the best.", "Focus on premium positioning, high-standard branding, and becoming the authoritative voice in your industry.", ["Sets incredibly high standards for quality", "Unwilling to accept average results", "Highly competitive and driven to win"], ["May struggle to delegate or trust others", "Can take market feedback too personally", "Might over-invest in looking good rather than functioning well"], "Premium custom website design, high-end reputation management tools, and PR/authority building systems."],
      };
      var form = $("form.quiz", root); retake(root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (!requireAll(form)) return;
        var s = { Rewards: 0, Ideology: 0, Coercion: 0, Ego: 0 }; $$("input[type=radio]:checked", form).forEach(function (x) { s[x.value]++; });
        var top = Object.keys(s).reduce(function (a, b) { return s[a] >= s[b] ? a : b; }); var d = P[top];
        var r = show(root); $("[data-profile]", r).textContent = d[0]; $("[data-title]", r).textContent = d[1]; $("[data-desc]", r).textContent = d[2]; $("[data-strategy]", r).textContent = d[3];
        $("[data-strengths]", r).innerHTML = li(d[4]); $("[data-blind]", r).innerHTML = li(d[5]); $("[data-stack]", r).textContent = d[6];
        // no contact details yet: attach the profile to the quiz's lead form instead of sending an anonymous lead
        var lf = $("form.lead", root); if (lf) lf.dataset.extra = JSON.stringify({ motivation_driver: top, rewards_score: s.Rewards, ideology_score: s.Ideology, coercion_score: s.Coercion, ego_score: s.Ego, notes: "Motivation quiz profile: " + d[0] + " (" + top + ")" });
      });
    },
    aiready: function (root) {
      var form = $("form.quiz", root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (!requireAll(form)) return;
        var qs = $$("fieldset", form), yes = 0, miss = [], a = {};
        qs.forEach(function (fs, i) { var c = $("input:checked", fs); var q = $("legend b", fs).textContent.replace(/^Question \d+ of \d+ · /, ""); a["q" + i] = c.value === "yes"; if (c.value === "yes") yes++; else miss.push("Missing: " + q.replace("?", "") + ". This hurts your AI confidence score."); });
        var pct = yes / qs.length * 100;
        var r = show(root); $("[data-band]", r).textContent = pct + "%";
        $("[data-text]", r).textContent = pct > 80 ? "Excellent! Your business is well-positioned for AI search." : pct > 50 ? "Good start, but you have significant gaps that will prevent AI citations." : "Critical Action Required: AI engines will likely ignore your business in its current state.";
        $("[data-missing]", r).innerHTML = li(miss.length ? miss : ["Perfect score! Your business is fully optimized for AI search engines."]);
        extra(root, {}, "AI Readiness Score: " + pct + "/100. Answers: " + JSON.stringify(a));
      });
    },
    bundle: function (root) {
      var form = $("form.quiz", root); retake(root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); var a = answers(form), need = a.need || [], msg = $(".form-msg", form);
        if (!need.length || !a.stage) { msg.className = "form-msg err"; msg.textContent = !need.length ? "Select at least one bottleneck." : "Choose where your business is currently at."; return; }
        msg.textContent = "";
        var b = a.stage === "starter" || need.length <= 2 ? ["Starter System", "We set up your CRM and lead capture so you can run it yourself.", ["CRM & Pipeline Setup", "Lead Capture Forms", "Workflow Automations", "Training on Your New System"]]
          : need.indexOf("followup") > -1 || need.indexOf("admin") > -1 ? ["Done-For-You Setup", "We build your foundation so you can capture and close.", ["Everything in the Starter System", "Done-For-You CRM Setup", "Automated Email/SMS Sequences", "Booking & Calendar Setup", "Review Generation System"]]
          : ["Done-For-You Setup + Growth Services", "Professional implementation plus ongoing growth work.", ["Everything in Done-For-You Setup", "Recommended: Add an SEO Specialist", "Recommended: Add a Tech Lead", "Dedicated Growth Strategy"]];
        var r = show(root); $("[data-name]", r).textContent = b[0]; $("[data-tagline]", r).textContent = b[1]; $("[data-services]", r).innerHTML = li(b[2]);
        extra(root, {}, "Bundle: " + b[0] + " · Bottlenecks: " + need.join(", ") + " · Stage: " + a.stage);
      });
    },
    fit: function (root) {
      var form = $("form.quiz", root); retake(root);
      function rec(a) {
        if (a.budget === "over3000" || (a.budget === "1500to3000" && a.stage === "established")) return ["Premium Growth System", "Full-stack digital growth & technology partner.", "Based on your answers, you're ready for a comprehensive, multi-channel growth system. We'll combine SEO, paid advertising, website optimization, automation, and ongoing reporting into one cohesive plan built specifically for your business.", ["SEO & Local Search Dominance", "Google Ads & PPC Management", "Website Redesign & CRO", "CRM & Follow-Up Automation Setup", "AI Chatbot & Automation", "Monthly Strategy Reviews"], "Book Your Premium Strategy Call"];
        if (a.challenge === "security") return ["Managed IT & Security Package", "Protect your business, your data, and your customers.", "Your answers point to a need for structured IT support and cybersecurity. We'll audit your current setup, identify vulnerabilities, and build a protection plan that lets you focus on running your business without worrying about digital threats.", ["Cybersecurity Risk Review", "Network Security Setup", "Data Protection Planning", "Phishing & Threat Awareness", "Access Control Guidance", "Ongoing IT Management"], "Schedule My IT Security Review"];
        if (a.website === "none" || a.website === "basic" || a.challenge === "website") return ["Website & Digital Foundation Package", "Build the right foundation before scaling.", "Your biggest opportunity is a stronger digital foundation. We'll build or redesign your website with lead capture, mobile optimization, local SEO signals, and clear calls-to-action — so every dollar you spend on marketing actually converts.", ["Website Design & Development", "Mobile-First Optimization", "Local SEO Foundation", "Lead Capture Forms", "Speed & Core Web Vitals", "Google Business Profile Setup"], "Start My Website Project"];
        if (a.challenge === "leads" || a.timeline === "asap") return ["Quick-Win Lead Generation Package", "Get more calls from people already searching for you.", "You have the foundation — now you need leads. We'll launch targeted local SEO improvements, Google Ads, and conversion-focused landing pages designed to bring qualified prospects to your door faster.", ["Local SEO Quick Wins", "Google Ads Campaign Launch", "Landing Page Optimization", "Lead Capture Improvements", "Call & Form Tracking", "30-Day Performance Review"], "Get My Lead Generation Plan"];
        return ["Full-Growth Marketing Package", "Visibility, leads, and systems working together.", "Your business is ready to grow strategically. We'll combine local SEO, content marketing, reputation building, and website improvements into a consistent plan that drives more qualified traffic and converts it into real customers.", ["Local SEO & Google Visibility", "Content Strategy & Blog", "Reputation Management", "Website Conversion Improvements", "Business Listings Optimization", "Monthly Performance Reporting"], "Book My Growth Strategy Call"];
      }
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (!requireAll(form)) return;
        var a = answers(form), l = rec(a), r = show(root);
        $("[data-tier]", r).textContent = l[0]; $("[data-tagline]", r).textContent = l[1]; $("[data-desc]", r).textContent = l[2]; $("[data-services]", r).innerHTML = li(l[3]); $("[data-cta]", r).textContent = l[4];
        var lines = $$("fieldset", form).map(function (fs) { var c = $("input:checked", fs); return $("legend b", fs).textContent.replace(/^\d+\. /, "") + ": " + c.closest("label").querySelector("span").firstChild.textContent; }).join("\n");
        var f = $("form.lead", r); f.dataset.extra = JSON.stringify({ quiz_result_tier: l[0], quiz_result_tagline: l[1], quiz_answers_raw: a, notes: "Quiz Recommendation: " + l[0] + "\n\nAnswers:\n" + lines });
        f.dataset.tags = "website_quiz,quiz_result_" + l[0].toLowerCase().replace(/\s+/g, "_");
      });
    },
    checklist: function () {},
    strategy: function (root) {
      var f = $("form.lead", root), boxes = $$("input[type=checkbox]", root);
      function score() { return Math.round(boxes.filter(function (b) { return b.checked; }).length / boxes.length * 100); }
      function upd() { var a = {}; boxes.forEach(function (b) { a[b.value] = b.checked; }); f.dataset.notes = "Strategy Audit Score: " + score() + "/100. Answers: " + JSON.stringify(a); }
      root.addEventListener("change", upd); upd();
      f.addEventListener("casper:sent", function () {
        var l = score(), r = show(root); $("[data-band]", r).textContent = l + "%";
        $("[data-text]", r).textContent = l > 80 ? "Your business has a strong foundation. You're ready for advanced scaling and automation." : l > 50 ? "You have some systems in place, but critical gaps are causing you to lose leads every day." : "Your digital strategy needs immediate attention. You're likely leaving revenue on the table.";
      });
    },
    keywords: function (root) {
      function run() {
        var t = (($('[name="contact.industry"]', root) || {}).value || "").trim(), r = (($('[name="contact.town"]', root) || {}).value || "").trim() || "Georgetown";
        var rows = [[(t || "Service") + " in " + r, "transactional"], ["best " + (t || "service") + " " + r, "commercial"], [(t || "Service") + " near me", "transactional"], ["affordable " + (t || "service") + " " + r + " ma", "commercial"], [(t || "Service") + " cost " + r, "informational"]];
        $("[data-preview]", root).innerHTML = li(rows.map(function (x) { return x[0] + " · " + x[1]; }));
      }
      root.addEventListener("input", run);
    },
    compare: function () {}, grader: function () {},
    ideas: function (root) {
      var form = $("form.quiz", root), out = $("[data-ideas]", root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); var s = form.industry.value.trim(), t = form.audience.value.trim(), msg = $(".form-msg", form);
        if (!s || !t) { msg.className = "form-msg err"; msg.textContent = "Enter your industry and target audience."; return; } msg.textContent = "";
        var y = new Date().getFullYear();
        var b = ["The Ultimate Guide to " + s + " for " + t, "5 Common Mistakes " + t + " Make When Hiring a " + s + " Professional", "How to Choose the Right " + s + " Service in " + y, s + " Trends: What " + t + " Need to Know", "Why " + t + " Are Switching to Modern " + s + " Solutions"];
        var f = ["Behind the Scenes: A Day in the Life of a " + s + " Expert", "Quick Tip: How " + t + " can save money on " + s + " services", "The #1 Question We Get Asked About " + s, "Watch Us Transform This for Our " + t + " Clients", "Myth vs Reality in the " + s + " World"];
        var m = ["Free Checklist: 10 Things " + t + " Must Check Before Hiring a " + s + " Pro", "The Complete " + s + " Pricing Guide for " + t, "Template: How " + t + " Can Audit Their " + s + " Needs", "Case Study: How We Helped " + t + " Achieve Results with " + s];
        out.innerHTML = "<h3>Blog &amp; Article Ideas</h3><ol>" + li(b) + "</ol><h3>Video &amp; Social Media Ideas</h3><ol>" + li(f) + "</ol><h3>Lead Magnet Ideas</h3><ol>" + li(m) + "</ol>";
      });
    },
    breach: function (root) {
      var form = $("form.quiz", root), out = $("[data-result]", root);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); var msg = $(".form-msg", form);
        var bad = $$("[required]", form).filter(function (i) { return !i.checkValidity(); });
        if (bad.length) { msg.className = "form-msg err"; msg.textContent = "Please fill in the highlighted fields."; bad.forEach(function (i) { i.setAttribute("aria-invalid", "true"); }); bad[0].focus(); return; }
        var s = {}; $$("input,textarea", form).forEach(function (i) { s[i.name] = i.value.trim(); });
        var E = function (x) { var d = document.createElement("span"); d.textContent = x; return d.innerHTML; };
        out.innerHTML = '<p class="ctas no-print"><button class="btn" type="button" data-print>Print / Save PDF</button> <button class="btn ghost" type="button" data-edit>Edit Details</button></p><div class="plan"><h2>Incident Response Plan</h2><p><b>' + E(s.businessName || "Company Name") + "</b> · Emergency Document · Last Updated: " + new Date().toLocaleDateString() + "</p>"
          + "<h3>Phase 1: Immediate Action (First 15 Minutes)</h3><ol><li><b>DO NOT TURN OFF COMPUTERS.</b> Disconnect them from the network (unplug ethernet cables, turn off Wi-Fi) to stop the spread, but leave power on for forensics.</li><li><b>Isolate Critical Systems:</b> Immediately disconnect " + E(s.criticalSystems ? s.criticalSystems.split("\n")[0] : "main servers") + " from the internet.</li><li><b>Notify IT Immediately:</b> Call " + E(s.itContactName || "IT Provider") + " at <b>" + E(s.itContactPhone || "___-___-____") + "</b>.</li></ol>"
          + "<h3>Emergency Contact Roster</h3><ul><li>Internal Incident Lead: " + E(s.incidentLeadName || "Name") + " · " + E(s.incidentLeadPhone || "Phone") + "</li><li>IT / Security Provider: " + E(s.itContactName || "Provider Name") + " · " + E(s.itContactPhone || "Phone") + "</li>" + (s.legalContactName || s.insuranceProvider ? "<li>Legal Counsel: " + E(s.legalContactName || "N/A") + "</li><li>Cyber Insurance: " + E(s.insuranceProvider || "N/A") + "</li>" : "") + "</ul>"
          + "<h3>Systems &amp; Recovery</h3><p><b>Critical Systems to Protect:</b><br>" + E(s.criticalSystems || "List critical systems here...").replace(/\n/g, "<br>") + "</p><p><b>Backup Location:</b> " + E(s.backupLocation || "Location of clean backups...") + "<br>Note: Do not connect backup drives to infected machines.</p>"
          + "<h3>Phase 2: Investigation &amp; Recovery</h3><ul><li><b>Assess the Scope:</b> IT provider determines which systems are compromised and if sensitive data (customer info, financials) was accessed.</li><li><b>Notify Insurance &amp; Counsel:</b> If a breach is confirmed, contact cyber insurance provider before taking destructive remediation steps.</li><li><b>Reset Credentials:</b> Force a password reset for all administrative accounts and critical systems from a known clean device.</li><li><b>Restore from Backups:</b> IT provider wipes infected machines and restores data from the clean backup location identified above.</li></ul><p class=\"fine\">Generated via CasperB2B Security Tools • Keep this document in a physically accessible location.</p></div>";
        form.hidden = true; show(root);
        $("[data-print]", out).onclick = function () { window.print(); };
        $("[data-edit]", out).onclick = function () { form.hidden = false; out.hidden = true; form.scrollIntoView({ behavior: "smooth" }); };
        if (window.casperSubmit) window.casperSubmit("Breach Response Plan Generator", { email: s.email, organization: s.businessName });
      });
    },
  };
  $$("[data-tool]").forEach(function (root) { var fn = T[root.dataset.tool]; if (fn) fn(root); });
})();
