---
name: html-oyun-yapici
description: Tek HTML dosyasında, kütüphanesiz, telefonda da oynanan tarayıcı oyunu yapar. Kullanıcı "oyun yap", "tarayıcı oyunu", "basit bir oyun kodla" dediğinde kullan.
---

# Tek dosyalık tarayıcı oyunu yapıcı

Kullanıcının fikrini, tek bir `.html` dosyasında çalışan, hiçbir dış kütüphane
ya da dosya yüklemeyen, klavye ve dokunmatikle oynanan bir oyuna çevir.

## 1. Fikri netleştir (en fazla 2 soru)

Kullanıcı yeterince söylediyse soru sorma, doğrudan yap. Eksikse yalnızca
şunlardan en önemli ikisini sor:

- Tür (koşu, nişancı, bulmaca, platform, yılan, tuğla kırma…)
- Tema / karakter
- Zorluk: kısa ve gündelik mi, uzun ve zor mu?

Cevap gelmezse makul bir varsayım yap ve en üstte tek cümleyle söyle.

## 2. Teknik kurallar

- Tek dosya: `<style>`, `<canvas>`, `<script>` hepsi içeride. CDN, resim, ses
  dosyası yok. Görseller şekillerle (`fillRect`, `arc`, yol) ya da emoji ile çizilir.
- Oyun döngüsü `requestAnimationFrame` ile; fizik **sabit zaman adımlı**
  (ör. 1/60 sn) güncellenir, çizim her karede. Böylece hızlı ve yavaş ekranda
  oyun aynı hızda oynar.
- Durumlar: `"baslangic" | "oyun" | "duraklat" | "bitti"`. Her durumun kendi
  çizimi ve girdisi olsun.
- Girdi: klavye (oklar + WASD + boşluk) **ve** dokunmatik (ekranın sol/sağ
  yarısı, kaydırma ya da ekranda düğmeler). Kontroller başlangıç ekranında yazsın.
- Tuval pencereye göre ölçeklenir; oyun mantığı sabit bir sanal çözünürlükte
  (ör. 360×640 ya da 800×450) çalışır, ekrana ölçeklenerek çizilir.
  `devicePixelRatio` hesaba katılır, böylece telefonda bulanık olmaz.
- En yüksek skor `localStorage`'da, ama her erişim `try/catch` içinde: depolama
  kapalıysa oyun yine çalışır.
- Ses: Web Audio API ile kısa osilatör efektleri (zıplama, toplama, ölme).
  İlk kullanıcı dokunuşundan önce ses başlatma (tarayıcılar engeller).
- Sekme arka plana geçince (`visibilitychange`) oyun duraklar.

## 3. Oyun hissi (mutlaka)

- İlk 15–20 saniye kolay; zorluk zamanla ya da skorla artar.
- Her önemli olayda geri bildirim: kısa ekran sarsıntısı, parçacık, ses, renk yanıp sönmesi.
- Ölünce neden ölündüğü anlaşılsın; "tekrar" tek dokunuş.
- Çarpışma kutuları görselden biraz küçük olsun (adil hissettirir).

## 4. Kod düzeni

Tek dosyada bile bölümlere ayır ve her bölümün başına kısa yorum koy:

```
// ── Ayarlar (oyunun hissini değiştiren sayılar burada)
// ── Durum
// ── Girdi
// ── Güncelleme (sabit adım)
// ── Çizim
// ── Döngü
```

Ayarlar bölümündeki sayıların yanında ne işe yaradıkları yazsın, kullanıcı
oynarken kurcalayabilsin.

## 5. Teslim

1. Dosyanın tamamını ver (kısaltma, "…" yok). Claude'da artifact olarak aç.
2. Altında 3 madde: nasıl oynanır, kontroller, hangi ayarla neyin değiştiği.
3. Oyunu daha eğlenceli yapacak 3 somut sonraki adım öner.

## Kontrol listesi (teslimden önce)

- [ ] Dış kaynak yok, tek dosya
- [ ] Klavye ve dokunmatik ikisi de çalışıyor
- [ ] Başlangıç, oyun, bitti ekranları var; tekrar oynanabiliyor
- [ ] Pencere boyutu değişince bozulmuyor
- [ ] localStorage kapalıyken hata vermiyor
- [ ] Konsolda hata yok
