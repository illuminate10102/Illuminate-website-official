import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";
import { Icon } from "./Icon";
import { getCategory, type Category } from "../data/categories";
import { subjects } from "../data/subjects";
import { tierHueStyle } from "../lib/tierStyle";

const primaryLinks = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Extracurriculars", href: "/extracurriculars" },
  { label: "Testing", href: "/testing" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "College", href: "/college" },
  { label: "Summer", href: "/summer" },
  { label: "Index", href: "/resources" },
];

/** Column count in the mega-menu adapts to how many topic groups a
 *  category has, so a 4-group category (Extracurriculars) gets a wider
 *  panel than a 2-group one (Testing) instead of always forcing 2 columns. */
function gridColsClass(count: number): string {
  if (count <= 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-3";
  return "grid-cols-4";
}

function dropdownWidthClass(count: number): string {
  if (count <= 2) return "w-[440px]";
  if (count === 3) return "w-[660px]";
  return "w-[880px]";
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * The dropdown/mega-menu is theme-adaptive, same as the main bar: white
 * surface with dark text in light mode, dark navy with light text in dark
 * mode. Tier colors use --tier-accent (paper-tuned, adaptive) rather than
 * --tier-accent-chalk (the fixed-for-navy variant used on chalkboard hero
 * bands), since this panel now sits on an adaptive paper-style surface.
 */
function TierFieldList({
  category,
  onNavigate,
  stacked = false,
}: {
  category: Category;
  onNavigate: () => void;
  stacked?: boolean;
}) {
  return (
    <div
      className={
        stacked
          ? "space-y-6"
          : `grid ${gridColsClass(category.tiers.length)} gap-x-10 gap-y-8`
      }
    >
      {category.tiers.map((tier) => (
        <div key={tier.label} style={tierHueStyle(tier.hue)}>
          <p
            className="course-code text-[0.65rem] uppercase mb-4"
            style={{ color: "var(--tier-accent)" }}
          >
            {tier.label}
          </p>
          <ul className="space-y-1.5">
            {tier.fields.map((field) => (
              <li key={field.slug}>
                <Link
                  to={`/${category.slug}/${field.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-ink transition-colors py-1.5 px-2 -mx-2 rounded-md border border-transparent hover:border-[var(--tier-accent-border)] hover:bg-[var(--tier-accent-wash)]"
                >
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
                    style={{
                      background: "var(--tier-accent-wash)",
                      color: "var(--tier-accent)",
                    }}
                  >
                    <Icon name={field.icon} className="w-3.5 h-3.5" />
                  </span>
                  {field.title}
                </Link>
              </li>
            ))}
            {category.slug === "academics" && tier.label === "Study Strategies" && (
              <SubjectsItem variant={stacked ? "mobile" : "desktop"} onNavigate={onNavigate} />
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Sits inside the Academics dropdown's "Study Strategies" list, right after
 * the last real field — not a separate row below the grid. On desktop it's
 * a field-styled row that opens a nested flyout of the 5 subjects on hover;
 * on mobile (no hover) it just unrolls the 5 subjects as extra rows right
 * there in the stacked list.
 */
function SubjectsItem({
  onNavigate,
  variant,
}: {
  onNavigate: () => void;
  variant: "desktop" | "mobile";
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const trigger = (
    <Link
      to="/academics/subjects"
      onClick={onNavigate}
      className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-ink transition-colors py-1.5 px-2 -mx-2 rounded-md border border-transparent hover:border-[var(--tier-accent-border)] hover:bg-[var(--tier-accent-wash)]"
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
        style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
      >
        <Icon name="book" className="w-3.5 h-3.5" />
      </span>
      <span className="flex-1">Subjects</span>
      {variant === "desktop" && <ChevronIcon open={open} />}
    </Link>
  );

  if (variant === "mobile") {
    return (
      <>
        <li>{trigger}</li>
        {subjects.map((s) => (
          <li key={s.slug} style={tierHueStyle(s.hue)}>
            <Link
              to={`/academics/subjects#${s.slug}`}
              onClick={onNavigate}
              className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-ink transition-colors py-1.5 pl-8 pr-2 -mx-2 rounded-md border border-transparent hover:border-[var(--tier-accent-border)] hover:bg-[var(--tier-accent-wash)]"
            >
              <span
                className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
                style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
              >
                <Icon name={s.icon} className="w-3 h-3" />
              </span>
              {s.label}
            </Link>
          </li>
        ))}
      </>
    );
  }

  function show() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setOpen(true);
  }
  function hide() {
    timer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <li className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {trigger}

      {open && (
        <div className="absolute left-0 top-full mt-1 w-60 z-50 bg-dropdown-bg border border-rule rounded-lg shadow-lg p-3 normal-case">
          <ul className="space-y-1">
            {subjects.map((s) => (
              <li key={s.slug} style={tierHueStyle(s.hue)}>
                <Link
                  to={`/academics/subjects#${s.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-ink transition-colors py-1.5 px-2 rounded-md border border-transparent hover:border-[var(--tier-accent-border)] hover:bg-[var(--tier-accent-wash)]"
                >
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
                    style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                  >
                    <Icon name={s.icon} className="w-3.5 h-3.5" />
                  </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openDesktop) return;

    function onPointerDown(e: PointerEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setOpenDesktop(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDesktop(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDesktop]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openOnHover(slug: string) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDesktop(slug);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenDesktop(null), 150);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-paper border-b border-rule transition-shadow ${
        scrolled ? "shadow-[0_4px_16px_-4px_oklch(0_0_0/12%)]" : ""
      }`}
    >
      <div className="flex items-center justify-between h-20 gap-3 lg:gap-4 pl-3 sm:pl-4 pr-4 sm:pr-6 lg:pr-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/illuminate-logo.png" alt="" className="w-12 h-12 rounded-lg" />
            <span className="font-display font-extrabold text-2xl tracking-tight text-ink">
              Illuminate
            </span>
          </Link>

          <nav
            ref={desktopNavRef}
            className="hidden xl:flex items-center gap-2 font-sans text-sm font-semibold text-ink"
          >
            {primaryLinks.map((item, i) => {
              const category = getCategory(item.href.slice(1));
              const isOpen = !!category && openDesktop === category.slug;
              return (
                <span
                  key={item.href}
                  className="nav-pill group flex items-center relative shrink-0 rounded-lg"
                  style={category ? tierHueStyle(category.tiers[0].hue) : undefined}
                  onMouseEnter={() => category && openOnHover(category.slug)}
                  onMouseLeave={() => category && scheduleClose()}
                >
                  <Link
                    to={item.href}
                    className="px-2.5 py-2 font-bold group-hover:text-[var(--tier-accent)] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {category && (
                    <button
                      type="button"
                      onClick={() => setOpenDesktop(isOpen ? null : category.slug)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-label={`${item.label} guide list`}
                      className="p-1 -ml-1.5 mr-1 text-ink-soft group-hover:text-[var(--tier-accent)] transition-colors"
                    >
                      <ChevronIcon open={isOpen} />
                    </button>
                  )}

                  {category && isOpen && (
                    <div
                      className={`absolute top-full ${
                        i >= 3 ? "right-0" : "left-0"
                      } mt-3 z-50 ${dropdownWidthClass(category.tiers.length)} bg-dropdown-bg border border-rule rounded-lg shadow-lg p-8 normal-case`}
                    >
                      <TierFieldList
                        category={category}
                        onNavigate={() => setOpenDesktop(null)}
                      />
                      <div className="mt-6 pt-5 border-t border-rule">
                        <Link
                          to={`/${category.slug}`}
                          onClick={() => setOpenDesktop(null)}
                          className="text-xs font-semibold hover:text-ink transition-colors"
                          style={{ color: "var(--tier-accent)" }}
                        >
                          View all {category.label} guides <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <SearchBox />
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link
              to="/get-involved"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-pen-solid hover:bg-pen-solid-dim text-white font-mono text-xs font-semibold uppercase tracking-wide rounded-md transition-colors hover:-translate-y-1 hover:scale-[1.03]"
            >
              Get involved
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden flex flex-col justify-center gap-1.5 w-9 h-9"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className={`block h-[2px] w-5 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-5 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

      {open && (
        <nav className="xl:hidden border-t border-rule bg-paper">
          <ul className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2">
            {primaryLinks.map((item) => {
              const category = getCategory(item.href.slice(1));
              const isOpen = !!category && openMobile === category.slug;
              return (
                <li key={item.href}>
                  <div
                    className="nav-pill flex items-center justify-between rounded-lg my-2"
                    style={category ? tierHueStyle(category.tiers[0].hue) : undefined}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="flex-1 block py-3 px-3 course-code text-base font-bold uppercase text-ink hover:text-[var(--tier-accent)] transition-colors"
                    >
                      {item.label}
                    </Link>
                    {category && (
                      <button
                        type="button"
                        onClick={() => setOpenMobile(isOpen ? null : category.slug)}
                        aria-expanded={isOpen}
                        aria-label={`${item.label} guide list`}
                        className="p-3 text-ink-soft hover:text-ink transition-colors"
                      >
                        <ChevronIcon open={isOpen} />
                      </button>
                    )}
                  </div>
                  {category && isOpen && (
                    <div className="my-3 p-4 rounded-md bg-dropdown-bg border border-rule normal-case">
                      <TierFieldList
                        category={category}
                        stacked
                        onNavigate={() => {
                          setOpen(false);
                          setOpenMobile(null);
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
            <li className="pt-3 pb-2 flex items-center gap-3">
              <Link
                to="/get-involved"
                onClick={() => setOpen(false)}
                className="inline-flex items-center px-4 py-2 bg-pen-solid text-white font-mono text-xs font-semibold uppercase tracking-wide rounded-md"
              >
                Get involved
              </Link>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
