import { Link } from "@/components/Nav";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";
import { lessons } from "@/data/lessons";
import { getCompleted } from "@/lib/progress";
import { cn } from "@/lib/utils";

const TRACK_LABELS = { temeller: "Temeller", uretim: "Üretim ve Fizik", mimari: "Mimari", bellek: "Bellek", pratik: "Pratik" };
const TRACK_COLORS = { temeller: "#22d3ee", uretim: "#a855f7", mimari: "#f59e0b", bellek: "#34d399", pratik: "#f472b6" };

export default function Learn() {
  const completed = getCompleted();
  const byTrack = {};
  for (const l of [...lessons].sort((a, b) => a.order - b.order)) (byTrack[l.track] = byTrack[l.track] || []).push(l);

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><BookOpen className="h-3.5 w-3.5" />Eğitim</div>
        <h1 className="font-display text-3xl font-bold mb-2">13 ders, sıfırdan uzman seviyesine.</h1>
        <p className="text-muted-foreground mb-2">{completed.length} / {lessons.length} ders tamamlandı.</p>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden max-w-md">
          <div className="h-full bg-primary transition-all" style={{ width: `${(completed.length / lessons.length) * 100}%` }} />
        </div>
      </section>

      {Object.entries(byTrack).map(([track, list]) => (
        <section key={track} className="container mx-auto px-4 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: TRACK_COLORS[track] }}>{TRACK_LABELS[track]}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((l) => {
              const done = completed.includes(l.id);
              return (
                <Link key={l.id} href={`/egitim/${l.id}`} asChild>
                  <a className="rounded-xl border border-card-border bg-card p-4 hover-elevate block" data-testid={`lesson-${l.id}`}>
                    <div className="flex items-start gap-2 mb-2">
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
                      <h3 className="font-display font-bold text-sm leading-snug">{l.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{l.subtitle}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-2">{l.level} · {l.duration}</p>
                  </a>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
