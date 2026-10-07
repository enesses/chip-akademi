import { Link } from "@/components/Nav";
import { manufacturerColors, imageUrl } from "@/lib/utils";
import { genelPuan } from "@/lib/chipScore";
import { cn } from "@/lib/utils";

/** Puan rengi: 80+ yeşil, 60+ sarı, 40+ turuncu, altı kırmızı */
function puanRengi(p) {
  if (p == null) return "text-muted-foreground";
  if (p >= 80) return "text-emerald-400";
  if (p >= 60) return "text-yellow-400";
  if (p >= 40) return "text-orange-400";
  return "text-rose-400";
}

/** Küçük üç-çizgi gösterge çubuğu */
function MiniBar({ tasarim, verimlilik, maliyet }) {
  const barlar = [
    { etiket: "T", deger: tasarim, renk: "bg-primary" },
    { etiket: "V", deger: verimlilik, renk: "bg-emerald-400" },
    { etiket: "M", deger: maliyet, renk: "bg-violet-400" },
  ];
  return (
    <div className="flex items-end gap-1 h-5">
      {barlar.map(({ etiket, deger, renk }) =>
        deger != null ? (
          <div key={etiket} className="flex flex-col items-center gap-0.5" title={`${etiket}: ${deger}`}>
            <div
              className={cn("w-3.5 rounded-sm opacity-80", renk)}
              style={{ height: `${Math.max(2, Math.round(deger / 100 * 16))}px` }}
            />
          </div>
        ) : (
          <div key={etiket} className="w-3.5 h-0.5 bg-muted rounded-sm opacity-40" title={`${etiket}: —`} />
        )
      )}
    </div>
  );
}

export default function ChipCard({ chip }) {
  const color = manufacturerColors[chip.manufacturer] || "#94a3b8";
  const g = genelPuan(chip);

  return (
    <Link href={`/chip/${chip.id}`} asChild>
      <a className="group block rounded-xl border border-card-border bg-card overflow-hidden hover-elevate" data-testid={`chip-card-${chip.id}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img src={imageUrl(chip.image)} alt={chip.name} className="w-full h-full object-cover" />

          {/* Genel puan rozeti */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {g.puan != null && (
              <span className={cn(
                "font-mono text-[11px] font-bold bg-background/80 backdrop-blur px-2 py-1 rounded border border-white/10",
                puanRengi(g.puan)
              )}>
                {g.puan}
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded">
              {chip.release_year}
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color }}>
            {chip.manufacturer}
          </p>
          <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors">
            {chip.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{chip.process_node}</p>

          {/* Alt satır: mini bar + fiyat */}
          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <MiniBar
                tasarim={g.tasarimPuan}
                verimlilik={g.verimlilikPuan}
                maliyet={g.maliyetPuan}
              />
              <p className="text-[9px] text-muted-foreground/60 tracking-wider">T · V · M</p>
            </div>
            {g.usdSaat != null && (
              <p className="text-[10px] font-mono text-muted-foreground">
                ${g.usdSaat}<span className="text-[9px]">/s</span>
              </p>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}
