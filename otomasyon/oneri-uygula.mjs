/**
 * Geliştirme önerisi uygulama — denetim ve günlük.
 *
 * Günlük görev (GUNLUK.md 6a) bir öneriyi ayrı bir dalda uygular, sonra bu
 * betikle denetler. Birleştirme kararı burada verilir; görev "bu sefer sorun
 * olmaz" diye kuralı esnetemesin diye kural kodda.
 *
 *   node otomasyon/oneri-uygula.mjs denetle [--taban origin/main]
 *     → JSON: { uygun, nedenler[], dosyalar[], satir, testler{} }
 *       uygun=true ise görev PR'ı kendisi birleştirebilir.
 *
 *   node otomasyon/oneri-uygula.mjs kaydet --oneri "<başlık>" --durum birlesti|acik|vazgecildi
 *        [--pr 12] [--dal otomasyon/oneri-…] [--neden "…"] [--ozet "ne değişti"]
 *     → otomasyon/uygulanan.json günlüğüne bir kayıt ekler (haftalık rapor buradan okur).
 *
 * Kendiliğinden birleştirme kuralı (kullanıcının 8 Ekim 2026 kararı):
 *   - derleme, tek dosya, gerçek Chromium'da arayüz testi ve güvenlik taraması geçmeli;
 *   - korunan dosyalara dokunmamalı (bağımlılıklar, otomasyonun kendisi, derleme ayarları);
 *   - küçük olmalı: en fazla 10 dosya, 400 değişen satır.
 * Koşullardan biri tutmazsa PR açık kalır ve kullanıcıyı bekler.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, calistir, bugunTarih } from "./ortak.mjs";

const KORUNAN = [
  /^package(-lock)?\.json$/,
  /^otomasyon\//,
  /^\.github\//,
  /^build-single\.py$/,
  /^(vite|tailwind|postcss)\.config\.js$/,
  /^docs\//,
  /^index\.html$/,
];
const SINIR = { dosya: 10, satir: 400 };
const GUNLUK = path.join(KOK, "otomasyon", "uygulanan.json");

function arg(ad, varsayilan = null) {
  const i = process.argv.indexOf(`--${ad}`);
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : varsayilan;
}

function denetle() {
  const taban = arg("taban", "origin/main");
  const nedenler = [];

  // Değişen dosyalar (commit'lenmiş + commit'lenmemiş)
  const fark = calistir(`git diff --numstat ${taban}`);
  if (!fark.ok) return { uygun: false, nedenler: [`git diff başarısız: ${fark.cikti.trim()}`], dosyalar: [], testler: {} };
  const dosyalar = [];
  let satir = 0;
  for (const l of fark.cikti.split("\n").filter(Boolean)) {
    const [ekl, sil, ad] = l.split("\t");
    dosyalar.push(ad);
    satir += (Number(ekl) || 0) + (Number(sil) || 0);
  }
  const yeni = calistir("git ls-files --others --exclude-standard");
  for (const ad of (yeni.cikti || "").split("\n").filter(Boolean)) if (!dosyalar.includes(ad)) dosyalar.push(ad);

  if (dosyalar.length === 0) nedenler.push("değişiklik yok");
  const korunan = dosyalar.filter((d) => KORUNAN.some((k) => k.test(d)));
  if (korunan.length) nedenler.push(`korunan dosya: ${korunan.join(", ")}`);
  if (dosyalar.length > SINIR.dosya) nedenler.push(`çok dosya: ${dosyalar.length} (sınır ${SINIR.dosya})`);
  if (satir > SINIR.satir) nedenler.push(`çok satır: ${satir} (sınır ${SINIR.satir})`);

  // Testler — sırayla; biri kırılırsa sonrakiler anlamsız
  const testler = {};
  const derleme = calistir("npx vite build");
  testler.derleme = derleme.ok;
  if (!derleme.ok) nedenler.push("derleme kırıldı");
  if (derleme.ok) {
    const tek = calistir("python3 build-single.py");
    testler.tekDosya = tek.ok;
    if (!tek.ok) nedenler.push("tek dosya üretilemedi");
    if (tek.ok) {
      const ui = calistir("node otomasyon/ui-testi.mjs --json", { timeout: 8 * 60 * 1000 });
      let uiSonuc = null;
      try { uiSonuc = JSON.parse(ui.cikti.trim().split("\n").pop()); } catch {}
      testler.arayuz = uiSonuc ? `${uiSonuc.gecen}/${uiSonuc.toplam}` : "okunamadı";
      if (!uiSonuc || uiSonuc.durum !== "temiz") nedenler.push(`arayüz testi: ${testler.arayuz}${uiSonuc?.hatalar?.length ? " — " + uiSonuc.hatalar.slice(0, 2).map((h) => `${h.sayfa}: ${h.detay}`).join("; ") : ""}`);
    }
  }
  // Güvenlik ajanı kendi raporunu diske yazar; denetim dalın farkına girmesin diye geri alınır.
  const guv = calistir("node otomasyon/ajanlar/1-guvenlik.mjs");
  const durum = /Durum:\s*(\S+)/.exec(guv.cikti || "")?.[1] || "okunamadı";
  testler.guvenlik = durum;
  calistir("git checkout -- otomasyon/raporlar");
  if (durum !== "temiz") nedenler.push(`güvenlik taraması: ${durum}`);

  return { uygun: nedenler.length === 0, nedenler, dosyalar, satir, testler, sinir: SINIR };
}

function kaydet() {
  const oneri = arg("oneri");
  const durum = arg("durum");
  if (!oneri) throw new Error("--oneri gerekli");
  if (!["birlesti", "acik", "vazgecildi"].includes(durum)) throw new Error("--durum birlesti|acik|vazgecildi olmalı");
  let g = { aciklama: "Otomasyonun uyguladığı geliştirme önerileri. Haftalık rapor buradan okur.", kayitlar: [] };
  try { g = JSON.parse(fs.readFileSync(GUNLUK, "utf-8")); } catch {}
  const pr = arg("pr");
  g.kayitlar.push({
    tarih: bugunTarih(),
    oneri,
    durum,
    pr: pr ? Number(pr) : null,
    dal: arg("dal"),
    ozet: arg("ozet"),
    neden: arg("neden"),
  });
  fs.writeFileSync(GUNLUK, JSON.stringify(g, null, 2) + "\n", "utf-8");
  return g.kayitlar.at(-1);
}

const komut = process.argv[2];
if (komut === "denetle") {
  const s = denetle();
  console.log(JSON.stringify(s, null, 2));
  process.exit(s.uygun ? 0 : 2);
} else if (komut === "kaydet") {
  console.log(JSON.stringify(kaydet()));
} else {
  console.error("kullanım: node otomasyon/oneri-uygula.mjs denetle | kaydet --oneri … --durum …");
  process.exit(64);
}
