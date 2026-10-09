import { useMemo, useState } from "react";
import { Link } from "@/components/Nav";
import { ArrowDownRight, ArrowUpRight, DollarSign, ExternalLink, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import data from "@/data/gpu_kiralama.json";
import { getChipById } from "@/data/chips";
import { cn } from "@/lib/utils";
import BellekFiyatlari from "@/components/BellekFiyatlari";

const usd = (v) => (v == null ? "—" : `$${v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
// "Yaygın" filtresi: en az bu kadar sağlayıcının listelediği modeller.
const MIN_SAGLAYICI = 5;
const pct = (v) => `${v > 0 ? "+" : ""}%${Math.abs(v).toLocaleString("tr-TR")}`;

export default function Prices() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("fiyat");
  const [cokSaglayici, setCokSaglayici] = useState(false);

  const rows = useMemo(() => {
    let liste = data.fiyatlar.filter((f) => !q || f.model.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
    if (cokSaglayici) liste = liste.filter((f) => (f.saglayici ?? 0) >= MIN_SAGLAYICI);
    if (sort === "fiyat") liste = [...liste].sort((a, b) => (b.usd_saat ?? -1) - (a.usd_saat ?? -1));
    if (sort === "gb") liste = [...liste].sort((a, b) => (a.usd_saat && a.vram_gb ? a.usd_saat/a.vram_gb : 1e9) - (b.usd_saat && b.vram_gb ? b.usd_saat/b.vram_gb : 1e9));
    if (sort === "degisim") liste = [...liste].sort((a, b) => (b.degisim_pct ?? -999) - (a.degisim_pct ?? -999));
    return liste;
  }, [q, sort, cokSaglayici]);

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><DollarSign className="h-3.5 w-3.5" />Kiralama Fiyatları</div>
        <h1 className="font-display text-3xl font-bold mb-2">AI çipleri bulutta saatlik kaça kiralanıyor?</h1>
        <p className="text-muted-foreground max-w-2xl">{data.kaynak.liste_notu}</p>
        <a href="#bellek" onClick={(e) => { e.preventDefault(); document.getElementById("bellek")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-block mt-3 text-xs text-primary hover:underline">Bellek (DRAM / HBM) fiyatları ↓</a>
      </section>

      <section className="container mx-auto px-4 pb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" title={`GetDeploying fiyat endeksi, ölçüm: ${data.kaynak.olcum_tarihi}`}>Endeks · 4 hafta</p>
            <p className="font-display font-bold text-xl mt-1" style={{ color: data.endeks.degisim_4_hafta_pct < 0 ? "#34d399" : "#f87171" }}>{pct(data.endeks.degisim_4_hafta_pct)}</p>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">ölçüm {data.kaynak.olcum_tarihi}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Model</p>
            <p className="font-display font-bold text-xl mt-1">{data.fiyatlar.length}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Sağlayıcı</p>
            <p className="font-display font-bold text-xl mt-1">{data.kaynak.kapsam?.saglayici ?? "—"}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Çekildiği tarih</p>
            <p className="font-display font-bold text-sm mt-1">{data.kaynak.cekildigi_tarih}</p>
          </div>
        </div>
      </section>

      {data.iki_gun && (
        <section className="container mx-auto px-4 pb-8">
          <h2 className="font-display font-bold text-xl mb-4">Son ölçümler arası hareketler</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-red-400" /><h3 className="font-display font-bold text-red-300">Artanlar</h3></div>
              {data.iki_gun.artanlar.map((it) => (
                <div key={it.model} className="flex items-center justify-between text-sm py-1.5">
                  <span>{it.model}</span>
                  <span className="font-mono text-red-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{pct(it.degisim_pct)}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="h-4 w-4 text-emerald-400" /><h3 className="font-display font-bold text-emerald-300">Düşenler</h3></div>
              {data.iki_gun.dusenler.map((it) => (
                <div key={it.model} className="flex items-center justify-between text-sm py-1.5">
                  <span>{it.model}</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1"><ArrowDownRight className="h-3 w-3" />{pct(it.degisim_pct)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BellekFiyatlari />

      <section className="container mx-auto px-4 pb-16">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-[14rem] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Model ara…" className="pl-8 h-9 text-sm" data-testid="fiyat-arama" />
          </div>
          <div className="flex gap-1.5">
            {[["fiyat","$/saat"],["gb","$/GB"],["degisim","Değişim"]].map(([id,label]) => (
              <button key={id} onClick={() => setSort(id)} className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", sort===id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border")}>{label}</button>
            ))}
          </div>
          <button type="button" onClick={() => setCokSaglayici((v) => !v)} aria-pressed={cokSaglayici} data-testid="fiyat-saglayici-filtre" title={`Yalnızca en az ${MIN_SAGLAYICI} sağlayıcının listelediği modeller`} className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", cokSaglayici ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border")}>
            En az {MIN_SAGLAYICI} sağlayıcı
          </button>
          <span className="text-xs text-muted-foreground font-mono">{rows.length} model</span>
        </div>
        <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
          <div className="overflow-x-auto max-h-[36rem]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/95 backdrop-blur">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase text-muted-foreground">Model</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase text-muted-foreground">Bellek</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">$/saat</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">Değişim</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">Sağlayıcı</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const chip = r.chip_id ? getChipById(r.chip_id) : null;
                  return (
                    <tr key={r.model} className={i % 2 ? "bg-muted/20" : ""}>
                      <td className="px-4 py-2.5 font-medium">
                        {chip ? <Link href={`/chip/${chip.id}`} asChild><a className="text-primary hover:underline">{r.model}</a></Link> : r.model}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.bellek ?? "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-right">{usd(r.usd_saat)}</td>
                      <td className={cn("px-4 py-2.5 font-mono text-right", r.degisim_pct > 0 ? "text-red-400" : r.degisim_pct < 0 ? "text-emerald-400" : "text-muted-foreground")}>
                        {r.degisim_pct == null ? "—" : r.degisim_pct === 0 ? "sabit" : pct(r.degisim_pct)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-right text-muted-foreground">{r.saglayici ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
