/**
 * Hesap sistemi ayarları — kurulum: otomasyon/HESAP-KURULUM.md
 *
 * FIREBASE: Firebase konsolu → Proje ayarları → "Web uygulaması" yapılandırması.
 * Bu değerler gizli değildir (her web uygulamasında tarayıcıya gider); güvenliği
 * firestore.rules sağlar. null kaldıkça giriş/kayıt "kurulum bekliyor" der.
 *
 * EMAILJS (isteğe bağlı): yeni girişimci başvurusunda admine e-posta. null ise
 * e-posta gitmez; başvurular yine Yönetim sayfasında görünür.
 *
 * ŞİFRE BURADA YOK ve olmamalı: admin, ADMIN_EPOSTA ile kayıt olup e-postasını
 * doğrulayan hesaptır (firestore.rules aynı kontrolü sunucuda yapar).
 */
export const ADMIN_EPOSTA = "yucelkemalnuri@gmail.com";

export const FIREBASE = null;
// Örnek:
// export const FIREBASE = {
//   apiKey: "...", authDomain: "proje.firebaseapp.com", projectId: "proje",
//   storageBucket: "proje.appspot.com", messagingSenderId: "...", appId: "...",
// };

export const EMAILJS = null;
// export const EMAILJS = { serviceId: "service_...", templateId: "template_...", publicKey: "..." };

/** Girişin çalıştığı web adresi (claude.ai yayını dış sunuculara bağlanamaz). */
export const WEB_ADRESI = "https://enesses.github.io/chip-akademi/";
