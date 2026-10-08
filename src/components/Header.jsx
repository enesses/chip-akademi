import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "@/components/Nav";
import { Cpu, UserRound, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { aktifProfil, profilDegisimineAbone } from "@/lib/hesap";
import { GRUPLAR, bolumBul, grupBul } from "@/lib/bolumler";
import { aramayiAc } from "@/components/nav/AramaPaleti";

function ProfilDugmesi({ profil, aktif }) {
  return (
    <Link href="/hesap" asChild>
      <a
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm hover-elevate",
          aktif ? "border-primary/50 text-primary" : "border-card-border text-muted-foreground hover:text-foreground"
        )}
        aria-label={profil ? `Hesap: ${profil.ad}` : "Giriş yap"}
      >
        {profil ? (
          <>
            <span className="text-sm leading-none" aria-hidden="true">{profil.avatar}</span>
            <span className="max-w-[7rem] truncate">{profil.ad}</span>
          </>
        ) : (
          <>
            <UserRound className="h-4 w-4" aria-hidden="true" />
            <span>Giriş</span>
          </>
        )}
      </a>
    </Link>
  );
}

/** Masaüstü: bir grubun açılır menüsü. Bölümler açıklamalarıyla görünür. */
function GrupMenusu({ grup, acik, ac, kapat, aktifGrup, aktifBolum, menuAcikMi }) {
  const dugme = useRef(null);
  const panel = useRef(null);
  const etkin = aktifGrup?.id === grup.id;

  // Panel açılınca ilk bölüme odak; ok tuşlarıyla gezinme
  useEffect(() => {
    if (acik) panel.current?.querySelector('[role="menuitem"]')?.focus();
  }, [acik]);

  function tusPanel(e) {
    const ogeler = [...(panel.current?.querySelectorAll('[role="menuitem"]') || [])];
    const i = ogeler.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); ogeler[(i + 1) % ogeler.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); ogeler[(i - 1 + ogeler.length) % ogeler.length]?.focus(); }
    else if (e.key === "Escape") { e.preventDefault(); kapat(); dugme.current?.focus(); }
    else if (e.key === "Tab") { kapat(); }
  }

  return (
    <div className="relative" onMouseEnter={() => menuAcikMi && !acik && ac()}>
      <button
        ref={dugme}
        type="button"
        onClick={() => (acik ? kapat() : ac())}
        aria-expanded={acik}
        aria-haspopup="menu"
        className={cn(
          "grup-dugme relative inline-flex items-center gap-1 rounded-md px-2 lg:px-3 py-2 text-sm font-medium transition-colors",
          etkin ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          acik && "bg-muted/50 text-foreground"
        )}
      >
        {grup.kisaAd ? (
          <>
            <span className="lg:hidden" aria-hidden="true">{grup.kisaAd}</span>
            <span className="sr-only lg:not-sr-only">{grup.ad}</span>
          </>
        ) : grup.ad}
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform", acik && "rotate-180")} aria-hidden="true" />
        {etkin && <span className="iz-ped" aria-hidden="true" />}
      </button>

      {acik && (
        <div
          ref={panel}
          role="menu"
          aria-label={grup.ad}
          onKeyDown={tusPanel}
          className="menu-panel absolute left-0 top-full mt-2 w-[22rem] rounded-xl border border-card-border bg-card p-2 shadow-2xl shadow-black/40"
        >
          <p className="px-3 pt-2 pb-2.5 text-xs text-muted-foreground border-b border-card-border mb-1.5">{grup.ozet}</p>
          {grup.bolumler.map((b) => {
            const Ikon = b.ikon;
            const secili = aktifBolum?.id === b.id;
            return (
              <Link key={b.id} href={b.yol} onClick={kapat} asChild>
                <a
                  role="menuitem"
                  aria-current={secili ? "page" : undefined}
                  className={cn(
                    "group flex items-start gap-3 rounded-lg px-3 py-2.5",
                    secili ? "bg-primary/10" : "hover:bg-muted/50 focus-visible:bg-muted/50"
                  )}
                >
                  <span className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                    secili ? "border-primary/50 text-primary" : "border-card-border text-muted-foreground group-hover:text-foreground"
                  )}>
                    <Ikon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-sm font-medium", secili && "text-primary")}>{b.ad}</span>
                    <span className="block text-xs text-muted-foreground leading-snug mt-0.5">{b.aciklama}</span>
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Grubun kardeş bölümleri: nerede olduğunu gösterir, komşuya tek tıkla geçirir. */
function KonumSeridi({ grup, aktifBolum }) {
  if (!grup) return null;
  return (
    <div className="relative z-10 border-t border-border/70">
      <nav aria-label={`${grup.ad} bölümleri`} className="container mx-auto px-4">
        <div className="serit-kaydir flex items-center gap-1 overflow-x-auto py-1.5 -mx-1 px-1">
          <span className="hidden sm:inline text-xs text-muted-foreground pr-2 mr-1 border-r border-border/70 whitespace-nowrap">
            {grup.ad}
          </span>
          {grup.bolumler.map((b) => {
            const secili = aktifBolum?.id === b.id;
            const Ikon = b.ikon;
            return (
              <Link key={b.id} href={b.yol} asChild>
                <a
                  aria-current={secili ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                    secili ? "text-primary iz" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Ikon className="h-3.5 w-3.5" aria-hidden="true" />
                  {b.ad}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Header() {
  const [location] = useLocation();
  const [profil, setProfil] = useState(null);
  const [acikGrup, setAcikGrup] = useState(null);
  const kapsayici = useRef(null);

  useEffect(() => {
    const yenile = () => setProfil(aktifProfil());
    yenile();
    return profilDegisimineAbone(yenile);
  }, []);

  // Sayfa değişince ya da dışarı tıklanınca menüyü kapat
  useEffect(() => setAcikGrup(null), [location]);
  useEffect(() => {
    if (!acikGrup) return;
    const disari = (e) => { if (!kapsayici.current?.contains(e.target)) setAcikGrup(null); };
    document.addEventListener("pointerdown", disari);
    return () => document.removeEventListener("pointerdown", disari);
  }, [acikGrup]);

  const aktifGrup = grupBul(location);
  const aktifBolum = bolumBul(location);
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  return (
    <header className="ust-cubuk sticky z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div ref={kapsayici} className="relative z-20 container mx-auto px-4 h-14 md:h-16 flex items-center gap-3 md:gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Chip Akademi anasayfa">
          <span className="w-8 h-8 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-center">
            <Cpu className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
          </span>
          <span className="font-display font-bold tracking-tight md:hidden lg:inline">Chip Akademi</span>
        </Link>

        <nav aria-label="Ana menü" className="hidden md:flex items-center gap-0.5">
          {GRUPLAR.map((g) => (
            <GrupMenusu
              key={g.id}
              grup={g}
              acik={acikGrup === g.id}
              ac={() => setAcikGrup(g.id)}
              kapat={() => setAcikGrup(null)}
              aktifGrup={aktifGrup}
              aktifBolum={aktifBolum}
              menuAcikMi={acikGrup !== null}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => aramayiAc()}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-card-border bg-card/60 pl-3 pr-1.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors lg:w-64"
            aria-label="Hızlı arama"
            aria-keyshortcuts={mac ? "Meta+K /" : "Control+K /"}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="lg:flex-1 text-left">Ara</span>
            <kbd className="kbd hidden lg:inline">{mac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button
            type="button"
            onClick={() => aramayiAc()}
            className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted-foreground"
            aria-label="Hızlı arama"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
          <ProfilDugmesi profil={profil} aktif={location === "/hesap"} />
        </div>
      </div>
      <KonumSeridi grup={aktifGrup} aktifBolum={aktifBolum} />
    </header>
  );
}
