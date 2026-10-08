import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { ARACLAR, KATEGORILER, PROMPTLAR, degiskenler, doldur } from "@/data/promptlar";
import { panoyaKopyala, acilacak, ACILACAK_OLAY } from "@/lib/panoyaKopyala";
import { dosyaKaydet } from "@/lib/dosyaKaydet";
import { sadelestir } from "@/lib/bolumler";
import { cn } from "@/lib/utils";

const SEVIYE_RENK = { "başlangıç": "#34d399", orta: "#22d3ee", ileri: "#f59e0b" };
const katAd = (id) => KATEGORILER.find((k) => k.id === id)?.ad ?? id;

/** Kopyala düğmesi: kısa süre "Kopyalandı" gösterir; olmazsa metni seçtirir. */
function KopyalaDugmesi({ metin, onBasarisiz, className, children = "Kopyala", buyuk = false }) {
  const [durum, setDurum] = useState(null);
  const tik = async (e) => {
    e.stopPropagation();
    const ok = await panoyaKopyala(metin);
    setDurum(ok ? "ok" : "hata");
    if (!ok) onBasarisiz?.();
    setTimeout(() => setDurum(null), 1800);
  };
  return (
    <button
      type="button"
      onClick={tik}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors",
        buyuk ? "px-4 py-2.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90" : "px-2.5 py-1.5 text-xs border border-card-border hover:border-primary/50 hover:text-foreground text-muted-foreground",
        className,
      )}
    >
      {durum === "ok" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">{durum === "ok" ? "Kopyalandı" : durum === "hata" ? "Seçildi — Ctrl+C" : children}</span>
    </button>
  );
}

function PromptPaneli({ prompt, kapat }) {
  const alanlar = useMemo(() => degiskenler(prompt.metin), [prompt]);
  const [degerler, setDegerler] = useState({});
  const onizlemeRef = useRef(null);
  const ilkRef = useRef(null);
  const sonuc = doldur(prompt.metin, degerler);

  useEffect(() => {
    const onceki = document.activeElement;
    ilkRef.current?.focus();
    const tus = (e) => { if (e.key === "Escape") kapat(); };
    window.addEventListener("keydown", tus);
    const tasma = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tus);
      document.body.style.overflow = tasma;
      onceki?.focus?.();
    };
  }, [kapat]);

  // Önizlemede kullanıcının doldurduğu kısımlar vurgulu
  const parcalar = useMemo(() => {
    const p = [];
    let son = 0;
    for (const m of prompt.metin.matchAll(/\{\{([^|}]+)\|?([^}]*)\}\}/g)) {
      p.push({ t: prompt.metin.slice(son, m.index) });
      const v = degerler[m[1].trim()];
      p.push({ t: v != null && String(v).trim() !== "" ? v : m[2], d: true, dolu: v != null && String(v).trim() !== "" });
      son = m.index + m[0].length;
    }
    p.push({ t: prompt.metin.slice(son) });
    return p;
  }, [prompt, degerler]);

  const metniSec = () => {
    const el = onizlemeRef.current;
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="prompt-baslik">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={kapat} />
      <div className="relative w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[86vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border border-card-border bg-card shadow-2xl flex flex-col">
        <div className="flex items-start gap-3 p-4 sm:p-5 border-b border-card-border">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{katAd(prompt.kategori)} · {ARACLAR[prompt.arac]}</p>
            <h2 id="prompt-baslik" className="font-display font-semibold text-lg leading-snug mt-0.5">{prompt.baslik}</h2>
          </div>
          <button type="button" onClick={kapat} className="rounded-lg p-2 -m-1 text-muted-foreground hover:text-foreground hover:bg-muted/40" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {alanlar.length > 0 && (
            <div className="p-4 sm:p-5 md:border-r border-card-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Kendine göre doldur</p>
                {Object.keys(degerler).length > 0 && (
                  <button type="button" onClick={() => setDegerler({})} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <RotateCcw className="h-3 w-3" aria-hidden="true" /> Örneğe dön
                  </button>
                )}
              </div>
              {alanlar.map((a, i) => {
                const uzun = a.varsayilan.length > 60 || /kod|metin|not|ilan|cv|özellik/i.test(a.ad);
                const ortak = {
                  id: `alan-${i}`,
                  value: degerler[a.ad] ?? "",
                  placeholder: a.varsayilan,
                  onChange: (e) => setDegerler((d) => ({ ...d, [a.ad]: e.target.value })),
                  className: "w-full rounded-lg border border-card-border bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60",
                };
                return (
                  <div key={a.ad}>
                    <label htmlFor={`alan-${i}`} className="block text-xs text-muted-foreground mb-1 first-letter:uppercase">{a.ad}</label>
                    {uzun ? <textarea ref={i === 0 ? ilkRef : undefined} rows={3} {...ortak} /> : <input ref={i === 0 ? ilkRef : undefined} type="text" {...ortak} />}
                  </div>
                );
              })}
              <p className="text-[11px] text-muted-foreground leading-relaxed">Boş bıraktığın alan, gri yazan örnekle doldurulur.</p>
            </div>
          )}
          <div className="p-4 sm:p-5 min-w-0">
            <p className="text-sm font-medium mb-2">Prompt</p>
            <pre
              ref={onizlemeRef}
              tabIndex={0}
              className="whitespace-pre-wrap break-words rounded-xl border border-card-border bg-background/60 p-3.5 text-[13px] leading-relaxed font-mono"
            >
              {parcalar.map((p, i) =>
                p.d ? (
                  <mark key={i} className={cn("rounded px-0.5 bg-transparent", p.dolu ? "text-primary" : "text-amber-300/90")}>{p.t}</mark>
                ) : (
                  <span key={i}>{p.t}</span>
                ),
              )}
            </pre>
            <p className="text-[11px] text-muted-foreground mt-2">
              <span className="text-amber-300/90">Sarı</span>: örnek değer · <span className="text-primary">mavi</span>: senin yazdığın
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4 sm:p-5 border-t border-card-border" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}>
          <KopyalaDugmesi metin={sonuc} buyuk onBasarisiz={metniSec}>Prompt'u kopyala</KopyalaDugmesi>
          <span className="text-xs text-muted-foreground">Sonra Claude'a ya da {prompt.arac === "gorsel" ? "görsel aracına" : prompt.arac === "video" ? "video aracına" : prompt.arac === "muzik" ? "müzik aracına" : "sohbet aracına"} yapıştır.</span>
        </div>
      </div>
    </div>
  );
}

