import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/Nav";
import { CircleAlert, Download, KeyRound, LogIn, LogOut, ShieldOff, Trash2, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AVATARLAR, MIN_PAROLA, aktifProfil, cikisYap, disaAktar, eskiVeriyiTasi, girisYap, iceAktar,
  parolaDegistir, parolasizProfiller, profilOlustur, profilSil, profilleriListele,
} from "@/lib/hesap";
import { cn } from "@/lib/utils";
import { dosyaKaydet } from "@/lib/dosyaKaydet";

export default function Hesap() {
  const [profiller, setProfiller] = useState([]);
  const [aktif, setAktif] = useState(null);
  const [mod, setMod] = useState("liste");
  const [secili, setSecili] = useState(null);
  const [parola, setParola] = useState("");
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
  const [silOnay, setSilOnay] = useState(null);
  const [ad, setAd] = useState("");
  const [yeniParola, setYeniParola] = useState("");
  const [parolaTekrar, setParolaTekrar] = useState("");
  const [avatar, setAvatar] = useState(AVATARLAR[0]);
  const [parolaDegis, setParolaDegis] = useState(null);
  const dosyaRef = useRef(null);

  function yenile() { setProfiller(profilleriListele()); setAktif(aktifProfil()); }
  useEffect(() => { yenile(); }, []);

  async function olustur(e) {
    e?.preventDefault?.();
    setHata("");
    if (yeniParola !== parolaTekrar) { setHata("Parolalar eşleşmiyor."); return; }
    try {
      const ilk = profilleriListele().length === 0;
      const p = await profilOlustur({ ad, parola: yeniParola, avatar });
      await girisYap(p.id, yeniParola);
      if (ilk) { const t = eskiVeriyiTasi(p.id); if (t.length) setBilgi("Mevcut ilerlemen bu profile taşındı."); }
      setAd(""); setYeniParola(""); setParolaTekrar(""); setMod("liste"); yenile();
    } catch (e) { setHata(e.message); }
  }
  async function giris(id) {
    setHata("");
    try { await girisYap(id, parola); setParola(""); setSecili(null); yenile(); setBilgi("Giriş yapıldı."); }
    catch (e) { setHata(e.message); }
  }
  async function indir(id) {
    const paket = disaAktar(id); if (!paket) return;
    setHata("");
    const ad = `chip-akademi-${paket.profil.ad.replace(/\s+/g, "-").toLowerCase()}.json`;
    const sonuc = await dosyaKaydet(ad, JSON.stringify(paket, null, 2), "application/json");
    if (sonuc.durum === "kaydedildi") setBilgi("Profil dışa aktarıldı.");
    else if (sonuc.durum === "hata") setHata(sonuc.mesaj);
  }
  async function dosyaSecildi(e) {
    const dosya = e.target.files?.[0]; if (!dosya) return;
    setHata("");
    try { const paket = JSON.parse(await dosya.text()); await iceAktar(paket); yenile(); setBilgi("Profil içe aktarıldı."); }
    catch (err) { setHata(`İçe aktarılamadı: ${err.message}`); }
    e.target.value = "";
  }

  return (
    <div className="bg-silicon-grid min-h-[80vh]">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-chip-glow" />
        <div className="relative container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3"><UserPlus className="h-3.5 w-3.5" />Profiller</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3">
              {aktif ? <>Merhaba, <span className="text-gradient-cyan">{aktif.ad}</span>.</> : <>Kendi <span className="text-gradient-cyan">profilini</span> oluştur.</>}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Ders ilerlemen, sınav sonuçların, tasarımların ve notların profiline bağlanır. Aynı tarayıcıyı kullanan birden fazla kişi birbirinin verisini karıştırmaz.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-5 flex items-start gap-3 max-w-3xl">
          <ShieldOff className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-amber-200">Bu bir güvenlik sistemi değil</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
              Uygulamanın sunucusu yok, bu yüzden parola tarayıcıda kontrol edilir ve verilerin hiçbiri şifrelenmez. Kararlı birinin veriye erişmesini <em>önlemez</em>. Gizli hiçbir şey saklama.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">Veriler yalnızca bu tarayıcıda durur. Bu yüzden aşağıdaki <strong>yedek al</strong> düğmesi var.</p>
          </div>
        </div>
      </section>

      {parolasizProfiller().length > 0 && (
        <section className="container mx-auto px-4 pb-4">
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-5 flex items-start gap-3 max-w-3xl">
            <KeyRound className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-amber-200">{parolasizProfiller().length} profilde parola yok</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                {parolasizProfiller().map((p) => p.ad).join(", ")}. Giriş yapıp <strong>Parola belirle</strong> ile tamamlayabilirsin.
              </p>
            </div>
          </div>
        </section>
      )}

      {(hata || bilgi) && (
        <section className="container mx-auto px-4 pb-4">
          <div className={cn("rounded-xl border p-3 flex items-start gap-2.5 max-w-3xl text-sm",
            hata ? "border-red-500/40 bg-red-500/5 text-red-300" : "border-emerald-500/40 bg-emerald-500/5 text-emerald-300")}>
            <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" /><span>{hata || bilgi}</span>
          </div>
        </section>
      )}

      {aktif && (
        <section className="container mx-auto px-4 pb-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 flex items-center justify-between gap-4 flex-wrap max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{aktif.avatar}</span>
              <div>
                <p className="font-display font-bold text-lg">{aktif.ad}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{aktif.ozet ? "parolalı" : "parolasız"} · son giriş {new Date(aktif.sonGiris).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" className="gap-1.5" onClick={() => setParolaDegis({ id: aktif.id, eski: "", yeni: "", tekrar: "" })}><KeyRound className="h-4 w-4" />{aktif.ozet ? "Parolayı değiştir" : "Parola belirle"}</Button>
              <Button variant="outline" className="gap-1.5" onClick={() => indir(aktif.id)}><Download className="h-4 w-4" />Yedek al</Button>
              <Button variant="ghost" className="gap-1.5" onClick={() => { cikisYap(); yenile(); setBilgi("Çıkış yapıldı."); }}><LogOut className="h-4 w-4" />Çıkış</Button>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <h2 className="font-display font-bold text-xl">{mod === "olustur" ? "Yeni profil" : `Profiller (${profiller.length})`}</h2>
            <div className="flex gap-2">
              {mod === "liste" ? (
                <>
                  <Button className="gap-1.5" onClick={() => setMod("olustur")}><UserPlus className="h-4 w-4" />Yeni profil</Button>
                  <Button variant="outline" className="gap-1.5" onClick={() => dosyaRef.current?.click()}><Upload className="h-4 w-4" />Yedekten yükle</Button>
                  <input ref={dosyaRef} type="file" accept="application/json" className="hidden" onChange={dosyaSecildi} />
                </>
              ) : <Button variant="ghost" onClick={() => setMod("liste")}>Vazgeç</Button>}
            </div>
          </div>

          {mod === "olustur" ? (
            <div className="rounded-2xl border border-card-border bg-card p-6 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">İsim</label>
                <Input value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Adın ya da takma adın" className="mt-1.5" data-testid="profil-ad" />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Simge</label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {AVATARLAR.map((a) => (
                    <button key={a} type="button" onClick={() => setAvatar(a)} className={cn("w-9 h-9 rounded-lg border text-lg transition-all hover-elevate", avatar === a ? "border-primary bg-primary/10" : "border-border bg-card")}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Parola <span className="text-primary">(zorunlu)</span></label>
                <Input type="password" value={yeniParola} onChange={(e) => setYeniParola(e.target.value)} placeholder={`En az ${MIN_PAROLA} karakter`} className="mt-1.5" data-testid="profil-parola" />
                <Input type="password" value={parolaTekrar} onChange={(e) => setParolaTekrar(e.target.value)} placeholder="Parolayı tekrar yaz" className="mt-2" data-testid="profil-parola-tekrar" />
                {parolaTekrar && yeniParola !== parolaTekrar && <p className="text-[11px] text-red-400 mt-1.5">Parolalar eşleşmiyor.</p>}
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">Parola profil değiştirmeyi kapıya bağlar ama verilerini şifrelemez. <strong className="text-amber-200">Parola kurtarma yok.</strong></p>
              </div>
              <Button onClick={olustur} className="gap-1.5" data-testid="profil-olustur"><UserPlus className="h-4 w-4" />Oluştur ve giriş yap</Button>
            </div>
          ) : profiller.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <UserPlus className="h-8 w-8 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">Henüz profil yok</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">Profil oluşturmadan da uygulamayı kullanabilirsin; verilerin ortak alanda tutulur.</p>
              <Button className="mt-5 gap-1.5" onClick={() => setMod("olustur")}><UserPlus className="h-4 w-4" />İlk profili oluştur</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {profiller.map((p) => {
                const buAktif = aktif?.id === p.id;
                return (
                  <div key={p.id} className={cn("rounded-xl border p-4", buAktif ? "border-primary/50 bg-primary/5" : "border-card-border bg-card")} data-testid={`profil-${p.id}`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{p.avatar}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{p.ad}{buAktif && <span className="font-mono text-[9px] uppercase tracking-wider text-primary ml-2">aktif</span>}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{p.ozet ? "parolalı" : "parolasız"} · {new Date(p.olusturma).toLocaleDateString("tr-TR")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!buAktif && (secili === p.id && p.ozet ? (
                          <div className="flex gap-1.5">
                            <Input type="password" autoFocus value={parola} onChange={(e) => setParola(e.target.value)} onKeyDown={(e) => e.key === "Enter" && giris(p.id)} placeholder="Parola" className="h-8 w-32 text-xs" />
                            <Button size="sm" onClick={() => giris(p.id)}>Gir</Button>
                          </div>
                        ) : <Button size="sm" className="gap-1.5" onClick={() => (p.ozet ? setSecili(p.id) : giris(p.id))} data-testid={`giris-${p.id}`}><LogIn className="h-3.5 w-3.5" />Giriş</Button>)}
                        <Button size="sm" variant="ghost" aria-label={`${p.ad} profilinin yedeğini indir`} title="Yedeği indir" onClick={() => indir(p.id)}><Download className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" aria-label={`${p.ad} profilini sil`} title="Profili sil" className="text-muted-foreground hover:text-red-400" onClick={() => setSilOnay(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {parolaDegis && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-6">
            <h3 className="font-display font-bold text-base mb-1">{aktif?.ozet ? "Parolayı değiştir" : "Parola belirle"}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">Parola kurtarma yok — unutursan bu profile arayüzden ulaşamazsın.</p>
            {aktif?.ozet && <Input type="password" autoFocus value={parolaDegis.eski} onChange={(e) => setParolaDegis({ ...parolaDegis, eski: e.target.value })} placeholder="Mevcut parola" className="mb-2" />}
            <Input type="password" value={parolaDegis.yeni} onChange={(e) => setParolaDegis({ ...parolaDegis, yeni: e.target.value })} placeholder={`Yeni parola (en az ${MIN_PAROLA} karakter)`} className="mb-2" data-testid="yeni-parola" />
            <Input type="password" value={parolaDegis.tekrar} onChange={(e) => setParolaDegis({ ...parolaDegis, tekrar: e.target.value })} placeholder="Yeni parolayı tekrar yaz" />
            {parolaDegis.tekrar && parolaDegis.yeni !== parolaDegis.tekrar && <p className="text-[11px] text-red-400 mt-1.5">Parolalar eşleşmiyor.</p>}
            <div className="flex gap-2 justify-end mt-5">
              <Button variant="ghost" onClick={() => setParolaDegis(null)}>Vazgeç</Button>
              <Button onClick={async () => {
                setHata("");
                if (parolaDegis.yeni !== parolaDegis.tekrar) { setHata("Parolalar eşleşmiyor."); return; }
                try { await parolaDegistir(parolaDegis.id, parolaDegis.eski, parolaDegis.yeni); setParolaDegis(null); yenile(); setBilgi("Parola güncellendi."); }
                catch (e) { setHata(e.message); }
              }}>Kaydet</Button>
            </div>
          </div>
        </div>
      )}

      {silOnay && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-6">
            <h3 className="font-display font-bold text-base mb-2">Profil silinsin mi?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">Bu profile ait tüm veriler silinir. Geri alınamaz.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setSilOnay(null)}>Vazgeç</Button>
              <Button variant="outline" className="gap-1.5" onClick={() => indir(silOnay)}><Download className="h-4 w-4" />Yedek al</Button>
              <Button variant="destructive" onClick={() => { profilSil(silOnay); setSilOnay(null); yenile(); setBilgi("Profil silindi."); }}>Sil</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
