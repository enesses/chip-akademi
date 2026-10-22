import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, Cpu, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Rocket, ShieldCheck,
  UserRound, Wrench,
} from "lucide-react";
import { Link } from "@/components/Nav";
import { Kullanilamaz, Mesaj, Yukleniyor } from "@/components/hesap/Ortak";
import {
  MIN_SIFRE, girisYap, googleIleDevam, googleVar, hataMetni, kayitOl, sifreSifirla, useOturum,
} from "@/lib/oturum";
import { cn } from "@/lib/utils";

const ROLLER = [
  { id: "kullanici", ad: "Öğrenci", aciklama: "Dersler, atölye ve araçlar", Ikon: UserRound },
  { id: "girisimci", ad: "Girişimci", aciklama: "Kurs ve proje sun — onayla açılır", Ikon: Rocket },
];

const ARTILAR = [
  { Ikon: BookOpen, baslik: "İlerlemen seninle", metin: "Dersler, sınavlar ve notların hesabına bağlı kalır." },
  { Ikon: Wrench, baslik: "Kendi çipini tasarla", metin: "CPU, GPU ve hızlandırıcı tasarımların kaybolmaz." },
  { Ikon: ShieldCheck, baslik: "Güvenli giriş", metin: "Google altyapısıyla şifreli oturum, e-posta doğrulama." },
];

/** 0–4 arası kaba şifre gücü. */
function sifreGucu(s) {
  if (!s) return 0;
  let p = 0;
  if (s.length >= MIN_SIFRE) p++;
  if (s.length >= 12) p++;
  if (/[a-zçğıöşü]/.test(s) && /[A-ZÇĞİÖŞÜ]/.test(s)) p++;
  if (/\d/.test(s) && /[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/.test(s)) p++;
  return s.length < MIN_SIFRE ? Math.min(p, 1) : Math.max(p, 1);
}
const GUC = [
  { ad: "", renk: "bg-card-border" },
  { ad: "Zayıf", renk: "bg-red-400" },
  { ad: "Orta", renk: "bg-amber-400" },
  { ad: "İyi", renk: "bg-lime-400" },
  { ad: "Güçlü", renk: "bg-emerald-400" },
];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Simgeli, odakta parlayan giriş alanı. */
function Alan({ id, etiket, Ikon, sag, hata, children, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-foreground/90 mb-1.5">{etiket}</label>
      <div className={cn(
        "group relative flex items-center rounded-xl border bg-background/60 transition-all",
        "focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/10",
        hata ? "border-red-500/60" : "border-card-border hover:border-foreground/20"
      )}>
        <Ikon className="absolute left-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
        {children || (
          <input id={id} className="h-12 w-full bg-transparent pl-10 pr-11 text-[15px] outline-none placeholder:text-muted-foreground/60 rounded-xl" {...props} />
        )}
        {sag && <div className="absolute right-1.5">{sag}</div>}
      </div>
    </div>
  );
}

function SifreAlani({ id, etiket, deger, setDeger, autoComplete, placeholder, gucGoster }) {
  const [goster, setGoster] = useState(false);
  const guc = sifreGucu(deger);
  return (
    <div>
      <Alan id={id} etiket={etiket} Ikon={Lock} type={goster ? "text" : "password"} autoComplete={autoComplete}
        placeholder={placeholder} value={deger} onChange={(e) => setDeger(e.target.value)} required
        sag={(
          <button type="button" onClick={() => setGoster((g) => !g)} aria-label={goster ? "Şifreyi gizle" : "Şifreyi göster"}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5">
            {goster ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        )} />
      {gucGoster && deger && (
        <div className="mt-2 flex items-center gap-3" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= guc ? GUC[guc].renk : "bg-card-border")} />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground w-12 text-right">{GUC[guc].ad}</span>
        </div>
      )}
    </div>
  );
}

function Onay({ secili, setSecili, children }) {
  return (
    <label className="flex items-center gap-2.5 text-[13px] text-muted-foreground cursor-pointer select-none">
      <span className={cn("h-[18px] w-[18px] rounded-md border flex items-center justify-center transition-colors",
        secili ? "bg-primary border-primary" : "border-card-border bg-background/60")}>
        {secili && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} aria-hidden="true" />}
      </span>
      <input type="checkbox" className="sr-only" checked={secili} onChange={(e) => setSecili(e.target.checked)} />
      {children}
    </label>
  );
}

