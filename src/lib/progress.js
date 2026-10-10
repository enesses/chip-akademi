import { profilAnahtari, profilDegisimineAbone } from "@/lib/hesap";

const TABAN = "chip-akademi:progress:v3";
const anahtar = () => profilAnahtari(TABAN);
let memory = null;
let memoryAnahtar = null;
profilDegisimineAbone(() => { memory = null; memoryAnahtar = null; });

function read() {
  const su = anahtar();
  if (memory && memoryAnahtar === su) return memory;
  memoryAnahtar = su;
  try {
    const raw = window.localStorage.getItem(su);
    memory = raw ? JSON.parse(raw) : { completed: [], quiz: {}, exam: [] };
  } catch { memory = { completed: [], quiz: {}, exam: [] }; }
  if (!memory.completed) memory.completed = [];
  if (!memory.quiz) memory.quiz = {};
  if (!memory.exam) memory.exam = [];
  return memory;
}
function write(next) {
  memory = next; memoryAnahtar = anahtar();
  try { window.localStorage.setItem(anahtar(), JSON.stringify(next)); } catch {}
  return next;
}

export function getCompleted() { return read().completed; }
export function isCompleted(id) { return read().completed.includes(id); }
export function markCompleted(id) {
  const s = read();
  if (!s.completed.includes(id)) write({ ...s, completed: [...s.completed, id] });
}
export function getQuizResult(id) { return read().quiz[id] || null; }
export function saveQuizResult(id, { score, total }) {
  const s = read();
  const onceki = s.quiz[id];
  const best = onceki ? Math.max(onceki.best, score) : score;
  const attempts = (onceki?.attempts || 0) + 1;
  write({ ...s, quiz: { ...s.quiz, [id]: { score, total, at: new Date().toISOString(), attempts, best } } });
}
export function resetProgress() { write({ completed: [], quiz: {}, exam: [] }); }
export function getExamResults() { return read().exam; }
export function saveExamResult({ score, total, pct, level, byTrack, durationSec }) {
  const s = read();
  const entry = { score, total, pct, level, byTrack, durationSec, at: new Date().toISOString() };
  write({ ...s, exam: [entry, ...s.exam].slice(0, 10) });
  return entry;
}
