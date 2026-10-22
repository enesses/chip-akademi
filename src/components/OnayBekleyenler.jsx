import { useEffect, useState } from "react";
import { Check, CircleAlert, ExternalLink, GitPullRequest, Loader2, Send } from "lucide-react";
import { hataAciklamasi, iletildiOlarakIsaretle, iletilenler, onayHazirMi, onayla } from "@/lib/onay";
import { cn } from "@/lib/utils";

const DEPO = "https://github.com/enesses/chip-akademi";
const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const tarih = (iso) => { const [, a, g] = iso.split("-").map(Number); return `${g} ${AY[a - 1]}`; };
const SAAT = 6 * 3600 * 1000; // "iletildi" işareti bu süre sonra düşer (görev yayını yenilemediyse yeniden basılabilsin)

/**
 * Onay bekleyen öneri PR'ları. Sahip "Onayla"ya basınca (bir kez daha
 * doğrulayarak) kendi hesabındaki onay görevi başlar; görev PR'ı birleştirip
 * uygulamayı yeniden yayınlar ve sonuç bildirim olarak gelir.
 */
export default function OnayBekleyenler({ liste }) {
  const [hazir, setHazir] = useState({ durum: "bekleniyor" });
  const [durum, setDurum] = useState({}); // pr → { asama: "soru"|"gonderiliyor"|"iletildi"|"hata", hata? }

  useEffect(() => {
    let iptal = false;
    onayHazirMi().then((h) => { if (!iptal) setHazir(h); });
    const once = iletilenler();
    const simdi = Date.now();
    const d = {};
    for (const k of liste) if (once[k.pr] && simdi - once[k.pr] < SAAT) d[k.pr] = { asama: "iletildi" };
    setDurum(d);
    return () => { iptal = true; };
  }, [liste]);

  const gonder = async (prler) => {
    setDurum((d) => ({ ...d, ...Object.fromEntries(prler.map((n) => [n, { asama: "gonderiliyor" }])) }));
    try {
      await onayla(hazir.mcp, prler);
      iletildiOlarakIsaretle(prler);
      setDurum((d) => ({ ...d, ...Object.fromEntries(prler.map((n) => [n, { asama: "iletildi" }])) }));
    } catch (e) {
      const h = hataAciklamasi(e);
      if (h.belirsiz) iletildiOlarakIsaretle(prler);
      setDurum((d) => ({ ...d, ...Object.fromEntries(prler.map((n) => [n, { asama: h.belirsiz ? "iletildi" : "hata", hata: h.metin, belirsiz: h.belirsiz }])) }));
    }
  };

  const bekleyen = liste.filter((k) => !durum[k.pr] || durum[k.pr].asama === "hata" || durum[k.pr].asama === "soru");
  const hepsiSoruda = bekleyen.length > 1 && bekleyen.every((k) => durum[k.pr]?.asama === "soru");

  return (
    <section className="container mx-auto px-4 pb-10" aria-labelledby="onay-bekleyen">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4 max-w-5xl">
        <div>
          <h2 id="onay-bekleyen" className="font-display font-semibold text-xl">Onay bekleyen öneriler</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Otomasyon bunları uyguladı ve testleri geçti, ama birleştirmek için senin onayın gerekiyor.
            Onaylayınca Claude birkaç dakika içinde birleştirir, uygulamayı yeniden yayınlar ve sana bildirim gönderir.
          </p>
        </div>
        {hazir.durum === "hazir" && bekleyen.length > 1 && (
          hepsiSoruda ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => gonder(bekleyen.map((k) => k.pr))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-emerald-950 px-3 py-2 text-sm font-semibold hover:bg-emerald-400">
                <Check className="h-4 w-4" aria-hidden="true" /> Evet, {bekleyen.length}'ini de birleştir
              </button>
              <button type="button" onClick={() => setDurum((d) => Object.fromEntries(Object.entries(d).filter(([, v]) => v.asama !== "soru")))}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Vazgeç</button>
            </div>
          ) : (
            <button type="button" onClick={() => setDurum((d) => ({ ...d, ...Object.fromEntries(bekleyen.map((k) => [k.pr, { asama: "soru" }])) }))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 text-emerald-300 px-3 py-2 text-sm font-medium hover:bg-emerald-500/10">
              <Check className="h-4 w-4" aria-hidden="true" /> Hepsini onayla ({bekleyen.length})
            </button>
          )
        )}
      </div>

      {hazir.durum === "yok" && (
        <p className="mb-3 max-w-3xl rounded-lg border border-card-border bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          Onay düğmeleri yalnızca uygulama claude.ai'de, sahibinin hesabıyla açıldığında çalışır. Buradan PR'lara GitHub'da bakabilirsin.
        </p>
      )}
      {hazir.durum === "sahip-degil" && (
        <p className="mb-3 max-w-3xl rounded-lg border border-card-border bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          Önerileri yalnızca uygulamanın sahibi onaylayabilir.
        </p>
      )}

      <ul className="grid gap-2 max-w-5xl">
        {liste.map((k) => {
          const d = durum[k.pr];
          return (
            <li key={k.pr} className={cn("rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3",
              d?.asama === "iletildi" ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-400/40 bg-amber-500/5")}>
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <GitPullRequest className="h-4 w-4 mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{k.oneri}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <a href={`${DEPO}/pull/${k.pr}`} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                      PR #{k.pr}<ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                    {" · "}{tarih(k.tarih)}{k.neden ? <> · {k.neden}</> : null}
                  </p>
                  {d?.hata && (
                    <p className={cn("text-xs mt-1.5 inline-flex items-start gap-1", d.belirsiz ? "text-amber-300" : "text-red-300")} role="status">
                      <CircleAlert className="h-3.5 w-3.5 mt-px shrink-0" aria-hidden="true" />{d.hata}
                    </p>
                  )}
                </div>
              </div>

              {hazir.durum === "hazir" && (
                <div className="shrink-0 flex items-center gap-2" aria-live="polite">
                  {!d || d.asama === "hata" ? (
                    <button type="button" onClick={() => setDurum((x) => ({ ...x, [k.pr]: { asama: "soru" } }))}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-emerald-950 px-3.5 py-2 text-sm font-semibold hover:bg-emerald-400">
                      <Check className="h-4 w-4" aria-hidden="true" /> {d?.asama === "hata" ? "Yeniden dene" : "Onayla"}
                    </button>
                  ) : d.asama === "soru" ? (
                    <>
                      <button type="button" onClick={() => gonder([k.pr])}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-emerald-950 px-3.5 py-2 text-sm font-semibold hover:bg-emerald-400">
                        <Send className="h-4 w-4" aria-hidden="true" /> Evet, birleştir
                      </button>
                      <button type="button" onClick={() => setDurum((x) => { const y = { ...x }; delete y[k.pr]; return y; })}
                        className="rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground">Vazgeç</button>
                    </>
                  ) : d.asama === "gonderiliyor" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> İletiliyor…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
                      <Check className="h-4 w-4" aria-hidden="true" /> Onay iletildi — birkaç dakika içinde birleşir
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