function AnaDugme({ mesgul, children, ...props }) {
  return (
    <button type="submit" disabled={mesgul}
      className={cn(
        "group relative w-full h-12 rounded-xl font-semibold text-[15px] text-primary-foreground overflow-hidden",
        "bg-gradient-to-r from-primary to-[#7c8cff] shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.6)]",
        "transition-all hover:shadow-[0_10px_40px_-6px_hsl(var(--primary)/0.75)] hover:brightness-110 active:scale-[0.99]",
        "disabled:opacity-60 disabled:pointer-events-none"
      )} {...props}>
      <span className="relative inline-flex items-center justify-center gap-2">
        {mesgul ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {children}
        {!mesgul && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
      </span>
    </button>
  );
}

function GoogleDugmesi({ onClick, mesgul, metin }) {
  return (
    <button type="button" onClick={onClick} disabled={mesgul}
      className="w-full h-12 rounded-xl border border-card-border bg-foreground/[0.03] hover:bg-foreground/[0.07] hover:border-foreground/20 transition-colors inline-flex items-center justify-center gap-3 text-[15px] font-medium disabled:opacity-60">
      {mesgul ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GoogleLogo />}
      {metin}
    </button>
  );
}

function Ayrac() {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
      <span className="h-px flex-1 bg-card-border" />ya da e-posta ile<span className="h-px flex-1 bg-card-border" />
    </div>
  );
}

/** Sol panel: marka, kısa tanıtım, dekoratif kalıp (die) ızgarası. */
function MarkaPaneli() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-[28px] border border-card-border bg-gradient-to-br from-[#0b1424] via-[#0a0f1c] to-[#120b24] p-10">
      <div className="absolute inset-0 opacity-[0.35]" aria-hidden="true"
        style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.10) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.10) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-[90px]" aria-hidden="true" />
      <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-purple-500/25 blur-[100px]" aria-hidden="true" />

      <div className="relative flex items-center gap-2.5">
        <span className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Cpu className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <span className="font-display font-bold text-lg tracking-tight">Chip Akademi</span>
      </div>

      <KalipIzgarasi />

      <div className="relative">
        <h2 className="font-display text-[34px] leading-[1.1] font-bold tracking-tight">
          Silikonun içini<br />
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">katman katman öğren.</span>
        </h2>
        <ul className="mt-8 space-y-5">
          {ARTILAR.map(({ Ikon, baslik, metin }) => (
            <li key={baslik} className="flex items-start gap-3.5">
              <span className="h-9 w-9 shrink-0 rounded-lg border border-card-border bg-background/40 flex items-center justify-center">
                <Ikon className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-[15px]">{baslik}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{metin}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KalipIzgarasi() {
  // Çekirdek, önbellek ve G/Ç bloklarından oluşan stilize bir kalıp.
  const hucreler = ["c", "c", "l", "c", "c", "c", "c", "l", "c", "c", "g", "g", "l", "g", "g", "g", "g", "l", "g", "g", "c", "c", "l", "c", "c"];
  const renk = { c: "bg-primary/25 border-primary/40", l: "bg-purple-400/20 border-purple-400/40", g: "bg-emerald-400/15 border-emerald-400/30" };
  return (
    <div className="relative my-10 mx-auto w-56 rotate-[-8deg]" aria-hidden="true">
      <div className="rounded-2xl border border-primary/30 bg-background/40 p-3 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5)] backdrop-blur">
        <div className="grid grid-cols-5 gap-1.5">
          {hucreler.map((t, i) => (
            <motion.span key={i} className={cn("aspect-square rounded-[4px] border", renk[t])}
              animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 3, repeat: Infinity, delay: (i % 7) * 0.35 }} />
          ))}
        </div>
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="absolute -left-3 h-[2px] w-3 bg-primary/40 rounded" style={{ top: `${14 + i * 14}%` }} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="absolute -right-3 h-[2px] w-3 bg-primary/40 rounded" style={{ top: `${14 + i * 14}%` }} />
      ))}
    </div>
  );
}

