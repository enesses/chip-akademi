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
  const tarih = (v) => (v?.toDate ? v.toDate().toISOString() : v ?? null);
  const profilSade = (s) => {
    if (!s.exists()) return null;
    const d = s.data();
    return { uid: s.id, ...d, olusturma: tarih(d.olusturma), karar: d.karar ? { ...d.karar, tarih: tarih(d.karar.tarih) } : null };
  };

  return {
    dinle: (cb) => onAuthStateChanged(auth, (u) => cb(sade(u))),
    async kayit({ ad, eposta, parola, rol, aciklama }) {
      const { user } = await createUserWithEmailAndPassword(auth, eposta, parola);
      await updateProfile(user, { displayName: ad });
      const veri = {
        ad, eposta: user.email, rol,
        durum: rol === "girisimci" ? "bekliyor" : "aktif",
        olusturma: serverTimestamp(),
      };
      if (rol === "girisimci" && aciklama) veri.aciklama = aciklama;
      await setDoc(doc(db, "kullanicilar", user.uid), veri);
      try { await sendEmailVerification(user); } catch { /* sonra Hesabım'dan yeniden gönderilebilir */ }
      return sade(user);
    },
    giris: async (eposta, parola) => sade((await signInWithEmailAndPassword(auth, eposta, parola)).user),
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
