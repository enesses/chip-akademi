import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DURUM_AD, Kabuk, Kullanilamaz, Mesaj, Yukleniyor } from "@/components/hesap/Ortak";
import YalnizAdmin from "@/components/hesap/YalnizAdmin";
import { basvurular, hataMetni, kararVer, useOturum } from "@/lib/oturum";
import { cn } from "@/lib/utils";

const tarih = (iso) => (iso ? new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }) : "—");

function Basvuru({ b, onKarar, mesgul }) {
  return (
    <li className={cn("rounded-xl border p-4", b.durum === "bekliyor" ? "border-amber-400/40 bg-amber-500/5" : "border-card-border bg-card")}>
      <div className="flex items-start gap-3 flex-wrap">
        <Rocket className="h-4 w-4 mt-1 text-muted-foreground shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">{b.ad}</p>
          <p className="text-xs text-muted-foreground break-all">{b.eposta} · başvuru {tarih(b.olusturma)}</p>
          {b.aciklama && <p className="text-sm mt-2 whitespace-pre-wrap break-words">{b.aciklama}</p>}
          {b.durum !== "bekliyor" && (
            <p className={cn("text-xs mt-2", b.durum === "onaylandi" ? "text-emerald-300" : "text-red-300")}>
              {DURUM_AD[b.durum]}{b.karar?.tarih ? ` · ${tarih(b.karar.tarih)}` : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {b.durum !== "onaylandi" && (
            <Button size="sm" onClick={() => onKarar(b, "onaylandi")} disabled={mesgul} className="gap-1 bg-emerald-500 text-emerald-950">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />Onayla
            </Button>
          )}
          {b.durum !== "reddedildi" && (
            <Button size="sm" variant="outline" onClick={() => onKarar(b, "reddedildi")} disabled={mesgul} className="gap-1">
              <X className="h-3.5 w-3.5" aria-hidden="true" />Reddet
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

function Liste() {
  const [liste, setListe] = useState(null);
  const [hata, setHata] = useState("");
  const [mesgul, setMesgul] = useState(null);

  const yukle = useCallback(async () => {
    setHata("");
    try {
      const l = await basvurular();
      l.sort((a, b) => (a.durum === "bekliyor" ? 0 : 1) - (b.durum === "bekliyor" ? 0 : 1) || String(b.olusturma).localeCompare(String(a.olusturma)));
      setListe(l);
    } catch (e) { setHata(hataMetni(e)); setListe([]); }
  }, []);
  useEffect(() => { yukle(); }, [yukle]);

  async function karar(b, durum) {
    if (durum === "reddedildi" && !window.confirm(`${b.ad} adlı kişinin başvurusu reddedilsin mi?`)) return;
    setMesgul(b.uid);
    try { await kararVer(b.uid, durum); await yukle(); }
    catch (e) { setHata(hataMetni(e)); }
    setMesgul(null);
  }

  if (liste === null) return <Yukleniyor />;
  const bekleyen = liste.filter((b) => b.durum === "bekliyor");
  const karar_verilen = liste.filter((b) => b.durum !== "bekliyor");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display font-bold text-xl">Onay bekleyenler ({bekleyen.length})</h2>
        <Button size="sm" variant="ghost" onClick={yukle} className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />Yenile</Button>
      </div>
      <Mesaj>{hata}</Mesaj>
      {bekleyen.length ? (
        <ul className="grid gap-2">{bekleyen.map((b) => <Basvuru key={b.uid} b={b} onKarar={karar} mesgul={mesgul === b.uid} />)}</ul>
      ) : <p className="text-sm text-muted-foreground">Bekleyen başvuru yok.</p>}
      {karar_verilen.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-lg pt-2">Karar verilenler</h2>
          <ul className="grid gap-2">{karar_verilen.map((b) => <Basvuru key={b.uid} b={b} onKarar={karar} mesgul={mesgul === b.uid} />)}</ul>
        </>
      )}
    </div>
  );
}

export default function Yonetim() {
  const oturum = useOturum();
  return (
    <YalnizAdmin>
      <Kabuk baslik="Girişimci başvuruları" alt="Onayladığın girişimcilerin hesabı açılır; reddettiklerin normal kullanıcı olarak kalır." genis>
        {!oturum.hazir ? <Yukleniyor /> : (!oturum.kurulu || oturum.baglanamadi || !oturum.kullanici) ? <Kullanilamaz oturum={{ ...oturum, kurulu: oturum.kurulu }} /> : <Liste />}
      </Kabuk>
    </YalnizAdmin>
  );
}
