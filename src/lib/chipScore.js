/** Gerçek chip'ler için spec türevli tasarım puanı — sınıf içi normalize. */
import { chips } from "@/data/chips";
import { isMultiDie, parseArea, parseBandwidth, parseTransistors, parseWatts } from "@/lib/specDecoder";

function num(v) { if (typeof v === "number") return v; if (typeof v !== "string") return null;
  const m = v.replace(/\./g, "").match(/([\d]+(?:,\d+)?)/); if (!m) return null;
  const n = parseFloat(m[1].replace(",", ".")); return Number.isNaN(n) ? null : n; }
function mb(v) { if (v==null) return null; const s=String(v);
  const gb = s.match(/([\d.,]+)\s*GB/i); if (gb) return parseFloat(gb[1].replace(",", ".")) * 1024;
  const m = s.match(/([\d.,]+)\s*MB/i); return m ? parseFloat(m[1].replace(",", ".")) : null; }
function gb(v) { if (v==null) return null; const m = String(v).match(/([\d.,]+)\s*GB/i); return m ? parseFloat(m[1].replace(",", ".")) : null; }
function ghz(v) { if (v==null) return null; const s=String(v);
  const g = s.match(/([\d.,]+)\s*GHz/i); if (g) return parseFloat(g[1].replace(",", "."));
  const m = s.match(/([\d.,]+)\s*MHz/i); return m ? parseFloat(m[1].replace(",", "."))/1000 : null; }
function tflops(v) { if (v==null) return null; const s=String(v);
  const p = s.match(/([\d.,]+)\s*PFLOPS/i); if (p) return parseFloat(p[1].replace(",", "."))*1000;
  const t = s.match(/([\d.,]+)\s*TFLOPS/i); if (t) return parseFloat(t[1].replace(",", "."));
  const bare = parseFloat(String(v).replace(",", ".")); return Number.isNaN(bare) ? null : bare; }
function rate(v) { if (v==null) return null; const s=String(v);
  const g = s.match(/([\d.,]+)\s*Gbps/i); if (g) return parseFloat(g[1].replace(",", "."));
  const m = s.match(/([\d.,]+)\s*MT\/s/i); if (m) return parseFloat(m[1].replace(",", "."))/1000; return null; }
function bits(v) { if (v==null) return null; const m = String(v).match(/([\d]+)\s*-?\s*bit/i); return m ? parseInt(m[1],10) : null; }

export const CLASS_LABELS = { GPU:"Tüketici GPU", AI:"AI Hızlandırıcı", CPU:"Masaüstü / Sunucu CPU", SOC:"Mobil SoC", RAM:"Bellek" };
const ASPIRATIONAL = /roadmap|advanced|gelişmiş|beklenen|rumored|söylenti|hedef|tbd|planlanan/i;
function pick(chip, pattern, parser) {
  let best = null;
  for (const [key, value] of Object.entries(chip.key_specs || {})) {
    if (!pattern.test(key)) continue; if (ASPIRATIONAL.test(key)) continue;
    const v = parser(value); if (typeof v === "number" && Number.isFinite(v) && (best===null||v>best)) best = v;
  }
  return best;
}
function specText(chip) { return Object.values(chip.key_specs || {}).map((v)=>String(v)).join(" | "); }
const P = { shaders:/cuda_cores|stream_processors|shader/i, computeUnits:/^compute_units$/i, bandwidth:/bandwidth/i,
  perDeviceBw:/per_device|per_stack|per_channel|per_module/i, vram:/vram|unified_memory|memory_capacity/i,
  cache:/l3_cache|l2_cache|^cache$/i, l3:/l3_cache/i, cores:/^cores$|total_cores|cpu_cores|max_desktop_cores/i,
  clock:/boost_clock|clock/i, memRate:/memory_speed|speed_range|max_speed|pin_speed|data_rate|^speed$|memory_support/i,
  npu:/npu_tops|npu/i, width:/memory_interface|channel_width|bus_width|width/i,
  capacity:/capacity_per_module|max_module_capacity|max_die_capacity|capacity_per_die|^capacity$/i, tdp:/tdp/i };
