/**
 * Oturum durumu (tek kaynak) ve yetki.
 *
 * - Hesap: Firebase Auth + Firestore profili (firebaseArka.js).
 * - Admin: ADMIN_EPOSTA ile girmiş ve e-postası doğrulanmış hesap. Aynı kural
 *   firestore.rules'ta sunucuda da var; başvuruları onaylama yetkisi oradan gelir.
 * - claude.ai yayınında dış sunucuya bağlanılamaz; orada uygulamanın sahibi
 *   (claude.ai hesabıyla) admin sayılır ki Otomasyon ve onay düğmeleri çalışsın.
 *
 * Not: Otomasyon sayfasını gizlemek bir arayüz kararıdır; verisi zaten herkese
 * açık GitHub deposunda durur. Gerçek koruma gereken şey (başvuru onayı) sunucu
 * kurallarındadır.
 */
import { useEffect, useState } from "react";
import { ADMIN_EPOSTA, EMAILJS, FIREBASE } from "@/lib/firebaseAyar";

let durum = {
  hazir: false,          // ilk oturum bilgisi geldi mi
  kurulu: false,         // bir arka uç var mı (Firebase ayarı ya da test)
  baglanamadi: false,    // arka uç başlatılamadı (ör. claude.ai görünümü)
  kullanici: null,       // { uid, eposta, dogrulandi, ad }
  profil: null,          // Firestore kaydı
  sahip: false,          // claude.ai'de uygulamanın sahibi
  sahipBelli: false,     // sahiplik kontrolü bitti mi
};
const dinleyiciler = new Set();
function guncelle(yama) {
  durum = { ...durum, ...yama };
  for (const fn of dinleyiciler) { try { fn(durum); } catch { /* yok say */ } }
}

let arka = null;
let basladi = false;

export function adminMi(d = durum) {
  const k = d.kullanici;
  const hesapAdmin = !!k && k.dogrulandi && (k.eposta || "").toLowerCase() === ADMIN_EPOSTA;
  return hesapAdmin || d.sahip;
}

async function arkaKur() {
  if (typeof window !== "undefined" && window.__chipArka) return window.__chipArka; // yalnızca testler
  if (!FIREBASE) return null;
  const { firebaseArka } = await import("@/lib/firebaseArka");
  return firebaseArka(FIREBASE);
}

async function sahipKontrol() {
  let sahip = false;
  try {
    const c = typeof window !== "undefined" ? window.claude : null;
    if (c && typeof c.use === "function") {
      const user = await c.use("user");
      sahip = user ? !!(await user.isOwner()) : false;
    }
  } catch { /* claude.ai dışı */ }
  guncelle({ sahip, sahipBelli: true });
}

export function oturumuBaslat() {
  if (basladi) return;
  basladi = true;
  sahipKontrol();
  arkaKur().then((a) => {
    arka = a;
    if (!a) { guncelle({ hazir: true, kurulu: false }); return; }
    guncelle({ kurulu: true });
    let ilk = true;
    const zaman = setTimeout(() => { if (ilk) guncelle({ hazir: true, baglanamadi: true }); }, 8000);
    a.dinle(async (k) => {
      if (ilk) { ilk = false; clearTimeout(zaman); }
      let profil = null;
      if (k) { try { profil = await a.profilGetir(k.uid); } catch { profil = null; } }
      guncelle({ hazir: true, baglanamadi: false, kullanici: k, profil });
    });
    // Açılır pencere engellendiyse Google girişi yönlendirmeyle döner; profili burada tamamla.
    a.yonlendirmeSonucu?.().then(async (k) => {
      if (!k) return;
      const profil = await a.profilGetir(k.uid).catch(() => null);
      guncelle({ kullanici: k, profil });
    }).catch(() => { /* hata giriş sayfasında yeniden denenebilir */ });
  }).catch(() => guncelle({ hazir: true, kurulu: !!FIREBASE, baglanamadi: true }));
}

export function useOturum() {
  const [d, setD] = useState(durum);
  useEffect(() => {
    oturumuBaslat();
    dinleyiciler.add(setD);
    setD(durum);
    return () => { dinleyiciler.delete(setD); };
  }, []);
  return { ...d, admin: adminMi(d) };
}

