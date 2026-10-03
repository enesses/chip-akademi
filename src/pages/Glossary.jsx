import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchGlossary } from "@/data/glossary";

export default function Glossary() {
  const [q, setQ] = useState("");
  const list = searchGlossary(q);
  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><BookOpen className="h-3.5 w-3.5" />Sözlük</div>
        <h1 className="font-display text-3xl font-bold mb-4">Chip terimleri sözlüğü</h1>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Terim ara…" className="pl-8" />
        </div>
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((g) => (
            <div key={g.term} className="rounded-xl border border-card-border bg-card p-4">
              <h3 className="font-display font-bold text-sm text-primary mb-1">{g.term}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.def}</p>
            </div>
          ))}
          {list.length === 0 && <p className="text-muted-foreground col-span-2">Sonuç yok.</p>}
        </div>
      </section>
    </div>
  );
}
