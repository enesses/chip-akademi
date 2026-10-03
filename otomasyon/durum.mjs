/**
 * Ajan durum panosu.
 *   node otomasyon/durum.mjs
 *
 * "Ajanlar bugün çalıştı mı?" sorusunun tek cevabı burası. Her ajanın son
 * çalışma zamanını, gecikip gecikmediğini ve zamanlayıcının kurulu olup
 * olmadığını gösterir.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, RAPOR_DIZINI, baslik, calistir } from "./ortak.mjs";

const AJANLAR = [
  { id: "yenileme", ad: "Yenileme", saat: "06:00", periyot: 1 },
  { id: "guvenlik", ad: "Güvenlik", saat: "09:00", periyot: 1 },
  { id: "iyilestirme", ad: "İyileştirme", saat: "10:00", periyot: 1 },
  { id: "gelistirme", ad: "Geliştirme", saat: "11:00", periyot: 1 },
  { id: "rapor", ad: "Rapor", saat: "11:05", periyot: 1 },
];

function sonCalisma(id) {
  if (!fs.existsSync(RAPOR_DIZINI)) return null;
  const dosyalar = fs
    .readdirSync(RAPOR_DIZINI)
    .filter((f) => f.startsWith(`${id}-`) && f.endsWith(".json"))
    .sort();
  if (dosyalar.length === 0) return null;
  const son = dosyalar[dosyalar.length - 1];
  try {
    const veri = JSON.parse(fs.readFileSync(path.join(RAPOR_DIZINI, son), "utf-8"));
    return { tarih: veri.tarih, zaman: veri.zaman, durum: veri.durum ?? "tamam" };
  } catch {
    return null;
  }
}

function gunFarki(tarihMetni) {
  const a = new Date(`${tarihMetni}T00:00:00Z`);
  const n = new Date();
  const b = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  return Math.round((b - a) / 864e5);
}

/* ---------------------------------------------- zamanlayıcı kurulu mu */
function zamanlayiciDurumu() {
  const bulgular = [];

  const cron = calistir("crontab -l");
  if (cron.ok && cron.cikti.includes("orkestrator.mjs")) {
    const satirlar = cron.cikti.split("\n").filter((s) => s.includes("orkestrator.mjs"));
    bulgular.push({ tur: "cron", kurulu: true, detay: `${satirlar.length} görev tanımlı` });
  } else {
    bulgular.push({ tur: "cron", kurulu: false, detay: "crontab'da görev yok" });
  }

  const wf = path.join(KOK, ".github", "workflows", "otomasyon.yml");
  if (fs.existsSync(wf)) {
    const git = calistir("git remote -v");
    const uzak = git.ok && git.cikti.trim().length > 0;
    bulgular.push({
      tur: "github-actions",
      kurulu: uzak,
      detay: uzak
        ? "workflow dosyası ve uzak depo var"
        : "workflow dosyası var ama depo GitHub'a bağlı değil — bu yüzden çalışmaz",
    });
  } else {
    bulgular.push({ tur: "github-actions", kurulu: false, detay: "workflow dosyası yok" });
  }

  return bulgular;
}

/* ---------------------------------------------- çıktı */
baslik("AJAN DURUMU");

const bugun = new Date().toISOString().slice(0, 10);
console.log(`Bugün: ${bugun}\n`);

let geciken = 0;
for (const a of AJANLAR) {
  const son = sonCalisma(a.id);
  if (!son) {
    console.log(`  ✗ ${a.ad.padEnd(12)} ${a.saat}   hiç çalışmamış`);
    geciken++;
    continue;
  }
  const fark = gunFarki(son.tarih);
  const gecikti = fark > a.periyot;
  if (gecikti) geciken++;
  const isaret = fark === 0 ? "✓" : gecikti ? "✗" : "•";
  const ne = fark === 0 ? "bugün" : fark === 1 ? "dün" : `${fark} gün önce`;
  console.log(
    `  ${isaret} ${a.ad.padEnd(12)} ${a.saat}   son: ${ne.padEnd(12)} durum: ${son.durum}`
  );
}

console.log("\nZamanlayıcı:");
const zaman = zamanlayiciDurumu();
for (const z of zaman) {
  console.log(`  ${z.kurulu ? "✓" : "✗"} ${z.tur.padEnd(16)} ${z.detay}`);
}

const hicKurulu = zaman.every((z) => !z.kurulu);
console.log(`\n${"═".repeat(60)}`);
if (hicKurulu) {
  console.log("KURULU ZAMANLAYICI YOK — ajanlar kendiliğinden çalışmaz.");
  console.log("Kurulum için:");
  console.log("  bash otomasyon/kur.sh            # bu makinede günlük cron");
  console.log("  ya da projeyi GitHub'a it        # .github/workflows/otomasyon.yml devreye girer");
} else if (geciken > 0) {
  console.log(`${geciken} ajan gecikmiş. Elle çalıştır: node otomasyon/orkestrator.mjs`);
} else {
  console.log("Her şey güncel.");
}
