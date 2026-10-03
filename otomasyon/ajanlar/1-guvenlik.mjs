/**
 * 1. AJAN — GÜVENLİK  (her gün 09:00)
 *
 * Kapsam notu: Uygulama sunucusuz, statik bir HTML. Klasik anlamda bir
 * saldırı yüzeyi (veritabanı, oturum, API ucu) yok — dolayısıyla "saldırı
 * tespiti" yerine gerçekten ölçülebilir dört şeye bakılır:
 *
 *   1. Bağımlılık açıkları        (npm audit)
 *   2. Dosya bütünlüğü            (yayındaki dosya beklenenden farklı mı)
 *   3. Riskli kod desenleri       (eval, innerHTML, gömülü anahtar)
 *   4. Güvenlik başlıkları        (canlı URL varsa CSP/HSTS/X-Frame)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { KOK, baslik, calistir, kaynakDosyalari, oku, raporOku, raporYaz, rel } from "../ortak.mjs";

const YAYIN_URL = process.env.YAYIN_URL || ""; // ör. https://kullanici.github.io/chip-akademi/
const CIKTI = path.join(KOK, "dist", "chip-akademi.html");

/* ---------------------------------------------- 1. bağımlılık açıkları */
function kabulListesi() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(KOK, "otomasyon", "kabul-edilen-riskler.json"), "utf-8"));
    const bugun = new Date().toISOString().slice(0, 10);
    return (j.kayitlar || []).filter((k) => !k.gozden_gecir || k.gozden_gecir >= bugun);
  } catch {
    return [];
  }
}

function bagimlilikAciklari() {
  const r = calistir("npm audit --json");
  try {
    const j = JSON.parse(r.cikti);
    const kabul = kabulListesi();
    const kabulEdilen = (url) => kabul.some((k) => String(url || "").includes(k.danisma));
    const vulns = j.vulnerabilities || {};
    // Bir paketin uyarısı, ona ulaşan TÜM danışmalar kabul listesindeyse kabul edilmiş sayılır.
    const danismalar = (ad, gorulen = new Set()) => {
      if (gorulen.has(ad) || !vulns[ad]) return [];
      gorulen.add(ad);
      return vulns[ad].via.flatMap((v) => (typeof v === "string" ? danismalar(v, gorulen) : [v.url]));
    };
    const sayac = { kritik: 0, yuksek: 0, orta: 0, dusuk: 0, toplam: 0 };
    const kabulEdilenler = [];
    const SEV = { critical: "kritik", high: "yuksek", moderate: "orta", low: "dusuk" };
    for (const [ad, v] of Object.entries(vulns)) {
      const urls = danismalar(ad);
      if (urls.length && urls.every(kabulEdilen)) { kabulEdilenler.push(ad); continue; }
      if (SEV[v.severity]) sayac[SEV[v.severity]]++;
      sayac.toplam++;
    }
    return { ...sayac, kabulEdilen: kabulEdilenler, kabulNedenleri: kabul.map((k) => `${k.paket} (${k.danisma}): ${k.neden} — gözden geçirme ${k.gozden_gecir}`) };
  } catch {
    return { hata: "npm audit çıktısı okunamadı", ham: r.cikti.slice(0, 400) };
  }
}

/* ---------------------------------------------- 2. dosya bütünlüğü */
function ozet(dosya) {
  if (!fs.existsSync(dosya)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(dosya)).digest("hex");
}

