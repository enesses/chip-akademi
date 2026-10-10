import { profilAnahtari, profilDegisimineAbone } from "@/lib/hesap";
const TABAN = "chip-akademi:designs:v1";
const MAX = 40;
const anahtar = () => profilAnahtari(TABAN);
let memory = null, memoryAnahtar = null;
profilDegisimineAbone(() => { memory = null; memoryAnahtar = null; });

function read() {
  const su = anahtar();
  if (memory && memoryAnahtar === su) return memory;
  memoryAnahtar = su;
  try { const raw = window.localStorage.getItem(su); memory = raw ? JSON.parse(raw) : []; }
  catch { memory = []; }
  if (!Array.isArray(memory)) memory = [];
  return memory;
}
function write(next) { memory = next; memoryAnahtar = anahtar(); try { window.localStorage.setItem(anahtar(), JSON.stringify(next)); } catch {} return next; }
function uid() { return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; }

export function listDesigns() { return [...read()].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")); }
export function getDesign(id) { return read().find((d) => d.id === id) || null; }
export function saveDesign({ name, typeId, nodeId, placed, summary }) {
  const now = new Date().toISOString();
  const design = { id: uid(), name: name?.trim() || "Adsız tasarım", typeId, nodeId, placed, summary, createdAt: now, updatedAt: now };
  write([design, ...read()].slice(0, MAX));
  return design;
}
export function updateDesign(id, patch) {
  const next = read().map((d) => (d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d));
  write(next);
  return next.find((d) => d.id === id) || null;
}
export function deleteDesign(id) { write(read().filter((d) => d.id !== id)); }
export function duplicateDesign(id) {
  const src = getDesign(id);
  if (!src) return null;
  return saveDesign({ name: `${src.name} (kopya)`, typeId: src.typeId, nodeId: src.nodeId, placed: src.placed, summary: src.summary });
}
