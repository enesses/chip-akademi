import { lessons } from "@/data/lessons";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
export function buildExam({ count = 20 } = {}) {
  const pool = [];
  for (const l of lessons) for (const q of l.quiz) pool.push({ ...q, track: l.track, lessonId: l.id });
  const secilen = shuffle(pool).slice(0, count);
  return secilen.map((q, i) => {
    const order = shuffle(q.options.map((_, oi) => oi));
    return { id: `s${i+1}`, q: q.q, options: order.map((oi) => q.options[oi]), answer: order.indexOf(q.answer), explanation: q.explanation, track: q.track, lessonId: q.lessonId };
  });
}
export const LEVELS = [
  { min: 90, name: "Uzman", color: "#34d399" },
  { min: 75, name: "İleri", color: "#22d3ee" },
  { min: 55, name: "Orta", color: "#f59e0b" },
  { min: 35, name: "Başlangıç", color: "#fb923c" },
  { min: 0, name: "Hazırlık", color: "#f87171" },
];
export function levelFor(pct) { return LEVELS.find((l) => pct >= l.min) || LEVELS[LEVELS.length-1]; }
