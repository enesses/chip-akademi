/** Yerleşim (floorplan) analizi: kenar, ısı, yakınlık, kümelenme, hizalama. */
import { GRID_COLS, GRID_ROWS, getBlock } from "@/data/blocks";

const EDGE_BLOCKS = new Set(["io","mem-ctrl","mem-ctrl-g","hbm","fabric","d2d","pad","display","usb","nic","storage","modem","wireless"]);
const COMPUTE_BLOCKS = new Set(["p-core","e-core","lp-core","dense-core","sm","tensor","npu","igpu","simd","fp64","dsp"]);
const CACHE_BLOCKS = new Set(["l1","l2","l3","llc","v-cache","scratchpad"]);
const NEEDS_SM = new Set(["rt","rop","tmu","geometry"]);

function cellsOfPlaced(p) {
  const b = getBlock(p.blockId); const out = [];
  for (let dy = 0; dy < b.h; dy++) for (let dx = 0; dx < b.w; dx++) out.push([p.x + dx, p.y + dy]);
  return out;
}
function touchesEdge(p) {
  const b = getBlock(p.blockId);
  return p.x === 0 || p.y === 0 || p.x + b.w === GRID_COLS || p.y + b.h === GRID_ROWS;
}
function buildOccupancy(placed) {
  const map = new Map();
  for (const p of placed) for (const [x, y] of cellsOfPlaced(p)) map.set(`${x},${y}`, p.id);
  return map;
}
function neighborsOf(p, occ) {
  const b = getBlock(p.blockId); const found = new Set();
  for (let dx = -1; dx <= b.w; dx++) for (let dy = -1; dy <= b.h; dy++) {
    const onBorder = dx === -1 || dy === -1 || dx === b.w || dy === b.h;
    const isCorner = (dx === -1 || dx === b.w) && (dy === -1 || dy === b.h);
    if (!onBorder || isCorner) continue;
    const id = occ.get(`${p.x + dx},${p.y + dy}`);
    if (id !== undefined && id !== p.id) found.add(id);
  }
  return found;
}

