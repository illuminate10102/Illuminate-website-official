/**
 * Decorative yellow-ochre wave strokes for navy title bands. Sits behind
 * the hero copy as a quiet accent — light mode only, see `.hero-waves`
 * in app.css for the dark-mode hide.
 */
export function HeroWaves() {
  return (
    <div className="hero-waves" aria-hidden="true">
      <svg
        viewBox="0 0 1280 460"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M-40 120C180 40 340 200 560 130C780 60 940 220 1160 140C1260 104 1300 96 1340 90"
          stroke="var(--color-marker)"
          strokeOpacity="0.16"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-40 420C220 340 380 470 640 400C900 330 1040 460 1320 380"
          stroke="var(--color-marker)"
          strokeOpacity="0.22"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-40 40C120 -10 260 70 460 30C660 -10 800 70 1000 30C1120 6 1220 -6 1340 -20"
          stroke="var(--color-marker)"
          strokeOpacity="0.1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
