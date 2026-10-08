import { useState } from "react";
import { Ban, CalendarRange, ExternalLink, GitCommitHorizontal, GitMerge, GitPullRequest, TrendingDown, TrendingUp } from "lucide-react";
import data from "@/data/haftalik.json";
import { cn } from "@/lib/utils";

const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUN = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const tarih = (iso) => { const [, a, g] = iso.split("-").map(Number); return `${g} ${AY[a - 1]}`; };
const gunAdi = (iso) => { const [y, a, g] = iso.split("-").map(Number); return GUN[(new Date(Date.UTC(y, a - 1, g)).getUTCDay() + 6) % 7]; };

const DURUM = {
  temiz: { ad: "temiz", renk: "#34d399" },
  dikkat: { ad: "dikkat", renk: "#f59e0b" },
  kritik: { ad: "kritik", renk: "#f87171" },
  calismadi: { ad: "çalışmadı", renk: "#64748b" },
};
const UYG = {
  birlesti: { ad: "birleşti", renk: "#34d399", Ikon: GitMerge },
  acik: { ad: "onay bekliyor", renk: "#f59e0b", Ikon: GitPullRequest },
  vazgecildi: { ad: "bırakıldı", renk: "#94a3b8", Ikon: Ban },
};
const puanRenk = (p) => (p >= 75 ? "#34d399" : p >= 60 ? "#22d3ee" : p >= 45 ? "#f59e0b" : "#f87171");

function Kart({ baslik, children, className }) {
  return (
    <section className={cn("rounded-2xl border border-card-border bg-card p-5", className)}>
      <h2 className="font-display font-semibold text-base mb-3">{baslik}</h2>
      {children}
    </section>
  );
}

