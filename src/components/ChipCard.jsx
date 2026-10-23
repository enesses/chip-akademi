import { Link } from "@/components/Nav";
import ChipYerTutucu from "@/components/ChipYerTutucu";
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
    { etiket: "M", deger: maliyet, renk: "bg-foreground/60" },
  ];
  return (
    <div className="flex items-end gap-1 h-5">
      {barlar.map(({ etiket, deger, renk }) =>
        deger != null ? (
          <div key={etiket} className="flex flex-col items-center gap-0.5" title={`${etiket}: ${deger}`}>
            <div
              className={cn("w-2.5", renk)}
              style={{ height: `${Math.max(2, Math.round(deger / 100 * 16))}px` }}
            />
          </div>
        ) : (
          <div key={etiket} className="w-2.5 h-0.5 bg-border" title={`${etiket}: —`} />
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
      <a className="group block rounded-lg border border-card-border bg-card overflow-hidden transition-colors hover:border-foreground/30" data-testid={`chip-card-${chip.id}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden border-b border-card-border">
          {chip.image ? (
            <img src={imageUrl(chip.image)} alt={chip.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          ) : (
            <ChipYerTutucu chip={chip} renk={color} />
          )}

        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <span className="h-2 w-2 shrink-0" style={{ background: color }} aria-hidden="true" />
              <span className="truncate">{chip.manufacturer}</span>
            </span>
            <span className="rakam">{chip.release_year}</span>
          </div>
          <h3 className="font-display font-semibold text-[15px] leading-snug mt-2 group-hover:text-primary transition-colors">
            {chip.name}
          </h3>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <p className="text-xs text-muted-foreground">{chip.process_node}</p>
            {g.puan != null && (
              <p className="font-mono text-[11px] rakam" title="Genel puan">
                <span className={cn("font-semibold", puanRengi(g.puan))}>{g.puan}</span><span className="text-muted-foreground">/100</span>
              </p>
            )}
          </div>

          {/* Alt satır: mini bar + fiyat */}
          <div className="mt-3 pt-3 border-t border-dashed border-card-border flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <MiniBar
                tasarim={g.tasarimPuan}
                verimlilik={g.verimlilikPuan}
                maliyet={g.maliyetPuan}
              />
              <p className="font-mono text-[9px] text-muted-foreground tracking-wider">T · V · M</p>
            </div>
            {g.usdSaat != null && (
              <p className="text-[10px] font-mono text-muted-foreground">
                ${g.usdSaat}<span className="text-[9px]">/s{g.gpuSayisi > 1 ? ` · ${g.gpuSayisi} GPU` : ""}</span>
              </p>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}
