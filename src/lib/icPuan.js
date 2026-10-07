/**
 * Cihaz düzeyinde puanlar (İç bölümü).
 *
 * Üç bileşen, hepsi 100 üzerinden ve hepsi cihaz kaydındaki kaynaklı veriden
 * hesaplanır — elle verilmiş hiçbir puan yok:
 *
 *   Onarılabilirlik — iFixit puanı × 10. iFixit puan yayımlamadıysa boş.
 *   Şeffaflık       — kimliği (üreticisi) bilinen parça sayısı ÷
 *                     (tüm parçalar + "eksik veri" maddeleri). Açıklanmayan her
 *                     bilgi paydayı büyütür.
 *   İşlemci         — cihazın ana işlemcisinin katalogdaki genel puanı
 *                     (tasarım + verimlilik + maliyet). Katalogda yoksa boş.
 *
 * Genel cihaz puanı = mevcut bileşenlerin ağırlıklı ortalaması; en az iki
 * bileşen gerekir, yoksa boş kalır (tek bileşenden "genel" puan çıkmaz).
 */
import { chips } from "@/data/chips";
import { genelPuan, scoreChip } from "@/lib/chipScore";

export const CIHAZ_AGIRLIK = { onarim: 0.35, seffaflik: 0.25, islemci: 0.4 };

const chipMap = new Map(chips.map((c) => [c.id, c]));
const _cache = new Map();

export function anaIslemci(cihaz) {
  const id = cihaz.ana_islemci?.chip_id;
  return id ? chipMap.get(id) ?? null : null;
}

export function cihazPuani(cihaz) {
  if (_cache.has(cihaz.id)) return _cache.get(cihaz.id);

  // Onarılabilirlik
  const o = cihaz.onarim;
  const onarim =
    o?.puan != null && o?.max
      ? { puan: Math.round((o.puan / o.max) * 100), ham: `iFixit ${o.puan}/${o.max}`, neden: null }
      : { puan: null, ham: null, neden: "iFixit bu cihaz için sayısal puan yayımlamadı." };

  // Şeffaflık
  const toplam = cihaz.parcalar.length;
  const bilinen = cihaz.parcalar.filter((p) => p.uretici).length;
  const bilinmeyen = cihaz.bilinmeyen?.length ?? 0;
  const payda = toplam + bilinmeyen;
  const seffaflik = {
    puan: payda ? Math.round((bilinen / payda) * 100) : null,
    ham: `${bilinen} bilinen / (${toplam} parça + ${bilinmeyen} eksik veri)`,
    neden: null,
  };

  // İşlemci
  const chip = anaIslemci(cihaz);
  let islemci;
  if (chip) {
    const g = genelPuan(chip);
    const s = scoreChip(chip);
    islemci = {
      puan: g.puan,
      ham: `${chip.name} · ${s.clsLabel}`,
      neden: g.puan == null ? g.neden || s.reason : null,
      chip,
    };
  } else {
    islemci = {
      puan: null,
      ham: null,
      neden: cihaz.ana_islemci?.not || "Ana işlemci katalogda yok.",
      chip: null,
    };
  }

  const bilesenler = [
    { key: "onarim", ad: "Onarılabilirlik", ...onarim },
    { key: "seffaflik", ad: "Şeffaflık", ...seffaflik },
    { key: "islemci", ad: "İşlemci", ...islemci },
  ];

  const mevcut = bilesenler.filter((b) => b.puan != null);
  let genel = null;
  let genelNeden = null;
  if (mevcut.length >= 2) {
    const w = mevcut.reduce((a, b) => a + CIHAZ_AGIRLIK[b.key], 0);
    genel = Math.round(mevcut.reduce((a, b) => a + b.puan * CIHAZ_AGIRLIK[b.key], 0) / w);
  } else {
    genelNeden = `Genel puan için en az iki bileşen gerekiyor; bu cihazda yalnızca ${mevcut.length} tanesi hesaplanabildi.`;
  }

  const sonuc = { genel, genelNeden, bilesenler, mevcutSayisi: mevcut.length };
  _cache.set(cihaz.id, sonuc);
  return sonuc;
}

/** Bir chip'i içeren cihazlar (chip sayfasındaki ters bağlantı için). */
export function chipiKullananCihazlar(cihazlar, chipId) {
  return cihazlar.filter(
    (c) => c.ana_islemci?.chip_id === chipId || c.parcalar.some((p) => p.chip_id === chipId)
  );
}
