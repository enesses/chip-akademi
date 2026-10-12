# Öneri onayı — çalıştırma talimatı

Kullanıcı Otomasyon sayfasındaki **Onayla** düğmesine bastı. Sayfa, kullanıcının
kendi Claude bağlantısıyla "Chip Akademi öneri onayı" görevini başlattı ve ek
metne onaylanan PR'ları yazdı: `ONAY PR #23 #24`. Bu oturum yalnızca bunları
birleştirir. Düğme yalnızca sayfanın sahibinde çalışır (görev onun hesabında).

## 1. Ek metni oku

- `ONAY PR` ile başlamıyorsa dur, kullanıcıya bildir.
- `#<sayı>` olarak geçen numaraları al. Başka hiçbir PR'a dokunma.

## 2. Her PR'ı doğrula

```bash
gh api repos/enesses/chip-akademi/pulls/<no> --jq '{state, base: .base.ref, head: .head.ref, title, mergeable}'
```

Birleştirme koşulları — hepsi tutmalı:
- `state` `open`, `base` `main`, `head` `otomasyon/` ile başlıyor;
- `otomasyon/uygulanan.json`'da bu PR için son kayıt `durum: "acik"` (ya da
  `head` `otomasyon/duzeltme-` ile başlıyor — düzeltme PR'ları günlüğe girmez).

Tutmayanı birleştirme; nedenini rapora yaz ("zaten birleşmiş", "kapalı",
"otomasyonun PR'ı değil").

## 3. Birleştir

```bash
gh api -X PUT repos/enesses/chip-akademi/pulls/<no>/merge -f merge_method=squash
```

`405 merge conflicts` dönerse:

```bash
git fetch origin "refs/pull/<no>/head:pr<no>" && git checkout -B duzelt pr<no>
git rebase origin/main         # çakışmayı iki tarafın amacını koruyarak çöz
npx vite build && python3 build-single.py && node otomasyon/ui-testi.mjs
git push -f origin duzelt:<head dalı>   # testler geçtiyse
```

Sonra birleştirmeyi yeniden dene. Testler geçmezse birleştirme; dalı olduğu
gibi bırak ve nedeni rapora yaz. Birden çok PR varsa sırayla, küçük numaradan
başla; her birleştirmeden sonra `git fetch origin main`.

## 4. Günlük, rapor, yayın

```bash
git checkout main && git pull -q --rebase origin main
node otomasyon/oneri-uygula.mjs kaydet --oneri "<PR başlığı, 'Öneri: ' öneki olmadan>" \
  --durum birlesti --pr <no> --ozet "kullanıcı onayıyla birleşti"
node otomasyon/orkestrator.mjs rapor
git add -A && git commit -m "Onay: PR #<no> …" && git push origin HEAD:main
```

Ardından GUNLUK.md 6b'deki gibi claude.ai yayınını güncelle (önce oku, sonra
aynı `url` ile yayınla; `icon` ve `capabilities` verme).

## 5. Kullanıcıya

`SendUserMessage`, Türkçe, kısa: birleşenler (PR bağlantısı), birleşmeyenler ve
nedeni, yayın sürümü.
