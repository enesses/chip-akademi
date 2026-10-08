import { Link } from "@/components/Nav";
import { Bot, CalendarRange, GitMerge, GitPullRequest, Ban, CheckCircle2, CircleAlert, Lightbulb, RefreshCw, Shield, TrendingUp, Wrench, XCircle } from "lucide-react";
import data from "@/data/otomasyon.json";
import { cn } from "@/lib/utils";

const AJAN_IKON = { guvenlik: Shield, iyilestirme: TrendingUp, yenileme: RefreshCw, gelistirme: Wrench };
const DURUM_RENK = { temiz: "#34d399", tamam: "#34d399", ok: "#34d399", uygulandi: "#34d399", "degisiklik-yok": "#94a3b8",
  dikkat: "#f59e0b", kismi: "#f59e0b", kritik: "#f87171", "test-hatasi": "#f87171", "geri-alindi": "#f87171" };
const DURUM_AD = { temiz: "temiz", tamam: "tamam", ok: "tamam", uygulandi: "uygulandı", "degisiklik-yok": "değişiklik yok",
  dikkat: "dikkat", kismi: "kısmi", kritik: "kritik", "test-hatasi": "test hatası", "geri-alindi": "geri alındı", kuru: "deneme" };
const ETKI_RENK = { yüksek: "#f87171", orta: "#f59e0b", düşük: "#94a3b8" };
const renkAl = (d) => DURUM_RENK[d] ?? "#94a3b8";
const adAl = (d) => DURUM_AD[d] ?? d ?? "tamam";

function Bolum({ baslik, children }) {
  return (
    <section className="container mx-auto px-4 pb-10">
      <h2 className="font-display font-bold text-xl mb-4">{baslik}</h2>
      {children}
    </section>
  );
}

