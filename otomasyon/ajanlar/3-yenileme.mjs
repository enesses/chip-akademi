/**
 * 3. AJAN — YENİLEME  (her gün)
 *
 * İki veri kaynağını tazeler, sonra uygulamayı yeniden derler:
 *   · Fiyatlar  → otomasyon/gelen/fiyatlar.json (Claude günlük görevi yazar)
 *   · Bugün     → haber kaynaklarından taslak; özet/sınıflandırma için
 *                 ANTHROPIC_API_KEY varsa modele sorar, yoksa taslağı
 *                 "insan onayı bekliyor" olarak işaretler.
 *
 * Kural: hiçbir adım, doğrulanamayan veriyle mevcut dosyanın üzerine yazmaz.
 */
import fs from "node:fs";
import path from "node:path";
import { KOK, baslik, calistir, raporYaz, rel } from "../ortak.mjs";
import { haberleriCek, tekillestir } from "../haber-kaynagi.mjs";

const adimlar = [];
const not = (ad, durum, detay) => {
  adimlar.push({ ad, durum, detay });
  console.log(`  ${durum === "ok" ? "✓" : durum === "atlandı" ? "–" : durum === "uyari" ? "!" : "✗"} ${ad}: ${detay}`);
};

baslik("3. AJAN · YENİLEME");

if (process.argv.includes("--kuru")) {
  // Deneme modunda veri işlenmez ve derleme yapılmaz; aksi hâlde gelen/ dosyaları tüketilir.
  console.log("  – kuru çalıştırma: veri işlenmedi, derleme yapılmadı");
  process.exit(0);
}

/* ---------------------------------------------- dışarıdan gelen veri */
/*
 * Bu kapsayıcının kabuğu getdeploying.com'a ve haber sitelerine ulaşamıyor.
 * Veriyi her sabah Claude'un günlük görevi web'den toplayıp otomasyon/gelen/
 * altına yazar; burada yalnızca doğrulanıp işlenir. (Eskiden burada çağrılan
 * scripts/fiyat_botu.py hiçbir şey çekmeyen bir taslaktı ama "ok" dönüyordu —
 * fiyatlar bir ay boyunca sessizce eskidi.)
 */
const fiyatDosya = path.join(KOK, "src", "data", "gpu_kiralama.json");
const isle = calistir("node otomasyon/veri-isle.mjs");
for (const satir of isle.cikti.split("\n").filter((s) => s.trim())) console.log("  " + satir.trim());

/*
 * "Tarih bugün" ile "bu çalıştırmada yeni veri işlendi" aynı şey değil: gün içinde
 * ikinci kez çalışınca tarih zaten bugündür ama sayfa hiç okunmamış olabilir.
 * Bu yüzden veri-isle'nin bu çalıştırmadaki sonucuna da bakılır.
 */
let son = {};
try { son = JSON.parse(fs.readFileSync(path.join(KOK, "otomasyon", "gelen", ".son-isleme.json"), "utf-8")).sonuc || {}; } catch {}
const bugunStr = new Date().toISOString().slice(0, 10);
const fiyatTarih = JSON.parse(fs.readFileSync(fiyatDosya, "utf-8")).kaynak.cekildigi_tarih;
if (son.fiyat?.ok) not("Fiyat verisi", "ok", `bu çalıştırmada güncellendi — ${son.fiyat.detay}`);
else if (son.fiyat && !son.fiyat.ok) not("Fiyat verisi", "hata", `gelen veri reddedildi: ${son.fiyat.detay} (mevcut veri ${fiyatTarih})`);
else if (fiyatTarih === bugunStr) not("Fiyat verisi", "atlandı", "bu çalıştırmada fiyat girdisi gelmedi; mevcut veri bugün daha önce işlenmiş");
else not("Fiyat verisi", "hata", `güncellenmedi — son veri ${fiyatTarih}. otomasyon/gelen/fiyatlar.json gelmedi (fiyat sayfası okunamadı mı?)`);
if (son.fiyat?.supheli?.length) not("Şüpheli fiyat", "uyari", `${son.fiyat.supheli.join("; ")} — tek seferde >%50 oynama, yazılmadı; elle kontrol et`);
if (son.bellek) not("Bellek fiyatları", son.bellek.ok ? "ok" : "hata", son.bellek.detay);
const bugunGeldi = son.bugun;

/* ---------------------------------------------- bugün */
const bugunDosya = path.join(KOK, "src", "data", "bugun.json");
const bugunVeri = JSON.parse(fs.readFileSync(bugunDosya, "utf-8"));
const bugunTarih = new Date().toISOString().slice(0, 10);

