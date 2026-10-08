import { useMemo, useState } from "react";
import { Award, BookMarked, ChevronDown, Clock, ExternalLink, Info, Languages, Route as RouteIkon, Search, Wallet } from "lucide-react";
import { ALANLAR, EGITIMLER, KONTROL_TARIHI, KONULAR, UCRET, YOLLAR } from "@/data/egitimler";
import { sadelestir } from "@/lib/bolumler";
import { cn } from "@/lib/utils";

const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const tarih = (iso) => { const [y, a, g] = iso.split("-").map(Number); return `${g} ${AY[a - 1]} ${y}`; };
const BUL = new Map(EGITIMLER.map((e) => [e.id, e]));
const turkce = (e) => /türkçe/i.test(e.dil);

const UCRET_FILTRE = [
  { id: "hepsi", ad: "Hepsi" },
  { id: "ucretsiz", ad: "Ücretsiz", uyar: (e) => e.ucret === "ucretsiz" },
  { id: "kismen", ad: "Ücretsiz izle, sertifika ücretli", uyar: (e) => e.ucret === "ucretsiz-sertifika-ucretli" || e.ucret === "ucretsiz-baslangic" },
  { id: "ucretli", ad: "Ücretli", uyar: (e) => e.ucret === "ucretli" },
];

const DOGRULAMA = {
  sayfa: { ad: "Kurs sayfasından kontrol edildi", renk: "#34d399" },
  katalog: { ad: "Sağlayıcının resmî kataloğundan", renk: "#22d3ee" },
  haber: { ad: "Site açılamadı, bilgi haberden — kendin kontrol et", renk: "#f59e0b" },
};

function Rozet({ renk, children, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium", className)}
      style={renk ? { color: renk, borderColor: `${renk}55`, background: `${renk}14` } : undefined}>
      {children}
    </span>
  );
}

