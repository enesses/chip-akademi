import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Download, ExternalLink, FileText, Puzzle, Sparkles } from "lucide-react";
import { SKILLER } from "@/data/skiller";
import { zipOlustur } from "@/lib/zip";
import { dosyaKaydet } from "@/lib/dosyaKaydet";
import { panoyaKopyala, acilacak, ACILACAK_OLAY } from "@/lib/panoyaKopyala";
import { Link } from "@/components/Nav";
import { cn } from "@/lib/utils";

const DESTEK = "https://support.claude.com/en/articles/12512198-use-custom-skills";
const kb = (s) => `${(new TextEncoder().encode(s).length / 1024).toFixed(1)} KB`;

const ADIMLAR = [
  { b: "Zip'i indir", a: "Aşağıdan bir skill seç, \"İndir (.zip)\" de. Zip'i açma; olduğu gibi yükleyeceksin." },
  { b: "Kod çalıştırmayı aç", a: "Claude ayarlarında kod çalıştırma (code execution) açık olmalı; skill'ler bunu gerektiriyor." },
  { b: "Skill'i yükle", a: "Claude'da Customize → Skills sayfasında yeni skill ekle ve zip'i seç. Ücretsiz dahil tüm planlarda var." },
  { b: "Kullan", a: "Açıklamadaki gibi bir şey iste (ör. \"bana bir tarayıcı oyunu yap\"); Claude uygun skill'i kendisi devreye alır." },
];

function SkillKarti({ s, vurgula }) {
  const [acik, setAcik] = useState(false);
  const [durum, setDurum] = useState(null);
  const [kopya, setKopya] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (vurgula) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [vurgula]);

  const indir = async () => {
    setDurum("hazirlaniyor");
    const zip = zipOlustur(s.dosyalar.map((d) => ({ yol: d.yol, icerik: d.icerik })));
    const r = await dosyaKaydet(`${s.ad}.zip`, zip, "application/zip");
    setDurum(r.durum === "kaydedildi" ? "indi" : r.durum === "iptal" ? null : { hata: r.mesaj });
    if (r.durum === "kaydedildi") setTimeout(() => setDurum(null), 3000);
  };

  const kopyala = async (metin, ne) => {
    const ok = await panoyaKopyala(metin);
    setKopya(ok ? ne : "hata");
    if (!ok && ne === "md") setAcik(true);
    setTimeout(() => setKopya(null), 1800);
  };

  return (
    <article
      ref={ref}
      id={`skill-${s.id}`}
      className={cn("rounded-2xl border bg-card p-5 flex flex-col transition-colors", vurgula ? "border-primary/70 ring-2 ring-primary/30" : "border-card-border")}
    >
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Puzzle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{s.kategori}</p>
          <h3 className="font-display font-semibold text-base leading-snug">{s.baslik}</h3>
          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{s.ad}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.aciklama}</p>

      {s.neYapar.length > 0 && (
        <ul className="mt-3 grid gap-1">
          {s.neYapar.map((x) => (
            <li key={x} className="flex gap-2 text-[13px]">
              <Check className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      )}

      {s.ornek && (
        <div className="mt-3 rounded-lg border border-card-border bg-background/50 p-2.5">
          <p className="text-[11px] text-muted-foreground mb-1">Yükledikten sonra şöyle iste:</p>
          <div className="flex items-start gap-2">
            <p className="text-[13px] italic flex-1">"{s.ornek}"</p>
            <button type="button" onClick={() => kopyala(s.ornek, "ornek")} className="shrink-0 text-muted-foreground hover:text-foreground p-1 -m-1" aria-label="Örnek istemi kopyala">
              {kopya === "ornek" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={indir}
          disabled={durum === "hazirlaniyor"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3.5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
        >
          {durum === "indi" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
          {durum === "indi" ? "İndirildi" : "İndir (.zip)"}
        </button>
        <button
          type="button"
          onClick={() => setAcik((a) => !a)}
          aria-expanded={acik}
          className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50"
        >
          <FileText className="h-4 w-4" aria-hidden="true" /> SKILL.md
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", acik && "rotate-180")} aria-hidden="true" />
        </button>
        <span className="text-[11px] text-muted-foreground ml-auto">{s.dosyalar.length} dosya · {kb(s.skillMd)}</span>
      </div>
      {durum?.hata && <p className="text-xs text-amber-300 mt-2" role="status">{durum.hata}</p>}

      {acik && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] text-muted-foreground font-mono">{s.ad}/SKILL.md</p>
            <button type="button" onClick={() => kopyala(s.skillMd, "md")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              {kopya === "md" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {kopya === "md" ? "Kopyalandı" : kopya === "hata" ? "Seç ve Ctrl+C" : "Kopyala"}
            </button>
          </div>
          <pre tabIndex={0} className="max-h-80 overflow-auto rounded-lg border border-card-border bg-background/60 p-3 text-[12px] leading-relaxed font-mono whitespace-pre-wrap break-words">{s.skillMd}</pre>
        </div>
      )}
    </article>
  );
}

export default function Skiller() {
  const [vurgu, setVurgu] = useState(null);
  useEffect(() => {
    const al = () => {
      if (!acilacak.skill) return;
      setVurgu(acilacak.skill);
      acilacak.skill = null;
    };
    al();
    window.addEventListener(ACILACAK_OLAY, al);
    return () => window.removeEventListener(ACILACAK_OLAY, al);
  }, []);

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />AI Araçları
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Claude skill'leri</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Skill, Claude'a bir işi nasıl yapacağını öğreten bir talimat paketidir. Bir kez yüklersin; o işi istediğinde
          Claude talimatları kendisi açar ve her seferinde aynı kaliteyle yapar. Prompt'u her seferinde yapıştırmana gerek kalmaz.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Tek seferlik bir iş için <Link href="/ai/promptlar" className="text-primary hover:underline">prompt kütüphanesine</Link> bak.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-8" aria-labelledby="nasil-yuklenir">
        <div className="rounded-2xl border border-card-border bg-card/60 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 id="nasil-yuklenir" className="font-display font-semibold text-lg">Nasıl yüklenir?</h2>
            <a href={DESTEK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Anthropic yardım sayfası <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADIMLAR.map((x, i) => (
              <li key={x.b} className="flex gap-3">
                <span className="w-7 h-7 rounded-full border border-primary/50 text-primary text-sm font-semibold flex items-center justify-center shrink-0 tabular-nums">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{x.b}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{x.a}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted-foreground mt-4">
            Claude'un arayüzü değişebilir; menü adları farklıysa yardım sayfasına bak. Zip, skill klasörünü kökünde taşır
            (<span className="font-mono">ad/SKILL.md</span>) — Claude'un beklediği yapı budur.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SKILLER.map((s) => <SkillKarti key={s.id} s={s} vurgula={vurgu === s.id} />)}
        </div>
      </section>
    </div>
  );
}
