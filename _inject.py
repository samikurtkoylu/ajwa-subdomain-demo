# -*- coding: utf-8 -*-
import json, re, os

ROOT = os.path.dirname(os.path.abspath(__file__))

# assets yolu: kök sayfalar "assets/", alt klasör sayfaları "../assets/"
def rel(page):
    return "../assets/" if "/" in page else "assets/"

MICHELIN = "Michelin Guide"
PREFERRED = "Preferred Hotels"
FHR = "Amex Fine Hotels"

PAGES = {
    # gateway (grup) — artizan istifli H1 (h1html)
    "index.html": dict(lang="en", hotel="AJWA Hotels", phone="+90 212 638 22 00",
        eyebrow="Artisanal Luxury · Istanbul & Cappadocia",
        h1="Artisanal Luxury Hotels in Istanbul & Cappadocia",
        h1html='<span class="l1">Artisanal Luxury Hotels</span><span class="l2">in</span><span class="l3">Istanbul &amp; Cappadocia</span>',
        tag="Two extraordinary landscapes, one signature of elegance: AJWA.",
        rating="4.8", ratingLabel="guest rating", awards=[MICHELIN, PREFERRED, FHR]),
    "anasayfa.html": dict(lang="tr", hotel="AJWA Otelleri", phone="+90 212 638 22 00",
        eyebrow="Sanatsal Lüks · İstanbul & Kapadokya",
        h1="İstanbul ve Kapadokya'da Sanatsal Lüks Oteller",
        h1html='<span class="l1">Sanatsal Lüks Oteller</span><span class="l2">·</span><span class="l3">İstanbul &amp; Kapadokya</span>',
        tag="İki benzersiz coğrafya, tek bir zarafet imzası: AJWA.",
        rating="4.8", ratingLabel="misafir puanı", awards=[MICHELIN, PREFERRED, FHR]),

    # sultanahmet
    "sultanahmet/index.html": dict(lang="en", hotel="AJWA Sultanahmet", phone="+90 212 638 22 00",
        eyebrow="Artisanal Luxury · Historic Istanbul",
        h1="AJWA Sultanahmet — A Luxury Hotel in Historic Istanbul",
        h1html='<span class="l1">AJWA Sultanahmet</span><span class="l3">A Luxury Hotel in Historic Istanbul</span>',
        tag="In the heart of Istanbul's old city, steps from Hagia Sophia and the Blue Mosque.",
        rating="4.8", ratingLabel="guest rating", awards=[MICHELIN, PREFERRED, FHR]),
    "sultanahmet/anasayfa.html": dict(lang="tr", hotel="AJWA Sultanahmet", phone="+90 212 638 22 00",
        eyebrow="Sanatsal Lüks · Tarihi İstanbul",
        h1="AJWA Sultanahmet — Tarihi İstanbul'da Lüks Otel",
        h1html="<span class='l1'>AJWA Sultanahmet</span><span class='l3'>Tarihi İstanbul'da Lüks Otel</span>",
        tag="İstanbul'un tarihi yarımadasının kalbinde, Ayasofya ve Sultanahmet Camii'ne birkaç adım.",
        rating="4.8", ratingLabel="misafir puanı", awards=[MICHELIN, PREFERRED, FHR]),

    # homes (sultanahmet altında)
    "sultanahmet/ajwa-homes.html": dict(lang="en", hotel="AJWA Homes", phone="+90 212 638 22 00",
        eyebrow="Serviced Luxury Residences · Istanbul",
        h1="AJWA Homes — Serviced Luxury Residences in Istanbul",
        tag="Spacious residences with the service of AJWA Sultanahmet, ideal for longer and family stays.",
        rating="4.8", ratingLabel="guest rating", awards=[PREFERRED, FHR]),
    "sultanahmet/ajwa-evleri.html": dict(lang="tr", hotel="AJWA Homes", phone="+90 212 638 22 00",
        eyebrow="Lüks Servisli Rezidanslar · İstanbul",
        h1="AJWA Homes — İstanbul'da Lüks Servisli Rezidanslar",
        tag="AJWA Sultanahmet hizmetiyle geniş rezidanslar; uzun ve aile konaklamaları için ideal.",
        rating="4.8", ratingLabel="misafir puanı", awards=[PREFERRED, FHR]),

    # cappadocia
    "cappadocia/index.html": dict(lang="en", hotel="AJWA Cappadocia", phone="+90 384 352 12 12",
        eyebrow="Cave Suites & Luxury · Cappadocia",
        h1="AJWA Cappadocia — Cave Suites & Luxury in the Heart of Cappadocia",
        tag="Hand-carved cave suites and panoramic terraces above the fairy chimneys of Cappadocia.",
        rating="4.8", ratingLabel="guest rating", awards=[PREFERRED, FHR]),
    "cappadocia/anasayfa.html": dict(lang="tr", hotel="AJWA Cappadocia", phone="+90 384 352 12 12",
        eyebrow="Mağara Suitler & Lüks · Kapadokya",
        h1="AJWA Cappadocia — Kapadokya'nın Kalbinde Mağara Suitler & Lüks",
        tag="El oyması mağara suitler ve peribacalarına bakan panoramik teraslar.",
        rating="4.8", ratingLabel="misafir puanı", awards=[PREFERRED, FHR]),
}

LENIS_CSS = '<link rel="stylesheet" href="{r}lenis.css">'
LENIS_JS  = '<script defer src="{r}lenis.min.js"></script>'
CSS_TAG = '<link rel="stylesheet" href="{r}ajwa-enhance.css">'
CFG_TAG = '<script>window.AJWA_ENH_CFG={cfg};</script>'
JS_TAG  = '<script defer src="{r}ajwa-enhance.js"></script>'
MARKER = "ajwa-enhance.css"

def inject(page, cfg):
    path = os.path.join(ROOT, page)
    if not os.path.exists(path):
        print("YOK:", page); return False
    html = open(path, encoding="utf-8", errors="replace").read()
    # idempotent: önce eski enjeksiyonu temizle
    html = re.sub(r'<link[^>]*lenis\.css[^>]*>', '', html)
    html = re.sub(r'<script[^>]*lenis\.min\.js[^>]*></script>', '', html)
    html = re.sub(r'<link[^>]*ajwa-enhance\.css[^>]*>', '', html)
    html = re.sub(r'<script>window\.AJWA_ENH_CFG=.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<script[^>]*ajwa-enhance\.js[^>]*></script>', '', html)
    r = rel(page)
    block = ("\n" + LENIS_CSS.format(r=r) +
             "\n" + CSS_TAG.format(r=r) +
             "\n" + CFG_TAG.format(cfg=json.dumps(cfg, ensure_ascii=False)) +
             "\n" + LENIS_JS.format(r=r) +
             "\n" + JS_TAG.format(r=r) + "\n")
    if "</head>" in html:
        html = html.replace("</head>", block + "</head>", 1)
    else:
        html = block + html
    open(path, "w", encoding="utf-8").write(html)
    return True

n = 0
for page, cfg in PAGES.items():
    if inject(page, cfg):
        n += 1
        print("OK:", page, "->", cfg["hotel"], "(", cfg["lang"], ")")
print(f"\n{n}/{len(PAGES)} sayfaya enjekte edildi.")
