import Logo from "@/components/Logo";
import { Link } from "@/components/Nav";
import { gorunurGruplar } from "@/lib/bolumler";
import { useOturum } from "@/lib/oturum";

export default function Footer() {
  const GRUPLAR = gorunurGruplar(useOturum().admin);
  return (
    <footer className="border-t border-border mt-20 bg-card">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-[1.1fr_2fr] lg:grid-cols-[1fr_2.2fr_1fr] gap-8 text-sm">
        <div>
          <Logo />
          <p className="text-muted-foreground mt-3 leading-relaxed max-w-sm">
            GPU, CPU ve bellek teknolojilerini görsellerle, mimarisiyle ve gerçek dünya kullanımıyla anlatan Türkçe eğitim sitesi.
          </p>
        </div>
        <nav aria-label="Tüm bölümler" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 content-start">
          {GRUPLAR.map((g) => (
            <div key={g.id}>
              <p className="etiket mb-3">{g.ad}</p>
              <ul className="grid gap-1.5">
                {g.bolumler.map((b) => (
                  <li key={b.id}><Link href={b.yol} className="text-muted-foreground hover:text-foreground w-fit">{b.ad}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground leading-relaxed md:col-span-2 lg:col-span-1 space-y-1">
          <p className="etiket mb-3">Kaynaklar</p>
          <p>Çip verileri: üretici belgeleri ve teknik basın.</p>
          <p>Kiralama fiyatları: getdeploying.com. Bellek fiyatları: TrendForce.</p>
          <p>Görsellerin bir kısmı temsilîdir; her çip sayfasında belirtilir.</p>
        </div>
      </div>
    </footer>
  );
}
