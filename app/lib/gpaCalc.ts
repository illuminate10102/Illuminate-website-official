import type { District, Scale, TableScale } from "../data/gpaDistricts";

export type CourseInput = {
  levelId: string;
  /** Letter grade (gradeInput "letter") or a numeric string (gradeInput "numeric"). Empty = not yet filled in. */
  grade: string;
};

/** Resolves a table scale's band for a raw grade entry, auto-detecting
 *  whether the student typed a number (looked up by the band's min/max
 *  range — every band carries one regardless of a district's gradeInput)
 *  or a letter (matched against the band's letter, case-insensitively).
 *  This is what lets a "letter" district still accept "97" and resolve it
 *  to the same band as picking "A" would. */
function findTableBand(
  bands: TableScale["bands"],
  grade: string,
): TableScale["bands"][number] | undefined {
  const trimmed = grade.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (Number.isFinite(n)) {
    return bands.find((b) => n >= b.min && n <= b.max);
  }
  return bands.find((b) => b.letter?.toLowerCase() === trimmed.toLowerCase());
}

/** A single course's points on a given scale — the same per-row value the
 *  average is built from, exposed for transcript exports that need to show
 *  each course's contribution, not just the final average. Returns null for
 *  an empty, unrecognized, or level-mismatched row (excluded from the average
 *  for the same reason). */
export function resolveCoursePoints(scale: Scale, course: CourseInput): number | null {
  if (!course.grade.trim()) return null;
  if (scale.kind === "table") {
    const band = findTableBand(scale.bands, course.grade);
    if (!band) return null;
    const points = band.points[course.levelId];
    return typeof points === "number" ? points : null;
  }
  const n = Number(course.grade);
  if (!Number.isFinite(n)) return null;
  const factor = scale.factors[course.levelId];
  if (typeof factor !== "number") return null;
  return scale.op === "multiply" ? n * factor : n + factor;
}

/** Averages a scale's per-course points/values. Rows with no grade, an unrecognized
 *  grade, or a course level the scale doesn't define are silently excluded rather
 *  than treated as zero — an incomplete row shouldn't drag the average down. */
function averageScale(scale: Scale, courses: CourseInput[]): number | null {
  const values: number[] = [];
  for (const course of courses) {
    const points = resolveCoursePoints(scale, course);
    if (points !== null) values.push(points);
  }
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function computeWeightedGpa(
  district: Pick<District, "weighted">,
  courses: CourseInput[],
): number | null {
  return averageScale(district.weighted, courses);
}

/** Unweighted scales ignore course level entirely, so every course is remapped
 *  onto the scale's single "unweighted" points column before averaging. */
export function computeUnweightedGpa(
  district: Pick<District, "unweighted">,
  courses: CourseInput[],
): number | null {
  if (!district.unweighted) return null;
  const remapped = courses.map((c) => ({ ...c, levelId: "unweighted" }));
  return averageScale(district.unweighted, remapped);
}

/** Whether a course row's grade actually resolves against the given scale —
 *  used to flag rows that are silently being excluded from the average. */
export function gradeResolves(scale: Scale, course: CourseInput): boolean {
  if (!course.grade.trim()) return true; // an empty row isn't "wrong," just not started yet
  if (scale.kind === "table") {
    const band = findTableBand(scale.bands, course.grade);
    return !!band && typeof band.points[course.levelId] === "number";
  }
  const n = Number(course.grade);
  return Number.isFinite(n) && typeof scale.factors[course.levelId] === "number";
}

/** For a table scale, the letter of the band a raw grade entry resolves to —
 *  used to show a quick "97 → A" confirmation when a number is typed against
 *  a letter-style district, so it's visible that it landed in the right band. */
export function resolveBandLetter(scale: Scale, grade: string): string | undefined {
  if (scale.kind !== "table" || !grade.trim()) return undefined;
  return findTableBand(scale.bands, grade)?.letter;
}

/** Distinct letters available on a "letter" gradeInput district's table, in band order. */
export function letterOptionsFor(scale: Scale): string[] {
  if (scale.kind !== "table") return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const band of scale.bands) {
    if (band.letter && !seen.has(band.letter)) {
      seen.add(band.letter);
      out.push(band.letter);
    }
  }
  return out;
}

export function formatGpa(value: number | null, digits = 2): string {
  if (value === null) return "—";
  return value.toFixed(digits);
}

export type PassStatus = "pass" | "fail" | "ungraded";

/** Whether a course's grade clears its district's own passing cutoff. Read
 *  from the unweighted scale's zero-point band where a district publishes
 *  one (every real district and the default preset here do) — course level
 *  doesn't change whether a grade passes, only how many GPA points it's
 *  worth, so the unweighted band is the right place to look regardless of
 *  which level the course was taken at. Falls back to the weighted scale's
 *  own zero-point band for the couple of generic presets with no separate
 *  unweighted table. */
export function resolvePassStatus(
  district: Pick<District, "weighted" | "unweighted">,
  course: CourseInput,
): PassStatus {
  if (!course.grade.trim()) return "ungraded";
  const points = district.unweighted
    ? resolveCoursePoints(district.unweighted, { ...course, levelId: "unweighted" })
    : resolveCoursePoints(district.weighted, course);
  if (points === null) return "ungraded";
  return points > 0 ? "pass" : "fail";
}

/** A passed semester of a course earns 0.5 credit and a failed one earns 0 —
 *  the standard half-credit-per-semester convention (a year-long course is
 *  1 credit total, split 0.5/0.5 across its two semester grades). */
export function creditsForCourse(
  district: Pick<District, "weighted" | "unweighted">,
  course: CourseInput,
): number {
  return resolvePassStatus(district, course) === "pass" ? 0.5 : 0;
}
