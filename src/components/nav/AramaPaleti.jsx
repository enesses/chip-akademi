import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Search, CornerDownLeft } from "lucide-react";
import { GRUPLAR } from "@/lib/bolumler";
import { ara, SOZLUK_ANAHTARI } from "@/lib/aramaIndeksi";
import { acilacak, ACILACAK_OLAY } from "@/lib/panoyaKopyala";
import { cn } from "@/lib/utils";

const OLAY = "chip-akademi:arama";

/** Hızlı aramayı her yerden aç (menü düğmesi, mobil çubuk, anasayfa). */
export function aramayiAc(baslangic = "") {
  window.dispatchEvent(new CustomEvent(OLAY, { detail: { baslangic } }));
}

function yazmaAlaninda(el) {
  if (!el) return false;
  const t = el.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || el.isContentEditable;
}

/** Sorgu boşken: tüm bölümlerin haritası (aramanın kendisi bir harita olur). */
function haritaSonuclari() {
  return GRUPLAR.map((g) => ({
    tur: "grup-" + g.id,
    ad: g.ad,
    ogeler: g.bolumler.map((b) => ({
      tur: "bolum", id: "b:" + b.id, baslik: b.ad, alt: b.aciklama, yol: b.yol, ikon: b.ikon,
    })),
  }));
}

export default function AramaPaleti() {
  const [acik, setAcik] = useState(false);
  const [sorgu, setSorgu] = useState("");
  const [secili, setSecili] = useState(0);
  const [, navigate] = useLocation();
  const girdi = useRef(null);
  const liste = useRef(null);
  const oncekiOdak = useRef(null);

  // Kısayollar: ⌘K / Ctrl+K her yerde, "/" yazma alanı dışında.
  useEffect(() => {
    function tus(e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setAcik((a) => !a);
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !yazmaAlaninda(document.activeElement)) {
        e.preventDefault();
        setAcik(true);
      }
    }
    function ac(e) {
      setSorgu(e.detail?.baslangic || "");
      setAcik(true);
    }
    window.addEventListener("keydown", tus);
    window.addEventListener(OLAY, ac);
    return () => {
      window.removeEventListener("keydown", tus);
      window.removeEventListener(OLAY, ac);
    };
  }, []);

  // Açılınca odak girdiye, kapanınca eski yerine; arka plan kaymasın.
  useEffect(() => {
    if (acik) {
      oncekiOdak.current = document.activeElement;
      const eski = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => girdi.current?.focus());
      return () => {
        document.body.style.overflow = eski;
        oncekiOdak.current?.focus?.();
      };
    }
    setSorgu("");
  }, [acik]);

  const gruplar = useMemo(() => (sorgu.trim() ? ara(sorgu) : haritaSonuclari()), [sorgu]);
  const duz = useMemo(() => gruplar.flatMap((g) => g.ogeler), [gruplar]);

  useEffect(() => setSecili(0), [sorgu]);

  // Seçili öğe görünür kalsın
  useEffect(() => {
    liste.current?.querySelector(`[data-sira="${secili}"]`)?.scrollIntoView({ block: "nearest" });
  }, [secili]);

  function git(oge) {
    if (!oge) return;
    if (oge.acilacak) Object.assign(acilacak, oge.acilacak);
    if (oge.sozlukTerimi) {
      try { window.sessionStorage.setItem(SOZLUK_ANAHTARI, oge.sozlukTerimi); } catch {}
    }
    setAcik(false);
    navigate(oge.yol);
    window.scrollTo({ top: 0 });
    if (oge.acilacak) setTimeout(() => window.dispatchEvent(new Event(ACILACAK_OLAY)), 0);
  }

  function tusGirdi(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSecili((s) => Math.min(duz.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSecili((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); git(duz[secili]); }
    else if (e.key === "Escape") { e.preventDefault(); setAcik(false); }
  }

  if (!acik) return null;

  let sira = -1;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]"
      style={{ paddingTop: "max(10vh, env(safe-area-inset-top, 0px))" }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setAcik(false)} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hızlı arama"
        className="arama-panel relative w-full max-w-xl rounded-2xl border border-card-border bg-card shadow-2xl shadow-black/50 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-card-border">
          <Search className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <input
            ref={girdi}
            id="hizli-arama"
            value={sorgu}
            onChange={(e) => setSorgu(e.target.value)}
            onKeyDown={tusGirdi}
            placeholder="Bölüm, çip, cihaz ya da terim ara"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded="true"
            aria-controls="arama-sonuclari"
            aria-activedescendant={duz[secili] ? `arama-oge-${secili}` : undefined}
            className="flex-1 bg-transparent py-4 text-[15px] outline-none focus-visible:outline-none placeholder:text-muted-foreground/70 min-w-0"
          />
          <button
            onClick={() => setAcik(false)}
            className="rounded-md border border-card-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground"
            aria-label="Aramayı kapat"
          >
            Esc
          </button>
        </div>

        <div ref={liste} id="arama-sonuclari" role="listbox" aria-label="Sonuçlar" className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
          {!sorgu.trim() && (
            <p className="px-2.5 pt-1.5 pb-2 text-xs text-muted-foreground">
              Tüm bölümler aşağıda. Bir çip, cihaz ya da terim adı yazmaya başla.
            </p>
          )}
          {duz.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-sm">"{sorgu}" için sonuç yok.</p>
              <p className="text-xs text-muted-foreground mt-1">Daha kısa bir kelime dene: "H100", "bellek", "iPhone".</p>
            </div>
          )}
          {gruplar.map((g) => (
            <div key={g.tur} role="group" aria-label={g.ad} className="mb-1.5 last:mb-0">
              <p className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-muted-foreground">{g.ad}</p>
              {g.ogeler.map((o) => {
                sira += 1;
                const benim = sira;
                const aktif = benim === secili;
                const Ikon = o.ikon;
                return (
                  <div
                    key={o.id}
                    id={`arama-oge-${benim}`}
                    data-sira={benim}
                    role="option"
                    aria-selected={aktif}
                    onMouseMove={() => setSecili(benim)}
                    onClick={() => git(o)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer",
                      aktif ? "bg-primary/10" : "hover:bg-muted/40"
                    )}
                  >
                    {aktif && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" aria-hidden="true" />}
                    <span className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                      aktif ? "border-primary/40 text-primary" : "border-card-border text-muted-foreground"
                    )}>
                      {Ikon && <Ikon className="h-4 w-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">{o.baslik}</span>
                      {o.alt && <span className="block text-xs text-muted-foreground truncate">{o.alt}</span>}
                    </span>
                    {aktif && <CornerDownLeft className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 border-t border-card-border px-4 py-2 text-[11px] text-muted-foreground">
          <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> gez</span>
          <span><kbd className="kbd">Enter</kbd> aç</span>
          <span><kbd className="kbd">Esc</kbd> kapat</span>
          <span className="ml-auto">Her yerden: <kbd className="kbd">/</kbd> ya da <kbd className="kbd">Ctrl K</kbd></span>
        </div>
      </div>
    </div>
  );
}
