/** Tasarım Atölyesi analiz motoru: yerleşimden puan, güç, verim, ısı hesaplar. */
import { GRID_COLS, GRID_ROWS, getBlock, getChipType, getNode } from "@/data/blocks";
import { analyzeFloorplan } from "@/lib/floorplan";

export function cellsOf(p) {
  const b = getBlock(p.blockId);
  const out = [];
  for (let dy = 0; dy < b.h; dy++) for (let dx = 0; dx < b.w; dx++) out.push([p.x + dx, p.y + dy]);
  return out;
}
export function blockAt(placed, x, y) {
  for (const p of placed) for (const [cx, cy] of cellsOf(p)) if (cx === x && cy === y) return p;
  return null;
}
export function canPlace(placed, blockId, x, y) {
  const b = getBlock(blockId);
  if (!b) return false;
  if (x < 0 || y < 0 || x + b.w > GRID_COLS || y + b.h > GRID_ROWS) return false;
  const occ = new Set();
  for (const p of placed) for (const [cx, cy] of cellsOf(p)) occ.add(`${cx},${cy}`);
  for (let dy = 0; dy < b.h; dy++) for (let dx = 0; dx < b.w; dx++) if (occ.has(`${x + dx},${y + dy}`)) return false;
  return true;
}

export function analyze({ typeId, nodeId, placed }) {
  const type = getChipType(typeId);
  const node = getNode(nodeId);

  const totals = { st: 0, mt: 0, gfx: 0, rt: 0, ai: 0, cache: 0, mem: 0, io: 0, platform: 0 };
  const counts = {};
  let transistors = 0, occupiedCells = 0, power = 0;

  for (const p of placed) {
    const b = getBlock(p.blockId);
    if (!b) continue;
    counts[p.blockId] = (counts[p.blockId] || 0) + 1;
    transistors += b.transistors;
    occupiedCells += b.w * b.h;
    power += b.power * node.powerMul;
    for (const [k, v] of Object.entries(b.stats || {})) {
      if (k === "st") totals.st = Math.max(totals.st, v);
      else totals[k] = (totals[k] || 0) + v;
    }
  }

  const dieArea = occupiedCells * node.cellArea;
  const usedPct = Math.round((occupiedCells / (GRID_COLS * GRID_ROWS)) * 100);
  const powerDensity = dieArea > 0 ? power / dieArea : 0;

  // Murphy verim modeli
  const A = dieArea / 100; // cm²
  const D = node.defectDensity;
  const yieldRate = A > 0 ? Math.pow((1 - Math.exp(-A * D)) / (A * D || 1), 2) : 1;
  const waferArea = 70685 * 0.88;
  const goodDies = dieArea > 0 ? Math.floor((waferArea / dieArea) * yieldRate) : 0;
  const costPerDie = goodDies > 0 ? node.waferCost / goodDies : null;

  // bellek darboğazı
  const demand = totals.gfx * 6 + totals.ai * 5 + totals.mt * 1.5;
  const bwRatio = demand > 0 ? totals.mem / demand : 1;
  const throttle = bwRatio < 0.75 ? 0.55 + 0.45 * bwRatio : 1;

  // termal kısıtlama
  const budgetUse = type.powerBudget ? power / type.powerBudget : 0;
  const thermalThrottle = budgetUse > 1 ? 1 / budgetUse : 1;

  const norm = {};
  for (const [k, v] of Object.entries(totals)) norm[k] = type.norms[k] ? Math.min(1, v / type.norms[k]) : 0;
  norm.efficiency = power > 0 ? Math.min(1, (transistors / power) / 0.3) : 0;

  let functional = 0;
  for (const [k, w] of Object.entries(type.weights)) functional += (norm[k] || 0) * w;
  functional = functional * 100 * throttle * thermalThrottle;

  const floorplan = analyzeFloorplan(placed, node);
  const layoutWeight = placed.length >= 4 ? 0.2 : 0;
  const score = Math.max(0, Math.min(100, Math.round(functional * (1 - layoutWeight) + floorplan.score * layoutWeight)));

  const grade = score >= 80 ? "Mükemmel" : score >= 62 ? "İyi" : score >= 42 ? "Orta" : score >= 20 ? "Zayıf" : "Çalışmaz";

  const REQ_LABELS = { st: "Tekil iş performansı", mt: "Çoklu iş performansı", gfx: "Grafik gücü", rt: "Işın izleme",
    ai: "AI / tensör gücü", cache: "Önbellek", mem: "Bellek bant genişliği", io: "I/O bant genişliği", platform: "Platform bütünlüğü" };
  const requirements = Object.entries(type.weights)
    .filter(([k, w]) => w >= 0.08 && REQ_LABELS[k])
    .map(([k]) => ({ id: k, label: REQ_LABELS[k], ok: (norm[k] || 0) >= 0.35 }));

  const warnings = [];
  if (placed.length === 0) warnings.push({ tone: "info", title: "Henüz hiç blok yerleştirmedin." });
  else {
    if (bwRatio < 0.75) warnings.push({ tone: "warn", title: `Bellek bant genişliği darboğaz yapıyor (ihtiyacın %${Math.round(bwRatio * 100)}'i karşılanıyor). Bellek denetleyicisi veya HBM ekle.` });
    if (budgetUse > 1) warnings.push({ tone: "warn", title: `Güç bütçesi aşıldı: ${Math.round(power)}W / ${type.powerBudget}W. Tasarım kısılıyor (throttle).` });
    if (usedPct < 15) warnings.push({ tone: "info", title: "Izgaranın çoğu boş. Daha fazla blok ekleyerek alanı değerlendir." });
  }
  for (const issue of floorplan.issues) warnings.push(issue);

  return {
    type, node, totals, counts, norm, transistors, dieArea, density: dieArea > 0 ? (transistors / 1e6) / dieArea : 0,
    power, powerDensity, usedPct, yieldRate, goodDies, costPerDie, bwRatio, throttle, thermalTrottle: thermalThrottle,
    budgetUse, floorplan, functionalScore: Math.round(functional), score, grade, requirements, warnings,
  };
}
