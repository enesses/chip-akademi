import { useMemo } from "react";
import { CalendarDays, ExternalLink, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import data from "@/data/bugun.json";
import { cn } from "@/lib/utils";

const KATEGORI = {
  pozitif: { ad: "Pozitif", renk: "#34d399", isaret: 1, Icon: ThumbsUp },
  notr: { ad: "Nötr", renk: "#94a3b8", isaret: 0, Icon: Minus },
  negatif: { ad: "Negatif", renk: "#f87171", isaret: -1, Icon: ThumbsDown },
};

export default function Bugun() {
  const hesap = useMemo(() => {
    let ta = 0, ti = 0;
    for (const m of data.maddeler) { ta += m.agirlik; ti += m.agirlik * KATEGORI[m.kategori].isaret; }
    return { puan: Math.round(50 + 50 * (ti/ta)), ta, ti };
  }, []);
  const renk = hesap.puan >= 75 ? "#34d399" : hesap.puan >= 60 ? "#22d3ee" : hesap.puan >= 45 ? "#f59e0b" : "#f87171";

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-chip-glow" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><CalendarDays className="h-3.5 w-3.5" />{data.derlenme}</div>
          <h1 className="font-display text-3xl font-bold mb-2">Bugün AI dünyası ne konuşuyor?</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-6 items-start">
          <div className="rounded-2xl border border-card-border bg-card p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Pozitiflik seviyesi</p>
            <p className="font-display font-bold text-5xl mt-3" style={{ color: renk }}>{hesap.puan}</p>
            <p className="font-mono text-[10px] text-muted-foreground">/ 100</p>
            <p className="font-display font-bold mt-3" style={{ color: renk }}>{data.puan.etiket}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{data.puan.yorum}</p>
          </div>
          <div className="space-y-4">
            {data.ozet.map((p, i) => (
              <p key={i} className={cn("leading-relaxed", i===0 ? "text-base text-foreground/90" : "text-sm text-muted-foreground")}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="font-display font-bold text-xl mb-4">Günün gelişmeleri</h2>
        <div className="space-y-3">
          {data.maddeler.map((m, i) => {
            const k = KATEGORI[m.kategori];
            return (
              <div key={i} className="rounded-xl border border-card-border bg-card p-5">
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${k.renk}20`, color: k.renk }}><k.Icon className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base">{m.baslik}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{m.detay}</p>
                  </div>
                </div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground ml-10">
                  {m.kaynak} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
