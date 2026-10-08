---
name: cip-karsilastirma
description: İşlemci, ekran kartı, yapay zekâ hızlandırıcısı ya da bellek çiplerini kaynaklı tabloyla, kullanım amacına göre karşılaştırır. "X ile Y'yi karşılaştır" dendiğinde kullan.
---

# Çip karşılaştırma

İki ya da daha fazla çipi, kullanıcının **ne için** kullanacağına göre karşılaştır.
Bu alanda yanlış rakam çok yaygın; kurallar bunu önlemek için.

## 1. Kullanım amacını öğren

Söylenmediyse sor, çünkü sonuç ona göre değişir:

- Oyun (hangi çözünürlük), yapay zekâ eğitimi, yapay zekâ çıkarımı, video kurgu,
  sunucu, pil ömrü önemli dizüstü…

## 2. Rakam kuralları (en önemli kısım)

- **Her rakamın kaynağı olsun**: üreticinin ürün sayfası / veri sayfası en iyisi;
  sonra bağımsız testler. Web araması yapabiliyorsan yap ve bağlantıyı ver.
- **Doğrulayamadığın rakamı yazma.** Hücreye "doğrulanamadı" yaz.
- **Hassasiyeti belirt.** "1979 TFLOPS" tek başına anlamsız: FP8 mi FP16 mı,
  seyrek (sparsity) mi yoğun mu? Farklı hassasiyetteki sayıları aynı satırda kıyaslama;
  gerekiyorsa ayrı satır aç.
- **Söylenti ve duyuru ayrı.** Çıkmamış ürünün rakamını "beklenen" diye işaretle.
- **Birim tutarlılığı**: bant genişliği GB/s ya da TB/s, güç W, bellek GB.
  Bir çipte 2 GPU varsa (ör. süper çip) rakamın paket mi GPU başına mı olduğunu yaz.

## 3. Tablo

Satırlar (ilgili olanlar):

| Özellik | Çip A | Çip B |
|---|---|---|
| Mimari / üretim süreci | | |
| Çekirdek / hesap birimi | | |
| Bellek: kapasite, tür, bant genişliği | | |
| Hesap gücü (hassasiyetiyle) | | |
| Güç (TDP) | | |
| Çıkış yılı | | |
| Fiyat ya da saatlik kira (tarihiyle) | | |

## 4. Yorum

1. **Bu kullanımda belirleyici olan özellik** ve neden (ör. büyük model
   çıkarımında bellek kapasitesi ve bant genişliği, hesap gücünden önce gelir).
2. **Senaryo bazlı kazanan** — 3 senaryo, her birinde hangisi ve neden.
3. **Tablonun söylemediği** — yazılım ekosistemi, sürücü desteği, bulunabilirlik.
4. **Tek cümlelik sonuç**, kullanıcının amacına göre.

Fiyatların ve stok durumunun hızla değiştiğini, almadan önce kontrol edilmesi
gerektiğini belirt.
