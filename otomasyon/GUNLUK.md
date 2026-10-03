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
2. `npm ci` ve ardından `npm i --no-save playwright` (arayüz testi için; Chromium ortamda kurulu).
3. `otomasyon/gelen/` boş olmalı (önceki günden kalan dosya varsa sil).

## 1. Fiyatlar → `otomasyon/gelen/fiyatlar.json`

- WebFetch ile `https://getdeploying.com/gpus` sayfasını iste. İstem:
  *"Tablodaki HER satırı `["model", medyan_usd_veya_null, en_ucuz_usd_veya_null, saglayici]` biçiminde ver; satır atlama, yorum ekleme."*
- WebFetch uzun tablolarda satır düşürebiliyor. Gelen modelleri `src/data/gpu_kiralama.json` içindeki `fiyatlar[].model` listesiyle karşılaştır; eksik kalan **fiyatı olan** modeller için aynı sayfaya ikinci, hedefli bir WebFetch yap (yalnızca o modelleri sor).
- **Medyan** sütununu kullan (uygulamadaki fiyatlar medyandır). En ucuz sütununu medyan yerine koymak sahte "fiyat düştü" hareketi üretir.
- Dosya:
  ```json
  { "tarih": "YYYY-MM-DD", "kaynak_url": "https://getdeploying.com/gpus",
    "satirlar": [["Nvidia H100", 3.38, 1.30, 57], ...] }
  ```
- En az 30 satır yoksa dosyayı yazma; rapora "fiyat sayfası okunamadı" diye not düş.

## 2. Bugün → `otomasyon/gelen/bugun.json`

- Son 24–48 saatin AI / çip / yarı iletken / veri merkezi haberlerini WebSearch ile en az 3 farklı sorguyla ara (ör. "AI chip news <ay gün yıl>", "semiconductor week in review", "Nvidia AMD TSMC news <tarih>").
- Kullanacağın her haberi WebFetch ile aç ve yayın tarihini, rakamları doğrula. Tarihi eski olanı (ör. bir ay önceki borsa haberi) alma. robots.txt engelli siteyi atla.
- 8–12 madde. Her madde: `baslik`, `detay` (somut isim/rakam), `kategori` (`pozitif|notr|negatif`), `agirlik` (1–3 tam sayı), `neden` (neden bu kategori), `kaynak`, `url` (gerçek, açılan bağlantı).
- `ozet`: 3–4 paragraf, günün ana temasını bağlayan anlatı. `puan.etiket` ve `puan.yorum` yaz; `puan.deger` yazmana gerek yok — betik formülle hesaplar.
- Şema için mevcut `src/data/bugun.json` dosyasına bak. `tarih` bugünün tarihi, `derlenme` Türkçe uzun tarih ("3 Ekim 2026").
- Türkçe yaz. Uydurma yok: doğrulayamadığın haberi alma. Doğrulanmış 5 maddeye ulaşamazsan dosyayı yazma — eski içerik kalır, rapor bunu kırmızıyla gösterir.
- Kendi geliştiricin (Anthropic) hakkındaki bir haberi de diğerleri gibi tarafsız aktar.

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

`.gitignore` `node_modules`, `dist` ve kök `chip-akademi.html`'i dışarıda
bırakır; yayın kopyası `docs/index.html`'dir (GitHub Pages açıksa site
kendiliğinden güncellenir).

## 7. Kullanıcıya rapor

Son mesajı Türkçe, kısa yaz:
- Yenilenen veriler (fiyat: kaç model güncellendi, en çok artan/düşen; Bugün: puan ve günün teması).
- Bulunan hatalar ve ne yapıldığı (düzeltildi + PR bağlantısı / yalnızca raporlandı).
- Geliştirme önerileri (başlıklar).
- Güncel `chip-akademi.html` dosyasını gönder (`SendUserFile`; dosya kökte, derleme üretir).

Bir adım başarısız olursa sonraki adımlara devam et; neyin yapılamadığını
rapora açıkça yaz. Hiçbir adımı "tamam" diye raporlama eğer veri tarihi
gerçekten değişmediyse.
