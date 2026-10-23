import { useOturum } from "@/lib/oturum";
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
import haberAkisi from "@/data/haberler.json";
import fiyat from "@/data/gpu_kiralama.json";
import otomasyon from "@/data/otomasyon.json";
import { getCompleted } from "@/lib/progress";
import { listDesigns } from "@/lib/designs";
import { profilDegisimineAbone } from "@/lib/hesap";
import { cn } from "@/lib/utils";
import BolumRehberi, { AramaGirisi } from "@/components/nav/BolumRehberi";

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
const puanSinifi = (p) => (p >= 65 ? "text-emerald-400" : p >= 45 ? "text-amber-400" : "text-red-400");
const DURUM_AD = { temiz: "temiz", dikkat: "dikkat", kritik: "kritik" };
const DURUM_SINIF = { temiz: "text-emerald-400", dikkat: "text-amber-400", kritik: "text-red-400" };

/** Numaralı bölüm başlığı: "01 — Başlık" ve altında ince çizgi (datasheet usulü). */
function BolumBaslik({ no, children, sag, id }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 pb-3 border-b border-border">
      <h2 id={id} className="font-display font-semibold text-[22px] tracking-[-0.01em] flex items-baseline gap-3">
        {no && <span className="font-mono text-xs text-primary font-medium rakam">{no}</span>}
        {children}
      </h2>
      {sag}
    </div>
  );
}

function Etiket({ ikon: Ikon, children }) {
  return (
    <div className="etiket inline-flex items-center gap-1.5 mb-3">
      {Ikon && <Ikon className="h-3.5 w-3.5" aria-hidden="true" />}{children}
    </div>
  );
}

