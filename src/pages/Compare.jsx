import { useMemo, useState } from "react";
import { Link } from "@/components/Nav";
import { X, Plus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chips } from "@/data/chips";
import { scoreChip, classOf, CLASS_LABELS } from "@/lib/chipScore";
import { categoryLabels, imageUrl, manufacturerColors } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MAX_ITEMS = 7;

export default function Compare() {
  const [ids, setIds] = useState(() => chips.slice(0, 3).map((c) => c.id));
  const [picker, setPicker] = useState(false);

  const selected = ids.map((id) => chips.find((c) => c.id === id)).filter(Boolean);
  const scored = selected.map((c) => ({ chip: c, score: scoreChip(c) }));

  const allSameClass = scored.length > 0 && scored.every((s) => s.score.cls === scored[0].score.cls);

  // Birleşik ölçüt satırları: aynı sınıftaki her çipin rubric parçalarının birleşimi.
  const metricRows = useMemo(() => {
    if (!allSameClass) return [];
    const byKey = new Map();
    for (const s of scored) {
      for (const p of s.score.parts) {
        if (!byKey.has(p.key)) byKey.set(p.key, { key: p.key, label: p.label, weight: p.weight, values: new Map() });
        byKey.get(p.key).values.set(s.chip.id, { raw: p.raw, norm: p.norm });
      }
    }
    return [...byKey.values()].sort((a, b) => b.weight - a.weight);
  }, [scored, allSameClass]);

  function addChip(id) {
    if (ids.includes(id) || ids.length >= MAX_ITEMS) return;
    setIds((prev) => [...prev, id]);
    setPicker(false);
  }
  function removeChip(id) { setIds((prev) => prev.filter((x) => x !== id)); }

  const available = chips.filter((c) => !ids.includes(c.id));

  function winnerFor(row) {
    let bestId = null, bestVal = -Infinity;
    for (const [id, v] of row.values) if (v.raw > bestVal) { bestVal = v.raw; bestId = id; }
    return bestId;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Karşılaştır</h1>
      <p className="text-muted-foreground mb-6">2-7 çip arasında ölçüt bazlı karşılaştırma. En iyi değer her satırda işaretlenir.</p>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {selected.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded-full border border-card-border bg-card pl-1.5 pr-2 py-1">
            <img src={imageUrl(c.image)} alt="" className="w-6 h-6 rounded-full object-cover bg-muted" />
            <span className="text-xs font-medium whitespace-nowrap max-w-[9rem] truncate">{c.name}</span>
            <button onClick={() => removeChip(c.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {ids.length < MAX_ITEMS && (
          <div className="relative">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setPicker((p) => !p)}>
              <Plus className="h-3.5 w-3.5" />Çip ekle
            </Button>
            {picker && (
              <div className="absolute z-20 mt-1 w-72 max-h-80 overflow-y-auto rounded-lg border border-card-border bg-card shadow-xl p-1.5">
                {available.map((c) => (
                  <button key={c.id} onClick={() => addChip(c.id)}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover-elevate text-sm">
                    <img src={imageUrl(c.image)} alt="" className="w-6 h-6 rounded object-cover bg-muted" />
                    <span className="truncate flex-1">{c.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{categoryLabels[c.category] || c.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selected.length < 2 ? (
        <p className="text-muted-foreground">Karşılaştırmak için en az 2 çip seç.</p>
      ) : (
        <>
          {/* Genel puan kartları */}
          <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0,1fr))` }}>
            {scored.map(({ chip, score }) => {
              const best = scored.every((s) => s.score.score !== null) && score.score === Math.max(...scored.map((s) => s.score.score ?? -1));
              return (
                <div key={chip.id} className={cn("rounded-xl border p-4 text-center", best ? "border-primary bg-primary/5" : "border-card-border bg-card")}>
                  {best && <Trophy className="h-4 w-4 text-primary mx-auto mb-1" />}
                  <p className="text-xs font-medium truncate" style={{ color: manufacturerColors[chip.manufacturer] }}>{chip.manufacturer}</p>
                  <p className="font-display font-bold text-2xl mt-1">{score.score ?? "—"}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{CLASS_LABELS[score.cls]}</p>
                </div>
              );
            })}
          </div>

          {!allSameClass && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/5 p-3 text-xs text-amber-200 mb-6">
              Seçilen çipler farklı sınıflarda (örn. GPU ile CPU) — ölçüt bazlı satırlar yalnızca aynı sınıftaki çipler için gösterilir. Aşağıda ham spesifikasyon karşılaştırması yer alıyor.
            </div>
          )}

          {allSameClass && metricRows.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card overflow-hidden mb-10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border bg-muted/20">
                    <th className="text-left px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Ölçüt</th>
                    {selected.map((c) => <th key={c.id} className="text-left px-4 py-2 text-xs font-medium whitespace-nowrap">{c.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {metricRows.map((row, i) => {
                    const winner = winnerFor(row);
                    return (
                      <tr key={row.key} className={i % 2 ? "bg-muted/10" : ""}>
                        <td className="px-4 py-2 text-xs text-muted-foreground">{row.label}</td>
                        {selected.map((c) => {
                          const v = row.values.get(c.id);
                          return (
                            <td key={c.id} className={cn("px-4 py-2 text-sm", winner === c.id && "text-primary font-semibold")}>
                              {v ? v.raw.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Ham spesifikasyon karşılaştırması */}
          <h2 className="font-display text-lg font-bold mb-3">Tüm Spesifikasyonlar</h2>
          <div className="rounded-xl border border-card-border bg-card overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-muted/20">
                  <th className="text-left px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Özellik</th>
                  {selected.map((c) => <th key={c.id} className="text-left px-4 py-2 text-xs font-medium whitespace-nowrap">{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...new Set(selected.flatMap((c) => Object.keys(c.key_specs || {})))].map((key, i) => (
                  <tr key={key} className={i % 2 ? "bg-muted/10" : ""}>
                    <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{key}</td>
                    {selected.map((c) => <td key={c.id} className="px-4 py-2 text-sm">{String(c.key_specs?.[key] ?? "—")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
