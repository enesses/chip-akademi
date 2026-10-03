import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "@/components/Nav";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessons } from "@/data/lessons";
import { getLessonById } from "@/data/lessons";
import { markCompleted, isCompleted, saveQuizResult, getQuizResult } from "@/lib/progress";
import { cn } from "@/lib/utils";

function Section({ s }) {
  if (s.type === "text") return <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-4">{s.body}</p>;
  if (s.type === "callout") return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4">
      <p className="text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
    </div>
  );
  if (s.type === "analogy") return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-500/5 p-4 mb-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300 mb-1.5">Benzetme</p>
      <p className="text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
    </div>
  );
  if (s.type === "list") return (
    <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/85 mb-4">
      {(s.items || []).map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
  if (s.type === "steps") return (
    <ol className="space-y-2 mb-4">
      {(s.items || []).map((it, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-mono text-[10px] shrink-0">{i+1}</span>
          <span className="text-foreground/85">{it}</span>
        </li>
      ))}
    </ol>
  );
  if (s.type === "table") return (
    <div className="rounded-lg border border-card-border overflow-hidden mb-4">
      <table className="w-full text-xs">
        <tbody>
          {(s.rows || []).map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-muted/20" : ""}>
              {row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (s.type === "diagram") return (
    <div className="rounded-xl border border-card-border bg-muted/20 p-6 mb-4 text-center text-xs text-muted-foreground">
      [Diyagram: {s.variant || s.title || "görsel"}]
    </div>
  );
  return null;
}

function Quiz({ lesson }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const onceki = getQuizResult(lesson.id);

  function submit() {
    const score = lesson.quiz.reduce((t, q, i) => t + (answers[i] === q.answer ? 1 : 0), 0);
    saveQuizResult(lesson.id, { score, total: lesson.quiz.length });
    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 mt-8">
      <h2 className="font-display font-bold text-lg mb-1">Testi çöz</h2>
      {onceki && <p className="text-xs text-muted-foreground mb-4">En iyi skorun: {onceki.best}/{onceki.total}</p>}
      <div className="space-y-6">
        {lesson.quiz.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-medium mb-2">{qi + 1}. {q.q}</p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const secili = answers[qi] === oi;
                const dogru = submitted && oi === q.answer;
                const yanlisSecim = submitted && secili && oi !== q.answer;
                return (
                  <button key={oi} disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn("w-full text-left rounded-lg border px-3 py-2 text-xs transition-all",
                      dogru ? "border-emerald-500 bg-emerald-500/10" : yanlisSecim ? "border-red-500 bg-red-500/10" :
                      secili ? "border-primary bg-primary/10" : "border-border bg-card hover-elevate")}>
                    {opt} {dogru && <Check className="inline h-3 w-3 text-emerald-400 ml-1" />} {yanlisSecim && <X className="inline h-3 w-3 text-red-400 ml-1" />}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="text-xs text-muted-foreground leading-relaxed mt-2 border-l-2 border-primary/40 pl-3">{q.explanation}</p>}
          </div>
        ))}
      </div>
      {!submitted ? (
        <Button className="mt-6" onClick={submit} disabled={Object.keys(answers).length < lesson.quiz.length}>Testi bitir</Button>
      ) : (
        <p className="mt-6 font-display font-bold text-lg">
          Sonuç: {lesson.quiz.reduce((t, q, i) => t + (answers[i] === q.answer ? 1 : 0), 0)} / {lesson.quiz.length}
        </p>
      )}
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams();
  const lesson = getLessonById(id);
  const [, forceUpdate] = useState(0);
  if (!lesson) return <div className="container mx-auto px-4 py-16">Ders bulunamadı.</div>;
  const done = isCompleted(lesson.id);

  function tamamlaTikla() {
    markCompleted(lesson.id);
    forceUpdate((n) => n + 1); // isCompleted() dışarıdan okunuyor, React bunu izlemiyor
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/egitim" asChild>
        <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" />Derslere dön</a>
      </Link>
      <p className="font-mono text-xs uppercase tracking-wider text-primary mb-2">{lesson.level} · {lesson.duration}</p>
      <h1 className="font-display text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-muted-foreground mb-8">{lesson.subtitle}</p>

      {lesson.sections.map((s, i) => <Section key={i} s={s} />)}

      {lesson.keyTerms?.length > 0 && (
        <div className="rounded-xl border border-card-border bg-card p-4 my-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Anahtar terimler</p>
          <div className="flex flex-wrap gap-1.5">
            {lesson.keyTerms.map((t) => <span key={t} className="text-xs bg-muted rounded px-2 py-1">{t}</span>)}
          </div>
        </div>
      )}

      <Button
        variant={done ? "outline" : "default"}
        className="gap-1.5"
        onClick={tamamlaTikla}
        data-testid="mark-complete"
      >
        {done ? <><Check className="h-4 w-4" />Tamamlandı</> : "Tamamlandı olarak işaretle"}
      </Button>

      {lesson.quiz?.length > 0 && <Quiz lesson={lesson} />}
    </div>
  );
}
