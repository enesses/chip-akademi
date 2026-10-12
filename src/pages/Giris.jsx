import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alan, Kabuk, Kullanilamaz, Mesaj, Yukleniyor } from "@/components/hesap/Ortak";
import { girisYap, hataMetni, sifreSifirla, useOturum } from "@/lib/oturum";

export default function Giris() {
  const oturum = useOturum();
  const [, git] = useLocation();
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
  const [mesgul, setMesgul] = useState(false);

  async function gonder(e) {
    e.preventDefault();
    setHata(""); setBilgi("");
    setMesgul(true);
    try { await girisYap(eposta, parola); git("/hesabim"); }
    catch (err) { setHata(hataMetni(err)); setMesgul(false); }
  }
  async function sifirla() {
    setHata(""); setBilgi("");
    if (!eposta.trim()) return setHata("Önce e-posta adresini yaz.");
    try {
      await sifreSifirla(eposta);
      setBilgi("Bu adreste bir hesap varsa şifre sıfırlama bağlantısı gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.");
    } catch (err) {
      // Hesabın var olup olmadığını belli etmemek için aynı cevap.
      if (err?.code === "auth/user-not-found") setBilgi("Bu adreste bir hesap varsa şifre sıfırlama bağlantısı gönderildi.");
      else setHata(hataMetni(err));
    }
  }

  if (!oturum.hazir) return <Kabuk baslik="Giriş yap"><Yukleniyor /></Kabuk>;
  if (!oturum.kurulu || oturum.baglanamadi) return <Kabuk baslik="Giriş yap"><Kullanilamaz oturum={oturum} /></Kabuk>;
  if (oturum.kullanici) {
    return (
      <Kabuk baslik="Giriş yap">
        <Mesaj tur="basari">{oturum.kullanici.eposta} olarak giriş yaptın. <Link href="/hesabim" className="underline">Hesabına git</Link>.</Mesaj>
      </Kabuk>
    );
  }

  return (
    <Kabuk baslik="Giriş yap" alt="Hesabınla devam et.">
      <form onSubmit={gonder} className="space-y-5" noValidate>
        <Alan etiket="E-posta" id="g-eposta">
          <Input id="g-eposta" type="email" autoComplete="email" placeholder="ornek@email.com" value={eposta} onChange={(e) => setEposta(e.target.value)} required />
        </Alan>
        <Alan etiket="Şifre" id="g-parola">
          <Input id="g-parola" type="password" autoComplete="current-password" placeholder="Şifre" value={parola} onChange={(e) => setParola(e.target.value)} required />
        </Alan>
        <div className="text-right -mt-2">
          <button type="button" onClick={sifirla} className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Şifremi unuttum</button>
        </div>
        <Mesaj>{hata}</Mesaj>
        <Mesaj tur="basari">{bilgi}</Mesaj>
        <Button type="submit" size="lg" className="w-full" disabled={mesgul}>{mesgul ? "Giriş yapılıyor…" : "Giriş yap"}</Button>
        <p className="text-sm text-muted-foreground text-center">
          Hesabın yok mu? <Link href="/kayit" className="text-primary hover:underline">Kayıt ol</Link>
        </p>
      </form>
    </Kabuk>
  );
}
