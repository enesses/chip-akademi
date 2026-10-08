import { useParams } from "wouter";
import { Link } from "@/components/Nav";
import { ArrowLeft, Zap, DollarSign, Cpu, Sparkles, Target, Scale, ExternalLink, Smartphone, ArrowRight } from "lucide-react";
import icyapi from "@/data/icyapi.json";
import { chipiKullananCihazlar } from "@/lib/icPuan";
import { getChipById } from "@/data/chips";
import { imageUrl, manufacturerColors, formatSpecLabel } from "@/lib/utils";
import { scoreChip, rankInClass, verimlilikPuani, maliyetPuani, genelPuan } from "@/lib/chipScore";
import { cn } from "@/lib/utils";

function puanRengi(p) {
  if (p == null) return "text-muted-foreground";
  if (p >= 80) return "text-emerald-400";
  if (p >= 60) return "text-yellow-400";
  if (p >= 40) return "text-orange-400";
  return "text-rose-400";
}
function puanBorderRengi(p) {
  if (p == null) return "border-card-border";
  if (p >= 80) return "border-emerald-400/30";
  if (p >= 60) return "border-yellow-400/30";
  if (p >= 40) return "border-orange-400/30";
  return "border-rose-400/30";
}

/** Tek puan kartı */
function PuanKarti({ ikon: Ikon, baslik, altyazi, puan, renk, aciklama, children }) {
  return (
    <div className={cn("rounded-xl border p-5", puanBorderRengi(puan), "bg-card")}>
      <div className="flex items-center gap-2 mb-3">
        <Ikon className="h-4 w-4 text-muted-foreground" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{baslik}</p>
      </div>
      <div className="flex items-end gap-3 mb-1">
        <span className={cn("font-display font-bold text-3xl", puan != null ? puanRengi(puan) : "text-muted-foreground")}>
          {puan ?? "—"}
        </span>
        {altyazi && <span className="text-xs text-muted-foreground mb-0.5">{altyazi}</span>}
      </div>
      {aciklama && <p className="text-xs text-muted-foreground mt-2">{aciklama}</p>}
      {children}
    </div>
  );
}

/** Normalize bar */
function NormBar({ deger, renk = "bg-primary" }) {
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full", renk)} style={{ width: `${Math.round(deger * 100)}%` }} />
    </div>
  );
}

