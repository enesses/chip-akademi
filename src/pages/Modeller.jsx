import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Search, Sparkles, Trophy } from "lucide-react";
import data from "@/data/modeller.json";
import { Link } from "@/components/Nav";
import { cn } from "@/lib/utils";

const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const tarih = (iso) => { if (!iso) return "—"; const [y, a, g] = iso.split("-").map(Number); return `${g} ${AY[a - 1]} ${y}`; };
const tr = (v, b = 0) => v.toLocaleString("tr-TR", { minimumFractionDigits: b, maximumFractionDigits: b });
const dolar = (v) => (v == null ? "—" : `$${tr(v, v < 0.1 ? 3 : v < 100 ? 2 : 0)}`);

/** Sütunlar: yon "azalan" = büyük olan iyi (ilk tıkta büyükten küçüğe). */
const SUTUNLAR = [
  { id: "zeka", ad: "Zekâ", ipucu: "Artificial Analysis Intelligence Index — birçok zor testin birleşik puanı", yon: "azalan", bicim: (v) => tr(v, 1) },
  { id: "kodlama", ad: "Kodlama", ipucu: "Coding Index", yon: "azalan", bicim: (v) => tr(v, 1) },
  { id: "ajan", ad: "Ajan", ipucu: "Agentic Index — araç kullanarak çok adımlı iş yapma", yon: "azalan", bicim: (v) => tr(v, 1) },
  { id: "girdi", ad: "Girdi $/1M", ipucu: "1 milyon girdi token'ı fiyatı (USD)", yon: "artan", bicim: dolar },
  { id: "cikti", ad: "Çıktı $/1M", ipucu: "1 milyon çıktı token'ı fiyatı (USD)", yon: "artan", bicim: dolar },
  { id: "hiz", ad: "Hız", ipucu: "Saniyede üretilen çıktı token'ı (medyan)", yon: "azalan", bicim: (v) => `${tr(v)} t/s` },
  { id: "ilkToken", ad: "İlk yanıt", ipucu: "İlk token'a kadar geçen süre (medyan, saniye)", yon: "artan", bicim: (v) => `${tr(v, v < 10 ? 2 : 0)} sn` },
];

