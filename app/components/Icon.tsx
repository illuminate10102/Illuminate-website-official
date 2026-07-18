export type IconName =
  | "sparkle"
  | "book"
  | "clipboard-check"
  | "heart"
  | "cap"
  | "sun"
  | "pen-nib"
  | "search-check"
  | "users"
  | "megaphone"
  | "search"
  | "trending-up"
  | "calculator"
  | "medal"
  | "document"
  | "atom"
  | "lightbulb"
  | "book-open"
  | "compass"
  | "star"
  | "calendar"
  | "camera"
  | "mic"
  | "briefcase"
  | "flag"
  | "clock"
  | "map"
  | "shield"
  | "target"
  | "rocket"
  | "leaf"
  | "dollar"
  | "trophy"
  | "palette"
  | "network"
  | "brain"
  | "wrench"
  | "chat"
  | "globe"
  | "dumbbell"
  | "moon";

type IconProps = {
  name: IconName;
  className?: string;
};

/** Small hand-drawn-style line icons shared across cards site-wide. */
export function Icon({ name, className = "w-5 h-5" }: IconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3.5l2.2 4.4 4.9.7-3.5 3.4.8 4.9L12 14.6l-4.4 2.3.8-4.9-3.5-3.4 4.9-.7L12 3.5z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M3.5 5.5c2.5-1 5-1 8.5.5v13c-3.5-1.5-6-1.5-8.5-.5V5.5z" />
          <path d="M20.5 5.5c-2.5-1-5-1-8.5.5v13c3.5-1.5 6-1.5 8.5-.5V5.5z" />
        </svg>
      );
    case "clipboard-check":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
          <path d="M8.5 13l2 2 4.5-4.5" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20.5s-7.5-4.6-9.5-9.4C1.2 7.6 3.4 4.5 6.6 4.5c1.9 0 3.4 1 4.4 2.4 1-1.4 2.5-2.4 4.4-2.4 3.2 0 5.4 3.1 4.1 6.6-2 4.8-9.5 9.4-9.5 9.4z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M12 4L2 9l10 5 8-4V4z" />
          <path d="M20 10v4.5" />
          <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6" />
        </svg>
      );
    case "pen-nib":
      return (
        <svg {...common}>
          <path d="M4 20l.9-3.6L15.4 6l2.6 2.6L7.6 19.1 4 20z" />
          <path d="M13.6 7.4l2.6 2.6" />
        </svg>
      );
    case "search-check":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15.2 15.2L20 20" />
          <path d="M7.7 10.5l1.8 1.8 3.1-3.4" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="2.4" />
          <circle cx="16" cy="9.5" r="2" />
          <path d="M3.5 19c.3-3 2.6-5 5.5-5s5.2 2 5.5 5" />
          <path d="M14.5 14.3c2.3.3 4 2 4.3 4.7" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common}>
          <path d="M3 10v4a1 1 0 0 0 1 1h1l7 4V5l-7 4H4a1 1 0 0 0-1 1z" />
          <path d="M17 9a4 4 0 0 1 0 6" />
          <path d="M12 15.5V19a1 1 0 0 1-1.7.7L8 17.3" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.3 15.3L20.5 20.5" />
        </svg>
      );
    case "trending-up":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-9" />
          <path d="M15 6h6v6" />
        </svg>
      );
    case "calculator":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <rect x="7.5" y="5.5" width="9" height="3" rx="0.5" />
          <path
            d="M8 12.5h.01M12 12.5h.01M16 12.5h.01M8 16.5h.01M12 16.5h.01M16 16.5h.01"
            strokeWidth="2.4"
          />
        </svg>
      );
    case "medal":
      return (
        <svg {...common}>
          <circle cx="12" cy="14.5" r="5.5" />
          <path d="M9 9.5L6.5 3h3l1.7 4.8" />
          <path d="M15 9.5L17.5 3h-3l-1.7 4.8" />
          <path d="M12 12l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4" />
          <path d="M8 12h8M8 15.5h8M8 9h4" />
        </svg>
      );
    case "atom":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="1.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.1V17h6v-.3c0-.8.4-1.6 1-2.1A6.5 6.5 0 0 0 12 3z" />
        </svg>
      );
    case "book-open":
      return (
        <svg {...common}>
          <path d="M12 6.5c-2-1.5-4.5-2-7-2v13c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2V4.5c-2.5 0-5 .5-7 2z" />
          <path d="M12 6.5V19.5" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 6-6 2 2-6z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 9.5h17" />
          <path d="M8 3v3.5M16 3v3.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          <circle cx="12" cy="13" r="3.4" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
          <path d="M12 18v3" />
          <path d="M9 21h6" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7.5" width="18" height="12" rx="2" />
          <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
          <path d="M3 12.5h18" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M6 3v18" />
          <path d="M6 4.5c2.5-1.5 5 0 7.5-1.5S19 4.5 19 4.5v9c-2.5 1.5-5 0-7.5 1.5S6 13.5 6 13.5z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.2 2" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
          <path d="M9 12l2 2 4-4.5" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.4" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M12 3c3 1.5 5 5 5 9 0 1.8-.4 3.2-1 4.5l-4-1-4 1c-.6-1.3-1-2.7-1-4.5 0-4 2-7.5 5-9z" />
          <circle cx="12" cy="10" r="1.6" />
          <path d="M9 16.5l-2.5 3.5M15 16.5l2.5 3.5" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19c-1-6 2-13 14-14 1 10-4 14-14 14z" />
          <path d="M5 19c3-4 6-7 12-11" />
        </svg>
      );
    case "dollar":
      return (
        <svg {...common}>
          <path d="M12 2.5v19" />
          <path d="M16.5 6.5c-1-1-2.6-1.5-4.3-1.5-2.6 0-4.7 1.4-4.7 3.6s2.1 3 4.5 3.5c2.5.5 4.5 1.3 4.5 3.5s-2.1 3.6-4.7 3.6c-1.9 0-3.6-.6-4.6-1.7" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
          <path d="M7 5.5H4a3 3 0 0 0 3 5" />
          <path d="M17 5.5h3a3 3 0 0 1-3 5" />
          <path d="M12 14v3" />
          <path d="M8.5 21h7l-1-3.5h-5z" />
        </svg>
      );
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4A8.5 8.5 0 0 0 12 3z" />
          <circle cx="7.5" cy="10.5" r="1.1" />
          <circle cx="10" cy="7" r="1.1" />
          <circle cx="14.5" cy="7" r="1.1" />
          <circle cx="17" cy="10.5" r="1.1" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M12 7v5M12 12l-5.5 4M12 12l5.5 4" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M9 4.5a3 3 0 0 0-3 3v.3A3 3 0 0 0 4.5 10.5a3 3 0 0 0 1 5.6A3 3 0 0 0 8.5 19.5 2.5 2.5 0 0 0 11 17V6.5A2 2 0 0 0 9 4.5z" />
          <path d="M15 4.5a3 3 0 0 1 3 3v.3a3 3 0 0 1 1.5 2.7 3 3 0 0 1-1 5.6 3 3 0 0 1-3 3.4A2.5 2.5 0 0 1 13 17V6.5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.5 6.5a4 4 0 0 1-5 5L4 17l3 3 5.5-5.5a4 4 0 0 1 5-5l-2.3 2.3-2-2z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" />
          <path d="M8 9.5h8M8 12.5h5" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <path d="M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5z" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg {...common}>
          <path d="M4 10v4M2.5 9v6M6 8v8M18 8v8M21.5 9v6M20 10v4" />
          <path d="M6 12h12" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />
        </svg>
      );
    default:
      return null;
  }
}

/** Maps a category slug (from data/categories) to its badge icon. */
export function categoryIcon(slug: string): IconName {
  switch (slug) {
    case "extracurriculars":
      return "sparkle";
    case "academics":
      return "book";
    case "testing":
      return "clipboard-check";
    case "lifestyle":
      return "heart";
    case "college":
      return "cap";
    case "summer":
      return "sun";
    default:
      return "sparkle";
  }
}

/**
 * Full literal class strings (not built from a template) so Tailwind's
 * scanner can see and generate each one — a badge background + matching
 * icon color, one distinct accent per icon so the row of category/action
 * badges doesn't read as one uniform blue.
 */
export function iconBadgeClasses(name: IconName): string {
  switch (name) {
    case "sparkle":
    case "pen-nib":
      return "bg-violet/10 text-violet";
    case "book":
    case "search":
      return "bg-pen/10 text-pen";
    case "clipboard-check":
    case "search-check":
      return "bg-mint/10 text-mint";
    case "heart":
    case "users":
      return "bg-rose/10 text-rose";
    case "cap":
      return "bg-marker/10 text-marker";
    case "sun":
    case "megaphone":
      return "bg-amber/10 text-amber";
    default:
      return "bg-pen/10 text-pen";
  }
}
