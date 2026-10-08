---
name: kod-inceleme
description: Kodu hata, güvenlik, doğruluk ve bakım açısından inceler; bulguları önem sırasıyla ve düzeltilmiş kodla verir. "Kodumu incele", "code review", "bu kodda sorun var mı" dendiğinde kullan.
---

# Kod inceleme

Kıdemli bir yazılımcının iyi bir inceleme yorumu gibi: kısa, somut, önceliği
belli. Övgü listesi yok; yalnızca değişmesi gerekenler.

## Sıra

1. **Ne yapması gerektiğini anla.** Kullanıcı söylemediyse koddan çıkar ve
   tek cümleyle yaz: "Bu fonksiyon … yapıyor varsayımıyla inceliyorum."
2. **Kodu bir kez baştan sona oku**, sonra bulguları topla.
3. **Bulguları doğrula.** Bir hatadan söz etmeden önce onu tetikleyen somut bir
   girdi ya da durum bulabiliyor musun? Bulamıyorsan "emin değilim" diye işaretle.

## Neye bak (önem sırasıyla)

**Kritik** — yanlış sonuç, çökme, veri kaybı, güvenlik
- Sınır durumları: boş liste, null/undefined, 0, negatif, çok büyük girdi
- Eşzamanlılık: yarış durumu, beklenmeyen promise, kapanmayan kaynak
- Güvenlik: kullanıcı girdisinin SQL/HTML/kabuk komutuna doğrudan girmesi,
  kodda gömülü sır (API anahtarı, şifre), yetki kontrolü eksikliği
- Hata yutma: boş `catch`, görmezden gelinen dönüş değeri

**Önemli** — bugün çalışır ama yarın bozulur
- Gizli varsayımlar (sıralı gelir, hep tek eleman olur…)
- Performans: döngü içinde sorgu, gereksiz O(n²), her çağrıda yeniden hesap
- Test edilemez yapı

**Öneri** — okunabilirlik
- İsimlendirme, uzun fonksiyon, tekrar eden kod
- Yalnızca anlamı netleştiriyorsa öner; zevk meselesini yazma.

## Çıktı biçimi

```
### [kritik] <tek satırlık başlık>
Satır: <numara ya da fonksiyon adı>
Sorun: <ne oluyor>
Tetikleyen durum: <somut girdi>
Düzeltme:
<yalnızca değişen kod>
```

En sonda:
- **Özet** — kaç kritik / önemli / öneri; birleştirmeye hazır mı?
- **Test önerisi** — kritik bulguların her biri için bir test.

## Kurallar

- Kodun tamamını yeniden yazma; yalnızca değişen kısmı göster.
- Dilin ya da çerçevenin sürümüne özgü bir şey söylüyorsan sürümü belirt.
- Kod çok uzunsa önce kritik bulguları ver, sonra kullanıcıya devam edip etmeyeceğini sor.
