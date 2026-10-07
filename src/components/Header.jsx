import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "@/components/Nav";
import { Cpu, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { aktifProfil, profilDegisimineAbone } from "@/lib/hesap";

function ProfilEtiketi({ profil }) {
  if (!profil) return (<><UserRound className="h-3.5 w-3.5" />Giriş</>);
  return (<><span className="text-sm leading-none">{profil.avatar}</span><span className="max-w-[6rem] truncate">{profil.ad}</span></>);
}

const navItems = [
  { href: "/bugun", label: "Bugün" },
  { href: "/hesap", label: "Giriş", profil: true },
  { href: "/kategori/GPU", label: "GPU" },
  { href: "/kategori/CPU", label: "CPU" },
  { href: "/kategori/RAM", label: "Bellek" },
  { href: "/egitim", label: "Eğitim" },
  { href: "/sinav", label: "Sınav" },
  { href: "/atolye", label: "Atölye" },
  { href: "/tasarla", label: "Tasarla" },
  { href: "/karsilastir", label: "Karşılaştır" },
  { href: "/fiyatlar", label: "Fiyatlar" },
  { href: "/sozluk", label: "Sözlük" },
  { href: "/notlar", label: "Notlar" },
  { href: "/otomasyon", label: "Otomasyon" },
];

export default function Header() {
  const [location] = useLocation();
  const [profil, setProfil] = useState(null);
  useEffect(() => {
    const yenile = () => setProfil(aktifProfil());
    yenile();
    return profilDegisimineAbone(yenile);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Chip Akademi anasayfa">
          <span className="w-8 h-8 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-center"><Cpu className="h-[18px] w-[18px] text-primary" aria-hidden="true" /></span>
          <span className="leading-none">
            <span className="block font-display font-bold tracking-tight">Chip Akademi</span>
            <span className="block font-mono text-[9px] tracking-[0.2em] text-muted-foreground mt-1">V.2026</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} asChild>
                <a className={cn("px-2.5 py-2 rounded-md text-sm font-medium hover-elevate whitespace-nowrap",
                  item.profil && "inline-flex items-center gap-1.5",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                  {item.profil ? <ProfilEtiketi profil={profil} /> : item.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      <nav className="md:hidden border-t border-border overflow-x-auto">
        <div className="flex gap-1 px-3 py-2">
          {navItems.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} asChild>
                <a className={cn("px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap hover-elevate",
                  item.profil && "inline-flex items-center gap-1.5",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
                  {item.profil ? <ProfilEtiketi profil={profil} /> : item.label}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
