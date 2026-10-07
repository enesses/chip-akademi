import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "@/components/Nav";
import { Microchip, GraduationCap, PencilRuler, Newspaper, Search, X } from "lucide-react";
import { GRUPLAR, bolumBul, grupBul } from "@/lib/bolumler";
import { aramayiAc } from "@/components/nav/AramaPaleti";
import { cn } from "@/lib/utils";

const GRUP_IKON = { cipler: Microchip, ogren: GraduationCap, tasarla: PencilRuler, gundem: Newspaper };

/**
 * Telefonda başparmakla ulaşılan alt çubuk: dört grup + arama.
 * Bir gruba dokununca o grubun bölümleri açıklamalarıyla alttan açılır.
 */
export default function MobilMenu() {
  const [location] = useLocation();
  const [acikGrup, setAcikGrup] = useState(null);
  const sayfa = useRef(null);
  const aktifGrup = grupBul(location);
  const aktifBolum = bolumBul(location);
  const grup = GRUPLAR.find((g) => g.id === acikGrup);

  useEffect(() => setAcikGrup(null), [location]);
  useEffect(() => {
    if (!acikGrup) return;
    const tus = (e) => e.key === "Escape" && setAcikGrup(null);
    window.addEventListener("keydown", tus);
    const eski = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => sayfa.current?.querySelector("a, [role='link']")?.focus());
    return () => {
      window.removeEventListener("keydown", tus);
      document.body.style.overflow = eski;
    };
  }, [acikGrup]);

  return (
    <div className="md:hidden">
      {grup && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${grup.ad} bölümleri`}>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setAcikGrup(null)} aria-hidden="true" />
          <div
            ref={sayfa}
            className="alt-sayfa absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-card-border bg-card px-4 pt-3"
            style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" aria-hidden="true" />
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-display font-bold text-lg">{grup.ad}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{grup.ozet}</p>
              </div>
              <button
                onClick={() => setAcikGrup(null)}
                className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg border border-card-border text-muted-foreground"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-1">
              {grup.bolumler.map((b) => {
                const Ikon = b.ikon;
                const secili = aktifBolum?.id === b.id;
                return (
                  <Link key={b.id} href={b.yol} asChild>
                    <a
                      aria-current={secili ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3",
                        secili ? "bg-primary/10" : "active:bg-muted/60"
                      )}
                    >
                      <span className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                        secili ? "border-primary/50 text-primary" : "border-card-border text-muted-foreground"
                      )}>
                        <Ikon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[15px] font-medium", secili && "text-primary")}>{b.ad}</span>
                        <span className="block text-xs text-muted-foreground leading-snug">{b.aciklama}</span>
                      </span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Bölümler"
        className="fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-background/90 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid grid-cols-5">
          {GRUPLAR.map((g) => {
            const Ikon = GRUP_IKON[g.id];
            const etkin = acikGrup ? acikGrup === g.id : aktifGrup?.id === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setAcikGrup(acikGrup === g.id ? null : g.id)}
                aria-expanded={acikGrup === g.id}
                className={cn(
                  "relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition-colors",
                  etkin ? "text-primary" : "text-muted-foreground"
                )}
              >
                {etkin && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" aria-hidden="true" />}
                <Ikon className="h-5 w-5" aria-hidden="true" />
                {g.ad}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setAcikGrup(null); aramayiAc(); }}
            className="flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium text-muted-foreground"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            Ara
          </button>
        </div>
      </nav>
    </div>
  );
}
