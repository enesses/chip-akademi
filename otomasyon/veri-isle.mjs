/**
 * Dışarıdan gelen günlük veriyi doğrulayıp uygulamaya işler.
 *
 *   node otomasyon/veri-isle.mjs
 *
 * Girdiler (otomasyon/gelen/ altında, hepsi isteğe bağlı):
 *   fiyatlar.json  → { "tarih": "YYYY-MM-DD", "kaynak_url": "...",
 *                      "satirlar": [["Nvidia H100", medyan_usd|null, en_ucuz_usd|null, saglayici], ...] }
 *   bugun.json     → src/data/bugun.json ile aynı şema (tarih, derlenme, ozet, puan, yontem, maddeler)
 *   bellek.json    → src/data/bellek_fiyat.json ile aynı şema (gostergeler, yigin, notlar) — haftalık
 *   oneriler.json  → { "tarih": "...", "oneriler": [{ "baslik", "neden", "etki": "yüksek|orta|düşük", "alan" }] }
 *
 * Bu dosyaları her sabah Claude'un günlük görevi web'den toplayıp yazar
 * (bkz. otomasyon/GUNLUK.md). Ağ erişimi olan bir makinede başka bir bot da
 * yazabilir; bu betik kaynağa bakmaz, yalnızca şemayı ve tutarlılığı denetler.
 *
 * Kural: doğrulamayı geçemeyen veri yazılmaz, mevcut dosya korunur.
 * İşlenen girdiler otomasyon/gecmis/ altına arşivlenir.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { KOK, bugunTarih, rel } from "./ortak.mjs";

const { chips } = await import(pathToFileURL(path.join(KOK, "src", "data", "chips.js")).href);
const kelimeler = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
/** Fiyat satırını katalogdaki çipe bağlar: "Nvidia L40S" → "NVIDIA L40S". "L4", "L40S"e eşleşmez. */
function katalogEslesmesi(model) {
  const m = kelimeler(model).filter((k) => !["nvidia", "amd", "intel"].includes(k));
  if (m.length === 0) return null;
  for (const c of chips) {
    const t = kelimeler(c.name);
    for (let i = 0; i + m.length <= t.length; i++) if (m.every((k, j) => t[i + j] === k)) return c.id;
  }
  return null;
}

const GELEN = path.join(KOK, "otomasyon", "gelen");
const GECMIS = path.join(KOK, "otomasyon", "gecmis");
const DATA = path.join(KOK, "src", "data");
const BUGUN = bugunTarih();

const sonuc = { fiyat: null, bugun: null, bellek: null, oneriler: null };
const oku = (f) => JSON.parse(fs.readFileSync(f, "utf-8"));
const yaz = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2) + "\n", "utf-8");
function arsivle(ad, veri) {
  fs.mkdirSync(GECMIS, { recursive: true });
  yaz(path.join(GECMIS, `${ad}-${BUGUN}.json`), veri);
}