function PromptKarti({ p, ac }) {
  const ilkSatirlar = p.metin.replace(/\{\{([^|}]+)\|?([^}]*)\}\}/g, "$2").split("\n").slice(0, 4).join("\n");
  return (
    <article className="group relative flex flex-col rounded-2xl border border-card-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{katAd(p.kategori)}</span>
        <span aria-hidden="true">·</span>
        <span style={{ color: SEVIYE_RENK[p.seviye] }}>{p.seviye}</span>
        {["gorsel", "video", "muzik"].includes(p.arac) && <span className="ml-auto rounded border border-card-border px-1.5 py-0.5">İngilizce</span>}
      </div>
      <h3 className="font-display font-semibold text-[15px] leading-snug mt-1.5">
        <button type="button" onClick={ac} className="text-left after:absolute after:inset-0 after:rounded-2xl focus:outline-none">
          {p.baslik}
        </button>
      </h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.aciklama}</p>
      <pre className="mt-3 flex-1 overflow-hidden rounded-lg bg-background/50 border border-card-border/70 p-2.5 text-[11px] leading-relaxed font-mono text-muted-foreground whitespace-pre-wrap break-words line-clamp-4">{ilkSatirlar}</pre>
      <div className="relative z-10 mt-3 flex items-center gap-2">
        <button type="button" onClick={ac} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-2.5 py-1.5 text-xs font-medium hover:bg-primary/20">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Doldur ve kullan
        </button>
        <KopyalaDugmesi metin={doldur(p.metin)} onBasarisiz={ac} />
      </div>
    </article>
  );
}

