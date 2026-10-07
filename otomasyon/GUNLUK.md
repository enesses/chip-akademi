# Günlük otomasyon — çalıştırma talimatı

Bu dosya, her sabah 10:00'da (İstanbul) çalışan Claude zamanlanmış görevinin
izlediği talimattır. Görevin istemi yalnızca "bu dosyayı oku ve uygula" der;
yapılacak işi değiştirmek için bu dosyayı düzenlemek yeterli.

Neden Claude: kapsayıcının kabuğu getdeploying.com'a ve haber sitelerine
ulaşamıyor, "Bugün" sayfası da yargı istiyor (hangi haber önemli, olumlu mu
olumsuz mu). Claude web araçlarıyla veriyi toplar ve `otomasyon/gelen/` altına
yazar; doğrulama, birleştirme, test ve derleme Node betiklerinde yapılır.
Betikler doğrulamayı geçmeyen veriyi yazmaz.

Tarih her yerde UTC günüdür (`new Date().toISOString().slice(0,10)`); 10:00
İstanbul = 07:00 UTC, yani aynı gün.

---

## 0. Hazırlık

1. `enesses/chip-akademi` deposunu **push** erişimiyle oturuma ekle (`add_repo`), tek seferde klonla, klasöre geç.
2. `npm ci` (arayüz testi için playwright geliştirme bağımlılığı olarak gelir; Chromium ortamda kurulu, `playwright install` çalıştırma).
3. `otomasyon/gelen/` boş olmalı (önceki günden kalan dosya varsa sil).

## 1. Fiyatlar → `otomasyon/gelen/fiyatlar.json`

- WebFetch ile `https://getdeploying.com/gpus` sayfasını iste. İstem:
  *"Tablodaki HER satırı `["model", medyan_usd_veya_null, en_ucuz_usd_veya_null, saglayici]` biçiminde ver; satır atlama, yorum ekleme."*
- WebFetch uzun tablolarda satır düşürebiliyor. Gelen modelleri `src/data/gpu_kiralama.json` içindeki `fiyatlar[].model` listesiyle karşılaştır; eksik kalan **fiyatı olan** modeller için aynı sayfaya ikinci, hedefli bir WebFetch yap (yalnızca o modelleri sor).
- WebFetch bir siteyi "izin / kaynak doğrulaması gerekiyor" (PROVENANCE) diye reddederse bunu rapora **açıkça "izin engeli"** olarak yaz ve o adımı atla; curl, ayna site ya da önbellek gibi başka yollar deneme. Fiyat verisi o gün güncellenmez, rapor kırmızı gösterir — bu doğru davranıştır.
- **Medyan** sütununu kullan (uygulamadaki fiyatlar medyandır). En ucuz sütununu medyan yerine koymak sahte "fiyat düştü" hareketi üretir.
- Kayıtlı fiyata göre **%50'den büyük** oynayan, en az 10 sağlayıcılı bir model varsa betik onu "şüpheli" sayıp yazmaz. Önce aynı sayfaya **hedefli ikinci bir WebFetch** yap: yalnızca o modelleri ve tablonun sütun başlıklarını iste. İki okuma aynı medyanı veriyorsa modeli girdiye ekle:
  `"dogrulanan": [{ "model": "Nvidia A4000", "not": "ikinci okuma: medyan 0.49, en düşük 0.08" }]`.
  Okumalar farklıysa ekleme; rapor şüpheliyi gösterir. Bu liste olmadan gerçek bir fiyat sıçraması her gün yeniden reddedilir.
- Dosya:
  ```json
  { "tarih": "YYYY-MM-DD", "kaynak_url": "https://getdeploying.com/gpus",
    "satirlar": [["Nvidia H100", 3.38, 1.30, 57], ...] }
  ```
