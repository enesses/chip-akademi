import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const categoryLabels = { GPU: "GPU", CPU: "CPU", RAM: "Bellek" };

export const manufacturerColors = {
  NVIDIA: "#76b900",
  AMD: "#ed1c24",
  Intel: "#0071c5",
  Qualcomm: "#3253dc",
  Apple: "#a3aaae",
  Samsung: "#1428a0",
  Micron: "#7b2d8e",
  SK: "#e4002b",
  JEDEC: "#94a3b8",
};

export function imageUrl(name) {
  if (!name) return "";
  if (window.__IMAGES && window.__IMAGES[name]) return window.__IMAGES[name];
  return `/images/${name}`;
}

export function formatSpecLabel(key) {
  const map = {
    tdp: "TDP", vram: "VRAM", cuda_cores: "CUDA Çekirdek",
    memory_bandwidth: "Bellek Bant Genişliği", cores: "Çekirdek",
    boost_clock: "Boost Saat Hızı", l3_cache: "L3 Cache",
  };
  return map[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatCompareValue(v) {
  if (v === null || v === undefined) return "—";
  return String(v);
}