async function yayindakiOzet() {
  if (!YAYIN_URL) return { durum: "atlandı", neden: "YAYIN_URL tanımlı değil" };
  try {
    // Zaman aşımı olmadan yanıt vermeyen bir sunucu ajanı kilitler
    const y = await fetch(YAYIN_URL, { redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!y.ok) return { durum: "erişilemedi", http: y.status };
    const metin = await y.text();
    return {
      durum: "ok",
      http: y.status,
      ozet: crypto.createHash("sha256").update(metin).digest("hex"),
      boyut: metin.length,
      basliklar: {
        csp: y.headers.get("content-security-policy"),
        hsts: y.headers.get("strict-transport-security"),
        frame: y.headers.get("x-frame-options"),
        tipler: y.headers.get("x-content-type-options"),
      },
    };
  } catch (e) {
    return { durum: "hata", mesaj: String(e.message || e) };
  }
}

/* ---------------------------------------------- 3. riskli kod desenleri */
const DESENLER = [
  { ad: "eval() kullanımı", re: /\beval\s*\(/g, seviye: "yüksek" },
  { ad: "new Function()", re: /new\s+Function\s*\(/g, seviye: "yüksek" },
  { ad: "dangerouslySetInnerHTML", re: /dangerouslySetInnerHTML/g, seviye: "orta" },
  { ad: "doğrudan innerHTML ataması", re: /\.innerHTML\s*=/g, seviye: "orta" },
  { ad: "document.write", re: /document\.write\s*\(/g, seviye: "orta" },
  {
    ad: "gömülü API anahtarı olabilir",
    re: /(sk-[A-Za-z0-9]{16,}|api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_\-]{16,})/gi,
    seviye: "kritik",
  },
  { ad: "http:// (şifresiz) kaynak", re: /["']http:\/\/(?!localhost|www\.w3\.org)/g, seviye: "düşük" },
];

function kodTaramasi() {
  const bulgular = [];
  for (const dosya of kaynakDosyalari([".js", ".jsx", ".html"])) {
    const metin = oku(dosya);
    for (const d of DESENLER) {
      const eslesme = metin.match(d.re);
      if (eslesme) {
        bulgular.push({
          dosya: rel(dosya),
          desen: d.ad,
          seviye: d.seviye,
          adet: eslesme.length,
        });
      }
    }
  }
  // index.html da kontrol edilsin
  const idx = path.join(KOK, "index.html");
  if (fs.existsSync(idx)) {
    const metin = oku(idx);
    for (const d of DESENLER) {
      const e = metin.match(d.re);
      if (e) bulgular.push({ dosya: "index.html", desen: d.ad, seviye: d.seviye, adet: e.length });
    }
  }
  return bulgular;
}

/* ---------------------------------------------- çalıştır */
const acik = bagimlilikAciklari();
const yerelOzet = ozet(CIKTI);
const yayin = await yayindakiOzet();
const kod = kodTaramasi();

const dun = raporOku("guvenlik", new Date(Date.now() - 864e5).toISOString().slice(0, 10));
const oncekiOzet = dun?.butunluk?.yerel ?? null;

const uyarilar = [];
if (acik.kritik > 0) uyarilar.push(`${acik.kritik} kritik bağımlılık açığı var — hemen bak.`);
if (acik.yuksek > 0) uyarilar.push(`${acik.yuksek} yüksek seviye bağımlılık açığı var.`);
for (const b of kod.filter((x) => x.seviye === "kritik"))
  uyarilar.push(`${b.dosya}: ${b.desen} (${b.adet})`);

if (yayin.durum === "ok" && yerelOzet && yayin.ozet !== yerelOzet) {
  uyarilar.push(
    "Yayındaki dosya yerel derlemeyle aynı değil. Ya yeni sürüm yayınlanmadı ya da dosya değiştirildi."
  );
}
if (yayin.durum === "ok" && !yayin.basliklar.csp)
  uyarilar.push("Yayında Content-Security-Policy başlığı yok.");
/*
 * "Çıktı dosyası dünden beri değişti" her derlemede tetikleniyordu; yani
 * her gün. Sürekli yanan bir uyarı, uyarı olmaktan çıkar — kullanıcıyı
 * hepsini görmezden gelmeye alıştırır. Bu bilgi artık uyarı değil, not.
 */
const notlar = [];
if (oncekiOzet && yerelOzet && oncekiOzet !== yerelOzet)
  notlar.push("Çıktı dosyası dünden beri değişti — yeni derleme yapılmış.");

const durum = uyarilar.length === 0 ? "temiz" : acik.kritik > 0 ? "kritik" : "dikkat";

baslik("1. AJAN · GÜVENLİK");
console.log("Bağımlılık açıkları:", acik);
console.log("Riskli desen bulgusu:", kod.length);
if (acik.kabulEdilen?.length) console.log(`Kabul edilmiş risk (sayılmadı): ${acik.kabulEdilen.join(", ")}`);
console.log("Yayın kontrolü:", yayin.durum);
console.log("Durum:", durum);
uyarilar.forEach((u) => console.log("  ⚠ " + u));

const { dosya } = raporYaz("guvenlik", {
  durum,
  bagimlilik: acik,
  butunluk: { yerel: yerelOzet, yayin, oncekiGun: oncekiOzet },
  kodBulgulari: kod,
  uyarilar,
  notlar,
  kapsamNotu:
    "Uygulama statik olduğu için sunucu tarafı saldırı tespiti kapsam dışıdır. Ölçülen şeyler: bağımlılık açıkları, dosya bütünlüğü, riskli kod desenleri ve HTTP güvenlik başlıkları.",
});
console.log("Rapor:", rel(dosya));