- En az 30 satır yoksa dosyayı yazma; rapora "fiyat sayfası okunamadı" diye not düş.
- İsteğe bağlı: `https://getdeploying.com/gpu-price-index` sayfasından endeksin son ölçüm tarihini, 4 haftalık ve 12 aylık değişimini oku ve aynı dosyaya ekle:
  `"endeks": { "olcum_tarihi": "YYYY-MM-DD", "degisim_4_hafta_pct": -3.2, "degisim_12_ay_pct": 1.7 }`.
  Okuyamazsan alanı hiç yazma (eski endeks kalır, sayfada ölçüm tarihi görünür).

## 2. Bugün → `otomasyon/gelen/bugun.json`

- Son 24–48 saatin AI / çip / yarı iletken / veri merkezi haberlerini WebSearch ile en az 3 farklı sorguyla ara (ör. "AI chip news <ay gün yıl>", "semiconductor week in review", "Nvidia AMD TSMC news <tarih>").
- Kullanacağın her haberi WebFetch ile aç ve yayın tarihini, rakamları doğrula. Tarihi eski olanı (ör. bir ay önceki borsa haberi) alma. robots.txt engelli siteyi atla.
- 8–12 madde. Her madde: `baslik`, `detay` (somut isim/rakam), `kategori` (`pozitif|notr|negatif`), `agirlik` (1–3 tam sayı), `neden` (neden bu kategori), `kaynak`, `url` (gerçek, açılan bağlantı).
- `ozet`: 3–4 paragraf, günün ana temasını bağlayan anlatı. `puan.etiket` ve `puan.yorum` yaz; `puan.deger` yazmana gerek yok — betik formülle hesaplar.
- Şema için mevcut `src/data/bugun.json` dosyasına bak. `tarih` bugünün tarihi, `derlenme` Türkçe uzun tarih ("3 Ekim 2026").
- Türkçe yaz. Uydurma yok: doğrulayamadığın haberi alma. Doğrulanmış 5 maddeye ulaşamazsan dosyayı yazma — eski içerik kalır, rapor bunu kırmızıyla gösterir.
- Kendi geliştiricin (Anthropic) hakkındaki bir haberi de diğerleri gibi tarafsız aktar.

## 2b. Bellek fiyatları → `otomasyon/gelen/bellek.json` (yalnızca pazartesi, ya da yeni bir açıklama gördüysen)

- TrendForce basın merkezi (`trendforce.com/presscenter`) ve haberlerden DRAM / NAND / HBM **sözleşme fiyatı** tahminlerini ara.
- Şema `src/data/bellek_fiyat.json` ile aynı: `gostergeler[]` (`urun`, `donem`, `olcu`: `çeyreklik|yıllık`, `alt`, `ust` yüzde, `kaynak`, `tarih`, `url`), isteğe bağlı `yigin` ve `notlar`.
- Her rakamı açtığın kaynaktan doğrula; ikincil kaynaksa `kaynak` alanına bunu yaz ("X (TrendForce verisi)"). Yeni veri yoksa dosya yazma — iyileştirme ajanı 10 günü geçince hatırlatır.

## 3. Ajanları çalıştır

```bash
node otomasyon/orkestrator.mjs
```