export function analyzeFloorplan(placed, node) {
  const empty = { score: 0, parts: { edge: 0, thermal: 0, adjacency: 0, clustering: 0, compactness: 0 }, issues: [], wins: [], heat: new Map(), maxHeat: 0 };
  if (!placed || placed.length === 0) return empty;

  const occ = buildOccupancy(placed);
  const byId = new Map(placed.map((p) => [p.id, p]));
  const issues = [], wins = [];

  const edgeNeeded = placed.filter((p) => EDGE_BLOCKS.has(p.blockId));
  const edgeOk = edgeNeeded.filter(touchesEdge);
  const edgeScore = edgeNeeded.length ? edgeOk.length / edgeNeeded.length : 1;
  const misplaced = edgeNeeded.filter((p) => !touchesEdge(p));
  if (misplaced.length > 0) {
    const names = [...new Set(misplaced.map((p) => getBlock(p.blockId).name))].slice(0, 3);
    issues.push({ tone: "warn", title: "Kenarda olması gereken bloklar içeride", body: `${names.join(", ")} die'ın ortasında duruyor. Bu bloklar dış dünyaya fiziksel bağlantı kurar; kenarda olmazlarsa sinyalleri tüm die'ı katetmek zorunda kalır.` });
  } else if (edgeNeeded.length >= 3) {
    wins.push({ title: "I/O ve bellek arayüzleri kenarda", body: "Dış bağlantısı olan blokların hepsi die kenarında. Sinyal yolları kısa." });
  }

  const heat = new Map();
  for (const p of placed) {
    const b = getBlock(p.blockId);
    const perCell = (b.power * node.powerMul) / (b.w * b.h);
    for (const [x, y] of cellsOfPlaced(p)) heat.set(`${x},${y}`, perCell / node.cellArea);
  }
  let maxWindow = 0, hotSpot = null;
  for (const key of occ.keys()) {
    const [cx, cy] = key.split(",").map(Number);
    let sum = 0, inGrid = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS) continue;
      inGrid++; sum += heat.get(`${x},${y}`) || 0;
    }
    const avg = inGrid ? sum / inGrid : 0;
    if (avg > maxWindow) { maxWindow = avg; hotSpot = [cx, cy]; }
  }
  const thermalScore = Math.max(0, Math.min(1, (2.2 - maxWindow) / 1.4));
  if (maxWindow > 1.4) issues.push({ tone: "warn", title: "Sıcak nokta oluşmuş", body: `Die üzerinde yerel güç yoğunluğu ${maxWindow.toFixed(2)} W/mm²'ye ulaşıyor. Aralarına cache gibi soğuk bloklar serpiştirmeyi dene.` });
  else if (placed.length > 8 && maxWindow < 0.9) wins.push({ title: "Isı dengeli dağılmış", body: `En sıcak bölgede bile ${maxWindow.toFixed(2)} W/mm² — güçlü bloklar die'a yayılmış.` });

  let adjChecks = 0, adjOk = 0;
  const lonelyCache = [], lonelyFixed = [];
  for (const p of placed) {
    const nb = [...neighborsOf(p, occ)].map((id) => byId.get(id)?.blockId).filter(Boolean);
    if (CACHE_BLOCKS.has(p.blockId)) { adjChecks++; if (nb.some((id) => COMPUTE_BLOCKS.has(id) || CACHE_BLOCKS.has(id))) adjOk++; else lonelyCache.push(getBlock(p.blockId).name); }
    if (NEEDS_SM.has(p.blockId)) { adjChecks++; if (nb.includes("sm")) adjOk++; else lonelyFixed.push(getBlock(p.blockId).name); }
    if (p.blockId === "tensor") { adjChecks++; if (nb.some((id) => id === "scratchpad" || id === "sm" || CACHE_BLOCKS.has(id))) adjOk++; }
  }
  const adjacencyScore = adjChecks ? adjOk / adjChecks : 1;
  if (lonelyCache.length >= 2) issues.push({ tone: "info", title: "Cache çekirdeklerden uzak", body: `${lonelyCache.length} cache bloğu hiçbir hesap birimine komşu değil.` });
  if (lonelyFixed.length >= 2) issues.push({ tone: "info", title: "Sabit fonksiyon birimleri SM'den kopuk", body: `${lonelyFixed.join(", ")} hiçbir SM kümesine komşu değil.` });
  if (adjChecks >= 4 && adjacencyScore >= 0.85) wins.push({ title: "Yakınlık ilişkileri doğru", body: "Cache'ler çekirdeklerin yanında, sabit fonksiyon birimleri SM'lere komşu." });

  const groups = {};
  for (const p of placed) if (COMPUTE_BLOCKS.has(p.blockId)) (groups[p.blockId] = groups[p.blockId] || []).push(p);
  let clusterChecks = 0, clusterOk = 0; const scattered = [];
  for (const [blockId, list] of Object.entries(groups)) {
    if (list.length < 3) continue;
    let ok = 0;
    for (const p of list) { const nb = [...neighborsOf(p, occ)].map((id) => byId.get(id)?.blockId); if (nb.includes(blockId)) ok++; }
    clusterChecks += list.length; clusterOk += ok;
    if (ok / list.length < 0.5) scattered.push(getBlock(blockId).name);
  }
  const clusteringScore = clusterChecks ? clusterOk / clusterChecks : 1;
  if (scattered.length > 0) issues.push({ tone: "info", title: "Hesap blokları dağınık", body: `${scattered.join(", ")} die üzerine serpiştirilmiş.` });
  else if (clusterChecks >= 4) wins.push({ title: "Hesap blokları düzenli kümelenmiş", body: "Aynı tip birimler bir arada duruyor." });

  let holes = 0;
  for (let y = 0; y < GRID_ROWS; y++) for (let x = 0; x < GRID_COLS; x++) {
    if (occ.has(`${x},${y}`)) continue;
    let filled = 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= GRID_COLS || ny >= GRID_ROWS) filled++;
      else if (occ.has(`${nx},${ny}`)) filled++;
    }
    if (filled >= 3) holes++;
  }
  const tolerance = Math.max(6, occ.size * 0.25);
  const compactness = Math.max(0, Math.min(1, 1 - holes / tolerance));
  if (holes > tolerance * 0.5 && placed.length > 5) issues.push({ tone: "info", title: "Sıkışmış boşluklar var", body: `Blokların arasında ${holes} hücre kullanılamıyor.` });
  else if (holes === 0 && placed.length > 6) wins.push({ title: "Boşa giden hücre yok", body: "Yerleşim düzenli hizalanmış." });

  const parts = { edge: edgeScore, thermal: thermalScore, adjacency: adjacencyScore, clustering: clusteringScore, compactness };
  const score = Math.round((edgeScore*0.25 + thermalScore*0.25 + adjacencyScore*0.2 + clusteringScore*0.15 + compactness*0.15) * 100);
  return { score, parts, issues, wins, heat, maxHeat: maxWindow, hotSpot };
}

