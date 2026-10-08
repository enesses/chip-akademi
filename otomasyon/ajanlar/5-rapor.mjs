/**
 * 5. AJAN — RAPOR
 *
 * Diğer dört ajanın günlük çıktılarını toplar, tek bir özet üretir.
 * İki biçimde yazar: terminal için metin, arşiv için HTML.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, RAPOR_DIZINI, baslik, bugunTarih, calistir, gunFarki, oku, raporOku, raporYaz, rel } from "../ortak.mjs";

// Bayraklar (--tamamla gibi) tarih argümanıyla karıştırılmamalı
const argumanlar = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const TARIH = argumanlar[0] || bugunTarih();
const AJANLAR = [
  { id: "guvenlik", ad: "Güvenlik", saat: "10:00" },
  { id: "iyilestirme", ad: "İyileştirme", saat: "10:00" },
  { id: "yenileme", ad: "Yenileme", saat: "10:00" },
  { id: "gelistirme", ad: "Geliştirme", saat: "10:00" },
];

const TAMAMLA = process.argv.includes("--tamamla");

let raporlar = AJANLAR.map((a) => ({ ...a, veri: raporOku(a.id, TARIH) }));

/* ---------------------------------------------- nöbetçi: eksik ajanları çalıştır
 * Ajanların "her gün her şeyi yapması" ancak biri bunu denetlerse mümkün.
 * Zamanlanmış bir çalışma atlanmış olabilir (GitHub Actions cron'u garantili
 * değildir), makine kapalı olabilir, bir ajan çökmüş olabilir. Rapor ajanı bu
 * yüzden sadece özet çıkarmaz; günün tamamlanıp tamamlanmadığını denetler ve
 * --tamamla verilirse eksikleri kendisi çalıştırır.
 */
const DOSYA = {
  guvenlik: "1-guvenlik.mjs",
  iyilestirme: "2-iyilestirme.mjs",
  yenileme: "3-yenileme.mjs",
  gelistirme: "4-gelistirme.mjs",
};

const eksikler = raporlar.filter((r) => !r.veri).map((r) => r.id);
const tamamlanan = [];

if (eksikler.length && TAMAMLA && TARIH === bugunTarih()) {
  console.log(`Eksik ajan(lar): ${eksikler.join(", ")} — çalıştırılıyor…\n`);
  // Sıra önemli: geliştirme, iyileştirmenin raporuna bağlı.
  for (const id of ["yenileme", "guvenlik", "iyilestirme", "gelistirme"]) {
    if (!eksikler.includes(id)) continue;
    const r = calistir(`node otomasyon/ajanlar/${DOSYA[id]}`);
    console.log(`  ${r.ok ? "✓" : "✗"} ${id} çalıştırıldı`);
    if (r.ok) tamamlanan.push(id);
  }
  raporlar = AJANLAR.map((a) => ({ ...a, veri: raporOku(a.id, TARIH) }));
  console.log("");
}

/* ---------------------------------------------- dikkat gerektirenler */
const dikkat = [];

/* ---------------------------------------------- veri tazeliği (ajanlardan bağımsız)
 * Bu kontrol 2. ajana bırakılmıyor: o ajan çalışmadıysa eskime hiç fark
 * edilmez. En kritik iki veri burada doğrudan okunur.
 */
const tazelik = [];
for (const [ad, dosya, alan, esik] of [
  ["Bugün sayfası", "src/data/bugun.json", "tarih", 1],
  ["Fiyat verisi", "src/data/gpu_kiralama.json", null, 3],
]) {
  try {
    const j = JSON.parse(oku(path.join(KOK, dosya)));
    const t = alan ? j[alan] : j.kaynak.cekildigi_tarih;
    const gun = gunFarki(t);
    tazelik.push({ ad, tarih: t, gun });
    if (gun > esik)
      dikkat.push({
        seviye: gun > esik * 3 ? "kritik" : "uyarı",
        metin: `${ad} ${gun} gün eski (eşik ${esik} gün).`,
      });
  } catch {
    /* dosya yoksa sessiz geç */
  }
}

// Eksik kalan ajanlar sessizce geçilmemeli
for (const r of raporlar.filter((x) => !x.veri))
  dikkat.push({ seviye: "uyarı", metin: `${r.ad} ajanı bugün hiç çalışmadı.` });