/* ------------------------------------------------------------ fiyatlar */
const fiyatGirdi = path.join(GELEN, "fiyatlar.json");
if (fs.existsSync(fiyatGirdi)) {
  try {
    const g = oku(fiyatGirdi);
    if (!Array.isArray(g.satirlar) || g.satirlar.length < 30) throw new Error(`satır sayısı yetersiz (${g.satirlar?.length ?? 0})`);
    if (g.tarih !== BUGUN) throw new Error(`girdi bugüne ait değil (${g.tarih})`);

    const dosya = path.join(DATA, "gpu_kiralama.json");
    const veri = oku(dosya);
    const eskiTarih = veri.kaynak.cekildigi_tarih;
    // "Intel Gaudi 2" ile "Intel Gaudi2" aynı model: boşluk ve büyük/küçük harf yok sayılır.
    const anahtar = (m) => m.toLowerCase().replace(/[\s-]+/g, "");
    const yeni = new Map();
    for (const s of g.satirlar) {
      const [model, medyan, , saglayici] = s;
      if (typeof model === "string" && typeof medyan === "number" && medyan > 0) yeni.set(anahtar(model), { model: model.trim(), medyan, saglayici });
    }

    let guncellenen = 0, eklenen = 0;
    const supheli = [], gelmeyen = [];
    for (const f of veri.fiyatlar) {
      const n = yeni.get(anahtar(f.model));
      if (!n) { gelmeyen.push(f.model); continue; }
      yeni.delete(anahtar(f.model));
      const degisim = f.usd_saat > 0 ? ((n.medyan - f.usd_saat) / f.usd_saat) * 100 : 0;
      // Çok sağlayıcılı bir modelde bir günde %50'den büyük oynama büyük ihtimalle
      // okuma hatasıdır (yanlış sütun, kayan satır). Yazma, raporla.
      if (Math.abs(degisim) > 50 && (n.saglayici ?? 0) >= 10) {
        supheli.push(`${f.model}: ${f.usd_saat} → ${n.medyan}`);
        continue;
      }
      f.onceki_usd = f.usd_saat;
      f.usd_saat = n.medyan;
      f.degisim_pct = Math.round(degisim * 10) / 10;
      if (typeof n.saglayici === "number") f.saglayici = n.saglayici;
      guncellenen++;
    }
    // Katalogda olmayan yeni modeller
    for (const n of yeni.values()) {
      const model = n.model;
      const slug = model.toLowerCase().replace(/\s+/g, "-");
      veri.fiyatlar.push({ model, bellek: "—", vram_gb: null, usd_saat: n.medyan, onceki_usd: null, degisim_pct: 0,
        saglayici: n.saglayici ?? null, chip_id: null, url: `https://getdeploying.com/gpus/${slug}` });
      eklenen++;
    }

    // Kataloğa bağlanmamış satırları bağla (fiyat satırından çip sayfasına geçiş için)
    let baglanan = 0;
    for (const f of veri.fiyatlar) if (!f.chip_id) { const id = katalogEslesmesi(f.model); if (id) { f.chip_id = id; baglanan++; } }
    for (const liste of [veri.iki_gun?.artanlar, veri.iki_gun?.dusenler]) for (const f of liste || []) if (!f.chip_id) f.chip_id = katalogEslesmesi(f.model);

    if (guncellenen < 30) throw new Error(`yalnızca ${guncellenen} model eşleşti — tablo yapısı değişmiş olabilir`);

    const hareketli = veri.fiyatlar.filter((f) => f.onceki_usd != null && (f.saglayici ?? 0) >= 3 && f.degisim_pct !== 0);
    veri.iki_gun = {
      baslangic: eskiTarih,
      bitis: BUGUN,
      not: `${eskiTarih} ile ${BUGUN} ölçümleri arasındaki fark. Yalnızca en az 3 sağlayıcının listelediği modeller.`,
      artanlar: hareketli.filter((f) => f.degisim_pct > 0).sort((a, b) => b.degisim_pct - a.degisim_pct).slice(0, 5),
      dusenler: hareketli.filter((f) => f.degisim_pct < 0).sort((a, b) => a.degisim_pct - b.degisim_pct).slice(0, 5),
    };
    // İsteğe bağlı: getdeploying.com/gpu-price-index'ten endeks özeti
    const e = g.endeks;
    if (e && /^\d{4}-\d{2}-\d{2}$/.test(e.olcum_tarihi || "") && Number.isFinite(e.degisim_4_hafta_pct) && Number.isFinite(e.degisim_12_ay_pct)) {
      veri.endeks = { ...veri.endeks, degisim_4_hafta_pct: e.degisim_4_hafta_pct, degisim_12_ay_pct: e.degisim_12_ay_pct };
      veri.kaynak.olcum_tarihi = e.olcum_tarihi;
    }
    veri.kaynak.onceki_olcum = eskiTarih;
    veri.kaynak.cekildigi_tarih = BUGUN;
    veri.kaynak.kapsam = { ...veri.kaynak.kapsam, model: veri.fiyatlar.length };
    veri.kaynak.liste_notu = `Tablodaki fiyatlar getdeploying.com/gpus sayfasının ${BUGUN} tarihli sağlayıcılar arası medyanlarıdır. Değişim sütunu ${eskiTarih} tarihli bir önceki ölçüme göredir.`;

    yaz(dosya, veri);
    arsivle("fiyatlar", g);
    fs.rmSync(fiyatGirdi);
    sonuc.fiyat = { ok: true, detay: `${guncellenen} model güncellendi, ${eklenen} yeni, ${baglanan} kataloğa bağlandı, ${gelmeyen.length} gelmedi (eski fiyat korundu)`, supheli, gelmeyen };
  } catch (e) {
    sonuc.fiyat = { ok: false, detay: e.message };
  }
}

/* ------------------------------------------------------------ katalog bağlantısı
 * Fiyat girdisi gelmese bile her çalıştırmada: kataloğa yeni bir çip eklendiyse
 * o modelin fiyat satırı ertesi gün değil hemen bağlansın.
 */
{
  const dosya = path.join(DATA, "gpu_kiralama.json");
  const veri = oku(dosya);
  let baglanan = 0;
  for (const liste of [veri.fiyatlar, veri.iki_gun?.artanlar, veri.iki_gun?.dusenler, veri.detay])
    for (const f of liste || []) if (f.model && !f.chip_id) { const id = katalogEslesmesi(f.model); if (id) { f.chip_id = id; baglanan++; } }
  if (baglanan) { yaz(dosya, veri); console.log(`  ✓ katalog: ${baglanan} fiyat satırı çip sayfasına bağlandı`); }
}

