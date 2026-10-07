/**
 * Hızlı arama dizini: bölümler, chipler, cihazlar, dersler, sözlük terimleri.
 * Hepsi derleme anında uygulamaya gömülü veriden; ağ isteği yok.
 */
import { Microchip, Smartphone, GraduationCap, Library } from "lucide-react";
import { chips } from "@/data/chips";
import { lessons } from "@/data/lessons";
import { glossary } from "@/data/glossary";
import icyapi from "@/data/icyapi.json";
import { TUM_BOLUMLER, sadelestir } from "@/lib/bolumler";

export const TURLER = {
  bolum: { ad: "Bölümler", sira: 0, puan: 40 },
  cihaz: { ad: "Cihazlar", sira: 1, puan: 25 },
  chip: { ad: "Çipler", sira: 2, puan: 20 },
  ders: { ad: "Dersler", sira: 3, puan: 15 },
  terim: { ad: "Sözlük", sira: 4, puan: 10 },
};

const KATEGORI_AD = { GPU: "GPU", CPU: "CPU", RAM: "Bellek" };

let _dizin = null;
function dizin() {
  if (_dizin) return _dizin;
  const d = [];
  for (const b of TUM_BOLUMLER) {
    d.push({ tur: "bolum", id: "b:" + b.id, baslik: b.ad, alt: b.aciklama, yol: b.yol, ikon: b.ikon,
      grup: b.grup.ad, metin: sadelestir(`${b.ad} ${b.grup.ad} ${b.aciklama} ${b.anahtar || ""}`) });
  }
  for (const c of icyapi.cihazlar) {
    d.push({ tur: "cihaz", id: "d:" + c.id, baslik: c.ad, alt: `${c.uretici}, ${c.yil}`, yol: `/ic/${c.id}`,
      ikon: Smartphone, metin: sadelestir(`${c.ad} ${c.uretici} ${c.kategori} ${c.parcalar.map((p) => p.ad).join(" ")}`) });
  }
  for (const c of chips) {
    d.push({ tur: "chip", id: "c:" + c.id, baslik: c.name, alt: `${c.manufacturer}, ${KATEGORI_AD[c.category] || c.category}, ${c.release_year}`,
      yol: `/chip/${c.id}`, ikon: Microchip, metin: sadelestir(`${c.name} ${c.manufacturer} ${c.category} ${c.process_node || ""} ${c.key_specs?.architecture || ""}`) });
  }
  for (const l of lessons) {
    d.push({ tur: "ders", id: "l:" + l.id, baslik: l.title, alt: l.subtitle || l.summary || "", yol: `/egitim/${l.id}`,
      ikon: GraduationCap, metin: sadelestir(`${l.title} ${l.subtitle || ""} ${(l.keyTerms || []).map((k) => (typeof k === "string" ? k : k.term)).join(" ")}`) });
  }
  for (const g of glossary) {
    d.push({ tur: "terim", id: "t:" + g.term, baslik: g.term, alt: g.def, yol: "/sozluk", sozlukTerimi: g.term,
      ikon: Library, metin: sadelestir(`${g.term} ${g.def}`) });
  }
  for (const x of d) x.basSade = sadelestir(x.baslik);
  _dizin = d;
  return d;
}

/** Sorgudaki her kelime metinde geçmeli. Başlıkta başta geçen önce gelir. */
export function ara(sorgu, { tur = null, sinir = 6 } = {}) {
  const q = sadelestir(sorgu);
  if (!q) return [];
  const kelimeler = q.split(" ");
  const sonuc = [];
  for (const x of dizin()) {
    if (tur && x.tur !== tur) continue;
    if (!kelimeler.every((k) => x.metin.includes(k) || x.basSade.includes(k))) continue;
    let puan = TURLER[x.tur].puan;
    if (x.basSade === q) puan += 100;
    else if (x.basSade.startsWith(q)) puan += 70;
    else if (x.basSade.includes(q)) puan += 40;
    else if (kelimeler.every((k) => x.basSade.includes(k))) puan += 25;
    sonuc.push({ ...x, puan });
  }
  sonuc.sort((a, b) => b.puan - a.puan || a.baslik.localeCompare(b.baslik, "tr"));
  // Türe göre grupla, her türden en fazla `sinir` sonuç
  const gruplar = new Map();
  for (const x of sonuc) {
    if (!gruplar.has(x.tur)) gruplar.set(x.tur, []);
    const g = gruplar.get(x.tur);
    if (g.length < sinir) g.push(x);
  }
  return [...gruplar.entries()]
    .sort((a, b) => Math.max(...b[1].map((x) => x.puan)) - Math.max(...a[1].map((x) => x.puan)) || TURLER[a[0]].sira - TURLER[b[0]].sira)
    .map(([t, ogeler]) => ({ tur: t, ad: TURLER[t].ad, ogeler }));
}

export const SOZLUK_ANAHTARI = "chip-akademi:sozluk-ara";
