/**
 * 4. AJAN — GELİŞTİRME
 *
 * 2. ajanın bulgularını okur ve GÜVENLE otomatikleştirilebilenleri uygular.
 *
 * Üç katı kural:
 *   1. Sadece `otomatik: true` işaretli bulgular ele alınır. Yargı gerektiren
 *      hiçbir şey (metin yazmak, mimari değiştirmek) otomatik yapılmaz.
 *   2. Her değişiklikten sonra tam test zinciri çalışır. Testler kırılırsa
 *      değişiklik geri alınır.
 *   3. Sonuç asla doğrudan ana dala yazılmaz; ayrı bir dalda bırakılır ve
 *      insan onayı beklenir.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, baslik, calistir, kaynakDosyalari, oku, raporOku, raporYaz, rel } from "../ortak.mjs";

const KURU = process.argv.includes("--kuru"); // deneme modu: dosya yazmaz

baslik("4. AJAN · GELİŞTİRME" + (KURU ? "  (kuru çalıştırma)" : ""));

const rapor = raporOku("iyilestirme");
if (!rapor) {
  console.log("2. ajanın bugünkü raporu yok. Önce iyileştirme ajanını çalıştır.");
  raporYaz("gelistirme", { durum: "atlandı", neden: "iyileştirme raporu bulunamadı" });
  process.exit(0);
}

const hedefler = rapor.bulgular.filter((b) => b.otomatik);
console.log(`${rapor.bulgular.length} bulgudan ${hedefler.length} tanesi otomatik uygulanabilir.\n`);

const uygulanan = [];
const atlanan = [];
const degisenDosyalar = new Set();

/* ---------------------------------------------- düzeltmeler */
const DUZELTMELER = {
  /*
   * NOT — buradan bir düzeltme KALDIRILDI.
   *
   * "alt-ekle" görsellere otomatik alt metni ekliyordu: src ifadesinden
   * türetip `alt={`${imageUrl(c.image)}`}` yazıyordu. Yani alt metni olarak
   * görselin URL'si geçiyordu. Bu, denetimi geçiren ama erişilebilirliği
   * düzeltmeyen bir çıktı: ekran okuyucu kullanıcısına adres okunur.
   * Hiç alt olmamasından daha kötü bir durum.
   *
   * Alt metni görselin NE ANLATTIĞINI bilmeyi gerektirir; bu yargı işidir.
   * Bu yüzden bulgu artık otomatik değil, insana bırakılıyor.
   */

  /** Veri tazeleme 3. ajanın işi; burada sadece tetiklenir. */
  "yenileme-calistir"() {
    if (KURU) return { adet: 0, aciklama: "kuru çalıştırma: yenileme tetiklenmedi" };
    // Ajanın "çalışmış" olması verinin tazelendiği anlamına gelmez; tarihe bakılır.
    const tarihler = () => {
      const f = JSON.parse(fs.readFileSync(path.join(KOK, "src/data/gpu_kiralama.json"), "utf-8")).kaynak.cekildigi_tarih;
      const b = JSON.parse(fs.readFileSync(path.join(KOK, "src/data/bugun.json"), "utf-8")).tarih;
      return `${f}|${b}`;
    };
    // gelen/ boşsa yenilemeyi yeniden çalıştırmanın anlamı yok; üstelik 3. ajan
    // günün yenileme raporunu boş bir sonuçla ezer ("Bugün: güncellendi" →
    // "girdi gelmedi") ve gereksiz ikinci bir derleme yapar.
    const GIRDILER = ["fiyatlar.json", "bugun.json", "bellek.json", "oneriler.json"];
    if (!GIRDILER.some((f) => fs.existsSync(path.join(KOK, "otomasyon", "gelen", f))))
      throw new Error("otomasyon/gelen/ altında işlenecek girdi yok — yenileme yeniden çalıştırılmadı (günün yenileme raporu korunur)");
    const once = tarihler();
    calistir("node otomasyon/ajanlar/3-yenileme.mjs");
    const sonra = tarihler();
    if (once === sonra) throw new Error("yenileme çalıştı ama veri tarihi değişmedi — otomasyon/gelen/ girdisi yok");
    return { adet: 1, aciklama: "veri tazelendi" };
  },
};

for (const b of hedefler) {
  const fn = DUZELTMELER[b.eylem];
  if (!fn) {
    atlanan.push({ ...b, neden: `'${b.eylem}' için tanımlı düzeltme yok` });
    console.log(`  – ${b.baslik}: otomatik düzeltme tanımlı değil`);
    continue;
  }
  try {
    const sonuc = fn();
    uygulanan.push({ bulgu: b.baslik, eylem: b.eylem, ...sonuc });
    console.log(`  ✓ ${b.baslik}: ${sonuc.aciklama}`);
  } catch (e) {
    atlanan.push({ ...b, neden: String(e.message || e) });
    console.log(`  ✗ ${b.baslik}: ${e.message}`);
  }
}

/* ---------------------------------------------- doğrulama */
console.log("\nTestler çalışıyor…");
const testler = [
  { ad: "Derleme", komut: "npx vite build", bekle: "built" },
  { ad: "Tek dosya", komut: "python3 build-single.py", bekle: "HTML" },
  // Gerçek Chromium'da tüm sayfalar + ana akışlar. Çalıştırılamazsa (Chromium yok) "geçti" sayılmaz.
  { ad: "Arayüz duman testi", komut: "node otomasyon/ui-testi.mjs", bekle: "UI testi" },
];

const testSonuclari = [];
let hepsiGecti = true;
for (const t of testler) {
  const r = calistir(t.komut);
  const gecti = r.ok && r.cikti.includes(t.bekle);
  testSonuclari.push({ ad: t.ad, gecti, detay: gecti ? null : r.cikti.trim().split("\n").slice(-8).join("\n") });
  if (!gecti) console.log(r.cikti.trim().split("\n").slice(-8).map((s) => "      " + s).join("\n"));
  console.log(`  ${gecti ? "✓" : "✗"} ${t.ad}`);
  if (!gecti) hepsiGecti = false;
}

/* ---------------------------------------------- geri alma */
let geriAlindi = false;
if (!hepsiGecti && !KURU && degisenDosyalar.size > 0) {
  const g = calistir("git checkout -- src/");
  geriAlindi = g.ok;
  console.log(
    geriAlindi
      ? "\n⚠ Testler kırıldı, değişiklikler geri alındı."
      : "\n⚠ Testler kırıldı ama geri alınamadı (git deposu yok olabilir) — elle kontrol et."
  );
}

const durum = KURU ? "kuru" : !hepsiGecti ? (degisenDosyalar.size ? "geri-alindi" : "test-hatasi") : uygulanan.length ? "uygulandi" : "degisiklik-yok";

baslik("SONUÇ");
console.log("Durum:", durum);
console.log("Değişen dosya:", degisenDosyalar.size);
console.log(
  "\nNot: Bu ajan ana dala yazmaz. Değişiklikleri gözden geçirip kendin commit'lemelisin:\n" +
    "  git diff        # neyin değiştiğini gör\n" +
    "  git checkout -- src/   # beğenmediysen geri al"
);

const { dosya } = raporYaz("gelistirme", {
  durum,
  uygulanan,
  atlanan,
  testler: testSonuclari,
  degisenDosyalar: [...degisenDosyalar],
  geriAlindi,
});
console.log("Rapor:", rel(dosya));
