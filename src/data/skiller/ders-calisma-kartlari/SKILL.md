---
name: ders-calisma-kartlari
description: Ders notunu ya da metni özet, tekrar kartları (Anki'ye aktarılabilir CSV) ve aralıklı tekrar planına çevirir. "Bunu çalışmama yardım et", "kart yap" dendiğinde kullan.
---

# Ders çalışma kartları

Kullanıcının verdiği notu, kitap bölümünü ya da metni üç parçalı bir çalışma
setine çevir: özet, tekrar kartları, tekrar planı.

## 1. Bağlamı al

Mesajda yoksa tek soruda sor (cevap gelmezse varsay ve yaz):

- Seviye (lise, üniversite, sertifika…)
- Sınav tarihi ya da kaç gün kaldığı
- Sınav türü (çoktan seçmeli, klasik, uygulama)

## 2. Özet (tek sayfa)

- 5–8 ana fikir, önem sırasıyla. Her biri 1–2 cümle.
- Kavramlar arasında bağlantı varsa ok ile göster: "A → B'ye yol açar".
- Notta çelişki ya da eksik görürsen ayrı bir "Kontrol et" maddesinde belirt.
- **Notta olmayan bilgi ekleme.** Gerekli bir ön bilgi eksikse "Ön bilgi:" diye işaretle.

## 3. Tekrar kartları

İyi kart kuralları:

- **Bir kart, bir bilgi.** Uzun liste soran kartı böl.
- Tanım ezberletmek yerine anlamayı ölç: "X nedir?" yerine "X olmasaydı ne olurdu?",
  "X ile Y'yi ayıran tek özellik ne?"
- Cevap kısa olsun (tercihen 15 kelimeden az).
- Sayı, tarih, formül varsa ayrı kart.
- Zorluk etiketi: kolay / orta / zor.

Kart sayısı: notun uzunluğuna göre 10–40.

Kartları önce okunur bir tabloyla göster, sonra **CSV** olarak ver:

```
soru;cevap;etiket
"Transistör bir devrede hangi iki işi yapar?";"Anahtarlama ve yükseltme";orta
```

Ayırıcı noktalı virgül, her alan çift tırnakta (Anki ve Excel doğrudan alır).

## 4. Aralıklı tekrar planı

Sınava kalan gün sayısına göre bir tablo: gün | ne çalışılacak | süre.
Varsayılan aralıklar: 1, 3, 7, 14 gün sonra tekrar. Sınava 7 günden az varsa
aralıkları sıkıştır ve son günü yalnızca "zor" kartlara ayır.

## 5. Sonunda

Kullanıcıya hemen şimdi 3 kartla kendini sınamayı teklif et; cevapları o
yazdıktan sonra değerlendir.
