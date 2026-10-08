/**
 * Haftalık rapor — bir haftada otomasyonun ve uygulamanın ne yaptığı.
 *
 *   node otomasyon/haftalik.mjs                 → geçen hafta (Pazartesi–Pazar)
 *   node otomasyon/haftalik.mjs --bu-hafta      → bu hafta, bugüne kadar
 *   node otomasyon/haftalik.mjs --bas 2026-10-05 --son 2026-10-11
 *
 * Çıktılar:
 *   src/data/haftalik.json                      (uygulamadaki Haftalık rapor sayfası; son 12 hafta)
 *   otomasyon/raporlar/haftalik-<YYYY-Www>.md   (okunur metin)
 *
 * Her sayı aşağıdaki kayıtlardan hesaplanır, tahmin yok:
 *   otomasyon/raporlar/rapor-<gün>.json, yenileme-<gün>.json, oneriler-<gün>.json
 *   otomasyon/gecmis/bugun-<gün>.json, fiyatlar-<gün>.json
 *   otomasyon/uygulanan.json (oneri-uygula.mjs günlüğü)
 *   git log (main)
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, calistir } from "./ortak.mjs";

const RAPOR = path.join(KOK, "otomasyon", "raporlar");
const GECMIS = path.join(KOK, "otomasyon", "gecmis");
const CIKTI = path.join(KOK, "src", "data", "haftalik.json");
const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const arg = (ad) => { const i = process.argv.indexOf(`--${ad}`); return i > 0 ? process.argv[i + 1] : null; };
const iso = (d) => d.toISOString().slice(0, 10);
const gun = (s) => new Date(`${s}T00:00:00Z`);
const ekle = (s, n) => { const d = gun(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const okuJson = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf-8")); } catch { return null; } };
const trTarih = (s) => { const d = gun(s); return `${d.getUTCDate()} ${AY[d.getUTCMonth()]}`; };

/** ISO hafta etiketi: 2026-W41 */
function haftaEtiketi(s) {
  const d = gun(s);
  const g = (d.getUTCDay() + 6) % 7; // Pazartesi = 0
  d.setUTCDate(d.getUTCDate() - g + 3); // haftanın perşembesi
  const yil = d.getUTCFullYear();
  const ilkPersembe = new Date(Date.UTC(yil, 0, 4));
  const hafta = 1 + Math.round(((d - ilkPersembe) / 86400000 - 3 + ((ilkPersembe.getUTCDay() + 6) % 7)) / 7);
  return `${yil}-W${String(hafta).padStart(2, "0")}`;
}

function aralikBul() {
  if (arg("bas") && arg("son")) return { bas: arg("bas"), son: arg("son"), kismi: false };
  const bugun = iso(new Date());
  const g = (gun(bugun).getUTCDay() + 6) % 7;
  const buPazartesi = ekle(bugun, -g);
  if (process.argv.includes("--bu-hafta")) return { bas: buPazartesi, son: bugun, kismi: true };
  return { bas: ekle(buPazartesi, -7), son: ekle(buPazartesi, -1), kismi: false };
}

function githubDepo() {
  const r = calistir("git remote get-url origin");
  const m = /github\.com[/:]([^/]+\/[^/.\s]+)/.exec(r.cikti || "");
  return `https://github.com/${m ? m[1] : "enesses/chip-akademi"}`;
}

const { bas, son, kismi } = aralikBul();
const gunler = [];
for (let d = bas; d <= son; d = ekle(d, 1)) gunler.push(d);
const hafta = haftaEtiketi(bas);

/* ── günlük çalıştırmalar ─────────────────────────────────────────────── */
const calisma = gunler.map((d) => {
  const r = okuJson(path.join(RAPOR, `rapor-${d}.json`));
  const y = okuJson(path.join(RAPOR, `yenileme-${d}.json`));
  const fiyatAdim = y?.adimlar?.find((a) => a.ad === "Fiyat verisi");
  return {
    tarih: d,
    durum: r ? r.durum : "calismadi",
    dikkat: r?.dikkat?.length ?? 0,
    fiyat: !fiyatAdim ? null : fiyatAdim.durum === "ok" ? "güncellendi" : /izin engeli/i.test(fiyatAdim.detay) || /izin engeli/i.test(r?.dikkat?.map((x) => x.metin).join(" ") || "") ? "izin engeli" : fiyatAdim.durum === "atlandı" ? "aynı gün" : "güncellenmedi",
  };
});

/* ── Bugün puanları ───────────────────────────────────────────────────── */
const bugunSerisi = gunler.map((d) => {
  const b = okuJson(path.join(GECMIS, `bugun-${d}.json`));
  if (!b) return { tarih: d, puan: null };
  return { tarih: d, puan: b.puan?.deger ?? null, etiket: b.puan?.etiket ?? null, madde: b.maddeler?.length ?? 0, tekrar: (b.maddeler || []).filter((m) => m.tekrar).length };
});
const puanlar = bugunSerisi.map((x) => x.puan).filter((x) => x != null);

