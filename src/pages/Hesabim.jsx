import { useState } from "react";
import { useLocation } from "wouter";
import { Bot, Clock, LogOut, MailCheck, Rocket, ShieldCheck, UserRound, Users } from "lucide-react";
import { Link } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { DURUM_AD, Kabuk, Kullanilamaz, Mesaj, ROL_AD, Yukleniyor } from "@/components/hesap/Ortak";
import { cikisYap, dogrulamaGonder, hataMetni, oturumuYenile, useOturum } from "@/lib/oturum";
import { cn } from "@/lib/utils";

function GirisimciDurumu({ profil }) {
  if (profil?.rol !== "girisimci") return null;
  if (profil.durum === "onaylandi") {
    return (
      <Mesaj tur="basari">
        Girişimci hesabın onaylandı. Kurs ve proje yayınlama araçları hazır olduğunda burada görünecek.
      </Mesaj>
    );
  }
  if (profil.durum === "reddedildi") {
    return <Mesaj>Girişimci başvurun onaylanmadı. Normal kullanıcı olarak devam edebilirsin.</Mesaj>;
  }
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-500/5 p-4 flex items-start gap-3">
      <Clock className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-amber-200">Girişimci başvurun onay bekliyor</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Yönetici başvurunu inceleyince durumun burada güncellenir. Bu sırada sitenin geri kalanını normal kullanıcı olarak kullanabilirsin.
        </p>
      </div>
    </div>
  );
}

export default function Hesabim() {
  const oturum = useOturum();
  const [, git] = useLocation();
  const [mesaj, setMesaj] = useState({ tur: "", metin: "" });
  const [mesgul, setMesgul] = useState(false);

  if (!oturum.hazir) return <Kabuk baslik="Hesabım"><Yukleniyor /></Kabuk>;
  if (!oturum.kurulu || oturum.baglanamadi) {
    return (
      <Kabuk baslik="Hesabım">
        <div className="space-y-4">
          {oturum.sahip && <SahipKarti />}
          <Kullanilamaz oturum={oturum} />
        </div>
      </Kabuk>
    );
  }
  if (!oturum.kullanici) {
    return (
      <Kabuk baslik="Hesabım">
        <div className="space-y-4">
          {oturum.sahip && <SahipKarti />}
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Hesabını görmek için giriş yap.</p>
            <div className="flex gap-2 mt-4">
              <Link href="/giris" asChild><a className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover-elevate">Giriş yap</a></Link>
              <Link href="/kayit" asChild><a className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium hover-elevate">Kayıt ol</a></Link>
            </div>
          </div>
        </div>
      </Kabuk>
    );
  }

  const { kullanici: k, profil, admin } = oturum;
  const rol = profil?.rol || "kullanici";

  async function dogrulamaYolla() {
    setMesgul(true);
    try { await dogrulamaGonder(); setMesaj({ tur: "basari", metin: `Doğrulama bağlantısı ${k.eposta} adresine gönderildi.` }); }
    catch (e) { setMesaj({ tur: "hata", metin: hataMetni(e) }); }
    setMesgul(false);
  }
  async function dogruladim() {
    setMesgul(true);
    try {
      const y = await oturumuYenile();
      setMesaj(y?.dogrulandi ? { tur: "basari", metin: "E-posta adresin doğrulandı." } : { tur: "hata", metin: "Henüz doğrulanmamış görünüyor. E-postadaki bağlantıya tıkladıktan sonra yeniden dene." });
    } catch (e) { setMesaj({ tur: "hata", metin: hataMetni(e) }); }
    setMesgul(false);
  }
  async function cik() { await cikisYap(); git("/"); }

  return (
    <Kabuk baslik="Hesabım">
      <div className="space-y-4">
        <div className="rounded-2xl border border-card-border bg-card p-5 flex items-start gap-4 flex-wrap">
          <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {rol === "girisimci" ? <Rocket className="h-5 w-5" aria-hidden="true" /> : <UserRound className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-lg leading-tight">{profil?.ad || k.ad || k.eposta}</p>
            <p className="text-sm text-muted-foreground truncate">{k.eposta}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="rounded-sm border border-card-border px-2 py-0.5 text-[11px]">{ROL_AD[rol]}</span>
              {profil && rol === "girisimci" && (
                <span className={cn("rounded-sm border px-2 py-0.5 text-[11px]",
                  profil.durum === "onaylandi" ? "border-emerald-500/50 text-emerald-300" : profil.durum === "reddedildi" ? "border-red-500/50 text-red-300" : "border-amber-400/50 text-amber-200")}>
                  {DURUM_AD[profil.durum]}
                </span>
              )}
              {admin && <span className="rounded-sm border border-primary/50 text-primary px-2 py-0.5 text-[11px] inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" aria-hidden="true" />Yönetici</span>}
              {!k.dogrulandi && <span className="rounded-sm border border-amber-400/50 text-amber-200 px-2 py-0.5 text-[11px]">E-posta doğrulanmadı</span>}
            </div>
          </div>
          <Button variant="ghost" onClick={cik} className="gap-1.5"><LogOut className="h-4 w-4" aria-hidden="true" />Çıkış</Button>
        </div>

        {!profil && (
          <Mesaj tur="uyari">Profil kaydın okunamadı. Sayfayı yenile; sorun sürerse çıkış yapıp yeniden gir.</Mesaj>
        )}

        {!k.dogrulandi && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <MailCheck className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-200">E-posta adresini doğrula</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {k.eposta} adresine bir doğrulama bağlantısı gönderdik. Bağlantıya tıkladıktan sonra "Doğruladım" de.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button size="sm" onClick={dogruladim} disabled={mesgul}>Doğruladım</Button>
                  <Button size="sm" variant="outline" onClick={dogrulamaYolla} disabled={mesgul}>Bağlantıyı yeniden gönder</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mesaj.metin && <Mesaj tur={mesaj.tur}>{mesaj.metin}</Mesaj>}

        <GirisimciDurumu profil={profil} />

        {admin && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/yonetim" asChild>
              <a className="rounded-2xl border border-primary/40 bg-primary/5 p-4 flex items-start gap-3 hover:border-primary/70">
                <Users className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <span><span className="block font-semibold text-sm">Girişimci başvuruları</span><span className="block text-xs text-muted-foreground mt-0.5">Onay bekleyenleri gör, onayla ya da reddet</span></span>
              </a>
            </Link>
            <Link href="/otomasyon" asChild>
              <a className="rounded-2xl border border-card-border bg-card p-4 flex items-start gap-3 hover:border-primary/50">
                <Bot className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                <span><span className="block font-semibold text-sm">Otomasyon</span><span className="block text-xs text-muted-foreground mt-0.5">Günlük çalışmalar, öneriler ve onaylar</span></span>
              </a>
            </Link>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Ders ilerlemen ve tasarımların şimdilik bu tarayıcıdaki <Link href="/hesap" className="text-primary hover:underline">ilerleme profillerinde</Link> tutuluyor.
        </p>
      </div>
    </Kabuk>
  );
}

function SahipKarti() {
  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 flex items-start gap-3">
      <ShieldCheck className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold">Uygulamanın sahibi olarak buradasın</p>
        <p className="text-xs text-muted-foreground mt-1">claude.ai'de yönetici sayfalarını görebilirsin: <Link href="/otomasyon" className="text-primary hover:underline">Otomasyon</Link>. Girişimci başvurularını onaylamak için web sürümünde admin hesabınla gir.</p>
      </div>
    </div>
  );
}
