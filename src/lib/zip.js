/**
 * Bağımlılıksız, sıkıştırmasız (STORE) ZIP yazıcı.
 *
 * Skill paketleri birkaç kilobaytlık metin dosyası; sıkıştırma kazandırmaz,
 * kütüphane eklemek tek dosyalık derlemeyi şişirir. Dosya adları UTF-8
 * bayrağıyla yazılır (Türkçe karakterli adlar her işletim sisteminde doğru açılır).
 *
 *   zipOlustur([{ yol: "skill-adi/SKILL.md", icerik: "..." }]) → Uint8Array
 */

const CRC_TABLO = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(bayt) {
  let c = 0xffffffff;
  for (let i = 0; i < bayt.length; i++) c = CRC_TABLO[(c ^ bayt[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosZamani(t = new Date()) {
  const saat = (t.getHours() << 11) | (t.getMinutes() << 5) | Math.floor(t.getSeconds() / 2);
  const tarih = ((t.getFullYear() - 1980) << 9) | ((t.getMonth() + 1) << 5) | t.getDate();
  return { saat, tarih };
}

export function zipOlustur(dosyalar, zaman = new Date()) {
  const kodla = new TextEncoder();
  const { saat, tarih } = dosZamani(zaman);
  const yerel = [];
  const merkez = [];
  let ofset = 0;

  for (const d of dosyalar) {
    const ad = kodla.encode(d.yol);
    const veri = typeof d.icerik === "string" ? kodla.encode(d.icerik) : d.icerik;
    const crc = crc32(veri);

    const b = new Uint8Array(30 + ad.length);
    const v = new DataView(b.buffer);
    v.setUint32(0, 0x04034b50, true); // yerel dosya başlığı
    v.setUint16(4, 20, true);         // açmak için gereken sürüm
    v.setUint16(6, 0x0800, true);     // bit 11: ad UTF-8
    v.setUint16(8, 0, true);          // STORE
    v.setUint16(10, saat, true);
    v.setUint16(12, tarih, true);
    v.setUint32(14, crc, true);
    v.setUint32(18, veri.length, true);
    v.setUint32(22, veri.length, true);
    v.setUint16(26, ad.length, true);
    v.setUint16(28, 0, true);
    b.set(ad, 30);
    yerel.push(b, veri);

    const m = new Uint8Array(46 + ad.length);
    const mv = new DataView(m.buffer);
    mv.setUint32(0, 0x02014b50, true); // merkezi dizin kaydı
    mv.setUint16(4, 20, true);
    mv.setUint16(6, 20, true);
    mv.setUint16(8, 0x0800, true);
    mv.setUint16(10, 0, true);
    mv.setUint16(12, saat, true);
    mv.setUint16(14, tarih, true);
    mv.setUint32(16, crc, true);
    mv.setUint32(20, veri.length, true);
    mv.setUint32(24, veri.length, true);
    mv.setUint16(28, ad.length, true);
    mv.setUint32(42, ofset, true);
    m.set(ad, 46);
    merkez.push(m);

    ofset += b.length + veri.length;
  }

  const merkezBoyut = merkez.reduce((t, m) => t + m.length, 0);
  const son = new Uint8Array(22);
  const sv = new DataView(son.buffer);
  sv.setUint32(0, 0x06054b50, true); // merkezi dizin sonu
  sv.setUint16(8, dosyalar.length, true);
  sv.setUint16(10, dosyalar.length, true);
  sv.setUint32(12, merkezBoyut, true);
  sv.setUint32(16, ofset, true);

  const parcalar = [...yerel, ...merkez, son];
  const toplam = parcalar.reduce((t, p) => t + p.length, 0);
  const cikti = new Uint8Array(toplam);
  let i = 0;
  for (const p of parcalar) { cikti.set(p, i); i += p.length; }
  return cikti;
}