/** Firebase hata kodlarını Türkçe cümleye çevirir. */
export function hataMetni(e) {
  const kod = e?.code || "";
  const t = {
    "auth/email-already-in-use": "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.",
    "auth/invalid-email": "E-posta adresi geçerli görünmüyor.",
    "auth/weak-password": "Şifre çok zayıf; en az 8 karakter kullan.",
    "auth/invalid-credential": "E-posta ya da şifre hatalı.",
    "auth/wrong-password": "E-posta ya da şifre hatalı.",
    "auth/user-not-found": "E-posta ya da şifre hatalı.",
    "auth/user-disabled": "Bu hesap devre dışı bırakılmış.",
    "auth/too-many-requests": "Çok fazla deneme yapıldı. Biraz bekleyip yeniden dene.",
    "auth/network-request-failed": "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.",
    "auth/operation-not-allowed": "E-posta/şifre ile giriş Firebase'de açılmamış (kurulum adımı).",
    "auth/unauthorized-domain": "Bu adres Firebase'de yetkili alan olarak ekli değil (kurulum adımı).",
    "auth/popup-closed-by-user": "Google penceresi kapatıldı. Yeniden dene.",
    "auth/cancelled-popup-request": "Google penceresi kapatıldı. Yeniden dene.",
    "auth/account-exists-with-different-credential": "Bu e-posta başka bir yöntemle kayıtlı. E-posta ve şifreyle giriş yap.",
    "auth/missing-email": "Önce e-posta adresini yaz.",
    "permission-denied": "Bu işlem için yetkin yok.",
    "unavailable": "Sunucuya ulaşılamadı. Biraz sonra yeniden dene.",
  };
  return t[kod] || "Bir şeyler ters gitti. Yeniden dene.";
}

function hazirMi() {
  if (!arka) throw Object.assign(new Error("kurulmamis"), { code: "kurulmamis" });
  return arka;
}

export const MIN_SIFRE = 8;

export async function kayitOl({ ad, eposta, parola, rol, aciklama, hatirla = true }) {
  const a = hazirMi();
  const k = await a.kayit({ ad: ad.trim(), eposta: eposta.trim(), parola, rol, aciklama: aciklama?.trim() || "", hatirla });
  const profil = await a.profilGetir(k.uid).catch(() => null);
  guncelle({ kullanici: k, profil });
  if (rol === "girisimci") basvuruBildir({ ad: ad.trim(), eposta: eposta.trim(), aciklama: aciklama?.trim() || "" });
  return k;
}
export const girisYap = (eposta, parola, hatirla = true) => hazirMi().giris(eposta.trim(), parola, hatirla);
export const googleVar = () => typeof arka?.google === "function";
/** Google ile giriş/kayıt. İlk kez gelen hesap seçilen rolle açılır. */
export async function googleIleDevam({ rol = "kullanici", aciklama = "", hatirla = true } = {}) {
  const a = hazirMi();
  const s = await a.google({ rol, aciklama: aciklama.trim(), hatirla });
  if (s.yonlendirildi) return s;
  const profil = await a.profilGetir(s.kullanici.uid).catch(() => null);
  guncelle({ kullanici: s.kullanici, profil });
  if (s.yeni && profil?.rol === "girisimci") basvuruBildir({ ad: profil.ad, eposta: profil.eposta, aciklama: profil.aciklama || "" });
  return s;
}
export const cikisYap = () => hazirMi().cikis();
export const sifreSifirla = (eposta) => hazirMi().sifreSifirla(eposta.trim());
export const dogrulamaGonder = () => hazirMi().dogrulamaGonder();
export async function oturumuYenile() {
  const a = hazirMi();
  const k = await a.yenile();
  const profil = k ? await a.profilGetir(k.uid).catch(() => null) : null;
  guncelle({ kullanici: k, profil });
  return k;
}
export const basvurular = () => hazirMi().basvurular();
export const kararVer = (uid, karar) => hazirMi().karar(uid, karar, durum.kullanici?.uid || null);

/** Yeni girişimci başvurusunu admine e-postayla bildir (EmailJS ayarlıysa). */
async function basvuruBildir({ ad, eposta, aciklama }) {
  if (!EMAILJS) return;
  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId, template_id: EMAILJS.templateId, user_id: EMAILJS.publicKey,
        template_params: { to_email: ADMIN_EPOSTA, basvuran_ad: ad, basvuran_eposta: eposta, aciklama: aciklama || "—" },
      }),
    });
  } catch { /* e-posta gitmese de başvuru Yönetim sayfasında görünür */ }
}
