# chip-akademi
Chip öğrenmek isteyen için tasarlanmış uygulama içinde atöyle kısmı bugün kısmı ve bir çok kısım var istersen cpu gpu istersen ai hızlandırıcı tasarlıyabiliyorsun hem eğlenceli hemde eğitici aynı uygulama 42 farklı web siteden 13 farklı apıdan veri topluyor hergün siber güvenlik, geliştirme ve kontrol taraması yapılıyor 5 farklı ajan var uygulamada

## Çalıştırma

```bash
npm ci
npm run build && python3 build-single.py   # tek dosyalık chip-akademi.html üretir
```

Yayın kopyası `docs/index.html`'dir (GitHub Pages → main / docs).

## Otomasyon

Her gün 10:00'da (İstanbul) fiyatlar ve "Bugün" sayfası yenilenir, güvenlik ve
iyileştirme taraması yapılır, uygulama gerçek bir tarayıcıda test edilir ve
geliştirme önerileri üretilir. Ayrıntı: [`otomasyon/README.md`](otomasyon/README.md),
günlük talimat: [`otomasyon/GUNLUK.md`](otomasyon/GUNLUK.md).
