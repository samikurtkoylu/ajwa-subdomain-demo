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

## Notlar

- Tüm analitik/izleme kodları (Google Tag Manager, gtag/Universal Analytics, Meta Pixel, event tracking) **söküldü**; yerlerine zararsız no-op stub'lar bırakıldı. Demo hiçbir yere veri göndermez.
- Tüm sayfalar `noindex, nofollow` işaretlidir ve her sayfada "TASLAK DEMO" rozeti bulunur — bu içerik arama motorlarına ve son kullanıcıya yönelik değildir.
- Statik anlık görüntü olduğu için sunucu tarafı işlevler (rezervasyon uygunluk sorgusu, bülten kaydı, form postback'leri) çalışmaz; rezervasyon butonları harici booking motorlarına yönlenir.
