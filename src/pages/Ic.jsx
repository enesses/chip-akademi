import { useMemo, useState } from "react";
import { Link } from "@/components/Nav";
import { Layers, Wrench, Cpu, ShieldAlert } from "lucide-react";
import icyapi from "@/data/icyapi.json";
import KatmanYigini from "@/components/KatmanYigini";
import { cn } from "@/lib/utils";

const { cihazlar, kategoriler } = icyapi;

function onarimRengi(puan) {
  if (puan == null) return "text-muted-foreground border-card-border";
  if (puan >= 8) return "text-emerald-400 border-emerald-400/30";
  if (puan >= 6) return "text-yellow-400 border-yellow-400/30";
  if (puan >= 4) return "text-orange-400 border-orange-400/30";
  return "text-rose-400 border-rose-400/30";
}

export default function Ic() {
  const [kat, setKat] = useState("hepsi");

  const liste = useMemo(() => {
    const l = kat === "hepsi" ? cihazlar : cihazlar.filter((c) => c.kategori === kat);
    return [...l].sort((a, b) => b.yil - a.yil || a.ad.localeCompare(b.ad, "tr"));
  }, [kat]);

  const sayim = useMemo(() => {
    const m = {};
    for (const c of cihazlar) m[c.kategori] = (m[c.kategori] || 0) + 1;
    return m;
  }, []);

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <Layers className="h-3.5 w-3.5" />İç
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">Cihazların iç kısmı</h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          Katalogdaki chip'ler bir yerde yaşıyor. Bu bölüm onları içine koyan cihazları açıyor:
          Humane AI Pin'in lazer projektöründen iPhone'un buhar odasına, Framework'ün vidalı
          anakartından Steam Deck'in küçültülmüş APU'suna kadar. Her kayıt yayımlanmış bir
          teardown ya da üreticinin kendi teknik belgesine dayanıyor; doğrulanamayan değerler
          yazılmadı, eksik kalanlar her sayfada açıkça listelendi.
        </p>

        {/* Kategori filtresi */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setKat("hepsi")}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-medium hover-elevate",
              kat === "hepsi" ? "border-primary text-primary bg-primary/5" : "border-card-border text-muted-foreground"
            )}
          >
            Hepsi <span className="font-mono opacity-60">{cihazlar.length}</span>
          </button>
          {kategoriler.map((k) => (
            <button
              key={k.id}
              onClick={() => setKat(k.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-medium hover-elevate inline-flex items-center gap-1.5",
                kat === k.id ? "bg-card" : "border-card-border text-muted-foreground"
              )}
              style={kat === k.id ? { borderColor: k.renk, color: k.renk } : undefined}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: k.renk }} />
              {k.ad} <span className="font-mono opacity-60">{sayim[k.id] || 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liste.map((c) => {
            const k = kategoriler.find((x) => x.id === c.kategori);
            const chipSayisi = c.parcalar.filter((p) => p.rol === "islemci").length;
            return (
              <Link key={c.id} href={`/ic/${c.id}`} asChild>
                <a className="group rounded-xl border border-card-border bg-card p-5 hover-elevate flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: k?.renk }}>
                        {c.uretici} · {c.yil}
                      </p>
                      <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                        {c.ad}
                      </h3>
                    </div>
                    {c.onarim?.puan != null && (
                      <span
                        className={cn(
                          "shrink-0 font-mono text-[11px] font-bold px-2 py-1 rounded border",
                          onarimRengi(c.onarim.puan)
                        )}
                        title={`iFixit onarılabilirlik: ${c.onarim.puan}/${c.onarim.max}`}
                      >
                        {c.onarim.puan}/{c.onarim.max}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <KatmanYigini katmanlar={c.katmanlar} mini className="w-[120px] shrink-0" />
                    <div className="min-w-0 space-y-1.5">
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3 w-3 shrink-0" />
                        {c.katmanlar.length} katman
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Cpu className="h-3 w-3 shrink-0" />
                        {c.parcalar.length} parça
                        {chipSayisi > 0 && <span className="opacity-60">· {chipSayisi} işlemci</span>}
                      </p>
                      {c.bilinmeyen?.length > 0 && (
                        <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                          <ShieldAlert className="h-3 w-3 shrink-0" />
                          {c.bilinmeyen.length} eksik veri
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mt-auto">{c.ozet}</p>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Yöntem notu */}
        <div className="mt-8 rounded-xl border border-card-border bg-card/60 px-5 py-4 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
            <Wrench className="h-3 w-3" />Yöntem
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Parça numaraları yalnızca bir teardown'da fiilen okunduğunda yazıldı; üretici
            açıklamadıysa ya da teardown okuyamadıysa boş bırakılıp cihaz sayfasındaki
            <span className="text-foreground"> eksik veri </span>
            listesine eklendi. Onarılabilirlik puanları iFixit'e ait — bazı cihazlar için
            puan yayımlanmadı, bu durumda alan boş görünür. Okunamayan kaynaklar
            <span className="text-foreground"> izin engeli </span>
            etiketiyle cihaz sayfasında ayrıca belirtildi.
          </p>
        </div>
      </section>
    </div>
  );
}
