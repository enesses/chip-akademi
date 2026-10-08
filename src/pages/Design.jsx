import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Check, Eraser, Flame, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DiePreview from "@/components/DiePreview";
import { CHIP_TYPES, GRID_COLS, GRID_ROWS, NODES, getBlock, blocksForType } from "@/data/blocks";
import { analyze, blockAt, canPlace } from "@/lib/chipDesign";
import { FLOORPLAN_PARTS, placementHints } from "@/lib/floorplan";
import { getDesign, saveDesign, updateDesign, listDesigns } from "@/lib/designs";
import { ADVISORS, runAdvisor, beatsAfter } from "@/lib/advisor";
import { cn } from "@/lib/utils";
import { Wand2 } from "lucide-react";

function heatColor(v) {
  const stops = [[0,[30,58,95]],[0.6,[14,116,144]],[1.2,[202,138,4]],[2.0,[234,88,12]],[3.0,[190,18,60]]];
  let a = stops[0], b = stops[stops.length-1];
  for (let i=0;i<stops.length-1;i++) if (v>=stops[i][0]&&v<=stops[i+1][0]) { a=stops[i]; b=stops[i+1]; break; }
  const t = b[0]===a[0]?0:Math.min(1,Math.max(0,(v-a[0])/(b[0]-a[0])));
  const c = a[1].map((ch,i)=>Math.round(ch+(b[1][i]-ch)*t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function Design() {
  const params = useParams();
  const [, navigate] = useLocation();
  const [typeId, setTypeId] = useState(null);
  const [nodeId, setNodeId] = useState("5nm");
  const [placed, setPlaced] = useState([]);
  const [tool, setTool] = useState(null);
  const [erasing, setErasing] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [heatmap, setHeatmap] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [advisorId, setAdvisorId] = useState(null);
  const [advisorResult, setAdvisorResult] = useState(null);
  const [drag, setDrag] = useState(null);   // { blockId, moveId } — sürüklenen blok
  const [hover, setHover] = useState(null); // { x, y } — bırakma önizlemesi
  // Telefonda 16 sütun ekrana sığınca hücreler parmakla seçilemeyecek kadar küçülüyor; orada sabit boyut + kaydırma.
  const [cellPx, setCellPx] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 26 : 0));

  useEffect(() => {
    if (!params?.id) return;
    const d = getDesign(params.id);
    if (!d) return;
    setTypeId(d.typeId); setNodeId(d.nodeId); setPlaced(d.placed); setDesignId(d.id); setDesignName(d.name);
    setNextId(Math.max(0, ...d.placed.map((p) => p.id)) + 1);
  }, [params?.id]);

  function chooseType(id) { setTypeId(id); setPlaced([]); setAdvisorResult(null); setAdvisorId(null); setTool(null); setErasing(false); setDesignId(null); setDesignName(""); }

  const result = useMemo(() => (typeId ? analyze({ typeId, nodeId, placed }) : null), [typeId, nodeId, placed]);
  const ghost = useMemo(() => {
    if (!drag || !hover) return null;
    const b = getBlock(drag.blockId);
    const base = drag.moveId == null ? placed : placed.filter((q) => q.id !== drag.moveId);
    const cells = new Set();
    for (let dy = 0; dy < b.h; dy++) for (let dx = 0; dx < b.w; dx++) cells.add(`${hover.x + dx},${hover.y + dy}`);
    return { cells, ok: canPlace(base, drag.blockId, hover.x, hover.y) };
  }, [drag, hover, placed]);
  const hints = useMemo(() => (!typeId || !tool || erasing || !showHints ? null : placementHints(placed, tool, result.node)), [typeId, tool, erasing, showHints, placed, result?.node]);

  // Yerleşim değişince danışman önerisi bayatlar; eski öneriyi uygulamak yeni yerleşimi ezer.
  function degistir(fn) { setPlaced(fn); setAdvisorResult(null); setAdvisorId(null); }
  function removeBlock(id) { degistir((p) => p.filter((q) => q.id !== id)); }
  function placeAt(blockId, x, y) {
    if (!canPlace(placed, blockId, x, y)) return false;
    degistir((p) => [...p, { id: nextId, blockId, x, y }]); setNextId((n) => n + 1);
    return true;
  }
  function handleCellClick(x, y) {
    if (erasing) { const b = blockAt(placed, x, y); if (b) removeBlock(b.id); return; }
    if (!tool) return;
    placeAt(tool, x, y);
  }
  function handleDrop(x, y) {
    const d = drag; setDrag(null); setHover(null);
    if (!d) return;
    if (d.moveId == null) { placeAt(d.blockId, x, y); return; }
    const without = placed.filter((q) => q.id !== d.moveId);
    if (canPlace(without, d.blockId, x, y)) degistir(() => [...without, { ...placed.find((q) => q.id === d.moveId), x, y }]);
  }
  function handleAdvisor(id) {
    setAdvisorId(id);
    const r = runAdvisor({ typeId, nodeId, placed, advisorId: id, maxSteps: 6 });
    setAdvisorResult(r);
  }
  function applyAdvisor() {
    if (!advisorResult) return;
    setPlaced(advisorResult.finalPlaced);
    setNextId(Math.max(0, ...advisorResult.finalPlaced.map((p) => p.id)) + 1);
    setAdvisorResult(null); setAdvisorId(null);
  }
  function handleSave() {
    const summary = { score: result.score, grade: result.grade };
    if (designId) updateDesign(designId, { name: designName.trim() || "Adsız", nodeId, placed, summary });
    else { const d = saveDesign({ name: designName.trim() || `${result.type.short} tasarımı`, typeId, nodeId, placed, summary }); setDesignId(d.id); setDesignName(d.name); }
    setSavedAt(Date.now()); setTimeout(() => setSavedAt(null), 2000);
  }

  if (!typeId) {
    return (
      <div className="bg-silicon-grid min-h-[80vh]">
        <section className="container mx-auto px-4 py-14">
          <h1 className="font-display text-3xl font-bold mb-2">Tasarım Atölyesi</h1>
          <p className="text-muted-foreground mb-8">Bir chip tipi seç ve blokları yerleştirmeye başla.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHIP_TYPES.map((t) => (
              <button key={t.id} onClick={() => chooseType(t.id)} className="rounded-xl border border-card-border bg-card p-5 text-left hover-elevate">
                <span className="font-display font-bold text-lg" style={{ color: t.color }}>{t.short}</span>
                <p className="text-sm text-muted-foreground mt-1">{t.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground mt-3">{t.powerBudget}W bütçe</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const palette = blocksForType(typeId);

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-6 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <Input aria-label="Tasarım adı" value={designName} onChange={(e) => setDesignName(e.target.value)} placeholder="Tasarım adı…" className="h-8 w-40 text-xs" />
          <Button size="sm" variant={savedAt ? "default" : "outline"} className="gap-1.5" onClick={handleSave} disabled={placed.length === 0}>
            {savedAt ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}{savedAt ? "Kaydedildi" : designId ? "Güncelle" : "Kaydet"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setTypeId(null); navigate("/tasarla"); }}>Tip değiştir</Button>
          <span className="w-px h-5 bg-border mx-1" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Süreç düğümü</span>
          {NODES.map((n) => (
            <button key={n.id} onClick={() => { setNodeId(n.id); setAdvisorResult(null); setAdvisorId(null); }} aria-pressed={nodeId === n.id} className={cn("px-2 py-1 rounded text-xs font-mono", nodeId === n.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>{n.id}</button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 grid lg:grid-cols-[16rem_1fr_18rem] gap-4">
        {/* Palet */}
        <div className="rounded-xl border border-card-border bg-card p-3 max-h-56 lg:max-h-[600px] overflow-y-auto">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{palette.length} blok</p>
          <p className="text-[10px] text-muted-foreground mb-2">Sürükleyip ızgaraya bırak ya da seçip hücreye dokun.</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {palette.map((b) => (
              <button key={b.id} data-testid="palet-blok" draggable
                onDragStart={(e) => { e.dataTransfer.setData("text/plain", `yeni:${b.id}`); e.dataTransfer.effectAllowed = "copy"; setDrag({ blockId: b.id, moveId: null }); setTool(b.id); setErasing(false); }}
                onDragEnd={() => { setDrag(null); setHover(null); }}
                onClick={() => { setTool(b.id); setErasing(false); }}
                title={`${b.name} · ${b.w}×${b.h} · ${b.power}W`}
                className={cn("w-full text-left rounded-lg border px-2 py-1.5 flex items-center gap-2 cursor-grab active:cursor-grabbing", tool === b.id && !erasing ? "border-primary bg-primary/5" : "border-border")}>
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: b.color }} />
                <span className="text-xs truncate flex-1">{b.name}</span>
                <span className="font-mono text-[9px] text-muted-foreground">{b.w}×{b.h}</span>
              </button>
            ))}
          </div>
          <Button size="sm" variant={erasing ? "default" : "outline"} className="w-full mt-3 gap-1.5" onClick={() => { setErasing((e) => !e); setTool(null); }}>
            <Eraser className="h-3.5 w-3.5" />Silgi
          </Button>
        </div>

        {/* Izgara */}
        <div className="min-w-0">
          {hints && (
            <div className="mb-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
              <p className="text-xs font-medium text-primary">{getBlock(tool)?.name} — {hints.tip.short}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{hints.tip.text}</p>
            </div>
          )}
          <div className="overflow-x-auto rounded-lg border border-border bg-background/60" data-testid="izgara-kap">
            <div className="grid gap-0.5 p-2" data-testid="izgara" role="grid" aria-label={`Die ızgarası, ${GRID_COLS}×${GRID_ROWS}`}
              style={cellPx
                ? { gridTemplateColumns: `repeat(${GRID_COLS}, ${cellPx}px)`, gridTemplateRows: `repeat(${GRID_ROWS}, ${cellPx}px)`, width: "max-content" }
                : { gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_ROWS}, auto)` }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(null); }}>
              {Array.from({ length: GRID_ROWS }).map((_, y) => Array.from({ length: GRID_COLS }).map((__, x) => {
                const p = placed.find((pp) => pp.x === x && pp.y === y);
                const zone = hints?.zones.get(`${x},${y}`);
                const heat = heatmap ? result.floorplan.heat.get(`${x},${y}`) || 0 : 0;
                const onizleme = ghost?.cells.has(`${x},${y}`) ? (ghost.ok ? "ok" : "bad") : null;
                const dropProps = {
                  onDragOver: (e) => { if (!drag) return; e.preventDefault(); e.dataTransfer.dropEffect = drag.moveId ? "move" : "copy"; if (!hover || hover.x !== x || hover.y !== y) setHover({ x, y }); },
                  onDrop: (e) => { e.preventDefault(); handleDrop(x, y); },
                };
                if (p) {
                  const b = getBlock(p.blockId);
                  return (
                    <div key={`${x}-${y}`} role="button" tabIndex={0} draggable={!erasing}
                      aria-label={`${b.name}, sütun ${x + 1} satır ${y + 1}${erasing ? " — silmek için Enter" : " — taşımak için sürükle"}`}
                      title={erasing ? `${b.name} — tıkla ve sil` : `${b.name} — sürükleyerek taşı`}
                      onClick={() => handleCellClick(x, y)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCellClick(x, y); } if (e.key === "Delete" || e.key === "Backspace") removeBlock(p.id); }}
                      onDragStart={(e) => { e.dataTransfer.setData("text/plain", `tasi:${p.id}`); e.dataTransfer.effectAllowed = "move"; setDrag({ blockId: p.blockId, moveId: p.id }); }}
                      onDragEnd={() => { setDrag(null); setHover(null); }}
                      {...dropProps}
                      className={cn("border rounded-[2px] flex items-center justify-center text-[7px] font-mono overflow-hidden select-none", erasing ? "cursor-pointer" : "cursor-grab active:cursor-grabbing", drag?.moveId === p.id && "opacity-40")}
                      style={{ gridColumn: `${x + 1} / span ${b.w}`, gridRow: `${y + 1} / span ${b.h}`, background: heatmap ? heatColor(heat) : `${b.color}33`, borderColor: heatmap ? "transparent" : b.color }}>
                      <span style={{ color: heatmap ? "#fff" : b.color }}>{heatmap ? heat.toFixed(1) : b.name.split(" ")[0]}</span>
                    </div>
                  );
                }
                const covered = placed.some((pp) => { const bb = getBlock(pp.blockId); return pp.x <= x && x < pp.x + bb.w && pp.y <= y && y < pp.y + bb.h; });
                if (covered) return null;
                return (
                  <button key={`${x}-${y}`} data-testid="hucre" aria-label={`Boş hücre, sütun ${x + 1} satır ${y + 1}`}
                    onClick={() => handleCellClick(x, y)} {...dropProps}
                    className={cn("rounded-[2px] border", !cellPx && "aspect-square",
                      onizleme === "ok" ? "border-emerald-400 bg-emerald-400/40" : onizleme === "bad" ? "border-red-500 bg-red-500/40"
                        : zone === "ideal" ? "border-primary/70 bg-primary/25" : zone === "hot" ? "border-red-500/60 bg-red-500/20" : "border-border/40 bg-muted/20")}
                    style={{ gridColumn: x + 1, gridRow: y + 1 }} />
                );
              }))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button onClick={() => setHeatmap((h) => !h)} className={cn("text-[10px] font-mono px-2 py-1 rounded border", heatmap ? "border-orange-400/60 text-orange-300" : "border-border text-muted-foreground")}>
              <Flame className="h-3 w-3 inline mr-1" />Isı haritası
            </button>
            <div className="flex items-center gap-1" role="group" aria-label="Izgara boyutu">
              <span className="font-mono text-[10px] text-muted-foreground mr-1">Boyut</span>
              {[[0, "Sığdır"], [26, "S"], [36, "M"], [48, "L"]].map(([px, ad]) => (
                <button key={ad} onClick={() => setCellPx(px)} aria-pressed={cellPx === px}
                  className={cn("text-[10px] font-mono px-2 py-1 rounded border", cellPx === px ? "border-primary text-primary" : "border-border text-muted-foreground")}>{ad}</button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">%{result.usedPct} dolu</span>
          </div>
        </div>

        {/* Analiz */}
        <div className="space-y-4">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Tasarım puanı</p>
            <p className="font-display font-bold text-4xl mt-1" style={{ color: result.score>=80?"#34d399":result.score>=62?"#22d3ee":result.score>=42?"#f59e0b":"#f87171" }}>{result.score}</p>
            <p className="text-sm">{result.grade}</p>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50 text-[11px]">
              <div><span className="text-muted-foreground">İşlevsel</span><p className="font-semibold">{result.functionalScore}</p></div>
              <div><span className="text-muted-foreground">Yerleşim</span><p className="font-semibold">{result.floorplan.score}</p></div>
              <div><span className="text-muted-foreground">Alan</span><p className="font-semibold">{Math.round(result.dieArea)} mm²</p></div>
              <div><span className="text-muted-foreground">Güç</span><p className="font-semibold">{Math.round(result.power)} W</p></div>
            </div>
          </div>
          {placed.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Yerleşim ayrıntısı</p>
              {FLOORPLAN_PARTS.map((fp) => {
                const v = Math.round((result.floorplan.parts[fp.key] || 0) * 100);
                return (
                  <div key={fp.key} className="mb-1.5" title={fp.hint}>
                    <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">{fp.label}</span><span>{v}</span></div>
                    <div className="h-1 rounded bg-muted/40 overflow-hidden"><div className="h-full rounded" style={{ width: `${v}%`, background: v >= 75 ? "#34d399" : v >= 45 ? "#f59e0b" : "#f87171" }} /></div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Gerekli bloklar</p>
            {result.requirements.map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-xs mb-1.5">
                <span className={cn("w-3 h-3 rounded-full", r.ok ? "bg-emerald-500" : "bg-red-500/60")} />
                <span className={r.ok ? "line-through text-muted-foreground" : ""}>{r.label}</span>
              </div>
            ))}
          </div>
          {result.warnings.slice(0,3).map((w,i) => (
            <div key={i} className="rounded-lg border border-amber-400/30 bg-amber-500/5 p-3 text-xs text-amber-200">{w.title}</div>
          ))}

          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Wand2 className="h-3 w-3" />Danışmanlar
            </p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {ADVISORS.map((a) => (
                <button key={a.id} onClick={() => handleAdvisor(a.id)}
                  className={cn("rounded-lg border px-2 py-1.5 text-left", advisorId === a.id ? "border-primary bg-primary/5" : "border-border")}>
                  <span className="text-xs font-semibold block">{a.name}</span>
                  <span className="text-[10px] text-muted-foreground">{a.kisa}</span>
                </button>
              ))}
            </div>
            {advisorResult && (
              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground">{getAdvisorDesc(advisorId)}</p>
                {advisorResult.steps.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Bu tasarım için önerilecek bir iyileştirme bulunamadı.</p>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      {advisorResult.steps.map((s, i) => (
                        <div key={i} className="text-[11px] rounded-md bg-muted/20 px-2 py-1.5">
                          <span className="font-semibold">{i+1}.</span> {s.reason}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs">Puan: <span className="font-semibold">{advisorResult.startScore}</span> → <span className="font-semibold text-primary">{advisorResult.finalScore}</span></p>
                    <GecilenTasarimlar sonuc={advisorResult} typeId={typeId} haricId={params?.id} />
                    <Button size="sm" className="w-full" onClick={applyAdvisor}>Öneriyi uygula</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
/** Danışmanın önerisi uygulanırsa aynı türdeki kayıtlı tasarımlardan hangileri geçilir. */
function GecilenTasarimlar({ sonuc, typeId, haricId }) {
  const liste = useMemo(() => {
    const rakipler = listDesigns()
      .filter((d) => d.typeId === typeId && d.id !== haricId)
      .map((d) => ({ name: d.name, metrics: { score: analyze({ typeId: d.typeId, nodeId: d.nodeId, placed: d.placed }).score } }));
    return beatsAfter(sonuc.startScore, sonuc.finalScore, rakipler);
  }, [sonuc, typeId, haricId]);
  if (!liste.length) return null;
  const gecilen = liste.filter((r) => !r.before && r.after);
  const onde = liste.filter((r) => r.before).length;
  return (
    <p className="text-[11px] text-muted-foreground leading-relaxed">
      {gecilen.length > 0
        ? <>Bu öneriyle geçeceğin tasarımların: <span className="text-foreground">{gecilen.map((r) => r.name).join(", ")}</span>.</>
        : "Bu öneri kayıtlı tasarımların arasındaki sıranı değiştirmiyor."}
      {onde > 0 && ` Zaten önünde olduğun ${onde} tasarım var.`}
    </p>
  );
}
function getAdvisorDesc(id) { const a = ADVISORS.find((x) => x.id === id); return a ? a.aciklama : ""; }
