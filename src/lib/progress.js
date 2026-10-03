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
export function unmarkCompleted(id) {
  const s = read();
  write({ ...s, completed: s.completed.filter((x) => x !== id) });
}
export function getQuizResult(id) { return read().quiz[id] || null; }
export function getAllQuizResults() { return read().quiz; }
export function saveQuizResult(id, { score, total }) {
  const s = read();
  const onceki = s.quiz[id];
  const best = onceki ? Math.max(onceki.best, score) : score;
  const attempts = (onceki?.attempts || 0) + 1;
  write({ ...s, quiz: { ...s.quiz, [id]: { score, total, at: new Date().toISOString(), attempts, best } } });
}
export function resetQuizResult(id) {
  const s = read(); const q = { ...s.quiz }; delete q[id]; write({ ...s, quiz: q });
}
export function resetAllQuizzes() { write({ ...read(), quiz: {} }); }
export function resetProgress() { write({ completed: [], quiz: {}, exam: [] }); }
export function getSummary() {
  const s = read();
  const results = Object.values(s.quiz);
  const attempts = results.reduce((t, r) => t + r.attempts, 0);
  const perfectCount = results.filter((r) => r.best === r.total).length;
  const accuracy = results.length ? Math.round((results.reduce((t, r) => t + r.best / r.total, 0) / results.length) * 100) : 0;
  return { completedCount: s.completed.length, quizCount: results.length, attempts, perfectCount, accuracy };
}
export function getExamResults() { return read().exam; }
export function getBestExam() {
  const all = getExamResults();
  return all.length ? all.reduce((b, r) => (r.pct > b.pct ? r : b), all[0]) : null;
}
export function saveExamResult({ score, total, pct, level, byTrack, durationSec }) {
  const s = read();
  const entry = { score, total, pct, level, byTrack, durationSec, at: new Date().toISOString() };
  write({ ...s, exam: [entry, ...s.exam].slice(0, 10) });
  return entry;
}
export function resetExam() { write({ ...read(), exam: [] }); }
