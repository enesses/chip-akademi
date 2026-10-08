# Haftalık rapor — çalıştırma talimatı

Her Pazartesi sabahı çalışır. Geçen haftanın (Pazartesi–Pazar) ne getirdiğini
özetler: uygulamaya giren değişiklikler, otomasyonun kendi uyguladığı
öneriler, günlük çalıştırmaların durumu, fiyat hareketi, Bugün puanları.

Kurallar günlük görevle aynı: **uydurma veri yok** (rapor yalnızca depodaki
kayıtlardan hesaplanır; bir kayıt eksikse "—" kalır), izin engeli varsa rapor
"izin engeli" diye yazar, kod değişikliği yapılmaz.

## 1. Hazırlık

1. `enesses/chip-akademi` deposunu **push** erişimiyle ekle (`add_repo`), klonla, klasöre geç.
   Haftanın commit geçmişi gerekiyor; `--depth 1` klonladıysan betik eksik
   geçmişi kendisi çeker.
2. `npm ci`

## 2. Raporu üret

```bash
node otomasyon/haftalik.mjs            # geçen hafta
```

Çıktı: `src/data/haftalik.json` (uygulamadaki "Haftalık rapor" sayfası, son 12
hafta) ve `otomasyon/raporlar/haftalik-<YYYY-Www>.md`.

Ekrana basılan özet cümlelerini oku. Bir sayı tuhaf görünürse (ör. 0 çalışma
günü) kaynağını `otomasyon/raporlar/rapor-<gün>.json` dosyalarında kontrol et;
düzeltme yapma, gördüğünü rapora yaz.

## 3. Derle ve kaydet

```bash
node otomasyon/orkestrator.mjs rapor   # tek dosya + docs/index.html
git add -A
git commit -m "Haftalık rapor: <hafta>"
git fetch origin main && git rebase origin/main
git push origin HEAD:main
```

## 4. claude.ai yayınını güncelle

GUNLUK.md 6b ile aynı: `python3 otomasyon/artifact-hazirla.py`, sonra
`https://claude.ai/artifact/UAjf8W7P2C9KuwZjB5Fu34` adresini önce **oku**, sonra
aynı `url` ile **yayınla** (`icon`/`capabilities` verme). Yayın reddedilirse
bir kez yeniden oku ve tekrar dene; yine olmazsa nedenini rapora yaz.

## 5. Kullanıcıya gönder

`SendUserMessage` ile Türkçe, kısa:
- Haftanın özeti (betiğin yazdığı cümleler).
- Uygulamaya girenler: başlık + PR bağlantısı.
- Otomasyonun uyguladığı öneriler: birleşti / onay bekliyor (PR bağlantısı) / bırakıldı ve nedeni.
- İzin engeline takılan günler.
- claude.ai yayınının durumu.

Sonra `otomasyon/raporlar/haftalik-<hafta>.md` dosyasını `SendUserFile` ile gönder.
