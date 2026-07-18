import { Icon, type IconName } from "../Icon";

/**
 * Shared building blocks for every guide in app/content/*.tsx. Previously
 * each guide hand-rolled its own identical Callout/H2/H3/list markup —
 * this is the single source, colorized via the --tier-h/-l/-c custom
 * properties a wrapper sets around <Body /> (see routes/field.tsx), so a
 * guide's accent color always matches the tier it lives under in the nav
 * and category page, with zero color props threaded through every guide.
 */

function defaultCalloutIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("caution") || l.includes("warning")) return "shield";
  if (l.includes("tip")) return "lightbulb";
  return "star";
}

export function Callout({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: IconName;
}) {
  return (
    <div className="prose-callout">
      <p className="font-mono text-xs uppercase tracking-wide text-ink mb-2 flex items-center gap-2">
        <Icon name={icon ?? defaultCalloutIcon(label)} className="w-4 h-4 prose-callout-icon shrink-0" />
        {label}
      </p>
      <div className="text-ink text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mb-5">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-subtitle font-bold text-xl text-ink tracking-tight mb-3 mt-8">
      {children}
    </h3>
  );
}

export const ul =
  "space-y-2.5 text-ink-soft text-base leading-relaxed list-disc pl-5 marker:[color:var(--tier-accent)]";
export const nestedUl =
  "space-y-2 text-ink-soft text-base leading-relaxed list-[circle] pl-5 mt-2 marker:[color:var(--tier-accent)]";

/** Numbered steps as colored circular badges (see .prose-ol in app.css) —
 * drop-in replacement for a plain list-decimal <ol>, same <li> children. */
export const ol = "prose-ol space-y-3 text-ink-soft text-base leading-relaxed";

/** Checkmark list for tips/wins — deliberately a fixed mint green rather
 * than the tier accent, so "done/good" reads the same across every guide. */
export const checklist = "prose-check space-y-2.5 text-ink-soft text-base leading-relaxed";
