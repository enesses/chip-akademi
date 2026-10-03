import { useEffect, useState } from "react";
import { Link } from "@/components/Nav";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight, Bot, Cpu, GraduationCap, Layers, MemoryStick, Newspaper, PenTool, Scale, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ChipCard from "@/components/ChipCard";
import HeroDie from "@/components/HeroDie";
import { chips } from "@/data/chips";
import { lessons } from "@/data/lessons";
import { BLOCKS, CHIP_TYPES, NODES } from "@/data/blocks";
import bugun from "@/data/bugun.json";
import fiyat from "@/data/gpu_kiralama.json";
import otomasyon from "@/data/otomasyon.json";
import { getCompleted } from "@/lib/progress";
import { listDesigns } from "@/lib/designs";
import { profilDegisimineAbone } from "@/lib/hesap";
import { cn } from "@/lib/utils";

const KATEGORILER = [
  { id: "GPU", ad: "GPU", alt: "Grafik ve AI hızlandırıcılar", ikon: Zap,
    metin: "Blackwell B300'den Arc B580'e — veri merkezi hızlandırıcıları, oyun kartları ve mobil GPU'lar." },
  { id: "CPU", ad: "CPU", alt: "Merkezi işlem birimleri", ikon: Cpu,
    metin: "Zen 5, Arrow Lake, Panther Lake, Apple M4, Snapdragon X — masaüstü, dizüstü ve sunucu işlemcileri." },
  { id: "RAM", ad: "Bellek", alt: "RAM ve VRAM teknolojileri", ikon: MemoryStick,
    metin: "DDR5, LPDDR5X, GDDR7 ve HBM3E — işlemcilerin ne kadar hızlı beslenebileceğini belirleyen bellekler." },
];
const ONE_CIKAN = ["nvidia-blackwell-b200", "nvidia-blackwell-rtx-5090", "amd-zen5-ryzen-9-9950x", "ram-hbm3e"];