export default function Haftalik() {
  const haftalar = data.haftalar || [];
  const [secili, setSecili] = useState(haftalar[0]?.hafta);
  const h = haftalar.find((x) => x.hafta === secili) || haftalar[0];

  if (!h)
    return (
      <div className="container mx-auto px-4 py-16 text-muted-foreground">
        Henüz haftalık rapor yok. İlk rapor Pazartesi sabahı oluşturulur.
      </div>
    );

  const s = h.sayilar;
  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />Haftalık rapor
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{h.baslik}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {h.hafta.slice(0, 4)} yılının {Number(h.hafta.slice(6))}. haftası · Her Pazartesi sabahı bir önceki hafta için yazılır. Tüm sayılar otomasyonun kayıtlarından hesaplanır.
        </p>

        {haftalar.length > 1 && (
          <div className="mt-5 flex gap-1.5 overflow-x-auto serit-kaydir pb-1" role="tablist" aria-label="Hafta seç">
            {haftalar.map((x) => (
              <button
                key={x.hafta}
                type="button"
                role="tab"
                aria-selected={x.hafta === h.hafta}
                onClick={() => setSecili(x.hafta)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  x.hafta === h.hafta ? "border-primary/60 bg-primary/10 text-foreground" : "border-card-border text-muted-foreground hover:text-foreground",
                )}
              >
                {tarih(x.bas)} – {tarih(x.son)}{x.kismi ? " · sürüyor" : ""}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-6">
        <ul className="rounded-2xl border border-primary/30 bg-primary/5 p-5 grid gap-2 max-w-4xl">
          {h.ozet.map((c, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container mx-auto px-4 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["Çalışılan gün", `${s.calisanGun}/${h.gunler.length}`],
          ["Uygulamaya giren", s.degisiklik],
          ["Otomatik birleşen öneri", s.uygulananBirlesen],
          ["Bugün ort. puanı", s.bugunOrtalama ?? "—"],
        ].map(([ad, deger]) => (
          <div key={ad} className="rounded-xl border border-card-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{ad}</p>
            <p className="font-display text-2xl font-bold mt-1 tabular-nums">{deger}</p>
          </div>
        ))}
      </section>

      <div className="container mx-auto px-4 pb-16 grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 grid gap-4 content-start">
          <Kart baslik="Uygulanan öneriler">
            {h.uygulanan.length === 0 ? (
              <p className="text-sm text-muted-foreground">Bu hafta uygulanan öneri yok.</p>
            ) : (
              <ul className="grid gap-2">
                {h.uygulanan.map((k, i) => {
                  const u = UYG[k.durum] || UYG.vazgecildi;
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <u.Ikon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: u.renk }} aria-hidden="true" />
                      <div className="min-w-0 text-sm">
                        <p className="font-medium">{k.oneri}</p>
                        <p className="text-xs text-muted-foreground">
                          {tarih(k.tarih)} · <span style={{ color: u.renk }}>{u.ad}</span>{k.kim === "elle" ? " · sohbette elle" : " · otomasyon"}
                          {k.pr ? ` · PR #${k.pr}` : ""}{k.neden ? ` · ${k.neden}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Kart>

          <Kart baslik={`Uygulamaya girenler (${h.degisiklikler.length})`}>
            {h.degisiklikler.length === 0 ? (
              <p className="text-sm text-muted-foreground">Bu hafta kod değişikliği yok.</p>
            ) : (
              <ol className="grid gap-1.5">
                {h.degisiklikler.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <GitCommitHorizontal className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground mr-1.5 tabular-nums">{tarih(d.tarih)}</span>
                      {d.baslik}
                    </span>
                    <a href={d.url} target="_blank" rel="noreferrer" className="shrink-0 text-xs text-primary hover:underline inline-flex items-center gap-1">
                      {d.pr ? `#${d.pr}` : "commit"}<ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </Kart>
        </div>

        <div className="lg:col-span-2 grid gap-4 content-start">
          <Kart baslik="Günler">
            <div className="grid grid-cols-7 gap-1.5">
              {h.gunler.map((g, i) => {
                const d = DURUM[g.durum] || DURUM.dikkat;
                const p = h.bugun[i]?.puan;
                return (
                  <div key={g.tarih} className="rounded-lg border border-card-border p-1.5 text-center" title={`${tarih(g.tarih)}: ${d.ad}${g.fiyat ? `, fiyat ${g.fiyat}` : ""}`}>
                    <p className="text-[10px] text-muted-foreground">{gunAdi(g.tarih)}</p>
                    <span className="mx-auto mt-1 block h-2 w-2 rounded-full" style={{ background: d.renk }} aria-hidden="true" />
                    <p className="mt-1 text-xs font-semibold tabular-nums" style={{ color: p != null ? puanRenk(p) : undefined }}>{p ?? "—"}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2.5">
              Nokta: otomasyon durumu (yeşil temiz, sarı dikkat, kırmızı kritik, gri çalışmadı). Sayı: o günün Bugün puanı.
            </p>
            {h.gunler.some((g) => g.fiyat === "izin engeli") && (
              <p className="text-xs mt-2" style={{ color: "#f59e0b" }}>
                Fiyat sayfası {h.gunler.filter((g) => g.fiyat === "izin engeli").map((g) => tarih(g.tarih)).join(", ")} günlerinde izin engeline takıldı; fiyat uydurulmadı.
              </p>
            )}
          </Kart>

          <Kart baslik="Kiralama fiyatı hareketi">
            {!h.fiyat?.enCokOynayan?.length ? (
              <p className="text-sm text-muted-foreground">Bu hafta karşılaştırılabilir iki fiyat ölçümü yok.</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2">{tarih(h.fiyat.taban)} → {tarih(h.fiyat.son)}, saatlik medyan (en az 10 sağlayıcı)</p>
                <ul className="grid gap-1.5">
                  {h.fiyat.enCokOynayan.map((f) => {
                    const yukari = f.degisim > 0;
                    const Ikon = yukari ? TrendingUp : TrendingDown;
                    return (
                      <li key={f.model} className="flex items-center gap-2 text-sm">
                        <Ikon className="h-4 w-4 shrink-0" style={{ color: yukari ? "#f87171" : "#34d399" }} aria-hidden="true" />
                        <span className="flex-1 min-w-0 truncate">{f.model}</span>
                        <span className="tabular-nums text-muted-foreground text-xs">${f.once} → ${f.sonra}</span>
                        <span className="tabular-nums text-xs w-14 text-right" style={{ color: yukari ? "#f87171" : "#34d399" }}>
                          {yukari ? "+" : ""}{f.degisim}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Kart>
        </div>
      </div>
    </div>
  );
}
