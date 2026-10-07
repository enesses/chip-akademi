import { useEffect, useState } from "react";
import { Download, Plus, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { autoTitle, createNote, deleteNote, exportMarkdown, listNotes, updateNote } from "@/lib/notes";
import { dosyaKaydet } from "@/lib/dosyaKaydet";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [kayitMesaji, setKayitMesaji] = useState("");
  function refresh() { const l = listNotes(); setNotes(l); if (!activeId && l.length) setActiveId(l[0].id); }
  useEffect(() => { refresh(); }, []);
  const active = notes.find((n) => n.id === activeId) || null;

  function yeni() { const n = createNote({}); refresh(); setActiveId(n.id); }
  function guncelle(patch) { if (!active) return; updateNote(active.id, patch); refresh(); }
  async function indir() {
    const md = exportMarkdown(); if (!md) return;
    setKayitMesaji("");
    const sonuc = await dosyaKaydet("notlarim.md", md, "text/markdown");
    if (sonuc.durum === "hata") setKayitMesaji(sonuc.mesaj);
  }

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><StickyNote className="h-3.5 w-3.5" />Not Defteri</div>
            <h1 className="font-display text-3xl font-bold">Notlarım</h1>
          </div>
          <div className="flex gap-2">
            <Button className="gap-1.5" onClick={yeni}><Plus className="h-4 w-4" />Yeni not</Button>
            {notes.length > 0 && <Button variant="outline" className="gap-1.5" onClick={indir}><Download className="h-4 w-4" />İndir</Button>}
            {kayitMesaji && <p role="status" className="text-xs text-rose-400 w-full">{kayitMesaji}</p>}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 pb-16">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">Henüz not yok.</div>
        ) : (
          <div className="grid lg:grid-cols-[18rem_1fr] gap-5">
            <div className="rounded-2xl border border-card-border bg-card p-2 space-y-1.5 max-h-[32rem] overflow-y-auto">
              {notes.map((n) => (
                <button key={n.id} onClick={() => setActiveId(n.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${activeId===n.id ? "bg-primary/10 text-primary" : "hover-elevate"}`}>
                  {n.title || autoTitle(n.body) || "Başlıksız not"}
                </button>
              ))}
            </div>
            {active && (
              <div className="rounded-2xl border border-card-border bg-card p-5 flex flex-col">
                <input value={active.title} onChange={(e) => guncelle({ title: e.target.value })} placeholder="Başlık…"
                  className="bg-transparent font-display font-bold text-lg outline-none mb-3" />
                <textarea value={active.body} onChange={(e) => guncelle({ body: e.target.value })} placeholder="Yaz…"
                  className="flex-1 min-h-[16rem] bg-transparent outline-none text-sm resize-none" />
                <Button variant="ghost" className="self-end mt-3 gap-1.5 text-muted-foreground hover:text-red-400"
                  onClick={() => { deleteNote(active.id); setActiveId(null); refresh(); }}><Trash2 className="h-3.5 w-3.5" />Sil</Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
