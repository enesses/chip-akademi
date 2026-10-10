import { useMemo } from "react";
import { CalendarDays, CalendarClock, ExternalLink, Minus, Repeat, ThumbsDown, ThumbsUp } from "lucide-react";
import data from "@/data/bugun.json";
import { Link } from "@/components/Nav";
import { cn } from "@/lib/utils";

const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
function tarihYaz(iso, gunAdi = false) {
  const [y, a, g] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, a - 1, g));
  return `${g} ${AY[a - 1]}${gunAdi ? `, ${GUN[t.getUTCDay()]}` : ""}`;
}
function kalanGun(iso) {
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
  const [y, a, g] = iso.split("-").map(Number);
  return Math.round((new Date(y, a - 1, g) - bugun) / 86400000);
}

const KATEGORI = {
  pozitif: { ad: "Pozitif", renk: "#34d399", isaret: 1, Icon: ThumbsUp },
  notr: { ad: "Nötr", renk: "#94a3b8", isaret: 0, Icon: Minus },
  negatif: { ad: "Negatif", renk: "#f87171", isaret: -1, Icon: ThumbsDown },
};

export default function Bugun() {
  const hesap = useMemo(() => {
    let ta = 0, ti = 0;
    // Önceki günlerden tekrar eden maddeler puana katılmaz (otomasyon/veri-isle.mjs ile aynı kural).
    for (const m of data.maddeler) { if (m.tekrar) continue; ta += m.agirlik; ti += m.agirlik * KATEGORI[m.kategori].isaret; }
    return { puan: Math.round(50 + 50 * (ti/ta)), ta, ti };
  }, []);
  // Geçmişte kalan olayları sayfanın açıldığı güne göre gizle
  const yaklasan = (data.yaklasan || []).filter((o) => kalanGun(o.tarih) >= 0);
  const tekrarSayisi = data.maddeler.filter((m) => m.tekrar).length;
  const renk = hesap.puan >= 75 ? "#34d399" : hesap.puan >= 60 ? "#22d3ee" : hesap.puan >= 45 ? "#f59e0b" : "#f87171";

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-chip-glow" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><CalendarDays className="h-3.5 w-3.5" />{data.derlenme}</div>
          <h1 className="font-display text-3xl font-bold mb-2">Bugün AI dünyası ne konuşuyor?</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-6 items-start">
          <div className="rounded-2xl border border-card-border bg-card p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Pozitiflik seviyesi</p>
            <p className="font-display font-bold text-5xl mt-3" style={{ color: renk }}>{hesap.puan}</p>
            <p className="font-mono text-[10px] text-muted-foreground">/ 100</p>
            <p className="font-display font-bold mt-3" style={{ color: renk }}>{data.puan.etiket}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{data.puan.yorum}</p>
            {tekrarSayisi > 0 && (
              <p className="text-[11px] text-muted-foreground/80 mt-3 pt-3 border-t border-card-border">
                Önceki günlerden tekrar eden {tekrarSayisi} haber puana katılmadı.
              </p>
            )}
          </div>
          <div className="space-y-4">
            {data.ozet.map((p, i) => (
              <p key={i} className={cn("leading-relaxed", i===0 ? "text-base text-foreground/90" : "text-sm text-muted-foreground")}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {yaklasan.length > 0 && (
        <section className="container mx-auto px-4 pb-10" aria-labelledby="yaklasan-baslik">
          <h2 id="yaklasan-baslik" className="font-display font-bold text-xl mb-4 inline-flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" />Yaklaşan olaylar
          </h2>
          <ol className="rounded-xl border border-card-border bg-card divide-y divide-card-border">
            {yaklasan.map((o, i) => {
              const k = kalanGun(o.tarih);
              return (
                <li key={i} className="flex items-start gap-4 px-5 py-3.5">
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-medium tabular-nums">{tarihYaz(o.tarih)}</p>
                    <p className={cn("text-xs", k <= 1 ? "text-primary" : "text-muted-foreground")}>
                      {k === 0 ? "bugün" : k === 1 ? "yarın" : `${k} gün sonra`}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{o.baslik}</p>
                    <a href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1">
                      {o.kaynak} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="container mx-auto px-4 pb-16">
        <h2 className="font-display font-bold text-xl mb-4">Günün gelişmeleri</h2>
        <div className="space-y-3">
          {data.maddeler.map((m, i) => {
            const k = KATEGORI[m.kategori];
            return (
              <div key={i} className={cn("rounded-xl border border-card-border bg-card p-5", m.tekrar && "opacity-75")}>
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${k.renk}20`, color: k.renk }}><k.Icon className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base">{m.baslik}</h3>
                    {m.tekrar && (
                      <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                        <Repeat className="h-3 w-3" aria-hidden="true" />
                        {tarihYaz(m.tekrar)} tarihinden tekrar, puana katılmadı
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{m.detay}</p>
                  </div>
                </div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground ml-10">
                  {m.kaynak} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </div>
        <Link href="/haberler" className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          Önceki günlerin haberleri ve konuya göre süzme → Haberler
        </Link>
      </section>
    </div>
  );
}