function KursKarti({ e }) {
  const [detay, setDetay] = useState(false);
  const u = UCRET[e.ucret];
  const d = DOGRULAMA[e.dogrulama.durum];
  return (
    <article className="flex flex-col rounded-2xl border border-card-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Rozet renk={u.renk}>{u.kisa}</Rozet>
        {turkce(e) && <Rozet renk="#f472b6"><Languages className="h-3 w-3" aria-hidden="true" />Türkçe</Rozet>}
        {e.seviye && <Rozet className="border-card-border text-muted-foreground">{e.seviye}</Rozet>}
        {e.dogrulama.durum === "haber" && <Rozet renk="#f59e0b">doğrulanamadı</Rozet>}
      </div>

      <p className="text-xs text-muted-foreground mt-3">{e.saglayici}</p>
      <h3 className="font-display font-semibold text-[15px] leading-snug mt-0.5">
        <a href={e.url} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline underline-offset-2">{e.ad}</a>
      </h3>
      <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{e.neden}</p>

      <dl className="mt-3 grid gap-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="sr-only">Ücret</dt>
          <Wallet className="h-3.5 w-3.5 mt-px shrink-0" style={{ color: u.renk }} aria-hidden="true" />
          <dd className="min-w-0">
            <span className="text-foreground">{e.fiyat || u.ad}</span>
            {e.fiyatNotu && <span className="text-muted-foreground"> — {e.fiyatNotu}</span>}
          </dd>
        </div>
        {e.sure && (
          <div className="flex gap-2"><dt className="sr-only">Süre</dt><Clock className="h-3.5 w-3.5 mt-px shrink-0 text-muted-foreground" aria-hidden="true" /><dd>{e.sure}</dd></div>
        )}
        <div className="flex gap-2"><dt className="sr-only">Dil</dt><Languages className="h-3.5 w-3.5 mt-px shrink-0 text-muted-foreground" aria-hidden="true" /><dd>{e.dil}</dd></div>
        {e.sertifika && e.sertifika !== "yok" && (
          <div className="flex gap-2"><dt className="sr-only">Sertifika</dt><Award className="h-3.5 w-3.5 mt-px shrink-0 text-muted-foreground" aria-hidden="true" /><dd>Sertifika {e.sertifika}</dd></div>
        )}
      </dl>

      <div className="mt-auto pt-4 flex items-center gap-2">
        <a href={e.url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20">
          Kursa git <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <button type="button" onClick={() => setDetay((x) => !x)} aria-expanded={detay}
          className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.renk }} aria-hidden="true" />
          Nasıl kontrol edildi
          <ChevronDown className={cn("h-3 w-3 transition-transform", detay && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
      {detay && (
        <p className="mt-2 rounded-lg border border-card-border bg-background/50 p-2.5 text-[11px] text-muted-foreground leading-relaxed">
          <span style={{ color: d.renk }}>{d.ad}.</span> {e.dogrulama.not}
        </p>
      )}
    </article>
  );
}

export default function Egitimler() {
  const [ucret, setUcret] = useState("hepsi");
  const [alan, setAlan] = useState("hepsi");
  const [konu, setKonu] = useState("hepsi");
  const [yalnizTr, setYalnizTr] = useState(false);
  const [sorgu, setSorgu] = useState("");

  const sayi = useMemo(() => {
    const s = { ucretsiz: 0, kismen: 0, ucretli: 0 };
    for (const e of EGITIMLER) for (const f of UCRET_FILTRE.slice(1)) if (f.uyar(e)) s[f.id]++;
    return s;
  }, []);

  const liste = useMemo(() => {
    const uf = UCRET_FILTRE.find((f) => f.id === ucret);
    const q = sadelestir(sorgu);
    const alanKonulari = alan === "hepsi" ? null : ALANLAR.find((a) => a.id === alan).konular;
    return EGITIMLER.filter((e) =>
      (!uf.uyar || uf.uyar(e)) &&
      (konu !== "hepsi" ? e.konu === konu : !alanKonulari || alanKonulari.includes(e.konu)) &&
      (!yalnizTr || turkce(e)) &&
      (!q || q.split(" ").every((k) => sadelestir(`${e.ad} ${e.saglayici} ${e.neden} ${KONULAR[e.konu]}`).includes(k))),
    );
  }, [ucret, alan, konu, yalnizTr, sorgu]);

  const konuSecenekleri = alan === "hepsi" ? Object.keys(KONULAR) : ALANLAR.find((a) => a.id === alan).konular;
  const filtreVar = ucret !== "hepsi" || alan !== "hepsi" || konu !== "hepsi" || yalnizTr || sorgu;

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />Eğitimler
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Ücretli ve ücretsiz eğitimler</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Yapay zekâ ve çip dünyasını öğrenmek için seçilmiş {EGITIMLER.length} çevrimiçi kurs: {sayi.ucretsiz} tamamen ücretsiz,
          {" "}{sayi.kismen} ücretsiz izlenip sertifikası ücretli, {sayi.ucretli} ücretli.
        </p>
        <p className="mt-3 inline-flex items-start gap-2 rounded-lg border border-card-border bg-card/60 px-3 py-2 text-xs text-muted-foreground max-w-2xl">
          <Info className="h-3.5 w-3.5 mt-px shrink-0 text-primary" aria-hidden="true" />
          <span>
            Her kurs {tarih(KONTROL_TARIHI)}'de kendi sayfası açılarak kontrol edildi. Fiyatlar ülkeye ve kampanyaya göre değişir;
            kaydolmadan önce kurs sayfasında son fiyata bak. Sayfası açılamayan kurs ayrıca işaretli.
          </span>
        </p>
      </section>

      <section className="container mx-auto px-4 pb-8" aria-labelledby="yollar">
        <h2 id="yollar" className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
          <RouteIkon className="h-4 w-4 text-primary" aria-hidden="true" /> Nereden başlamalı?
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          {YOLLAR.map((y) => (
            <div key={y.id} className="rounded-2xl border border-card-border bg-card/70 p-4">
              <p className="font-display font-semibold">{y.ad}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{y.ozet}</p>
              <ol className="mt-3 grid gap-1.5">
                {y.adimlar.map((id, i) => {
                  const e = BUL.get(id);
                  if (!e) return null;
                  return (
                    <li key={id} className="flex items-start gap-2 text-[13px]">
                      <span className="w-5 h-5 rounded-full border border-primary/50 text-primary text-[11px] font-semibold flex items-center justify-center shrink-0 tabular-nums">{i + 1}</span>
                      <a href={e.url} target="_blank" rel="noreferrer" className="min-w-0 hover:text-primary hover:underline underline-offset-2 leading-snug">
                        {e.ad}
                        <span className="ml-1.5 text-[10px] align-middle" style={{ color: UCRET[e.ucret].renk }}>{UCRET[e.ucret].kisa}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16" aria-labelledby="katalog">
        <h2 id="katalog" className="sr-only">Kurs kataloğu</h2>
        <div className="rounded-2xl border border-card-border bg-card/50 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[12rem] max-w-sm">
              <span className="sr-only">Kurs ara</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input type="search" value={sorgu} onChange={(ev) => setSorgu(ev.target.value)} placeholder="Ara: CUDA, Claude, Verilog…"
                className="w-full rounded-xl border border-card-border bg-card/70 pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60" />
            </label>
            <div className="inline-flex rounded-xl border border-card-border p-0.5 bg-card/60" role="radiogroup" aria-label="Ücret">
              {UCRET_FILTRE.map((f) => (
                <button key={f.id} type="button" role="radio" aria-checked={ucret === f.id} onClick={() => setUcret(f.id)}
                  className={cn("rounded-lg px-2.5 py-1.5 text-xs transition-colors", ucret === f.id ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {f.id === "kismen" ? <><span className="sm:hidden">Sertifika ücretli</span><span className="hidden sm:inline">{f.ad}</span></> : f.ad}
                  {f.id !== "hepsi" && <span className="ml-1 opacity-60 tabular-nums">{sayi[f.id]}</span>}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input type="checkbox" checked={yalnizTr} onChange={(ev) => setYalnizTr(ev.target.checked)} className="accent-[hsl(var(--primary))]" />
              Yalnızca Türkçe
            </label>
          </div>
          <div className="flex gap-1.5 overflow-x-auto serit-kaydir" role="tablist" aria-label="Konu">
            {[{ id: "hepsi", ad: "Tüm konular" }, ...ALANLAR].map((a) => (
              <button key={a.id} type="button" role="tab" aria-selected={alan === a.id && konu === "hepsi"}
                onClick={() => { setAlan(a.id); setKonu("hepsi"); }}
                className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  alan === a.id && konu === "hepsi" ? "border-primary/60 bg-primary/10 text-foreground" : "border-card-border text-muted-foreground hover:text-foreground")}>
                {a.ad}
              </button>
            ))}
            <span className="w-px shrink-0 bg-card-border mx-1" aria-hidden="true" />
            {konuSecenekleri.map((k) => (
              <button key={k} type="button" role="tab" aria-selected={konu === k}
                onClick={() => setKonu(konu === k ? "hepsi" : k)}
                className={cn("shrink-0 rounded-full border px-3 py-1 text-xs transition-colors",
                  konu === k ? "border-primary/60 bg-primary/10 text-foreground" : "border-card-border/70 text-muted-foreground hover:text-foreground")}>
                {KONULAR[k]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 mb-3">
          <p className="text-sm text-muted-foreground" role="status">{liste.length} kurs</p>
          {filtreVar && (
            <button type="button" onClick={() => { setUcret("hepsi"); setAlan("hepsi"); setKonu("hepsi"); setYalnizTr(false); setSorgu(""); }}
              className="text-xs text-primary hover:underline">Filtreleri temizle</button>
          )}
        </div>

        {liste.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10">Bu filtrelerle kurs yok. Bir filtreyi kaldırmayı dene.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liste.map((e) => <KursKarti key={e.id} e={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
