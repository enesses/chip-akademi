/** Danışmanlar: aynı arama motoru, farklı hedef fonksiyon. */
import { blocksForType, getBlock, getNode, GRID_COLS, GRID_ROWS } from "@/data/blocks";
import { analyze, canPlace } from "@/lib/chipDesign";
import { placementHints } from "@/lib/floorplan";

export const GAP_METRICS = [
  { key: "score", label: "Tasarım puanı", better: "high", fmt: (v) => Math.round(v) },
  { key: "layout", label: "Yerleşim puanı", better: "high", fmt: (v) => Math.round(v) },
  { key: "dieArea", label: "Die alanı", better: "low", fmt: (v) => `${Math.round(v)} mm²` },
  { key: "density", label: "Yoğunluk", better: "high", fmt: (v) => `${v.toFixed(0)} M/mm²` },
  { key: "power", label: "Güç", better: "low", fmt: (v) => `${Math.round(v)} W` },
  { key: "powerDensity", label: "Güç yoğunluğu", better: "low", fmt: (v) => `${v.toFixed(2)} W/mm²` },
  { key: "yieldRate", label: "Üretim verimi", better: "high", fmt: (v) => `%${Math.round(v)}` },
  { key: "cost", label: "Die maliyeti", better: "low", fmt: (v) => `~$${Math.round(v)}` },
  { key: "costPerPoint", label: "Puan başına maliyet", better: "low", fmt: (v) => `$${v.toFixed(1)}` },
  { key: "perfPerWatt", label: "Watt başına puan", better: "high", fmt: (v) => v.toFixed(2) },
  { key: "mem", label: "Bellek bant genişliği", better: "high", fmt: (v) => `${Math.round(v)} GB/s` },
  { key: "bwRatio", label: "Bellek yeterliliği", better: "high", fmt: (v) => `%${Math.round(v)}` },
  { key: "cache", label: "Cache", better: "high", fmt: (v) => Math.round(v) },
  { key: "platform", label: "Platform bütünlüğü", better: "high", fmt: (v) => `%${Math.round(v)}` },
  { key: "goodDies", label: "Wafer başına sağlam die", better: "high", fmt: (v) => Math.round(v) },
  { key: "budgetUse", label: "Güç bütçesi kullanımı", better: "low", fmt: (v) => `%${Math.round(v)}` },
  { key: "thermal", label: "Isı payı", better: "high", fmt: (v) => `%${Math.round(v)}` },
  { key: "fill", label: "Izgara doluluğu", better: null, fmt: (v) => `%${Math.round(v)}` },
  { key: "blocks", label: "Blok sayısı", better: null, fmt: (v) => Math.round(v) },
  { key: "transistors", label: "Transistör", better: null, fmt: (v) => `${v.toFixed(1)} milyar` },
];
const has = (v) => v !== null && v !== undefined && !Number.isNaN(v) && Number.isFinite(v);

export function metricsFrom(result, placedCount) {
  const cost = result.costPerDie;
  return {
    score: result.score, layout: result.floorplan.score, dieArea: result.dieArea, density: result.density || null,
    power: result.power, powerDensity: result.powerDensity, yieldRate: result.yieldRate * 100, cost,
    costPerPoint: cost && result.score > 0 ? cost / result.score : null,
    perfPerWatt: result.power > 0 ? result.score / result.power : null,
    mem: result.totals.mem, bwRatio: result.bwRatio != null ? Math.min(1, result.bwRatio) * 100 : null,
    cache: result.totals.cache, platform: (result.norm.platform || 0) * 100, goodDies: result.goodDies,
    budgetUse: result.budgetUse != null ? result.budgetUse * 100 : null, thermal: (result.floorplan.parts.thermal || 0) * 100,
    fill: result.usedPct, blocks: placedCount, transistors: result.transistors,
  };
}
export function findGaps(favorite, rivals) {
  const gaps = [];
  for (const m of GAP_METRICS) {
    if (!m.better) continue;
    const mine = favorite.metrics[m.key];
    if (!has(mine)) continue;
    let best = null;
    for (const r of rivals) {
      const v = r.metrics[m.key];
      if (!has(v)) continue;
      const daha = m.better === "high" ? v > mine : v < mine;
      if (!daha) continue;
      if (!best || (m.better === "high" ? v > best.value : v < best.value)) best = { name: r.name, value: v };
    }
    if (best) {
      const deficit = m.better === "high" ? ((best.value - mine)/Math.max(1e-6,Math.abs(best.value)))*100 : ((mine - best.value)/Math.max(1e-6,Math.abs(mine)))*100;
      gaps.push({ key: m.key, label: m.label, mine: m.fmt(mine), rival: m.fmt(best.value), rivalName: best.name, deficit: Math.round(deficit) });
    }
  }
  return gaps.sort((a, b) => b.deficit - a.deficit);
}