function tdpOf(chip) { return pick(chip, P.tdp, parseWatts); }

export function classOf(chip) {
  if (chip.category === "RAM") return "RAM";
  const text = specText(chip);
  if (chip.category === "GPU") { if (/HBM/i.test(text) || /SXM|OAM|NVL|HGX|GB\d00/i.test(text)) return "AI"; return "GPU"; }
  const tdp = tdpOf(chip);
  if (tdp !== null && tdp > 130) return "CPU";
  const hasNpu = /npu|neural engine|hexagon/i.test(text);
  const lowPower = /LPDDR|paket üstü|birleşik bellek|unified/i.test(text);
  if (lowPower) return "SOC";
  if (tdp !== null && tdp <= 60) return "SOC";
  if (tdp === null && hasNpu) return "SOC";
  return "CPU";
}
const RUBRICS = {
  GPU: [
    { key:"shaders", label:"Hesap birimi", weight:0.28, get:(c)=>{const d=pick(c,P.shaders,num); if(d) return d; const cu=pick(c,P.computeUnits,num); return cu?cu*64:null;} },
    { key:"bw", label:"Bellek bant genişliği", weight:0.24, get:(c)=>pick(c,P.bandwidth,parseBandwidth) },
    { key:"vram", label:"VRAM kapasitesi", weight:0.16, get:(c)=>pick(c,P.vram,gb) },
    { key:"cache", label:"Cache", weight:0.1, get:(c)=>pick(c,P.cache,mb) },
    { key:"density", label:"Transistör yoğunluğu", weight:0.1, get:densityOf },
    { key:"eff", label:"Verimlilik (hesap/W)", weight:0.12, get:(c)=>{const sh=pick(c,P.shaders,num) ?? (pick(c,P.computeUnits,num)||0)*64; const w=tdpOf(c); return sh&&w?sh/w:null;} },
  ],
  AI: [
    { key:"bw", label:"Bellek bant genişliği", weight:0.28, get:(c)=>pick(c,P.bandwidth,parseBandwidth) },
    { key:"vram", label:"Bellek kapasitesi", weight:0.26, get:(c)=>pick(c,P.vram,gb) },
    { key:"compute", label:"Tepe AI hesabı", weight:0.22, get:(c)=>tflops(c.key_specs.fp4_tflops) ?? tflops(c.key_specs.fp8_tflops) ?? tflops(c.key_specs.fp16_tflops) },
    { key:"eff", label:"Verimlilik (GB/s/W)", weight:0.12, get:(c)=>{const b=pick(c,P.bandwidth,parseBandwidth); const w=tdpOf(c); return b&&w?b/w:null;} },
    { key:"cache", label:"Cache", weight:0.06, get:(c)=>pick(c,P.cache,mb) },
    { key:"density", label:"Transistör yoğunluğu", weight:0.06, get:densityOf },
  ],
  CPU: [
    { key:"cores", label:"Çekirdek sayısı", weight:0.26, get:(c)=>pick(c,P.cores,num) },
    { key:"clock", label:"Boost saat hızı", weight:0.16, get:(c)=>pick(c,P.clock,ghz) },
    { key:"l3", label:"L3 cache", weight:0.18, get:(c)=>pick(c,P.l3,mb) },
    { key:"mem", label:"Bellek hızı", weight:0.1, get:(c)=>pick(c,P.memRate,rate) },
    { key:"eff", label:"Verimlilik (çekirdek×GHz/W)", weight:0.16, get:(c)=>{const n=pick(c,P.cores,num); const g=pick(c,P.clock,ghz); const w=tdpOf(c); return n&&g&&w?(n*g)/w:null;} },
    { key:"density", label:"Transistör yoğunluğu", weight:0.14, get:densityOf },
  ],
  SOC: [
    { key:"cores", label:"Çekirdek sayısı", weight:0.18, get:(c)=>pick(c,P.cores,num) },
    { key:"clock", label:"Boost saat hızı", weight:0.12, get:(c)=>pick(c,P.clock,ghz) },
    { key:"npu", label:"NPU (TOPS)", weight:0.18, get:(c)=>pick(c,P.npu,num) },
    { key:"bw", label:"Bellek bant genişliği", weight:0.16, get:(c)=>pick(c,P.bandwidth,parseBandwidth) },
    { key:"eff", label:"Verimlilik (çekirdek×GHz/W)", weight:0.22, get:(c)=>{const n=pick(c,P.cores,num); const g=pick(c,P.clock,ghz); const w=tdpOf(c); return n&&g&&w?(n*g)/w:null;} },
    { key:"cache", label:"Cache", weight:0.14, get:(c)=>pick(c,P.cache,mb) },
  ],
  RAM: [
    { key:"bw", label:"Bant genişliği (cihaz başına)", weight:0.4, get:(c)=>{const p=pick(c,P.perDeviceBw,parseBandwidth); if(p) return p; const w=pick(c,P.width,bits); const r=pick(c,P.memRate,rate); if(w&&r) return (w*r)/8; return pick(c,P.bandwidth,parseBandwidth);} },
    { key:"rate", label:"Veri hızı (Gbps/pin)", weight:0.25, get:(c)=>pick(c,P.memRate,rate) },
    { key:"cap", label:"Kapasite", weight:0.2, get:(c)=>pick(c,P.capacity,gb) },
    { key:"width", label:"Arayüz genişliği", weight:0.15, get:(c)=>pick(c,P.width,bits) },
  ],
};
function densityOf(chip) { if (isMultiDie(chip)) return null; const tr=parseTransistors(chip.transistor_count); const area=parseArea(chip.die_size); return tr&&area?tr/1e6/area:null; }

