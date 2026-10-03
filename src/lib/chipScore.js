/** Gerçek chip'ler için spec türevli tasarım puanı — sınıf içi normalize. */
import { chips } from "@/data/chips";
import { isMultiDie, parseArea, parseBandwidth, parseTransistors, parseWatts } from "@/lib/specDecoder";

// ─── Sayısal parser'lar ───────────────────────────────────────────────────────

/** İlk sayısal değeri yakalar ("16384 CUDA", "20480", "2048" hepsi çalışır). */
function num(v) {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return null;
  const m = v.replace(/\./g, "").match(/([\d]+(?:,\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

/** MB cinsinden cache; "48 MB" veya "98304 KB" gibi değerleri parse eder. */
function mb(v) {
  if (v == null) return null;
  const s = String(v);
  const kb = s.match(/([\d.,]+)\s*KB/i);
  if (kb) return parseFloat(kb[1].replace(",", ".")) / 1024;
  const gb_ = s.match(/([\d.,]+)\s*GB/i);
  if (gb_) return parseFloat(gb_[1].replace(",", ".")) * 1024;
  const m = s.match(/([\d.,]+)\s*MB/i);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

/** GB cinsinden bellek ("24 GB GDDR6X", "288 GB HBM3E", "480 GB"). */
function gb(v) {
  if (v == null) return null;
  const m = String(v).match(/([\d.,]+)\s*GB/i);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

/** GHz cinsinden saat hızı. */
function ghz(v) {
  if (v == null) return null;
  const s = String(v);
  const g = s.match(/([\d.,]+)\s*GHz/i);
  if (g) return parseFloat(g[1].replace(",", "."));
  const mhz = s.match(/([\d.,]+)\s*MHz/i);
  return mhz ? parseFloat(mhz[1].replace(",", ".")) / 1000 : null;
}

/** TFLOPS değeri ("3958 TFLOPS", "15 PFLOPS", "1979 TF" gibi). */
function tflops(v) {
  if (v == null) return null;
  const s = String(v);
  const p = s.match(/([\d.,]+)\s*PFLOPS/i);
  if (p) return parseFloat(p[1].replace(",", ".")) * 1000;
  const t = s.match(/([\d.,]+)\s*TFLOPS?/i);
  if (t) return parseFloat(t[1].replace(",", "."));
  const bare = parseFloat(String(v).replace(",", "."));
  return Number.isNaN(bare) ? null : bare;
}

/**
 * Gbps cinsinden bellek veri hızı.
 * Desteklenen formatlar:
 *   "21 Gbps", "21000 MT/s", "DDR5-5600", "LPDDR5X-8533", "LPDDR5X-9600",
 *   "DDR5-6400 (MRDIMM)", "LPDDR5X-8000, 256-bit"
 */
function rate(v) {
  if (v == null) return null;
  const s = String(v);
  // Doğrudan Gbps veya MT/s
  const gbps = s.match(/([\d.,]+)\s*Gbps/i);
  if (gbps) return parseFloat(gbps[1].replace(",", "."));
  const mts = s.match(/([\d.,]+)\s*MT\/s/i);
  if (mts) return parseFloat(mts[1].replace(",", ".")) / 1000;
  // DDR4-3200, DDR5-5600, LPDDR5X-8533, vb. — tire sonrası MT/s değeri
  const ddr = s.match(/(?:DDR|LPDDR|HBM|GDDR)\d[EX]?-?X?\s*-\s*([\d]+)/i);
  if (ddr) return parseFloat(ddr[1]) / 1000;
  // "5600 (JEDEC)" gibi salt sayı+parantez
  const bare = s.match(/\b([\d]{4,5})\b/);
  if (bare) return parseFloat(bare[1]) / 1000;
  return null;
}

/** Bit cinsinden arayüz genişliği. */
function bits(v) {
  if (v == null) return null;
  const m = String(v).match(/([\d]+)\s*-?\s*bit/i);
  return m ? parseInt(m[1], 10) : null;
}

// ─── Yardımcı pick() ─────────────────────────────────────────────────────────

const ASPIRATIONAL = /roadmap|advanced|gelişmiş|beklenen|rumored|söylenti|hedef|tbd|planlanan/i;

/**
 * chip.key_specs içindeki tüm key'leri pattern ile tarar,
 * her birini parser ile parse eder ve en yüksek sonucu döndürür.
 */
function pick(chip, pattern, parser) {
  let best = null;
  for (const [key, value] of Object.entries(chip.key_specs || {})) {
    if (!pattern.test(key)) continue;
    if (ASPIRATIONAL.test(key)) continue;
    const v = parser(value);
    if (typeof v === "number" && Number.isFinite(v) && (best === null || v > best)) best = v;
  }
  return best;
}

/** Tüm key_spec değerlerini birleştirip sınıf tespitinde kullanmak için. */
function specText(chip) {
  return Object.values(chip.key_specs || {}).map((v) => String(v)).join(" | ");
}

// ─── Regex pattern'ları ───────────────────────────────────────────────────────
const P = {
  // GPU shader sayısı: NVIDIA cuda_cores, AMD stream_processors, Apple gpu_cores
  shaders:     /^cuda_cores$|^stream_processors$|^shader_processors$/i,
  // GPU/AI compute birimleri (SM, CU, XCD) — sadece fallback olarak
  computeUnits:/^compute_units$/i,
  // Bellek bant genişliği ("memory_bandwidth", "bandwidth")
  bandwidth:   /bandwidth/i,
  // Cihaz başına bant genişliği (RAM için)
  perDeviceBw: /per_device|per_stack|per_channel|per_module/i,
  // VRAM / unified memory — "max_unified_memory" dahil
  vram:        /^vram$|unified_memory|max_unified_memory|memory_capacity|^memory$/i,
  // Cache
  cache:       /l3_cache|l2_cache|^cache$/i,
  l3:          /l3_cache/i,
  // CPU çekirdek sayısı
  cores:       /^cores$|total_cores|cpu_cores|max_desktop_cores/i,
  // Boost saat — "boost_clock" ve "clock" ama "memory_clock"'u alma
  clock:       /^boost_clock$|^base_clock$|^clock$/i,
  // Bellek veri hızı
  memRate:     /memory_speed|speed_range|max_speed|pin_speed|data_rate|^speed$|memory_support/i,
  // NPU TOPS
  npu:         /npu_tops|^npu$/i,
  // Arayüz bit genişliği
  width:       /memory_interface|channel_width|bus_width|^width$/i,
  // Modül/die kapasitesi (RAM için)
  capacity:    /capacity_per_module|max_module_capacity|max_die_capacity|capacity_per_die|^capacity$/i,
  // TDP
  tdp:         /^tdp$/i,
  // Apple gpu_cores ("gpu_cores": 40 — M4 Max GPU gibi)
  gpuCores:    /^gpu_cores$/i,
};

function tdpOf(chip) { return pick(chip, P.tdp, parseWatts); }

// ─── Sınıflandırma ───────────────────────────────────────────────────────────

export const CLASS_LABELS = {
  GPU: "Tüketici GPU",
  AI:  "AI Hızlandırıcı",
  CPU: "Masaüstü / Sunucu CPU",
  SOC: "Mobil SoC",
  RAM: "Bellek",
};

export function classOf(chip) {
  if (chip.category === "RAM") return "RAM";
  const text = specText(chip);
  if (chip.category === "GPU") {
    // HBM veya veri merkezi kimliği → AI hızlandırıcı
    if (/HBM/i.test(text) || /SXM|OAM|NVL|HGX|GB\d00/i.test(text)) return "AI";
    return "GPU";
  }
  const tdp = tdpOf(chip);
  if (tdp !== null && tdp > 130) return "CPU";
  const hasNpu = /npu|neural engine|hexagon/i.test(text);
  const lowPower = /LPDDR|paket üstü|birleşik bellek|unified/i.test(text);
  if (lowPower) return "SOC";
  if (tdp !== null && tdp <= 60) return "SOC";
  if (tdp === null && hasNpu) return "SOC";
  return "CPU";
}

// ─── Yoğunluk hesabı ─────────────────────────────────────────────────────────

function densityOf(chip) {
  if (isMultiDie(chip)) return null;
  const tr = parseTransistors(chip.transistor_count);
  const area = parseArea(chip.die_size);
  return tr && area ? tr / 1e6 / area : null;
}

// ─── GPU shader getter — üretici farkını gözetir ─────────────────────────────

/**
 * Gerçek shader/işlemci sayısını döndürür.
 * NVIDIA: cuda_cores doğrudan sayı.
 * AMD: stream_processors doğrudan sayı.
 * Apple: gpu_cores (M-serisi çekirdek sayısı), 128 EU/çekirdek ile dönüştürülür.
 * Intel Arc Xe2: compute_units, Xe2'de 1 CU ≈ 512 EU; ancak GPU sınıfında çok
 *   az Intel chip var; compute_units'i doğrudan karşılaştırılabilir birim olarak al.
 * Fallback: compute_units sayısı — karşılaştırmalı olarak kullanılır ama çoğu
 *   NVIDIA/AMD chipte cuda_cores/stream_processors var, buraya düşmez.
 */
function shaderGet(chip) {
  // 1. Doğrudan shader sayısı (NVIDIA, AMD)
  const direct = pick(chip, P.shaders, num);
  if (direct !== null) return direct;
  // 2. Apple gpu_cores — 1 Apple GPU çekirdeği ≈ 128 ALU birimi
  const appleGpu = pick(chip, P.gpuCores, num);
  if (appleGpu !== null) return appleGpu * 128;
  // 3. compute_units fallback (Intel Xe, diğer)
  const cu = pick(chip, P.computeUnits, num);
  return cu !== null ? cu : null;
}

/**
 * GPU verimliliği: shader başına değil, watt başına shader.
 * Apple GPU'ları için gpu_cores × 128 / TDP.
 */
function gpuEffGet(chip) {
  const sh = shaderGet(chip);
  const w = tdpOf(chip);
  return sh && w ? sh / w : null;
}

// ─── VRAM getter — "max_unified_memory" dahil ─────────────────────────────────

function vramGet(chip) {
  // Önce standart pattern
  const v = pick(chip, P.vram, gb);
  if (v !== null) return v;
  // Apple M-serisi: key "max_unified_memory" yerine değer içinde geçebilir
  for (const [key, value] of Object.entries(chip.key_specs || {})) {
    if (/unified|memory/i.test(key) && /\d+\s*GB/i.test(String(value))) {
      const r = gb(value);
      if (r !== null) return r;
    }
  }
  return null;
}

// ─── AI compute getter ────────────────────────────────────────────────────────

/**
 * AI hesap gücünü TFLOPS cinsinden döndürür.
 * Öncelik: FP4 > FP8 > FP16 > BF16 > FP32.
 * "beklenen" / "tahmini" değerleri ASPIRATIONAL filtresiyle atlar.
 */
function aiComputeGet(chip) {
  const ks = chip.key_specs || {};
  const order = ["fp4_tflops", "fp8_tflops", "fp16_tflops", "bf16_tflops", "fp32_tflops"];
  for (const key of order) {
    if (!ks[key]) continue;
    if (ASPIRATIONAL.test(String(ks[key]))) continue;
    const v = tflops(ks[key]);
    if (v !== null) return v;
  }
  return null;
}

// ─── Rubric tabloları ─────────────────────────────────────────────────────────

const RUBRICS = {
  GPU: [
    {
      key: "shaders", label: "Hesap birimi (shader/ALU)", weight: 0.28,
      get: shaderGet,
    },
    {
      key: "bw", label: "Bellek bant genişliği", weight: 0.24,
      get: (c) => pick(c, P.bandwidth, parseBandwidth),
    },
    {
      key: "vram", label: "VRAM / Unified Memory", weight: 0.18,
      get: vramGet,
    },
    {
      key: "cache", label: "Cache", weight: 0.08,
      get: (c) => pick(c, P.cache, mb),
    },
    {
      key: "density", label: "Transistör yoğunluğu", weight: 0.10,
      get: densityOf,
    },
    {
      key: "eff", label: "Verimlilik (hesap/W)", weight: 0.12,
      get: gpuEffGet,
    },
  ],

  AI: [
    {
      key: "bw", label: "Bellek bant genişliği", weight: 0.28,
      get: (c) => pick(c, P.bandwidth, parseBandwidth),
    },
    {
      key: "vram", label: "Bellek kapasitesi", weight: 0.24,
      get: vramGet,
    },
    {
      key: "compute", label: "Tepe AI hesabı (TFLOPS)", weight: 0.24,
      get: aiComputeGet,
    },
    {
      key: "eff", label: "Verimlilik (GB/s/W)", weight: 0.14,
      get: (c) => {
        const b = pick(c, P.bandwidth, parseBandwidth);
        const w = tdpOf(c);
        return b && w ? b / w : null;
      },
    },
    {
      key: "cache", label: "Cache", weight: 0.05,
      get: (c) => pick(c, P.cache, mb),
    },
    {
      key: "density", label: "Transistör yoğunluğu", weight: 0.05,
      get: densityOf,
    },
  ],

  CPU: [
    {
      key: "cores", label: "Çekirdek sayısı", weight: 0.26,
      get: (c) => pick(c, P.cores, num),
    },
    {
      key: "clock", label: "Boost saat hızı", weight: 0.16,
      get: (c) => pick(c, P.clock, ghz),
    },
    {
      key: "l3", label: "L3 cache", weight: 0.18,
      get: (c) => pick(c, P.l3, mb),
    },
    {
      key: "mem", label: "Bellek hızı (Gbps/pin)", weight: 0.10,
      // rate() artık DDR5-5600 ve LPDDR5X-8533 formatlarını da parse ediyor
      get: (c) => pick(c, P.memRate, rate),
    },
    {
      key: "eff", label: "Verimlilik (çekirdek×GHz/W)", weight: 0.16,
      get: (c) => {
        const n = pick(c, P.cores, num);
        const g = pick(c, P.clock, ghz);
        const w = tdpOf(c);
        return n && g && w ? (n * g) / w : null;
      },
    },
    {
      key: "density", label: "Transistör yoğunluğu", weight: 0.14,
      get: densityOf,
    },
  ],

  SOC: [
    {
      key: "cores", label: "Çekirdek sayısı", weight: 0.16,
      get: (c) => pick(c, P.cores, num),
    },
    {
      key: "clock", label: "Boost saat hızı", weight: 0.10,
      get: (c) => pick(c, P.clock, ghz),
    },
    {
      key: "npu", label: "NPU (TOPS)", weight: 0.22,
      get: (c) => pick(c, P.npu, num),
    },
    {
      key: "bw", label: "Bellek bant genişliği", weight: 0.20,
      get: (c) => pick(c, P.bandwidth, parseBandwidth),
    },
    {
      key: "vram", label: "Unified Memory", weight: 0.14,
      get: vramGet,
    },
    {
      key: "eff", label: "Verimlilik (çekirdek×GHz/W)", weight: 0.18,
      get: (c) => {
        const n = pick(c, P.cores, num);
        const g = pick(c, P.clock, ghz);
        const w = tdpOf(c);
        return n && g && w ? (n * g) / w : null;
      },
    },
  ],

  RAM: [
    {
      key: "bw", label: "Bant genişliği (cihaz başına)", weight: 0.40,
      get: (c) => {
        const p = pick(c, P.perDeviceBw, parseBandwidth);
        if (p) return p;
        // bit genişliği × veri hızı → GB/s
        const w = pick(c, P.width, bits);
        const r = pick(c, P.memRate, rate);
        if (w && r) return (w * r) / 8;
        return pick(c, P.bandwidth, parseBandwidth);
      },
    },
    {
      key: "rate", label: "Veri hızı (Gbps/pin)", weight: 0.25,
      get: (c) => pick(c, P.memRate, rate),
    },
    {
      key: "cap", label: "Kapasite", weight: 0.20,
      get: (c) => pick(c, P.capacity, gb),
    },
    {
      key: "width", label: "Arayüz genişliği", weight: 0.15,
      get: (c) => pick(c, P.width, bits),
    },
  ],
};

// ─── ANCHORS: sınıf içi maksimum (normalize için referans) ────────────────────

const ANCHORS = (() => {
  const out = {};
  for (const [cls, rubric] of Object.entries(RUBRICS)) {
    const members = chips.filter((c) => classOf(c) === cls);
    out[cls] = {};
    for (const metric of rubric) {
      let max = 0;
      for (const c of members) {
        const v = metric.get(c);
        if (typeof v === "number" && Number.isFinite(v) && v > max) max = v;
      }
      out[cls][metric.key] = max || 1;
    }
  }
  return out;
})();

// ─── Ana puanlama fonksiyonu ──────────────────────────────────────────────────

const _cache = new Map();

export function scoreChip(chip) {
  if (_cache.has(chip.id)) return _cache.get(chip.id);
  const cls = classOf(chip);
  const rubric = RUBRICS[cls];
  const anchors = ANCHORS[cls];
  const parts = [];
  const missing = [];
  let weightSum = 0, total = 0;

  for (const metric of rubric) {
    const raw = metric.get(chip);
    if (typeof raw !== "number" || !Number.isFinite(raw)) {
      missing.push(metric.label);
      continue;
    }
    const norm = Math.max(0, Math.min(1, raw / anchors[metric.key]));
    parts.push({ key: metric.key, label: metric.label, raw, norm, weight: metric.weight });
    weightSum += metric.weight;
    total += norm * metric.weight;
  }

  const MIN_COVERAGE = 0.40;
  const score = weightSum >= MIN_COVERAGE ? Math.round((total / weightSum) * 100) : null;
  const reason = score === null
    ? (weightSum === 0
      ? "Bu girdi için sayısal spec verisi yok — puanlanamaz."
      : "Açıklanmış veri bu sınıfın ölçütlerinin çoğunu karşılamıyor.")
    : null;

  const result = {
    score,
    reason,
    cls,
    clsLabel: CLASS_LABELS[cls],
    parts: parts.sort((a, b) => b.weight - a.weight),
    missing,
    coverage: Math.round(weightSum * 100),
  };
  _cache.set(chip.id, result);
  return result;
}

export function rankInClass(chip) {
  const cls = classOf(chip);
  const peers = chips
    .filter((c) => classOf(c) === cls)
    .map((c) => ({ id: c.id, score: scoreChip(c).score ?? -1 }))
    .sort((a, b) => b.score - a.score);
  const index = peers.findIndex((p) => p.id === chip.id);
  return { rank: index + 1, total: peers.length };
}