export const ADVISORS = [
  { id: "tasarim", name: "Tasarım Danışmanı", kisa: "Puanı yükselt", aciklama: "Genel tasarım puanını en çok artıran hamleleri arar.",
    metric: (r) => r.score, moves: ["add","remove","swap"],
    readout: [{ label: "Tasarım puanı", get: (r) => r.score, fmt: (v) => Math.round(v), better: "high" }, { label: "Yerleşim", get: (r) => r.floorplan.score, fmt: (v) => Math.round(v), better: "high" }] },
  { id: "maliyet", name: "Maliyet Danışmanı", kisa: "Aynı işi daha ucuza", aciklama: "Puan başına maliyeti düşürür.",
    metric: (r) => (r.costPerDie ? (r.score*100)/r.costPerDie : 0), guard: (r, base) => r.score >= base.score*0.85, moves: ["add","remove","swap"],
    readout: [{ label: "Die maliyeti", get: (r) => r.costPerDie, fmt: (v) => v?`$${Math.round(v)}`:"—", better: "low" }, { label: "Tasarım puanı", get: (r) => r.score, fmt: (v) => Math.round(v), better: "high" }, { label: "Wafer başına die", get: (r) => r.goodDies, fmt: (v) => Math.round(v), better: "high" }] },
  { id: "guc", name: "Güç Danışmanı", kisa: "Watt başına performans", aciklama: "Aynı performansı daha az güçle almanın yolunu arar.",
    metric: (r) => (r.power>0 ? (r.score*100)/r.power : 0), guard: (r, base) => r.score >= base.score*0.85, moves: ["add","remove","swap"],
    readout: [{ label: "Güç (TDP)", get: (r) => r.power, fmt: (v) => `${Math.round(v)} W`, better: "low" }, { label: "Tasarım puanı", get: (r) => r.score, fmt: (v) => Math.round(v), better: "high" }, { label: "Güç yoğunluğu", get: (r) => r.powerDensity, fmt: (v) => `${v.toFixed(2)} W/mm²`, better: "low" }] },
  { id: "yerlesim", name: "Yerleşim Danışmanı", kisa: "Blokları doğru yere koy", aciklama: "Hangi blokları koyduğuna dokunmaz; nereye koyduğunu düzeltir.",
    metric: (r) => r.floorplan.score, moves: ["move"],
    readout: [{ label: "Yerleşim puanı", get: (r) => r.floorplan.score, fmt: (v) => Math.round(v), better: "high" }, { label: "Isı payı", get: (r) => r.floorplan.parts.thermal*100, fmt: (v) => `%${Math.round(v)}`, better: "high" }, { label: "Kenar yerleşimi", get: (r) => r.floorplan.parts.edge*100, fmt: (v) => `%${Math.round(v)}`, better: "high" }] },
  { id: "bellek", name: "Bellek Danışmanı", kisa: "Darboğazı aç", aciklama: "Hesap birimlerinin veri beklemesini önler.",
    metric: (r) => Math.min(1, r.bwRatio)*1000 + r.score, moves: ["add","swap"],
    readout: [{ label: "Bellek yeterliliği", get: (r) => Math.min(1, r.bwRatio)*100, fmt: (v) => `%${Math.round(v)}`, better: "high" }, { label: "Bant genişliği", get: (r) => r.totals.mem, fmt: (v) => `${Math.round(v)} GB/s`, better: "high" }, { label: "Tasarım puanı", get: (r) => r.score, fmt: (v) => Math.round(v), better: "high" }] },
];
export function getAdvisor(id) { return ADVISORS.find((a) => a.id === id) || ADVISORS[0]; }

