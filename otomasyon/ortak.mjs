/**
 * Ajanlar için ortak yardımcılar.
 * Her ajan sonucunu otomasyon/raporlar/ altına JSON olarak yazar;
 * 5. ajan (rapor) bu dosyaları toplayıp özet çıkarır.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/*
 * URL.pathname yüzde kodlaması yapar: "Masaüstü" klasörü
 * "Masa%C3%BCst%C3%BC" olarak çıkar ve hiçbir dosya bulunamaz. Türkçe
 * karakter ya da boşluk içeren yollarda ajanların tamamı sessizce kırılıyordu.
 * fileURLToPath doğru çözümlemeyi yapar ve Windows'ta da çalışır.
 */
export const KOK = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const RAPOR_DIZINI = path.join(KOK, "otomasyon", "raporlar");

/** İki tarih arasındaki tam gün farkı (saat farkından etkilenmez). */
export function gunFarki(tarihMetni) {
  const a = new Date(`${tarihMetni}T00:00:00Z`);
  const n = new Date();
  const b = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  return Math.round((b - a) / 864e5);
}

/** Her ajanın en son ne zaman başarıyla çalıştığını tutar. */
export function durumOku() {
  const dosya = path.join(RAPOR_DIZINI, "durum.json");
  if (!fs.existsSync(dosya)) return {};
  try {
    return JSON.parse(fs.readFileSync(dosya, "utf-8"));
  } catch {
    return {};
  }
}

export function durumGuncelle(ajan, durum) {
  fs.mkdirSync(RAPOR_DIZINI, { recursive: true });
  const dosya = path.join(RAPOR_DIZINI, "durum.json");
  const mevcut = durumOku();
  mevcut[ajan] = { sonCalisma: new Date().toISOString(), sonTarih: bugunTarih(), durum };
  fs.writeFileSync(dosya, JSON.stringify(mevcut, null, 2), "utf-8");
  return mevcut;
}

export function bugunTarih() {
  return new Date().toISOString().slice(0, 10);
}

export function raporYaz(ajan, veri) {
  fs.mkdirSync(RAPOR_DIZINI, { recursive: true });
  const kayit = {
    ajan,
    tarih: bugunTarih(),
    zaman: new Date().toISOString(),
    ...veri,
  };
  const dosya = path.join(RAPOR_DIZINI, `${ajan}-${kayit.tarih}.json`);
  fs.writeFileSync(dosya, JSON.stringify(kayit, null, 2), "utf-8");
  if (ajan !== "rapor") durumGuncelle(ajan, veri.durum ?? "tamam");
  return { dosya, kayit };
}

export function raporOku(ajan, tarih = bugunTarih()) {
  const dosya = path.join(RAPOR_DIZINI, `${ajan}-${tarih}.json`);
  if (!fs.existsSync(dosya)) return null;
  try {
    return JSON.parse(fs.readFileSync(dosya, "utf-8"));
  } catch {
    return null;
  }
}

/** Komutu çalıştırır; hata fırlatmaz, sonucu döndürür. */
export function calistir(komut, opts = {}) {
  try {
    const cikti = execSync(komut, {
      cwd: KOK,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 32 * 1024 * 1024,
      // Zaman aşımı olmadan takılan bir komut (ağ bekleyen bir istek gibi)
      // cron görevini süresiz kilitler ve ertesi gün ikinci bir kopya başlar.
      timeout: 5 * 60 * 1000,
      ...opts,
    });
    return { ok: true, cikti };
  } catch (e) {
    const zamanAsimi = e.code === "ETIMEDOUT" || e.signal === "SIGTERM";
    return {
      ok: false,
      cikti: (e.stdout || "") + (e.stderr || "") + (zamanAsimi ? "\n[zaman aşımı: 5 dk]" : ""),
      kod: e.status,
      zamanAsimi,
    };
  }
}

/** Kaynak dosyaları listeler. */
export function kaynakDosyalari(uzantilar = [".js", ".jsx"]) {
  const out = [];
  (function gez(dizin) {
    for (const ad of fs.readdirSync(dizin)) {
      const tam = path.join(dizin, ad);
      if (fs.statSync(tam).isDirectory()) gez(tam);
      else if (uzantilar.some((u) => tam.endsWith(u))) out.push(tam);
    }
  })(path.join(KOK, "src"));
  return out;
}

export function oku(dosya) {
  return fs.readFileSync(dosya, "utf-8");
}

export const rel = (p) => path.relative(KOK, p);

/** Konsola başlık basar. */
export function baslik(metin) {
  console.log(`\n${"─".repeat(60)}\n${metin}\n${"─".repeat(60)}`);
}