export default function ChipDetail() {
  const { id } = useParams();
  const chip = getChipById(id);
  if (!chip) return <div className="container mx-auto px-4 py-16">Chip bulunamadı.</div>;

  const s = scoreChip(chip);
  const v = verimlilikPuani(chip);
  const m = maliyetPuani(chip);
  const g = genelPuan(chip);
  const rank = rankInClass(chip);
  const color = manufacturerColors[chip.manufacturer] || "#94a3b8";
  const cihazlar = chipiKullananCihazlar(icyapi.cihazlar, chip.id);

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href={`/kategori/${chip.category}`} asChild>
        <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {chip.category} kataloğuna dön
        </a>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="rounded-2xl overflow-hidden border border-card-border bg-card">
            {chip.image ? (
              <img src={imageUrl(chip.image)} alt={chip.name} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-2 bg-silicon-grid">
                <Cpu className="h-10 w-10" style={{ color }} aria-hidden="true" />
                <p className="font-display font-bold text-lg" style={{ color }}>{chip.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">Görsel yok</p>
              </div>
            )}
          </div>
          {chip.image_credit && (
            <p className="text-[11px] text-muted-foreground mt-2">{chip.image_credit}</p>
          )}
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color }}>{chip.manufacturer}</p>
          <h1 className="font-display text-3xl font-bold mb-3">{chip.name}</h1>
          {chip.tagline && <p className="text-sm font-medium text-foreground/90 mb-2">{chip.tagline}</p>}
          {chip.description && <p className="text-muted-foreground leading-relaxed">{chip.description}</p>}
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div><span className="text-muted-foreground text-xs">Süreç düğümü</span><p className="font-medium">{chip.process_node}</p></div>
            <div><span className="text-muted-foreground text-xs">Yıl</span><p className="font-medium">{chip.release_year}</p></div>
            <div><span className="text-muted-foreground text-xs">Transistör</span><p className="font-medium">{chip.transistor_count}</p></div>
            <div><span className="text-muted-foreground text-xs">Die alanı</span><p className="font-medium">{chip.die_size}</p></div>
          </div>

          {/* Genel puan özeti */}
          {g.puan != null && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Genel puan · {s.clsLabel}</p>
              <div className="flex items-end gap-3">
                <span className={cn("font-display font-bold text-5xl", puanRengi(g.puan))}>{g.puan}</span>
                <span className="font-mono text-xs text-muted-foreground mb-1.5">sınıfında {rank.rank}. / {rank.total}</span>
              </div>
              {/* Üç bileşen çubukları */}
              <div className="mt-3 space-y-1.5">
                {g.bileskenler.map((b) => (
                  <div key={b.ad} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-16 shrink-0">{b.ad}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          b.ad === "Tasarım" ? "bg-primary" :
                          b.ad === "Verimlilik" ? "bg-emerald-400" : "bg-violet-400"
                        )}
                        style={{ width: `${b.puan}%` }}
                      />
                    </div>
                    <span className={cn("font-mono text-[11px] font-bold w-8 text-right", puanRengi(b.puan))}>{b.puan}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Üç puan kartı */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {/* Tasarım puanı */}
        <PuanKarti
          ikon={Cpu}
          baslik="Tasarım puanı"
          altyazi={`veri kapsamı %${s.coverage}`}
          puan={s.score}
          aciklama={s.reason}
        >
          {s.score != null && s.parts.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {s.parts.map((part) => (
                <div key={part.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-foreground/80">{part.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">%{Math.round(part.norm * 100)}</span>
                  </div>
                  <NormBar deger={part.norm} renk="bg-primary" />
                </div>
              ))}
              {s.missing.length > 0 && (
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  Eksik: {s.missing.join(", ")}
                </p>
              )}
            </div>
          )}
        </PuanKarti>

        {/* Verimlilik puanı */}
        <PuanKarti
          ikon={Zap}
          baslik="Verimlilik puanı"
          altyazi={v.hammDeger != null ? `${v.hammDeger} ${v.birim}` : undefined}
          puan={v.puan}
          aciklama={v.neden}
        >
          {v.puan != null && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-foreground/80">Güç verimliliği</span>
                <span className="font-mono text-[10px] text-muted-foreground">%{v.puan}</span>
              </div>
              <NormBar deger={v.puan / 100} renk="bg-emerald-400" />
              <p className="text-[10px] text-muted-foreground/70 mt-2">
                Sınıf içinde en verimli chip = 100
              </p>
            </div>
          )}
        </PuanKarti>

        {/* Maliyet puanı */}
        <PuanKarti
          ikon={DollarSign}
          baslik="Maliyet puanı"
          altyazi={m.usdSaat != null ? (m.gpuSayisi > 1 ? `$${m.usdSaat}/saat (${m.gpuSayisi} GPU × $${m.usdSaatGpu})` : `$${m.usdSaat}/saat`) : undefined}
          puan={m.puan}
          aciklama={m.neden}
        >
          {m.puan != null && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-foreground/80">Performans/maliyet</span>
                <span className="font-mono text-[10px] text-muted-foreground">%{m.puan}</span>
              </div>
              <NormBar deger={m.puan / 100} renk="bg-violet-400" />
              <p className="text-[10px] text-muted-foreground/70 mt-2">
                Düşük $/performans = yüksek puan
              </p>
            </div>
          )}
        </PuanKarti>
      </div>

      {/* Mimari öne çıkanlar + kullanım alanları */}
      {(chip.architecture_highlights?.length > 0 || chip.use_cases?.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          {chip.architecture_highlights?.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />Mimaride öne çıkanlar
              </p>
              <ul className="space-y-2.5">
                {chip.architecture_highlights.map((h, i) => (
                  <li key={i} className="text-sm leading-relaxed flex gap-2">
                    <span className="text-primary/60 shrink-0 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {chip.use_cases?.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                <Target className="h-3 w-3" />Kullanım alanları
              </p>
              <ul className="space-y-2.5">
                {chip.use_cases.map((u, i) => (
                  <li key={i} className="text-sm text-foreground/85 leading-relaxed flex gap-2">
                    <span className="text-muted-foreground shrink-0 font-mono text-xs mt-0.5">—</span>
                    {u}
                  </li>
                ))}
              </ul>
              {chip.comparison_notes && (
                <div className="mt-4 pt-4 border-t border-card-border">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
                    <Scale className="h-3 w-3" />Kıyas notu
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{chip.comparison_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bu chip hangi cihazlarda? (İç bölümüyle ters bağlantı) */}
      {cihazlar.length > 0 && (
        <div className="rounded-xl border border-card-border bg-card p-5 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
            <Smartphone className="h-3 w-3" />Bu chip'i içeren cihazlar
          </p>
          <div className="flex flex-wrap gap-2">
            {cihazlar.map((c) => (
              <Link key={c.id} href={`/ic/${c.id}`} asChild>
                <a className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-sm hover-elevate">
                  {c.ad} <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ham spesifikasyonlar */}
      <h2 className="font-display text-lg font-bold mb-3">Tüm Spesifikasyonlar</h2>
      <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(chip.key_specs || {}).map(([k, v], i) => (
              <tr key={k} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground w-1/3">{formatSpecLabel(k)}</td>
                <td className="px-4 py-2.5">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {chip.kaynaklar?.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Kaynaklar</p>
          <ul className="space-y-1.5">
            {chip.kaynaklar.map((k, i) => (
              <li key={i}>
                <a href={k.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  {k.ad} <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
