# Ajwa Subdomain Ayrıştırma — TASLAK DEMO

Bu repo, Ajwa Hotels web sitesinin subdomain'lere ayrıştırılması projesinin **taslak demosudur**.
Gerçek ve güncel site: **https://www.ajwa.com.tr**

## Klasör yapısı → hedef subdomain eşlemesi

| Klasör | Temsil ettiği hedef |
|---|---|
| `/` (kök) | Gateway / marka giriş sayfası (www.ajwa.com.tr) |
| `/sultanahmet/` | sultanahmet.ajwa.com.tr — Ajwa Sultanahmet (Ajwa Homes sayfaları dahil) |
| `/cappadocia/` | cappadocia.ajwa.com.tr — Ajwa Cappadocia |

Her bölümde `index.html` İngilizce, `anasayfa.html` Türkçe sürümdür; dil değiştiriciler karşılıklı bağlıdır.

## Front-end iyileştirme vitrini (SHOWCASE)

Bu demoda, kapsamlı site değerlendirmesinden çıkan front-end aksiyonlarının bir kısmı **canlı olarak uygulanmıştır** (paylaşılan `assets/ajwa-enhance.css` + `assets/ajwa-enhance.js` katmanı, `_inject.py` ile tüm sayfalara enjekte edilir):

- **A1** Her sayfaya benzersiz tek `<h1>` (hero-altı marka bandı içinde)
- **B7** Fold-üstü sosyal kanıt: yıldız puanı (örnek) + ödül rozetleri (Michelin / Preferred / Amex FHR)
- **A10** Tıklanabilir `tel:` + WhatsApp (`wa.me`) — header rayında ve bantta
- **C4** Gerçek-bold, belirgin CTA'lar (BOOK YOUR STAY / CALL / WHATSAPP)
- **B1** Birincil kontroller (BOOK NOW, hamburger, kapat) klavye+ekran-okuyucu erişilebilir (`role=button`, `tabindex`, `aria-label`, Enter/Space)
- **A6** Klavye odak göstergesi (`:focus-visible`) geri getirildi
- **A7** Kontrast düzeltmeleri · **B3** skip-link · **D7** gateway kartlarına CTA · **A8** dil linki `:443` temizliği

**Öncesi/sonrası:** Sol alttaki **"İyileştirmeler: AÇIK/KAPALI"** düğmesiyle tüm bu katman tek tıkla açılıp kapatılır — mevcut hâl ile iyileştirilmiş hâl anında karşılaştırılabilir. (Üretimde bu değişiklikler paylaşılan WebForms şablonuna taşınacaktır; burada progressive-enhancement olarak gösterilir.)

## Notlar

- Tüm analitik/izleme kodları (Google Tag Manager, gtag/Universal Analytics, Meta Pixel, event tracking) **söküldü**; yerlerine zararsız no-op stub'lar bırakıldı. Demo hiçbir yere veri göndermez.
- Tüm sayfalar `noindex, nofollow` işaretlidir ve her sayfada "TASLAK DEMO" rozeti bulunur — bu içerik arama motorlarına ve son kullanıcıya yönelik değildir.
- Statik anlık görüntü olduğu için sunucu tarafı işlevler (rezervasyon uygunluk sorgusu, bülten kaydı, form postback'leri) çalışmaz; rezervasyon butonları harici booking motorlarına yönlenir.
