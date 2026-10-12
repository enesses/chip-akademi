#!/usr/bin/env node
/**
 * Yapay zekâ modelleri liderlik tablosu — haftalık yenileme.
 *
 * Kaynak: Artificial Analysis'in resmi ücretsiz API'si
 *   GET https://artificialanalysis.ai/api/v2/language/models/free
 *   başlık: x-api-key: $AA_API_KEY   (ücretsiz katman: 24 saatte 100 istek)
 *
 * Neden API: Sitenin kullanım şartları sayfanın kopyalanmasını ve
 * kazınmasını yasaklıyor; API verisi ise kaynak gösterilerek yayınlanabiliyor
 * ("When you display or share API data, credit Artificial Analysis as the
 * source"). Bu yüzden web sayfası ASLA okunup tabloya aktarılmaz — tek giriş
 * yolu bu betiktir. Uygulama sayfası atfı her zaman gösterir.
 *
 * Kullanım:
 *   AA_API_KEY=... node otomasyon/modeller.mjs           # API'den çek, yaz
 *   node otomasyon/modeller.mjs --dosya yanit.json        # API'den elle indirilmiş yanıtı içe aktar
 *   node otomasyon/modeller.mjs --kontrol                 # yalnızca mevcut dosyayı doğrula
 *
 * Çıkış kodları: 0 yazıldı · 2 anahtar yok · 3 izin engeli / ağ hatası ·
 * 4 API hatası (401/429/5xx) · 5 yanıt beklenen biçimde değil.
 * Hata durumunda mevcut src/data/modeller.json'a dokunulmaz (eski veri kalır,
 * uydurma veri yazılmaz).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const HEDEF = join(KOK, "src/data/modeller.json");
const API = "https://artificialanalysis.ai/api/v2/language/models/free";
const EN_FAZLA_SAYFA = 20; // güvenlik sınırı; ücretsiz kota 100 istek/gün

const sayi = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const yuvarla = (v, b = 2) => (v == null ? null : Math.round(v * 10 ** b) / 10 ** b);

/** API'nin tek model kaydını uygulamanın kısa biçimine çevirir. null = ölçülmemiş. */
export function donustur(m) {
  if (!m || typeof m !== "object" || typeof m.name !== "string" || !m.name.trim()) return null;
  const e = m.evaluations || {};
  const f = m.pricing || {};
  const p = m.performance || {};
  const maliyet = m.artificial_analysis_intelligence_index_cost || {};
  return {
    id: String(m.slug || m.id || m.name),
    ad: m.name.trim(),
    sirket: m.model_creator?.name?.trim() || "—",
    yayin: typeof m.release_date === "string" && /^\d{4}-\d{2}-\d{2}/.test(m.release_date) ? m.release_date.slice(0, 10) : null,
    zeka: yuvarla(sayi(e.artificial_analysis_intelligence_index), 1),
    kodlama: yuvarla(sayi(e.artificial_analysis_coding_index), 1),
    ajan: yuvarla(sayi(e.artificial_analysis_agentic_index), 1),
    girdi: yuvarla(sayi(f.price_1m_input_tokens), 3),
    cikti: yuvarla(sayi(f.price_1m_output_tokens), 3),
    gorevMaliyeti: yuvarla(sayi(maliyet.cost_per_task?.total_cost), 4),
    hiz: yuvarla(sayi(p.median_output_tokens_per_second), 1),
    ilkToken: yuvarla(sayi(p.median_time_to_first_token_seconds), 2),
    toplamSure: yuvarla(sayi(p.median_end_to_end_response_time_seconds), 1),
  };
}

/** Birden çok sayfanın data dizilerini birleştirip sıralı tabloyu kurar. */
export function tabloKur(sayfalar, { tarih, surum }) {
  const gorulen = new Set();
  const modeller = [];
  for (const s of sayfalar) {
    if (!s || !Array.isArray(s.data)) throw Object.assign(new Error("yanıtta data dizisi yok"), { kod: 5 });
    for (const ham of s.data) {
      const m = donustur(ham);
      if (!m || gorulen.has(m.id)) continue;
      gorulen.add(m.id);
      modeller.push(m);
    }
  }
  // Zekâ endeksi olmayanlar sona; eşitlikte ada göre (her hafta aynı sıra).
  modeller.sort((a, b) => (b.zeka ?? -1) - (a.zeka ?? -1) || a.ad.localeCompare(b.ad, "en"));
  if (!modeller.some((m) => m.zeka != null)) throw Object.assign(new Error("hiçbir modelde zekâ endeksi yok"), { kod: 5 });
  return {
    guncellendi: tarih,
    kaynak: { ad: "Artificial Analysis", url: "https://artificialanalysis.ai", api: API },
    endeksSurumu: sayi(surum) ?? (typeof surum === "string" ? surum : null),
    adet: modeller.length,
    modeller,
  };
}

async function apidenCek(anahtar) {
  const sayfalar = [];
  let surum = null;
  for (let sayfa = 1; sayfa <= EN_FAZLA_SAYFA; sayfa++) {
    let yanit;
    try {
      yanit = await fetch(`${API}?page=${sayfa}`, { headers: { "x-api-key": anahtar, accept: "application/json" } });
    } catch (e) {
      throw Object.assign(new Error(`izin engeli / ağ hatası: ${e.cause?.code || e.message}`), { kod: 3 });
    }
    if (yanit.status === 403 && !yanit.headers.get("x-ratelimit-remaining")) {
      throw Object.assign(new Error("izin engeli: istek API'ye ulaşmadan reddedildi (403)"), { kod: 3 });
    }
    if (!yanit.ok) {
      const neden = { 401: "API anahtarı geçersiz", 429: "günlük kota doldu" }[yanit.status] || "API hatası";
      throw Object.assign(new Error(`${neden} (HTTP ${yanit.status})`), { kod: 4 });
    }
    const govde = await yanit.json();
    surum ??= govde.intelligence_index_version;
    sayfalar.push(govde);
    if (!govde.pagination?.has_more) break;
  }
  return { sayfalar, surum };
}

function bugun() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

async function main() {
  const arg = process.argv.slice(2);
  if (arg.includes("--kontrol")) {
    const d = JSON.parse(readFileSync(HEDEF, "utf8"));
    console.log(d.guncellendi ? `modeller.json: ${d.adet} model, ${d.guncellendi}` : "modeller.json: henüz veri yok");
    return 0;
  }
  let sayfalar, surum;
  const i = arg.indexOf("--dosya");
  if (i >= 0) {
    const govde = JSON.parse(readFileSync(arg[i + 1], "utf8"));
    const liste = Array.isArray(govde) ? govde : [govde];
    sayfalar = liste;
    surum = liste[0]?.intelligence_index_version;
  } else {
    const anahtar = process.env.AA_API_KEY?.trim();
    if (!anahtar) {
      console.error("AA_API_KEY yok: tablo yenilenmedi (mevcut veri korunuyor).");
      return 2;
    }
    ({ sayfalar, surum } = await apidenCek(anahtar));
  }
  const tablo = tabloKur(sayfalar, { tarih: bugun(), surum });
  writeFileSync(HEDEF, JSON.stringify(tablo, null, 2) + "\n");
  const ilk = tablo.modeller.slice(0, 3).map((m) => `${m.ad} (${m.zeka})`).join(", ");
  console.log(`modeller.json yazıldı: ${tablo.adet} model. İlk üç: ${ilk}`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((k) => process.exit(k), (e) => {
    console.error(`Modeller yenilenemedi — ${e.message}`);
    process.exit(e.kod || 1);
  });
}