if (bugunGeldi && !bugunGeldi.ok) {
  not("Bugün sayfası", "hata", `gelen veri reddedildi: ${bugunGeldi.detay}`);
} else if (bugunGeldi?.ok) {
  not("Bugün sayfası", "ok", `bu çalıştırmada güncellendi — ${bugunGeldi.detay}`);
} else if (bugunVeri.tarih === bugunTarih) {
  not("Bugün sayfası", "atlandı", `bu çalıştırmada girdi gelmedi; bugünün verisi daha önce işlenmiş (${bugunVeri.maddeler.length} madde, puan ${bugunVeri.puan.deger})`);
} else {
  const haber = await haberleriCek();

  if (!haber.ok) {
    not("Bugün sayfası", "hata", `güncellenmedi — otomasyon/gelen/bugun.json gelmedi (${haber.neden})`);
  } else {
    const liste = tekillestir(haber.haberler).slice(0, 20);
    not("Haber çekme", "ok", `${haber.saglayici} · ${liste.length} tekil başlık`);

    if (process.env.ANTHROPIC_API_KEY) {
      const sonuc = await bugunYenile(bugunDosya, bugunVeri, bugunTarih, liste);
      not("Bugün sayfası", sonuc.ok ? "ok" : "hata", sonuc.detay);
    } else {
      /*
       * Başlıklar elimizde ama hangisinin olumlu hangisinin olumsuz olduğuna
       * karar vermek yargı gerektiriyor. Anahtar yoksa yayına çıkmaz; taslak
       * dosyaya yazılıp insan onayı beklenir. Yanlış bir "Bugün" sayfası,
       * eski bir "Bugün" sayfasından daha kötüdür.
       */
      const taslak = path.join(KOK, "src", "data", "bugun.taslak.json");
      fs.writeFileSync(
        taslak,
        JSON.stringify({ tarih: bugunTarih, kaynak: haber.saglayici, haberler: liste }, null, 2),
        "utf-8"
      );
      not(
        "Bugün sayfası",
        "atlandı",
        `${liste.length} başlık ${rel(taslak)} dosyasına yazıldı; sınıflandırma için ANTHROPIC_API_KEY gerekiyor`
      );
    }
  }
}

/* ---------------------------------------------- derleme */
const derleme = calistir("npx vite build");
not("Derleme", derleme.ok ? "ok" : "hata", derleme.ok ? "başarılı" : "vite build başarısız");

if (derleme.ok) {
  const tek = calistir("python3 build-single.py");
  not("Tek dosya", tek.ok ? "ok" : "hata", tek.cikti.trim().split("\n").slice(-1)[0]);
}

/* ---------------------------------------------- yardımcı */
async function bugunYenile(dosya, mevcut, tarih, haberler = []) {
  try {
    const haberMetni = haberler.length
      ? `\nBugün toplanan başlıklar (yalnızca bunları kullan, uydurma):\n${haberler
          .map((h) => `- ${h.baslik} (${h.kaynak}) ${h.url}`)
          .join("\n")}\n`
      : "";

    const istem = `Bugün ${tarih}. Yapay zeka ve çip dünyasındaki güncel gelişmeleri özetle.${haberMetni}
Aşağıdaki JSON şemasına birebir uyan, SADECE JSON döndür (markdown yok):
${JSON.stringify({ tarih: "", derlenme: "", ozet: ["..."], puan: { deger: 0, etiket: "", yorum: "" }, yontem: mevcut.yontem, maddeler: [{ baslik: "", detay: "", kategori: "pozitif|notr|negatif", agirlik: 1, neden: "", kaynak: "", url: "" }] }, null, 1)}

Kurallar:
- Her madde gerçek bir habere dayanmalı ve kaynak URL'si olmalı. Emin olmadığın hiçbir şeyi yazma.
- puan.deger = 50 + 50 × (Σ ağırlık×işaret ÷ Σ ağırlık); pozitif=+1, notr=0, negatif=-1.
- Türkçe yaz. 8-12 madde.`;

    const y = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: istem }],
      }),
    });

    if (!y.ok) return { ok: false, detay: `API ${y.status}` };
    const j = await y.json();
    const metin = j.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const veri = JSON.parse(metin);

    // Doğrulama: puan formülle tutuyor mu?
    const isaret = { pozitif: 1, notr: 0, negatif: -1 };
    const ta = veri.maddeler.reduce((t, m) => t + m.agirlik, 0);
    const ti = veri.maddeler.reduce((t, m) => t + m.agirlik * isaret[m.kategori], 0);
    const beklenen = Math.round(50 + 50 * (ti / ta));
    if (veri.puan.deger !== beklenen) veri.puan.deger = beklenen; // formül esastır

    if (!veri.maddeler.every((m) => m.url?.startsWith("http")))
      return { ok: false, detay: "kaynaksız madde var, yazılmadı" };

    veri.tarih = tarih;
    veri.yontem = mevcut.yontem;
    fs.writeFileSync(dosya, JSON.stringify(veri, null, 2), "utf-8");
    return { ok: true, detay: `${veri.maddeler.length} madde, puan ${beklenen}` };
  } catch (e) {
    return { ok: false, detay: String(e.message || e).slice(0, 120) };
  }
}

const durum = adimlar.some((a) => a.durum === "hata") ? "kısmi" : "ok";
const { dosya } = raporYaz("yenileme", { durum, adimlar });
console.log("Rapor:", rel(dosya));
