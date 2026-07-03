/* ============================================================
   AJWA Hotels — Front-End İyileştirme Katmanı (SHOWCASE) — JS
   Progressive enhancement: mevcut markup'ı bozmadan üstüne ekler.
   Per-sayfa yapılandırma: window.AJWA_ENH_CFG (injector tarafından yazılır)
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.AJWA_ENH_CFG || {};
  var doc = document;

  var ICON = {
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3 0-1.5.8-2.2 1-2.5.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.5.4.1.2.1.7-.1 1.3z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm12 8v9H5v-9h14z"/></svg>'
  };

  function el(html) { var t = doc.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  /* ---- B1: div/span kontrollerini klavye+ekran-okuyucu erişilebilir yap ---- */
  function makeButton(node, label) {
    if (!node || node.dataset.ajwaBtn) return;
    node.dataset.ajwaBtn = "1";
    if (!node.getAttribute("role")) node.setAttribute("role", "button");
    if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "0");
    if (label && !node.getAttribute("aria-label")) node.setAttribute("aria-label", label);
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); node.click(); }
    });
  }

  function retrofitControls() {
    makeButton(doc.getElementById("ucHeader_divBookButton"), (CFG.hotel || "AJWA") + " — Rezervasyon / Book now");
    doc.querySelectorAll(".hamburger-menu-opener").forEach(function (n) { makeButton(n, "Menüyü aç / Open menu"); });
    doc.querySelectorAll("[booking-close], .booking-modal .close").forEach(function (n) { makeButton(n, "Kapat / Close"); });
    doc.querySelectorAll(".book-now-button, [booking-opener]").forEach(function (n) { makeButton(n, "Rezervasyon / Book now"); });
  }

  /* ---- B3: skip-link + landmark ---- */
  function landmarks() {
    if (!doc.querySelector(".ajwa-skip")) {
      var skip = el('<a class="ajwa-skip ajwa-enh-el" href="#ajwa-main">İçeriğe geç / Skip to content</a>');
      doc.body.insertBefore(skip, doc.body.firstChild);
    }
    var hero = doc.querySelector(".homepage-banner-wrapper, .homepage-banner");
    if (hero && !doc.getElementById("ajwa-main")) {
      var anchor = doc.createElement("span");
      anchor.id = "ajwa-main"; anchor.setAttribute("tabindex", "-1");
      hero.parentNode.insertBefore(anchor, hero);
    }
  }

  /* ---- A10: header hızlı-iletişim (tel + WhatsApp) ---- */
  function quickContact() {
    var rail = doc.querySelector(".right-fixed.js-right-fixed") || doc.querySelector(".right-fixed");
    if (!rail || !CFG.phone || doc.querySelector(".ajwa-quick-contact")) return;
    var telHref = "tel:" + CFG.phone.replace(/[^\d+]/g, "");
    var waHref = "https://wa.me/" + CFG.phone.replace(/[^\d]/g, "");
    var box = el(
      '<div class="ajwa-quick-contact ajwa-enh-el">' +
      '<a href="' + telHref + '" aria-label="Telefonla ara: ' + CFG.phone + '">' + ICON.phone + '</a>' +
      '<a class="ajwa-wa" href="' + waHref + '" target="_blank" rel="noopener" aria-label="WhatsApp ile yaz">' + ICON.wa + '</a>' +
      "</div>"
    );
    rail.appendChild(box);
  }

  /* ---- A1 + B7 + D7: hero-altı marka & güven bandı ---- */
  function band() {
    if (doc.querySelector(".ajwa-band")) return;
    var hero = doc.querySelector(".homepage-banner-wrapper, .homepage-banner");
    if (!hero) return;

    var stars = "★★★★★";
    var telHref = CFG.phone ? "tel:" + CFG.phone.replace(/[^\d+]/g, "") : null;
    var waHref = CFG.phone ? "https://wa.me/" + CFG.phone.replace(/[^\d]/g, "") : null;

    var awardsHtml = (CFG.awards || []).map(function (a) {
      return '<span class="ajwa-award">' + a + "</span>";
    }).join("");

    var ratingHtml = CFG.rating
      ? '<span class="ajwa-rating"><span class="ajwa-stars" aria-hidden="true">' + stars + "</span>" +
        "<b>" + CFG.rating + "</b>/5 " + (CFG.ratingLabel || "") +
        '<sup>örnek</sup></span>'
      : "";

    var ctaHtml =
      '<a class="ajwa-btn ajwa-btn--gold" href="#" role="button" onclick="var b=document.getElementById(\'ucHeader_divBookButton\');if(b){b.click();return false;}">' +
        ICON.cal + (CFG.lang === "tr" ? "Rezervasyon Yap" : "Book Your Stay") + "</a>" +
      (telHref ? '<a class="ajwa-btn ajwa-btn--primary" href="' + telHref + '">' + ICON.phone + (CFG.lang === "tr" ? "Ara" : "Call") + "</a>" : "") +
      (waHref ? '<a class="ajwa-btn ajwa-btn--ghost" href="' + waHref + '" target="_blank" rel="noopener">' + ICON.wa + "WhatsApp</a>" : "");

    var band = el(
      '<section class="ajwa-band ajwa-enh-el" aria-label="' + (CFG.hotel || "AJWA") + '">' +
      (CFG.eyebrow ? '<p class="ajwa-band__eyebrow">' + CFG.eyebrow + "</p>" : "") +
      "<h1>" + (CFG.h1 || CFG.hotel || "AJWA Hotels") + "</h1>" +
      (CFG.tag ? '<p class="ajwa-band__tag">' + CFG.tag + "</p>" : "") +
      '<div class="ajwa-trust">' + ratingHtml + '<span class="ajwa-awards">' + awardsHtml + "</span></div>" +
      '<div class="ajwa-cta-row">' + ctaHtml + "</div>" +
      "</section>"
    );
    hero.insertAdjacentElement("afterend", band);
  }

  /* ---- D7: gateway destinasyon kartlarına CTA + erişilebilir ad ---- */
  function gatewayCards() {
    var cards = doc.querySelectorAll(".hotelBox");
    if (!cards.length) return;
    cards.forEach(function (card) {
      if (card.querySelector(".ajwa-card-cta")) return;
      var link = card.querySelector("a[href]");
      var name = (card.querySelector(".hotel-name") || {}).textContent || "";
      if (link) {
        var cta = el('<a class="ajwa-card-cta ajwa-enh-el" href="' + link.getAttribute("href") + '">' +
          (CFG.lang === "tr" ? "Keşfet →" : "Explore →") + "</a>");
        if (name) cta.setAttribute("aria-label", (CFG.lang === "tr" ? "Keşfet: " : "Explore: ") + name.trim());
        (card.querySelector(".hotel-name") ? card.querySelector(".hotel-name").parentNode : card).appendChild(cta);
      }
    });
  }

  /* ---- A8: dil değiştirici :443 temizliği + lang/aria-current ---- */
  function langLinks() {
    doc.querySelectorAll(".language-select-area a[href]").forEach(function (a) {
      a.href = a.getAttribute("href").replace(/:443(?=\/|$)/, "");
    });
  }

  /* ---- Toggle: öncesi/sonrası ---- */
  function toggle() {
    if (doc.querySelector(".ajwa-toggle")) return;
    var btn = el('<button class="ajwa-toggle" type="button" aria-pressed="true" title="Front-end iyileştirmelerini aç/kapat">' +
      '<span class="dot" aria-hidden="true"></span><span class="lbl"></span></button>');
    btn.addEventListener("click", function () {
      var on = doc.documentElement.classList.toggle("ajwa-enh");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    doc.body.appendChild(btn);
  }

  function init() {
    doc.documentElement.classList.add("ajwa-enh"); // varsayılan: AÇIK
    retrofitControls();
    landmarks();
    quickContact();
    band();
    gatewayCards();
    langLinks();
    toggle();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