/* ── fiyatlar: haftanın ilk ve son ölçümü ─────────────────────────────── */
const fiyatGunleri = gunler.filter((d) => fs.existsSync(path.join(GECMIS, `fiyatlar-${d}.json`)));
let fiyat = { olcumGunu: fiyatGunleri.length, izinEngeliGunu: calisma.filter((c) => c.fiyat === "izin engeli").length };
if (fiyatGunleri.length) {
  // Haftanın başındaki taban: hafta içindeki ilk ölçüm ya da ondan önceki son arşiv
  const tumArsiv = fs.readdirSync(GECMIS).filter((f) => /^fiyatlar-\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.slice(9, 19)).sort();
  const oncekiler = tumArsiv.filter((d) => d < bas);
  const tabanGun = oncekiler.at(-1) || fiyatGunleri[0];
  const sonGun = fiyatGunleri.at(-1);
  if (tabanGun !== sonGun) {
    const harita = (d) => new Map((okuJson(path.join(GECMIS, `fiyatlar-${d}.json`))?.satirlar || []).filter((r) => typeof r[1] === "number").map((r) => [r[0].toLowerCase().replace(/[\s-]+/g, ""), { model: r[0], medyan: r[1], saglayici: r[3] }]));
    const a = harita(tabanGun), b = harita(sonGun);
    const hareket = [];
    for (const [k, y] of b) {
      const x = a.get(k);
      if (!x || !(y.saglayici >= 10)) continue;
      hareket.push({ model: y.model, once: x.medyan, sonra: y.medyan, degisim: Math.round(((y.medyan - x.medyan) / x.medyan) * 1000) / 10 });
    }
    hareket.sort((p, q) => Math.abs(q.degisim) - Math.abs(p.degisim));
    fiyat = { ...fiyat, taban: tabanGun, son: sonGun, h100: hareket.find((h) => h.model === "Nvidia H100") || null, enCokOynayan: hareket.filter((h) => h.degisim !== 0).slice(0, 5) };
  }
}

/* ── öneriler ve uygulananlar ─────────────────────────────────────────── */
const onerilenBasliklar = new Set();
for (const d of gunler) for (const o of okuJson(path.join(RAPOR, `oneriler-${d}.json`))?.oneriler || []) onerilenBasliklar.add(o.baslik);
const uygulanan = (okuJson(path.join(KOK, "otomasyon", "uygulanan.json"))?.kayitlar || []).filter((k) => k.tarih >= bas && k.tarih <= son);

