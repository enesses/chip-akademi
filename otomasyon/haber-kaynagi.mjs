/**
 * Haber kaynağı adaptörü.
 *
 * Anahtar ASLA koda yazılmaz; ortam değişkeninden okunur:
 *   HABER_SAGLAYICI = newsapi | newsdata | gnews | thenewsapi | marketaux
 *   HABER_API_ANAHTARI = ...
 *
 * Her sağlayıcının cevabı farklı biçimde gelir; adaptörler hepsini tek bir
 * ortak şekle çevirir: { baslik, ozet, kaynak, url, tarih }
 */

const SAGLAYICILAR = {
  newsapi: {
    ad: "NewsAPI.org",
    url: (anahtar, sorgu) =>
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(sorgu)}&language=en&sortBy=publishedAt&pageSize=25&apiKey=${anahtar}`,
    ayikla: (j) =>
      (j.articles || []).map((a) => ({
        baslik: a.title,
        ozet: a.description,
        kaynak: a.source?.name,
        url: a.url,
        tarih: a.publishedAt,
      })),
  },
  newsdata: {
    ad: "NewsData.io",
    url: (anahtar, sorgu) =>
      `https://newsdata.io/api/1/news?apikey=${anahtar}&q=${encodeURIComponent(sorgu)}&language=en,tr`,
    ayikla: (j) =>
      (j.results || []).map((a) => ({
        baslik: a.title,
        ozet: a.description,
        kaynak: a.source_id,
        url: a.link,
        tarih: a.pubDate,
      })),
  },
  gnews: {
    ad: "GNews",
    url: (anahtar, sorgu) =>
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(sorgu)}&lang=en&max=25&apikey=${anahtar}`,
    ayikla: (j) =>
      (j.articles || []).map((a) => ({
        baslik: a.title,
        ozet: a.description,
        kaynak: a.source?.name,
        url: a.url,
        tarih: a.publishedAt,
      })),
  },
  thenewsapi: {
    ad: "TheNewsAPI",
    url: (anahtar, sorgu) =>
      `https://api.thenewsapi.com/v1/news/all?api_token=${anahtar}&search=${encodeURIComponent(sorgu)}&language=en&limit=25`,
    ayikla: (j) =>
      (j.data || []).map((a) => ({
        baslik: a.title,
        ozet: a.description,
        kaynak: a.source,
        url: a.url,
        tarih: a.published_at,
      })),
  },
  marketaux: {
    ad: "Marketaux",
    url: (anahtar, sorgu) =>
      `https://api.marketaux.com/v1/news/all?api_token=${anahtar}&search=${encodeURIComponent(sorgu)}&language=en&limit=25`,
    ayikla: (j) =>
      (j.data || []).map((a) => ({
        baslik: a.title,
        ozet: a.description,
        kaynak: a.source,
        url: a.url,
        tarih: a.published_at,
      })),
  },
};

export const SORGU =
  '(AI chip OR GPU OR semiconductor OR "yapay zeka" OR Nvidia OR AMD OR TSMC)';

export function saglayiciListesi() {
  return Object.entries(SAGLAYICILAR).map(([id, s]) => ({ id, ad: s.ad }));
}

/**
 * Haberleri çeker. Anahtar yoksa ya da sağlayıcı bilinmiyorsa hata
 * fırlatmaz — durumu döndürür, çağıran karar verir.
 */
export async function haberleriCek({ sorgu = SORGU } = {}) {
  const saglayiciId = process.env.HABER_SAGLAYICI;
  const anahtar = process.env.HABER_API_ANAHTARI;

  if (!anahtar)
    return { ok: false, neden: "HABER_API_ANAHTARI tanımlı değil", haberler: [] };
  if (!saglayiciId)
    return {
      ok: false,
      neden: `HABER_SAGLAYICI tanımlı değil. Seçenekler: ${Object.keys(SAGLAYICILAR).join(", ")}`,
      haberler: [],
    };

  const s = SAGLAYICILAR[saglayiciId];
  if (!s)
    return {
      ok: false,
      neden: `Bilinmeyen sağlayıcı '${saglayiciId}'. Seçenekler: ${Object.keys(SAGLAYICILAR).join(", ")}`,
      haberler: [],
    };

  try {
    const y = await fetch(s.url(anahtar, sorgu), { headers: { Accept: "application/json" } });
    if (!y.ok) {
      const govde = await y.text();
      return {
        ok: false,
        // Anahtarın kendisi log'a düşmesin diye cevap kırpılır
        neden: `${s.ad} HTTP ${y.status}: ${govde.slice(0, 160)}`,
        haberler: [],
      };
    }
    const j = await y.json();
    const haberler = s.ayikla(j).filter((h) => h.baslik && h.url?.startsWith("http"));
    return { ok: true, saglayici: s.ad, haberler };
  } catch (e) {
    return { ok: false, neden: String(e.message || e).slice(0, 160), haberler: [] };
  }
}

/**
 * Aynı haberin farklı sitelerdeki kopyalarını ayıklar.
 *
 * İlk N kelimeyi karşılaştırmak yetmiyordu: "Nvidia earnings beat
 * expectations" ile "...expectations today" farklı anahtar üretiyordu.
 * Onun yerine kelime kümeleri Jaccard benzerliğiyle karşılaştırılır.
 */
const ETKISIZ = new Set([
  "the","a","an","and","or","of","to","in","on","for","with","as","by","is","are",
  "ve","ile","bir","bu","da","de","için","olarak",
]);

/**
 * Karşılaştırma için metni sadeleştirir.
 *
 * Burada iki tuzak var ve ikisi de test sırasında çıktı:
 *   · Türkçe yerel ayarıyla küçültmek "NVIDIA"yı "nvıdıa" yapıyor (I → ı),
 *     marka adları eşleşmiyor.
 *   · Yerelsiz küçültmek ise "İ" harfini "i + birleşen nokta" bırakıyor,
 *     bu sefer Türkçe kelimeler eşleşmiyor.
 * Çözüm: önce İ/I'yı düz i'ye sabitle, sonra küçült, sonra kalan aksanları
 * temizle. Sonuç yalnızca eşleştirme anahtarı olarak kullanılır, ekrana
 * basılmaz — bu yüzden aksan kaybı sorun değil.
 */
function sadelestir(metin) {
  return metin
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function kelimeKumesi(metin) {
  return new Set(
    sadelestir(metin)
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((k) => k.length > 2 && !ETKISIZ.has(k))
  );
}

function benzerlik(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let kesisim = 0;
  for (const k of a) if (b.has(k)) kesisim++;
  return kesisim / (a.size + b.size - kesisim); // Jaccard
}

export function tekillestir(haberler, esik = 0.6) {
  const tutulan = [];
  const kumeler = [];
  for (const h of haberler) {
    const k = kelimeKumesi(h.baslik);
    if (kumeler.some((mevcut) => benzerlik(k, mevcut) >= esik)) continue;
    kumeler.push(k);
    tutulan.push(h);
  }
  return tutulan;
}

// Eski isim yazım hatası içeriyordu; geriye dönük uyumluluk için korunuyor.
export const tekilleştir = tekillestir;