const usd = (v) => `$${v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (v) => `${v > 0 ? "+" : "−"}%${Math.abs(v).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`;
const puanRengi = (p) => (p >= 65 ? "#34d399" : p >= 45 ? "#f59e0b" : "#f87171");
const DURUM_AD = { temiz: "temiz", dikkat: "dikkat", kritik: "kritik" };

function BolumBaslik({ children, sag }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <h2 className="font-display font-bold text-2xl tracking-tight">{children}</h2>
      {sag}
    </div>
  );
}

function Etiket({ ikon: Ikon, children, renk = "text-primary" }) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] mb-3", renk)}>
      <Ikon className="h-3.5 w-3.5" aria-hidden="true" />{children}
    </div>
  );
}

/** Link + Button: tek sekme durağı olsun diye düğme odak sırasından çıkarılır, odak Link'te kalır. */
function LinkDugme({ href, children, ...p }) {
  return (
    <Link href={href} className="inline-flex rounded-lg">
      <Button tabIndex={-1} {...p}>{children}</Button>
    </Link>
  );
}

export default function Home() {
  const [ilerleme, setIlerleme] = useState({ bitti: [], tasarim: 0 });
  useEffect(() => {
    const yenile = () => setIlerleme({ bitti: getCompleted(), tasarim: listDesigns().length });
    yenile();
    return profilDegisimineAbone(yenile);
  }, []);

  const sayilar = Object.fromEntries(KATEGORILER.map((k) => [k.id, chips.filter((c) => c.category === k.id).length]));
  const yillar = chips.map((c) => c.release_year).filter(Boolean);
  const oneCikanlar = ONE_CIKAN.map((id) => chips.find((c) => c.id === id)).filter(Boolean);

  const h100 = fiyat.fiyatlar.find((f) => f.model === "Nvidia H100");
  const artan = fiyat.iki_gun?.artanlar?.[0];
  const dusen = fiyat.iki_gun?.dusenler?.[0];
  const puan = bugun.puan?.deger;
  const bitenSayi = ilerleme.bitti.length;
  const hepsiBitti = bitenSayi >= lessons.length;
  const dersOrani = Math.round((bitenSayi / lessons.length) * 100);
  const sonraki = lessons.find((l) => !ilerleme.bitti.includes(l.id)) || lessons[0];

  return (
    <div>
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-silicon-grid opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 bg-chip-glow" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-14 md:py-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              {chips.length} çip · 3 kategori · en yenisi {Math.max(...yillar)}
            </div>
            <h1 className="font-display font-bold tracking-tight text-[2.6rem] leading-[1.05] sm:text-6xl">
              Modern bir çipin<br /><span className="text-gradient-cyan">içinde neler var?</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Blackwell, Zen 5, Apple M4, HBM3E… Günümüzün en güçlü işlemcilerinin mimarisini, die haritalarını ve teknik özelliklerini
              Türkçe, görsellerle ve sıfırdan anlatan bir rehber. Okuyup geçmekle kalmayıp <span className="text-foreground">kendi çipini de tasarlayabilirsin</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkDugme href="/kategori/GPU" size="lg">GPU'ları keşfet<ArrowRight className="h-4 w-4" /></LinkDugme>
              <LinkDugme href="/egitim" size="lg" variant="outline"><GraduationCap className="h-4 w-4" />Sıfırdan öğren</LinkDugme>
              <LinkDugme href="/tasarla" size="lg" variant="outline"><PenTool className="h-4 w-4" />Çip tasarla</LinkDugme>
            </div>
          </div>
          <HeroDie className="w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto" />
        </div>
      </section>

      {/* ------------------------------------------------------------------ günün özeti */}
      <section className="container mx-auto px-4 py-10" aria-label="Günün özeti">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-4">
          <Link href="/bugun" asChild>
            <a className="group rounded-2xl border border-card-border bg-card p-5 hover-elevate flex gap-5 items-start" data-testid="ozet-bugun">
              <div className="shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center border" style={{ borderColor: `${puanRengi(puan)}55`, background: `${puanRengi(puan)}12` }}>
                <span className="font-display font-bold text-3xl leading-none" style={{ color: puanRengi(puan) }}>{puan}</span>
                <span className="font-mono text-[9px] text-muted-foreground mt-1">/ 100</span>
              </div>
              <div className="min-w-0">
                <Etiket ikon={Newspaper}>Bugün · {bugun.derlenme}</Etiket>
                <p className="font-display font-semibold leading-snug">{bugun.puan?.etiket}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bugun.maddeler?.[0]?.baslik}</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary mt-2 group-hover:gap-2 transition-all">{bugun.maddeler?.length} gelişme <ArrowRight className="h-3 w-3" /></span>
              </div>
            </a>
          </Link>
          <Link href="/fiyatlar" asChild>
            <a className="group rounded-2xl border border-card-border bg-card p-5 hover-elevate block">
              <Etiket ikon={Layers}>Kiralama · {fiyat.kaynak.cekildigi_tarih}</Etiket>
              {h100 && (
                <p className="text-sm text-muted-foreground">H100 saati <span className="font-display font-bold text-xl text-foreground ml-1">{usd(h100.usd_saat)}</span></p>
              )}
              <div className="mt-3 space-y-1.5 text-xs">
                {artan && <p className="flex items-center gap-1.5"><ArrowUpRight className="h-3.5 w-3.5 text-red-400 shrink-0" /><span className="truncate">{artan.model}</span><span className="ml-auto font-mono text-red-300">{pct(artan.degisim_pct)}</span></p>}
                {dusen && <p className="flex items-center gap-1.5"><ArrowDownRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" /><span className="truncate">{dusen.model}</span><span className="ml-auto font-mono text-emerald-300">{pct(dusen.degisim_pct)}</span></p>}
              </div>
            </a>
          </Link>
          <Link href="/otomasyon" asChild>
            <a className="group rounded-2xl border border-card-border bg-card p-5 hover-elevate block">
              <Etiket ikon={Bot}>Otomasyon · {otomasyon.tarih}</Etiket>
              <p className="text-sm">Her sabah 10:00'da veriler yenilenir, uygulama gerçek bir tarayıcıda test edilir.</p>
              <p className="text-xs text-muted-foreground mt-2">
                Durum: <span style={{ color: otomasyon.durum === "temiz" ? "#34d399" : otomasyon.durum === "kritik" ? "#f87171" : "#f59e0b" }}>{DURUM_AD[otomasyon.durum] ?? otomasyon.durum}</span>
                {otomasyon.oneriler?.length ? ` · ${otomasyon.oneriler.length} geliştirme önerisi` : ""}
              </p>
            </a>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ kategoriler */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik>Kategoriye göre keşfet</BolumBaslik>
        <div className="grid md:grid-cols-3 gap-4">
          {KATEGORILER.map((k) => (
            <Link key={k.id} href={`/kategori/${k.id}`} asChild>
              <a className="group relative rounded-2xl border border-card-border bg-card p-6 hover-elevate overflow-hidden block" data-testid={`kategori-${k.id}`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" aria-hidden="true" />
                <div className="relative flex items-start justify-between">
                  <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><k.ikon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="font-mono text-[11px] text-muted-foreground tracking-wider">{sayilar[k.id]} ÜRÜN</span>
                </div>
                <h3 className="relative font-display font-bold text-xl mt-5">{k.ad}</h3>
                <p className="relative font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1">{k.alt}</p>
                <p className="relative text-sm text-muted-foreground mt-3 leading-relaxed">{k.metin}</p>
                <span className="relative inline-flex items-center gap-1 text-sm text-primary mt-4 group-hover:gap-2 transition-all">Keşfet <ArrowRight className="h-3.5 w-3.5" /></span>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ öne çıkanlar */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik sag={<Link href="/karsilastir" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">Karşılaştır <ArrowRight className="h-3.5 w-3.5" /></Link>}>
          Öne çıkanlar
        </BolumBaslik>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {oneCikanlar.map((c) => <ChipCard key={c.id} chip={c} />)}
        </div>
      </section>

      {/* ------------------------------------------------------------------ eğitim */}
      <section className="container mx-auto px-4 py-6">
        <div className="relative rounded-3xl border border-primary/25 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" aria-hidden="true" />
          <div className="relative p-7 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <Etiket ikon={GraduationCap}>Eğitim</Etiket>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Hiç bilmiyorsan da olur — <span className="text-gradient-cyan">sıfırdan başla.</span></h2>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                Transistörden mantık kapılarına, litografiden chiplet'lere kadar {lessons.length} ders. Her dersin sonunda kısa bir test,
                hepsinin sonunda da seviyeni ölçen 20 soruluk bir sınav.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {lessons.slice(0, 6).map((l) => (
                  <Link key={l.id} href={`/egitim/${l.id}`} className={cn("font-mono text-[11px] px-2.5 py-1 rounded-md border bg-background/40 hover:text-foreground hover:border-primary/40",
                    ilerleme.bitti.includes(l.id) ? "border-emerald-500/40 text-emerald-300" : "border-border text-muted-foreground")}>
                    {l.title.split(/[:?—]/)[0].trim()}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-card-border bg-card/80 p-5 w-full md:w-72">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">İlerlemen</p>
                <p className="font-display font-bold">{bitenSayi}/{lessons.length}</p>
              </div>
              <div className="h-2 rounded-full bg-muted/50 mt-2 overflow-hidden" role="progressbar" aria-valuenow={dersOrani} aria-valuemin={0} aria-valuemax={100} aria-label="Ders ilerlemesi">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${dersOrani}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">{hepsiBitti ? "Bütün dersler bitti" : "Sıradaki ders"}</p>
              <p className="text-sm font-medium leading-snug mt-0.5">{hepsiBitti ? "Seviyeni ölçmenin zamanı geldi." : sonraki.title}</p>
              <div className="mt-4 [&>span]:flex [&_button]:w-full">
                <LinkDugme href={hepsiBitti ? "/sinav" : `/egitim/${sonraki.id}`}>
                  {bitenSayi === 0 ? "Eğitime başla" : hepsiBitti ? "Seviye sınavına gir" : "Devam et"}<ArrowRight className="h-4 w-4" />
                </LinkDugme>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ atölye + karşılaştır */}
      <section className="container mx-auto px-4 py-6 grid lg:grid-cols-2 gap-4">
        <div className="relative rounded-3xl border border-purple-500/25 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" aria-hidden="true" />
          <div className="relative p-7 md:p-8 h-full flex flex-col">
            <Etiket ikon={PenTool} renk="text-purple-300">Tasarım atölyesi</Etiket>
            <h2 className="font-display font-bold text-2xl tracking-tight">Kendi çipini tasarla.</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              CPU mu, GPU mu, mobil SoC mu yoksa AI hızlandırıcı mı? Tipini ve süreç düğümünü seç, blokları die ızgarasına sürükle.
              Alan, güç, üretim verimi ve maliyet anında hesaplansın; beş danışman nerede iyileştirebileceğini söylesin.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {[`${CHIP_TYPES.length} çip tipi`, `${BLOCKS.length} blok`, `${NODES.length} süreç düğümü`, "5 danışman", "Isı haritası"].map((t) => (
                <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-border bg-background/40 text-muted-foreground">{t}</span>
              ))}
            </div>
            <div className="mt-auto pt-6 flex flex-wrap items-center gap-4">
              <LinkDugme href="/tasarla">Tasarlamaya başla<ArrowRight className="h-4 w-4" /></LinkDugme>
              {ilerleme.tasarim > 0 && <Link href="/atolye" className="text-sm text-muted-foreground hover:text-foreground">{ilerleme.tasarim} kayıtlı tasarımın →</Link>}
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl border border-card-border bg-card overflow-hidden">
          <div className="relative p-7 md:p-8 h-full flex flex-col">
            <Etiket ikon={Scale}>Karşılaştır</Etiket>
            <h2 className="font-display font-bold text-2xl tracking-tight">Yan yana koy, farkı gör.</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Yedi çipe kadar aynı tabloda; her ölçütte en iyisi işaretlenir. Kendi tasarımını da ekleyip gerçek bir H100 ya da Ryzen ile
              transistör, yoğunluk ve watt başına verim üzerinden kıyaslayabilirsin.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[["7", "çipe kadar"], ["5", "fiziksel ölçüt"], ["17", "tasarım ölçütü"]].map(([s, e]) => (
                <div key={e} className="rounded-xl border border-border bg-background/40 py-3">
                  <p className="font-display font-bold text-xl">{s}</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{e}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <LinkDugme href="/karsilastir" variant="outline">Karşılaştırmayı aç<ArrowRight className="h-4 w-4" /></LinkDugme>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ nasıl kullanılır */}
      <section className="container mx-auto px-4 py-14">
        <BolumBaslik>Site nasıl kullanılır?</BolumBaslik>
        <ol className="grid md:grid-cols-3 gap-4">
          {[
            ["Kategori seç", "GPU, CPU ya da bellek — incelemek istediğin alanı seç ve listeden bir çip aç."],
            ["Die haritasına tıkla", "Çip sayfasında görselin üzerindeki renkli bölgelere tıklayarak her bileşenin ne işe yaradığını öğren."],
            ["Dene ve kıyasla", "Atölye'de kendi çipini kur, Karşılaştır'da gerçek çiplerle yan yana koy, bilmediğin terimi Sözlük'te ara."],
          ].map(([b, m], i) => (
            <li key={b} className="rounded-2xl border border-card-border bg-card p-6">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="font-display font-semibold text-lg mt-2">{b}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
