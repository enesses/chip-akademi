import { Link } from "@/components/Nav";
import { manufacturerColors, imageUrl } from "@/lib/utils";
import { scoreChip } from "@/lib/chipScore";

export default function ChipCard({ chip }) {
  const color = manufacturerColors[chip.manufacturer] || "#94a3b8";
  const s = scoreChip(chip);
  return (
    <Link href={`/chip/${chip.id}`} asChild>
      <a className="group block rounded-xl border border-card-border bg-card overflow-hidden hover-elevate" data-testid={`chip-card-${chip.id}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img src={imageUrl(chip.image)} alt={chip.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {s.score !== null && (
              <span className="font-mono text-[10px] font-bold bg-background/70 backdrop-blur px-2 py-1 rounded border" style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.4)" }}>
                {s.score}
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded">{chip.release_year}</span>
          </div>
        </div>
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color }}>{chip.manufacturer}</p>
          <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors">{chip.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{chip.process_node}</p>
        </div>
      </a>
    </Link>
  );
}
