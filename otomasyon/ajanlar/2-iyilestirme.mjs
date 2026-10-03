/**
 * 2. AJAN — İYİLEŞTİRME  (her gün 10:00)
 *
 * Uygulamayı tarar, iyileştirilebilecek somut noktaları çıkarır ve
 * önceliklendirir. Öneri üretmez, BULGU üretir: her madde ölçülebilir bir
 * eksiği gösterir ve 4. ajan bunların otomatik düzeltilebilenlerini uygular.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, baslik, kaynakDosyalari, oku, raporYaz, rel } from "../ortak.mjs";

/**
 * İki tarih arasındaki TAM gün farkı.
 * Milisaniye farkını yuvarlamak yanlış sonuç veriyordu: aynı günün sabahı
 * yazılmış bir veri, akşam 12 saati geçtiği için "1 gün eski" görünüyordu.
 * Karşılaştırma gün başlangıçları üzerinden yapılır.
 */
function gunFarki(tarihMetni) {
  const a = new Date(`${tarihMetni}T00:00:00Z`);
  const bugun = new Date();
  const b = new Date(Date.UTC(bugun.getUTCFullYear(), bugun.getUTCMonth(), bugun.getUTCDate()));
  return Math.round((b - a) / 864e5);
}

const bulgular = [];
const ekle = (b) => bulgular.push(b);

