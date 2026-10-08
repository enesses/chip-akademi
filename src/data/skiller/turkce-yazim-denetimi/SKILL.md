---
name: turkce-yazim-denetimi
description: Türkçe metni TDK yazım kurallarına göre düzeltir; her değişikliği kuralıyla listeler, üslubu değiştirmez. "Yazım hatalarını düzelt", "imla kontrolü" dendiğinde kullan.
---

# Türkçe yazım denetimi

Metni **yalnızca yazım ve noktalama** açısından düzelt. Kullanıcının üslubunu,
kelime seçimini ve cümle yapısını değiştirme; o ayrı bir istek.

## En sık hatalar (önce bunlara bak)

1. **Bağlaç "de/da"** ayrı yazılır, kesmeyle ayrılmaz: "Ben de geldim." Bulunma eki
   "-de/-da" bitişik: "evde". Test: cümleden çıkarınca anlam bozulmuyorsa bağlaçtır.
2. **Bağlaç "ki"** ayrı: "Öyle yorgunum ki". İlgi eki "-ki" bitişik: "evdeki",
   "yarınki". Kalıplaşmış bitişikler: belki, çünkü, sanki, oysaki, mademki, hâlbuki.
3. **Soru eki "mı/mi/mu/mü"** her zaman ayrı, kendinden sonraki eklerle bitişik:
   "Geliyor musun?", "Güzel mi?".
4. **Özel adlara gelen ekler** kesmeyle: "Ankara'ya", "NVIDIA'nın", "2026'da".
   Kurum adlarında ve sondaki kısaltmalarda okunuşa göre: "TDK'nin", "NATO'ya".
5. **Birleşik kelimeler**: "birçok, birkaç, herkes, hiçbir" bitişik; "her şey, bir şey, hiç kimse" ayrı.
6. **Büyük harf**: cümle başı, özel adlar; yön adları özel ada dahilse büyük ("Doğu Anadolu").
   Gün/ay adları tarih belirtirken büyük: "8 Ekim 2026 Perşembe".
7. **Sayılar**: "3 üncü" değil "3." ya da "3'üncü"; ondalık ayırıcı virgül: "3,5".
8. **Düzeltme işareti**: anlam ayırt ediyorsa kullanılır: "hala" (babanın kız kardeşi) / "hâlâ" (henüz), "kar" / "kâr".
9. **Noktalama**: sıralı cümlelerde virgül; "ve"den önce virgül yok; soru cümlesinde
   soru eki varsa sonda soru işareti.
10. **Yabancı kelimeler**: Türkçe karşılığı yaygın olanlarda bunu öner ama değiştirme
    (üslup kullanıcının).

## Çıktı biçimi

1. **Düzeltilmiş metin** — tamamı, değişiklik dışında birebir aynı.
2. **Değişiklikler tablosu**:

| # | Önce | Sonra | Kural |
|---|---|---|---|
| 1 | "bende geldim" | "ben de geldim" | Bağlaç "de" ayrı yazılır |

3. **Emin olmadıklarım** — bağlama göre iki yazımın da doğru olabileceği yerler, kısa gerekçeyle.

## Kurallar

- Hata yoksa "Yazım hatası bulamadım." de; olmayan hata uydurma.
- Aynı hata birden çok kez geçiyorsa tabloda bir kez yaz, "(4 yerde)" ekle.
- Argo, ağız ya da bilinçli üslup tercihlerini (ör. diyalogda "gelcem") düzeltme; "Emin olmadıklarım"da belirt.
- Uzun metinde (2.000 kelimeden fazla) önce en sık 5 hata türünü özetle.
