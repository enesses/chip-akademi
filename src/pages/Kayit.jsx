import { useState } from "react";
import { useLocation } from "wouter";
import { Rocket, UserRound } from "lucide-react";
import { Link } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alan, Kabuk, Kullanilamaz, Mesaj, Yukleniyor } from "@/components/hesap/Ortak";
import { MIN_SIFRE, hataMetni, kayitOl, useOturum } from "@/lib/oturum";
import { cn } from "@/lib/utils";

const ROLLER = [
  { id: "kullanici", ad: "Kullanıcı", aciklama: "Dersleri takip et, araçları kullan", Ikon: UserRound },
  { id: "girisimci", ad: "Girişimci", aciklama: "Kurs oluştur ya da projelerini sun — onayla açılır", Ikon: Rocket },
];

export default function Kayit() {
  const oturum = useOturum();
  const [, git] = useLocation();
  const [rol, setRol] = useState("kullanici");
  const [f, setF] = useState({ ad: "", eposta: "", parola: "", tekrar: "", aciklama: "" });
  const [hata, setHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const alan = (k) => ({ value: f[k], onChange: (e) => setF((x) => ({ ...x, [k]: e.target.value })) });

  async function gonder(e) {
    e.preventDefault();
    setHata("");
    if (f.ad.trim().length < 2) return setHata("Adını ve soyadını yaz.");
    if (f.parola.length < MIN_SIFRE) return setHata(`Şifre en az ${MIN_SIFRE} karakter olmalı.`);
    if (f.parola !== f.tekrar) return setHata("Şifreler eşleşmiyor.");
    setGonderiliyor(true);
    try {
      await kayitOl({ ad: f.ad, eposta: f.eposta, parola: f.parola, rol, aciklama: rol === "girisimci" ? f.aciklama : "" });
      git("/hesabim");
    } catch (err) {
      setHata(hataMetni(err));
      setGonderiliyor(false);
    }
  }

  if (!oturum.hazir) return <Kabuk baslik="Kayıt ol"><Yukleniyor /></Kabuk>;
  if (!oturum.kurulu || oturum.baglanamadi) return <Kabuk baslik="Kayıt ol"><Kullanilamaz oturum={oturum} /></Kabuk>;
  if (oturum.kullanici) {
    return (
      <Kabuk baslik="Kayıt ol">
        <Mesaj tur="basari">Zaten giriş yaptın. <Link href="/hesabim" className="underline">Hesabına git</Link>.</Mesaj>
      </Kabuk>
    );
  }

  return (
    <Kabuk baslik="Kayıt ol" alt="Ücretsiz hesap oluştur.">
      <form onSubmit={gonder} className="space-y-5" noValidate>
        <fieldset>
          <legend className="sr-only">Hesap türü</legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {ROLLER.map(({ id, ad, aciklama, Ikon }) => {
              const secili = rol === id;
              return (
                <button key={id} type="button" role="radio" aria-checked={secili} onClick={() => setRol(id)}
                  className={cn("rounded-2xl border p-4 sm:p-5 text-center transition-colors flex flex-col items-center",
                    secili ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-card-border bg-card hover:border-primary/40")}>
                  <Ikon className={cn("h-5 w-5", secili ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  <span className="font-display font-semibold mt-3">{ad}</span>
                  <span className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{aciklama}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {rol === "girisimci" && (
          <Mesaj tur="uyari">
            Girişimci hesapları yönetici onayından sonra açılır. Kayıt olduktan sonra normal kullanıcı gibi giriş yapabilirsin;
            onaylanınca girişimci özellikleri hesabında görünür.
          </Mesaj>
        )}

        <Alan etiket="Ad Soyad" id="ad">
          <Input id="ad" autoComplete="name" placeholder="Ad Soyad" maxLength={80} required {...alan("ad")} />
        </Alan>
        <Alan etiket="E-posta" id="eposta">
          <Input id="eposta" type="email" autoComplete="email" placeholder="ornek@email.com" required {...alan("eposta")} />
        </Alan>
        <Alan etiket="Şifre" id="parola">
          <Input id="parola" type="password" autoComplete="new-password" placeholder={`En az ${MIN_SIFRE} karakter`} required {...alan("parola")} />
        </Alan>
        <Alan etiket="Şifre tekrar" id="tekrar">
          <Input id="tekrar" type="password" autoComplete="new-password" placeholder="Şifre tekrar" required {...alan("tekrar")} />
        </Alan>
        {rol === "girisimci" && (
          <Alan etiket="Ne sunmak istiyorsun?" id="aciklama" ipucu="İsteğe bağlı; onay verirken yardımcı olur. En fazla 600 karakter.">
            <textarea id="aciklama" rows={3} maxLength={600} placeholder="Ör. gömülü sistemler kursu, FPGA proje dosyaları…"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...alan("aciklama")} />
          </Alan>
        )}

        <Mesaj>{hata}</Mesaj>

        <Button type="submit" size="lg" className="w-full" disabled={gonderiliyor}>
          {gonderiliyor ? "Hesap oluşturuluyor…" : rol === "girisimci" ? "Başvur ve kayıt ol" : "Kayıt ol"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Hesabın var mı? <Link href="/giris" className="text-primary hover:underline">Giriş yap</Link>
        </p>
      </form>
    </Kabuk>
  );
}