function candidatePositions(placed, blockId, node, limit = 4) {
  const { zones } = placementHints(placed, blockId, node);
  const ideal = [];
  for (const [key, kind] of zones) if (kind === "ideal") ideal.push(key.split(",").map(Number));
  const plain = [];
  if (ideal.length === 0) for (let y = 0; y < GRID_ROWS; y += 2) for (let x = 0; x < GRID_COLS; x += 2) if (canPlace(placed, blockId, x, y)) plain.push([x, y]);
  const pool = ideal.length ? ideal : plain;
  if (pool.length <= limit) return pool;
  const step = Math.max(1, Math.floor(pool.length / limit));
  const picked = [];
  for (let i = 0; i < pool.length && picked.length < limit; i += step) picked.push(pool[i]);
  return picked;
}
const SWAP_PRIORITY = ["hbm","mem-ctrl-g","mem-ctrl","io","llc","l3","pll","pmic","fabric"];
function reasonFor(blockId, before, after) {
  const b = getBlock(blockId);
  const d = { mem: after.totals.mem-before.totals.mem, cache: after.totals.cache-before.totals.cache, ai: after.totals.ai-before.totals.ai,
    gfx: after.totals.gfx-before.totals.gfx, platform: after.totals.platform-before.totals.platform, layout: after.floorplan.score-before.floorplan.score };
  const parts = [];
  if (d.mem > 20) parts.push(`bellek +${Math.round(d.mem)} GB/s`);
  if (d.cache > 3) parts.push(`cache +${Math.round(d.cache)}`);
  if (d.ai > 5) parts.push(`AI +${Math.round(d.ai)}`);
  if (d.gfx > 5) parts.push(`grafik +${Math.round(d.gfx)}`);
  if (d.platform > 4) parts.push(`platform +${Math.round(d.platform)}`);
  if (d.layout > 2) parts.push(`yerleşim +${Math.round(d.layout)}`);
  if (parts.length === 0) parts.push("genel denge iyileşiyor");
  return `${b.name} ekleyince ${parts.join(", ")}.`;
}
export function runAdvisor({ typeId, nodeId, placed, advisorId = "tasarim", maxSteps = 6 }) {
  const advisor = getAdvisor(advisorId);
  const node = getNode(nodeId);
  const palette = blocksForType(typeId);
  let current = placed.map((p) => ({ ...p }));
  let nextId = Math.max(0, ...current.map((p) => p.id)) + 1;
  let base = analyze({ typeId, nodeId, placed: current });
  const baseline = base;
  const steps = [];
  const kabul = (r) => (advisor.guard ? advisor.guard(r, baseline) : true);

  for (let step = 0; step < maxSteps; step++) {
    let best = null;
    const deger = (r) => advisor.metric(r) - advisor.metric(base);
    if (advisor.moves.includes("add")) {
      for (const block of palette) for (const [x, y] of candidatePositions(current, block.id, node)) {
        if (!canPlace(current, block.id, x, y)) continue;
        const trial = [...current, { id: nextId, blockId: block.id, x, y }];
        const r = analyze({ typeId, nodeId, placed: trial });
        if (!kabul(r)) continue;
        const gain = deger(r);
        if (!best || gain > best.gain) best = { kind: "add", blockId: block.id, x, y, gain, result: r, trial };
      }
    }
    if (advisor.moves.includes("remove")) {
      for (const p of current) {
        const trial = current.filter((q) => q.id !== p.id);
        if (trial.length === 0) continue;
        const r = analyze({ typeId, nodeId, placed: trial });
        if (!kabul(r)) continue;
        const gain = deger(r);
        if (!best || gain > best.gain) best = { kind: "remove", blockId: p.blockId, x: p.x, y: p.y, gain, result: r, trial };
      }
    }
    if (advisor.moves.includes("move")) {
      for (const p of current) {
        const without = current.filter((q) => q.id !== p.id);
        for (const [x, y] of candidatePositions(without, p.blockId, node, 5)) {
          if (x === p.x && y === p.y) continue;
          const trial = [...without, { ...p, x, y }];
          const r = analyze({ typeId, nodeId, placed: trial });
          if (!kabul(r)) continue;
          const gain = deger(r);
          if (!best || gain > best.gain) best = { kind: "move", blockId: p.blockId, from: [p.x, p.y], x, y, gain, result: r, trial };
        }
      }
    }
    if (advisor.moves.includes("swap") && (!best || best.gain <= 0)) {
      const priority = SWAP_PRIORITY.filter((id) => palette.some((b) => b.id === id));
      for (const p of current) {
        const without = current.filter((q) => q.id !== p.id);
        for (const blockId of priority) {
          if (blockId === p.blockId) continue;
          if (!canPlace(without, blockId, p.x, p.y)) continue;
          const trial = [...without, { id: nextId, blockId, x: p.x, y: p.y }];
          const r = analyze({ typeId, nodeId, placed: trial });
          if (!kabul(r)) continue;
          const gain = deger(r);
          if (!best || gain > best.gain) best = { kind: "swap", blockId, replacedId: p.blockId, x: p.x, y: p.y, gain, result: r, trial };
        }
      }
    }
    if (!best || best.gain <= 0.0001) break;
    steps.push({
      kind: best.kind, blockId: best.blockId, blockName: getBlock(best.blockId).name,
      replacedName: best.replacedId ? getBlock(best.replacedId).name : null, from: best.from ?? null,
      x: best.x, y: best.y, gain: best.gain, scoreAfter: best.result.score, result: best.result,
      reason: best.kind === "add" ? reasonFor(best.blockId, base, best.result)
        : best.kind === "swap" ? `${getBlock(best.replacedId).name} yerine ${getBlock(best.blockId).name} koymak daha verimli.`
        : best.kind === "move" ? `${getBlock(best.blockId).name} bu konumda kurala daha uygun.`
        : `${getBlock(best.blockId).name} kaldırılınca güç ve alan bütçesi rahatlıyor.`,
    });
    current = best.trial;
    if (best.kind === "add" || best.kind === "swap") nextId += 1;
    base = best.result;
  }
  return { advisor, startResult: baseline, finalResult: base, startScore: baseline.score, finalScore: base.score, finalPlaced: current, steps };
}
export function beatsAfter(startScore, finalScore, rivals) {
  return rivals.filter((r) => has(r.metrics.score)).map((r) => ({ name: r.name, rivalScore: r.metrics.score, before: startScore > r.metrics.score, after: finalScore > r.metrics.score }));
}