function SekmeSecici({ mod, sec }) {
  return (
    <div className="relative grid grid-cols-2 rounded-xl border border-card-border bg-background/60 p-1" role="tablist" aria-label="Giriş ya da kayıt">
      {[["giris", "Giriş yap"], ["kayit", "Kayıt ol"]].map(([id, ad]) => (
        <button key={id} type="button" role="tab" aria-selected={mod === id} onClick={() => sec(id)}
          className={cn("relative z-10 h-10 rounded-lg text-sm font-semibold transition-colors", mod === id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
          {mod === id && (
            <motion.span layoutId="sekme-isaret" className="absolute inset-0 -z-10 rounded-lg bg-card border border-card-border shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          )}
          {ad}
        </button>
      ))}
    </div>
  );
}

function GirisFormu({ sifreUnuttum }) {
  const [, git] = useLocation();
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [hatirla, setHatirla] = useState(true);
  const [hata, setHata] = useState("");
  const [mesgul, setMesgul] = useState(""); // "", "eposta", "google"

  async function gonder(e) {
    e.preventDefault();
    setHata("");
    if (!eposta.trim() || !parola) return setHata("E-posta ve şifreni yaz.");
    setMesgul("eposta");
    try { await girisYap(eposta, parola, hatirla); git("/hesabim"); }
    catch (err) { setHata(hataMetni(err)); setMesgul(""); }
  }
  async function google() {
    setHata(""); setMesgul("google");
    try { const s = await googleIleDevam({ hatirla }); if (!s.yonlendirildi) git("/hesabim"); }
    catch (err) { setHata(hataMetni(err)); setMesgul(""); }
  }

  return (
    <form onSubmit={gonder} className="space-y-5" noValidate>
      {googleVar() && <><GoogleDugmesi onClick={google} mesgul={mesgul === "google"} metin="Google ile giriş yap" /><Ayrac /></>}
      <Alan id="g-eposta" etiket="E-posta" Ikon={Mail} type="email" autoComplete="email" placeholder="ornek@email.com"
        value={eposta} onChange={(e) => setEposta(e.target.value)} required autoFocus />
      <SifreAlani id="g-parola" etiket="Şifre" deger={parola} setDeger={setParola} autoComplete="current-password" placeholder="Şifren" />
      <div className="flex items-center justify-between -mt-1">
        <Onay secili={hatirla} setSecili={setHatirla}>Beni hatırla</Onay>
        <button type="button" onClick={() => sifreUnuttum(eposta)} className="text-[13px] font-medium text-primary hover:underline underline-offset-4">
          Şifremi unuttum
        </button>
      </div>
      <Mesaj>{hata}</Mesaj>
      <AnaDugme mesgul={mesgul === "eposta"}>{mesgul === "eposta" ? "Giriş yapılıyor…" : "Giriş yap"}</AnaDugme>
    </form>
  );
}

function KayitFormu() {
  const [, git] = useLocation();
  const [rol, setRol] = useState("kullanici");
  const [f, setF] = useState({ ad: "", eposta: "", parola: "", tekrar: "", aciklama: "" });
  const [kosul, setKosul] = useState(false);
  const [hata, setHata] = useState("");
  const [mesgul, setMesgul] = useState("");
  const alan = (k) => ({ value: f[k], onChange: (e) => setF((x) => ({ ...x, [k]: e.target.value })) });
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const aciklama = rol === "girisimci" ? f.aciklama : "";

  async function gonder(e) {
    e.preventDefault();
    setHata("");
    if (f.ad.trim().length < 2) return setHata("Adını ve soyadını yaz.");
    if (!/^\S+@\S+\.\S+$/.test(f.eposta.trim())) return setHata("E-posta adresi geçerli görünmüyor.");
    if (f.parola.length < MIN_SIFRE) return setHata(`Şifre en az ${MIN_SIFRE} karakter olmalı.`);
    if (f.parola !== f.tekrar) return setHata("Şifreler eşleşmiyor.");
    if (!kosul) return setHata("Devam etmek için kullanım koşullarını kabul et.");
    setMesgul("eposta");
    try {
      await kayitOl({ ad: f.ad, eposta: f.eposta, parola: f.parola, rol, aciklama });
      git("/hesabim");
    } catch (err) { setHata(hataMetni(err)); setMesgul(""); }
  }
  async function google() {
    setHata("");
    if (!kosul) return setHata("Devam etmek için kullanım koşullarını kabul et.");
    setMesgul("google");
    try { const s = await googleIleDevam({ rol, aciklama }); if (!s.yonlendirildi) git("/hesabim"); }
    catch (err) { setHata(hataMetni(err)); setMesgul(""); }
  }
  const eslesiyor = f.tekrar && f.parola === f.tekrar;

  return (
    <form onSubmit={gonder} className="space-y-5" noValidate>
      <fieldset>
        <legend className="block text-[13px] font-medium text-foreground/90 mb-1.5">Hesap türü</legend>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
          {ROLLER.map(({ id, ad, aciklama: a, Ikon }) => {
            const secili = rol === id;
            return (
              <button key={id} type="button" role="radio" aria-checked={secili} onClick={() => setRol(id)}
                className={cn("relative rounded-xl border p-3.5 text-left transition-all",
                  secili ? "border-primary/70 bg-primary/[0.08] ring-4 ring-primary/10" : "border-card-border bg-background/60 hover:border-foreground/20")}>
                <div className="flex items-center gap-2">
                  <Ikon className={cn("h-4 w-4", secili ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  <span className="font-semibold text-sm">{ad}</span>
                </div>
                <p className="text-[11.5px] text-muted-foreground mt-1 leading-snug">{a}</p>
                {secili && <Check className="absolute top-2.5 right-2.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      {googleVar() && <><GoogleDugmesi onClick={google} mesgul={mesgul === "google"} metin="Google ile kayıt ol" /><Ayrac /></>}

      <Alan id="ad" etiket="Ad Soyad" Ikon={UserRound} autoComplete="name" placeholder="Ad Soyad" maxLength={80} required {...alan("ad")} />
      <Alan id="eposta" etiket="E-posta" Ikon={Mail} type="email" autoComplete="email" placeholder="ornek@email.com" required {...alan("eposta")} />
      <SifreAlani id="parola" etiket="Şifre" deger={f.parola} setDeger={set("parola")} autoComplete="new-password"
        placeholder={`En az ${MIN_SIFRE} karakter`} gucGoster />
      <div>
        <SifreAlani id="tekrar" etiket="Şifre tekrar" deger={f.tekrar} setDeger={set("tekrar")} autoComplete="new-password" placeholder="Şifreni yeniden yaz" />
        {f.tekrar && (
          <p className={cn("text-[11px] mt-1.5", eslesiyor ? "text-emerald-300" : "text-red-300")}>
            {eslesiyor ? "Şifreler eşleşiyor" : "Şifreler eşleşmiyor"}
          </p>
        )}
      </div>

      <AnimatePresence initial={false}>
        {rol === "girisimci" && (
          <motion.div key="girisimci" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-3 pt-0.5">
              <Mesaj tur="uyari">Girişimci hesapları yönetici onayından sonra açılır; o zamana kadar öğrenci gibi kullanırsın.</Mesaj>
              <div>
                <label htmlFor="aciklama" className="block text-[13px] font-medium text-foreground/90 mb-1.5">
                  Ne sunmak istiyorsun? <span className="text-muted-foreground font-normal">(isteğe bağlı)</span>
                </label>
                <textarea id="aciklama" rows={3} maxLength={600} placeholder="Ör. gömülü sistemler kursu, FPGA proje dosyaları…"
                  className="w-full rounded-xl border border-card-border bg-background/60 px-3.5 py-3 text-sm placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
                  {...alan("aciklama")} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Onay secili={kosul} setSecili={setKosul}>
        Kullanım koşullarını ve gizlilik ilkelerini kabul ediyorum.
      </Onay>
      <Mesaj>{hata}</Mesaj>
      <AnaDugme mesgul={mesgul === "eposta"}>
        {mesgul === "eposta" ? "Hesap oluşturuluyor…" : rol === "girisimci" ? "Başvur ve kayıt ol" : "Hesap oluştur"}
      </AnaDugme>
    </form>
  );
}

function SifreSifirlama({ ilkEposta, geri }) {
  const [eposta, setEposta] = useState(ilkEposta || "");
  const [hata, setHata] = useState("");
  const [gonderildi, setGonderildi] = useState(false);
  const [mesgul, setMesgul] = useState(false);

  async function gonder(e) {
    e.preventDefault();
    setHata("");
    if (!eposta.trim()) return setHata("E-posta adresini yaz.");
    setMesgul(true);
    try { await sifreSifirla(eposta); setGonderildi(true); }
    catch (err) {
      // Hesabın var olup olmadığını belli etmemek için aynı cevap.
      if (err?.code === "auth/user-not-found") setGonderildi(true); else setHata(hataMetni(err));
    }
    setMesgul(false);
  }

  return (
    <div>
      <button type="button" onClick={geri} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Girişe dön
      </button>
      <span className="mt-6 h-12 w-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
        <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl font-bold tracking-tight mt-4">Şifreni sıfırla</h2>
      {gonderildi ? (
        <div className="mt-4 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">{eposta.trim()}</span> adresinde bir hesap varsa sıfırlama bağlantısı yolda.
            Gelen kutunu (ve spam klasörünü) kontrol et.
          </p>
          <button type="button" onClick={geri} className="w-full h-12 rounded-xl border border-card-border hover:bg-foreground/[0.05] text-[15px] font-medium">
            Giriş ekranına dön
          </button>
        </div>
      ) : (
        <form onSubmit={gonder} className="mt-2 space-y-5" noValidate>
          <p className="text-sm text-muted-foreground">Hesabının e-posta adresini yaz, sana yeni şifre belirleme bağlantısı gönderelim.</p>
          <Alan id="s-eposta" etiket="E-posta" Ikon={Mail} type="email" autoComplete="email" placeholder="ornek@email.com"
            value={eposta} onChange={(e) => setEposta(e.target.value)} required autoFocus />
          <Mesaj>{hata}</Mesaj>
          <AnaDugme mesgul={mesgul}>{mesgul ? "Gönderiliyor…" : "Bağlantı gönder"}</AnaDugme>
        </form>
      )}
    </div>
  );
}

const BASLIK = {
  giris: ["Tekrar hoş geldin", "Kaldığın yerden devam etmek için giriş yap."],
  kayit: ["Hesabını oluştur", "Ücretsiz — bir dakikadan kısa sürer."],
};

/** /giris ve /kayit sayfalarının ortak, sekmeli giriş-kayıt ekranı. */
export default function GirisKayit({ mod }) {
  const oturum = useOturum();
  const [, git] = useLocation();
  const [sifre, setSifre] = useState(null); // null ya da başlangıç e-postası
  useEffect(() => { setSifre(null); }, [mod]);

  let govde;
  if (!oturum.hazir) govde = <Yukleniyor />;
  else if (!oturum.kurulu || oturum.baglanamadi) govde = <Kullanilamaz oturum={oturum} />;
  else if (oturum.kullanici) {
    govde = (
      <div className="text-center py-6">
        <span className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Check className="h-6 w-6 text-emerald-300" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl font-bold mt-4">Giriş yaptın</h2>
        <p className="text-sm text-muted-foreground mt-1">{oturum.kullanici.eposta}</p>
        <Link href="/hesabim" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          Hesabına git <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  } else if (sifre !== null) govde = <SifreSifirlama ilkEposta={sifre} geri={() => setSifre(null)} />;
  else {
    const [baslik, alt] = BASLIK[mod];
    govde = (
      <>
        <SekmeSecici mod={mod} sec={(m) => git(m === "giris" ? "/giris" : "/kayit", { replace: true })} />
        <div className="mt-7">
          <h1 className="font-display text-[28px] font-bold tracking-tight leading-tight">{baslik}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{alt}</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mod} className="mt-7"
            initial={{ opacity: 0, x: mod === "kayit" ? 16 : -16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mod === "kayit" ? -16 : 16 }} transition={{ duration: 0.18 }}>
            {mod === "giris" ? <GirisFormu sifreUnuttum={(e) => setSifre(e)} /> : <KayitFormu />}
          </motion.div>
        </AnimatePresence>
        <p className="text-sm text-muted-foreground text-center mt-7">
          {mod === "giris" ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
          <Link href={mod === "giris" ? "/kayit" : "/giris"} className="font-semibold text-primary hover:underline underline-offset-4">
            {mod === "giris" ? "Ücretsiz kayıt ol" : "Giriş yap"}
          </Link>
        </p>
      </>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-silicon-grid opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px] lg:hidden" aria-hidden="true" />
      <div className="relative container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 items-stretch">
          <MarkaPaneli />
          <div className="flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="w-full max-w-[460px] rounded-[24px] border border-card-border bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <span className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <span className="font-display font-bold tracking-tight">Chip Akademi</span>
              </div>
              {govde}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
