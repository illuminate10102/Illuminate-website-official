/** Placeholder box for a future video explanation, shown next to a guide's title. */
export function VideoPlaceholder() {
  return (
    <div
      className="reveal reveal-2 w-full aspect-video lg:w-[320px] shrink-0 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-chalk-soft/30 bg-chalk/5 px-4 text-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-9 h-9 text-chalk-soft/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M10 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
      </svg>
      <p className="course-code text-xs uppercase tracking-wide text-chalk-soft/70">
        Video explanation here
      </p>
    </div>
  );
}
