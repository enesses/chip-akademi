/**
 * Serbest lisanslı gerçek fotoğrafı bulunamayan çipler için yer tutucu:
 * bacaklı bir kılıf çizimi, ortada üreticinin renginde kalıp. Uydurma görsel
 * yerine bunun ne olduğu açıkça belli.
 */
export default function ChipYerTutucu({ chip, renk, ayrinti = false }) {
  const pin = Array.from({ length: 9 }, (_, i) => 30 + i * 17.5);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-silicon-grid p-4 text-center">
      <svg viewBox="0 0 200 200" className={ayrinti ? "w-28 h-28" : "w-16 h-16"} aria-hidden="true" fill="none">
        <g className="stroke-foreground" strokeWidth="2">
          {pin.map((p) => <path key={p} d={`M${p} 8v14M${p} 178v14M8 ${p}h14M178 ${p}h14`} />)}
          <rect x="24" y="24" width="152" height="152" className="fill-card" />
        </g>
        <rect x="64" y="64" width="72" height="72" style={{ fill: renk }} opacity="0.85" />
        <circle cx="40" cy="40" r="4" className="fill-foreground" />
      </svg>
      {ayrinti ? (
        <div>
          <p className="font-display font-semibold text-sm leading-snug">{chip.name}</p>
          {chip.process_node && <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{chip.process_node}</p>}
          <p className="font-mono text-[10px] text-muted-foreground mt-2">Serbest lisanslı gerçek fotoğrafı bulunamadı</p>
        </div>
      ) : (
        <p className="font-mono text-[10px] text-muted-foreground">fotoğraf yok</p>
      )}
    </div>
  );
}
