/**
 * Haber akışı — src/data/haberler.json.
 *
 * Bugün sayfası günün 8–12 maddesini gösterir ve ertesi gün yenisiyle değişir.
 * Haberler sayfası ise birikir: her gün Bugün'ün maddeleri ve otomasyonun
 * ayrıca topladığı ek haberler (gelen/haberler.json) akışa eklenir, son
 * SAKLA_GUN gün tutulur.
 *
 *   node otomasyon/haberler.mjs --geriden   → otomasyon/gecmis/bugun-*.json arşivinden akışı yeniden kur
 *
 * veri-isle.mjs bu modülün haberEkle() fonksiyonunu çağırır.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KOK, bugunTarih } from "./ortak.mjs";

export const AKIS = path.join(KOK, "src", "data", "haberler.json");
const GECMIS = path.join(KOK, "otomasyon", "gecmis");
export const SAKLA_GUN = 30;

export const KONULAR = {
  "yapay-zeka": "Yapay zekâ",
  cip: "Çip ve üretim",
  bellek: "Bellek",
  "veri-merkezi": "Veri merkezi",
  pazar: "Şirketler ve pazar",
  politika: "Politika ve düzenleme",
};

/*
 * Konu atama: otomasyonun kendi yazdığı "konular" varsa o kullanılır.
 * Yoksa (eski Bugün maddeleri) başlık ve ayrıntıdaki anahtar kelimelerle.
 * Bir haber birden çok konuya girebilir. Bu bir etiket, haber içeriği değil.
 */
// Türkçe kökler ekle devam eder ("hisseleri", "çiplerin"): kök yalnızca başta sınırlı (\b…).
// Kısa İngilizce adlar ("ai", "arm", "amd") iki yandan sınırlı (\b…\b), yoksa başka kelimelerin içinde eşleşir.
const KURALLAR = [
  ["bellek", /\b(hbm|dram|nand|lpddr|gddr|bellek|micron|sk ?hynix|kioxia|sandisk)|\b(ddr\d|memory)\b/i],
  ["cip", /\b(çip|yarı ?iletken|semiconductor|tsmc|wafer|foundry|dökümhane|litograf|paketleme|cowos|asml|nvidia|qualcomm|broadcom|blackwell|rubin|euv)|\b(chips?|\d+ ?nm|gpu|cpu|soc|amd|intel|arm|tpu|asic)\b/i],
  ["yapay-zeka", /\b(yapay zek|openai|anthropic|claude|gemini|chatgpt|deepseek|mistral|dil model|çıkarım)|\b(ai|llm|gpt-?\d\S*|grok|xai|inference)\b/i],
  ["veri-merkezi", /\b(veri merkez|data ?cent|hyperscale|gigawat|megawat|sunucu|soğutma|elektrik|nükleer)|\b(\d+ ?gw|server|rack|raf|cooling)\b/i],
  ["pazar", /\b(hisse|borsa|gelir|kâr|bilanço|çeyrek|yatırım|milyar|satın al|birleşme|değerleme|halka arz|sipariş|anlaşma|ortaklı|hedef fiyat|revenue|earnings)|\b(ipo)\b/i],
  ["politika", /\b(ihracat kontrol|ihracat yasa|export control|tarife|gümrük|yaptırım|düzenlem|regülasyon|yasa |yasası|kongre|ticaret bakanlığ|commerce department|beyaz saray|hükümet|ab komisyon|chips act|teşvik|lisans şart)/i],
];

export function konuBul(m) {
  const metin = `${m.baslik || ""} ${m.detay || ""}`;
  const k = KURALLAR.filter(([, re]) => re.test(metin)).map(([ad]) => ad);
  return k.length ? k : ["pazar"];
}

const okuJson = (p, v) => { try { return JSON.parse(fs.readFileSync(p, "utf-8")); } catch { return v; } };
const yazJson = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", "utf-8");

/** Aynı haberin farklı yazımları tek kayıt olsun: protokol, www, sondaki /, izleme parametreleri atılır. */
export function urlAnahtari(u) {
  try {
    const x = new URL(u);
    for (const p of [...x.searchParams.keys()]) if (/^(utm_|fbclid|gclid|ref$|ncid)/i.test(p)) x.searchParams.delete(p);
    return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "") + (x.search || "")).toLowerCase();
  } catch {
    return String(u).toLowerCase();
  }
}
const baslikAnahtari = (b) => String(b).toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function gunFarki(a, b) {
  return Math.round((new Date(`${a}T00:00:00Z`) - new Date(`${b}T00:00:00Z`)) / 864e5);
}

