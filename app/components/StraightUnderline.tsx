type StraightUnderlineProps = {
  color?: string;
  className?: string;
};

/** A straight-line underline — the non-hand-drawn counterpart to ChalkUnderline. */
export function StraightUnderline({ color = "var(--color-marker)", className = "" }: StraightUnderlineProps) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`absolute left-0 -bottom-1 w-full h-[0.4em] ${className}`}
    >
      <line x1="1" y1="11" x2="199" y2="11" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
