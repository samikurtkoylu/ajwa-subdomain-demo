/* ============================================================
   AJWA Hotels — Front-End İyileştirme Katmanı (SHOWCASE) — JS
   Progressive enhancement + in-place dil değişimi (reload'suz, cross-fade)
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

  /* ---- A1 + B7: hero-altı marka & güven bandı (dil değişince yeniden kurulur) ---- */
  function band(cfg) {
    cfg = cfg || CFG;
    var old = doc.querySelector(".ajwa-band");
    var hero = doc.querySelector(".homepage-banner-wrapper, .homepage-banner");
    if (!hero) return;
    var awardsHtml = (cfg.awards || []).map(function (a) { return '<span class="ajwa-award">' + esc(a) + "</span>"; }).join("");
    var ratingHtml = cfg.rating
      ? '<span class="ajwa-rating"><span class="ajwa-stars" aria-hidden="true">★★★★★</span><b>' + esc(cfg.rating) + "</b>/5 " + esc(cfg.ratingLabel || "") + "<sup>örnek</sup></span>"
      : "";
    var h1inner = cfg.h1html ? cfg.h1html : esc(cfg.h1 || cfg.hotel || "AJWA Hotels");
    var h1class = cfg.h1html ? ' class="ajwa-artisan-h1"' : "";
    var node = el(
      '<section class="ajwa-band ajwa-enh-el" aria-label="' + esc(cfg.hotel || "AJWA") + '">' +
      (cfg.eyebrow ? '<p class="ajwa-band__eyebrow">' + esc(cfg.eyebrow) + "</p>" : "") +
      "<h1" + h1class + ">" + h1inner + "</h1>" +
      (cfg.tag ? '<p class="ajwa-band__tag">' + esc(cfg.tag) + "</p>" : "") +
      '<div class="ajwa-trust">' + ratingHtml + '<span class="ajwa-awards">' + awardsHtml + "</span></div>" +
      "</section>"
    );
    if (old) old.parentNode.replaceChild(node, old);
    else hero.insertAdjacentElement("afterend", node);
  }

  /* ---- Dil değiştirici: segmented EN|TR (kayan thumb) + in-place değişim ---- */
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
    if (curLang === "en" && !enHref) enHref = curFile;
    if (curLang === "tr" && !trHref) trHref = curFile;
    if (!enHref || !trHref) return;
    area.dataset.ajwaLang = "1";
    var enActive = curLang === "en";
    function seg(code, href, active) {
      return '<a href="' + href.replace(/:443(?=\/|$)/, "") + '"' + (active ? ' class="active" aria-current="true"' : "") +
        ' data-lang="' + (code === "EN" ? "en" : "tr") + '" lang="' + (code === "EN" ? "en" : "tr") + '">' + code + "</a>";
    }
    var wrap = el(
      '<div class="ajwa-langtoggle ajwa-enh-el" role="group" aria-label="Dil / Language" data-active="' + (enActive ? "0" : "1") + '">' +
      '<span class="ajwa-langtoggle__thumb" aria-hidden="true"></span>' +
      seg("EN", enHref, enActive) + seg("TR", trHref, !enActive) +
      "</div>"
    );
    wrap.querySelectorAll("a[data-lang]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // yeni sekme vб. bırak
        e.preventDefault();
        switchLang(a.getAttribute("data-lang"));
      });
    });
    links.forEach(function (a) { a.classList.add("ajwa-enh-hide-orig"); });
    area.appendChild(wrap);
  }
  function langToggle() {
    doc.querySelectorAll(".language-select-area").forEach(buildToggle);
    buildToggle(doc.getElementById("ucHeader_divHomeDisplayMenu"));
  }
  function updateToggles(lang) {
    doc.querySelectorAll(".ajwa-langtoggle").forEach(function (t) {
      t.setAttribute("data-active", lang === "en" ? "0" : "1");
      t.querySelectorAll("a[data-lang]").forEach(function (a) {
        var on = a.getAttribute("data-lang") === lang;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }

  /* ==================== in-place i18n motoru ==================== */
  var SKIP_I18N = ".ajwa-band,.ajwa-langtoggle,.ajwa-quick-contact,.ajwa-toggle,.ajwa-skip";
  var I18N = { nodes: [], cfgs: {}, title: {}, url: {}, built: false, building: null, cur: (CFG.lang === "tr" ? "tr" : "en") };

  function sigOf(node, stop) {
    var parts = [];
    while (node && node.nodeType === 1 && node !== stop) {
      var tag = node.tagName, i = 0, s = node;
      while ((s = s.previousElementSibling)) { if (s.tagName === tag) i++; }
      parts.push(tag + i); node = node.parentElement;
    }
    return parts.reverse().join(">");
  }
  function collectText(docCtx, rootBody) {
    var res = [], seen = {};
    var w = docCtx.createTreeWalker(rootBody, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var t = n.nodeValue.replace(/\s+/g, " ").trim(); if (!t) return 2;
        var p = n.parentElement; if (!p) return 2;
        var tag = p.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "noscript" || tag === "title") return 2;
        if (p.closest && p.closest(SKIP_I18N)) return 2;
        return 1;
      }
    });
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement, base = sigOf(p, rootBody);
      var idx = (seen[base] = (seen[base] || 0) + 1);
      res.push({ node: n, key: base + "|" + idx, text: n.nodeValue.replace(/\s+/g, " ").trim() });
    }
    return res;
  }
  function counterpartUrl() {
    var t = doc.querySelector('.ajwa-langtoggle a[data-lang="' + (I18N.cur === "en" ? "tr" : "en") + '"]');
    return t ? t.getAttribute("href") : null;
  }
  function buildI18n() {
    if (I18N.built) return Promise.resolve(true);
    if (I18N.building) return I18N.building;
    var otherUrl = counterpartUrl();
    if (!otherUrl) return Promise.resolve(false);
    var curUrl = location.pathname.split("/").pop() || "index.html";
    var other = I18N.cur === "en" ? "tr" : "en";
    // Hem MEVCUT dilin ham sayfasını hem KARŞI dilin ham sayfasını çek:
    // EN↔TR karşılığını ham-ham YAPISAL İMZA hizasından kur (doğru eşleştirme),
    // ama canlı DOM'a METNE göre uygula → slider gibi çalışma-anında taşınan
    // metinler nereye giderse gitsin yakalanır.
    I18N.building = Promise.all([
      fetch(curUrl).then(function (r) { return r.text(); }),
      fetch(otherUrl).then(function (r) { return r.text(); })
    ]).then(function (h) {
      var curHtml = h[0], otherHtml = h[1];
      var dCur = new DOMParser().parseFromString(curHtml, "text/html");
      var dOther = new DOMParser().parseFromString(otherHtml, "text/html");
      I18N.cfgs[I18N.cur] = CFG;
      var m = otherHtml.match(/window\.AJWA_ENH_CFG\s*=\s*(\{[\s\S]*?\})\s*;/);
      if (m) { try { I18N.cfgs[other] = JSON.parse(m[1]); } catch (e) { I18N.cfgs[other] = CFG; } }
      I18N.title[I18N.cur] = document.title;
      var t2 = dOther.querySelector("title"); if (t2) I18N.title[other] = t2.textContent;
      I18N.url[I18N.cur] = curUrl; I18N.url[other] = otherUrl;
      // 1) ham-ham imza hizası → doğru EN↔TR çiftleri
      var curBySig = {}, otherBySig = {};
      collectText(dCur, dCur.body).forEach(function (o) { if (!(o.key in curBySig)) curBySig[o.key] = o.text; });
      collectText(dOther, dOther.body).forEach(function (o) { if (!(o.key in otherBySig)) otherBySig[o.key] = o.text; });
      // 2) MEVCUT dil metni → çift  (canlıya metinle uygulamak için)
      var byText = {};
      Object.keys(curBySig).forEach(function (k) {
        if (k in otherBySig) {
          var ct = curBySig[k], ot = otherBySig[k];
          if (ct && ct.length >= 2 && ct !== ot && !(ct in byText)) {
            var pair = {}; pair[I18N.cur] = ct; pair[other] = ot; byText[ct] = pair;
          }
        }
      });
      // 3) canlı DOM'a metne göre uygula (imza değil → taşınan slider metni de yakalanır)
      collectText(document, doc.body).forEach(function (l) {
        var pair = byText[l.text];
        if (pair) {
          l.node.__i18n = pair;
          if (l.node.parentElement) l.node.parentElement.classList.add("ajwa-i18n-el");
          I18N.nodes.push(l.node);
        }
      });
      I18N.built = I18N.nodes.length >= 10;
      return I18N.built;
    }).catch(function () { return false; });
    return I18N.building;
  }
  function applyText(lang) {
    I18N.nodes.forEach(function (n) {
      var v = n.__i18n && n.__i18n[lang];
      if (v != null) {
        // orijinal boşlukları koru
        var raw = n.nodeValue, lead = (raw.match(/^\s*/) || [""])[0], tail = (raw.match(/\s*$/) || [""])[0];
        n.nodeValue = lead + v + tail;
      }
    });
  }
  function switchLang(target) {
    if (!target || target === I18N.cur) return;
    buildI18n().then(function (ok) {
      if (!ok) { var u = counterpartUrl(); if (u) location.href = u; return; }
      doc.documentElement.classList.add("ajwa-i18n-fade");
      setTimeout(function () {
        applyText(target);
        band(I18N.cfgs[target] || CFG);
        doc.documentElement.lang = target;
        if (I18N.title[target]) document.title = I18N.title[target];
        if (I18N.url[target]) { try { history.replaceState(null, "", I18N.url[target]); } catch (e) {} }
        updateToggles(target);
        I18N.cur = target;
        requestAnimationFrame(function () { doc.documentElement.classList.remove("ajwa-i18n-fade"); });
      }, 230);
    });
  }

  /* ---- Lenis smooth scroll ---- */
  var lenis = null, rafId = 0;
  function startLenis() {
    if (lenis || typeof window.Lenis === "undefined") return;
    try {
      lenis = new window.Lenis({ autoRaf: false, anchors: true, lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
      var raf = function (t) { if (lenis) { lenis.raf(t); rafId = requestAnimationFrame(raf); } };
      rafId = requestAnimationFrame(raf);
    } catch (e) {}
  }
  function stopLenis() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
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
    // dil haritasını arka planda önceden kur (ilk geçiş anında olsun)
    setTimeout(function () { buildI18n(); }, 1200);
    window.__ajwaLenisStop = stopLenis;
    window.__ajwaLenisStart = startLenis;
    window.__ajwaSwitchLang = switchLang;
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
