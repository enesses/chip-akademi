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

  // Bölge kısaltmaları: çizimdeki çağrı harfleri (datasheet usulü)
  const HARF = { sm: "A", l2: "B", hbm: "C", io: "D" };
  const cagri = (id, x, y, lx, ly) => (
    <g key={id} className="hero-die-cagri" data-aktif={aktif === id ? "1" : aktif ? "0" : undefined}>
      <line x1={x} y1={y} x2={lx} y2={ly} className="stroke-foreground" strokeWidth="0.75" />
      <circle cx={lx} cy={ly} r="9" className={aktif === id ? "fill-primary stroke-primary" : "fill-card stroke-foreground"} strokeWidth="1" />
      <text x={lx} y={ly + 3.5} textAnchor="middle" className={"hero-die-harf " + (aktif === id ? "fill-primary-foreground" : "fill-foreground")}>{HARF[id]}</text>
    </g>
  );

  return (
    <figure className={className}>
      <svg viewBox="0 0 420 420" className="w-full h-auto" role="group" aria-label="Bir AI hızlandırıcı paketinin şematik görünümü">
        <defs>
          <pattern id="hd-tarama" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" className="stroke-foreground" strokeWidth="0.9" strokeOpacity="0.45" />
          </pattern>
          <pattern id="hd-nokta" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" className="fill-foreground" fillOpacity="0.35" />
          </pattern>
        </defs>

        {/* paket ve pinler */}
        {pinler.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} className="fill-card stroke-foreground" strokeWidth="0.75" />)}
        <rect x="22" y="22" width="376" height="376" rx="4" className="fill-card stroke-foreground" strokeWidth="1.5" />
        <rect x="56" y="70" width="308" height="280" rx="2" fill="url(#hd-nokta)" className="stroke-foreground" strokeOpacity="0.5" strokeDasharray="4 3" />
        <text x="56" y="62" className="hero-die-etiket">SİLİKON ARA KATMAN · 2.5D</text>

        {/* HBM yığınları */}
        <g {...bolge("hbm")}>
          {[[66, 92], [66, 214], [314, 92], [314, 214]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="40" height="112" className="fill-card" />
              <rect x={x} y={y} width="40" height="112" fill="url(#hd-tarama)" className="stroke-foreground hero-die-dolgu" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* die */}
        <rect x="110" y="90" width="200" height="240" className="fill-card stroke-foreground" strokeWidth="1.5" />

        <g {...bolge("sm")}>
          {Array.from({ length: SATIR }).map((_, r) =>
            Array.from({ length: SUTUN }).map((__, c) => {
              const y = r < 3 ? dy + r * (tile + 4) : dy + 66 + 4 + (r - 3) * (tile + 4) + 8;
              return (
                <rect key={`${r}-${c}`} x={dx + c * (tile + 4)} y={y} width={tile} height={tile}
                  className="fill-primary hero-die-sm hero-die-dolgu"
                  style={{ animationDelay: `${((r * SUTUN + c) * 137) % 2400}ms` }} />
              );
            })
          )}
        </g>

        <g {...bolge("l2")}>
          <rect x={dx} y={dy + 3 * (tile + 4) + 2} width={dw} height="22" className="fill-card stroke-foreground hero-die-dolgu" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={dx + 4 + i * 15} y={dy + 3 * (tile + 4) + 7} width="11" height="12" fill="url(#hd-tarama)" className="stroke-foreground" strokeWidth="0.6" />
          ))}
        </g>

        <g {...bolge("io")}>
          <rect x="118" y="304" width="184" height="18" className="fill-card stroke-foreground hero-die-dolgu" strokeWidth="1" />
          {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={122 + i * 8} y="309" width="4" height="8" className="fill-foreground" fillOpacity="0.7" />)}
        </g>

        {/* çağrı harfleri */}
        {cagri("sm", 302, 112, 336, 52)}
        {cagri("l2", 118, 168, 84, 52)}
        {cagri("hbm", 106, 290, 44, 368)}
        {cagri("io", 300, 318, 376, 368)}

        {/* ölçü çizgisi */}
        <g className="hero-die-etiket">
          <line x1="110" y1="342" x2="310" y2="342" className="stroke-foreground" strokeWidth="0.75" />
          <line x1="110" y1="338" x2="110" y2="346" className="stroke-foreground" strokeWidth="0.75" />
          <line x1="310" y1="338" x2="310" y2="346" className="stroke-foreground" strokeWidth="0.75" />
        </g>
        <text x="210" y="358" textAnchor="middle" className="hero-die-etiket">≈ 26 mm · ~800 mm² KALIP</text>
        <text x="210" y="388" textAnchor="middle" className="hero-die-etiket">{aktif ? `${HARF[aktif]} — ${BOLGELER[aktif].ad.toLocaleUpperCase("tr")}` : "BİR BÖLGENİN ÜZERİNE GEL"}</text>
      </svg>
      <figcaption className="min-h-[3.5rem] text-sm text-muted-foreground leading-relaxed px-2 text-center" aria-live="polite">
        {aktif ? BOLGELER[aktif].metin : "Şekil 1 — Şematik bir AI hızlandırıcı: ortada hesap kalıbı (A), önbellek (B), yanında bellek yığınları (C), kenarda G/Ç (D)."}
      </figcaption>
    </figure>
  );
}