Sıra: yenileme (gelen veriyi doğrular ve işler) → güvenlik → iyileştirme →
geliştirme (derleme + tek dosya + gerçek Chromium'da arayüz duman testi) →
rapor → son derleme (`docs/index.html` dahil).

Çıktıyı oku. Özellikle bak:
- `Yenileme` adımlarında ✗ ya da "Şüpheli fiyat" var mı?
- `Testler` içinde başarısız olan var mı? (`node otomasyon/ui-testi.mjs` tek başına da çalışır.)

## 4. Hata bulunduysa

- Derleme ya da arayüz testi kırıldıysa **kök nedeni bul** (gerçek Chromium ile; jsdom kullanma, modül betiklerini çalıştırmıyor).
- Düzeltme küçük ve netse: `otomasyon/duzeltme-YYYY-MM-DD` dalında düzelt, testleri tekrar koş, geçerse o dalı it ve ana dala **pull request** aç. Kod düzeltmesini doğrudan `main`'e yazma.
- Emin değilsen düzeltme; hatayı ve şüphelendiğin nedeni rapora yaz.

## 5. Geliştirme önerileri → `otomasyon/gelen/oneriler.json`

- Bugünkü `otomasyon/raporlar/*-<tarih>.json` dosyalarını, arayüz testini ve bugünkü haberleri oku.
- 3–7 somut öneri yaz. Her biri: `baslik`, `neden` (kodda/veride gördüğün kanıtla — dosya adı, sayı), `etki` (`yüksek|orta|düşük`), `alan`.
- Önerdiğin şeyin gerçekten eksik olduğunu kodda kontrol et (ör. "X özelliği yok" demeden önce ara).
- Dünkü önerilerden hâlâ geçerli olanı tekrar yazabilirsin; uygulanmış olanı yazma.
- Sonra öneriyi rapora işle:
  ```bash
  node otomasyon/veri-isle.mjs && node otomasyon/orkestrator.mjs rapor
  ```

## 6. Kaydet ve yayınla

```bash
git add -A
git commit -m "Günlük otomasyon: <tarih> — fiyatlar, Bugün, rapor"
git fetch origin main && git rebase origin/main
git push origin HEAD:main
```

`.gitignore` `node_modules`, `dist`, `artifact/` ve kök `chip-akademi.html`'i
dışarıda bırakır; yayın kopyası `docs/index.html`'dir (GitHub Pages açıksa site
kendiliğinden güncellenir).

## 6b. claude.ai yayınını güncelle

Kullanıcı uygulamayı claude.ai'daki kalıcı bağlantıdan açıyor; her sohbetten
erişilen tek güncel kopya budur. Adres:

    https://claude.ai/artifact/UAjf8W7P2C9KuwZjB5Fu34

Push'tan sonra (yayınlanan sürüm `main` ile aynı olsun):

1. `python3 otomasyon/artifact-hazirla.py` → `artifact/chip-akademi.html`
   (başlığı başa alır, iskelet etiketlerini kaldırır, kök dili Türkçe yapar;
   bunlar olmadan yayında Türkçe büyük harfler bozulur: "EKİM" → "EKIM").
2. `Artifact` aracıyla önce **oku**: `action: "read"`, `url` yukarıdaki adres.
   Yeni bir oturum okumadığı bir yayına yazamaz; okuma bunu açar.
3. Sonra **yayınla**: `file_path: "artifact/chip-akademi.html"`, `url` aynı
   adres. `icon` ve `capabilities` **verme** — ikisi de saklı değerle korunur
   (`downloads` yeteneği; verilirse üzerine yazılır). `url`'siz yayınlama
   **yeni** bir bağlantı açar; bunu yapma.
4. Sonuçtaki sürüm numarasını rapora yaz ("Yayın: sürüm N").

Artifact aracı yoksa ya da yayın reddedilirse adımı atla, nedenini rapora
**açıkça** yaz ("claude.ai yayını güncellenemedi: …") ve 7. adımdaki dosyayı
yine gönder. Uygulama o gün dünkü sürümüyle açılır.

## 7. Kullanıcıya rapor

Son mesajı Türkçe, kısa yaz:
- Yenilenen veriler (fiyat: kaç model güncellendi, en çok artan/düşen; Bugün: puan ve günün teması).
- Bulunan hatalar ve ne yapıldığı (düzeltildi + PR bağlantısı / yalnızca raporlandı).
- Geliştirme önerileri (başlıklar).
- claude.ai yayınının durumu: güncellendiyse sürüm numarası, güncellenemediyse nedeni.
- Güncel `chip-akademi.html` dosyasını gönder (`SendUserFile`; dosya kökte, derleme üretir).

Bir adım başarısız olursa sonraki adımlara devam et; neyin yapılamadığını
rapora açıkça yaz. Hiçbir adımı "tamam" diye raporlama eğer veri tarihi
gerçekten değişmediyse.
