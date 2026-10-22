/**
 * Firebase arka ucu: Auth (e-posta + şifre) ve Firestore "kullanicilar"
 * koleksiyonu. oturum.js bu arayüzü kullanır; testler aynı arayüzde sahte bir
 * arka uç verir (window.__chipArka).
 *
 * kullanicilar/{uid}: { ad, eposta, rol: "kullanici"|"girisimci",
 *   durum: "aktif"|"bekliyor"|"onaylandi"|"reddedildi", aciklama?, olusturma, karar? }
 */
import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, sendEmailVerification, updateProfile, reload,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  setPersistence, browserLocalPersistence, browserSessionPersistence,
} from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp,
} from "firebase/firestore";

export function firebaseArka(ayar) {
  const app = initializeApp(ayar);
  const auth = getAuth(app);
  auth.languageCode = "tr";
  const db = getFirestore(app);
  const sade = (u) => (u ? { uid: u.uid, eposta: u.email, dogrulandi: u.emailVerified, ad: u.displayName || "" } : null);
  const BEKLEYEN_ROL = "chip-akademi:google-rol";
  const tarih = (v) => (v?.toDate ? v.toDate().toISOString() : v ?? null);
  const profilSade = (s) => {
    if (!s.exists()) return null;
    const d = s.data();
    return { uid: s.id, ...d, olusturma: tarih(d.olusturma), karar: d.karar ? { ...d.karar, tarih: tarih(d.karar.tarih) } : null };
  };

  const kalici = (hatirla) => setPersistence(auth, hatirla === false ? browserSessionPersistence : browserLocalPersistence);
  const profilVeri = ({ ad, eposta, rol, aciklama }) => {
    const veri = { ad, eposta, rol, durum: rol === "girisimci" ? "bekliyor" : "aktif", olusturma: serverTimestamp() };
    if (rol === "girisimci" && aciklama) veri.aciklama = aciklama;
    return veri;
  };
  /** Google ile ilk kez gelen hesabın Firestore kaydını açar (varsa dokunmaz). */
  async function googleProfili(user, { rol = "kullanici", aciklama = "" } = {}) {
    const ref = doc(db, "kullanicilar", user.uid);
    if ((await getDoc(ref)).exists()) return false;
    let ad = (user.displayName || user.email.split("@")[0] || "").trim().slice(0, 80);
    if (ad.length < 2) ad = "Chip Akademi üyesi";
    await setDoc(ref, profilVeri({ ad, eposta: user.email, rol, aciklama: aciklama.slice(0, 600) }));
    return true;
  }

  return {
    dinle: (cb) => onAuthStateChanged(auth, (u) => cb(sade(u))),
    async kayit({ ad, eposta, parola, rol, aciklama, hatirla }) {
      await kalici(hatirla);
      const { user } = await createUserWithEmailAndPassword(auth, eposta, parola);
      await updateProfile(user, { displayName: ad });
      await setDoc(doc(db, "kullanicilar", user.uid), profilVeri({ ad, eposta: user.email, rol, aciklama }));
      try { await sendEmailVerification(user); } catch { /* sonra Hesabım'dan yeniden gönderilebilir */ }
      return sade(user);
    },
    async giris(eposta, parola, hatirla) {
      await kalici(hatirla);
      return sade((await signInWithEmailAndPassword(auth, eposta, parola)).user);
    },
    /** Google ile giriş/kayıt. Açılır pencere engellenirse sayfa yönlendirmesine düşer. */
    async google({ rol, aciklama, hatirla } = {}) {
      await kalici(hatirla);
      const saglayici = new GoogleAuthProvider();
      saglayici.setCustomParameters({ prompt: "select_account" });
      try {
        const { user } = await signInWithPopup(auth, saglayici);
        const yeni = await googleProfili(user, { rol, aciklama });
        return { kullanici: sade(user), yeni };
      } catch (e) {
        if (e?.code !== "auth/popup-blocked") throw e;
        try { sessionStorage.setItem(BEKLEYEN_ROL, JSON.stringify({ rol, aciklama })); } catch { /* yok say */ }
        await signInWithRedirect(auth, saglayici);
        return { kullanici: null, yonlendirildi: true };
      }
    },
    /** Yönlendirmeyle dönen Google girişini tamamlar; profil açıldıysa kullanıcıyı döner. */
    async yonlendirmeSonucu() {
      const r = await getRedirectResult(auth);
      if (!r?.user) return null;
      let bekleyen = {};
      try { bekleyen = JSON.parse(sessionStorage.getItem(BEKLEYEN_ROL) || "{}"); sessionStorage.removeItem(BEKLEYEN_ROL); } catch { /* yok say */ }
      await googleProfili(r.user, bekleyen);
      return sade(r.user);
    },
    cikis: () => signOut(auth),
    sifreSifirla: (eposta) => sendPasswordResetEmail(auth, eposta),
    dogrulamaGonder: () => sendEmailVerification(auth.currentUser),
    async yenile() {
      if (!auth.currentUser) return null;
      await reload(auth.currentUser);
      await auth.currentUser.getIdToken(true); // e-posta doğrulaması kurallara yansısın
      return sade(auth.currentUser);
    },
    profilGetir: async (uid) => profilSade(await getDoc(doc(db, "kullanicilar", uid))),
    async basvurular() {
      const s = await getDocs(query(collection(db, "kullanicilar"), where("rol", "==", "girisimci")));
      return s.docs.map(profilSade);
    },
    karar: (uid, durum, adminUid) => updateDoc(doc(db, "kullanicilar", uid), {
      durum, karar: { tarih: serverTimestamp(), admin: adminUid },
    }),
  };
}
