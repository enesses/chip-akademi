import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trophy, Cpu, PenTool, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiePreview from "@/components/DiePreview";
import { chips } from "@/data/chips";
import { getChipType } from "@/data/blocks";
import { scoreChip, CLASS_LABELS } from "@/lib/chipScore";
import { analyze } from "@/lib/chipDesign";
import { GAP_METRICS, metricsFrom } from "@/lib/advisor";
import { listDesigns } from "@/lib/designs";
import { isMultiDie, parseArea, parseTransistors, parseWatts } from "@/lib/specDecoder";
import { categoryLabels, cn, imageUrl, manufacturerColors } from "@/lib/utils";

const MAX_ITEMS = 7;
/** Tasarımlar sayfasından "Karşılaştır" ile gelinirse eklenecek tasarım burada bekler. */
export const BEKLEYEN_ANAHTAR = "chip-akademi:karsilastir:ekle";

const fmtSayi = (v, basamak = 1) => v.toLocaleString("tr-TR", { maximumFractionDigits: basamak });

/* Gerçek çip ile kendi tasarımın arasında ortak olan fiziksel ölçütler. */
const FIZIKSEL = [
  { key: "transistor", label: "Transistör", birim: "milyar", better: "high", basamak: 1 },
  { key: "alan", label: "Die alanı", birim: "mm²", better: null, basamak: 0, not: "Büyük die daha çok iş yapar ama daha pahalıdır; tek başına iyi ya da kötü değil." },
  { key: "yogunluk", label: "Transistör yoğunluğu", birim: "M/mm²", better: "high", basamak: 0 },
  { key: "guc", label: "Güç (TDP)", birim: "W", better: "low", basamak: 0 },
  { key: "verim", label: "Watt başına transistör", birim: "M/W", better: "high", basamak: 0 },
];

function chipFiziksel(chip) {
  const tr = parseTransistors(chip.transistor_count);
  const cokluDie = isMultiDie(chip);
  const alan = cokluDie ? null : parseArea(chip.die_size);
  const guc = parseWatts(chip.key_specs?.tdp);
  return {
    transistor: tr ? tr / 1e9 : null,
    alan,
    yogunluk: tr && alan ? tr / 1e6 / alan : null,
    guc,
    verim: tr && guc ? tr / 1e6 / guc : null,
  };
}
function tasarimFiziksel(r) {
  return {
    transistor: r.transistors || null,
    alan: r.dieArea || null,
    yogunluk: r.density || null,
    guc: r.power || null,
    verim: r.power > 0 ? (r.transistors * 1000) / r.power : null,
  };
}

function kazanan(degerler, better) {
  if (!better) return null;
  const sayilar = degerler.filter(([, v]) => typeof v === "number" && Number.isFinite(v));
  if (sayilar.length < 2) return null;
  let en = sayilar[0];
  for (const s of sayilar) if (better === "high" ? s[1] > en[1] : s[1] < en[1]) en = s;
  // Eşitlikte kimse kazanmaz
  return sayilar.filter((s) => s[1] === en[1]).length > 1 ? null : en[0];
}

