import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Link } from "@/components/Nav";
import { Check, Eraser, Flame, Lightbulb, LayoutGrid, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DiePreview from "@/components/DiePreview";
import { BLOCKS, CHIP_TYPES, GRID_COLS, GRID_ROWS, NODES, getBlock, getChipType, getNode, blocksForType } from "@/data/blocks";
import { analyze, blockAt, canPlace } from "@/lib/chipDesign";
import { FLOORPLAN_PARTS, placementHints, placementTip } from "@/lib/floorplan";
import { getDesign, listDesigns, saveDesign, updateDesign } from "@/lib/designs";
import { ADVISORS, runAdvisor } from "@/lib/advisor";
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

  useEffect(() => {
    if (!params?.id) return;
    const d = getDesign(params.id);
    if (!d) return;
    setTypeId(d.typeId); setNodeId(d.nodeId); setPlaced(d.placed); setDesignId(d.id); setDesignName(d.name);
    setNextId(Math.max(0, ...d.placed.map((p) => p.id)) + 1);
  }, [params?.id]);

  function chooseType(id) { setTypeId(id); setPlaced([]); setTool(null); setErasing(false); setDesignId(null); setDesignName(""); }

  const result = useMemo(() => (typeId ? analyze({ typeId, nodeId, placed }) : null), [typeId, nodeId, placed]);
  const hints = useMemo(() => (!typeId || !tool || erasing || !showHints ? null : placementHints(placed, tool, result.node)), [typeId, tool, erasing, showHints, placed, result?.node]);

  function handleCellClick(x, y) {
    if (erasing) { const b = blockAt(placed, x, y); if (b) setPlaced((p) => p.filter((q) => q.id !== b.id)); return; }
    if (!tool) return;
    if (canPlace(placed, tool, x, y)) { setPlaced((p) => [...p, { id: nextId, blockId: tool, x, y }]); setNextId((n) => n + 1); }
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
          <Input value={designName} onChange={(e) => setDesignName(e.target.value)} placeholder="Tasarım adı…" className="h-8 w-40 text-xs" />
          <Button size="sm" variant={savedAt ? "default" : "outline"} className="gap-1.5" onClick={handleSave} disabled={placed.length === 0}>
            {savedAt ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}{savedAt ? "Kaydedildi" : designId ? "Güncelle" : "Kaydet"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setTypeId(null); navigate("/tasarla"); }}>Tip değiştir</Button>
          <span className="w-px h-5 bg-border mx-1" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Süreç düğümü</span>
          {NODES.map((n) => (
            <button key={n.id} onClick={() => setNodeId(n.id)} className={cn("px-2 py-1 rounded text-xs font-mono", nodeId === n.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>{n.id}</button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 grid lg:grid-cols-[16rem_1fr_18rem] gap-4">
        {/* Palet */}
        <div className="rounded-xl border border-card-border bg-card p-3 max-h-[600px] overflow-y-auto">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{palette.length} blok</p>
          <div className="space-y-1.5">
            {palette.map((b) => (
              <button key={b.id} onClick={() => { setTool(b.id); setErasing(false); }}
                className={cn("w-full text-left rounded-lg border px-2 py-1.5 flex items-center gap-2", tool === b.id && !erasing ? "border-primary bg-primary/5" : "border-border")}>
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: b.color }} />
                <span className="text-xs truncate flex-1">{b.name}</span>
              </button>
            ))}
          </div>
          <Button size="sm" variant={erasing ? "default" : "outline"} className="w-full mt-3 gap-1.5" onClick={() => { setErasing((e) => !e); setTool(null); }}>
            <Eraser className="h-3.5 w-3.5" />Silgi
          </Button>
        </div>

        {/* Izgara */}
        <div>
          {hints && (
            <div className="mb-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
              <p className="text-xs font-medium text-primary">{getBlock(tool)?.name} — {hints.tip.short}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{hints.tip.text}</p>
            </div>
          )}
          <div className="grid gap-0.5 p-2 rounded-lg border border-border bg-background/60" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
            {Array.from({ length: GRID_ROWS }).map((_, y) => Array.from({ length: GRID_COLS }).map((__, x) => {
              const p = placed.find((pp) => pp.x <= x && x < pp.x + getBlock(pp.blockId).w && pp.y <= y && y < pp.y + getBlock(pp.blockId).h && pp.x === x && pp.y === y);
              const zone = hints?.zones.get(`${x},${y}`);
              const heat = heatmap ? result.floorplan.heat.get(`${x},${y}`) || 0 : 0;
              if (p) {
                const b = getBlock(p.blockId);
                return (
                  <div key={`${x}-${y}`} onClick={() => handleCellClick(x, y)} className="border rounded-[2px] flex items-center justify-center cursor-pointer text-[7px] font-mono overflow-hidden"
                    style={{ gridColumn: `${x+1} / span ${b.w}`, gridRow: `${y+1} / span ${b.h}`, background: heatmap ? heatColor(heat) : `${b.color}33`, borderColor: heatmap ? "transparent" : b.color }}>
                    <span style={{ color: heatmap ? "#fff" : b.color }}>{heatmap ? heat.toFixed(1) : b.name.split(" ")[0]}</span>
                  </div>
                );
              }
              const covered = placed.some((pp) => { const bb = getBlock(pp.blockId); return pp.x <= x && x < pp.x+bb.w && pp.y <= y && y < pp.y+bb.h; });
              if (covered) return null;
              return (
                <button key={`${x}-${y}`} onClick={() => handleCellClick(x, y)}
                  className={cn("aspect-square rounded-[2px] border", zone === "ideal" ? "border-primary/70 bg-primary/25" : zone === "hot" ? "border-red-500/60 bg-red-500/20" : "border-border/40 bg-muted/20")}
                  style={{ gridColumn: x+1, gridRow: y+1 }} />
              );
            }))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setHeatmap((h) => !h)} className={cn("text-[10px] font-mono px-2 py-1 rounded border", heatmap ? "border-orange-400/60 text-orange-300" : "border-border text-muted-foreground")}>
              <Flame className="h-3 w-3 inline mr-1" />Isı haritası
            </button>
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
function getAdvisorDesc(id) { const a = ADVISORS.find((x) => x.id === id); return a ? a.aciklama : ""; }
