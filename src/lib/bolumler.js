/**
 * Uygulamanın bölüm haritası — tek kaynak.
 *
 * Üst menü, konum şeridi, mobil menü, hızlı arama ve anasayfadaki bölüm
 * rehberi hepsi buradan beslenir. Yeni bir sayfa eklerken yalnızca buraya
 * bir satır eklemek yeter.
 *
 * `eslesen`: bu bölüme ait sayılan yol önekleri (detay sayfaları dahil).
 */
import {
  Microchip, Cpu, MemoryStick, Smartphone, GitCompareArrows, BadgeDollarSign,
  GraduationCap, ListChecks, Library, NotebookPen,
  PencilRuler, LayoutGrid, Newspaper, Workflow,
} from "lucide-react";

export const GRUPLAR = [
  {
    id: "cipler",
    ad: "Çipler",
    ozet: "Kataloğu gez, cihazların içine bak, yan yana koy.",
    bolumler: [
      { id: "gpu", ad: "GPU", yol: "/kategori/GPU", ikon: Microchip,
        aciklama: "Ekran kartları ve yapay zekâ hızlandırıcıları",
        anahtar: "grafik ekran kartı hızlandırıcı nvidia amd" },
      { id: "cpu", ad: "CPU", yol: "/kategori/CPU", ikon: Cpu,
        aciklama: "İşlemciler ve telefon/dizüstü SoC'ları",
        anahtar: "işlemci soc apple snapdragon intel ryzen" },
      { id: "bellek", ad: "Bellek", yol: "/kategori/RAM", ikon: MemoryStick,
        aciklama: "HBM, GDDR, DDR ve LPDDR bellek türleri",
        anahtar: "ram hbm gddr ddr lpddr" },
      { id: "ic", ad: "İç", yol: "/ic", eslesen: ["/ic/"], ikon: Smartphone,
        aciklama: "Telefon, bilgisayar ve AI cihazlarının içi",
        anahtar: "cihaz teardown iphone pixel macbook humane steam deck içi" },
      { id: "karsilastir", ad: "Karşılaştır", yol: "/karsilastir", ikon: GitCompareArrows,
        aciklama: "Çipleri yan yana koy, nerede geride kaldığını gör",
        anahtar: "kıyas karşılaştırma fark" },
      { id: "fiyatlar", ad: "Fiyatlar", yol: "/fiyatlar", ikon: BadgeDollarSign,
        aciklama: "Bulutta GPU kiralama ve bellek sözleşme fiyatları",
        anahtar: "kiralama fiyat dolar saat bulut" },
    ],
  },
  {
    id: "ogren",
    ad: "Öğren",
    ozet: "Sıfırdan dersler, kendini sına, terimlere bak.",
    bolumler: [
      { id: "egitim", ad: "Dersler", yol: "/egitim", eslesen: ["/egitim/"], ikon: GraduationCap,
        aciklama: "Chip nedir'den başlayıp adım adım ilerleyen dersler",
        anahtar: "eğitim ders öğren başla" },
      { id: "sinav", ad: "Sınav", yol: "/sinav", ikon: ListChecks,
        aciklama: "Öğrendiklerini sorularla sına",
        anahtar: "test quiz soru" },
      { id: "sozluk", ad: "Sözlük", yol: "/sozluk", ikon: Library,
        aciklama: "ALU'dan wafer'a temel terimlerin kısa açıklamaları",
        anahtar: "terim tanım kavram" },
      { id: "notlar", ad: "Notlarım", yol: "/notlar", ikon: NotebookPen,
        aciklama: "Kendi notların; istersen indir",
        anahtar: "not defter" },
    ],
  },
  {
    id: "tasarla",
    ad: "Tasarla",
    ozet: "Kendi çipini yerleştir, puanını gör.",
    bolumler: [
      { id: "yeni-tasarim", ad: "Yeni tasarım", yol: "/tasarla", eslesen: ["/tasarla/"], ikon: PencilRuler,
        aciklama: "Bloklarla kendi çipini tasarla",
        anahtar: "tasarla atölye die blok yerleştir" },
      { id: "tasarimlarim", ad: "Tasarımlarım", yol: "/atolye", ikon: LayoutGrid,
        aciklama: "Kaydettiğin tasarımlar ve puanları",
        anahtar: "atölye kayıtlı tasarım" },
    ],
  },
  {
    id: "gundem",
    ad: "Gündem",
    ozet: "Bugünün çip haberleri ve günlük güncellemeler.",
    bolumler: [
      { id: "bugun", ad: "Bugün", yol: "/bugun", ikon: Newspaper,
        aciklama: "Son 48 saatin AI ve çip haberleri, günün puanı",
        anahtar: "haber gündem günlük" },
      { id: "otomasyon", ad: "Otomasyon", yol: "/otomasyon", ikon: Workflow,
        aciklama: "Her sabahki veri güncellemesi ve raporu",
        anahtar: "rapor güncelleme güvenlik öneri" },
    ],
  },
];

export const TUM_BOLUMLER = GRUPLAR.flatMap((g) => g.bolumler.map((b) => ({ ...b, grup: g })));

/** Bir yolun hangi bölüme ait olduğunu bulur. Chip detayı Çipler grubuna,
 *  kategorisi bilinmediği için bölümsüz sayılır. */
export function bolumBul(yol) {
  if (!yol) return null;
  for (const b of TUM_BOLUMLER) {
    if (yol === b.yol) return b;
    if (b.eslesen?.some((on) => yol.startsWith(on))) return b;
  }
  return null;
}

export function grupBul(yol) {
  const b = bolumBul(yol);
  if (b) return b.grup;
  if (yol?.startsWith("/chip/")) return GRUPLAR[0];
  return null;
}

/** Türkçe duyarlı, aksansız karşılaştırma için metni sadeleştirir:
 *  "Çipİ Şık" → "cipi sik". */
export function sadelestir(s) {
  return String(s ?? "")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
