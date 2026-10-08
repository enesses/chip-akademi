/**
 * İndirilebilir Claude skill'leri.
 *
 * Her skill src/data/skiller/<ad>/ klasöründe; en az bir SKILL.md içerir.
 * Klasördeki tüm dosyalar derlemeye metin olarak gömülür ve indirirken
 * "<ad>/..." yoluyla zip'e konur — Claude'un beklediği yapı: zip'in kökünde
 * skill klasörü, içinde SKILL.md (support.claude.com/en/articles/12512198).
 */

const HAM = import.meta.glob("./skiller/*/**", { query: "?raw", import: "default", eager: true });

/** Basit YAML ön bölüm okuyucu: yalnızca "anahtar: değer" satırları. */
function onBolum(md) {
  const m = /^---\n([\s\S]*?)\n---/.exec(md);
  const sonuc = {};
  if (!m) return sonuc;
  for (const satir of m[1].split("\n")) {
    const i = satir.indexOf(":");
    if (i > 0) sonuc[satir.slice(0, i).trim()] = satir.slice(i + 1).trim();
  }
  return sonuc;
}

/** Sayfada gösterilen, SKILL.md'de olmayan bilgiler. */
const EK = {
  "html-oyun-yapici": {
    baslik: "Tarayıcı oyunu yapıcı",
    kategori: "Oyun",
    ornek: "Uzayda göktaşlarından kaçan bir astronotla sonsuz koşu oyunu yap.",
    neYapar: ["Tek HTML dosyası, kütüphane yok", "Klavye + dokunmatik kontrol", "Başlangıç / oyun / bitti ekranları, en yüksek skor", "Kodla üretilen ses efektleri"],
  },
  "oyun-tasarim-belgesi": {
    baslik: "Oyun tasarım belgesi (GDD)",
    kategori: "Oyun",
    ornek: "Zamanı geri saran bir kedinin bulmaca oyunu için GDD yaz, 2 kişiyiz, 9 ayımız var.",
    neYapar: ["Çekirdek döngü (30 sn / 5 dk / 1 saat)", "Mekanik tablosu", "Olmazsa olmaz / sonraya kapsam tablosu", "Riskler ve ucuz prototip testleri"],
  },
  "gorsel-prompt-yazari": {
    baslik: "Görsel prompt yazarı",
    kategori: "Görsel",
    ornek: "Yağmurlu İstanbul akşamında simit satan bir robot görseli için Midjourney prompt'u yaz.",
    neYapar: ["Türkçe fikir → İngilizce prompt", "Araca göre parametreler (--ar, negatif prompt)", "3 farklı yaklaşım", "Hangi kelimenin neyi değiştirdiğinin açıklaması"],
  },
  "turkce-yazim-denetimi": {
    baslik: "Türkçe yazım denetimi",
    kategori: "Yazı",
    ornek: "Şu metnin yazım hatalarını düzelt: …",
    neYapar: ["de/da, ki, mi ve kesme işareti kuralları", "Değişiklik tablosu, her birinin kuralı", "Üslubu değiştirmez", "Emin olmadığı yerleri ayrıca listeler"],
  },
  "ders-calisma-kartlari": {
    baslik: "Ders çalışma kartları",
    kategori: "Öğrenme",
    ornek: "Bu biyoloji notlarından çalışma kartları yap, sınavım 5 gün sonra.",
    neYapar: ["Tek sayfalık özet", "Anki'ye aktarılabilir CSV kartlar", "Sınav tarihine göre tekrar planı", "Notta olmayan bilgi eklemez"],
  },
  "kod-inceleme": {
    baslik: "Kod inceleme",
    kategori: "Kod",
    ornek: "Bu fonksiyonu incele, birleştirmeye hazır mı?",
    neYapar: ["Kritik / önemli / öneri sıralaması", "Her bulgu için tetikleyen durum", "Yalnızca değişen kodu gösterir", "Kritik bulgular için test önerisi"],
  },
  "cip-karsilastirma": {
    baslik: "Çip karşılaştırma",
    kategori: "Çip",
    ornek: "H100 ile MI300X'i 70B'lik bir modelle çıkarım için karşılaştır.",
    neYapar: ["Kaynaklı özellik tablosu", "Hassasiyet (FP8/FP16, seyrek/yoğun) karışmaz", "Doğrulanamayan rakam yazılmaz", "Kullanım amacına göre kazanan"],
  },
  "toplanti-ozeti": {
    baslik: "Toplantı özeti",
    kategori: "İş",
    ornek: "Şu toplantı notlarından kararları ve görevleri çıkar: …",
    neYapar: ["Kararlar ve görev tablosu", "Sorumlu/tarih yoksa uydurmaz", "Açık sorular", "Gönderilecek özet e-posta"],
  },
};

function skillleriTopla() {
  const klasorler = new Map();
  for (const [yol, icerik] of Object.entries(HAM)) {
    const m = /^\.\/skiller\/([^/]+)\/(.+)$/.exec(yol);
    if (!m) continue;
    const [, ad, dosya] = m;
    if (!klasorler.has(ad)) klasorler.set(ad, []);
    klasorler.get(ad).push({ yol: `${ad}/${dosya}`, icerik });
  }
  const liste = [];
  for (const [ad, dosyalar] of klasorler) {
    const skill = dosyalar.find((d) => d.yol === `${ad}/SKILL.md`);
    if (!skill) continue;
    const fm = onBolum(skill.icerik);
    dosyalar.sort((a, b) => (a.yol.endsWith("SKILL.md") ? -1 : b.yol.endsWith("SKILL.md") ? 1 : a.yol.localeCompare(b.yol)));
    liste.push({
      id: ad,
      ad: fm.name || ad,
      aciklama: fm.description || "",
      dosyalar,
      skillMd: skill.icerik,
      satir: skill.icerik.split("\n").length,
      ...(EK[ad] || { baslik: ad, kategori: "Diğer", ornek: "", neYapar: [] }),
    });
  }
  const sira = Object.keys(EK);
  return liste.sort((a, b) => sira.indexOf(a.id) - sira.indexOf(b.id));
}

export const SKILLER = skillleriTopla();
