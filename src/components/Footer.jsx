import { Cpu } from "lucide-react";
import { Link } from "@/components/Nav";

const BAGLANTILAR = [
  ["/egitim", "Eğitim"], ["/sinav", "Sınav"], ["/tasarla", "Tasarla"], ["/karsilastir", "Karşılaştır"],
  ["/fiyatlar", "Fiyatlar"], ["/bugun", "Bugün"], ["/sozluk", "Sözlük"], ["/otomasyon", "Otomasyon"],
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-[1.2fr_1fr_1.2fr] gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-display font-bold"><Cpu className="h-4 w-4 text-primary" aria-hidden="true" />Chip Akademi</div>
          <p className="text-muted-foreground mt-2 leading-relaxed max-w-sm">
            GPU, CPU ve bellek teknolojilerini görsellerle, mimarisiyle ve gerçek dünya kullanımıyla anlatan Türkçe eğitim sitesi.
          </p>
        </div>
        <nav aria-label="Alt bağlantılar" className="grid grid-cols-2 gap-x-6 gap-y-1.5 content-start">
          {BAGLANTILAR.map(([h, a]) => <Link key={h} href={h} className="text-muted-foreground hover:text-foreground w-fit">{a}</Link>)}
        </nav>
        <div className="font-mono text-[11px] text-muted-foreground leading-relaxed">
          <p>Çip verileri: üretici belgeleri ve teknik basın.</p>
          <p>Kiralama fiyatları: getdeploying.com · Bellek fiyatları: TrendForce.</p>
          <p>Görsellerin bir kısmı temsilîdir; her çip sayfasında belirtilir.</p>
        </div>
      </div>
    </footer>
  );
}