/**
 * Akışa haber ekle. maddeler: [{ baslik, detay, kaynak, url, kategori?, konular?, yayin? }]
 * Dönüş: { eklenen, atlanan: [{ baslik, neden }] }
 */
export function haberEkle(maddeler, { tarih = bugunTarih(), kaynakTuru = "ek" } = {}) {
  const akis = okuJson(AKIS, { aciklama: "Birikimli haber akışı — otomasyon/haberler.mjs yazar.", haberler: [] });
  const urller = new Set(akis.haberler.map((h) => urlAnahtari(h.url)));
  const basliklar = new Set(akis.haberler.map((h) => baslikAnahtari(h.baslik)));
  const atlanan = [];
  let eklenen = 0;

  for (const m of maddeler || []) {
    const eksik = ["baslik", "detay", "kaynak", "url"].filter((k) => !m?.[k] || typeof m[k] !== "string" || !m[k].trim());
    if (eksik.length) { atlanan.push({ baslik: m?.baslik || "(başlıksız)", neden: `eksik alan: ${eksik.join(", ")}` }); continue; }
    if (!/^https:\/\/[^\s]+$/.test(m.url)) { atlanan.push({ baslik: m.baslik, neden: "bağlantı https değil" }); continue; }
    if (m.yayin && (!/^\d{4}-\d{2}-\d{2}$/.test(m.yayin) || gunFarki(tarih, m.yayin) > 3 || gunFarki(tarih, m.yayin) < 0)) {
      atlanan.push({ baslik: m.baslik, neden: `yayın tarihi ${m.yayin} son 3 günün dışında` }); continue;
    }
    const ua = urlAnahtari(m.url), ba = baslikAnahtari(m.baslik);
    if (urller.has(ua) || basliklar.has(ba)) { atlanan.push({ baslik: m.baslik, neden: "akışta zaten var" }); continue; }

    const gecerliKonu = Array.isArray(m.konular) ? m.konular.filter((k) => KONULAR[k]) : [];
    akis.haberler.push({
      id: `${tarih}-${ua.replace(/[^a-z0-9]+/g, "-").slice(-48)}`,
      tarih,
      yayin: m.yayin || null,
      baslik: m.baslik.trim(),
      detay: m.detay.trim(),
      kaynak: m.kaynak.trim(),
      url: m.url.trim(),
      ton: ["pozitif", "notr", "negatif"].includes(m.kategori) ? m.kategori : null,
      konular: gecerliKonu.length ? gecerliKonu : konuBul(m),
      kaynakTuru, // "bugun": Bugün sayfasının maddesi, "ek": ek haber
    });
    urller.add(ua); basliklar.add(ba);
    eklenen++;
  }

  // Eskiyi at, yeniden eskiye sırala (aynı gün içinde eklenme sırası korunur)
  akis.haberler = akis.haberler
    .filter((h) => gunFarki(tarih, h.tarih) < SAKLA_GUN)
    .map((h, i) => [h, i])
    .sort((a, b) => b[0].tarih.localeCompare(a[0].tarih) || a[1] - b[1])
    .map(([h]) => h);
  akis.guncelleme = tarih;
  akis.konular = KONULAR;
  yazJson(AKIS, akis);
  return { eklenen, atlanan, toplam: akis.haberler.length };
}

/* ── CLI: arşivden yeniden kur ─────────────────────────────────────── */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes("--geriden")) {
  fs.rmSync(AKIS, { force: true });
  const dosyalar = fs.readdirSync(GECMIS).filter((f) => /^bugun-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  const ekler = fs.readdirSync(GECMIS).filter((f) => /^haberler-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  let toplam = 0;
  for (const f of dosyalar) {
    const t = f.slice(6, 16);
    const v = okuJson(path.join(GECMIS, f), null);
    if (!v) continue;
    const r = haberEkle(v.maddeler, { tarih: t, kaynakTuru: "bugun" });
    const ek = ekler.find((e) => e.slice(9, 19) === t);
    const r2 = ek ? haberEkle(okuJson(path.join(GECMIS, ek), {}).haberler, { tarih: t, kaynakTuru: "ek" }) : { eklenen: 0 };
    toplam = r2.toplam ?? r.toplam;
    console.log(`  ${t}: +${r.eklenen + r2.eklenen}${r.atlanan.length ? ` (${r.atlanan.length} atlandı: ${[...new Set(r.atlanan.map((a) => a.neden))].join("; ")})` : ""}`);
  }
  console.log(`✓ Haber akışı arşivden kuruldu: ${toplam} haber → ${path.relative(KOK, AKIS)}`);
}
