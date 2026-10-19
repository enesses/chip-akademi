# Haftalık rapor — 12 Ekim – 18 Ekim (2026-W42)

- Otomasyon 7 günlük dönemde 4 gün çalıştı: 1 gün temiz bitti.
- Uygulamaya 12 değişiklik girdi; bunların 9 tanesi otomasyonun kendi uyguladığı geliştirme önerisi.
- Hafta boyunca 19 farklı geliştirme önerisi yazıldı; otomasyon 14 tanesini denedi (9 birleşti, 5 onay bekliyor, 0 bırakıldı).
- H100 kiralama medyanı 3.5 → 3.5 $/saat (%0).
- Fiyat sayfası 1 gün izin engeline takıldı; o günlerde fiyat uydurulmadı, eski veri korundu.
- Bugün sayfasının ortalama pozitiflik puanı 49/100.

## Bu hafta uygulamaya girenler

- 12 Ekim: Gerçek hesap sistemi: Firebase ile giriş/kayıt, girişimci onayı, admin ([#27](https://github.com/enesses/chip-akademi/pull/27))
- 12 Ekim: AI Araçları: En iyi modeller liderlik tablosu (haftalık, Artificial Analysis API) ([#26](https://github.com/enesses/chip-akademi/pull/26))
- 12 Ekim: Onay düğmesi: bekleyen öneriler sayfadan tek tıkla onaylanır ([#25](https://github.com/enesses/chip-akademi/pull/25))
- 12 Ekim: Öneri: Hareket kartlarında kuruş düzeyindeki yuvarlama gürültüsünü ele ([#17](https://github.com/enesses/chip-akademi/pull/17))
- 12 Ekim: Öneri: Fiyat tablosuna 'en az 5 sağlayıcı' filtresi ([#16](https://github.com/enesses/chip-akademi/pull/16))
- 12 Ekim: Öneri: Ana sayfaya Haberler akışından son 3 haberi gösteren kart ([#24](https://github.com/enesses/chip-akademi/pull/24))
- 12 Ekim: Öneri: Fiyat sayfasında endeksin 12 aylık değişimini de göster ([#23](https://github.com/enesses/chip-akademi/pull/23))
- 12 Ekim: Öneri: Ana sayfa hareket satırında önceki → yeni fiyatı göster ([#22](https://github.com/enesses/chip-akademi/pull/22))
- 12 Ekim: Öneri: Ana sayfa kiralama kartında yalnızca en az 5 sağlayıcılı hareketi göster ([#21](https://github.com/enesses/chip-akademi/pull/21))
- 12 Ekim: Geliştirme ajanı: reddedilmiş girdi için yenilemeyi yeniden çalıştırma ([#20](https://github.com/enesses/chip-akademi/pull/20))
- 12 Ekim: Öneri: Kalan kullanılmayan export'ları temizle ([#18](https://github.com/enesses/chip-akademi/pull/18))
- 12 Ekim: Öneri: Fiyat hareketi kartlarında sağlayıcı sayısını göster ([#15](https://github.com/enesses/chip-akademi/pull/15))

## Uygulanan öneriler

- 12 Ekim · **birleşti** · Fiyat sayfasında endeksin 12 aylık değişimini de göster ([#23](https://github.com/enesses/chip-akademi/pull/23)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Ana sayfaya Haberler akışından son 3 haberi gösteren kart ([#24](https://github.com/enesses/chip-akademi/pull/24)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Fiyat hareketi kartlarında sağlayıcı sayısını göster ([#15](https://github.com/enesses/chip-akademi/pull/15)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Fiyat tablosuna 'en az 5 sağlayıcı' filtresi ([#16](https://github.com/enesses/chip-akademi/pull/16)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Hareket kartlarında kuruş düzeyindeki yuvarlama gürültüsünü ele ([#17](https://github.com/enesses/chip-akademi/pull/17)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Kalan 20 kullanılmayan export'u temizle ([#18](https://github.com/enesses/chip-akademi/pull/18)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Geliştirme ajanı reddedilmiş girdi yüzünden yenilemeyi yeniden çalıştırıp günün raporunu ezmesin ([#20](https://github.com/enesses/chip-akademi/pull/20)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Ana sayfa kiralama kartında yalnızca en az 5 sağlayıcılı hareketi göster ([#21](https://github.com/enesses/chip-akademi/pull/21)) — Kullanıcı onayıyla birleştirildi
- 12 Ekim · **birleşti** · Ana sayfa hareket satırında önceki → yeni fiyatı göster ([#22](https://github.com/enesses/chip-akademi/pull/22)) — Kullanıcı onayıyla birleştirildi
- 13 Ekim · **onay bekliyor** · Notlar sayfasına sabitleme (pin) düğmesi ([#29](https://github.com/enesses/chip-akademi/pull/29)) — Denetim: derleme, tek dosya, arayüz 32/32 geçti; güvenlik taraması main'deki firebase/grpc-js açıkları yüzünden 'dikkat', onay bekliyor
- 13 Ekim · **onay bekliyor** · Seviye sınavında önceki sonuçları göster ([#30](https://github.com/enesses/chip-akademi/pull/30)) — Denetim: derleme, tek dosya, arayüz 32/32 geçti; güvenlik taraması main'deki firebase/grpc-js açıkları yüzünden 'dikkat', onay bekliyor
- 14 Ekim · **onay bekliyor** · @grpc/grpc-js'i npm overrides ile ≥1.13.6'ya yükselt ([#31](https://github.com/enesses/chip-akademi/pull/31)) — Korunan dosya (package.json, package-lock.json); testler 32/32 geçti, kullanıcı onayı gerekiyor
- 14 Ekim · **onay bekliyor** · Eğitim sayfasına 'ilerlemeyi sıfırla' düğmesi ([#32](https://github.com/enesses/chip-akademi/pull/32)) — Denetim: derleme, tek dosya, arayüz 32/32 geçti; güvenlik taraması main'deki @grpc/grpc-js açığı yüzünden 'dikkat' (düzeltme PR #31), onay bekliyor
- 14 Ekim · **onay bekliyor** · Çip detayında kiralama fiyatının son değişimini göster ([#33](https://github.com/enesses/chip-akademi/pull/33)) — Denetim: derleme, tek dosya, arayüz 32/32 geçti; güvenlik taraması main'deki @grpc/grpc-js açığı yüzünden 'dikkat' (düzeltme PR #31), onay bekliyor

## Günler

| Gün | Durum | Fiyat | Bugün puanı |
|---|---|---|---|
| 12 Ekim | temiz | güncellendi | 46 |
| 13 Ekim | dikkat | güncellendi | 41 |
| 14 Ekim | dikkat | güncellendi | 63 |
| 15 Ekim | calismadi | — | — |
| 16 Ekim | calismadi | — | — |
| 17 Ekim | calismadi | — | — |
| 18 Ekim | dikkat | izin engeli | 44 |