export default function Otomasyon() {
  const genelRenk = renkAl(data.durum);
  const testler = data.gelistirme?.testler || [];
  const adimlar = data.yenileme?.adimlar || [];
  const bulgular = data.iyilestirme?.bulgular || [];
  const oneriler = data.oneriler || [];
  const uygulanan = data.uygulanan || [];
  // Önerinin uygulanıp uygulanmadığı: son 14 günün kayıtlarında başlık eşleşmesi.
  const sade = (s) => String(s).toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const uygulamaKaydi = new Map((data.uygulananSon || []).filter((k) => k.durum !== "vazgecildi").map((k) => [sade(k.oneri), k]));
  const gecmis = data.gecmis || [];

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><Bot className="h-3.5 w-3.5" />Otomasyon</div>
        <h1 className="font-display text-3xl font-bold mb-2">Ajanlar bu uygulamayı her gün 10:00'da denetliyor.</h1>
        <p className="text-muted-foreground">
          Son çalışma: <span className="text-foreground">{data.tarih}</span> · Genel durum:{" "}
          <span style={{ color: genelRenk }}>{adAl(data.durum)}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2 max-w-2xl">
          Sıra: fiyatlar ve "Bugün" yenilenir → güvenlik taraması → iyileştirme taraması → derleme ve gerçek tarayıcıda arayüz testi → rapor.
          Ardından en fazla iki geliştirme önerisi uygulanır; testler geçerse kendiliğinden birleşir.
        </p>
        <Link href="/haftalik" asChild>
          <a className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <CalendarRange className="h-4 w-4" aria-hidden="true" /> Haftalık raporu aç
          </a>
        </Link>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.ajanlar.map((a) => {
            const Icon = AJAN_IKON[a.id] ?? Bot;
            const renk = a.calisti ? renkAl(a.durum) : "#94a3b8";
            return (
              <div key={a.id} className="rounded-xl border border-card-border bg-card p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${renk}20`, color: renk }}><Icon className="h-4 w-4" /></span>
                  <p className="font-display font-bold text-sm">{a.ad}</p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider rounded px-1.5 py-0.5 border" style={{ color: renk, borderColor: `${renk}55`, background: `${renk}15` }}>
                  {a.calisti ? adAl(a.durum) : "çalışmadı"}
                </span>
              </div>
            );
          })}
        </div>
        {gecmis.length > 1 && (
          <div className="mt-4 flex items-center gap-1.5 flex-wrap" aria-label="Son günlerin durumu">
            <span className="font-mono text-[10px] text-muted-foreground mr-1">Son {gecmis.length} gün</span>
            {gecmis.map((g) => (
              <span key={g.tarih} title={`${g.tarih}: ${adAl(g.durum)} (${g.dikkat} uyarı)`} className="w-3.5 h-3.5 rounded-sm" style={{ background: renkAl(g.durum) }} />
            ))}
          </div>
        )}
      </section>

      {data.dikkat?.length > 0 && (
        <Bolum baslik="Bulunan hatalar ve uyarılar">
          <div className="space-y-2 max-w-3xl">
            {data.dikkat.map((x, i) => (
              <div key={i} className={cn("rounded-xl border p-4 flex items-start gap-3", x.seviye === "kritik" ? "border-red-500/40 bg-red-500/5" : "border-amber-400/40 bg-amber-500/5")}>
                <CircleAlert className={cn("h-4 w-4 mt-0.5 shrink-0", x.seviye === "kritik" ? "text-red-400" : "text-amber-300")} />
                <p className="text-sm text-foreground/85 leading-relaxed">{x.metin}</p>
              </div>
            ))}
          </div>
        </Bolum>
      )}

      {uygulanan.length > 0 && (
        <Bolum baslik="Bugün uygulanan öneriler">
          <ul className="grid gap-2 max-w-5xl">
            {uygulanan.map((k, i) => {
              const Ikon = k.durum === "birlesti" ? GitMerge : k.durum === "acik" ? GitPullRequest : Ban;
              const renk = k.durum === "birlesti" ? "#34d399" : k.durum === "acik" ? "#f59e0b" : "#94a3b8";
              const ad = k.durum === "birlesti" ? "birleşti" : k.durum === "acik" ? "onay bekliyor" : "bırakıldı";
              return (
                <li key={i} className="rounded-xl border border-card-border bg-card p-3.5 flex items-start gap-2.5">
                  <Ikon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: renk }} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{k.oneri}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span style={{ color: renk }}>{ad}</span>
                      {k.pr ? <> · PR #{k.pr}</> : null}
                      {k.neden ? <> · {k.neden}</> : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Bolum>
      )}

      {oneriler.length > 0 && (
        <Bolum baslik="Geliştirme önerileri">
          <div className="grid md:grid-cols-2 gap-3 max-w-5xl">
            {oneriler.map((o, i) => (
              <div key={i} className="rounded-xl border border-card-border bg-card p-4">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">{o.baslik}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{o.neden}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(() => {
                        const k = uygulamaKaydi.get(sade(o.baslik));
                        if (!k) return null;
                        const bekliyor = k.durum === "acik";
                        const renk = bekliyor ? "#f59e0b" : "#34d399";
                        return (
                          <span className="font-mono text-[9px] uppercase rounded px-1.5 py-0.5 border" style={{ color: renk, borderColor: `${renk}55`, background: `${renk}15` }}>
                            {bekliyor ? "onay bekliyor" : "uygulandı"}{k.pr ? ` · PR #${k.pr}` : ""}
                          </span>
                        );
                      })()}
                      {o.etki && <span className="font-mono text-[9px] uppercase rounded px-1.5 py-0.5 border" style={{ color: ETKI_RENK[o.etki], borderColor: `${ETKI_RENK[o.etki]}55` }}>{o.etki} etki</span>}
                      {o.alan && <span className="font-mono text-[9px] uppercase text-muted-foreground">{o.alan}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Bolum>
      )}

      <section className="container mx-auto px-4 pb-16 grid lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Veri yenileme</p>
          {adimlar.length === 0 && <p className="text-xs text-muted-foreground">Kayıt yok.</p>}
          {adimlar.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-xs mb-2">
              {a.durum === "ok" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", a.durum === "hata" ? "text-red-400" : "text-muted-foreground")} />}
              <span><span className="font-medium">{a.ad}:</span> <span className="text-muted-foreground">{a.detay}</span></span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Testler</p>
          {testler.length === 0 && <p className="text-xs text-muted-foreground">Kayıt yok.</p>}
          {testler.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs mb-2">
              {t.gecti ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
              <span>{t.ad}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Tarama bulguları</p>
          {bulgular.length === 0 && <p className="text-xs text-muted-foreground">Bulgu yok.</p>}
          {bulgular.map((b, i) => (
            <div key={i} className="text-xs mb-2 flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ETKI_RENK[b.etki] ?? "#94a3b8" }} />
              <span>{b.baslik}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
