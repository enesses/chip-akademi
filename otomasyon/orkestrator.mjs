/**
 * Orkestratör — ajanları sırayla çalıştırır.
 *   node otomasyon/orkestrator.mjs           # hepsi
 *   node otomasyon/orkestrator.mjs guvenlik  # tek ajan
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, baslik, calistir } from "./ortak.mjs";

const SIRA = ["yenileme", "guvenlik", "iyilestirme", "gelistirme", "rapor"];
const DOSYA = {
  guvenlik: "1-guvenlik.mjs",
  iyilestirme: "2-iyilestirme.mjs",
  yenileme: "3-yenileme.mjs",
  gelistirme: "4-gelistirme.mjs",
  rapor: "5-rapor.mjs",
};

const istenen = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const liste = istenen.length ? istenen : SIRA;
const kuru = process.argv.includes("--kuru");

for (const ad of liste) {
  if (!DOSYA[ad]) {
    console.error(`Bilinmeyen ajan: ${ad}. Seçenekler: ${SIRA.join(", ")}`);
    process.exit(1);
  }
  const r = calistir(`node otomasyon/ajanlar/${DOSYA[ad]}${kuru ? " --kuru" : ""}`);
  console.log(r.cikti);
  if (!r.ok) console.error(`⚠ ${ad} ajanı hata döndürdü (devam ediliyor).`);
}

/*
 * Rapor ajanı otomasyon.json'u derlemeden SONRA yazar. Son bir derleme yapılmazsa
 * uygulamadaki Otomasyon sayfası bir önceki günün raporunu gösterir.
 */
if (liste.includes("rapor") && !kuru) {
  baslik("SON DERLEME");
  const b = calistir("npx vite build");
  const t = b.ok ? calistir("python3 build-single.py") : { ok: false, cikti: "" };
  console.log(b.ok && t.ok ? "✓ " + t.cikti.trim().split("\n").pop() : "✗ son derleme başarısız");
  if (b.ok && t.ok) {
    // Yayın kopyası: GitHub Pages /docs klasöründen sunar.
    fs.mkdirSync(path.join(KOK, "docs"), { recursive: true });
    fs.copyFileSync(path.join(KOK, "chip-akademi.html"), path.join(KOK, "docs", "index.html"));
    console.log("✓ docs/index.html güncellendi");
  }
}

baslik("ORKESTRATÖR TAMAMLANDI");
console.log(`Çalıştırılan: ${liste.join(", ")}`);
console.log("Raporlar: otomasyon/raporlar/");