function OkBaglanti({ href, children }) {
  return (
    <Link href={href} className="text-sm font-medium text-foreground inline-flex items-center gap-1 hover:text-primary underline decoration-border underline-offset-4 hover:decoration-primary">
      {children} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

/** Link + Button: tek sekme durağı olsun diye düğme odak sırasından çıkarılır, odak Link'te kalır. */
function LinkDugme({ href, children, ...p }) {
  return (
    <Link href={href} className="inline-flex rounded-md">
      <Button tabIndex={-1} {...p}>{children}</Button>
    </Link>
  );
}

// Bugün kartı günün maddelerini zaten özetliyor; burada akışın ek haberlerinden en yeni 3'ü
const SON_HABERLER = (() => {
  const tum = haberAkisi.haberler || [];
  const ek = tum.filter((h) => h.kaynakTuru !== "bugun");
  return (ek.length >= 3 ? ek : tum).slice(0, 3);
})();

export default function Home() {
  const { admin } = useOturum();
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
  // Ana sayfada tek satır var: 3–4 sağlayıcılı ince pazarların gürültüsü
  // (ör. 0,36 → 0,06 $) yerine en az 5 sağlayıcılı ilk hareketi göster.
  const gucluHareket = (liste) => (liste || []).find((f) => (f.saglayici ?? 0) >= 5);
  const artan = gucluHareket(fiyat.iki_gun?.artanlar);
  const dusen = gucluHareket(fiyat.iki_gun?.dusenler);
  const puan = bugun.puan?.deger;
  const bitenSayi = ilerleme.bitti.length;
  const hepsiBitti = bitenSayi >= lessons.length;
  const dersOrani = Math.round((bitenSayi / lessons.length) * 100);
  const sonraki = lessons.find((l) => !ilerleme.bitti.includes(l.id)) || lessons[0];

  const OZELLIKLER = [
    ["Çip", chips.length, `en yenisi ${Math.max(...yillar)}`],
    ["Ders", lessons.length, "sıfırdan, testli"],
    ["Tasarım bloğu", BLOCKS.length, `${CHIP_TYPES.length} çip tipi`],
    ["Süreç düğümü", NODES.length, "atölyede seçilebilir"],
  ];

  return (
    <div>
      {/* ------------------------------------------------------------------ hero */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 pt-12 pb-10 md:pt-20 md:pb-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div>
            <p className="etiket flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-primary" aria-hidden="true" />
              Türkçe yarı iletken rehberi
            </p>
            <h1 className="font-display font-semibold tracking-[-0.025em] text-[2.6rem] leading-[1.04] sm:text-[3.75rem] max-w-[14ch]">
              Modern bir çipin içinde neler var?
            </h1>
            <p className="mt-6 text-[17px] text-muted-foreground leading-relaxed max-w-xl">
              Blackwell, Zen 5, Apple M4, HBM3E… Günümüzün işlemcilerinin mimarisini, kalıp haritalarını ve teknik özelliklerini
              Türkçe ve sıfırdan anlatan bir rehber. Okumakla kalmayıp <span className="text-foreground font-medium">kendi çipini de tasarlayabilirsin</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkDugme href="/kategori/GPU" size="lg">GPU'ları incele<ArrowRight className="h-4 w-4" /></LinkDugme>
              <LinkDugme href="/egitim" size="lg" variant="outline"><GraduationCap className="h-4 w-4" />Sıfırdan öğren</LinkDugme>
              <LinkDugme href="/tasarla" size="lg" variant="outline"><PenTool className="h-4 w-4" />Çip tasarla</LinkDugme>
            </div>
            <AramaGirisi />
          </div>
          <div className="relative border border-border bg-card p-4 sm:p-6 rounded-lg">
            <span className="etiket absolute left-4 top-3">Şekil 1</span>
            <HeroDie className="w-full max-w-[400px] mx-auto pt-4" />
          </div>
        </div>
        {/* özellik şeridi */}
        <div className="border-t border-border">
          <dl className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
            {OZELLIKLER.map(([ad, deger, alt], i) => (
              <div key={ad} className={cn("py-5 md:py-6 pr-4", i % 2 === 1 && "pl-4 border-l border-border", i >= 2 && "border-t md:border-t-0 border-border", i === 2 && "md:pl-4 md:border-l")}>
                <dt className="etiket">{ad}</dt>
                <dd className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-medium rakam">{deger}</span>
                  <span className="text-xs text-muted-foreground">{alt}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ günün özeti */}
      <section className="container mx-auto px-4 pt-14 pb-6" aria-labelledby="ozet-baslik">
        <BolumBaslik no="01" id="ozet-baslik" sag={<OkBaglanti href="/bugun">Bugün</OkBaglanti>}>Günün özeti</BolumBaslik>
        <div className={cn("grid gap-4", admin ? "md:grid-cols-[1.4fr_1fr_1fr]" : "md:grid-cols-[1.4fr_1fr]")}>
          <Link href="/bugun" asChild>
            <a className="group rounded-lg border border-card-border bg-card p-5 hover-elevate flex gap-5 items-start" data-testid="ozet-bugun">
              <div className="shrink-0 w-20 h-20 rounded-md flex flex-col items-center justify-center border border-card-border bg-background">
                <span className={cn("font-mono font-medium text-3xl leading-none rakam", puanSinifi(puan))}>{puan}</span>
                <span className="font-mono text-[9px] text-muted-foreground mt-1.5">/ 100</span>
              </div>
              <div className="min-w-0">
                <Etiket ikon={Newspaper}>Bugün · {bugun.derlenme}</Etiket>
                <p className="font-display font-semibold leading-snug">{bugun.puan?.etiket}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bugun.maddeler?.[0]?.baslik}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2">{bugun.maddeler?.length} gelişme <ArrowRight className="h-3 w-3" /></span>
              </div>
            </a>
          </Link>
          <Link href="/fiyatlar" asChild>
            <a className="group rounded-lg border border-card-border bg-card p-5 hover-elevate block">
              <Etiket ikon={Layers}>Kiralama · {fiyat.kaynak.cekildigi_tarih}</Etiket>
              {h100 && (
                <p className="text-sm text-muted-foreground flex items-baseline justify-between">H100 / saat <span className="font-mono font-medium text-xl text-foreground rakam">{usd(h100.usd_saat)}</span></p>
              )}
              <div className="mt-3 pt-3 border-t border-dashed border-card-border space-y-1.5 text-xs">
                {artan && <p className="flex items-center gap-1.5"><ArrowUpRight className="h-3.5 w-3.5 text-red-400 shrink-0" /><span className="truncate">{artan.model}</span><span className="ml-auto font-mono text-muted-foreground hidden sm:inline rakam">{artan.onceki_usd != null && `${usd(artan.onceki_usd)} → ${usd(artan.usd_saat)}`}</span><span className="ml-auto sm:ml-0 font-mono text-red-400 rakam">{pct(artan.degisim_pct)}</span></p>}
                {dusen && <p className="flex items-center gap-1.5"><ArrowDownRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" /><span className="truncate">{dusen.model}</span><span className="ml-auto font-mono text-muted-foreground hidden sm:inline rakam">{dusen.onceki_usd != null && `${usd(dusen.onceki_usd)} → ${usd(dusen.usd_saat)}`}</span><span className="ml-auto sm:ml-0 font-mono text-emerald-400 rakam">{pct(dusen.degisim_pct)}</span></p>}
              </div>
            </a>
          </Link>
          {admin && (
            <Link href="/otomasyon" asChild>
              <a className="group rounded-lg border border-card-border bg-card p-5 hover-elevate block">
                <Etiket ikon={Bot}>Otomasyon · {otomasyon.tarih}</Etiket>
                <p className="text-sm">Her sabah 10:00'da veriler yenilenir, uygulama gerçek bir tarayıcıda test edilir.</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Durum: <span className={cn("font-medium", DURUM_SINIF[otomasyon.durum] || "text-amber-400")}>{DURUM_AD[otomasyon.durum] ?? otomasyon.durum}</span>
                  {otomasyon.oneriler?.length ? ` · ${otomasyon.oneriler.length} geliştirme önerisi` : ""}
                </p>
              </a>
            </Link>
          )}
        </div>

        {/* son haberler */}
        {SON_HABERLER.length > 0 && (
          <div className="mt-8" data-testid="son-haberler">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h3 id="son-haberler-baslik" className="etiket">Son haberler</h3>
              <Link href="/haberler" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Tüm haberler ({haberAkisi.haberler.length}) <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <ul className="divide-y divide-border border-y border-border" aria-labelledby="son-haberler-baslik">
              {SON_HABERLER.map((h) => (
                <li key={h.id} className="py-3 grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground pt-0.5 truncate">{h.yayin || h.tarih} · {h.kaynak}</p>
                  <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-[15px] leading-snug hover:text-primary line-clamp-2">{h.baslik}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ bölüm rehberi */}
      <BolumRehberi no="02" />

      {/* ------------------------------------------------------------------ kategoriler */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik no="03">Kategoriye göre incele</BolumBaslik>
        <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {KATEGORILER.map((k) => (
            <Link key={k.id} href={`/kategori/${k.id}`} asChild>
              <a className="group bg-card p-6 hover-elevate block" data-testid={`kategori-${k.id}`}>
                <div className="flex items-start justify-between">
                  <k.ikon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-muted-foreground rakam">{String(sayilar[k.id]).padStart(2, "0")} ürün</span>
                </div>
                <h3 className="font-display font-semibold text-2xl tracking-[-0.01em] mt-8">{k.ad}</h3>
                <p className="etiket mt-1">{k.alt}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{k.metin}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium mt-5 group-hover:text-primary transition-colors">İncele <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ öne çıkanlar */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik no="04" sag={<OkBaglanti href="/karsilastir">Karşılaştır</OkBaglanti>}>Öne çıkanlar</BolumBaslik>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {oneCikanlar.map((c) => <ChipCard key={c.id} chip={c} />)}
        </div>
      </section>

      {/* ------------------------------------------------------------------ eğitim */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik no="05">Eğitim</BolumBaslik>
        <div className="grid md:grid-cols-[1fr_20rem] gap-8 items-start">
          <div>
            <h3 className="font-display font-semibold text-2xl md:text-[28px] tracking-[-0.015em] leading-tight max-w-xl">Hiç bilmiyorsan da olur — sıfırdan başla.</h3>
            <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Transistörden mantık kapılarına, litografiden chiplet'lere kadar {lessons.length} ders. Her dersin sonunda kısa bir test,
              hepsinin sonunda da seviyeni ölçen 20 soruluk bir sınav.
            </p>
            <ol className="mt-6 grid sm:grid-cols-2 gap-x-6 border-t border-border">
              {lessons.slice(0, 6).map((l, i) => {
                const bitti = ilerleme.bitti.includes(l.id);
                return (
                  <li key={l.id} className="border-b border-border">
                    <Link href={`/egitim/${l.id}`} className="group flex items-baseline gap-3 py-2.5 text-sm">
                      <span className="font-mono text-[11px] text-muted-foreground rakam w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("flex-1 group-hover:text-primary", bitti && "text-muted-foreground line-through decoration-border")}>{l.title.split(/[:?—]/)[0].trim()}</span>
                      {bitti && <span className="font-mono text-[10px] text-emerald-400">✓</span>}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="rounded-lg border border-card-border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <p className="etiket">İlerlemen</p>
              <p className="font-mono text-sm rakam">{bitenSayi}/{lessons.length}</p>
            </div>
            <div className="h-1.5 bg-muted mt-3 overflow-hidden" role="progressbar" aria-valuenow={dersOrani} aria-valuemin={0} aria-valuemax={100} aria-label="Ders ilerlemesi">
              <div className="h-full bg-primary transition-all" style={{ width: `${dersOrani}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-4">{hepsiBitti ? "Bütün dersler bitti" : "Sıradaki ders"}</p>
            <p className="text-sm font-medium leading-snug mt-0.5">{hepsiBitti ? "Seviyeni ölçmenin zamanı geldi." : sonraki.title}</p>
            <div className="mt-4 [&>span]:flex [&_button]:w-full">
              <LinkDugme href={hepsiBitti ? "/sinav" : `/egitim/${sonraki.id}`}>
                {bitenSayi === 0 ? "Eğitime başla" : hepsiBitti ? "Seviye sınavına gir" : "Devam et"}<ArrowRight className="h-4 w-4" />
              </LinkDugme>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ atölye + karşılaştır */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik no="06">Araçlar</BolumBaslik>
        <div className="grid lg:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden">
          <div className="bg-card p-7 md:p-8 flex flex-col">
            <Etiket ikon={PenTool}>Tasarım atölyesi</Etiket>
            <h3 className="font-display font-semibold text-2xl tracking-[-0.01em]">Kendi çipini tasarla.</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              CPU mu, GPU mu, mobil SoC mu yoksa AI hızlandırıcı mı? Tipini ve süreç düğümünü seç, blokları kalıp ızgarasına sürükle.
              Alan, güç, üretim verimi ve maliyet anında hesaplansın; beş danışman nerede iyileştirebileceğini söylesin.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-5 font-mono text-[11px] text-muted-foreground">
              {[`${CHIP_TYPES.length} çip tipi`, `${BLOCKS.length} blok`, `${NODES.length} süreç düğümü`, "5 danışman", "ısı haritası"].map((t) => (
                <li key={t} className="before:content-['—'] before:mr-1.5 before:text-border">{t}</li>
              ))}
            </ul>
            <div className="mt-auto pt-7 flex flex-wrap items-center gap-4">
              <LinkDugme href="/tasarla">Tasarlamaya başla<ArrowRight className="h-4 w-4" /></LinkDugme>
              {ilerleme.tasarim > 0 && <Link href="/atolye" className="text-sm text-muted-foreground hover:text-foreground">{ilerleme.tasarim} kayıtlı tasarımın →</Link>}
            </div>
          </div>
          <div className="bg-card p-7 md:p-8 flex flex-col">
            <Etiket ikon={Scale}>Karşılaştır</Etiket>
            <h3 className="font-display font-semibold text-2xl tracking-[-0.01em]">Yan yana koy, farkı gör.</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Yedi çipe kadar aynı tabloda; her ölçütte en iyisi işaretlenir. Kendi tasarımını da ekleyip gerçek bir H100 ya da Ryzen ile
              transistör, yoğunluk ve watt başına verim üzerinden kıyaslayabilirsin.
            </p>
            <dl className="mt-5 grid grid-cols-3 border-y border-border divide-x divide-border">
              {[["7", "çipe kadar"], ["5", "fiziksel ölçüt"], ["17", "tasarım ölçütü"]].map(([s, e]) => (
                <div key={e} className="py-3 px-3 first:pl-0">
                  <dd className="font-mono text-xl font-medium rakam">{s}</dd>
                  <dt className="text-[11px] text-muted-foreground">{e}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-7">
              <LinkDugme href="/karsilastir" variant="outline">Karşılaştırmayı aç<ArrowRight className="h-4 w-4" /></LinkDugme>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ nasıl kullanılır */}
      <section className="container mx-auto px-4 py-10">
        <BolumBaslik no="07">Site nasıl kullanılır?</BolumBaslik>
        <ol className="grid md:grid-cols-3 gap-8">
          {[
            ["Kategori seç", "GPU, CPU ya da bellek — incelemek istediğin alanı seç ve listeden bir çip aç."],
            ["Kalıp haritasına tıkla", "Çip sayfasında görselin üzerindeki renkli bölgelere tıklayarak her bileşenin ne işe yaradığını öğren."],
            ["Dene ve kıyasla", "Atölye'de kendi çipini kur, Karşılaştır'da gerçek çiplerle yan yana koy, bilmediğin terimi Sözlük'te ara."],
          ].map(([b, m], i) => (
            <li key={b} className="border-t-2 border-foreground pt-4">
              <span className="font-mono text-xs text-muted-foreground rakam">Adım {i + 1}</span>
              <h3 className="font-display font-semibold text-lg mt-1">{b}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