/* ---------------------------------------------- veri bütünlüğü */
function veriKontrolu() {
  const src = path.join(KOK, "src", "data");
  /*
   * Dosya listesi elle yazılmıştı; chipsExtra3.js eklenince ajan onu hiç
   * taramadı ve yeni chip'lerdeki eksikleri göremedi. Artık src/data
   * altındaki tüm chip dosyaları dinamik olarak okunuyor.
   */
  const chipDosyalari = fs
    .readdirSync(src)
    .filter((f) => /^chips.*\.js$/.test(f))
    .sort();
  const hepsi = chipDosyalari.map((f) => oku(path.join(src, f))).join("\n");

  const idler = [...hepsi.matchAll(/(?:"id"|id):\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
  const chipIdleri = [...new Set(idler)].filter((i) => i.includes("-"));

  // die_regions olmayan chip'ler
  const bloklar = hepsi.split(/\n\s*\{\s*\n?\s*(?:"id"|id):/).slice(1);
  let dieEksik = 0;
  for (const b of bloklar) if (!b.includes("die_regions")) dieEksik++;
  if (dieEksik > 0)
    ekle({
      alan: "veri",
      baslik: `${dieEksik} chip kaydında die_regions yok`,
      etki: "orta",
      otomatik: false,
      aciklama: "Die diyagramı olmayan chip'lerde detay sayfası eksik kalıyor.",
    });

  // fiyat listesinde katalog eşleşmesi
  const fiyat = JSON.parse(oku(path.join(src, "gpu_kiralama.json")));
  /*
   * "Katalogda karşılığı yok" sayısı tek başına eyleme dönüşmüyordu: 86 modelin
   * çoğu GTX 1060, P4000 gibi eski tüketici kartları ve bunların eğitim
   * kataloğunda yeri yok. Anlamlı olan alt küme, kiralama piyasasında yaygın
   * olan veri merkezi sınıfı modeller — eksik olan onlar gerçekten eksik.
   */
  const VERI_MERKEZI = /\b(H100|H200|A100|B200|B300|GB200|GB300|L40S?|L4|A10|A30|A40|T4|V100|GH200|MI\d{3}X?|Gaudi)\b/i;
  const eksikVeriMerkezi = fiyat.fiyatlar.filter(
    (f) => !f.chip_id && f.usd_saat && VERI_MERKEZI.test(f.model)
  );
  if (eksikVeriMerkezi.length > 0)
    ekle({
      alan: "veri",
      baslik: `${eksikVeriMerkezi.length} veri merkezi GPU'su katalogda yok`,
      etki: eksikVeriMerkezi.length > 8 ? "orta" : "düşük",
      otomatik: false,
      detay: eksikVeriMerkezi.map((f) => f.model),
      aciklama:
        "Kiralama listesinde yaygın olan bu modeller katalogda bulunmadığı için fiyat tablosundan chip sayfasına bağlantı verilemiyor.",
    });

  // veri tazeliği
  const gun = gunFarki(fiyat.kaynak.cekildigi_tarih);
  if (gun >= 3)
    ekle({
      alan: "veri",
      baslik: `Fiyat verisi ${gun} gün önce çekilmiş`,
      etki: gun >= 7 ? "yüksek" : "orta",
      otomatik: true,
      eylem: "yenileme-calistir",
      aciklama: "3. ajan (yenileme) çalıştırılarak güncellenebilir.",
    });

  const bugun = JSON.parse(oku(path.join(src, "bugun.json")));
  const bGun = gunFarki(bugun.tarih);
  if (bGun >= 1)
    ekle({
      alan: "veri",
      baslik: `"Bugün" sayfası ${bGun} gün eski`,
      etki: bGun >= 3 ? "yüksek" : "orta",
      otomatik: true,
      eylem: "yenileme-calistir",
      aciklama: "Sayfa adı 'Bugün' olduğu için eskimesi doğrudan güveni zedeler.",
    });

  return { chipSayisi: chipIdleri.length, fiyatSayisi: fiyat.fiyatlar.length };
}

/* ---------------------------------------------- eğitim içeriği */
function egitimKontrolu() {
  const dersler = oku(path.join(KOK, "src", "data", "lessons.js"));
  const dersSayisi = (dersler.match(/"?order"?\s*:\s*\d+/gm) || []).length;
  const quizsiz = (dersler.match(/quiz:\s*\[\s*\]/g) || []).length;
  if (quizsiz > 0)
    ekle({
      alan: "eğitim",
      baslik: `${quizsiz} derste test sorusu yok`,
      etki: "orta",
      otomatik: false,
    });
  const diyagramsiz = dersSayisi - (dersler.match(/"?type"?\s*:\s*"diagram"/g) || []).length;
  if (diyagramsiz > 3)
    ekle({
      alan: "eğitim",
      baslik: `${diyagramsiz} derste görsel diyagram yok`,
      etki: "düşük",
      otomatik: false,
      aciklama: "Görsel anlatım kavrama hızını artırıyor; diyagramsız dersler daha yorucu.",
    });
  return { dersSayisi };
}

/* ---------------------------------------------- erişilebilirlik */
function erisilebilirlik() {
  let altsiz = 0;
  let etiketsizDugme = 0;
  const dosyalar = [];
  for (const dosya of kaynakDosyalari([".jsx"])) {
    const m = oku(dosya);
    let bu = 0;
    for (const img of m.match(/<img\b[^>]*>/g) || []) if (!/\balt=/.test(img)) bu++;
    for (const btn of m.match(/<button\b[^>]*>/g) || [])
      if (!/aria-label|>\s*\{?\s*["'\w]/.test(btn) && !/aria-label/.test(btn)) etiketsizDugme++;
    if (bu > 0) {
      altsiz += bu;
      dosyalar.push(`${rel(dosya)} (${bu})`);
    }
  }
  if (altsiz > 0)
    ekle({
      alan: "erişilebilirlik",
      baslik: `${altsiz} görselde alt metni yok`,
      etki: "orta",
      // Otomatik DEĞİL: alt metni görselin ne anlattığını bilmeyi gerektirir.
      // Otomatik üretilen bir alt (ör. dosya yolu) denetimi geçirir ama
      // ekran okuyucu kullanıcısına hiçbir şey anlatmaz.
      otomatik: false,
      aciklama:
        "Her görselin ne anlattığını insanın yazması gerekiyor; otomatik üretilen alt metni denetimi geçirir ama işe yaramaz.",
      detay: dosyalar,
    });
  return { altsiz, etiketsizDugme };
}

/* ---------------------------------------------- kod sağlığı */
function kodSagligi() {
  const dosyalar = kaynakDosyalari([".js", ".jsx"]);
  let toplamSatir = 0;
  const buyukler = [];

  for (const d of dosyalar) {
    const metin = oku(d);
    const satir = metin.split("\n").length;
    toplamSatir += satir;

    /*
     * Ham satır sayısı tek başına yanıltıcı bir ölçüt.
     * src/data altındaki dosyalar uzun listelerdir: chips.js 1539 satırlık
     * ama içinde tek bir fonksiyon ve 17 veri girdisi var. Bölmek bakımı
     * kolaylaştırmaz, sadece dosya sayısını artırır.
     *
     * Bu yüzden veri modülleri hariç tutulur ve kod dosyaları için ölçüt
     * "uzunluk" değil "kaç ayrı iş yapıyor" olur: hem satır hem üst düzey
     * fonksiyon sayısı yüksekse bölmek gerçekten anlamlıdır.
     */
    if (d.includes(`${path.sep}data${path.sep}`)) continue;

    const fonksiyonSayisi = (
      metin.match(/^(?:export\s+)?(?:function\s+[A-Za-z_$]|const\s+[A-Za-z_$][\w$]*\s*=\s*(?:\(|function))/gm) || []
    ).length;

    if (satir > 900 && fonksiyonSayisi > 10) {
      buyukler.push({ dosya: rel(d), satir, fonksiyonSayisi });
    }
  }

  for (const b of buyukler)
    ekle({
      alan: "kod",
      baslik: `${b.dosya}: ${b.satir} satırda ${b.fonksiyonSayisi} ayrı bileşen`,
      etki: "düşük",
      otomatik: false,
      aciklama:
        "Bağımsız bileşenleri ayrı dosyalara taşımak okunabilirliği artırır. Davranışı değiştirmez, acil değil.",
    });

  // kullanılmayan export
  const disaAcilan = new Map();
  for (const d of dosyalar)
    for (const m of oku(d).matchAll(/export\s+(?:function|const)\s+([A-Za-z_$][\w$]*)/g))
      disaAcilan.set(m[1], rel(d));
  const tumMetin = dosyalar.map(oku).join("\n");
  const kullanilmayan = [...disaAcilan.entries()].filter(([ad]) => {
    const kullanim = (tumMetin.match(new RegExp(`\\b${ad}\\b`, "g")) || []).length;
    return kullanim <= 1;
  });
  if (kullanilmayan.length > 0)
    ekle({
      alan: "kod",
      baslik: `${kullanilmayan.length} export hiçbir yerde kullanılmıyor`,
      etki: "düşük",
      otomatik: false,
      detay: kullanilmayan.map(([ad, d]) => `${ad} (${d})`),
    });

  // paket boyutu
  const dist = path.join(KOK, "dist", "chip-akademi.html");
  let boyutKB = null;
  if (fs.existsSync(dist)) boyutKB = Math.round(fs.statSync(dist).size / 1024);
  if (boyutKB && boyutKB > 2500)
    ekle({
      alan: "performans",
      baslik: `Tek dosya ${boyutKB} KB — mobilde ilk açılış yavaşlayabilir`,
      etki: "orta",
      otomatik: false,
      aciklama: "Görsel kalitesini biraz düşürmek ya da kod bölme en etkili iki yol.",
    });

  return { dosyaSayisi: dosyalar.length, toplamSatir, boyutKB };
}

/* ---------------------------------------------- çalıştır */
const veri = veriKontrolu();
const egitim = egitimKontrolu();
const erisim = erisilebilirlik();
const kod = kodSagligi();

const siraNo = { yüksek: 0, orta: 1, düşük: 2 };
bulgular.sort((a, b) => siraNo[a.etki] - siraNo[b.etki]);

baslik("2. AJAN · İYİLEŞTİRME");
console.log(`Kapsam: ${veri.chipSayisi} chip · ${egitim.dersSayisi} ders · ${kod.dosyaSayisi} dosya · ${kod.toplamSatir} satır`);
console.log(`Bulgu: ${bulgular.length} (otomatik düzeltilebilir: ${bulgular.filter((b) => b.otomatik).length})`);
for (const b of bulgular) console.log(`  [${b.etki}] ${b.baslik}`);

// Diğer ajanlarla tutarlılık için genel bir "durum" alanı da yazılır;
// otomasyon sayfası bunu okuyup null göstermek yerine anlamlı bir rozet basar.
const yuksekSayisi = bulgular.filter((b) => b.etki === "yüksek").length;
const durum = yuksekSayisi > 0 ? "dikkat" : "tamam";
const { dosya } = raporYaz("iyilestirme", {
  durum,
  olcumler: { veri, egitim, erisim, kod },
  bulgular,
});
console.log("Rapor:", rel(dosya));
