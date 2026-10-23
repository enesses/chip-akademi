# Hesap sistemi kurulumu (Firebase)

Giriş/kayıt, girişimci onayı ve "yalnızca admin" sayfaları Firebase ile
çalışır. Kod hazır; aşağıdaki adımlar Firebase ve GitHub tarafında bir kez
yapılır (bu ortamdan Google ve GitHub ayarlarına erişilemediği için elle).

## 1. Firebase projesi

1. https://console.firebase.google.com → **Proje ekle** (Analytics gerekmez).
2. **Authentication → Başlayın → Sign-in method → E-posta/Şifre → Etkinleştir.**
   Aynı sekmede **Google → Etkinleştir** → destek e-postasını seç → Kaydet
   ("Google ile giriş/kayıt" düğmesi bunu ister; açılmazsa düğme
   "Firebase'de açılmamış" hatası verir, e-posta/şifre yine çalışır).
3. **Authentication → Settings → Yetkili alan adları → Alan ekle:** `enesses.github.io`
4. **Firestore Database → Veritabanı oluştur** → üretim modu → konum `eur3` (Avrupa).
5. **Firestore → Rules** sekmesine depodaki `firestore.rules` dosyasını olduğu gibi
   yapıştır → **Yayınla**.
6. **Proje ayarları (⚙) → Genel → Uygulamalarınız → Web (</>)** → bir ad ver →
   çıkan `firebaseConfig` nesnesini kopyala ve Claude'a ver. Bu değerler gizli
   değildir; tarayıcıya giden genel yapılandırmadır (güvenliği kurallar sağlar).

Claude bu nesneyi `src/lib/firebaseAyar.js` içindeki `FIREBASE`'e yazar.

## 2. Web sürümü (GitHub Pages)

claude.ai'deki yayın dış sunuculara bağlanamaz; giriş web sürümünde çalışır.

GitHub → `enesses/chip-akademi` → **Settings → Pages → Source: Deploy from a
branch → Branch: `main`, klasör: `/docs` → Save.** Birkaç dakika sonra:
https://enesses.github.io/chip-akademi/

## 3. Admin hesabı

Web sürümünde **Kayıt ol → Kullanıcı** ile `yucelkemalnuri@gmail.com` adresiyle
kayıt ol, şifreyi orada belirle. Gelen doğrulama e-postasındaki bağlantıya tıkla,
sonra **Hesabım → Doğruladım**. "Yönetici" rozeti görünür; Otomasyon ve
**Girişimci başvuruları** sayfaları açılır.

Şifre kodda yoktur ve olmamalıdır. Admin yetkisi `firestore.rules` içinde
doğrulanmış bu e-postaya bağlıdır; adresi değiştirmek için hem
`firestore.rules` hem `src/lib/firebaseAyar.js` (`ADMIN_EPOSTA`) güncellenir.

## 4. (İsteğe bağlı) Yeni başvuruda e-posta — EmailJS

Firebase'in kendi e-posta tetikleyicileri ücretli plan (Blaze) ister; bunun
yerine ücretsiz EmailJS kullanılır.

1. https://www.emailjs.com → ücretsiz hesap → **Email Services → Gmail** bağla.
2. **Email Templates → Create**: Alıcı (To) `{{to_email}}`, konu
   `Yeni girişimci başvurusu: {{basvuran_ad}}`, gövde:
   `{{basvuran_ad}} ({{basvuran_eposta}}) girişimci olarak başvurdu. Açıklama: {{aciklama}}`
3. Service ID, Template ID ve **Account → Public Key**'i Claude'a ver →
   `src/lib/firebaseAyar.js` içindeki `EMAILJS`.

E-posta ayarlanmasa da başvurular Yönetim sayfasında görünür.

## Nasıl çalışır

| | Kullanıcı | Girişimci | Admin |
|---|---|---|---|
| Kayıt | anında aktif | "onay bekliyor" | `yucelkemalnuri@gmail.com` + doğrulama |
| Başvuruları görür / onaylar | — | — | ✓ (sunucu kuralıyla) |
| Otomasyon sayfası | gizli | gizli | ✓ |

- Kimse kendini onaylayamaz: kayıt yalnızca `aktif` (kullanıcı) ya da `bekliyor`
  (girişimci) durumuyla oluşturulabilir; durumu yalnızca admin değiştirir.
- claude.ai yayınında uygulamanın sahibi admin sayılır (Otomasyon ve onay düğmeleri
  orada da çalışsın diye).
- Otomasyon sayfasını gizlemek bir arayüz kararıdır: verisi herkese açık GitHub
  deposunda zaten duruyor. Gerçek koruma gereken iş (başvuru onayı) sunucudadır.

## Firebase Hosting ile yayın

Depoda `firebase.json` (yayın klasörü: `docs`) ve `.firebaserc` (proje:
`chip-akademi`) hazır. Kendi bilgisayarında, deponun klasöründe:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

Adres: https://chip-akademi.web.app (ve chip-akademi.firebaseapp.com). Bu iki
alan Firebase Auth'ta kendiliğinden yetkilidir. Her güncellemede `main`'i çekip
`firebase deploy --only hosting` yeniden çalıştırılır. Otomatik yayın için:
`firebase init hosting:github` (GitHub sırrını ve iş akışını kendisi kurar).