const ANCHORS = (() => {
  const out = {};
  for (const [cls, rubric] of Object.entries(RUBRICS)) {
    const members = chips.filter((c) => classOf(c) === cls);
    out[cls] = {};
    for (const metric of rubric) {
      let max = 0;
      for (const c of members) { const v = metric.get(c); if (typeof v==="number" && Number.isFinite(v) && v>max) max=v; }
      out[cls][metric.key] = max || 1;
    }
  }
  return out;
})();
const cache = new Map();
export function scoreChip(chip) {
  if (cache.has(chip.id)) return cache.get(chip.id);
  const cls = classOf(chip); const rubric = RUBRICS[cls]; const anchors = ANCHORS[cls];
  const parts = []; const missing = []; let weightSum = 0, total = 0;
  for (const metric of rubric) {
    const raw = metric.get(chip);
    if (typeof raw !== "number" || !Number.isFinite(raw)) { missing.push(metric.label); continue; }
    const norm = Math.max(0, Math.min(1, raw/anchors[metric.key]));
    parts.push({ key: metric.key, label: metric.label, raw, norm, weight: metric.weight });
    weightSum += metric.weight; total += norm*metric.weight;
  }
  const MIN_COVERAGE = 0.4;
  const score = weightSum >= MIN_COVERAGE ? Math.round((total/weightSum)*100) : null;
  const reason = score===null ? (weightSum===0 ? "Bu girdi için sayısal spec verisi yok — puanlanamaz." : "Açıklanmış veri bu sınıfın ölçütlerinin çoğunu karşılamıyor.") : null;
  const result = { score, reason, cls, clsLabel: CLASS_LABELS[cls], parts: parts.sort((a,b)=>b.weight-a.weight), missing, coverage: Math.round(weightSum*100) };
  cache.set(chip.id, result);
  return result;
}
export function rankInClass(chip) {
  const cls = classOf(chip);
  const peers = chips.filter((c)=>classOf(c)===cls).map((c)=>({id:c.id, score:scoreChip(c).score ?? -1})).sort((a,b)=>b.score-a.score);
  const index = peers.findIndex((p)=>p.id===chip.id);
  return { rank: index+1, total: peers.length };
}
