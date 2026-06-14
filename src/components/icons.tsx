// Minimal icon set for the SANN website (stroke = currentColor).
type P = { size?: number; className?: string };

export function ArrowR({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function Star({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l2.95 5.97 6.6.96-4.77 4.65 1.13 6.57L12 17.98 6.09 21.1l1.13-6.57L2.45 8.93l6.6-.96L12 2z" />
    </svg>
  );
}
export function Plus({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function Minus({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}
export function Check({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// Decorative dot grid (terracotta) used behind the hero + CTA.
export function DotGrid({ n = 8, gap = 18, r = 1.6, size }: { n?: number; gap?: number; r?: number; size?: number }) {
  const dim = size ?? n * gap;
  return (
    <svg viewBox={`0 0 ${n * gap} ${n * gap}`} width={dim} height={dim} aria-hidden="true">
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={row * gap + gap / 2} cy={col * gap + gap / 2} r={r} fill="var(--sann-red)" />
        )),
      )}
    </svg>
  );
}
