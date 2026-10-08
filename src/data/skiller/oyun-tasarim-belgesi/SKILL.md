---
name: oyun-tasarim-belgesi
description: Oyun fikrini çekirdek döngü, mekanikler, kapsam tablosu ve riskleriyle bir oyun tasarım belgesine (GDD) çevirir. "GDD yaz", "oyun fikrimi belgele" dendiğinde kullan.
---

# Oyun tasarım belgesi (GDD)

Kullanıcının oyun fikrini, küçük bir ekibin gerçekten uygulayabileceği bir
tasarım belgesine çevir. Amaç güzel görünen uzun bir belge değil; neyin
yapılacağına ve neyin **yapılmayacağına** karar verdiren bir belge.

## Önce öğren

Fikirde şunlar yoksa sor (tek mesajda, en fazla 4 soru):

- Platform (PC, mobil, konsol, tarayıcı)
- Ekip büyüklüğü ve süre
- Referans aldığı 1–3 oyun
- Oyuncunun hissetmesini istediği tek duygu

## Belgenin yapısı

1. **Tek cümle** — "X oyununda oyuncu Y yaparak Z hisseder."
2. **Hedef oyuncu** — kim, hangi oyunları oynuyor, ne kadar süre oynayacak.
3. **Çekirdek döngü** — üç ölçekte:
   - 30 saniye: oyuncunun sürekli yaptığı eylem
   - 5 dakika: bir hedefe ulaşma
   - 1 saat / oturum: ilerleme, yeni şey açma
4. **Mekanikler** — her biri için tablo: ad | ne yapar | oyuncuya hissettirdiği | nasıl öğretilir | hangi mekanikle birleşir.
5. **İlerleme** — oyuncu neyi açar, ne sıklıkla, neden devam eder.
6. **Seviye yapısı ve zorluk eğrisi** — yeni şey "öğret → sına → ustalaştır" sırasıyla gelir.
7. **Sanat ve ses yönü** — 3 referans + "bu oyun neye benzemeyecek".
8. **Kapsam tablosu** — Olmazsa olmaz / Olsa iyi / Sonraya. Ekip ve süreye göre gerçekçi; şüphedeysen "sonraya".
9. **Riskler** — en büyük 3 belirsizlik ve her biri için en ucuz prototip testi (ne yapılır, kaç günde, başarı ölçütü).
10. **İlk dikey dilim** — oyunun her parçasını içeren en küçük oynanabilir bölüm; tamamlanma tanımı.

## Kurallar

- Kapsam şişirme: 2 kişilik ekibe açık dünya, çok oyunculu, 40 saatlik hikâye önerme.
- "Eğlenceli", "sürükleyici" gibi boş sıfatlar yerine somut davranış yaz ("oyuncu her ölümde 3 saniyede geri döner").
- Referans oyun verirken o oyunun hangi kısmına benzediğini söyle.
- Tablo kullanılabilecek her yerde tablo kullan.

## Teslim

Belgeyi Markdown olarak ver. Sonunda kullanıcıya tek bir soru sor: kapsam
tablosunda "olmazsa olmaz"a taşınmasını istediği bir şey var mı?
