import { Link } from "@/components/Nav";
import { Gauge, Cpu, ArrowRight, AlertTriangle, Info } from "lucide-react";
import { scoreChip, verimlilikPuani, maliyetPuani, genelPuan } from "@/lib/chipScore";
import { CIHAZ_AGIRLIK } from "@/lib/icPuan";
import { cn } from "@/lib/utils";

export function puanRengi(p) {
  if (p == null) return "text-muted-foreground";
  if (p >= 80) return "text-emerald-400";
  if (p >= 60) return "text-yellow-400";
  if (p >= 40) return "text-orange-400";
  return "text-rose-400";
}
function cubukRengi(p) {
  if (p == null) return "bg-muted";
  if (p >= 80) return "bg-emerald-400";
  if (p >= 60) return "bg-yellow-400";
  if (p >= 40) return "bg-orange-400";
  return "bg-rose-400";
}

/** "73/100" ya da "—" */
function Puan({ deger, buyuk = false }) {
  return (
    <span className={cn("font-display font-bold leading-none", buyuk ? "text-4xl" : "text-2xl", puanRengi(deger))}>
      {deger ?? "—"}
      {deger != null && <span className="text-xs text-muted-foreground font-normal">/100</span>}
    </span>
  );
}

function Cubuk({ deger }) {
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      {deger != null && (
        <div className={cn("h-full rounded-full", cubukRengi(deger))} style={{ width: `${deger}%` }} />
      )}
    </div>
  );
}

/* ─── Cihaz puan paneli ─────────────────────────────────────────────────── */

const BILESEN_ACIKLAMA = {
  onarim: "iFixit onarılabilirlik puanı × 10",
  seffaflik: "Üreticisi bilinen parça ÷ (tüm parçalar + eksik veri maddeleri)",
  islemci: "Ana işlemcinin katalogdaki genel puanı",
};

