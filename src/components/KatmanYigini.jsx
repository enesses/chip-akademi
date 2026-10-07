import { cn } from "@/lib/utils";

/**
 * Patlatılmış izometrik katman yığını.
 *
 * Her katman bir eşkenar dörtgen (üst yüz) + iki yan yüzden oluşan ince bir
 * plaka olarak çizilir. Plakalar dikeyde ayrıldığı için üstteki plaka alttakini
 * kısmen kapatır; doğru örtüşme için diziyi tersten çiziyoruz (son katman önce,
 * ilk katman en üstte kalacak şekilde).
 */
export default function KatmanYigini({
  katmanlar = [],
  aktif = null,
  onAktif,
  mini = false,
  className,
}) {
  const n = katmanlar.length;
  if (!n) return null;

  const hw = mini ? 54 : 128; // yarı genişlik
  const hh = mini ? 11 : 26; // yarı derinlik (izometrik basıklık)
  const t = mini ? 3 : 6; // plaka kalınlığı
  const gap = mini ? 13 : 32; // katmanlar arası dikey boşluk
  const pad = mini ? 6 : 12;

  const cx = hw + pad;
  const genislik = cx * 2;
  const yukseklik = (n - 1) * gap + hh * 2 + t + pad * 2;
  const y0 = pad + hh;

  const etkilesimli = !mini && typeof onAktif === "function";

  // Arkadan öne doğru çiz: son katman ilk, ilk katman son (en üstte).
  const sira = katmanlar.map((k, i) => ({ k, i })).reverse();

  return (
    <svg
      viewBox={`0 0 ${genislik} ${yukseklik}`}
      className={cn("w-full h-auto select-none", className)}
      role={mini ? "presentation" : "img"}
      aria-label={mini ? undefined : `${n} katmanlı patlatılmış görünüm`}
    >
      {sira.map(({ k, i }) => {
        const y = y0 + i * gap;
        const renk = k.renk || "#94a3b8";
        const secili = aktif === i;
        const solgun = aktif != null && !secili;

        const ustYuz = `M ${cx - hw},${y} L ${cx},${y - hh} L ${cx + hw},${y} L ${cx},${y + hh} Z`;
        const solYuz = `M ${cx - hw},${y} L ${cx - hw},${y + t} L ${cx},${y + hh + t} L ${cx},${y + hh} Z`;
        const sagYuz = `M ${cx},${y + hh} L ${cx},${y + hh + t} L ${cx + hw},${y + t} L ${cx + hw},${y} Z`;

        return (
          <g
            key={i}
            opacity={solgun ? 0.3 : 1}
            style={{ transition: "opacity 150ms" }}
            className={etkilesimli ? "cursor-pointer" : undefined}
            onMouseEnter={etkilesimli ? () => onAktif(i) : undefined}
            onMouseLeave={etkilesimli ? () => onAktif(null) : undefined}
            onFocus={etkilesimli ? () => onAktif(i) : undefined}
            onBlur={etkilesimli ? () => onAktif(null) : undefined}
            tabIndex={etkilesimli ? 0 : undefined}
            role={etkilesimli ? "button" : undefined}
            aria-label={etkilesimli ? k.ad : undefined}
          >
            {/* yan yüzler: üst yüzden koyu, kalınlık hissi veriyor */}
            <path d={solYuz} fill={renk} opacity={0.45} />
            <path d={sagYuz} fill={renk} opacity={0.28} />
            {/* üst yüz */}
            <path
              d={ustYuz}
              fill={renk}
              fillOpacity={secili ? 0.42 : 0.2}
              stroke={renk}
              strokeWidth={secili ? 2 : 1.1}
              style={{ transition: "fill-opacity 150ms, stroke-width 150ms" }}
            />
            {/* seçili katmanın orta noktasında küçük işaret */}
            {secili && <circle cx={cx} cy={y} r={3} fill={renk} />}
          </g>
        );
      })}
    </svg>
  );
}
