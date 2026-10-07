import { ExternalLink, MemoryStick } from "lucide-react";
import bellek from "@/data/bellek_fiyat.json";

const aralik = (g) => (g.alt === g.ust ? `+%${g.alt}` : `+%${g.alt}–${g.ust}`);
const tarihTR = (t) => new Date(`${t}T12:00:00Z`).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

/** Çeyreklik göstergeleri aynı ölçekte (0–25%) çizer; yıllık HBM ayrı kartta, çünkü ölçeği bambaşka. */
export default function BellekFiyatlari() {
  const ceyreklik = bellek.gostergeler.filter((g) => g.olcu === "çeyreklik");
  const yillik = bellek.gostergeler.filter((g) => g.olcu !== "çeyreklik");
  const olcek = Math.max(25, ...ceyreklik.map((g) => g.ust));
  const y = bellek.yigin;
  const yMax = Math.max(y.once.usd, y.sonra.usd);

  return (
    <section className="container mx-auto px-4 pb-10 scroll-mt-20" id="bellek" aria-labelledby="bellek-baslik">
      <div className="flex items-center gap-2 mb-1">
        <MemoryStick className="h-4 w-4 text-primary" />
        <h2 id="bellek-baslik" className="font-display font-bold text-xl">Bellek fiyatları: DRAM, NAND ve HBM</h2>
      </div>
      <p className="text-sm text-muted-foreground max-w-3xl mb-5">{bellek.not}</p>

      <div className="grid lg:grid-cols-[1fr_20rem] gap-4">
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Sözleşme fiyatı, bir önceki çeyreğe göre</p>
          <div className="space-y-4">
            {ceyreklik.map((g) => (
              <div key={g.urun}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-sm">{g.urun} <span className="text-muted-foreground text-xs">· {g.donem}</span></span>
                  <span className="font-display font-bold text-red-300 whitespace-nowrap">{aralik(g)}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted/40" role="img" aria-label={`${g.urun}: ${aralik(g)}`}>
                  <div className="absolute inset-y-0 rounded-full bg-red-400/30" style={{ left: 0, width: `${(g.alt / olcek) * 100}%` }} />
                  <div className="absolute inset-y-0 rounded-full bg-red-400" style={{ left: `${(g.alt / olcek) * 100}%`, width: `${Math.max(1.5, ((g.ust - g.alt) / olcek) * 100)}%` }} />
                </div>
                <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-1 font-mono text-[10px] text-muted-foreground hover:text-primary">
                  {g.kaynak} · {tarihTR(g.tarih)}<ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-3 pt-2 border-t border-border/50">
            <span>%0</span><span>%{Math.round(olcek / 2)}</span><span>%{olcek}</span>
          </div>
        </div>

        <div className="space-y-4">
          {yillik.map((g) => (
            <div key={g.urun} className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{g.urun} · {g.donem}, yıllık</p>
              <p className="font-display font-bold text-4xl text-red-300 mt-1">{aralik(g)}</p>
              <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 font-mono text-[10px] text-muted-foreground hover:text-primary">
                {g.kaynak} · {tarihTR(g.tarih)}<ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          ))}
          {y && (
            <div className="rounded-2xl border border-card-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">{y.urun}</p>
              {[y.once, y.sonra].map((n, i) => (
                <div key={n.etiket} className="mb-2">
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{n.etiket}</span><span className="font-semibold">~${n.usd.toLocaleString("tr-TR")}</span></div>
                  <div className="h-2 rounded-full bg-muted/40"><div className="h-full rounded-full" style={{ width: `${(n.usd / yMax) * 100}%`, background: i ? "#f87171" : "#64748b" }} /></div>
                </div>
              ))}
              <a href={y.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-1 font-mono text-[10px] text-muted-foreground hover:text-primary">
                {y.kaynak} · {tarihTR(y.tarih)}<ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {bellek.notlar?.length > 0 && (
        <ul className="mt-4 space-y-1.5 max-w-3xl">
          {bellek.notlar.map((n) => (
            <li key={n.metin} className="text-xs text-muted-foreground">
              • {n.metin} <a href={n.url} target="_blank" rel="noreferrer" className="hover:text-primary underline-offset-2 hover:underline">({n.kaynak})</a>
            </li>
          ))}
        </ul>
      )}
      <p className="font-mono text-[10px] text-muted-foreground mt-3">Son güncelleme: {tarihTR(bellek.guncelleme)}</p>
    </section>
  );
}
