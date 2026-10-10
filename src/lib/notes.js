import { profilAnahtari, profilDegisimineAbone } from "@/lib/hesap";
const TABAN = "chip-akademi:notes:v1";
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
function uid() { return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; }
function sortNotes(l) { return [...l].sort((a, b) => (!!a.pinned !== !!b.pinned ? (a.pinned ? -1 : 1) : (b.updatedAt || "").localeCompare(a.updatedAt || ""))); }

export function listNotes() { return sortNotes(read()); }
export function getNote(id) { return read().find((n) => n.id === id) || null; }
export function createNote({ title = "", body = "", context = null } = {}) {
  const now = new Date().toISOString();
  const note = { id: uid(), title, body, context, pinned: false, createdAt: now, updatedAt: now };
  write([note, ...read()]);
  return note;
}
export function updateNote(id, patch) {
  const next = read().map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n));
  write(next);
  return next.find((n) => n.id === id) || null;
}
export function deleteNote(id) { write(read().filter((n) => n.id !== id)); }
export function togglePin(id) { const n = getNote(id); return n ? updateNote(id, { pinned: !n.pinned }) : null; }
export function autoTitle(body) {
  const first = (body || "").split("\n").find((l) => l.trim().length > 0);
  return first ? first.trim().slice(0, 60) : "";
}
export function exportMarkdown() {
  const notes = listNotes();
  if (!notes.length) return "";
  const lines = ["# Chip Akademi — Notlarım", ""];
  for (const n of notes) {
    lines.push(`## ${n.title || "Başlıksız not"}`);
    if (n.context?.label) lines.push(`_Kaynak: ${n.context.label}_`);
    lines.push("", n.body || "", "", "---", "");
  }
  return lines.join("\n");
}
