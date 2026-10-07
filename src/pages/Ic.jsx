import { useMemo, useState } from "react";
import { Link } from "@/components/Nav";
import { Layers, Wrench, Cpu, ShieldAlert } from "lucide-react";
import icyapi from "@/data/icyapi.json";
import KatmanYigini from "@/components/KatmanYigini";
import { puanRengi } from "@/components/IcPuanlar";
import { cihazPuani, anaIslemci } from "@/lib/icPuan";
import { genelPuan } from "@/lib/chipScore";
import { cn } from "@/lib/utils";

const { cihazlar, kategoriler } = icyapi;


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
            const puan = cihazPuani(c);
            const ana = anaIslemci(c);
            const anaPuan = ana ? genelPuan(ana).puan : null;
            const anaAd = ana ? ana.name : c.parcalar.find((p) => p.rol === "islemci")?.ad;
            return (
              <Link key={c.id} href={`/ic/${c.id}`} asChild>
                <a className="group min-w-0 rounded-xl border border-card-border bg-card p-5 hover-elevate flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: k?.renk }}>
                        {c.uretici} · {c.yil}
                      </p>
                      <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                        {c.ad}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-center rounded-lg border border-card-border px-2 py-1",
                        puanRengi(puan.genel)
                      )}
                      title={puan.genel != null ? "Cihaz puanı (100 üzerinden)" : puan.genelNeden}
                    >
                      <span className="block font-display font-bold text-base leading-none">{puan.genel ?? "—"}</span>
                      <span className="block font-mono text-[8px] text-muted-foreground mt-0.5">
                        {puan.genel != null ? "/100" : "veri az"}
                      </span>
                    </span>
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

                  {/* Ana işlemci ve bileşen puanları */}
                  {anaAd && (
                    <div className="rounded-lg border border-card-border bg-background/40 px-3 py-2 mb-3">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <p className="text-[11px] truncate min-w-0">
                          <span className="text-muted-foreground">İşlemci: </span>
                          {anaAd}
                        </p>
                        <span className={cn("font-mono text-[11px] font-bold shrink-0", puanRengi(anaPuan))}>
                          {anaPuan != null ? `${anaPuan}/100` : "puan yok"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                        {puan.bilesenler.filter((b) => b.key !== "islemci").map((b) => (
                          <span key={b.key} className="text-[10px] text-muted-foreground">
                            {b.ad} <span className={cn("font-mono font-bold", puanRengi(b.puan))}>{b.puan ?? "—"}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-auto">{c.ozet}</p>
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
            Kartlardaki cihaz puanı 100 üzerinden ve üç bileşenden hesaplanır: onarılabilirlik
            (iFixit × 10), şeffaflık (üreticisi bilinen parça oranı; açıklanmayan her bilgi
            paydayı büyütür) ve işlemci (ana chip'in katalogdaki genel puanı). En az iki bileşeni
            hesaplanamayan cihaza genel puan verilmez.
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
