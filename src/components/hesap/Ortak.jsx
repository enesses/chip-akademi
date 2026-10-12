import { CircleAlert, CircleCheck, ExternalLink, Loader2, Wrench } from "lucide-react";
import { WEB_ADRESI } from "@/lib/firebaseAyar";
import { cn } from "@/lib/utils";

/** Giriş/kayıt sayfalarının ortak iskeleti: ortalanmış dar sütun. */
export function Kabuk({ baslik, alt, children, genis = false }) {
  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className={cn("container mx-auto px-4 pt-10 md:pt-14 pb-16", genis ? "max-w-4xl" : "max-w-xl")}>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{baslik}</h1>
        {alt && <p className="text-muted-foreground mt-2">{alt}</p>}
        <div className="mt-8">{children}</div>
      </section>
    </div>
  );
}

export function Mesaj({ tur = "hata", children }) {
  if (!children) return null;
  const Ikon = tur === "hata" ? CircleAlert : CircleCheck;
  return (
    <div role={tur === "hata" ? "alert" : "status"} className={cn("rounded-xl border p-3 flex items-start gap-2.5 text-sm",
      tur === "hata" ? "border-red-500/40 bg-red-500/5 text-red-300" : tur === "uyari" ? "border-amber-400/40 bg-amber-500/5 text-amber-200" : "border-emerald-500/40 bg-emerald-500/5 text-emerald-300")}>
      <Ikon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" /><div>{children}</div>
    </div>
  );
}

export function Yukleniyor() {
  return (
    <p className="inline-flex items-center gap-2 text-sm text-muted-foreground" role="status">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Yükleniyor…
    </p>
  );
}

/** Hesap sistemi kullanılamıyorsa (kurulmamış ya da bu görünümde bağlanamıyor) gösterilir. */
export function Kullanilamaz({ oturum }) {
  const claudeAi = typeof window !== "undefined" && !!window.claude;
  return (
    <div className="rounded-2xl border border-card-border bg-card/60 p-6">
      <Wrench className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      {!oturum.kurulu ? (
        <>
          <h2 className="font-display font-semibold text-lg mt-3">Hesap sistemi kurulum bekliyor</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Giriş ve kayıt, sunucu bağlantısı yapılınca açılacak. O zamana kadar ilerlemeni bu tarayıcıdaki profillerle saklayabilirsin.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display font-semibold text-lg mt-3">Giriş bu görünümde kullanılamıyor</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {claudeAi
              ? "claude.ai içinde açılan uygulama hesap sunucusuna bağlanamıyor. Giriş yapmak ve kayıt olmak için web sürümünü aç."
              : "Hesap sunucusuna ulaşılamadı. Bağlantını kontrol edip sayfayı yenile."}
          </p>
          <a href={WEB_ADRESI} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3">
            Web sürümünü aç <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </>
      )}
    </div>
  );
}

export function Alan({ etiket, id, ipucu, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5">{etiket}</label>
      {children}
      {ipucu && <p className="text-[11px] text-muted-foreground mt-1">{ipucu}</p>}
    </div>
  );
}

export const ROL_AD = { kullanici: "Kullanıcı", girisimci: "Girişimci" };
export const DURUM_AD = { aktif: "Aktif", bekliyor: "Onay bekliyor", onaylandi: "Onaylandı", reddedildi: "Reddedildi" };
