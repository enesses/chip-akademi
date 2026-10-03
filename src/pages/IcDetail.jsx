import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { Link } from "@/components/Nav";
import {
  ArrowLeft, Layers, Lightbulb, BatteryCharging, Wrench, Box,
  ShieldAlert, ExternalLink, Lock, ArrowRight,
} from "lucide-react";
import icyapi from "@/data/icyapi.json";
import KatmanYigini from "@/components/KatmanYigini";
import { cn } from "@/lib/utils";

const { cihazlar, kategoriler, roller } = icyapi;

function onarimRengi(puan) {
  if (puan == null) return "text-muted-foreground border-card-border";
  if (puan >= 8) return "text-emerald-400 border-emerald-400/30";
  if (puan >= 6) return "text-yellow-400 border-yellow-400/30";
  if (puan >= 4) return "text-orange-400 border-orange-400/30";
  return "text-rose-400 border-rose-400/30";
}

/** Başlıklı kutu */
function Kutu({ ikon: Ikon, baslik, children, className }) {
  return (
    <div className={cn("rounded-xl border border-card-border bg-card p-5", className)}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
        {Ikon && <Ikon className="h-3 w-3" />}
        {baslik}
      </p>
      {children}
    </div>
  );
}

export default function IcDetail() {
  const { id } = useParams();
  const cihaz = cihazlar.find((c) => c.id === id);
  const [aktif, setAktif] = useState(null);

  // Parçaları role göre grupla, roller sözlüğündeki sırayı koru.
  // Erken return'den ÖNCE çağrılmalı: aksi halde cihaz bulunamadığında
  // hook sayısı değişir ve React "rendered fewer hooks" hatası verir.
  const gruplar = useMemo(() => {
    if (!cihaz) return [];
    const sira = Object.keys(roller);
    const m = new Map();
    for (const p of cihaz.parcalar) {
      if (!m.has(p.rol)) m.set(p.rol, []);
      m.get(p.rol).push(p);
    }
    return sira.filter((r) => m.has(r)).map((r) => ({ rol: r, ...roller[r], parcalar: m.get(r) }));
  }, [cihaz]);

  if (!cihaz) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground mb-4">Bu cihaz kaydı yok.</p>
        <Link href="/ic" asChild>
          <a className="inline-flex items-center gap-1.5 text-sm text-primary">
            <ArrowLeft className="h-4 w-4" /> İç bölümüne dön
          </a>
        </Link>
      </div>
    );
  }

  const kat = kategoriler.find((k) => k.id === cihaz.kategori);

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/ic" asChild>
        <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> İç bölümüne dön
        </a>
      </Link>

      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: kat?.renk }}>
            {cihaz.uretici} · {cihaz.yil} · {kat?.ad}
          </p>
          <h1 className="font-display text-3xl font-bold">{cihaz.ad}</h1>
        </div>
        {cihaz.onarim?.puan != null && (
          <div className={cn("rounded-xl border px-4 py-3 text-center", onarimRengi(cihaz.onarim.puan))}>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
              iFixit onarım
            </p>
            <p className="font-display font-bold text-2xl leading-none">
              {cihaz.onarim.puan}
              <span className="text-sm text-muted-foreground">/{cihaz.onarim.max}</span>
            </p>
            {cihaz.onarim.gecici && (
              <p className="font-mono text-[9px] text-muted-foreground mt-1">geçici puan</p>
            )}
          </div>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">{cihaz.ozet}</p>

      {/* İç fikir — bu cihazın öğrettiği şey */}
      {cihaz.ic_fikir && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 mb-10 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-2 inline-flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3" />İç fikir
          </p>
          <p className="text-sm leading-relaxed">{cihaz.ic_fikir}</p>
        </div>
      )}

      {/* Patlatılmış görünüm */}
      <h2 className="font-display text-lg font-bold mb-1 inline-flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground" />Patlatılmış görünüm
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Dıştan içe doğru: en üstteki plaka cihazın ön yüzü. Bir katmanın üstüne gelin ya da
        listeden seçin.
      </p>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6 mb-10 items-start">
        {/* Uzun katman listesi kaydırılırken diyagram görünür kalsın */}
        <div className="rounded-xl border border-card-border bg-card p-4 lg:sticky lg:top-20">
          <KatmanYigini katmanlar={cihaz.katmanlar} aktif={aktif} onAktif={setAktif} />
          {aktif != null ? (
            <p className="text-xs text-center mt-2 font-medium" style={{ color: cihaz.katmanlar[aktif].renk }}>
              {cihaz.katmanlar[aktif].ad}
            </p>
          ) : (
            <p className="text-[11px] text-center mt-2 text-muted-foreground">
              {cihaz.katmanlar.length} katman · dıştan içe
            </p>
          )}
        </div>

        <ol className="space-y-2">
          {cihaz.katmanlar.map((k, i) => {
            const secili = aktif === i;
            return (
              <li
                key={i}
                onMouseEnter={() => setAktif(i)}
                onMouseLeave={() => setAktif(null)}
                className={cn(
                  "rounded-xl border p-4 transition-colors cursor-default",
                  secili ? "bg-card" : "border-card-border bg-card/50"
                )}
                style={secili ? { borderColor: k.renk } : undefined}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1 w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: k.renk }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      <span className="font-mono text-[10px] text-muted-foreground mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {k.ad}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{k.aciklama}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Parçalar */}
      <h2 className="font-display text-lg font-bold mb-4">Parçalar</h2>
      <div className="space-y-4 mb-10">
        {gruplar.map((g) => (
          <div key={g.rol} className="rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-card-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: g.renk }} aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: g.renk }}>
                {g.ad}
              </p>
              <span className="font-mono text-[10px] text-muted-foreground">{g.parcalar.length}</span>
            </div>
            <div className="divide-y divide-card-border">
              {g.parcalar.map((p, i) => (
                <div key={i} className="px-4 py-3 grid sm:grid-cols-[1fr_1fr] gap-x-6 gap-y-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {p.ad}
                      {p.uretici && (
                        <span className="text-muted-foreground font-normal"> · {p.uretici}</span>
                      )}
                    </p>
                    {p.deger && (
                      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{p.deger}</p>
                    )}
                    {p.chip_id && (
                      <Link href={`/chip/${p.chip_id}`} asChild>
                        <a className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1.5">
                          Katalogda incele <ArrowRight className="h-3 w-3" />
                        </a>
                      </Link>
                    )}
                  </div>
                  {p.not && (
                    <p className="text-xs text-muted-foreground leading-relaxed sm:border-l sm:border-card-border sm:pl-6">
                      {p.not}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Gövde / pil / onarım */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {cihaz.govde && (
          <Kutu ikon={Box} baslik="Gövde">
            <p className="text-sm leading-relaxed">{cihaz.govde}</p>
          </Kutu>
        )}
        {cihaz.pil && (
          <Kutu ikon={BatteryCharging} baslik="Pil">
            <p className="text-sm leading-relaxed">{cihaz.pil.kapasite}</p>
            {cihaz.pil.not && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{cihaz.pil.not}</p>
            )}
          </Kutu>
        )}
        {cihaz.onarim && (
          <Kutu ikon={Wrench} baslik="Onarılabilirlik">
            {cihaz.onarim.puan != null ? (
              <p className={cn("font-display font-bold text-2xl", onarimRengi(cihaz.onarim.puan).split(" ")[0])}>
                {cihaz.onarim.puan}
                <span className="text-sm text-muted-foreground font-normal">/{cihaz.onarim.max}</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Sayısal puan yayımlanmadı</p>
            )}
            {cihaz.onarim.not && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{cihaz.onarim.not}</p>
            )}
          </Kutu>
        )}
      </div>

      {/* Eksik veri — dürüstlük bölümü */}
      {cihaz.bilinmeyen?.length > 0 && (
        <div className="rounded-xl border border-yellow-400/25 bg-yellow-400/5 p-5 mb-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-yellow-400 mb-3 inline-flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3" />Eksik veri
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Aşağıdaki değerler ne üretici tarafından açıklandı ne de bir teardown'da okunabildi.
            Tahminle doldurulmadı:
          </p>
          <ul className="space-y-1.5">
            {cihaz.bilinmeyen.map((b, i) => (
              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-yellow-400/60 shrink-0 font-mono text-xs mt-0.5">—</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* İzin engeli olan kaynaklar */}
      {cihaz.engelli_kaynaklar?.length > 0 && (
        <div className="rounded-xl border border-rose-400/25 bg-rose-400/5 p-5 mb-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-rose-400 mb-3 inline-flex items-center gap-1.5">
            <Lock className="h-3 w-3" />İzin engeli
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Bu kaynaklar okunmak istendi ama site erişime izin vermedi; içerikleri bu sayfada
            kullanılmadı.
          </p>
          <ul className="space-y-2">
            {cihaz.engelli_kaynaklar.map((k, i) => (
              <li key={i} className="text-sm">
                <a
                  href={k.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground hover:underline"
                >
                  {k.ad} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
                <p className="text-xs text-rose-400/80 mt-0.5">{k.neden}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Kaynaklar */}
      <h2 className="font-display text-lg font-bold mb-3">Kaynaklar</h2>
      <ul className="space-y-2 mb-4">
        {cihaz.kaynaklar.map((k, i) => (
          <li key={i}>
            <a
              href={k.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1.5 text-sm text-primary hover:underline"
            >
              {k.ad} <ExternalLink className="h-3 w-3 shrink-0 mt-1" />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Bu sayfadaki her değer yukarıdaki kaynaklardan birine dayanır. Kaynaklar arasında
        çelişki varsa parça notunda belirtildi.
      </p>
    </div>
  );
}
