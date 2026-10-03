import { GRID_COLS, GRID_ROWS, getBlock } from "@/data/blocks";
export default function DiePreview({ placed = [], className = "" }) {
  const cell = 6, gap = 0.6, w = GRID_COLS*cell, h = GRID_ROWS*cell;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tasarım önizlemesi">
      <rect x="0" y="0" width={w} height={h} rx="2" fill="hsl(var(--muted) / 0.35)" />
      {Array.from({ length: GRID_ROWS }).map((_, y) => Array.from({ length: GRID_COLS }).map((__, x) => (
        <rect key={`${x}-${y}`} x={x*cell+gap} y={y*cell+gap} width={cell-gap*2} height={cell-gap*2} rx="0.8" fill="hsl(var(--border) / 0.25)" />
      )))}
      {placed.map((p) => {
        const b = getBlock(p.blockId);
        if (!b) return null;
        return <rect key={p.id} x={p.x*cell+gap} y={p.y*cell+gap} width={b.w*cell-gap*2} height={b.h*cell-gap*2} rx="1" fill={`${b.color}55`} stroke={b.color} strokeWidth="0.5" />;
      })}
    </svg>
  );
}