export function CihazPuanPaneli({ puan }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
            <Gauge className="h-3 w-3" />Cihaz puanı
          </p>
          <Puan deger={puan.genel} buyuk />
          {puan.genelNeden && <p className="text-xs text-muted-foreground mt-2 max-w-md">{puan.genelNeden}</p>}
        </div>
        <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
          Ağırlıklar: onarım %{CIHAZ_AGIRLIK.onarim * 100}, şeffaflık %{CIHAZ_AGIRLIK.seffaflik * 100}, işlemci %
          {CIHAZ_AGIRLIK.islemci * 100}. Hesaplanamayan bileşen dışarıda kalır, kalanlar yeniden ağırlıklandırılır.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {puan.bilesenler.map((b) => (
          <div key={b.key} className="rounded-lg border border-card-border bg-background/40 p-4">
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <p className="text-sm font-medium">{b.ad}</p>
              <Puan deger={b.puan} />
            </div>
            <Cubuk deger={b.puan} />
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              {b.puan != null ? b.ham : b.neden}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1.5">{BILESEN_ACIKLAMA[b.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── İşlemci kartı ─────────────────────────────────────────────────────── */

// Künyede gösterilecek alanlar, sırasıyla. Değerler katalogdan aynen alınır.
const KUNYE = [
  ["architecture", "Çekirdek düzeni"],
  ["cores", "Çekirdek"],
  ["threads", "İş parçacığı"],
  ["boost_clock", "Tepe saat"],
  ["e_core_clock", "Verim çekirdeği saati"],
  ["base_clock", "Taban saat"],
  ["p_cores", "Performans çekirdekleri"],
  ["e_cores", "Verim çekirdekleri"],
  ["gpu", "GPU"],
  ["igpu", "GPU"],
  ["neural_engine", "Neural Engine"],
  ["npu_tops", "NPU"],
  ["npu", "NPU"],
  ["tpu", "TPU"],
  ["unified_memory", "Bellek"],
  ["max_unified_memory", "En fazla bellek"],
  ["capacity", "Bellek"],
  ["memory_type", "Bellek tipi"],
  ["memory_bandwidth", "Bant genişliği"],
  ["l2_cache", "L2 önbellek"],
  ["l3_cache", "L3 / sistem önbelleği"],
  ["modem", "Modem"],
  ["tdp", "TDP"],
  ["tdp_araligi", "TDP aralığı"],
  ["guc", "Güç"],
];

const BIRIM = { bw: "GB/s", vram: "GB", npu: "TOPS", clock: "GHz", cores: "çekirdek", eff: "çekirdek×GHz/W" };

function sayi(v) {
  return Number.isInteger(v) ? v : Number(v.toFixed(2));
}

export function IslemciKarti({ cihaz, chip }) {
  if (!chip) {
    const islemciParcalari = cihaz.parcalar.filter((p) => p.rol === "islemci");
    return (
      <div className="rounded-xl border border-card-border bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
          <Cpu className="h-3 w-3" />Ana işlemci
        </p>
        {islemciParcalari.map((p, i) => (
          <div key={i} className="mb-3">
            <p className="font-medium">{p.ad}</p>
            {p.deger && <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{p.deger}</p>}
          </div>
        ))}
        <div className="flex gap-2 rounded-lg border border-yellow-400/25 bg-yellow-400/5 px-3 py-2.5 mt-2">
          <Info className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{cihaz.ana_islemci?.not}</p>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 opacity-60">
          {["Tasarım", "Verimlilik", "Maliyet", "Genel"].map((ad) => (
            <div key={ad} className="rounded-lg border border-card-border p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{ad}</p>
              <p className="font-display font-bold text-lg text-muted-foreground">—</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const s = scoreChip(chip);
  const v = verimlilikPuani(chip);
  const m = maliyetPuani(chip);
  const g = genelPuan(chip);
  const ks = chip.key_specs || {};
  const gorulen = new Set();
  const satirlar = [];
  if (chip.process_node) satirlar.push(["Üretim düğümü", chip.process_node]);
  if (chip.transistor_count && !/bilgi yok/i.test(chip.transistor_count)) satirlar.push(["Transistör", chip.transistor_count]);
  if (chip.die_size && !/bilgi yok/i.test(chip.die_size)) satirlar.push(["Die alanı", chip.die_size]);
  for (const [k, etiket] of KUNYE) {
    if (ks[k] == null) continue;
    const deger = String(ks[k]);
    if (gorulen.has(etiket + deger)) continue;
    gorulen.add(etiket + deger);
    satirlar.push([etiket, deger]);
  }

  const dortlu = [
    { ad: "Tasarım", puan: s.score, neden: s.reason },
    { ad: "Verimlilik", puan: v.puan, neden: v.neden },
    { ad: "Maliyet", puan: m.puan, neden: m.neden },
    { ad: "Genel", puan: g.puan, neden: g.neden },
  ];

  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
            <Cpu className="h-3 w-3" />Ana işlemci · {s.clsLabel}
          </p>
          <p className="font-display font-bold text-lg leading-snug">{chip.name}</p>
          {chip.tagline && <p className="text-xs text-muted-foreground mt-1">{chip.tagline}</p>}
        </div>
        <Link href={`/chip/${chip.id}`} asChild>
          <a className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
            Katalog sayfası <ArrowRight className="h-3 w-3" />
          </a>
        </Link>
      </div>

      {cihaz.ana_islemci?.not && (
        <p className="text-xs text-muted-foreground mb-4 flex gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {cihaz.ana_islemci.not}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Künye */}
        <dl className="text-sm divide-y divide-card-border border-y border-card-border self-start">
          {satirlar.map(([etiket, deger], i) => (
            <div key={i} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2">
              <dt className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground pt-0.5">{etiket}</dt>
              <dd className="text-[13px] leading-snug">{deger}</dd>
            </div>
          ))}
        </dl>

        {/* Puanlar */}
        <div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {dortlu.map((d) => (
              <div
                key={d.ad}
                className={cn(
                  "rounded-lg border p-2.5 text-center",
                  d.ad === "Genel" ? "border-primary/30 bg-primary/5" : "border-card-border"
                )}
                title={d.puan == null ? d.neden || "" : undefined}
              >
                <p className="text-[10px] text-muted-foreground mb-1">{d.ad}</p>
                <p className={cn("font-display font-bold text-xl leading-none", puanRengi(d.puan))}>{d.puan ?? "—"}</p>
                <p className="text-[9px] text-muted-foreground mt-1">{d.puan != null ? "/100" : "yok"}</p>
              </div>
            ))}
          </div>

          {/* Neden yok? */}
          <ul className="space-y-1 mb-4">
            {dortlu
              .filter((d) => d.puan == null && d.neden && d.ad !== "Genel")
              .map((d) => (
                <li key={d.ad} className="text-[11px] text-muted-foreground">
                  <span className="text-foreground/80">{d.ad} yok:</span> {d.neden}
                </li>
              ))}
          </ul>

          {/* Tasarım dökümü */}
          {s.score != null && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Tasarım puanının dökümü · kapsam %{s.coverage}
              </p>
              <div className="space-y-2.5">
                {s.parts.map((p) => (
                  <div key={p.key}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] text-foreground/80">
                        {p.label}
                        <span className="text-muted-foreground"> · ağırlık %{Math.round(p.weight * 100)}</span>
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {sayi(p.raw)} {BIRIM[p.key] || ""} → %{Math.round(p.norm * 100)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(p.norm * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {s.missing.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-3">
                  <span className="text-foreground/80">Hesaba girmeyen ölçütler:</span> {s.missing.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ölçek ve kapsam uyarıları */}
      <div className="mt-5 space-y-2">
        <p className="text-[11px] text-muted-foreground flex gap-1.5 leading-relaxed">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Her ölçüt sınıfın en iyisine göre normalize edilir (%100 = {s.clsLabel} sınıfının en iyisi).
          {s.cls === "SOC" && ["telefon", "konsol", "giyilebilir"].includes(cihaz.kategori) &&
            " Bu sınıfta dizüstü chipleri de var (M4 Max, Snapdragon X2 Elite); telefon ve konsol chipleri bu yüzden düşük görünür — ölçek mutlak, cihaz türüne göre ayarlanmıyor."}
        </p>
        {s.score != null && s.coverage < 100 && (
          <p className="text-[11px] text-yellow-400/90 flex gap-1.5 leading-relaxed">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Puan açıklanan %{s.coverage} ölçütle hesaplandı. Eksik ölçüt puanı ne düşürür ne artırır — ortalamadan
            çıkarılır. Bu yüzden az veri açıklayan bir chip'in puanı iyimser kalabilir: zayıf olduğu bir ölçütü
            açıklamadıysa o ölçütün cezasını da almaz.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Eksikler ──────────────────────────────────────────────────────────── */

export function EksiklerKutusu({ eksikler }) {
  if (!eksikler?.length) return null;
  return (
    <div className="rounded-xl border border-orange-400/25 bg-orange-400/5 p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-3 inline-flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3" />Eksikleri
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        Cihazın zayıf yanları — her madde bu sayfadaki kaynaklı verilerden çıkarıldı. (Açıklanmamış bilgiler
        ayrıca aşağıdaki "Eksik veri" kutusunda.)
      </p>
      <ul className="space-y-1.5">
        {eksikler.map((e, i) => (
          <li key={i} className="text-sm text-foreground/85 flex gap-2">
            <span className="text-orange-400/70 shrink-0 font-mono text-xs mt-0.5">—</span>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
