import { useEffect, useState } from "react";
import { Link } from "@/components/Nav";
import { Trash2, FolderOpen, Copy, Scale } from "lucide-react";
import { useLocation } from "wouter";
import { BEKLEYEN_ANAHTAR } from "@/pages/Compare";
import { Button } from "@/components/ui/button";
import DiePreview from "@/components/DiePreview";
import { getChipType, getNode } from "@/data/blocks";
import { analyze } from "@/lib/chipDesign";
import { deleteDesign, duplicateDesign, listDesigns } from "@/lib/designs";

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [, navigate] = useLocation();
  function karsilastir(id) {
    try { window.sessionStorage.setItem(BEKLEYEN_ANAHTAR, id); } catch {}
    navigate("/karsilastir");
  }
  function refresh() { setDesigns(listDesigns()); }
  useEffect(refresh, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tasarımlarım</h1>
      <p className="text-muted-foreground mb-8">{designs.length} kayıtlı tasarım</p>
      {designs.length === 0 ? (
        <Link href="/tasarla"><Button>Tasarım Atölyesi'ne git</Button></Link>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {designs.map((d) => {
            const r = analyze({ typeId: d.typeId, nodeId: d.nodeId, placed: d.placed });
            const type = getChipType(d.typeId);
            return (
              <div key={d.id} className="rounded-2xl border border-card-border bg-card overflow-hidden">
                <div className="p-4" style={{ background: `${type.color}0d` }}><DiePreview placed={d.placed} className="w-full h-auto" /></div>
                <div className="p-4">
                  <div className="flex justify-between"><h3 className="font-bold text-sm">{d.name}</h3><span className="font-bold text-primary">{r.score}</span></div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">{type.short} · {d.nodeId}</p>
                </div>
                <div className="px-4 py-3 border-t border-card-border flex gap-1.5">
                  <Link href={`/tasarla/${d.id}`}><Button size="sm" className="gap-1.5"><FolderOpen className="h-3.5 w-3.5" />Aç</Button></Link>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => karsilastir(d.id)} data-testid="tasarim-karsilastir"><Scale className="h-3.5 w-3.5" />Karşılaştır</Button>
                  <Button size="sm" variant="ghost" aria-label={`${d.name} tasarımını kopyala`} title="Kopyala" onClick={() => { duplicateDesign(d.id); refresh(); }}><Copy className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" aria-label={`${d.name} tasarımını sil`} title="Sil" onClick={() => { deleteDesign(d.id); refresh(); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
