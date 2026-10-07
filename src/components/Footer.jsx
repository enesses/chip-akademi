import { Cpu } from "lucide-react";
import { Link } from "@/components/Nav";
import { GRUPLAR } from "@/lib/bolumler";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-[1.1fr_2fr] lg:grid-cols-[1fr_2.2fr_1fr] gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-display font-bold"><Cpu className="h-4 w-4 text-primary" aria-hidden="true" />Chip Akademi</div>
          <p className="text-muted-foreground mt-2 leading-relaxed max-w-sm">
            GPU, CPU ve bellek teknolojilerini görsellerle, mimarisiyle ve gerçek dünya kullanımıyla anlatan Türkçe eğitim sitesi.
          </p>
        </div>
        <nav aria-label="Tüm bölümler" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 content-start">
          {GRUPLAR.map((g) => (
            <div key={g.id}>
              <p className="font-medium text-foreground mb-2">{g.ad}</p>
              <ul className="grid gap-1.5">
                {g.bolumler.map((b) => (
                  <li key={b.id}><Link href={b.yol} className="text-muted-foreground hover:text-foreground w-fit">{b.ad}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground leading-relaxed md:col-span-2 lg:col-span-1 space-y-1">
          <p>Çip verileri: üretici belgeleri ve teknik basın.</p>
          <p>Kiralama fiyatları: getdeploying.com. Bellek fiyatları: TrendForce.</p>
          <p>Görsellerin bir kısmı temsilîdir; her çip sayfasında belirtilir.</p>
        </div>
      </div>
    </footer>
  );
}
