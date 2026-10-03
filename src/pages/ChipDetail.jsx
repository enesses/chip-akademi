import { useParams } from "wouter";
import { Link } from "@/components/Nav";
import { ArrowLeft } from "lucide-react";
import { getChipById } from "@/data/chips";
import { imageUrl, manufacturerColors, formatSpecLabel } from "@/lib/utils";
import { scoreChip, rankInClass } from "@/lib/chipScore";

export default function ChipDetail() {
  const { id } = useParams();
  const chip = getChipById(id);
  if (!chip) return <div className="container mx-auto px-4 py-16">Chip bulunamadı.</div>;

  const s = scoreChip(chip);
  const rank = rankInClass(chip);
  const color = manufacturerColors[chip.manufacturer] || "#94a3b8";
  const scoreColor = s.score===null ? "#94a3b8" : s.score>=80?"#34d399":s.score>=60?"#22d3ee":s.score>=40?"#f59e0b":"#f87171";

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href={`/kategori/${chip.category}`} asChild>
        <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {chip.category} kataloğuna dön
        </a>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="rounded-2xl overflow-hidden border border-card-border bg-card">
          <img src={imageUrl(chip.image)} alt={chip.name} className="w-full aspect-[4/3] object-cover" />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color }}>{chip.manufacturer}</p>
          <h1 className="font-display text-3xl font-bold mb-3">{chip.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{chip.description || chip.use_cases}</p>
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div><span className="text-muted-foreground">Süreç düğümü</span><p className="font-medium">{chip.process_node}</p></div>
            <div><span className="text-muted-foreground">Yıl</span><p className="font-medium">{chip.release_year}</p></div>
            <div><span className="text-muted-foreground">Transistör</span><p className="font-medium">{chip.transistor_count}</p></div>
            <div><span className="text-muted-foreground">Die alanı</span><p className="font-medium">{chip.die_size}</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-6 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Tasarım puanı · {s.clsLabel}</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="font-display font-bold text-4xl" style={{ color: scoreColor }}>{s.score ?? "—"}</span>
              {s.score !== null && <span className="font-mono text-xs text-muted-foreground mb-1.5">sınıfında {rank.rank}. / {rank.total}</span>}
            </div>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">Veri kapsamı %{s.coverage}</p>
        </div>
        {s.score === null ? <p className="text-sm text-muted-foreground">{s.reason}</p> : (
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {s.parts.map((part) => (
              <div key={part.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground/85">{part.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">ağırlık %{Math.round(part.weight*100)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ width: `${Math.round(part.norm*100)}%`, background: scoreColor }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(chip.key_specs || {}).map(([k, v], i) => (
              <tr key={k} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground w-1/3">{formatSpecLabel(k)}</td>
                <td className="px-4 py-2.5">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
