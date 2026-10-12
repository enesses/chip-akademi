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

## 2b. Modeller liderlik tablosu (AI Araçları → En iyi modeller)

```bash
node otomasyon/modeller.mjs
```

Veri **yalnızca** Artificial Analysis'in resmi ücretsiz API'sinden gelir
(`AA_API_KEY` ortam değişkeni). Sitenin kullanım şartları sayfanın
kopyalanmasını/kazınmasını yasaklıyor; bu yüzden
`artificialanalysis.ai/leaderboards/models` sayfasını WebFetch ya da başka bir
yolla okuyup tabloya **aktarma** — betik çalışmazsa tablo eski haliyle kalır.

Çıkış koduna göre rapora yaz:
- `0` → "Modeller: N model, ilk üç …" (betiğin cümlesi).
- `2` → "Modeller: yenilenmedi — API anahtarı (AA_API_KEY) tanımlı değil".
- `3` → "Modeller: **izin engeli** — artificialanalysis.ai bu ortamdan erişilemiyor".
  Başka komutla (curl, ayna, önbellek) deneme.
- `4`/`5` → "Modeller: API hatası — <betiğin mesajı>".

GitHub Actions kuruluysa (`otomasyon/workflows/modeller.yml`) aynı iş orada da
haftalık çalışır; bu adım o zaman yalnızca sonucu raporlar.

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
