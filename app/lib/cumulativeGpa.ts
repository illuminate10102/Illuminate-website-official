import type { Scale } from "../data/gpaDistricts";
import { resolveCoursePoints, type CourseInput } from "./gpaCalc";

export type CreditedCourse = CourseInput & { credits: number };

export type WeightedTotal = { gpa: number | null; credits: number };

/** Credit-weighted average of a set of courses on a given scale. A row is
 *  excluded (not counted as zero) if its grade doesn't resolve or its
 *  credits aren't a positive number — an incomplete row shouldn't drag the
 *  average down, same rule as the single-list calculator used. */
export function creditWeightedAverage(scale: Scale, courses: CreditedCourse[]): WeightedTotal {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const course of courses) {
    if (!(course.credits > 0)) continue;
    const points = resolveCoursePoints(scale, course);
    if (points === null) continue;
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  }
  return { gpa: totalCredits > 0 ? totalPoints / totalCredits : null, credits: totalCredits };
}

/** Folds an optional prior GPA/credit total (from before a student started
 *  using this tool) into the credit-weighted average of newly entered
 *  courses, so "cumulative" reflects a student's whole record, not just
 *  what's been typed in here. */
export function cumulativeWithPrior(
  scale: Scale,
  courses: CreditedCourse[],
  priorGpa: number | null,
  priorCredits: number,
): WeightedTotal {
  const entered = creditWeightedAverage(scale, courses);
  let totalPoints = entered.gpa !== null ? entered.gpa * entered.credits : 0;
  let totalCredits = entered.credits;
  if (priorGpa !== null && priorCredits > 0) {
    totalPoints += priorGpa * priorCredits;
    totalCredits += priorCredits;
  }
  return { gpa: totalCredits > 0 ? totalPoints / totalCredits : null, credits: totalCredits };
}

/** Highest point value a table scale awards — across every course-level
 *  column by default (e.g. 5.0, from an AP band), or just one column when
 *  `key` is given (e.g. "unweighted", to get a flat 4.0 ceiling). Used both
 *  to label a scale ("· 5.0 SCALE") and to sanity-check a target planner's
 *  required average against what's actually achievable. Null for formula
 *  scales, which don't have a fixed ceiling. */
export function maxScalePoints(scale: Scale | null | undefined, key?: string): number | null {
  if (!scale || scale.kind !== "table") return null;
  let max: number | null = null;
  for (const band of scale.bands) {
    const values = key !== undefined ? [band.points[key]] : Object.values(band.points);
    for (const points of values) {
      if (typeof points === "number" && (max === null || points > max)) max = points;
    }
  }
  return max;
}

/** The letter of the unweighted band whose points are closest to a raw
 *  decimal average — e.g. turning a required-average of 3.77 into "(A-)". */
function nearestUnweightedLetter(scale: Scale, avgPoints: number): string | null {
  if (scale.kind !== "table") return null;
  let best: { letter: string; diff: number } | null = null;
  for (const band of scale.bands) {
    const points = band.points.unweighted;
    if (typeof points !== "number" || !band.letter) continue;
    const diff = Math.abs(points - avgPoints);
    if (!best || diff < best.diff) best = { letter: band.letter, diff };
  }
  return best?.letter ?? null;
}

export type TargetPlan =
  | { status: "no-credits-ahead" }
  | { status: "already-there" }
  | { status: "not-achievable"; requiredAvg: number; scaleMax: number }
  | { status: "ok"; requiredAvg: number; letter: string | null };

/** Solves for the average points-per-credit needed across `creditsAhead`
 *  future credits to bring a `creditsSoFar`-credit average of `gpaSoFar` up
 *  to `targetGpa`. */
export function solveRequiredAverage({
  targetGpa,
  gpaSoFar,
  creditsSoFar,
  creditsAhead,
  scale,
}: {
  targetGpa: number;
  gpaSoFar: number | null;
  creditsSoFar: number;
  creditsAhead: number;
  scale: Scale;
}): TargetPlan {
  if (!(creditsAhead > 0)) return { status: "no-credits-ahead" };

  const soFarPoints = gpaSoFar !== null ? gpaSoFar * creditsSoFar : 0;
  const requiredAvg = (targetGpa * (creditsSoFar + creditsAhead) - soFarPoints) / creditsAhead;

  if (requiredAvg <= 0) return { status: "already-there" };

  const scaleMax = maxScalePoints(scale, "unweighted");
  if (scaleMax !== null && requiredAvg > scaleMax + 1e-9) {
    return { status: "not-achievable", requiredAvg, scaleMax };
  }

  return { status: "ok", requiredAvg, letter: nearestUnweightedLetter(scale, requiredAvg) };
}

/** Trims float noise (e.g. 0.1 + 0.2 credits) without over-rounding a real
 *  fractional credit total like 5.5. */
export function formatCredits(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}
