import { useMemo, useState } from "react";
import { Link } from "@/components/Nav";
import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, ExternalLink, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import data from "@/data/gpu_kiralama.json";
import { getChipById } from "@/data/chips";
import { cn } from "@/lib/utils";
import BellekFiyatlari from "@/components/BellekFiyatlari";

const usd = (v) => (v == null ? "—" : `$${v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
// Bu sayının altında sağlayıcısı olan modellerde medyan gürültülü olabilir.
const AZ_SAGLAYICI = 5;
// "Yaygın" filtresi: en az bu kadar sağlayıcının listelediği modeller.
const MIN_SAGLAYICI = 5;
const pct = (v) => `${v > 0 ? "+" : ""}%${Math.abs(v).toLocaleString("tr-TR")}`;
// Fiyatlar iki ondalığa yuvarlı geliyor: 0,02 $ → 0,03 $ gibi 1 sentlik oynama
// %50 "hareket" gibi görünür. Kartlarda yalnızca en az 2 sentlik değişimi göster.
const ESIK_USD = 0.02;
const tarihKisa = (t) => new Date(`${t}T12:00:00Z`).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
const gunFarki = (a, b) => Math.round((new Date(`${b}T12:00:00Z`) - new Date(`${a}T12:00:00Z`)) / 86400000);
// Endeks haftalık ölçülür; kaynak bazen haftalarca güncellenmiyor. 14 günden eski ölçüm işaretlenir.
const ENDEKS_ESKI_GUN = 14;
const endeksYasi = (t) => (/^\d{4}-\d{2}-\d{2}$/.test(t || "") ? Math.floor((Date.now() - new Date(`${t}T12:00:00Z`)) / 86400000) : null);
const anlamli = (it) => it.usd_saat == null || it.onceki_usd == null || Math.abs(it.usd_saat - it.onceki_usd) >= ESIK_USD - 1e-9;

/** Nereden ve nasıl kiralamalı: hyperscaler farkı, spot ve rezerve oranları. */
function KiralamaTurleri() {
  const h = data.hyperscaler_farki, sp = data.spot_indirimi, rz = data.rezerve_indirimi;
  if (!h?.satirlar?.length && !sp?.satirlar?.length) return null;
  const kisa = (m) => m.replace(/^Nvidia /, "");
  const oranlar = (sp?.satirlar || []).map((x) => ({ ...x, rezerve: rz?.satirlar?.find((r) => r.model === x.model) }));
  return (
    <section className="container mx-auto px-4 pb-10" aria-labelledby="kiralama-turleri" data-testid="kiralama-turleri">
      <h2 id="kiralama-turleri" className="font-display font-semibold text-xl mb-1">Nereden, nasıl kiralamalı?</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
        Aynı GPU büyük bulutlarda (AWS, Azure, Google Cloud) çoğu zaman iki katına yakın; spot ve rezerve kiralama ise on-demand fiyatın altına iner.
        Ölçüm: <span className="font-mono">{h?.tarih || sp?.tarih}</span>, sağlayıcıların başlangıç fiyatları üzerinden.
      </p>
      <div className="grid lg:grid-cols-2 gap-4">
        {h?.satirlar?.length > 0 && (
          <div className="rounded-lg border border-card-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase text-muted-foreground">Model</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase text-muted-foreground text-right">GPU bulutu</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase text-muted-foreground text-right">Hyperscaler</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase text-muted-foreground text-right">Fark</th>
                </tr>
              </thead>
              <tbody>
                {h.satirlar.map((r) => (
                  <tr key={r.model} className="border-t border-card-border">
                    <td className="px-4 py-2.5">{kisa(r.model)}</td>
                    <td className="px-4 py-2.5 font-mono text-right rakam">{usd(r.gpu_bulutu)}</td>
                    <td className="px-4 py-2.5 font-mono text-right rakam">
                      {usd(r.hyperscaler)}
                      {r.hyperscaler_sayisi < 3 && <span className="block font-sans text-[10px] text-muted-foreground">{r.hyperscaler_sayisi} büyük bulut</span>}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-right text-red-400 rakam">+%{r.fark_pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {oranlar.length > 0 && (
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-baseline justify-between text-[10px] font-mono uppercase text-muted-foreground mb-2">
              <span>On-demand fiyatın yüzdesi</span>
              <span className="inline-flex gap-3"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-primary" />spot</span><span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-foreground/50" />rezerve</span></span>
            </div>
            <ul className="space-y-2.5">
              {oranlar.map((r) => (
                <li key={r.model} className="grid grid-cols-[7rem_1fr] gap-3 items-center text-sm">
                  <span className="truncate">{kisa(r.model)}</span>
                  <span className="space-y-1">
                    <span className="flex items-center gap-2"><span className="h-1.5 bg-primary" style={{ width: `${r.oran_pct * 0.8}%` }} /><span className="font-mono text-[11px] rakam">%{r.oran_pct}</span></span>
                    {r.rezerve && <span className="flex items-center gap-2"><span className="h-1.5 bg-foreground/50" style={{ width: `${r.rezerve.oran_pct * 0.8}%` }} /><span className="font-mono text-[11px] text-muted-foreground rakam">%{r.rezerve.oran_pct}</span></span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{sp.not}</p>
          </div>
        )}
      </div>
    </section>
  );
}

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
    <div className="min-h-[80vh]">
      <section className="container mx-auto px-4 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><DollarSign className="h-3.5 w-3.5" />Kiralama Fiyatları</div>
        <h1 className="font-display text-3xl sm:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.025em] mb-2">AI çipleri bulutta saatlik kaça kiralanıyor?</h1>
        <p className="text-muted-foreground max-w-2xl">{data.kaynak.liste_notu}</p>
        <a href="#bellek" onClick={(e) => { e.preventDefault(); document.getElementById("bellek")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-block mt-3 text-xs text-primary hover:underline">Bellek (DRAM / HBM) fiyatları ↓</a>
      </section>

      <section className="container mx-auto px-4 pb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" title={`GetDeploying fiyat endeksi, ölçüm: ${data.kaynak.olcum_tarihi}`}>Endeks · 4 hafta</p>
            <p className="font-display font-semibold text-xl mt-1" style={{ color: data.endeks.degisim_4_hafta_pct < 0 ? "rgb(var(--t-emerald-400))" : "rgb(var(--t-red-400))" }}>{pct(data.endeks.degisim_4_hafta_pct)}</p>
            {typeof data.endeks.degisim_12_ay_pct === "number" && (
              <p className="text-xs text-muted-foreground mt-0.5" data-testid="endeks-12-ay">
                12 ay: <span className="font-medium tabular-nums" style={{ color: data.endeks.degisim_12_ay_pct < 0 ? "rgb(var(--t-emerald-400))" : "rgb(var(--t-red-400))" }}>{pct(data.endeks.degisim_12_ay_pct)}</span>
              </p>
            )}
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">ölçüm {data.kaynak.olcum_tarihi}</p>
            {endeksYasi(data.kaynak.olcum_tarihi) > ENDEKS_ESKI_GUN && (
              <p className="inline-flex items-center gap-1 mt-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-300" data-testid="endeks-eski">
                <Clock className="h-2.5 w-2.5" aria-hidden="true" />Eski: {endeksYasi(data.kaynak.olcum_tarihi)} gün önce ölçüldü
              </p>
            )}
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Model</p>
            <p className="font-display font-semibold text-xl mt-1">{data.fiyatlar.length}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Sağlayıcı</p>
            <p className="font-display font-semibold text-xl mt-1">{data.kaynak.kapsam?.saglayici ?? "—"}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Çekildiği tarih</p>
            <p className="font-display font-semibold text-sm mt-1">{data.kaynak.cekildigi_tarih}</p>
          </div>
        </div>
      </section>

      {data.iki_gun && (
        <section className="container mx-auto px-4 pb-8">
          <h2 className="font-display font-semibold text-xl mb-1">Son ölçümler arası hareketler</h2>
          {data.iki_gun.baslangic && data.iki_gun.bitis && (
            <p className="font-mono text-[11px] text-muted-foreground mb-3" data-testid="hareket-araligi">
              {tarihKisa(data.iki_gun.baslangic)} → {tarihKisa(data.iki_gun.bitis)} ({gunFarki(data.iki_gun.baslangic, data.iki_gun.bitis)} gün)
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-3">Soluk satırlar {AZ_SAGLAYICI}'ten az sağlayıcıyla listeleniyor; bu modellerde medyan tek bir ilanla büyük oynayabilir.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-red-400" /><h3 className="font-display font-semibold text-red-300">Artanlar</h3></div>
              {data.iki_gun.artanlar.filter(anlamli).map((it) => (
                <div key={it.model} className={cn("flex items-center justify-between text-sm py-1.5", it.saglayici != null && it.saglayici < AZ_SAGLAYICI && "opacity-60")} title={it.saglayici != null && it.saglayici < AZ_SAGLAYICI ? "Az sağlayıcı: medyan tek bir listelemeyle oynayabilir" : undefined}>
                  <span>{it.model}{it.saglayici != null && <span className="ml-2 font-mono text-[10px] text-muted-foreground" data-testid="hareket-saglayici">{it.saglayici} sağlayıcı</span>}</span>
                  <span className="font-mono text-red-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{pct(it.degisim_pct)}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="h-4 w-4 text-emerald-400" /><h3 className="font-display font-semibold text-emerald-300">Düşenler</h3></div>
              {data.iki_gun.dusenler.filter(anlamli).map((it) => (
                <div key={it.model} className={cn("flex items-center justify-between text-sm py-1.5", it.saglayici != null && it.saglayici < AZ_SAGLAYICI && "opacity-60")} title={it.saglayici != null && it.saglayici < AZ_SAGLAYICI ? "Az sağlayıcı: medyan tek bir listelemeyle oynayabilir" : undefined}>
                  <span>{it.model}{it.saglayici != null && <span className="ml-2 font-mono text-[10px] text-muted-foreground" data-testid="hareket-saglayici">{it.saglayici} sağlayıcı</span>}</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1"><ArrowDownRight className="h-3 w-3" />{pct(it.degisim_pct)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <KiralamaTurleri />
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
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase text-muted-foreground">Model</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase text-muted-foreground">Bellek</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">$/saat</th>
                  {sort === "gb" && <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground" data-testid="fiyat-gb-baslik">$/GB·saat</th>}
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">Değişim</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase text-muted-foreground">Sağlayıcı</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const chip = r.chip_id ? getChipById(r.chip_id) : null;
                  return (
                    <tr key={r.model} className={cn(i % 2 && "bg-muted/20", r.saglayici != null && r.saglayici < AZ_SAGLAYICI && "opacity-60")} title={r.saglayici != null && r.saglayici < AZ_SAGLAYICI ? "Az sağlayıcı: medyan tek bir listelemeyle oynayabilir" : undefined} data-az-saglayici={r.saglayici != null && r.saglayici < AZ_SAGLAYICI ? "1" : undefined}>
                      <td className="px-4 py-2.5 font-medium">
                        {chip ? <Link href={`/chip/${chip.id}`} asChild><a className="text-primary hover:underline">{r.model}</a></Link> : r.model}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.bellek ?? "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-right">
                        {usd(r.usd_saat)}
                        {r.usd_saat != null && r.olcum_tarihi && r.olcum_tarihi < data.kaynak.cekildigi_tarih && (
                          <span className="block font-sans text-[10px] text-amber-300/90" data-testid="fiyat-eski" title="Bu model son çekimde gelmedi; gösterilen fiyat daha eski bir ölçüme ait">
                            ölçüm {r.olcum_tarihi}
                          </span>
                        )}
                      </td>
                      {sort === "gb" && (
                        <td className="px-4 py-2.5 font-mono text-right text-muted-foreground">
                          {r.usd_saat && r.vram_gb ? `$${(r.usd_saat / r.vram_gb).toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : "—"}
                        </td>
                      )}
                      <td className={cn("px-4 py-2.5 font-mono text-right", r.degisim_pct > 0 ? "text-red-400" : r.degisim_pct < 0 ? "text-emerald-400" : "text-muted-foreground")}>
                        {r.degisim_pct == null ? "—" : r.degisim_pct === 0 ? "sabit" : pct(r.degisim_pct)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-right text-muted-foreground">{r.saglayici ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground" data-testid="fiyat-bos">
                Eşleşen model yok{q ? ` ("${q}")` : ""}{cokSaglayici ? ` · en az ${MIN_SAGLAYICI} sağlayıcı filtresi açık` : ""}.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