export default function Promptlar() {
  const [kat, setKat] = useState("hepsi");
  const [sorgu, setSorgu] = useState("");
  const [acik, setAcik] = useState(null);
  const [bildiri, setBildiri] = useState(null);
  // Sabit referans: panel her tuşta yeniden çizilir; kapat değişirse odak kayar.
  const kapat = useCallback(() => setAcik(null), []);

  useEffect(() => {
    const al = () => {
      if (!acilacak.prompt) return;
      const p = PROMPTLAR.find((x) => x.id === acilacak.prompt);
      acilacak.prompt = null;
      if (p) setAcik(p);
    };
    al();
    window.addEventListener(ACILACAK_OLAY, al);
    return () => window.removeEventListener(ACILACAK_OLAY, al);
  }, []);

  const sayilar = useMemo(() => {
    const s = { hepsi: PROMPTLAR.length };
    for (const p of PROMPTLAR) s[p.kategori] = (s[p.kategori] || 0) + 1;
    return s;
  }, []);

  const liste = useMemo(() => {
    const q = sadelestir(sorgu);
    return PROMPTLAR.filter((p) => (kat === "hepsi" || p.kategori === kat) &&
      (!q || q.split(" ").every((k) => sadelestir(`${p.baslik} ${p.aciklama} ${katAd(p.kategori)} ${p.metin}`).includes(k))));
  }, [kat, sorgu]);

  const indir = async () => {
    const baslik = kat === "hepsi" ? "Tüm promptlar" : katAd(kat);
    const md = [`# Chip Akademi — ${baslik}`, "", "{{alan|örnek}} biçimindeki yerleri kendine göre doldur; | işaretinden sonrası örnek değerdir.", ""];
    for (const k of KATEGORILER) {
      const ps = liste.filter((p) => p.kategori === k.id);
      if (!ps.length) continue;
      md.push(`## ${k.ad}`, "");
      for (const p of ps) md.push(`### ${p.baslik}`, "", `_${p.aciklama}_ · Araç: ${ARACLAR[p.arac]}`, "", "```", p.metin, "```", "");
    }
    const ad = `promptlar-${kat === "hepsi" ? "tumu" : kat}.md`;
    const r = await dosyaKaydet(ad, md.join("\n"), "text/markdown");
    setBildiri(r.durum === "kaydedildi" ? `${ad} kaydedildi.` : r.durum === "iptal" ? null : r.mesaj);
    setTimeout(() => setBildiri(null), 3500);
  };

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />AI Araçları
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Prompt kütüphanesi</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {PROMPTLAR.length} hazır prompt. Birini seç, kendi konuna göre boşlukları doldur, kopyala ve yapay zekâ aracına yapıştır.
          Görsel, video ve müzik prompt'ları İngilizce — bu araçlar İngilizceyi daha iyi anlıyor.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="relative flex-1 max-w-md">
            <span className="sr-only">Prompt ara</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              placeholder="Ara: oyun, logo, e-posta, sınav…"
              className="w-full rounded-xl border border-card-border bg-card/70 pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            />
          </label>
          <button type="button" onClick={indir} className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-card-border px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50">
            <Download className="h-4 w-4" aria-hidden="true" />
            {kat === "hepsi" ? "Hepsini indir (.md)" : `${katAd(kat)} indir (.md)`}
          </button>
          {bildiri && <span className="text-xs text-muted-foreground" role="status">{bildiri}</span>}
        </div>

        <div className="mt-4 -mx-4 px-4 flex gap-1.5 overflow-x-auto serit-kaydir pb-1" role="tablist" aria-label="Kategori">
          {[{ id: "hepsi", ad: "Hepsi" }, ...KATEGORILER].map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kat === k.id}
              onClick={() => setKat(k.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                kat === k.id ? "border-primary/60 bg-primary/10 text-foreground" : "border-card-border text-muted-foreground hover:text-foreground",
              )}
            >
              {k.ad} <span className="opacity-60 tabular-nums">{sayilar[k.id] || 0}</span>
            </button>
          ))}
        </div>
        {kat !== "hepsi" && <p className="text-xs text-muted-foreground mt-2">{KATEGORILER.find((k) => k.id === kat)?.ozet}</p>}
      </section>

      <section className="container mx-auto px-4 pb-16">
        {liste.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10">"{sorgu}" için prompt bulunamadı. Daha kısa bir kelime dene ya da kategoriyi "Hepsi" yap.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liste.map((p) => <PromptKarti key={p.id} p={p} ac={() => setAcik(p)} />)}
          </div>
        )}
      </section>

      {acik && <PromptPaneli prompt={acik} kapat={kapat} />}
    </div>
  );
}
