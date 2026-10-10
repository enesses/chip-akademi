import { useMemo, useState } from "react";
import { ArrowUpRight, Newspaper, Rss, Search } from "lucide-react";
import data from "@/data/haberler.json";
import { Link } from "@/components/Nav";
import { sadelestir } from "@/lib/bolumler";
import { cn } from "@/lib/utils";

const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const KONULAR = data.konular || {};
const TON = {
  pozitif: { ad: "Olumlu", renk: "#34d399" },
  notr: { ad: "Nötr", renk: "#94a3b8" },
  negatif: { ad: "Olumsuz", renk: "#f87171" },
};

function gunBasligi(iso) {
  const [y, a, g] = iso.split("-").map(Number);
  const t = new Date(y, a - 1, g);
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
  const fark = Math.round((bugun - t) / 864e5);
  const uzun = `${g} ${AY[a - 1]} ${GUN[t.getDay()]}`;
  if (fark === 0) return { kisa: "Bugün", uzun };
  if (fark === 1) return { kisa: "Dün", uzun };
  return { kisa: uzun, uzun: null };
}

const ILK_GUN = 3;

export default function Haberler() {
  const [konu, setKonu] = useState("hepsi");
  const [ton, setTon] = useState("hepsi");
  const [sorgu, setSorgu] = useState("");
  const [gunSiniri, setGunSiniri] = useState(ILK_GUN);

  const tum = data.haberler || [];
  const sayilar = useMemo(() => {
    const s = { hepsi: tum.length };
    for (const h of tum) for (const k of h.konular) s[k] = (s[k] || 0) + 1;
    return s;
  }, [tum]);
  const kaynakSayisi = useMemo(() => new Set(tum.map((h) => h.kaynak.split(/[(;]/)[0].trim())).size, [tum]);

  const gunler = useMemo(() => {
    const q = sadelestir(sorgu);
    const liste = tum.filter((h) =>
      (konu === "hepsi" || h.konular.includes(konu)) &&
      (ton === "hepsi" || h.ton === ton) &&
      (!q || q.split(" ").every((k) => sadelestir(`${h.baslik} ${h.detay} ${h.kaynak}`).includes(k))));
    const g = new Map();
    for (const h of liste) {
      if (!g.has(h.tarih)) g.set(h.tarih, []);
      g.get(h.tarih).push(h);
    }
    return [...g.entries()];
  }, [tum, konu, ton, sorgu]);

  const filtreVar = konu !== "hepsi" || ton !== "hepsi" || sorgu;
  // Filtre ya da aramada tüm günler taranır; düz akışta ilk günler gösterilir.
  const gorunen = filtreVar ? gunler : gunler.slice(0, gunSiniri);
  const toplam = gunler.reduce((t, [, l]) => t + l.length, 0);
  const sonGuncelleme = data.guncelleme ? gunBasligi(data.guncelleme) : null;

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />Haberler
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Çip ve yapay zekâ haberleri</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Her sabah otomasyon yeni haberleri ekler; son 30 gün burada birikir. Her haber kaynağında açılıp kontrol edildikten sonra
          Türkçe özetlenir — başlığa tıklayınca kaynağa gidersin.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Rss className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Son güncelleme: <span className="text-foreground">{sonGuncelleme ? (sonGuncelleme.uzun ? `${sonGuncelleme.kisa}, ${sonGuncelleme.uzun}` : sonGuncelleme.kisa) : "—"}</span>
          </span>
          <span><span className="text-foreground tabular-nums">{tum.length}</span> haber · <span className="text-foreground tabular-nums">{kaynakSayisi}</span> kaynak</span>
          <Link href="/bugun" className="text-primary hover:underline">Günün özeti ve puanı → Bugün</Link>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-card-border bg-card/50 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[12rem] max-w-sm">
              <span className="sr-only">Haberlerde ara</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input type="search" value={sorgu} onChange={(e) => setSorgu(e.target.value)} placeholder="Ara: Nvidia, HBM, TSMC…"
                className="w-full rounded-xl border border-card-border bg-card/70 pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60" />
            </label>
            <div className="inline-flex rounded-xl border border-card-border p-0.5 bg-card/60" role="radiogroup" aria-label="Ton">
              {[["hepsi", "Hepsi"], ...Object.entries(TON).map(([k, v]) => [k, v.ad])].map(([k, ad]) => (
                <button key={k} type="button" role="radio" aria-checked={ton === k} onClick={() => setTon(k)}
                  className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors", ton === k ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {TON[k] && <span className="w-1.5 h-1.5 rounded-full" style={{ background: TON[k].renk }} aria-hidden="true" />}
                  {ad}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto serit-kaydir" role="tablist" aria-label="Konu">
            {[["hepsi", "Tüm konular"], ...Object.entries(KONULAR)].map(([k, ad]) => (
              <button key={k} type="button" role="tab" aria-selected={konu === k} onClick={() => setKonu(k)}
                className={cn("shrink-0 rounded-full border px-3 py-1 text-xs transition-colors",
                  konu === k ? "border-primary/60 bg-primary/10 text-foreground" : "border-card-border text-muted-foreground hover:text-foreground")}>
                {ad} <span className="opacity-60 tabular-nums">{sayilar[k] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground" role="status">{filtreVar ? `${toplam} haber bulundu` : `${gunler.length} gün`}</p>
          {filtreVar && (
            <button type="button" onClick={() => { setKonu("hepsi"); setTon("hepsi"); setSorgu(""); }} className="text-xs text-primary hover:underline">
              Filtreleri temizle
            </button>
          )}
        </div>

        {gorunen.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10">Bu filtrelerle haber yok. Bir filtreyi kaldırmayı dene.</p>
        ) : (
          <div className="mt-2 grid gap-8">
            {gorunen.map(([tarih, liste]) => {
              const gb = gunBasligi(tarih);
              return (
                <section key={tarih} aria-labelledby={`gun-${tarih}`}>
                  <h2 id={`gun-${tarih}`} className="py-2 flex items-baseline gap-2 border-b border-border/60">
                    <span className="font-display font-semibold text-lg">{gb.kisa}</span>
                    {gb.uzun && <span className="text-xs text-muted-foreground">{gb.uzun}</span>}
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">{liste.length} haber</span>
                  </h2>
                  <ol className="mt-1 divide-y divide-card-border/70">
                    {liste.map((h) => (
                      <li key={h.id}>
                        <article className="py-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
                          <span className="mt-2 w-2 h-2 rounded-full" style={{ background: TON[h.ton]?.renk || "#64748b" }}
                            title={TON[h.ton]?.ad || "ton belirtilmemiş"} aria-hidden="true" />
                          <div className="min-w-0">
                            <h3 className="font-medium leading-snug">
                              <a href={h.url} target="_blank" rel="noreferrer" className="group hover:text-primary">
                                {h.baslik}
                                <ArrowUpRight className="inline h-3.5 w-3.5 ml-0.5 -mt-0.5 opacity-50 group-hover:opacity-100" aria-hidden="true" />
                              </a>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{h.detay}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                              <span className="text-foreground/80">{h.kaynak}</span>
                              {h.ton && <><span aria-hidden="true">·</span><span style={{ color: TON[h.ton].renk }}>{TON[h.ton].ad}</span></>}
                              <span aria-hidden="true">·</span>
                              {h.konular.map((k) => (
                                <button key={k} type="button" onClick={() => setKonu(k)}
                                  className="rounded border border-card-border px-1.5 py-0.5 hover:text-foreground hover:border-primary/40">
                                  {KONULAR[k] || k}
                                </button>
                              ))}
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}

        {!filtreVar && gunler.length > gunSiniri && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setGunSiniri((n) => n + 5)}
              className="rounded-xl border border-card-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50">
              Önceki günleri göster ({gunler.length - gunSiniri} gün daha)
            </button>
          </div>
        )}

        <p className="mt-10 text-[11px] text-muted-foreground max-w-2xl leading-relaxed">
          Renkli nokta haberin çip ve yapay zekâ sektörü için tonunu gösterir (olumlu / nötr / olumsuz) — yatırım tavsiyesi değildir.
          Konu etiketleri yeni haberlerde otomasyonca seçilir; 11 Ekim öncesindeki haberlerde anahtar kelimelerden çıkarıldı.
        </p>
      </section>
    </div>
  );
}
