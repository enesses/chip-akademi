import { useState } from "react";

/*
 * Anasayfa görseli: bir AI hızlandırıcı paketinin şematik üstten görünümü.
 * Bölgelerin üzerine gelince (ya da klavyeyle odaklanınca) ne işe yaradığı yazar —
 * sitenin çip detay sayfalarındaki "tıklanabilir die haritası" fikrinin küçük bir örneği.
 */
const BOLGELER = {
  sm: { ad: "Hesap birimleri (SM)", metin: "Binlerce küçük çekirdek aynı işlemi binlerce veri üzerinde aynı anda yapar. Die alanının çoğu buraya gider." },
  l2: { ad: "L2 cache", metin: "Çekirdeklerin paylaştığı hızlı bellek. Veri buradaysa HBM'e gitmeye gerek kalmaz." },
  hbm: { ad: "HBM3E yığınları", metin: "Üst üste dizilmiş DRAM katmanları, die'ın hemen yanında. Saniyede terabaytlarca veri taşır." },
  io: { ad: "I/O ve NVLink", metin: "Çipi dış dünyaya ve diğer GPU'lara bağlayan kenar devreleri. Bu yüzden hep die'ın kenarında durur." },
};

const SUTUN = 8, SATIR = 6;

export default function HeroDie({ className = "" }) {
  const [aktif, setAktif] = useState(null);
  const bolge = (id) => ({
    tabIndex: 0,
    role: "button",
    "aria-label": BOLGELER[id].ad,
    onMouseEnter: () => setAktif(id),
    onFocus: () => setAktif(id),
    onMouseLeave: () => setAktif(null),
    onBlur: () => setAktif(null),
    onClick: () => setAktif((a) => (a === id ? null : id)),
    className: "hero-die-bolge outline-none cursor-pointer",
    "data-aktif": aktif === id ? "1" : aktif ? "0" : undefined,
  });

  // Die: x 110–310, y 90–330
  const dx = 118, dy = 98, dw = 184, tile = (dw - (SUTUN - 1) * 4) / SUTUN;
  const pinler = [];
  for (let i = 0; i < 17; i++) {
    const p = 34 + i * 21.5;
    pinler.push([p, 14, 8, 6], [p, 400, 8, 6], [14, p, 6, 8], [400, p, 6, 8]);
  }

  return (
    <figure className={className}>
      <svg viewBox="0 0 420 420" className="w-full h-auto" role="group" aria-label="Bir AI hızlandırıcı paketinin şematik görünümü">
        <defs>
          <linearGradient id="hd-sub" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#13222f" />
            <stop offset="1" stopColor="#0b1219" />
          </linearGradient>
          <linearGradient id="hd-die" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e2a33" />
            <stop offset="1" stopColor="#0a1a22" />
          </linearGradient>
          <radialGradient id="hd-glow" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="hsl(189 94% 55%)" stopOpacity="0.22" />
            <stop offset="1" stopColor="hsl(189 94% 55%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* paket ve pinler */}
        {pinler.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#c9a24a" opacity="0.55" />)}
        <rect x="22" y="22" width="376" height="376" rx="18" fill="url(#hd-sub)" stroke="#22394a" />
        <rect x="22" y="22" width="376" height="376" rx="18" fill="url(#hd-glow)" />
        <rect x="56" y="70" width="308" height="280" rx="8" fill="#0c171f" stroke="#1d3443" strokeDasharray="3 3" />
        <text x="62" y="64" className="hero-die-etiket">SİLİKON ARA KATMAN</text>

        {/* HBM yığınları */}
        <g {...bolge("hbm")}>
          {[[66, 92], [66, 214], [314, 92], [314, 214]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="40" height="112" rx="5" fill="#2a1840" stroke="#a855f7" strokeOpacity="0.7" className="hero-die-dolgu" />
              {Array.from({ length: 8 }).map((_, k) => (
                <line key={k} x1={x + 6} x2={x + 34} y1={y + 14 + k * 12} y2={y + 14 + k * 12} stroke="#a855f7" strokeOpacity="0.45" />
              ))}
            </g>
          ))}
        </g>

        {/* die */}
        <rect x="110" y="90" width="200" height="240" rx="6" fill="url(#hd-die)" stroke="hsl(189 94% 55%)" strokeOpacity="0.55" />

        <g {...bolge("sm")}>
          {Array.from({ length: SATIR }).map((_, r) =>
            Array.from({ length: SUTUN }).map((__, c) => {
              const y = r < 3 ? dy + r * (tile + 4) : dy + 66 + 4 + (r - 3) * (tile + 4) + 8;
              return (
                <rect key={`${r}-${c}`} x={dx + c * (tile + 4)} y={y} width={tile} height={tile} rx="2"
                  fill="hsl(189 94% 55%)" className="hero-die-sm hero-die-dolgu"
                  style={{ animationDelay: `${((r * SUTUN + c) * 137) % 2400}ms` }} />
              );
            })
          )}
        </g>

        <g {...bolge("l2")}>
          <rect x={dx} y={dy + 3 * (tile + 4) + 2} width={dw} height="22" rx="3" fill="#f59e0b" fillOpacity="0.22" stroke="#f59e0b" strokeOpacity="0.6" className="hero-die-dolgu" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={dx + 4 + i * 15} y={dy + 3 * (tile + 4) + 7} width="11" height="12" rx="1" fill="#f59e0b" fillOpacity="0.35" />
          ))}
        </g>

        <g {...bolge("io")}>
          <rect x="118" y="304" width="184" height="18" rx="3" fill="#34d399" fillOpacity="0.16" stroke="#34d399" strokeOpacity="0.6" className="hero-die-dolgu" />
          {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={122 + i * 8} y="309" width="4" height="8" fill="#34d399" fillOpacity="0.55" />)}
        </g>

        {/* tarama çizgisi */}
        <rect x="110" y="90" width="200" height="2" fill="hsl(189 94% 70%)" className="hero-die-tarama" pointerEvents="none" />

        {/* etiketler */}
        <text x="210" y="388" textAnchor="middle" className="hero-die-etiket">{aktif ? BOLGELER[aktif].ad.toLocaleUpperCase("tr") : "BİR BÖLGENİN ÜZERİNE GEL"}</text>
      </svg>
      <figcaption className="min-h-[3.5rem] text-sm text-muted-foreground leading-relaxed px-2 text-center" aria-live="polite">
        {aktif ? BOLGELER[aktif].metin : "Şematik bir AI hızlandırıcı: ortada hesap die'ı, yanında bellek yığınları. Her bölge farklı bir iş yapar."}
      </figcaption>
    </figure>
  );
}
