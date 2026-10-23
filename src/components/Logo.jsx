/** Chip Akademi işareti: bacaklı bir kılıf, içinde vurgu renginde kalıp (die). */
export function LogoIsaret({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M8 2v2.5M12 2v2.5M16 2v2.5M8 19.5V22M12 19.5V22M16 19.5V22M2 8h2.5M2 12h2.5M2 16h2.5M19.5 8H22M19.5 12H22M19.5 16H22" />
        <rect x="4.75" y="4.75" width="14.5" height="14.5" />
      </g>
      <rect x="8.5" y="8.5" width="7" height="7" className="fill-primary" />
    </svg>
  );
}

export default function Logo({ kisa = false }) {
  return (
    <span className="inline-flex items-center gap-2 text-foreground">
      <LogoIsaret />
      {!kisa && (
        <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">
          Chip<span className="text-muted-foreground font-normal">Akademi</span>
        </span>
      )}
    </span>
  );
}
