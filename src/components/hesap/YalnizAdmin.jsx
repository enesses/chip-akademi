import { Lock } from "lucide-react";
import { Link } from "@/components/Nav";
import { Kabuk, Yukleniyor } from "@/components/hesap/Ortak";
import { useOturum } from "@/lib/oturum";

/** Çocuklarını yalnızca admine gösterir; diğerlerine kısa bir açıklama. */
export default function YalnizAdmin({ children }) {
  const o = useOturum();
  if (!o.hazir || !o.sahipBelli) return <Kabuk baslik=""><Yukleniyor /></Kabuk>;
  if (o.admin) return children;
  return (
    <Kabuk baslik="Bu sayfa yöneticiye özel">
      <div className="rounded-lg border border-card-border bg-card p-6">
        <Lock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {o.kullanici
            ? "Bu hesabın bu sayfayı görme yetkisi yok."
            : "Bu sayfayı yalnızca yönetici hesabı görebilir. Yöneticiysen giriş yap."}
        </p>
        {!o.kullanici && o.kurulu && (
          <Link href="/giris" asChild><a className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/85 mt-4">Giriş yap</a></Link>
        )}
        <p className="mt-4"><Link href="/" className="text-sm text-primary hover:underline">Ana sayfaya dön</Link></p>
      </div>
    </Kabuk>
  );
}