export default function Compare() {
  const [designs] = useState(() => listDesigns());
  const [items, setItems] = useState(() => {
    let bekleyen = null;
    try { bekleyen = window.sessionStorage.getItem(BEKLEYEN_ANAHTAR); window.sessionStorage.removeItem(BEKLEYEN_ANAHTAR); } catch {}
    if (bekleyen && designs.some((d) => d.id === bekleyen)) {
      // Tasarımı, aynı sınıftaki gerçek çiplerle yan yana başlat.
      const d = designs.find((x) => x.id === bekleyen);
      const benzer = chips.filter((c) => (d.typeId === "CPU" ? c.category === "CPU" : c.category === "GPU")).slice(0, 2);
      return [{ kind: "design", id: bekleyen }, ...benzer.map((c) => ({ kind: "chip", id: c.id }))];
    }
    return chips.slice(0, 3).map((c) => ({ kind: "chip", id: c.id }));
  });
  const [picker, setPicker] = useState(false);
  const [arama, setArama] = useState("");

  useEffect(() => {
    if (!picker) return;
    const kapat = (e) => { if (e.key === "Escape") setPicker(false); };
    window.addEventListener("keydown", kapat);
    return () => window.removeEventListener("keydown", kapat);
  }, [picker]);

  const entries = useMemo(() => items.map(({ kind, id }) => {
    const key = `${kind}:${id}`;
    if (kind === "chip") {
      const chip = chips.find((c) => c.id === id);
      if (!chip) return null;
      const s = scoreChip(chip);
      return { key, kind, name: chip.name, chip, score: s.score, sinif: s.cls, sinifAd: CLASS_LABELS[s.cls], parts: s.parts,
        renk: manufacturerColors[chip.manufacturer], alt: chip.manufacturer, fiziksel: chipFiziksel(chip) };
    }
    const d = designs.find((x) => x.id === id);
    if (!d) return null;
    const r = analyze({ typeId: d.typeId, nodeId: d.nodeId, placed: d.placed });
    const t = getChipType(d.typeId);
    return { key, kind, name: d.name, design: d, score: r.score, sinif: `tasarim-${d.typeId}`, sinifAd: `Senin ${t.short} tasarımın`,
      renk: t.color, alt: `${t.short} · ${d.nodeId}`, metrics: metricsFrom(r, d.placed.length), fiziksel: tasarimFiziksel(r) };
  }).filter(Boolean), [items, designs]);

  const cipler = entries.filter((e) => e.kind === "chip");
  const tasarimlar = entries.filter((e) => e.kind === "design");
  const tumuAyniSinif = entries.length > 0 && entries.every((e) => e.sinif === entries[0].sinif);
  const puanKiyaslanir = tumuAyniSinif && entries.every((e) => e.score != null);
  const enIyiPuan = puanKiyaslanir ? Math.max(...entries.map((e) => e.score)) : null;

  // Aynı sınıftaki gerçek çipler için sınıf ölçütleri
  const rubrikSatirlari = useMemo(() => {
    if (!(cipler.length >= 2 && tasarimlar.length === 0 && tumuAyniSinif)) return [];
    const byKey = new Map();
    for (const e of cipler) for (const p of e.parts) {
      if (!byKey.has(p.key)) byKey.set(p.key, { key: p.key, label: p.label, weight: p.weight, values: new Map() });
      byKey.get(p.key).values.set(e.key, p.raw);
    }
    return [...byKey.values()].sort((a, b) => b.weight - a.weight);
  }, [cipler, tasarimlar.length, tumuAyniSinif]);

  function ekle(kind, id) {
    if (items.length >= MAX_ITEMS || items.some((x) => x.kind === kind && x.id === id)) return;
    setItems((prev) => [...prev, { kind, id }]);
    setPicker(false); setArama("");
  }
  function cikar(key) { setItems((prev) => prev.filter((x) => `${x.kind}:${x.id}` !== key)); }

  const secili = new Set(items.map((x) => `${x.kind}:${x.id}`));
  const q = arama.trim().toLocaleLowerCase("tr");
  const uygunCipler = chips.filter((c) => !secili.has(`chip:${c.id}`) && (!q || c.name.toLocaleLowerCase("tr").includes(q)));
  const uygunTasarimlar = designs.filter((d) => !secili.has(`design:${d.id}`) && (!q || d.name.toLocaleLowerCase("tr").includes(q)));

  const Hucre = ({ e, children, kazandi }) => (
    <td className={cn("px-4 py-2 text-sm whitespace-nowrap", kazandi && "text-primary font-semibold")}>
      {kazandi && <Trophy className="h-3 w-3 inline mr-1 -mt-0.5" aria-label="en iyi" />}{children}
    </td>
  );
  const Baslik = () => (
    <thead>
      <tr className="border-b border-card-border bg-muted/20">
        <th className="text-left px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Ölçüt</th>
        {entries.map((e) => <th key={e.key} className="text-left px-4 py-2 text-xs font-medium whitespace-nowrap">{e.name}</th>)}
      </tr>
    </thead>
  );

  const fizikselSatirlar = FIZIKSEL.map((m) => {
    const degerler = entries.map((e) => [e.key, e.fiziksel[m.key]]);
    return { ...m, degerler, kazanan: kazanan(degerler, m.better) };
  }).filter((r) => r.degerler.filter(([, v]) => v != null).length >= 1);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Karşılaştır</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        2–7 öğe: gerçek çipler ve Atölye'de kaydettiğin tasarımlar. Her satırda en iyi değer işaretlenir.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {entries.map((e) => (
          <div key={e.key} className="flex items-center gap-2 rounded-full border border-card-border bg-card pl-1.5 pr-2 py-1">
            {e.kind === "chip"
              ? <img src={imageUrl(e.chip.image)} alt="" className="w-6 h-6 rounded-full object-cover bg-muted" />
              : <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${e.renk}25`, color: e.renk }}><PenTool className="h-3 w-3" /></span>}
            <span className="text-xs font-medium whitespace-nowrap max-w-[9rem] truncate">{e.name}</span>
            <button onClick={() => cikar(e.key)} aria-label={`${e.name} karşılaştırmadan çıkar`} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {items.length < MAX_ITEMS && (
          <div className="relative">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setPicker((p) => !p)} aria-expanded={picker}>
              <Plus className="h-3.5 w-3.5" />Ekle
            </Button>
            {picker && (
              <div className="absolute z-20 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-card-border bg-card shadow-xl">
                <div className="p-2 border-b border-card-border flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input autoFocus value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Ara…" aria-label="Çip veya tasarım ara"
                    className="bg-transparent text-sm outline-none flex-1" />
                </div>
                <div className="max-h-80 overflow-y-auto p-1.5" data-testid="secici">
                  {uygunTasarimlar.length > 0 && <p className="px-2 pt-1 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Tasarımlarım</p>}
                  {uygunTasarimlar.map((d) => {
                    const t = getChipType(d.typeId);
                    return (
                      <button key={d.id} onClick={() => ekle("design", d.id)} data-testid="secici-tasarim"
                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover-elevate text-sm">
                        <PenTool className="h-3.5 w-3.5 shrink-0" style={{ color: t.color }} />
                        <span className="truncate flex-1">{d.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{t.short} · {d.nodeId}</span>
                      </button>
                    );
                  })}
                  {uygunCipler.length > 0 && <p className="px-2 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Çipler</p>}
                  {uygunCipler.map((c) => (
                    <button key={c.id} onClick={() => ekle("chip", c.id)} data-testid="secici-cip"
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover-elevate text-sm">
                      <img src={imageUrl(c.image)} alt="" className="w-6 h-6 rounded object-cover bg-muted" />
                      <span className="truncate flex-1">{c.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{categoryLabels[c.category] || c.category}</span>
                    </button>
                  ))}
                  {uygunCipler.length + uygunTasarimlar.length === 0 && <p className="px-2 py-3 text-xs text-muted-foreground">Eşleşen yok.</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {designs.length === 0 && (
        <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" />Atölye'de bir tasarım kaydedersen onu da buraya ekleyip gerçek çiplerle kıyaslayabilirsin.</p>
      )}

      {entries.length < 2 ? (
        <p className="text-muted-foreground">Karşılaştırmak için en az 2 öğe seç.</p>
      ) : (
        <>
          {/* Puan kartları */}
          <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(7rem,1fr))`, overflowX: "auto" }}>
            {entries.map((e) => {
              const best = puanKiyaslanir && e.score === enIyiPuan;
              return (
                <div key={e.key} className={cn("rounded-xl border p-4 text-center", best ? "border-primary bg-primary/5" : "border-card-border bg-card")}>
                  {best && <Trophy className="h-4 w-4 text-primary mx-auto mb-1" aria-label="en yüksek puan" />}
                  {e.kind === "design" && <DiePreview placed={e.design.placed} className="w-full h-auto mb-2 rounded" />}
                  <p className="text-xs font-medium truncate" style={{ color: e.renk }}>{e.alt}</p>
                  <p className="font-display font-bold text-2xl mt-1">{e.score ?? "—"}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{e.sinifAd}</p>
                </div>
              );
            })}
          </div>
          {!puanKiyaslanir && (
            <p className="text-xs text-muted-foreground mb-8 max-w-3xl">
              Puanlar farklı ölçeklerde: gerçek çipin puanı kendi sınıfındaki en iyiye göre (100 = sınıfın en iyisi), tasarımın puanı ise Atölye'nin tasarım puanı.
              Bu yüzden genel kazanan seçilmedi; aşağıdaki ortak ölçütler doğrudan kıyaslanabilir.
            </p>
          )}
          {puanKiyaslanir && <div className="mb-8" />}

          {rubrikSatirlari.length > 0 && (
            <>
              <h2 className="font-display text-lg font-bold mb-3">{entries[0].sinifAd} ölçütleri</h2>
              <div className="rounded-xl border border-card-border bg-card mb-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <Baslik />
                  <tbody>
                    {rubrikSatirlari.map((row, i) => {
                      const k = kazanan(entries.map((e) => [e.key, row.values.get(e.key)]), "high");
                      return (
                        <tr key={row.key} className={i % 2 ? "bg-muted/10" : ""}>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{row.label}</td>
                          {entries.map((e) => {
                            const v = row.values.get(e.key);
                            return <Hucre key={e.key} e={e} kazandi={k === e.key}>{v != null ? fmtSayi(v, 2) : "—"}</Hucre>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {fizikselSatirlar.length > 0 && (
            <>
              <h2 className="font-display text-lg font-bold mb-1">Fiziksel ölçütler</h2>
              <p className="text-xs text-muted-foreground mb-3">Gerçek çiplerle kendi tasarımların arasında ortak ölçü. Çok die'lı paketlerde alan ve yoğunluk tek die'a indirgenemediği için boş bırakılır.</p>
              <div className="rounded-xl border border-card-border bg-card mb-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <Baslik />
                  <tbody>
                    {fizikselSatirlar.map((row, i) => (
                      <tr key={row.key} className={i % 2 ? "bg-muted/10" : ""}>
                        <td className="px-4 py-2 text-xs text-muted-foreground" title={row.not}>{row.label}{row.better && <span className="ml-1 text-[10px]">{row.better === "high" ? "↑" : "↓"}</span>}</td>
                        {row.degerler.map(([key, v]) => (
                          <Hucre key={key} kazandi={row.kazanan === key}>{v != null ? `${fmtSayi(v, row.basamak)} ${row.birim}` : "—"}</Hucre>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tasarimlar.length >= 2 && (
            <>
              <h2 className="font-display text-lg font-bold mb-3">Tasarım ölçütleri</h2>
              <div className="rounded-xl border border-card-border bg-card mb-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <Baslik />
                  <tbody>
                    {GAP_METRICS.filter((m) => m.better).map((m, i) => {
                      const degerler = entries.map((e) => [e.key, e.kind === "design" ? e.metrics[m.key] : null]);
                      const k = kazanan(degerler, m.better);
                      return (
                        <tr key={m.key} className={i % 2 ? "bg-muted/10" : ""}>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{m.label} <span className="text-[10px]">{m.better === "high" ? "↑" : "↓"}</span></td>
                          {degerler.map(([key, v]) => (
                            <Hucre key={key} kazandi={k === key}>{v != null && Number.isFinite(v) ? m.fmt(v) : "—"}</Hucre>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {cipler.length > 0 && (
            <>
              <h2 className="font-display text-lg font-bold mb-3">Tüm spesifikasyonlar</h2>
              <div className="rounded-xl border border-card-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border bg-muted/20">
                      <th className="text-left px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Özellik</th>
                      {cipler.map((e) => <th key={e.key} className="text-left px-4 py-2 text-xs font-medium whitespace-nowrap">{e.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[...new Set(cipler.flatMap((e) => Object.keys(e.chip.key_specs || {})))].map((key, i) => (
                      <tr key={key} className={i % 2 ? "bg-muted/10" : ""}>
                        <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{key}</td>
                        {cipler.map((e) => <td key={e.key} className="px-4 py-2 text-sm">{String(e.chip.key_specs?.[key] ?? "—")}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
