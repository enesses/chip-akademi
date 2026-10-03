const PALETTE = ["#22d3ee","#a855f7","#f59e0b","#34d399","#f472b6","#60a5fa","#fb923c","#f87171"];

export default function DieDiagram({ chip }) {
  const regions = chip.die_regions || [];
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <svg viewBox="0 0 300 200" className="w-full h-auto rounded-lg" style={{ background: "#0a0e14" }}>
        {regions.map((r, i) => {
          const p = r.position || {};
          const color = PALETTE[i % PALETTE.length];
          const x = (p.x_pct / 100) * 300, y = (p.y_pct / 100) * 200;
          const w = (p.width_pct / 100) * 300, h = (p.height_pct / 100) * 200;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={`${color}33`} stroke={color} strokeWidth="1" rx="2" />
              <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="6" fontFamily="monospace">
                {r.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-1 gap-2 mt-3">
        {regions.map((r, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-sm shrink-0 mt-1" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span><strong className="text-foreground/90">{r.name}:</strong> <span className="text-muted-foreground">{r.description}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
