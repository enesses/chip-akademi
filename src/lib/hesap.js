/**
 * Profiller. GÜVENLİK SİSTEMİ DEĞİLDİR — sunucu yok, parola tarayıcıda
 * kontrol edilir, veriler şifrelenmez. Aynı cihazı paylaşanların
 * birbirinin verisini karıştırmasını önler; kararlı erişimi önlemez.
 * Parola kurtarma yoktur.
 */
export const MIN_PAROLA = 4;
const PROFIL_KEY = "chip-akademi:profiller:v1";
const AKTIF_KEY = "chip-akademi:aktif-profil:v1";
const dinleyiciler = new Set();

export function profilDegisimineAbone(fn) { dinleyiciler.add(fn); return () => dinleyiciler.delete(fn); }
function duyur() { for (const fn of dinleyiciler) { try { fn(); } catch {} } }

function oku(k, v) { try { const h = window.localStorage.getItem(k); return h ? JSON.parse(h) : v; } catch { return v; } }
function yaz(k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch {} return v; }

export async function parolaOzeti(parola, tuz) {
  const veri = new TextEncoder().encode(`${tuz}:${parola}`);
  const ozet = await crypto.subtle.digest("SHA-256", veri);
  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function tuzUret() {
  const b = new Uint8Array(16); crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function profilleriListele() { const l = oku(PROFIL_KEY, []); return Array.isArray(l) ? l : []; }
export function aktifProfilId() { try { return window.localStorage.getItem(AKTIF_KEY) || null; } catch { return null; } }
export function aktifProfil() { const id = aktifProfilId(); return id ? profilleriListele().find((p) => p.id === id) || null : null; }
export function profilAnahtari(taban) { const id = aktifProfilId(); return id ? `chip-akademi:p:${id}:${taban}` : taban; }

export async function profilOlustur({ ad, parola = "", avatar = "🙂" }) {
  const temiz = (ad || "").trim();
  if (!temiz) throw new Error("İsim boş olamaz.");
  if (temiz.length > 30) throw new Error("İsim en fazla 30 karakter olabilir.");
  if (!parola) throw new Error("Parola zorunlu.");
  if (parola.length < MIN_PAROLA) throw new Error(`Parola en az ${MIN_PAROLA} karakter olmalı.`);
  const liste = profilleriListele();
  if (liste.some((p) => p.ad.toLowerCase() === temiz.toLowerCase())) throw new Error("Bu isimde bir profil zaten var.");
  if (liste.length >= 8) throw new Error("En fazla 8 profil oluşturulabilir.");
  const tuz = tuzUret();
  const profil = {
    id: `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    ad: temiz, avatar, tuz, ozet: await parolaOzeti(parola, tuz),
    olusturma: new Date().toISOString(), sonGiris: new Date().toISOString(),
  };
  yaz(PROFIL_KEY, [...liste, profil]);
  return profil;
}

export async function girisYap(id, parola = "") {
  const profil = profilleriListele().find((p) => p.id === id);
  if (!profil) throw new Error("Profil bulunamadı.");
  if (profil.ozet) {
    const denenen = await parolaOzeti(parola, profil.tuz);
    if (denenen !== profil.ozet) throw new Error("Parola yanlış.");
  }
  try { window.localStorage.setItem(AKTIF_KEY, id); } catch {}
  guncelle(id, { sonGiris: new Date().toISOString() });
  duyur();
  return profil;
}
export function cikisYap() { try { window.localStorage.removeItem(AKTIF_KEY); } catch {} duyur(); }
export function guncelle(id, yama) {
  const liste = profilleriListele().map((p) => (p.id === id ? { ...p, ...yama } : p));
  yaz(PROFIL_KEY, liste);
  return liste.find((p) => p.id === id) || null;
}
export function profilSil(id) {
  yaz(PROFIL_KEY, profilleriListele().filter((p) => p.id !== id));
  try {
    const onEk = `chip-akademi:p:${id}:`;
    const silinecek = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(onEk)) silinecek.push(k);
    }
    for (const k of silinecek) window.localStorage.removeItem(k);
  } catch {}
  if (aktifProfilId() === id) cikisYap(); else duyur();
}
export async function parolaDegistir(id, eskiParola, yeniParola) {
  const profil = profilleriListele().find((p) => p.id === id);
  if (!profil) throw new Error("Profil bulunamadı.");
  if (!yeniParola || yeniParola.length < MIN_PAROLA) throw new Error(`Parola en az ${MIN_PAROLA} karakter olmalı.`);
  if (profil.ozet) {
    const denenen = await parolaOzeti(eskiParola, profil.tuz);
    if (denenen !== profil.ozet) throw new Error("Mevcut parola yanlış.");
  }
  const tuz = tuzUret();
  return guncelle(id, { tuz, ozet: await parolaOzeti(yeniParola, tuz) });
}
export function parolasizProfiller() { return profilleriListele().filter((p) => !p.ozet); }

export function eskiVeriyiTasi(id) {
  const tabanlar = ["chip-akademi:progress:v3", "chip-akademi:notes:v1", "chip-akademi:designs:v1"];
  const tasinan = [];
  try {
    for (const taban of tabanlar) {
      const deger = window.localStorage.getItem(taban);
      if (deger === null) continue;
      const yeni = `chip-akademi:p:${id}:${taban}`;
      if (window.localStorage.getItem(yeni) !== null) continue;
      window.localStorage.setItem(yeni, deger);
      tasinan.push(taban);
    }
  } catch {}
  return tasinan;
}
export function disaAktar(id) {
  const profil = profilleriListele().find((p) => p.id === id);
  if (!profil) return null;
  const veri = {};
  try {
    const onEk = `chip-akademi:p:${id}:`;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(onEk)) veri[k.slice(onEk.length)] = window.localStorage.getItem(k);
    }
  } catch {}
  const { tuz, ozet, ...guvenli } = profil;
  return { bicim: "chip-akademi-profil", surum: 1, disaAktarma: new Date().toISOString(), profil: guvenli, veri };
}
export async function iceAktar(paket, { yeniAd } = {}) {
  if (!paket || paket.bicim !== "chip-akademi-profil") throw new Error("Bu dosya bir Chip Akademi profil yedeği değil.");
  const ad = yeniAd || `${paket.profil?.ad || "İçe aktarılan"} (kopya)`;
  const profil = await profilOlustur({ ad, avatar: paket.profil?.avatar || "🙂" });
  try {
    for (const [taban, deger] of Object.entries(paket.veri || {}))
      window.localStorage.setItem(`chip-akademi:p:${profil.id}:${taban}`, deger);
  } catch {}
  return profil;
}
export const AVATARLAR = ["🙂", "🚀", "🧠", "⚡", "🔬", "🎯", "🛠️", "🌙", "🦊", "🐧"];