const g = raporlar.find((r) => r.id === "guvenlik")?.veri;
if (g) {
  if (g.durum === "kritik") dikkat.push({ seviye: "kritik", metin: "Güvenlik: kritik bulgu var." });
  for (const u of g.uyarilar || []) dikkat.push({ seviye: "uyarı", metin: `Güvenlik: ${u}` });
}
const y = raporlar.find((r) => r.id === "yenileme")?.veri;
if (y) {
  for (const a of y.adimlar || [])
    if (a.durum === "hata" || a.durum === "uyari") dikkat.push({ seviye: a.durum === "hata" && /güncellenmedi/.test(a.detay) ? "kritik" : "uyarı", metin: `Yenileme · ${a.ad}: ${a.detay}` });
}
const i = raporlar.find((r) => r.id === "iyilestirme")?.veri;
const yuksekEtki = (i?.bulgular || []).filter((b) => b.etki === "yüksek");
for (const b of yuksekEtki) dikkat.push({ seviye: "uyarı", metin: `İyileştirme: ${b.baslik}` });
const d = raporlar.find((r) => r.id === "gelistirme")?.veri;
if (d?.durum === "geri-alindi")
  dikkat.push({ seviye: "kritik", metin: "Geliştirme: testler kırıldı, değişiklikler geri alındı." });
for (const t of d?.testler || [])
  if (!t.gecti) dikkat.push({ seviye: "kritik", metin: `Test başarısız: ${t.ad}${t.detay ? " — " + t.detay.split("\n").filter((x) => x.includes("↳") || x.includes("hata")).slice(0, 3).join(" | ").trim() : ""}` });

/* Günlük görevin (Claude) web'e bakarak yazdığı geliştirme önerileri */
let oneriler = [];
try {
  oneriler = JSON.parse(fs.readFileSync(path.join(RAPOR_DIZINI, `oneriler-${TARIH}.json`), "utf-8")).oneriler || [];
} catch {}

