/* Wires the settings in config.js into the page. No libraries, no trackers. */
(function () {
  var C = window.SITE_CONFIG || {};
  var lang = document.documentElement.lang === "en" ? "en" : "fa";
  var faDigits = function (s) {
    return lang === "fa" ? String(s).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; }) : String(s);
  };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Hide anything whose setting is empty: data-requires="paypalMe venmo" hides only if ALL are empty.
  $$("[data-requires]").forEach(function (el) {
    var keys = el.getAttribute("data-requires").split(/\s+/);
    var any = keys.some(function (k) { return C[k] && String(C[k]).trim() !== ""; });
    if (!any) el.classList.add("hidden");
  });

  // Plain text values: <span data-config="zelle"></span>
  $$("[data-config]").forEach(function (el) {
    var v = C[el.getAttribute("data-config")];
    if (v) el.textContent = v;
  });

  // Links from settings: <a data-href="paperbackUrl">
  $$("[data-href]").forEach(function (el) {
    var v = C[el.getAttribute("data-href")];
    if (v) el.href = v;
  });

  // Email links, optionally with a prefilled subject/body.
  $$("[data-email-link]").forEach(function (el) {
    if (!C.email) return;
    var subject = el.getAttribute("data-subject");
    var body = el.getAttribute("data-body");
    var q = [];
    if (subject) q.push("subject=" + encodeURIComponent(subject));
    if (body) q.push("body=" + encodeURIComponent(body.replace(/\\n/g, "\n")));
    el.href = "mailto:" + C.email + (q.length ? "?" + q.join("&") : "");
    if (el.hasAttribute("data-show-address")) el.textContent = C.email;
  });

  // Venmo profile link
  $$("[data-venmo-link]").forEach(function (el) {
    if (C.venmo) el.href = "https://venmo.com/u/" + encodeURIComponent(C.venmo.replace(/^@/, ""));
  });

  // PayPal amount buttons
  $$("[data-gift-amounts]").forEach(function (box) {
    if (!C.paypalMe) return;
    var base = "https://paypal.me/" + encodeURIComponent(C.paypalMe);
    var tplAmount = box.getAttribute("data-label-amount") || "$%";
    (C.giftAmountsUSD || []).forEach(function (amt, i) {
      var a = document.createElement("a");
      a.className = "btn " + (i === 0 ? "btn-primary" : "btn-ghost");
      a.href = base + "/" + amt + "USD";
      a.target = "_blank"; a.rel = "noopener";
      a.textContent = tplAmount.replace("%", faDigits(amt));
      box.appendChild(a);
    });
    var other = document.createElement("a");
    other.className = "btn btn-ghost";
    other.href = base; other.target = "_blank"; other.rel = "noopener";
    other.textContent = box.getAttribute("data-label-other") || "Other amount";
    box.appendChild(other);
  });

  // Copy-to-clipboard buttons: <button class="copy" data-copy="zelle">
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var v = C[btn.getAttribute("data-copy")] || "";
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(v).then(function () {
        var old = btn.textContent;
        btn.textContent = btn.getAttribute("data-done") || "✓";
        setTimeout(function () { btn.textContent = old; }, 1600);
      });
    });
  });

  // Book request form (FormSubmit AJAX endpoint).
  $$("form[data-request-form]").forEach(function (form) {
    if (!C.formEndpoint) { form.classList.add("hidden"); return; }
    form.action = C.formEndpoint;
    var status = form.querySelector(".status");
    var btn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      btn.disabled = true;
      var data = new FormData(form);
      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status " + r.status);
          return r.json().catch(function () { return {}; });
        })
        .then(function (j) {
          if (j && String(j.success) === "false" && !/activat/i.test(j.message || "")) throw new Error(j.message);
          status.className = "status ok show";
          var abroad = data.get("location") === "outside-iran";
          status.textContent = form.getAttribute(abroad ? "data-msg-ok-abroad" : "data-msg-ok");
          form.reset();
          if (abroad) {
            var gift = document.getElementById("gift");
            if (gift && !gift.classList.contains("hidden")) gift.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        })
        .catch(function () {
          status.className = "status err show";
          status.textContent = form.getAttribute("data-msg-err");
        })
        .then(function () { btn.disabled = false; });
    });
  });

  // If no gift method is set at all, hide the gift panel and let the form use the full width.
  var giftPanel = document.getElementById("gift");
  if (giftPanel && !C.paypalMe && !C.zelle && !C.venmo) {
    giftPanel.classList.add("hidden");
    var panels = giftPanel.closest(".panels");
    if (panels) panels.style.gridTemplateColumns = "1fr";
  }
})();
