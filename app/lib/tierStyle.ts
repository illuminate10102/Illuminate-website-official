/**
 * Sets --tier-h (a hue angle) plus the composed --tier-accent* tokens as
 * inline custom properties on a wrapper element.
 *
 * Why redeclare the composed tokens here instead of just --tier-h: CSS
 * custom properties inherit their already-*resolved* value, not a live
 * formula. --tier-accent is defined once in app.css as
 * oklch(var(--tier-l) var(--tier-c) var(--tier-h, 264)) — if that were
 * only ever declared at :root, it would permanently resolve using
 * :root's (unset) --tier-h and every descendant would inherit that same
 * frozen fallback color, no matter what --tier-h they set locally.
 * Re-stating the same formula at the same element that sets --tier-h
 * forces the browser to resolve it fresh right there, and *that*
 * resolved color is what correctly flows down to children.
 *
 * --tier-l/-c/-wash-a/-border-a are plain, non-derived values (they only
 * vary by light/dark theme, set at :root), so they don't need repeating
 * here — only the tokens that are actually built from --tier-h do.
 */
export function tierHueStyle(hue: number): React.CSSProperties {
  return {
    "--tier-h": hue,
    "--tier-accent": "oklch(var(--tier-l) var(--tier-c) var(--tier-h, 264))",
    "--tier-accent-wash": "oklch(var(--tier-l) var(--tier-c) var(--tier-h, 264) / var(--tier-wash-a))",
    "--tier-accent-border": "oklch(var(--tier-l) var(--tier-c) var(--tier-h, 264) / var(--tier-border-a))",
    "--tier-accent-chalk": "oklch(0.82 0.1 var(--tier-h, 264))",
    "--tier-accent-chalk-border": "oklch(0.82 0.1 var(--tier-h, 264) / 45%)",
  } as React.CSSProperties;
}