function Bos() {
  return (
    <div className="rounded-2xl border border-dashed border-card-border bg-card/40 p-8 text-center max-w-2xl mx-auto">
      <Trophy className="h-8 w-8 text-muted-foreground mx-auto" aria-hidden="true" />
      <h2 className="font-display font-semibold text-lg mt-3">Tablo ilk yenilemeyi bekliyor</h2>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Sıralama her hafta Artificial Analysis'in resmi API'sinden çekilir. İlk çekim yapılınca modeller burada
        listelenecek. Tahmini ya da elle yazılmış veri gösterilmez.
      </p>
      <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4">
        Güncel sıralamayı kaynağında gör <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}

export default function Modeller() {
  const tum = data.modeller || [];
  const [sirala, setSirala] = useState({ id: "zeka", yon: "azalan" });
  const [sirket, setSirket] = useState("hepsi");
  const [ara, setAra] = useState("");
  const [hepsi, setHepsi] = useState(false);

  const enIyiZeka = useMemo(() => Math.max(1, ...tum.map((m) => m.zeka ?? 0)), [tum]);
  // Zekâ sırası sabittir (filtre/sıralama değişse de modelin genel sırası görünür).
  const genelSira = useMemo(() => new Map(tum.filter((m) => m.zeka != null).map((m, i) => [m.id, i + 1])), [tum]);
  const sirketler = useMemo(() => {
    const say = new Map();
    for (const m of tum) say.set(m.sirket, (say.get(m.sirket) || 0) + 1);
    return [...say.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr")).map(([s]) => s);
  }, [tum]);

  const liste = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const s = tum.filter((m) => (sirket === "hepsi" || m.sirket === sirket) &&
      (!q || m.ad.toLocaleLowerCase("tr").includes(q) || m.sirket.toLocaleLowerCase("tr").includes(q)));
    const k = sirala.yon === "azalan" ? -1 : 1;
    // Değeri olmayanlar (ölçülmemiş) her iki yönde de sona.
    return [...s].sort((a, b) => {
      const x = a[sirala.id], y = b[sirala.id];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return (x - y) * k;
    });
  }, [tum, sirket, ara, sirala]);

  const filtreli = sirket !== "hepsi" || ara.trim();
  const gorunen = hepsi || filtreli ? liste : liste.slice(0, 30);

  const basligaTikla = (s) => setSirala((o) => o.id === s.id ? { id: s.id, yon: o.yon === "azalan" ? "artan" : "azalan" } : { id: s.id, yon: s.yon });

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />AI Araçları
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">En iyi yapay zekâ modelleri</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Dil modellerinin zekâ, kodlama ve ajan puanları; fiyatları ve hızları tek tabloda. Başlığa tıklayarak
          istediğin ölçüte göre sırala. Tablo her hafta yenilenir.
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Veri: <a href={data.kaynak?.url || "https://artificialanalysis.ai"} target="_blank" rel="noreferrer" className="text-primary hover:underline">Artificial Analysis</a>
          {data.guncellendi ? <> · son güncelleme {tarih(data.guncellendi)}</> : null}
          {data.endeksSurumu ? <> · Intelligence Index v{data.endeksSurumu}</> : null}
          {" · "}Model seçerken işine yarayacak <Link href="/ai/promptlar" className="text-primary hover:underline">prompt'lara</Link> da bak.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        {!tum.length ? <Bos /> : (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <label className="relative flex-1 min-w-[180px] max-w-xs">
                <span className="sr-only">Model ara</span>
                <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Model ya da şirket ara"
                  className="w-full rounded-lg border border-card-border bg-card pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60" />
              </label>
              <label className="text-sm">
                <span className="sr-only">Şirket</span>
                <select value={sirket} onChange={(e) => setSirket(e.target.value)}
                  className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary/60">
                  <option value="hepsi">Tüm şirketler ({tum.length})</option>
                  {sirketler.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <span className="text-xs text-muted-foreground ml-auto">{liste.length} model</span>
            </div>

            <div className="rounded-2xl border border-card-border bg-card overflow-x-auto">
              <table className="w-full text-sm min-w-[860px]">
                <thead>
                  <tr className="border-b border-card-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-3 py-2.5 w-10 font-medium">#</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Model</th>
                    {SUTUNLAR.map((s) => {
                      const aktif = sirala.id === s.id;
                      return (
                        <th key={s.id} scope="col" className="px-3 py-2.5 font-medium text-right whitespace-nowrap"
                          aria-sort={aktif ? (sirala.yon === "azalan" ? "descending" : "ascending") : "none"}>
                          <button type="button" title={s.ipucu} onClick={() => basligaTikla(s)}
                            className={cn("inline-flex items-center gap-1 hover:text-foreground", aktif && "text-foreground")}>
                            {s.ad}
                            {aktif && (sirala.yon === "azalan" ? <ArrowDown className="h-3 w-3" aria-hidden="true" /> : <ArrowUp className="h-3 w-3" aria-hidden="true" />)}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {gorunen.map((m) => {
                    const sira = genelSira.get(m.id);
                    return (
                      <tr key={m.id} className="border-b border-card-border/60 last:border-0 hover:bg-primary/5">
                        <td className={cn("px-3 py-2.5 tabular-nums text-xs", sira <= 3 ? "text-primary font-semibold" : "text-muted-foreground")}>{sira ?? "—"}</td>
                        <td className="px-3 py-2.5">
                          <p className="font-medium leading-snug">{m.ad}</p>
                          <p className="text-[11px] text-muted-foreground">{m.sirket}{m.yayin ? ` · ${tarih(m.yayin)}` : ""}</p>
                        </td>
                        {SUTUNLAR.map((s) => (
                          <td key={s.id} className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">
                            {m[s.id] == null ? <span className="text-muted-foreground" title="Ölçülmemiş">—</span> : s.id === "zeka" ? (
                              <span className="inline-flex items-center gap-2 justify-end">
                                <span className="hidden sm:block h-1.5 w-16 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                                  <span className="block h-full bg-primary" style={{ width: `${(m.zeka / enIyiZeka) * 100}%` }} />
                                </span>
                                <span className="font-semibold">{s.bicim(m.zeka)}</span>
                              </span>
                            ) : s.bicim(m[s.id])}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!filtreli && !hepsi && liste.length > 30 && (
              <div className="text-center mt-4">
                <button type="button" onClick={() => setHepsi(true)}
                  className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50">
                  Tüm modelleri göster ({liste.length})
                </button>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground mt-4 max-w-3xl leading-relaxed">
              "—" ölçülmemiş demektir, sıfır değil. Puanlar Artificial Analysis'in kendi testleriyle hesaplanır; fiyat ve
              hız, sağlayıcılar arasındaki medyan değerlerdir. Ayrıntı ve yöntem için{" "}
              <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noreferrer" className="text-primary hover:underline">kaynağa</a> bak.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
