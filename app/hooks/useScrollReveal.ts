import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Fades in each top-level <section> below the first as it scrolls into
 * view. The "scroll-reveal" class is only ever added here, by JS — so if
 * this effect never runs (JS disabled, an error, etc.) content simply stays
 * at its normal opacity instead of getting stuck invisible.
 *
 * The first section on a page is skipped: it's already visible on load and
 * has its own load-in animation via the .reveal utility classes, so
 * re-hiding it would cause a flash before the observer catches up.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const targets = sections.slice(1);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of targets) {
      el.classList.add("scroll-reveal");
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      for (const el of targets) {
        el.classList.remove("scroll-reveal", "is-visible");
      }
    };
  }, [pathname]);
}
