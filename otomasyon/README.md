# Chip Akademi — Otomasyon

Beş ajan, günlük çalışır. Her biri sonucunu `otomasyon/raporlar/` altına JSON
olarak yazar; 5. ajan hepsini toplayıp tek bir özet üretir.

## Nasıl çalışıyor

Her gün **10:00'da (İstanbul)** bir Claude zamanlanmış görevi bu depoyu açar ve
[`GUNLUK.md`](GUNLUK.md) talimatını uygular:

1. getdeploying.com'dan güncel GPU kiralama fiyatlarını, web'den günün AI/çip
   haberlerini toplar → `otomasyon/gelen/` altına yazar.
2. `node otomasyon/orkestrator.mjs` — ajanlar veriyi doğrulayıp işler, güvenlik
   ve iyileştirme taraması yapar, uygulamayı derler ve **gerçek Chromium'da**
   tüm sayfaları + ana akışları test eder.
3. Geliştirme önerilerini yazar, raporu üretir, `docs/index.html`'i günceller.
4. Veri ve raporları `main`'e iter; kod düzeltmesi gerekiyorsa ayrı dalda PR açar.

Neden Claude: bu ortamın kabuğu fiyat ve haber sitelerine ulaşamıyor, "Bugün"
sayfası da yargı gerektiriyor. Toplama Claude'da, doğrulama/test betiklerde.
Betikler doğrulamayı geçmeyen veriyi yazmaz (ör. çok sağlayıcılı bir modelde
tek seferde %50'den büyük fiyat oynaması "şüpheli" diye işaretlenir, yazılmaz).

Elle de çalıştırılabilir: `otomasyon/gelen/` altına aynı şemada dosya koyan her
şey (kendi botun, GitHub Actions) aynı yoldan işlenir.

## Çalıştırma

```bash
node otomasyon/orkestrator.mjs              # hepsi, sırayla
node otomasyon/orkestrator.mjs guvenlik     # tek ajan
node otomasyon/orkestrator.mjs --kuru       # deneme: dosya yazmaz
node otomasyon/veri-isle.mjs                # yalnızca gelen/ altındaki veriyi işle
node otomasyon/ui-testi.mjs                 # yalnızca arayüz duman testi
```

## Ajanlar

Hepsi her gün 10:00'da, şu sırayla çalışır:

| # | Ajan | Ne yapar |
|---|------|----------|
| 3 | Yenileme | `gelen/` altındaki fiyat ve "Bugün" verisini doğrular, uygular; tarih değişmediyse kırmızı raporlar |
| 1 | Güvenlik | Bağımlılık açıkları, riskli kod desenleri, yayın dosyası bütünlüğü |
| 2 | İyileştirme | Veri tazeliği, katalog bağlantıları, erişilebilirlik, kullanılmayan kod |
| 4 | Geliştirme | Otomatik düzeltilebilenleri uygular; derleme + gerçek Chromium arayüz testi; kırılırsa geri alır |
| 5 | Rapor | Hepsini + Claude'un geliştirme önerilerini özetler; uygulamadaki Otomasyon sayfasına yazar |

## Dürüst sınırlar

**1. ajan klasik anlamda "saldırı tespiti" yapmaz.** Uygulama sunucusuz statik
bir HTML — veritabanı, oturum, API ucu yok, dolayısıyla izlenecek bir saldırı
yüzeyi de yok. Ajan bunun yerine gerçekten ölçülebilir dört şeye bakar:
bağımlılık açıkları, yayındaki dosyanın beklenen dosyayla aynı olup olmadığı
(kurcalama tespiti), riskli kod desenleri ve HTTP güvenlik başlıkları.
Gerçek trafik izleme istiyorsan uygulamanın bir sunucu arkasına alınması gerekir.

**"Bugün" sayfası yargı gerektirir.** Günlük görevde bu yargıyı Claude verir;
her madde kaynak bağlantısıyla yazılır, puan formülle hesaplanır. Görev dışında
elle çalıştırıldığında: Haber özetlemek ve
pozitif/negatif sınıflandırmak otomatikleştirilebilir bir şey değil.
`ANTHROPIC_API_KEY` tanımlıysa ajan modele sorar ve dönen veriyi doğrular
(her maddenin kaynak URL'si var mı, puan formülle tutuyor mu). Anahtar yoksa
**eski içeriği korur ve insan onayı bekler** — uydurma içerik üretmez.
Eski tarihli bir "Bugün" sayfası, yanlış bir "Bugün" sayfasından iyidir.

**4. ajan ana dala yazmaz.** Sadece `otomatik: true` işaretli bulguları uygular,
sonra tam test zincirini koşar. Testler kırılırsa değişiklikleri geri alır.
GitHub Actions üzerinde çalışırken sonucu ayrı bir dala iter; birleştirme kararı
her zaman insana aittir.

## Ortam değişkenleri

| Değişken | Zorunlu | Ne işe yarar |
|----------|---------|--------------|
| `HABER_SAGLAYICI` | hayır | Haber kaynağı: `newsapi`, `newsdata`, `gnews`, `thenewsapi`, `marketaux` |
| `HABER_API_ANAHTARI` | hayır | Seçilen haber servisinin anahtarı |
| `ANTHROPIC_API_KEY` | hayır | Başlıkları özetleyip pozitif/negatif sınıflandırmak için |
| `YAYIN_URL` | hayır | 1. ajanın yayındaki dosyayı indirip bütünlük ve başlık kontrolü yapması için |

### Anahtarları nereye koymalı

**Asla koda ya da sohbete yazma.** Kabuk profiline (`~/.zshrc`, `~/.bashrc`):

```bash
export HABER_SAGLAYICI="newsapi"
export HABER_API_ANAHTARI="..."
export ANTHROPIC_API_KEY="..."
```

GitHub Actions kullanıyorsan: depo → Settings → Secrets and variables → Actions →
**New repository secret**. Workflow bunları otomatik okur.

### "Bugün" sayfası üç aşamalı çalışır

| Durum | Ne olur |
|-------|---------|
| Haber anahtarı yok | Sayfa dokunulmadan kalır, ajan raporlar |
| Haber anahtarı var, Claude anahtarı yok | Başlıklar `src/data/bugun.taslak.json` dosyasına yazılır; sayfa **yayına çıkmaz**, insan onayı bekler |
| İkisi de var | Başlıklar özetlenir, sınıflandırılır, puan formülle doğrulanır ve sayfa güncellenir |

Ortadaki aşama bilinçli: hangi haberin olumlu hangisinin olumsuz olduğuna karar
vermek yargı gerektirir. Yanlış bir "Bugün" sayfası, eski bir "Bugün" sayfasından
daha kötüdür.
