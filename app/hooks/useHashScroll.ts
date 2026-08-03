import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls to the element matching the URL hash on navigation. Needed
 * because <ScrollRestoration> resets scroll to (0,0) on its own layout
 * effect before this runs, so a plain browser anchor jump isn't enough —
 * this effect (running after) is what actually moves the page.
 */
export function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);
}