/* ── git: haftanın kod değişiklikleri ─────────────────────────────────── */
if (calistir("git rev-parse --is-shallow-repository").cikti?.trim() === "true") {
  // Otomasyon depoyu --depth 1 klonluyor; haftanın geçmişini çek.
  calistir(`git fetch -q --shallow-since=${ekle(bas, -1)} origin main`, { timeout: 2 * 60 * 1000 });
}
const depo = githubDepo();
const log = calistir(`git log origin/main --since=${bas}T00:00:00+03:00 --until=${ekle(son, 1)}T00:00:00+03:00 --format=%H%x09%ad%x09%s --date=short`);
const gunlukCommit = [], degisiklikler = [];
for (const l of (log.ok ? log.cikti : "").split("\n").filter(Boolean)) {
  const [hash, tarih, ...k] = l.split("\t");
  const baslik = k.join("\t");
  if (/^(Günlük otomasyon|Otomasyon:|Haftalık rapor)/.test(baslik)) { gunlukCommit.push(tarih); continue; }
  if (/^Merge /.test(baslik)) continue;
  const pr = /\(#(\d+)\)\s*$/.exec(baslik)?.[1];
  degisiklikler.push({ tarih, baslik: baslik.replace(/\s*\(#\d+\)\s*$/, ""), pr: pr ? Number(pr) : null, url: pr ? `${depo}/pull/${pr}` : `${depo}/commit/${hash}` });
}
degisiklikler.sort((a, b) => a.tarih.localeCompare(b.tarih));

/* ── özet cümleleri (yalnızca yukarıdaki sayılardan) ──────────────────── */
const say = {
  calisanGun: calisma.filter((c) => c.durum !== "calismadi").length,
  temizGun: calisma.filter((c) => c.durum === "temiz").length,
  kritikGun: calisma.filter((c) => c.durum === "kritik").length,
  oneri: onerilenBasliklar.size,
  uygulananBirlesen: uygulanan.filter((k) => k.durum === "birlesti" && k.kim !== "elle").length,
  elleUygulanan: uygulanan.filter((k) => k.durum === "birlesti" && k.kim === "elle").length,
  uygulananAcik: uygulanan.filter((k) => k.durum === "acik").length,
  uygulananVazgecilen: uygulanan.filter((k) => k.durum === "vazgecildi").length,
  degisiklik: degisiklikler.length,
  bugunOrtalama: puanlar.length ? Math.round(puanlar.reduce((a, b) => a + b, 0) / puanlar.length) : null,
  tekrarHaber: bugunSerisi.reduce((t, x) => t + (x.tekrar || 0), 0),
};
const ozet = [];
ozet.push(`Otomasyon ${gunler.length} günlük dönemde ${say.calisanGun} gün çalıştı: ${say.temizGun} gün temiz${say.kritikGun ? `, ${say.kritikGun} gün kritik uyarıyla` : ""} bitti.`);
if (say.degisiklik) ozet.push(`Uygulamaya ${say.degisiklik} değişiklik girdi${say.uygulananBirlesen ? `; bunların ${say.uygulananBirlesen} tanesi otomasyonun kendi uyguladığı geliştirme önerisi` : ""}.`);
if (say.elleUygulanan) ozet.push(`${say.elleUygulanan} geliştirme önerisi sohbette elle uygulandı.`);
const otoDenenen = uygulanan.filter((k) => k.kim !== "elle").length;
if (say.oneri) ozet.push(`Hafta boyunca ${say.oneri} farklı geliştirme önerisi yazıldı${otoDenenen ? `; otomasyon ${otoDenenen} tanesini denedi (${say.uygulananBirlesen} birleşti, ${say.uygulananAcik} onay bekliyor, ${say.uygulananVazgecilen} bırakıldı)` : ""}.`);
if (fiyat.h100) ozet.push(`H100 kiralama medyanı ${fiyat.h100.once} → ${fiyat.h100.sonra} $/saat (%${fiyat.h100.degisim > 0 ? "+" : ""}${fiyat.h100.degisim}).`);
if (fiyat.izinEngeliGunu) ozet.push(`Fiyat sayfası ${fiyat.izinEngeliGunu} gün izin engeline takıldı; o günlerde fiyat uydurulmadı, eski veri korundu.`);
if (say.bugunOrtalama != null) ozet.push(`Bugün sayfasının ortalama pozitiflik puanı ${say.bugunOrtalama}/100${say.tekrarHaber ? `; ${say.tekrarHaber} tekrar eden haber puana katılmadı` : ""}.`);

const rapor = {
  hafta, bas, son, kismi,
  baslik: `${trTarih(bas)} – ${trTarih(son)}${kismi ? " (bugüne kadar)" : ""}`,
  olusturma: new Date().toISOString(),
  ozet, sayilar: say, gunler: calisma, bugun: bugunSerisi, fiyat,
  uygulanan, degisiklikler, gunlukCommit: gunlukCommit.length,
};

/* ── yaz ──────────────────────────────────────────────────────────────── */
const veri = okuJson(CIKTI) || { aciklama: "Haftalık rapor — otomasyon/haftalik.mjs üretir.", haftalar: [] };
veri.haftalar = [rapor, ...veri.haftalar.filter((h) => h.hafta !== hafta)].sort((a, b) => b.bas.localeCompare(a.bas)).slice(0, 12);
veri.guncelleme = iso(new Date());
fs.writeFileSync(CIKTI, JSON.stringify(veri, null, 2) + "\n", "utf-8");

const md = [
  `# Haftalık rapor — ${rapor.baslik} (${hafta})`, "",
  ...ozet.map((s) => `- ${s}`), "",
  "## Bu hafta uygulamaya girenler", "",
  ...(degisiklikler.length ? degisiklikler.map((d) => `- ${trTarih(d.tarih)}: ${d.baslik}${d.pr ? ` ([#${d.pr}](${d.url}))` : ""}`) : ["- Kod değişikliği yok."]), "",
  "## Uygulanan öneriler", "",
  ...(uygulanan.length ? uygulanan.map((k) => `- ${trTarih(k.tarih)} · **${k.durum === "birlesti" ? "birleşti" : k.durum === "acik" ? "onay bekliyor" : "bırakıldı"}**${k.kim === "elle" ? " (sohbette elle)" : ""} · ${k.oneri}${k.pr ? ` ([#${k.pr}](${depo}/pull/${k.pr}))` : ""}${k.neden ? ` — ${k.neden}` : ""}`) : ["- Bu hafta uygulanan öneri yok."]), "",
  "## Günler", "",
  "| Gün | Durum | Fiyat | Bugün puanı |", "|---|---|---|---|",
  ...gunler.map((d, i) => `| ${trTarih(d)} | ${calisma[i].durum} | ${calisma[i].fiyat ?? "—"} | ${bugunSerisi[i].puan ?? "—"} |`), "",
];
fs.mkdirSync(RAPOR, { recursive: true });
const mdYol = path.join(RAPOR, `haftalik-${hafta}.md`);
fs.writeFileSync(mdYol, md.join("\n"), "utf-8");

console.log(`✓ Haftalık rapor: ${rapor.baslik} (${hafta})`);
for (const s of ozet) console.log("  · " + s);
console.log(`  → src/data/haftalik.json, ${path.relative(KOK, mdYol)}`);