/* ------------------------------------------------------------ bugün */
const bugunGirdi = path.join(GELEN, "bugun.json");
if (fs.existsSync(bugunGirdi)) {
  try {
    const v = oku(bugunGirdi);
    if (v.tarih !== BUGUN) throw new Error(`girdi bugüne ait değil (${v.tarih})`);
    if (!Array.isArray(v.ozet) || v.ozet.length < 2) throw new Error("özet eksik");
    if (!Array.isArray(v.maddeler) || v.maddeler.length < 5) throw new Error(`madde sayısı yetersiz (${v.maddeler?.length ?? 0})`);
    const isaret = { pozitif: 1, notr: 0, negatif: -1 };
    for (const m of v.maddeler) {
      if (!m.baslik || !m.detay || !m.neden) throw new Error(`eksik alanlı madde: ${m.baslik ?? "?"}`);
      if (!(m.kategori in isaret)) throw new Error(`geçersiz kategori: ${m.kategori}`);
      if (!(Number.isInteger(m.agirlik) && m.agirlik >= 1 && m.agirlik <= 3)) throw new Error(`geçersiz ağırlık: ${m.baslik}`);
      if (!/^https?:\/\//.test(m.url || "")) throw new Error(`kaynaksız madde: ${m.baslik}`);
    }
    // Puan formülden hesaplanır; girdideki sayı ne olursa olsun formül esastır.
    const ta = v.maddeler.reduce((t, m) => t + m.agirlik, 0);
    const ti = v.maddeler.reduce((t, m) => t + m.agirlik * isaret[m.kategori], 0);
    const deger = Math.round(50 + 50 * (ti / ta));
    v.puan = { ...v.puan, deger };
    const eski = oku(path.join(DATA, "bugun.json"));
    v.yontem = { ...eski.yontem, ...(v.yontem || {}),
      hesap: `Σ ağırlık×işaret = ${ti >= 0 ? "+" : ""}${ti} · Σ ağırlık = ${ta} · Puan = 50 + 50 × ${(ti / ta).toFixed(2)} = ${deger}` };
    yaz(path.join(DATA, "bugun.json"), v);
    arsivle("bugun", v);
    fs.rmSync(bugunGirdi);
    sonuc.bugun = { ok: true, detay: `${v.maddeler.length} madde, puan ${deger}` };
  } catch (e) {
    sonuc.bugun = { ok: false, detay: e.message };
  }
}

/* ------------------------------------------------------------ bellek fiyatları */
const bellekGirdi = path.join(GELEN, "bellek.json");
if (fs.existsSync(bellekGirdi)) {
  try {
    const b = oku(bellekGirdi);
    if (!Array.isArray(b.gostergeler) || b.gostergeler.length < 2) throw new Error("gösterge sayısı yetersiz");
    for (const x of b.gostergeler) {
      if (!x.urun || !x.donem || !x.kaynak) throw new Error(`eksik alanlı gösterge: ${x.urun ?? "?"}`);
      if (!["çeyreklik", "yıllık"].includes(x.olcu)) throw new Error(`geçersiz ölçü: ${x.olcu}`);
      if (!Number.isFinite(x.alt) || !Number.isFinite(x.ust) || x.alt > x.ust) throw new Error(`geçersiz aralık: ${x.urun}`);
      if (!/^https?:\/\//.test(x.url || "")) throw new Error(`kaynaksız gösterge: ${x.urun}`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(x.tarih || "")) throw new Error(`tarihsiz gösterge: ${x.urun}`);
    }
    const dosya = path.join(DATA, "bellek_fiyat.json");
    const eski = oku(dosya);
    const yeni = { ...eski, ...b, guncelleme: BUGUN };
    yaz(dosya, yeni);
    arsivle("bellek", b);
    fs.rmSync(bellekGirdi);
    sonuc.bellek = { ok: true, detay: `${b.gostergeler.length} gösterge` };
  } catch (e) {
    sonuc.bellek = { ok: false, detay: e.message };
  }
}

/* ------------------------------------------------------------ öneriler */
const oneriGirdi = path.join(GELEN, "oneriler.json");
if (fs.existsSync(oneriGirdi)) {
  try {
    const o = oku(oneriGirdi);
    if (!Array.isArray(o.oneriler) || o.oneriler.length === 0) throw new Error("öneri listesi boş");
    for (const x of o.oneriler) if (!x.baslik || !x.neden) throw new Error("başlıksız/gerekçesiz öneri");
    o.tarih = BUGUN;
    fs.mkdirSync(path.join(KOK, "otomasyon", "raporlar"), { recursive: true });
    yaz(path.join(KOK, "otomasyon", "raporlar", `oneriler-${BUGUN}.json`), o);
    fs.rmSync(oneriGirdi);
    sonuc.oneriler = { ok: true, detay: `${o.oneriler.length} öneri` };
  } catch (e) {
    sonuc.oneriler = { ok: false, detay: e.message };
  }
}

for (const [ad, s] of Object.entries(sonuc)) {
  if (s) console.log(`  ${s.ok ? "✓" : "✗"} ${ad}: ${s.detay}`);
  if (s?.supheli?.length) console.log(`      şüpheli (yazılmadı): ${s.supheli.join("; ")}`);
}
if (!Object.values(sonuc).some(Boolean)) console.log(`  – ${rel(GELEN)} altında işlenecek girdi yok`);

export default sonuc;
fs.mkdirSync(GELEN, { recursive: true });
yaz(path.join(GELEN, ".son-isleme.json"), { zaman: new Date().toISOString(), sonuc });