/* Otomasyonun bugün kendi uyguladığı öneriler (oneri-uygula.mjs günlüğü) */
let uygulanan = [], uygulananSon = [];
try {
  const kayitlar = JSON.parse(fs.readFileSync(path.join(KOK, "otomasyon", "uygulanan.json"), "utf-8")).kayitlar || [];
  uygulanan = kayitlar.filter((k) => k.tarih === TARIH);
  // Son 14 günün kayıtları: sayfa önerinin uygulanıp uygulanmadığını bunlardan işaretler.
  uygulananSon = kayitlar.filter((k) => gunFarki(k.tarih) <= 14).map(({ oneri, durum, pr, tarih, kim }) => ({ oneri, durum, pr, tarih, kim }));
} catch {}
for (const k of uygulanan.filter((k) => k.durum === "acik"))
  dikkat.push({ seviye: "dikkat", metin: `Öneri onay bekliyor: ${k.oneri}${k.pr ? ` (PR #${k.pr})` : ""} — ${k.neden || "korunan dosyaya dokunuyor"}` });

const gunTamam = raporlar.every((r) => r.veri);

/* ---------------------------------------------- terminal */
baslik(`5. AJAN · GÜNLÜK RAPOR — ${TARIH}`);

for (const r of raporlar) {
  if (!r.veri) {
    console.log(`\n${r.ad} (${r.saat}) · çalışmadı`);
    continue;
  }
  console.log(`\n${r.ad} (${r.saat}) · ${r.veri.durum ?? "tamam"}`);
  if (r.id === "guvenlik") {
    const b = r.veri.bagimlilik || {};
    console.log(`  Bağımlılık açığı: ${b.toplam ?? "?"} (kritik ${b.kritik ?? 0}, yüksek ${b.yuksek ?? 0})`);
    console.log(`  Riskli kod deseni: ${(r.veri.kodBulgulari || []).length}`);
  }
  if (r.id === "iyilestirme") {
    const o = r.veri.olcumler || {};
    console.log(`  Kapsam: ${o.veri?.chipSayisi} chip · ${o.egitim?.dersSayisi} ders · ${o.kod?.toplamSatir} satır`);
    console.log(`  Bulgu: ${(r.veri.bulgular || []).length} · yüksek etkili: ${yuksekEtki.length}`);
  }
  if (r.id === "yenileme")
    for (const a of r.veri.adimlar || []) console.log(`  ${a.durum === "ok" ? "✓" : a.durum === "atlandı" ? "–" : "✗"} ${a.ad}: ${a.detay}`);
  if (r.id === "gelistirme")
    console.log(`  Uygulanan: ${(r.veri.uygulanan || []).length} · atlanan: ${(r.veri.atlanan || []).length}`);
}

console.log(`\n${"═".repeat(60)}`);
if (dikkat.length === 0) console.log("Dikkat gerektiren bir şey yok.");
else {
  console.log(`DİKKAT (${dikkat.length})`);
  for (const x of dikkat) console.log(`  ${x.seviye === "kritik" ? "🔴" : "🟡"} ${x.metin}`);
}
if (oneriler.length) {
  console.log(`\nGELİŞTİRME ÖNERİLERİ (${oneriler.length})`);
  for (const o of oneriler) console.log(`  • [${o.etki ?? "orta"}] ${o.baslik} — ${o.neden}`);
}
if (uygulanan.length) {
  console.log(`\nUYGULANAN ÖNERİLER (${uygulanan.length})`);
  for (const k of uygulanan) console.log(`  • [${k.durum}] ${k.oneri}${k.pr ? ` — PR #${k.pr}` : ""}${k.neden ? ` (${k.neden})` : ""}`);
}

/* ---------------------------------------------- HTML arşiv */
const html = `<!doctype html><html lang="tr"><head><meta charset="UTF-8">
<title>Otomasyon Raporu ${TARIH}</title>
<style>
body{background:#0a0e14;color:#e6edf3;font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:2rem 1.25rem}
h1{font-size:1.6rem;margin:0 0 .3rem}.alt{color:#8b9aa9;font-size:.9rem;margin:0 0 2rem}
.kart{background:#111820;border:1px solid #1e2a36;border-radius:12px;padding:1.1rem;margin-bottom:.9rem}
.kart h2{font-size:1rem;margin:0 0 .5rem}
.rozet{font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;border-radius:5px;padding:.15rem .45rem;border:1px solid}
.ok{color:#34d399;border-color:#34d39955;background:#34d39915}
.uyari{color:#fbbf24;border-color:#fbbf2455;background:#fbbf2415}
.kritik{color:#f87171;border-color:#f8717155;background:#f8717115}
ul{margin:.5rem 0 0;padding-left:1.1rem;color:#b6c2ce;font-size:.87rem;line-height:1.7}
code{color:#22d3ee;font-size:.85rem}
</style></head><body>
<h1>Otomasyon Raporu</h1><p class="alt">${TARIH} · ${new Date().toLocaleString("tr-TR")}</p>

<div class="kart"><h2>Günün durumu <span class="rozet ${gunTamam ? "ok" : "uyari"}">${gunTamam ? "tamam" : "eksik"}</span></h2>
<ul>${raporlar.map((r) => `<li>${r.ad}: ${r.veri ? "çalıştı" : "<strong>çalışmadı</strong>"}</li>`).join("")}
${tazelik.map((t) => `<li>${t.ad}: ${t.gun === 0 ? "bugün güncellendi" : `${t.gun} gün eski`} (${t.tarih})</li>`).join("")}</ul></div>

<div class="kart"><h2>Dikkat gerektirenler
<span class="rozet ${dikkat.length === 0 ? "ok" : dikkat.some((x) => x.seviye === "kritik") ? "kritik" : "uyari"}">${dikkat.length}</span></h2>
${dikkat.length === 0 ? "<p style='color:#34d399;margin:.4rem 0 0'>Temiz.</p>" : `<ul>${dikkat.map((x) => `<li>${x.seviye === "kritik" ? "🔴" : "🟡"} ${x.metin}</li>`).join("")}</ul>`}
</div>

${raporlar
  .map(
    (r) => `<div class="kart"><h2>${r.ad} <span class="rozet ${!r.veri ? "uyari" : r.veri.durum === "kritik" || r.veri.durum === "geri-alindi" ? "kritik" : "ok"}">${r.veri ? r.veri.durum ?? "tamam" : "çalışmadı"}</span></h2>
<ul>${
      !r.veri
        ? "<li>Bu ajan bugün çalışmamış.</li>"
        : r.id === "guvenlik"
          ? `<li>Bağımlılık açığı: ${r.veri.bagimlilik?.toplam ?? "?"}</li><li>Riskli kod deseni: ${(r.veri.kodBulgulari || []).length}</li><li>${r.veri.kapsamNotu}</li>`
          : r.id === "iyilestirme"
            ? (r.veri.bulgular || []).map((b) => `<li>[${b.etki}] ${b.baslik}</li>`).join("")
            : r.id === "yenileme"
              ? (r.veri.adimlar || []).map((a) => `<li>${a.ad}: ${a.detay}</li>`).join("")
              : `<li>Uygulanan: ${(r.veri.uygulanan || []).length}</li><li>Atlanan: ${(r.veri.atlanan || []).length}</li><li>Testler: ${(r.veri.testler || []).map((t) => `${t.ad} ${t.gecti ? "✓" : "✗"}`).join(", ")}</li>`
    }</ul></div>`
  )
  .join("")}
</body></html>`;

fs.mkdirSync(RAPOR_DIZINI, { recursive: true });
const htmlDosya = path.join(RAPOR_DIZINI, `ozet-${TARIH}.html`);
fs.writeFileSync(htmlDosya, html, "utf-8");

/* ---------------------------------------------- uygulamaya besleme
 * Uygulama statik olduğu için raporları çalışma anında okuyamaz.
 * Bu yüzden özet, derlemeye girecek bir veri dosyasına yazılır ve
 * bir sonraki `npm run build` ile Otomasyon sayfasında görünür.
 */
const gecmis = fs
  .readdirSync(RAPOR_DIZINI)
  .filter((f) => f.startsWith("rapor-") && f.endsWith(".json"))
  .sort()
  .slice(-14)
  .map((f) => {
    try {
      const v = JSON.parse(fs.readFileSync(path.join(RAPOR_DIZINI, f), "utf-8"));
      return { tarih: v.tarih, durum: v.durum, dikkat: (v.dikkat || []).length };
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const uygulamaVerisi = {
  guncelleme: new Date().toISOString(),
  tarih: TARIH,
  durum: dikkat.some((x) => x.seviye === "kritik") ? "kritik" : dikkat.length ? "dikkat" : "temiz",
  ajanlar: AJANLAR.map((a) => {
    const v = raporlar.find((r) => r.id === a.id)?.veri;
    return {
      id: a.id,
      ad: a.ad,
      saat: a.saat,
      calisti: !!v,
      durum: v?.durum ?? null,
      zaman: v?.zaman ?? null,
    };
  }),
  dikkat,
  oneriler,
  uygulanan,
  uygulananSon,
  guvenlik: g
    ? {
        durum: g.durum,
        bagimlilik: g.bagimlilik,
        kodBulgusu: (g.kodBulgulari || []).length,
        kapsamNotu: g.kapsamNotu,
      }
    : null,
  iyilestirme: i
    ? { olcumler: i.olcumler, bulgular: (i.bulgular || []).slice(0, 12) }
    : null,
  yenileme: y ? { durum: y.durum, adimlar: y.adimlar } : null,
  gelistirme: d
    ? {
        durum: d.durum,
        uygulanan: (d.uygulanan || []).length,
        atlanan: (d.atlanan || []).length,
        testler: d.testler || [],
      }
    : null,
  gecmis,
};

const veriDosyasi = path.join(KOK, "src", "data", "otomasyon.json");
fs.writeFileSync(veriDosyasi, JSON.stringify(uygulamaVerisi, null, 2), "utf-8");
console.log(`Uygulama verisi: ${rel(veriDosyasi)} (bir sonraki derlemede görünür)`);

console.log(
  gunTamam
    ? `\nGün tamam: ${AJANLAR.length} ajanın hepsi çalıştı.`
    : `\nGün EKSİK: ${raporlar.filter((r) => !r.veri).map((r) => r.ad).join(", ")} çalışmadı.` +
        (TAMAMLA ? "" : "  (--tamamla ile eksikler otomatik çalıştırılır)")
);

const { dosya } = raporYaz("rapor", {
  durum: dikkat.some((x) => x.seviye === "kritik") ? "kritik" : dikkat.length ? "dikkat" : "temiz",
  gunTamam,
  tazelik,
  otomatikTamamlanan: tamamlanan,
  calisan: raporlar.filter((r) => r.veri).map((r) => r.id),
  calismayan: raporlar.filter((r) => !r.veri).map((r) => r.id),
  dikkat,
});
console.log(`\nHTML özet: ${rel(htmlDosya)}`);
console.log(`JSON: ${rel(dosya)}`);
