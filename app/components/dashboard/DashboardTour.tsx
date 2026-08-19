/*
  Guided tour of the dashboard.

  A spotlight ring cut out of a dimmed overlay, plus a tooltip card anchored
  next to whatever element the current step points at. Targets are found by
  `data-tour="<id>"`, so a step whose element isn't on screen for this role
  (or hasn't rendered yet) is skipped rather than pointing at nothing.

  Steps and the seen/replay rules live in `~/lib/tour`.
*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { roleAtLeast, tabsForRole, type Role } from "~/lib/roles";
import { TOUR_STEPS, type TourStep } from "~/lib/tour";

const PAD = 8;
const GAP = 14;
const CARD_W = 340;

type Rect = { top: number; left: number; width: number; height: number };

function measure(target: string | null): Rect | null {
  if (!target) return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  // Below `lg` the sidebar is parked off-canvas — spotlighting it there would
  // ring an empty patch of screen, so treat off-viewport as "not present".
  if (r.right <= 0 || r.left >= window.innerWidth) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/**
 * Keeps the card fully on screen no matter which edge its anchor sits near.
 * `cardH` is measured rather than assumed — the sidebar-group steps list every
 * tab in the group, so a Member's card and a Director's card are nowhere near
 * the same height.
 */
function cardPosition(rect: Rect | null, placement: TourStep["placement"], cardH: number) {
  if (!rect) {
    return {
      top: Math.max(12, window.innerHeight / 2 - cardH / 2),
      left: window.innerWidth / 2 - CARD_W / 2,
    };
  }

  let top: number;
  let left: number;

  switch (placement) {
    case "right":
      top = rect.top;
      left = rect.left + rect.width + GAP;
      break;
    case "left":
      top = rect.top;
      left = rect.left - CARD_W - GAP;
      break;
    case "top":
      top = rect.top - GAP - cardH;
      left = rect.left;
      break;
    default:
      top = rect.top + rect.height + GAP;
      left = rect.left;
  }

  const maxLeft = window.innerWidth - CARD_W - 12;
  return {
    top: Math.max(12, Math.min(top, window.innerHeight - cardH - 12)),
    left: Math.max(12, Math.min(left, Math.max(12, maxLeft))),
  };
}

export function DashboardTour({
  role,
  onClose,
  setDrawerOpen,
}: {
  role: Role;
  onClose: () => void;
  /** Below `lg` the sidebar step needs the drawer opened to point at anything. */
  setDrawerOpen: (open: boolean) => void;
}) {
  const steps = TOUR_STEPS.filter((step) => roleAtLeast(role, step.minRole));
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardH, setCardH] = useState(200);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = steps[index];

  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [index, step]);

  // A step whose element never rendered would spotlight nothing, so those are
  // dropped as soon as they come up rather than filtered ahead of time — the
  // Overview panels mount asynchronously, so "is it there" is only knowable now.
  useEffect(() => {
    if (!step) return;
    if (!step.target) {
      setDrawerOpen(false);
      setRect(null);
      return;
    }

    const needsDrawer = !!step.drawerOnMobile && window.innerWidth < 1024;
    setDrawerOpen(needsDrawer);

    // The drawer slides in over 300ms — measuring before it lands would read
    // its off-canvas position and drop the step as "not present".
    const timer = setTimeout(() => {
      const found = measure(step.target);
      if (!found) {
        if (index < steps.length - 1) setIndex((i) => i + 1);
        else onClose();
        return;
      }
      document
        .querySelector<HTMLElement>(`[data-tour="${step.target}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      setRect(found);
    }, needsDrawer ? 360 : 0);

    return () => clearTimeout(timer);
  }, [step, index, steps.length, onClose, setDrawerOpen]);

  // Keeps the ring glued to its element through the scroll-into-view and any
  // layout shift as panels finish loading.
  useEffect(() => {
    if (!step?.target) return;
    let frame = 0;
    const track = () => {
      const found = measure(step.target);
      if (found) setRect(found);
      frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  const finish = useCallback(() => {
    setDrawerOpen(false);
    onClose();
  }, [onClose, setDrawerOpen]);

  const next = useCallback(() => {
    if (index >= steps.length - 1) finish();
    else setIndex((i) => i + 1);
  }, [index, steps.length, finish]);

  const back = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [finish, next, back]);

  if (!step) return null;

  const card = cardPosition(rect, step.placement, cardH);

  return (
    <div
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
    >
      {/* One element does both jobs: the ring outlines the target, and its
          enormous shadow spread dims everything outside it. */}
      {rect ? (
        <div
          aria-hidden="true"
          className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow:
              "0 0 0 9999px oklch(0.16 0.055 267 / 72%), 0 0 0 2px var(--color-marker)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-chalkboard/70" aria-hidden="true" />
      )}

      <div
        ref={cardRef}
        className="absolute w-[340px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-24px)] overflow-y-auto bg-chalkboard border border-rule-dark rounded-xl shadow-2xl p-5 transition-all duration-300 ease-out"
        style={{ top: card.top, left: card.left }}
      >
        <button
          type="button"
          onClick={finish}
          aria-label="Skip the tour"
          className="absolute top-3 right-3 p-1 text-chalk-soft hover:text-chalk transition-colors rounded"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="course-code text-[0.6rem] uppercase tracking-[0.15em] text-marker mb-2">
          Step {index + 1} of {steps.length}
        </p>
        <h2
          id="tour-step-title"
          className="font-display font-extrabold text-lg text-chalk tracking-tight pr-6"
        >
          {step.title}
        </h2>
        <p className="text-chalk-soft text-sm leading-relaxed mt-2">{step.body}</p>

        {step.tabGroup && (
          <ul className="mt-4 space-y-2.5 border-t border-rule-dark pt-4">
            {tabsForRole(role)
              .filter((tab) => tab.group === step.tabGroup)
              .map((tab) => (
                <li key={tab.to || "index"} className="text-sm leading-snug">
                  <span className="text-chalk font-semibold">{tab.label}</span>
                  <span className="text-chalk-soft"> — {tab.blurb}</span>
                </li>
              ))}
          </ul>
        )}

        <div className="flex items-center gap-1.5 mt-4" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-marker" : "w-1.5 bg-rule-dark"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-5">
          <button
            type="button"
            onClick={finish}
            className="text-xs text-chalk-soft hover:text-chalk transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="px-3.5 py-2 border border-rule-dark hover:border-chalk-soft rounded-lg text-sm font-semibold text-chalk-soft hover:text-chalk transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="px-3.5 py-2 bg-marker hover:bg-marker-dim text-ink-solid rounded-lg text-sm font-semibold transition-colors"
            >
              {index === steps.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