export const FLOORPLAN_PARTS = [
  { key: "edge", label: "Kenar yerleşimi", hint: "I/O, bellek ve pad blokları die kenarında mı?" },
  { key: "thermal", label: "Isı dağılımı", hint: "Güçlü bloklar tek noktada yığılmış mı?" },
  { key: "adjacency", label: "Yakınlık", hint: "Cache çekirdeğe, RT/ROP birimleri SM'e komşu mu?" },
  { key: "clustering", label: "Kümelenme", hint: "Aynı tip hesap birimleri düzenli dizilmiş mi?" },
  { key: "compactness", label: "Hizalama", hint: "Blokların arasında sıkışıp kullanılamaz kalan boşluk var mı?" },
];

function fitsAt(occ, block, x, y) {
  if (x < 0 || y < 0 || x + block.w > GRID_COLS || y + block.h > GRID_ROWS) return false;
  for (let dy = 0; dy < block.h; dy++) for (let dx = 0; dx < block.w; dx++) if (occ.has(`${x+dx},${y+dy}`)) return false;
  return true;
}
export function placementTip(blockId) {
  if (EDGE_BLOCKS.has(blockId)) return { short: "Kenara koy", text: "Bu blok dış dünyaya fiziksel bağlantı kurar." };
  if (NEEDS_SM.has(blockId)) return { short: "SM'e komşu koy", text: "Bu birim SM kümeleriyle sürekli veri alışverişi yapar." };
  if (blockId === "tensor") return { short: "Scratchpad veya SM yanına", text: "Matris birimleri veriye aç gözlüdür." };
  if (CACHE_BLOCKS.has(blockId)) return { short: "Çekirdeğe komşu koy", text: "Cache'in anlamı çekirdeğe yakın olmasıdır." };
  if (COMPUTE_BLOCKS.has(blockId)) return { short: "Kümele, ama ısıyı yayma", text: "Aynı tip birimleri bir arada tut ama tek noktaya yığma." };
  return { short: "Serbest", text: "Bu blok için katı bir konum kuralı yok." };
}
export function placementHints(placed, blockId, node) {
  const block = getBlock(blockId);
  const zones = new Map();
  if (!block) return { zones, tip: placementTip(blockId) };
  const occ = buildOccupancy(placed);
  const byId = new Map(placed.map((p) => [p.id, p]));
  const heat = new Map();
  for (const p of placed) {
    const b = getBlock(p.blockId);
    const perCell = (b.power * node.powerMul) / (b.w * b.h);
    for (const [x, y] of cellsOfPlaced(p)) heat.set(`${x},${y}`, perCell / node.cellArea);
  }
  const newDensity = (block.power * node.powerMul) / (block.w * block.h) / node.cellArea;
  const wantsEdge = EDGE_BLOCKS.has(blockId), wantsSm = NEEDS_SM.has(blockId), wantsCompute = CACHE_BLOCKS.has(blockId),
        wantsFeed = blockId === "tensor", wantsCluster = COMPUTE_BLOCKS.has(blockId);

  for (let y = 0; y < GRID_ROWS; y++) for (let x = 0; x < GRID_COLS; x++) {
    if (!fitsAt(occ, block, x, y)) continue;
    const probe = { id: -1, blockId, x, y };
    const nbTypes = [...neighborsOf(probe, occ)].map((id) => byId.get(id)?.blockId).filter(Boolean);
    let ideal = false;
    if (wantsEdge) ideal = x === 0 || y === 0 || x+block.w === GRID_COLS || y+block.h === GRID_ROWS;
    else if (wantsSm) ideal = nbTypes.includes("sm");
    else if (wantsFeed) ideal = nbTypes.some((t) => t === "scratchpad" || t === "sm" || CACHE_BLOCKS.has(t));
    else if (wantsCompute) ideal = nbTypes.some((t) => COMPUTE_BLOCKS.has(t));
    else if (wantsCluster) ideal = nbTypes.includes(blockId);

    let hot = false;
    if (newDensity > 0.15) {
      let worst = 0;
      for (let dy = 0; dy < block.h; dy++) for (let dx = 0; dx < block.w; dx++) {
        const cx = x+dx, cy = y+dy; let sum = 0, inGrid = 0;
        for (let wy = -1; wy <= 1; wy++) for (let wx = -1; wx <= 1; wx++) {
          const nx = cx+wx, ny = cy+wy;
          if (nx<0||ny<0||nx>=GRID_COLS||ny>=GRID_ROWS) continue;
          inGrid++;
          const insideNew = nx>=x && nx<x+block.w && ny>=y && ny<y+block.h;
          sum += insideNew ? newDensity : (heat.get(`${nx},${ny}`) || 0);
        }
        worst = Math.max(worst, inGrid ? sum/inGrid : 0);
      }
      hot = worst > 1.4;
    }
    if (hot) zones.set(`${x},${y}`, "hot");
    else if (ideal) zones.set(`${x},${y}`, "ideal");
  }
  return { zones, tip: placementTip(blockId) };
}
