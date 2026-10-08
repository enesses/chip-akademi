/**
 * Arayüz duman testi — derlenmiş chip-akademi.html'i gerçek bir Chromium'da açar,
 * her sayfayı dolaşır, ana akışları tıklar ve JS hatası / kırık görsel arar.
 *
 *   node otomasyon/ui-testi.mjs          # insan okunur çıktı
 *   node otomasyon/ui-testi.mjs --json   # makine okunur çıktı (son satır)
 *
 * Çıkış kodu: 0 = temiz, 1 = hata bulundu, 2 = test çalıştırılamadı (Chromium yok).
 * jsdom kullanılmıyor: <script type="module"> çalıştırmadığı için boş sayfayı
 * "hatasız" sayıyor ve gerçek kırılmaları gizliyordu.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { KOK } from "./ortak.mjs";

const JSON_MOD = process.argv.includes("--json");
const html = path.join(KOK, "chip-akademi.html");
const cikis = (kod, veri) => {
  if (JSON_MOD) console.log(JSON.stringify(veri));
  process.exit(kod);
};

if (!fs.existsSync(html)) cikis(2, { durum: "calismadi", neden: "chip-akademi.html yok — önce derle" });

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  cikis(2, { durum: "calismadi", neden: "playwright kurulu değil (npm i --no-save playwright)" });
}

async function tarayici() {
  try {
    return await chromium.launch({ headless: true });
  } catch (e) {
    // Bazı ortamlarda Playwright'ın beklediği sürüm yerine başka bir Chromium kurulu olur.
    for (const aday of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/chromium", "/usr/bin/google-chrome"]) {
      if (fs.existsSync(aday)) return chromium.launch({ headless: true, executablePath: aday });
    }
    throw e;
  }
}

const SAYFALAR = [
  ["/", "Anasayfa"], ["/kategori/GPU", "GPU kataloğu"], ["/kategori/CPU", "CPU kataloğu"], ["/kategori/RAM", "Bellek kataloğu"],
  ["/chip/nvidia-hopper-h100", "Çip detayı"], ["/egitim", "Eğitim"], ["/sinav", "Sınav"], ["/bugun", "Bugün"],
  ["/fiyatlar", "Fiyatlar"], ["/sozluk", "Sözlük"], ["/notlar", "Notlar"], ["/hesap", "Hesap"],
  ["/atolye", "Tasarımlarım"], ["/tasarla", "Tasarım Atölyesi"], ["/karsilastir", "Karşılaştır"], ["/otomasyon", "Otomasyon"],
  ["/ic", "İç"], ["/ic/iphone-17-pro", "İç: cihaz detayı"], ["/chip/apple-a19-pro", "Mobil SoC detayı"], ["/haftalik", "Haftalık rapor"],
];

let browser;
try {
  browser = await tarayici();
} catch (e) {
  cikis(2, { durum: "calismadi", neden: "Chromium başlatılamadı: " + String(e.message).split("\n")[0] });
}

const page = await browser.newPage();
const url = pathToFileURL(html).href;
const hatalar = [];
let aktif = "";
page.on("pageerror", (e) => hatalar.push({ sayfa: aktif, tur: "JS hatası", detay: e.message }));
page.on("console", (m) => { if (m.type() === "error") hatalar.push({ sayfa: aktif, tur: "konsol", detay: m.text().slice(0, 200) }); });
page.on("requestfailed", (r) => hatalar.push({ sayfa: aktif, tur: "kırık kaynak", detay: r.url().slice(0, 120) }));

const sonuclar = [];
for (const [rota, ad] of SAYFALAR) {
  aktif = ad;
  const once = hatalar.length;
  await page.goto(`${url}#${rota}`, { waitUntil: "load" });
  await page.waitForTimeout(250);
  const metin = (await page.textContent("main").catch(() => "")) || "";
  const bos = metin.trim().length < 40;
  const kurulmadi = metin.includes("henüz yeniden kurulmadı");
  if (bos) hatalar.push({ sayfa: ad, tur: "boş sayfa", detay: "main içeriği neredeyse boş" });
  if (kurulmadi) hatalar.push({ sayfa: ad, tur: "rota yok", detay: `${rota} yönlendirmesi tanımlı değil` });
  sonuclar.push({ ad, rota, ok: hatalar.length === once });
}

/* Akış: tasarım atölyesi — tip seç, blok yerleştir, danışman çalıştır */
async function akis(ad, fn) {
  aktif = ad;
  const once = hatalar.length;
  try { await fn(); } catch (e) { hatalar.push({ sayfa: ad, tur: "akış kırıldı", detay: String(e.message).split("\n")[0] }); }
  sonuclar.push({ ad, rota: "akış", ok: hatalar.length === once });
}
await akis("Atölye akışı", async () => {
  await page.goto(`${url}#/tasarla`, { waitUntil: "load" });
  await page.click("text=İşlemci (CPU)", { timeout: 3000 });
  const palet = page.locator('[data-testid="palet-blok"]');
  if ((await palet.count()) < 5) throw new Error(`palette ${await palet.count()} blok var`);
  // tıkla-yerleştir
  for (let i = 0; i < 3; i++) {
    await palet.nth(i).click();
    await page.locator('[data-testid="hucre"]').nth(i * 14).click();
  }
  const sayKutu = () => page.locator('[data-testid="izgara"] > div[role="button"]').count();
  const tikSonrasi = await sayKutu();
  if (tikSonrasi < 2) throw new Error(`tıklayarak yerleştirme çalışmadı (${tikSonrasi} blok)`);
  // sürükle-bırak: paletten ızgaraya
  await palet.nth(3).dragTo(page.locator('[aria-label="Boş hücre, sütun 9 satır 7"]'));
  const surukSonrasi = await sayKutu();
  if (surukSonrasi !== tikSonrasi + 1) throw new Error(`sürükle-bırak yerleştirmedi (${tikSonrasi} → ${surukSonrasi})`);
  // danışman
  await page.click("text=Tasarım Danışmanı", { timeout: 3000 });
  await page.waitForTimeout(300);
  // kaydet
  await page.fill('input[aria-label="Tasarım adı"]', "UI testi tasarımı");
  await page.click("button:has-text('Kaydet')", { timeout: 3000 });
});
await akis("Tasarım karşılaştırma akışı", async () => {
  await page.goto(`${url}#/atolye`, { waitUntil: "load" });
  await page.locator('[data-testid="tasarim-karsilastir"]').first().click({ timeout: 3000 });
  await page.waitForTimeout(300);
  const basliklar = await page.locator("h2").allTextContents();
  if (!basliklar.some((b) => b.includes("Fiziksel"))) throw new Error(`tasarım karşılaştırması açılmadı (${basliklar.join(", ")})`);
});
await akis("Karşılaştır akışı", async () => {
  await page.goto(`${url}#/karsilastir`, { waitUntil: "load" });
  // Sayfa içindeki seçici; üst menünün grup düğmeleri de aria-expanded taşıyor.
  await page.click("main button[aria-expanded]", { timeout: 3000 });
  await page.locator('[data-testid="secici-cip"]').first().click({ timeout: 3000 });
  const satir = await page.locator("table tbody tr").count();
  if (satir === 0) throw new Error("karşılaştırma tablosu boş");
});
await akis("Sınav akışı", async () => {
  await page.goto(`${url}#/sinav`, { waitUntil: "load" });
  const basla = page.locator("button", { hasText: /başla/i }).first();
  if (await basla.count()) await basla.click();
  await page.waitForTimeout(200);
});

await browser.close();

const gecen = sonuclar.filter((s) => s.ok).length;
if (!JSON_MOD) {
  for (const s of sonuclar) console.log(`  ${s.ok ? "✓" : "✗"} ${s.ad}`);
  for (const h of hatalar) console.log(`    ↳ [${h.sayfa}] ${h.tur}: ${h.detay}`);
  console.log(`UI testi: ${gecen}/${sonuclar.length} temiz, ${hatalar.length} hata`);
}
cikis(hatalar.length ? 1 : 0, { durum: hatalar.length ? "hata" : "temiz", gecen, toplam: sonuclar.length, hatalar });
