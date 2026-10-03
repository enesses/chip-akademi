import { useState } from "react";
import { Link } from "@/components/Nav";
import { Award, Check, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildExam, levelFor } from "@/lib/exam";
import { saveExamResult } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function Exam() {
  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);

  function start() {
    setQuestions(buildExam({ count: 20 }));
    setAnswers({}); setIndex(0); setPhase("running");
  }
  function finish(qs, ans) {
    let score = 0;
    for (const q of qs) if (ans[q.id] === q.answer) score++;
    const pct = Math.round((score/qs.length)*100);
    const level = levelFor(pct);
    saveExamResult({ score, total: qs.length, pct, level: level.name, byTrack: {}, durationSec: null });
    setResult({ score, total: qs.length, pct, level });
    setPhase("result");
  }

  if (phase === "intro") return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><Award className="h-3.5 w-3.5" />Seviye Sınavı</div>
      <h1 className="font-display text-3xl font-bold mb-4">Seviyeni ölç.</h1>
      <p className="text-muted-foreground mb-8">20 soruluk, tüm derslerin havuzundan rastgele seçilen bir sınav.</p>
      <Button size="lg" className="gap-2" onClick={start}><GraduationCap className="h-4 w-4" />Sınava başla</Button>
    </div>
  );

  if (phase === "running") {
    const q = questions[index];
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <p className="font-mono text-xs text-muted-foreground mb-4">Soru {index+1} / {questions.length}</p>
        <h2 className="font-display font-bold text-xl mb-6">{q.q}</h2>
        <div className="space-y-2.5">
          {q.options.map((opt, oi) => (
            <button key={oi} onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
              className={cn("w-full text-left rounded-xl border px-4 py-3 text-sm", answers[q.id]===oi ? "border-primary bg-primary/10" : "border-border bg-card")}>
              {opt}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled={index===0} onClick={() => setIndex((i) => i-1)}>Önceki</Button>
          {index < questions.length-1
            ? <Button onClick={() => setIndex((i) => i+1)}>Sonraki</Button>
            : <Button onClick={() => finish(questions, answers)}>Sınavı bitir</Button>}
        </div>
      </div>
    );
  }

  const lv = result.level;
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <p className="font-display font-bold text-6xl" style={{ color: lv.color }}>%{result.pct}</p>
      <p className="font-display font-bold text-2xl mt-2" style={{ color: lv.color }}>{lv.name}</p>
      <p className="text-muted-foreground mt-2">{result.score} / {result.total} doğru</p>
      <div className="flex gap-3 mt-8">
        <Button onClick={start} className="gap-1.5"><Check className="h-4 w-4" />Yeni sınav</Button>
        <Link href="/egitim"><Button variant="outline">Derslere git</Button></Link>
      </div>
    </div>
  );
}
