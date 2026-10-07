import { Link } from "@/components/Nav";
import { Search } from "lucide-react";
import { GRUPLAR } from "@/lib/bolumler";
import { aramayiAc } from "@/components/nav/AramaPaleti";

const SORU = {
  cipler: "Çipleri incelemek",
  ogren: "Sıfırdan öğrenmek",
  tasarla: "Kendi çipimi tasarlamak",
  gundem: "Gündemi takip etmek",
};

/** Anasayfadaki arama girişi: kutuya benzer, dokununca hızlı aramayı açar. */
export function AramaGirisi() {
  const ornekler = ["H100", "iPhone 17 Pro", "HBM", "Tensor G4"];
  return (
    <div className="mt-7 max-w-xl">
      <button
        type="button"
        onClick={() => aramayiAc()}
        className="group flex w-full items-center gap-3 rounded-xl border border-card-border bg-card/70 backdrop-blur px-4 py-3 text-left transition-colors hover:border-primary/50"
      >
        <Search className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
        <span className="flex-1 text-muted-foreground group-hover:text-foreground/80">Çip, cihaz, ders ya da terim ara</span>
        <kbd className="kbd hidden sm:inline">/</kbd>
      </button>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="mr-0.5">Örnek:</span>
        {ornekler.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => aramayiAc(o)}
            className="rounded-full border border-card-border px-2.5 py-1 hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Tüm bölümlerin haritası: dört amaç, her birinin altında bölümleri. */
export default function BolumRehberi() {
  return (
    <section className="container mx-auto px-4 py-10" aria-labelledby="bolum-rehberi">
      <div className="mb-5">
        <h2 id="bolum-rehberi" className="font-display font-bold text-2xl tracking-tight">Ne yapmak istiyorsun?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sitedeki her bölüm burada. Üst menüdeki gruplar da aynı sırada.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-card-border bg-card/40 divide-y sm:divide-y-0 divide-card-border overflow-hidden">
        {GRUPLAR.map((g, i) => (
          <div
            key={g.id}
            className={
              "p-4 sm:p-5 " +
              (i % 2 === 1 ? "sm:border-l sm:border-card-border " : "") +
              (i >= 2 ? "sm:border-t lg:border-t-0 " : "") +
              (i === 2 ? "lg:border-l lg:border-card-border" : "")
            }
          >
            <p className="text-xs text-muted-foreground">{g.ad}</p>
            <h3 className="font-display font-semibold text-[17px] mt-0.5 mb-3">{SORU[g.id]}</h3>
            <ul className="grid gap-0.5 -mx-2">
              {g.bolumler.map((b) => {
                const Ikon = b.ikon;
                return (
                  <li key={b.id}>
                    <Link href={b.yol} asChild>
                      <a className="group flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-muted/40 transition-colors">
                        <Ikon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{b.ad}</span>
                          <span className="block text-xs text-muted-foreground leading-snug">{b.aciklama}</span>
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
