/* ============================================================
   AJWA Hotels — Front-End İyileştirme Katmanı (SHOWCASE) — JS
   Progressive enhancement: mevcut markup'ı bozmadan üstüne ekler.
   Per-sayfa yapılandırma: window.AJWA_ENH_CFG (injector yazar)
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
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---- B1: div/span kontrollerini erişilebilir yap ---- */
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
      var a = doc.createElement("span"); a.id = "ajwa-main"; a.setAttribute("tabindex", "-1");
      hero.parentNode.insertBefore(a, hero);
    }
  }

  /* ---- A10: header hızlı-iletişim ---- */
  function quickContact() {
    var rail = doc.querySelector(".right-fixed.js-right-fixed") || doc.querySelector(".right-fixed");
    if (!rail || !CFG.phone || doc.querySelector(".ajwa-quick-contact")) return;
    var box = el(
      '<div class="ajwa-quick-contact ajwa-enh-el">' +
      '<a href="tel:' + CFG.phone.replace(/[^\d+]/g, "") + '" aria-label="Telefonla ara: ' + esc(CFG.phone) + '">' + ICON.phone + "</a>" +
      '<a class="ajwa-wa" href="https://wa.me/' + CFG.phone.replace(/[^\d]/g, "") + '" target="_blank" rel="noopener" aria-label="WhatsApp ile yaz">' + ICON.wa + "</a>" +
      "</div>"
    );
    rail.appendChild(box);
  }

  /* ---- A1 + B7: hero-altı marka & güven bandı ---- */
  function band() {
    if (doc.querySelector(".ajwa-band")) return;
    var hero = doc.querySelector(".homepage-banner-wrapper, .homepage-banner");
    if (!hero) return;
    var telHref = CFG.phone ? "tel:" + CFG.phone.replace(/[^\d+]/g, "") : null;
    var waHref = CFG.phone ? "https://wa.me/" + CFG.phone.replace(/[^\d]/g, "") : null;

    var awardsHtml = (CFG.awards || []).map(function (a) { return '<span class="ajwa-award">' + esc(a) + "</span>"; }).join("");
    var ratingHtml = CFG.rating
      ? '<span class="ajwa-rating"><span class="ajwa-stars" aria-hidden="true">★★★★★</span><b>' + esc(CFG.rating) + "</b>/5 " + esc(CFG.ratingLabel || "") + "<sup>örnek</sup></span>"
      : "";
    var h1inner = CFG.h1html ? CFG.h1html : esc(CFG.h1 || CFG.hotel || "AJWA Hotels");
    var h1class = CFG.h1html ? ' class="ajwa-artisan-h1"' : "";

    var ctaHtml =
      '<a class="ajwa-btn ajwa-btn--gold" href="#" role="button" onclick="var b=document.getElementById(\'ucHeader_divBookButton\');if(b){b.click();return false;}">' + ICON.cal + (CFG.lang === "tr" ? "Rezervasyon Yap" : "Book Your Stay") + "</a>" +
      (telHref ? '<a class="ajwa-btn ajwa-btn--primary" href="' + telHref + '">' + ICON.phone + (CFG.lang === "tr" ? "Ara" : "Call") + "</a>" : "") +
      (waHref ? '<a class="ajwa-btn ajwa-btn--ghost" href="' + waHref + '" target="_blank" rel="noopener">' + ICON.wa + "WhatsApp</a>" : "");

    var band = el(
      '<section class="ajwa-band ajwa-enh-el" aria-label="' + esc(CFG.hotel || "AJWA") + '">' +
      (CFG.eyebrow ? '<p class="ajwa-band__eyebrow">' + esc(CFG.eyebrow) + "</p>" : "") +
      "<h1" + h1class + ">" + h1inner + "</h1>" +
      (CFG.tag ? '<p class="ajwa-band__tag">' + esc(CFG.tag) + "</p>" : "") +
      '<div class="ajwa-trust">' + ratingHtml + '<span class="ajwa-awards">' + awardsHtml + "</span></div>" +
      '<div class="ajwa-cta-row">' + ctaHtml + "</div>" +
      "</section>"
    );
    hero.insertAdjacentElement("afterend", band);
  }

  /* ---- Dil değiştirici: segmented EN|TR (21st.dev tarzı, kayan thumb) ----
     İki yeri de kapsar:
       .language-select-area  (hamburger menü içinde, iki link EN+TR)
       #ucHeader_divHomeDisplayMenu.defaultMenu (gateway sağ üst, görünür, tek "diğer dil" linki) */
  function isLangLink(a) {
    var t = (a.textContent || "").toUpperCase().trim(), h = a.getAttribute("href") || "";
    return /ENGLISH|T[UÜ]RK[CÇ]E|^EN$|^TR$/.test(t) || /(index|anasayfa|ajwa-homes|ajwa-evleri)\.html/i.test(h);
  }
  function buildToggle(area) {
    if (!area || area.dataset.ajwaLang) return;
    var links = Array.prototype.slice.call(area.querySelectorAll("a[href]")).filter(isLangLink);
    if (!links.length) return;
    var curLang = CFG.lang === "tr" ? "tr" : "en";
    var curFile = (location.pathname.split("/").pop() || "index.html");
    var enHref = null, trHref = null;
    links.forEach(function (a) {
      var t = (a.textContent || "").toUpperCase(), h = a.getAttribute("href") || "";
      if (t.indexOf("ENGLISH") > -1 || t.trim() === "EN" || /(index|ajwa-homes)\.html/i.test(h)) enHref = h;
      else if (t.indexOf("TÜRK") > -1 || t.indexOf("TURK") > -1 || t.trim() === "TR" || /(anasayfa|ajwa-evleri)\.html/i.test(h)) trHref = h;
    });
    // eksik olan (mevcut dil) linkini kendi sayfasıyla tamamla
    if (curLang === "en" && !enHref) enHref = curFile;
    if (curLang === "tr" && !trHref) trHref = curFile;
    if (!enHref || !trHref) return;
    area.dataset.ajwaLang = "1";
    var enActive = curLang === "en";
    function seg(code, href, active) {
      return '<a href="' + href.replace(/:443(?=\/|$)/, "") + '"' + (active ? ' class="active" aria-current="true"' : "") +
        ' lang="' + (code === "EN" ? "en" : "tr") + '">' + code + "</a>";
    }
    var wrap = el(
      '<div class="ajwa-langtoggle ajwa-enh-el" role="group" aria-label="Dil / Language" data-active="' + (enActive ? "0" : "1") + '">' +
      '<span class="ajwa-langtoggle__thumb" aria-hidden="true"></span>' +
      seg("EN", enHref, enActive) + seg("TR", trHref, !enActive) +
      "</div>"
    );
    links.forEach(function (a) { a.classList.add("ajwa-enh-hide-orig"); });
    area.appendChild(wrap);
  }
  function langToggle() {
    doc.querySelectorAll(".language-select-area").forEach(buildToggle);
    buildToggle(doc.getElementById("ucHeader_divHomeDisplayMenu"));
  }

  /* ---- Lenis smooth scroll (vendor: assets/lenis.min.js) ---- */
  var lenis = null, rafId = 0;
  function startLenis() {
    if (lenis || typeof window.Lenis === "undefined") return;
    try {
      lenis = new window.Lenis({ autoRaf: false, anchors: true, lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
      var raf = function (t) { if (lenis) { lenis.raf(t); rafId = requestAnimationFrame(raf); } };
      rafId = requestAnimationFrame(raf);
    } catch (e) { /* Lenis yoksa sessizce geç */ }
  }
  function stopLenis() {
    if (rafId) cancelAnimationFrame(rafId), rafId = 0;
    if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; }
  }

  /* ---- Toggle: öncesi/sonrası ---- */
  function toggle() {
    if (doc.querySelector(".ajwa-toggle")) return;
    var btn = el('<button class="ajwa-toggle" type="button" aria-pressed="true" title="Front-end iyileştirmelerini aç/kapat"><span class="dot" aria-hidden="true"></span><span class="lbl"></span></button>');
    btn.addEventListener("click", function () {
      var on = doc.documentElement.classList.toggle("ajwa-enh");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) startLenis(); else stopLenis();
    });
    doc.body.appendChild(btn);
  }

  function init() {
    doc.documentElement.classList.add("ajwa-enh");
    retrofitControls();
    landmarks();
    quickContact();
    band();
    langToggle();
    toggle();
    startLenis();
    window.__ajwaLenisStop = stopLenis;   // test/debug kolu (üretimde zararsız)
    window.__ajwaLenisStart = startLenis;
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
