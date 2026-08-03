/**
 * GPA scale data for the GPA calculator (academics/gpa-calculator).
 *
 * Two fundamentally different mechanisms show up across Texas districts:
 *  - "table": a course grade (numeric or letter) is looked up in a set of
 *    bands to get GPA points per course level, then points are averaged.
 *    This covers both the "simple bump" style (one band per letter grade)
 *    and the "numeric lookup table" style (fine-grained bands, sometimes
 *    one per integer) — they're the same math, just different grain, so
 *    they share one scale shape here rather than two.
 *  - "formula": the raw 0-100 grade itself is multiplied or added to by a
 *    per-level factor, then averaged. A few districts (Northside ISD,
 *    North East ISD, Lewisville ISD, Judson ISD's current system) work
 *    this way and never produce a 4.0-ish number at all — the result stays
 *    on something close to the raw 100-point scale.
 *
 * Course-type options are intentionally NOT a fixed Regular/Honors/AP enum:
 * districts define anywhere from 2 to 7 rigor tiers with their own labels
 * (e.g. Katy ISD separates "Dual Credit" from "KAP/AP"; Humble ISD only has
 * "Advanced" and "On-Level"). The calculator should render each district's
 * own `levels` list as the course-type choices once a district is picked,
 * matching how the district itself actually weights courses. The 3-level
 * Regular/Honors-PreAP/AP template only applies to the generic conventions
 * and the "Custom Scale" starting point, where there's no real district to
 * be faithful to.
 *
 * Every number below is transcribed from an official district board
 * policy, regulation, or handbook — see each entry's `source`. Where a
 * district currently runs two different scales depending on graduating
 * class (Alief ISD, Judson ISD, Plano ISD), only the newest/current scale
 * is represented; see `notes` for what's not modeled yet. Districts whose
 * exact numbers could not be verified (Pasadena ISD, San Antonio ISD,
 * Frisco ISD) are intentionally left out rather than guessed.
 */

export type CourseLevel = {
  /** Stable key used inside a scale's `points` / `factors` maps. */
  id: string;
  /** Label shown in the course-type dropdown, in the district's own words. */
  label: string;
  /** Preselected option for a new course row. */
  isDefault?: boolean;
};

export type GradeBand = {
  /** Inclusive numeric floor for this band. */
  min: number;
  /** Inclusive numeric ceiling for this band. */
  max: number;
  /** Display letter grade, where the district frames it that way. */
  letter?: string;
  /** GPA points per course-level id. */
  points: Record<string, number>;
};

export type TableScale = {
  kind: "table";
  /** Bands ordered highest grade first. */
  bands: GradeBand[];
};

export type FormulaScale = {
  kind: "formula";
  op: "multiply" | "add";
  /** Multiplier or addend per course-level id, applied to the raw 0-100 grade. */
  factors: Record<string, number>;
  /** Explains what the resulting number actually represents (rarely a 4.0-style figure). */
  resultNote: string;
};

export type Scale = TableScale | FormulaScale;

export type SourceInfo = {
  label: string;
  url: string;
  docType: string;
  schoolYear?: string;
  /** verified = independently re-fetched and hand-checked; sourced = quoted from a primary
   *  source once; dated = real source, but older than the rest; cohort-limited = source is
   *  solid but only one of several active graduating-class scales is represented here. */
  confidence: "verified" | "sourced" | "dated" | "cohort-limited";
  lastChecked: string;
};

export type District = {
  id: string;
  name: string;
  category: "district" | "generic";
  state?: "TX";
  metro?: string;
  /** Which grade input the UI should collect for this district's scale. */
  gradeInput: "letter" | "numeric";
  levels: CourseLevel[];
  weighted: Scale;
  /** Present only when the district separately defines/publishes an unweighted figure. */
  unweighted?: Scale;
  /** Override the default "Weighted GPA" label, e.g. Round Rock calls it "RIC". */
  weightedLabel?: string;
  /** Override the default "Unweighted GPA" label, e.g. Round Rock calls it "GPA". */
  unweightedLabel?: string;
  source: SourceInfo;
  notes?: string;
};

const CHECKED = "2026-08-01";

export const gpaDistricts: District[] = [
  // ---------------------------------------------------------------- Houston
  {
    id: "houston-isd",
    name: "Houston ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "quality", label: "Quality (Pre-AP/AP/Honors)" },
      { id: "regular", label: "Regular", isDefault: true },
      { id: "modified", label: "Modified" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { quality: 5, regular: 4, modified: 3 } },
        { min: 80, max: 89, letter: "B", points: { quality: 4, regular: 3, modified: 2 } },
        { min: 75, max: 79, letter: "C", points: { quality: 3, regular: 2, modified: 1 } },
        { min: 70, max: 74, letter: "D", points: { quality: 2, regular: 1, modified: 1 } },
        { min: 0, max: 69, letter: "F", points: { quality: 0, regular: 0, modified: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 75, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 70, max: 74, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "High School for Law & Justice Student and Parent Handbook",
      url: "https://resources.finalsite.net/images/v1754873984/houstonisdorg/bkgizm8ypb30jxn4kx3g/2025-2026StudentandParentHandbook.pdf",
      docType: "Campus handbook citing HISD policy",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "District-wide handbook / EIC(LOCAL) pages were unreachable; sourced from a campus handbook that explicitly cites district policy, corroborated on a second campus site. Houston doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention to Houston's own letter-grade cutoffs (A 90-100, B 80-89, C 75-79, D 70-74, F below 70).",
  },
  {
    id: "cypress-fairbanks-isd",
    name: "Cypress-Fairbanks ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "k-ap-horizons", label: "K / AP / HORIZONS" },
      { id: "l-level", label: "L-Level (on-level)", isDefault: true },
      { id: "below-level", label: "Below Level" },
      { id: "life-skills", label: "Life Skills" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { "k-ap-horizons": 7, "l-level": 6, "below-level": 5, "life-skills": 4 } },
        { min: 80, max: 89, letter: "B", points: { "k-ap-horizons": 6, "l-level": 5, "below-level": 4, "life-skills": 3 } },
        { min: 75, max: 79, letter: "C", points: { "k-ap-horizons": 5, "l-level": 4, "below-level": 3, "life-skills": 2 } },
        { min: 70, max: 74, letter: "D", points: { "k-ap-horizons": 4, "l-level": 3, "below-level": 2, "life-skills": 1 } },
        { min: 0, max: 69, letter: "F", points: { "k-ap-horizons": 0, "l-level": 0, "below-level": 0, "life-skills": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 75, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 70, max: 74, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Cypress Falls High School — General Information",
      url: "https://cyfalls.cfisd.net/our-school/about-us/general-information",
      docType: "Campus page, cross-checked against a CFISD board presentation",
      confidence: "verified",
      lastChecked: CHECKED,
    },
    notes: "Independently re-fetched and confirmed exact match. CFISD describes one weighted 6.0 scale and doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention to CFISD's own letter-grade cutoffs (A 90-100, B 80-89, C 75-79, D 70-74, F below 70).",
  },
  {
    id: "katy-isd",
    name: "Katy ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "kap-ap", label: "KAP / AP" },
      { id: "dual-credit", label: "Dual Credit" },
      { id: "academic-core", label: "Academic Core & Elective", isDefault: true },
      { id: "fundamental", label: "Fundamental / Applied" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { "kap-ap": 5, "dual-credit": 4.5, "academic-core": 4, fundamental: 3 } },
        { min: 80, max: 89, letter: "B", points: { "kap-ap": 4, "dual-credit": 3.5, "academic-core": 3, fundamental: 2 } },
        { min: 70, max: 79, letter: "C", points: { "kap-ap": 3, "dual-credit": 2.5, "academic-core": 2, fundamental: 1 } },
        { min: 0, max: 69, letter: "F", points: { "kap-ap": 0, "dual-credit": 0, "academic-core": 0, fundamental: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Katy ISD Student Handbook",
      url: "https://www.katyisd.org/fs/resource-manager/view/1f7c980a-d9e5-462e-8df9-bd180493bf55",
      docType: "Student Handbook, \"High School Class Rank and Weighted Grades\"",
      schoolYear: "2026-2027",
      confidence: "verified",
      lastChecked: CHECKED,
    },
    notes: "Independently re-fetched and confirmed exact match. Katy ISD has no D grade; C spans 70-79. Katy doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention to Katy's own letter-grade cutoffs.",
  },
  {
    id: "fort-bend-isd",
    name: "Fort Bend ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "ap-dc-ib-de", label: "AP / Beyond AP / Dual Credit / IB / Dual Enrollment" },
      { id: "aac-preap-honors", label: "AAC / Pre-AP / Pre-IB / Honors" },
      { id: "on-level", label: "On-level", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { "ap-dc-ib-de": 5, "aac-preap-honors": 4.5, "on-level": 4 } },
        { min: 80, max: 89, letter: "B", points: { "ap-dc-ib-de": 4, "aac-preap-honors": 3.5, "on-level": 3 } },
        { min: 70, max: 79, letter: "C", points: { "ap-dc-ib-de": 3, "aac-preap-honors": 2.5, "on-level": 2 } },
        { min: 0, max: 69, letter: "F", points: { "ap-dc-ib-de": 0, "aac-preap-honors": 0, "on-level": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Class Ranking Handbook (implements Board Policy EIC (Local))",
      url: "https://resources.finalsite.net/images/v1782225060/fortbendisdcom/bnwqd9qzbbtxpn3ixmxq/UpdatedClassRankingHandbook81225.pdf",
      docType: "District handbook",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Applies to students entering 9th grade 2019-20 and later.",
  },
  {
    id: "klein-isd",
    name: "Klein ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "numeric",
    levels: [
      { id: "dc-gt-kp-ap-ib", label: "Dual Credit / GT / Klein Prep / AP / Pre-IB / IB" },
      { id: "weighted-tier", label: "Weighted" },
      { id: "regular", label: "Regular", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { "dc-gt-kp-ap-ib": 6.0, "weighted-tier": 5.5, regular: 5.0 } },
        { min: 99, max: 99, points: { "dc-gt-kp-ap-ib": 5.9, "weighted-tier": 5.4, regular: 4.9 } },
        { min: 98, max: 98, points: { "dc-gt-kp-ap-ib": 5.8, "weighted-tier": 5.3, regular: 4.8 } },
        { min: 97, max: 97, points: { "dc-gt-kp-ap-ib": 5.7, "weighted-tier": 5.2, regular: 4.7 } },
        { min: 96, max: 96, points: { "dc-gt-kp-ap-ib": 5.6, "weighted-tier": 5.1, regular: 4.6 } },
        { min: 95, max: 95, points: { "dc-gt-kp-ap-ib": 5.5, "weighted-tier": 5.0, regular: 4.5 } },
        { min: 94, max: 94, points: { "dc-gt-kp-ap-ib": 5.4, "weighted-tier": 4.9, regular: 4.4 } },
        { min: 93, max: 93, points: { "dc-gt-kp-ap-ib": 5.3, "weighted-tier": 4.8, regular: 4.3 } },
        { min: 92, max: 92, points: { "dc-gt-kp-ap-ib": 5.2, "weighted-tier": 4.7, regular: 4.2 } },
        { min: 91, max: 91, points: { "dc-gt-kp-ap-ib": 5.1, "weighted-tier": 4.6, regular: 4.1 } },
        { min: 90, max: 90, points: { "dc-gt-kp-ap-ib": 5.0, "weighted-tier": 4.5, regular: 4.0 } },
        { min: 89, max: 89, points: { "dc-gt-kp-ap-ib": 4.9, "weighted-tier": 4.4, regular: 3.9 } },
        { min: 88, max: 88, points: { "dc-gt-kp-ap-ib": 4.8, "weighted-tier": 4.3, regular: 3.8 } },
        { min: 87, max: 87, points: { "dc-gt-kp-ap-ib": 4.7, "weighted-tier": 4.2, regular: 3.7 } },
        { min: 86, max: 86, points: { "dc-gt-kp-ap-ib": 4.6, "weighted-tier": 4.1, regular: 3.6 } },
        { min: 85, max: 85, points: { "dc-gt-kp-ap-ib": 4.5, "weighted-tier": 4.0, regular: 3.5 } },
        { min: 84, max: 84, points: { "dc-gt-kp-ap-ib": 4.4, "weighted-tier": 3.9, regular: 3.4 } },
        { min: 83, max: 83, points: { "dc-gt-kp-ap-ib": 4.3, "weighted-tier": 3.8, regular: 3.3 } },
        { min: 82, max: 82, points: { "dc-gt-kp-ap-ib": 4.2, "weighted-tier": 3.7, regular: 3.2 } },
        { min: 81, max: 81, points: { "dc-gt-kp-ap-ib": 4.1, "weighted-tier": 3.6, regular: 3.1 } },
        { min: 80, max: 80, points: { "dc-gt-kp-ap-ib": 4.0, "weighted-tier": 3.5, regular: 3.0 } },
        { min: 79, max: 79, points: { "dc-gt-kp-ap-ib": 3.8, "weighted-tier": 3.3, regular: 2.8 } },
        { min: 78, max: 78, points: { "dc-gt-kp-ap-ib": 3.6, "weighted-tier": 3.1, regular: 2.6 } },
        { min: 77, max: 77, points: { "dc-gt-kp-ap-ib": 3.4, "weighted-tier": 2.9, regular: 2.4 } },
        { min: 76, max: 76, points: { "dc-gt-kp-ap-ib": 3.2, "weighted-tier": 2.7, regular: 2.2 } },
        { min: 75, max: 75, points: { "dc-gt-kp-ap-ib": 3.0, "weighted-tier": 2.5, regular: 2.0 } },
        { min: 74, max: 74, points: { "dc-gt-kp-ap-ib": 2.8, "weighted-tier": 2.3, regular: 1.8 } },
        { min: 73, max: 73, points: { "dc-gt-kp-ap-ib": 2.6, "weighted-tier": 2.1, regular: 1.6 } },
        { min: 72, max: 72, points: { "dc-gt-kp-ap-ib": 2.4, "weighted-tier": 1.9, regular: 1.4 } },
        { min: 71, max: 71, points: { "dc-gt-kp-ap-ib": 2.2, "weighted-tier": 1.7, regular: 1.2 } },
        { min: 70, max: 70, points: { "dc-gt-kp-ap-ib": 2.0, "weighted-tier": 1.5, regular: 1.0 } },
        { min: 0, max: 69, letter: "F", points: { "dc-gt-kp-ap-ib": 0, "weighted-tier": 0, regular: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Klein ISD Student Handbook",
      url: "https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/5525/Kisd/de8b6c46-e8ca-4251-bf7e-11de77891080/25-26-Klein-ISD-Student-Handbook.pdf",
      docType: "District handbook, citing Board Policy EIC",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "GPA calculated to 4 decimal places, no rounding, per the handbook. Klein doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention (Klein's own bands never distinguish a grade below 70, so there's no D tier).",
  },
  {
    id: "alief-isd",
    name: "Alief ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "aac-ap", label: "AAC / AP" },
      { id: "academic-elective", label: "Academic & Elective", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { "aac-ap": 5, "academic-elective": 4 } },
        { min: 80, max: 89, letter: "B", points: { "aac-ap": 4, "academic-elective": 3 } },
        { min: 70, max: 79, letter: "C", points: { "aac-ap": 3, "academic-elective": 2 } },
        { min: 0, max: 69, letter: "F", points: { "aac-ap": 0, "academic-elective": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Addendum to the Alief Handbook & Code of Conduct",
      url: "https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/4448/Aisd/a048073d-80e8-49d3-9e34-af418be8c3b5/Addendum_of_2024-2025_Alief_Handbook_and_Code_.pdf",
      docType: "District handbook addendum, cross-checked against the 2025-2026 handbook",
      schoolYear: "2024-2025",
      confidence: "cohort-limited",
      lastChecked: CHECKED,
    },
    notes: "Only the current scale (Class of 2028 and later, no D grade) is represented. Classes of 2025-2027 use an older scale with a D grade that includes AAC/AP values (A=5,B=4,C=3,D=2,F=0) but whose on-level table wasn't fully verified — not modeled here. Alief doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention to Alief's own (current, no-D) letter-grade cutoffs.",
  },
  {
    id: "spring-branch-isd",
    name: "Spring Branch ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "advanced", label: "Advanced (Honors/AP/Pre-AP/IB/Dual Credit)" },
      { id: "grade-level", label: "Grade Level", isDefault: true },
      { id: "basic", label: "Basic / Functional" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { advanced: 7, "grade-level": 6, basic: 4 } },
        { min: 80, max: 89, letter: "B", points: { advanced: 6, "grade-level": 5, basic: 3 } },
        { min: 75, max: 79, letter: "C", points: { advanced: 5, "grade-level": 4, basic: 2 } },
        { min: 70, max: 74, letter: "C-", points: { advanced: 4, "grade-level": 3, basic: 1 } },
        { min: 0, max: 69, letter: "F", points: { advanced: 0, "grade-level": 0, basic: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 75, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 70, max: 74, letter: "C-", points: { unweighted: 1 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "High School Course Catalog",
      url: "https://resources.finalsite.net/images/v1753123866/springbranchisdcom/xajzvqovbro5jdfhpkgz/cc_hs_2025_26.pdf",
      docType: "District course catalog, cross-checked against the 2020-2021 edition",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Weighted points may be awarded for only one course per core area per year. Spring Branch doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention to Spring Branch's own letter-grade cutoffs (A 90-100, B 80-89, C 75-79, C- 70-74, F below 70).",
  },
  {
    id: "aldine-isd",
    name: "Aldine ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "numeric",
    levels: [
      { id: "ap-ib-gt", label: "AP / IB / GT" },
      { id: "honor", label: "Honor" },
      { id: "standard", label: "Standard", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { "ap-ib-gt": 8.6, honor: 7.6, standard: 6.6 } },
        { min: 94, max: 96, points: { "ap-ib-gt": 8.3, honor: 7.3, standard: 6.3 } },
        { min: 90, max: 93, points: { "ap-ib-gt": 8.0, honor: 7.0, standard: 6.0 } },
        { min: 87, max: 89, points: { "ap-ib-gt": 7.6, honor: 6.6, standard: 5.6 } },
        { min: 84, max: 86, points: { "ap-ib-gt": 7.3, honor: 6.3, standard: 5.3 } },
        { min: 80, max: 83, points: { "ap-ib-gt": 7.0, honor: 6.0, standard: 5.0 } },
        { min: 77, max: 79, points: { "ap-ib-gt": 6.3, honor: 5.3, standard: 4.3 } },
        { min: 75, max: 76, points: { "ap-ib-gt": 6.0, honor: 5.0, standard: 4.0 } },
        { min: 73, max: 74, points: { "ap-ib-gt": 5.3, honor: 4.3, standard: 3.3 } },
        { min: 70, max: 72, points: { "ap-ib-gt": 5.0, honor: 4.0, standard: 3.0 } },
        { min: 0, max: 69, letter: "F", points: { "ap-ib-gt": 0, honor: 0, standard: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Aldine ISD Student/Parent Handbook",
      url: "https://drewacad.aldineisd.org/wp-content/uploads/sites/38/2024/10/Student-Parent-Handbook-2024-2025-English.pdf",
      docType: "District handbook, \"Class Rank\" section citing Board Policy EIC",
      schoolYear: "2024-2025",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Aldine doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention (Aldine's own bands never distinguish a grade below 70, so there's no D tier).",
  },
  {
    id: "conroe-isd",
    name: "Conroe ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "letter",
    levels: [
      { id: "ap-dc", label: "AP / Dual Credit" },
      { id: "honors-dc", label: "Honors / Dual Credit" },
      { id: "level-other", label: "Level & All Other Courses", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { "ap-dc": 6.0, "honors-dc": 5.0, "level-other": 4.0 } },
        { min: 80, max: 89, letter: "B", points: { "ap-dc": 5.0, "honors-dc": 4.0, "level-other": 3.0 } },
        { min: 75, max: 79, letter: "C", points: { "ap-dc": 4.0, "honors-dc": 3.0, "level-other": 2.0 } },
        { min: 70, max: 74, letter: "D", points: { "ap-dc": 3.0, "honors-dc": 2.0, "level-other": 1.0 } },
        { min: 0, max: 69, letter: "F", points: { "ap-dc": 0, "honors-dc": 0, "level-other": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 75, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 70, max: 74, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Academic Guide & Course Catalog, High School",
      url: "https://core-docs.s3.us-east-1.amazonaws.com/documents/asset/uploaded_file/5052/CISD/4920501/HS_Academic_Catalog_25-26.pdf",
      docType: "District academic guide, revised 02/06/2025",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "A later 10/22/2025 revision of the same catalog exists but wasn't spot-checked against this table. Conroe doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention to Conroe's own letter-grade cutoffs (A 90-100, B 80-89, C 75-79, D 70-74, F below 70).",
  },
  {
    id: "humble-isd",
    name: "Humble ISD",
    category: "district",
    state: "TX",
    metro: "Houston",
    gradeInput: "numeric",
    levels: [
      { id: "advanced", label: "Advanced" },
      { id: "on-level", label: "On-Level", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { advanced: 6.0, "on-level": 5.0 } },
        { min: 99, max: 99, points: { advanced: 5.9, "on-level": 4.9 } },
        { min: 98, max: 98, points: { advanced: 5.8, "on-level": 4.8 } },
        { min: 97, max: 97, points: { advanced: 5.7, "on-level": 4.7 } },
        { min: 96, max: 96, points: { advanced: 5.6, "on-level": 4.6 } },
        { min: 95, max: 95, points: { advanced: 5.5, "on-level": 4.5 } },
        { min: 94, max: 94, points: { advanced: 5.4, "on-level": 4.4 } },
        { min: 93, max: 93, points: { advanced: 5.3, "on-level": 4.3 } },
        { min: 92, max: 92, points: { advanced: 5.2, "on-level": 4.2 } },
        { min: 91, max: 91, points: { advanced: 5.1, "on-level": 4.1 } },
        { min: 90, max: 90, points: { advanced: 5.0, "on-level": 4.0 } },
        { min: 89, max: 89, points: { advanced: 4.9, "on-level": 3.9 } },
        { min: 88, max: 88, points: { advanced: 4.8, "on-level": 3.8 } },
        { min: 87, max: 87, points: { advanced: 4.7, "on-level": 3.7 } },
        { min: 86, max: 86, points: { advanced: 4.6, "on-level": 3.6 } },
        { min: 85, max: 85, points: { advanced: 4.5, "on-level": 3.5 } },
        { min: 84, max: 84, points: { advanced: 4.4, "on-level": 3.4 } },
        { min: 83, max: 83, points: { advanced: 4.3, "on-level": 3.3 } },
        { min: 82, max: 82, points: { advanced: 4.2, "on-level": 3.2 } },
        { min: 81, max: 81, points: { advanced: 4.1, "on-level": 3.1 } },
        { min: 80, max: 80, points: { advanced: 4.0, "on-level": 3.0 } },
        { min: 79, max: 79, points: { advanced: 3.9, "on-level": 2.9 } },
        { min: 78, max: 78, points: { advanced: 3.8, "on-level": 2.8 } },
        { min: 77, max: 77, points: { advanced: 3.7, "on-level": 2.7 } },
        { min: 76, max: 76, points: { advanced: 3.6, "on-level": 2.6 } },
        { min: 75, max: 75, points: { advanced: 3.5, "on-level": 2.5 } },
        { min: 74, max: 74, points: { advanced: 3.4, "on-level": 2.4 } },
        { min: 73, max: 73, points: { advanced: 3.3, "on-level": 2.3 } },
        { min: 72, max: 72, points: { advanced: 3.2, "on-level": 2.2 } },
        { min: 71, max: 71, points: { advanced: 3.1, "on-level": 2.1 } },
        { min: 70, max: 70, points: { advanced: 3.0, "on-level": 2.0 } },
        { min: 0, max: 69, letter: "F", points: { advanced: 0, "on-level": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "High School Course Selection & Registration Guide",
      url: "https://core-docs.s3.us-east-1.amazonaws.com/documents/asset/uploaded_file/3592/HumbleISD/3911182/High_School_Planning_Guide_-_2024-2025__13_.pdf",
      docType: "District course guide (published separately from the main handbook)",
      schoolYear: "2024-2025",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Humble doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention (Humble's own bands never distinguish a grade below 70, so there's no D tier).",
  },

  // ------------------------------------------------------------ San Antonio
  {
    id: "northside-isd",
    name: "Northside ISD",
    category: "district",
    state: "TX",
    metro: "San Antonio",
    gradeInput: "numeric",
    levels: [
      { id: "ap-apdual", label: "Advanced Placement, AP Dual" },
      { id: "preap-honorsdual-dc", label: "Pre-AP, Honors Dual, Dual Credit" },
      { id: "regular", label: "Regular / content-modified", isDefault: true },
    ],
    weighted: {
      kind: "formula",
      op: "add",
      factors: { "ap-apdual": 8, "preap-honorsdual-dc": 5, regular: 0 },
      resultNote: "Northside ISD calls this the Weighted Grade Average (WGA) — points are added directly to the raw semester grade, so the result stays on a roughly 0-108 scale rather than a 4.0/5.0 GPA.",
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Junior & Senior College Transition Booklet",
      url: "https://www.nisd.net/sites/default/files/documents/college_career_and_military_junior_senior_transition_booklet_0.pdf",
      docType: "District booklet, \"GPA and Class Rank\" section",
      schoolYear: "2018",
      confidence: "dated",
      lastChecked: CHECKED,
    },
    notes: "No newer official NISD document with this table could be found; several independent searches all point to the same figures with nothing contradicting them, but this is worth confirming directly with the district. NISD's own \"GPA\" (distinct from WGA) is the plain average of raw semester grades, which is a different concept from a standard unweighted GPA — the unweighted scale above instead applies the standard 4.0/3.0/2.0/1.0/0 convention directly to the raw numeric grade.",
  },
  {
    id: "north-east-isd",
    name: "North East ISD",
    category: "district",
    state: "TX",
    metro: "San Antonio",
    gradeInput: "numeric",
    levels: [
      { id: "ap-onramps-ap", label: "AP, and OnRamps/Dual Credit AP" },
      { id: "honors-gt-onramps", label: "Honors, GT non-AP, OnRamps/Dual Credit non-AP" },
      { id: "regular", label: "Regular", isDefault: true },
    ],
    weighted: {
      kind: "formula",
      op: "multiply",
      factors: { "ap-onramps-ap": 1.15, "honors-gt-onramps": 1.08, regular: 1.0 },
      resultNote: "NEISD calls this the Weighted Grade Average (WGA) — the raw semester grade is multiplied by a rank factor, so the result stays close to the raw 0-100+ scale rather than a 4.0/5.0 GPA.",
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Board Policy EIC(LOCAL)",
      url: "https://d16k74nzx9emoe.cloudfront.net/2e782846-efec-457c-8610-15d49ad489a6/Class-Rank-Policy.pdf",
      docType: "Board policy, cross-checked against the 2025-2026 Academic Planning Guide",
      schoolYear: "2025-2026",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Applies to students entering 9th grade 2021-22 and later, which covers every currently-enrolled NEISD high schooler. NEISD doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention directly to the raw numeric grade.",
  },
  {
    id: "judson-isd",
    name: "Judson ISD",
    category: "district",
    state: "TX",
    metro: "San Antonio",
    gradeInput: "numeric",
    levels: [
      { id: "ap", label: "Category 1 — Advanced Placement" },
      { id: "dc-onramps", label: "Category 2 — Dual Credit / UT OnRamps" },
      { id: "honors", label: "Category 3 — Honors" },
      { id: "regular", label: "Category 4 — Regular", isDefault: true },
    ],
    weighted: {
      kind: "formula",
      op: "add",
      factors: { ap: 20, "dc-onramps": 15, honors: 10, regular: 0 },
      resultNote: "Points are added directly to the raw semester grade, so the result stays close to the raw 0-100+ scale rather than a 4.0/5.0 GPA.",
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Board Policy EIC(Local), Academic Achievement / Class Ranking",
      url: "https://meetings.boardbook.org/Documents/DownloadPDF/af5db5a7-686a-415b-a914-af93a9baf276?org=1434",
      docType: "Board policy",
      schoolYear: "2024",
      confidence: "cohort-limited",
      lastChecked: CHECKED,
    },
    notes: "Represents the NEW system for students entering 9th grade Fall 2025 and later. Students who entered 9th grade before Fall 2025 use a legacy multiplier system (AP/IB ×1.2, Pre-AP/Honors/DC ×1.1, Regular ×1.0) that isn't modeled here. Judson doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention directly to the raw numeric grade.",
  },

  // --------------------------------------------------------------------- DFW
  {
    id: "dallas-isd",
    name: "Dallas ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "cat1", label: "Category I (AP/IB/advanced PLTW/dual credit)" },
      { id: "cat2", label: "Category II (Advanced/MYP/lower-level PLTW/Int'l Scholars)" },
      { id: "cat3", label: "Category III (all other)", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { cat1: 5.0, cat2: 4.5, cat3: 4.0 } },
        { min: 93, max: 96, points: { cat1: 4.8, cat2: 4.3, cat3: 3.8 } },
        { min: 90, max: 92, points: { cat1: 4.6, cat2: 4.1, cat3: 3.6 } },
        { min: 87, max: 89, points: { cat1: 4.4, cat2: 3.9, cat3: 3.4 } },
        { min: 83, max: 86, points: { cat1: 4.2, cat2: 3.7, cat3: 3.2 } },
        { min: 80, max: 82, points: { cat1: 4.0, cat2: 3.5, cat3: 3.0 } },
        { min: 77, max: 79, points: { cat1: 3.8, cat2: 3.3, cat3: 2.8 } },
        { min: 73, max: 76, points: { cat1: 3.6, cat2: 3.1, cat3: 2.6 } },
        { min: 71, max: 72, points: { cat1: 3.4, cat2: 2.9, cat3: 2.4 } },
        { min: 70, max: 70, points: { cat1: 3.0, cat2: 2.5, cat3: 2.0 } },
        { min: 60, max: 69, points: { cat1: 2.0, cat2: 1.5, cat3: 1.0 } },
        { min: 0, max: 59, points: { cat1: 0, cat2: 0, cat3: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "EIC (REGULATION) — Academic Achievement: Class Ranking",
      url: "https://resources.finalsite.net/images/v1731096139/dallasisdorg/zf7wgz3hztotzedka7ru/EICREGULATIONrev110724.pdf",
      docType: "Board regulation, \"5.0 Weighted Scale for GPA\"",
      schoolYear: "2024-2025",
      confidence: "verified",
      lastChecked: CHECKED,
    },
    notes: "Independently re-fetched and confirmed exact match. Dallas ISD also has a separate 6.0-point scale used only for class rank (different numbers) — not this one. Dallas doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/1.0/0 convention; unlike most other districts here, Dallas's own weighted table does distinguish 60-69 as its own tier, so a D=1.0 band is included.",
  },
  {
    id: "fort-worth-isd",
    name: "Fort Worth ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "tier1", label: "Tier I (AP/IB/OnRamps/dual credit)" },
      { id: "tier2", label: "Tier II (Honors)" },
      { id: "tier3", label: "Tier III (all other)", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { tier1: 5.0, tier2: 4.5, tier3: 4.0 } },
        { min: 94, max: 96, points: { tier1: 4.8, tier2: 4.3, tier3: 3.8 } },
        { min: 90, max: 93, points: { tier1: 4.6, tier2: 4.1, tier3: 3.6 } },
        { min: 87, max: 89, points: { tier1: 4.4, tier2: 3.9, tier3: 3.4 } },
        { min: 84, max: 86, points: { tier1: 4.2, tier2: 3.7, tier3: 3.2 } },
        { min: 80, max: 83, points: { tier1: 4.0, tier2: 3.5, tier3: 3.0 } },
        { min: 77, max: 79, points: { tier1: 3.8, tier2: 3.3, tier3: 2.8 } },
        { min: 74, max: 76, points: { tier1: 3.6, tier2: 3.1, tier3: 2.6 } },
        { min: 71, max: 73, points: { tier1: 3.4, tier2: 2.9, tier3: 2.4 } },
        { min: 70, max: 70, points: { tier1: 3.0, tier2: 2.5, tier3: 2.0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, points: { unweighted: 4.0 } },
        { min: 80, max: 89, points: { unweighted: 3.0 } },
        { min: 70, max: 79, points: { unweighted: 2.0 } },
        { min: 0, max: 69, points: { unweighted: 0.0 } },
      ],
    },
    source: {
      label: "A Guide to Grade Reporting — Secondary Schools",
      url: "https://resources.finalsite.net/images/v1743630242/fwisdorg/b6fql6x3q1tg00nquaqq/SecondaryGuidetoGradeReporting20242025830242.pdf",
      docType: "District grade-reporting guide, \"2024-2025 School Year Only\"",
      schoolYear: "2024-2025",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "FWISD's grading scale has only A/B/C/F — no D grade, hence no 60-69 band. A newer edition may exist but wasn't found.",
  },
  {
    id: "garland-isd",
    name: "Garland ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "l1-basic", label: "Level 1 — Basic" },
      { id: "l2-regular", label: "Level 2 — Regular", isDefault: true },
      { id: "l3-inth-preap", label: "Level 3 — IntH / Pre-AP / Honors" },
      { id: "l4-ap-dc-mst", label: "Level 4 — AP / DC / MST / AMS / Adv. CTE" },
      { id: "l4a-ap-exam", label: "Level 4A — AP exam score 3-5" },
      { id: "l5-ib-ams", label: "Level 5 — IB / AMS-specific Advanced" },
      { id: "l5a-ib-exam", label: "Level 5A — IB exam score 4-6" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { "l1-basic": 9, "l2-regular": 12, "l3-inth-preap": 13.5, "l4-ap-dc-mst": 15, "l4a-ap-exam": 16.5, "l5-ib-ams": 18, "l5a-ib-exam": 19.5 } },
        { min: 94, max: 96, points: { "l1-basic": 8, "l2-regular": 11, "l3-inth-preap": 12.5, "l4-ap-dc-mst": 14, "l4a-ap-exam": 15.5, "l5-ib-ams": 17, "l5a-ib-exam": 18.5 } },
        { min: 90, max: 93, points: { "l1-basic": 7, "l2-regular": 10, "l3-inth-preap": 11.5, "l4-ap-dc-mst": 13, "l4a-ap-exam": 14.5, "l5-ib-ams": 16, "l5a-ib-exam": 17.5 } },
        { min: 87, max: 89, points: { "l1-basic": 6, "l2-regular": 9, "l3-inth-preap": 10.5, "l4-ap-dc-mst": 12, "l4a-ap-exam": 13.5, "l5-ib-ams": 15, "l5a-ib-exam": 16.5 } },
        { min: 84, max: 86, points: { "l1-basic": 5, "l2-regular": 8, "l3-inth-preap": 9.5, "l4-ap-dc-mst": 11, "l4a-ap-exam": 12.5, "l5-ib-ams": 14, "l5a-ib-exam": 15.5 } },
        { min: 80, max: 83, points: { "l1-basic": 4, "l2-regular": 7, "l3-inth-preap": 8.5, "l4-ap-dc-mst": 10, "l4a-ap-exam": 11.5, "l5-ib-ams": 13, "l5a-ib-exam": 14.5 } },
        { min: 77, max: 79, points: { "l1-basic": 3, "l2-regular": 6, "l3-inth-preap": 7.5, "l4-ap-dc-mst": 9, "l4a-ap-exam": 10.5, "l5-ib-ams": 12, "l5a-ib-exam": 13.5 } },
        { min: 74, max: 76, points: { "l1-basic": 2, "l2-regular": 5, "l3-inth-preap": 6.5, "l4-ap-dc-mst": 8, "l4a-ap-exam": 9.5, "l5-ib-ams": 11, "l5a-ib-exam": 12.5 } },
        { min: 70, max: 73, points: { "l1-basic": 1, "l2-regular": 4, "l3-inth-preap": 5.5, "l4-ap-dc-mst": 7, "l4a-ap-exam": 8.5, "l5-ib-ams": 10, "l5a-ib-exam": 11.5 } },
        { min: 0, max: 69, points: { "l1-basic": 0, "l2-regular": 0, "l3-inth-preap": 0, "l4-ap-dc-mst": 0, "l4a-ap-exam": 0, "l5-ib-ams": 0, "l5a-ib-exam": 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "2023 and after grade point table",
      url: "https://garlandisd.net/2023-and-after-grade-point-table",
      docType: "District page, applies to Class of 2023 onward",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "IMPORTANT: these are raw \"points,\" not a 0-4/5/6 GPA scale (a Regular A+ = 12). Garland's own formula is a credit-weighted average — GPA credits × points, summed, divided by total credits — not a plain average of the table values. This calculator treats every course as equal weight (no per-course credit input in the UI), which matches the common case but is a simplification worth noting to students with unusual course loads. Garland doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention (Garland's own bands never distinguish a grade below 70, so there's no D tier).",
  },
  {
    id: "plano-isd",
    name: "Plano ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "l3-distinguished", label: "Level 3 — Distinguished" },
      { id: "l2-honors", label: "Level 2 — Honors" },
      { id: "l1", label: "Level 1", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { "l3-distinguished": 5.0, "l2-honors": 4.5, l1: 4.0 } },
        { min: 93, max: 96, points: { "l3-distinguished": 4.8, "l2-honors": 4.3, l1: 3.8 } },
        { min: 90, max: 92, points: { "l3-distinguished": 4.6, "l2-honors": 4.1, l1: 3.6 } },
        { min: 87, max: 89, points: { "l3-distinguished": 4.4, "l2-honors": 3.9, l1: 3.4 } },
        { min: 83, max: 86, points: { "l3-distinguished": 4.2, "l2-honors": 3.7, l1: 3.2 } },
        { min: 80, max: 82, points: { "l3-distinguished": 4.0, "l2-honors": 3.5, l1: 3.0 } },
        { min: 77, max: 79, points: { "l3-distinguished": 3.8, "l2-honors": 3.3, l1: 2.8 } },
        { min: 73, max: 76, points: { "l3-distinguished": 3.6, "l2-honors": 3.1, l1: 2.6 } },
        { min: 71, max: 72, points: { "l3-distinguished": 3.4, "l2-honors": 2.9, l1: 2.4 } },
        { min: 70, max: 70, points: { "l3-distinguished": 3.0, "l2-honors": 2.5, l1: 2.0 } },
        { min: 0, max: 69, points: { "l3-distinguished": 0, "l2-honors": 0, l1: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Board Policy EIC (LOCAL)",
      url: "https://pisd.community.diligentoneplatform.com/document/7d0ba285-5f00-4291-a10b-ab588899b16d/",
      docType: "Board policy",
      schoolYear: "2023",
      confidence: "cohort-limited",
      lastChecked: CHECKED,
    },
    notes: "Represents the 3-level scale for the graduating Class of 2028 and later. Students through the Class of 2027 use an older, fully-sourced 5-level scale (AP/IB, Pre-AP/Honors, Regular, Modified, Applied/Basic) with the same point values — not modeled here, but available if a cohort toggle is added later. Plano doesn't publish a separate unweighted figure — the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention (Plano's own bands never distinguish a grade below 70, so there's no D tier).",
  },
  {
    id: "arlington-isd",
    name: "Arlington ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "honors", label: "Honors (Pre-AP/AP/IB)" },
      { id: "regular", label: "Regular", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, letter: "A+", points: { honors: 15, regular: 12 } },
        { min: 93, max: 96, letter: "A", points: { honors: 14, regular: 11 } },
        { min: 90, max: 92, letter: "A-", points: { honors: 13, regular: 10 } },
        { min: 87, max: 89, letter: "B+", points: { honors: 12, regular: 9 } },
        { min: 83, max: 86, letter: "B", points: { honors: 11, regular: 8 } },
        { min: 80, max: 82, letter: "B-", points: { honors: 10, regular: 7 } },
        { min: 77, max: 79, letter: "C+", points: { honors: 9, regular: 6 } },
        { min: 73, max: 76, letter: "C", points: { honors: 8, regular: 5 } },
        { min: 70, max: 72, letter: "C-", points: { honors: 7, regular: 4 } },
        { min: 0, max: 69, letter: "F", points: { honors: 0, regular: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Plan for Grading in Grades Nine Through Twelve (Board Policy EIC Local)",
      url: "https://w4.aisd.net/pdf/Grade_GPA_Option.pdf",
      docType: "District policy document, cross-confirmed across 3 separate AISD sources",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "GPA = grade points earned ÷ number of non-exempt classes attempted. \"Regular\" is the base tier of AISD's own weighted system, not a standard unweighted GPA — the unweighted scale above instead applies the standard 4.0/3.0/2.0/0 convention to Arlington's own letter cutoffs (Arlington has no D grade, going straight from C- at 70-72 to F below 70).",
  },
  {
    id: "mckinney-isd",
    name: "McKinney ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "level3", label: "Level III (AP / Advanced CTE)" },
      { id: "level2", label: "Level II (Advanced / Dual Credit)" },
      { id: "level1", label: "Level I (Academic)", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { level3: 6.0, level2: 5.0, level1: 4.0 } },
        { min: 99, max: 99, points: { level3: 5.9, level2: 4.9, level1: 3.9 } },
        { min: 98, max: 98, points: { level3: 5.8, level2: 4.8, level1: 3.8 } },
        { min: 97, max: 97, points: { level3: 5.7, level2: 4.7, level1: 3.7 } },
        { min: 96, max: 96, points: { level3: 5.6, level2: 4.6, level1: 3.6 } },
        { min: 95, max: 95, points: { level3: 5.5, level2: 4.5, level1: 3.5 } },
        { min: 94, max: 94, points: { level3: 5.4, level2: 4.4, level1: 3.4 } },
        { min: 93, max: 93, points: { level3: 5.3, level2: 4.3, level1: 3.3 } },
        { min: 92, max: 92, points: { level3: 5.2, level2: 4.2, level1: 3.2 } },
        { min: 91, max: 91, points: { level3: 5.1, level2: 4.1, level1: 3.1 } },
        { min: 90, max: 90, points: { level3: 5.0, level2: 4.0, level1: 3.0 } },
        { min: 89, max: 89, points: { level3: 4.9, level2: 3.9, level1: 2.9 } },
        { min: 88, max: 88, points: { level3: 4.8, level2: 3.8, level1: 2.8 } },
        { min: 87, max: 87, points: { level3: 4.7, level2: 3.7, level1: 2.7 } },
        { min: 86, max: 86, points: { level3: 4.6, level2: 3.6, level1: 2.6 } },
        { min: 85, max: 85, points: { level3: 4.5, level2: 3.5, level1: 2.5 } },
        { min: 84, max: 84, points: { level3: 4.4, level2: 3.4, level1: 2.4 } },
        { min: 83, max: 83, points: { level3: 4.3, level2: 3.3, level1: 2.3 } },
        { min: 82, max: 82, points: { level3: 4.2, level2: 3.2, level1: 2.2 } },
        { min: 81, max: 81, points: { level3: 4.1, level2: 3.1, level1: 2.1 } },
        { min: 80, max: 80, points: { level3: 4.0, level2: 3.0, level1: 2.0 } },
        { min: 79, max: 79, points: { level3: 3.9, level2: 2.9, level1: 1.9 } },
        { min: 78, max: 78, points: { level3: 3.8, level2: 2.8, level1: 1.8 } },
        { min: 77, max: 77, points: { level3: 3.7, level2: 2.7, level1: 1.7 } },
        { min: 76, max: 76, points: { level3: 3.6, level2: 2.6, level1: 1.6 } },
        { min: 75, max: 75, points: { level3: 3.5, level2: 2.5, level1: 1.5 } },
        { min: 74, max: 74, points: { level3: 3.4, level2: 2.4, level1: 1.4 } },
        { min: 73, max: 73, points: { level3: 3.3, level2: 2.3, level1: 1.3 } },
        { min: 72, max: 72, points: { level3: 3.2, level2: 2.2, level1: 1.2 } },
        { min: 71, max: 71, points: { level3: 3.1, level2: 2.1, level1: 1.1 } },
        { min: 70, max: 70, points: { level3: 3.0, level2: 2.0, level1: 1.0 } },
        { min: 0, max: 69, points: { level3: 0, level2: 0, level1: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4.0 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3.0 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2.0 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "High School Academic Planning Guide",
      url: "https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/4789/Misd/cc0ec31f-39f3-42e8-b0aa-ee45cce7fc0f/2022-23-High-School-Academic-Planning-Guide-01.pdf",
      docType: "District academic planning guide, formally adopted via Board Policy EIC(LOCAL)/EIC(EXHIBIT)",
      schoolYear: "2022-2023",
      confidence: "dated",
      lastChecked: CHECKED,
    },
    notes: "Newest document found is from 2022-2023; no more recent guide was located, though this Level I/II/III structure tends to stay stable.",
  },
  {
    id: "lewisville-isd",
    name: "Lewisville ISD",
    category: "district",
    state: "TX",
    metro: "Dallas–Fort Worth",
    gradeInput: "numeric",
    levels: [
      { id: "level3", label: "Level 3 (AP, Dual Credit, Academic Decathlon)" },
      { id: "level2", label: "Level 2 (Honors)" },
      { id: "level1", label: "Level 1 (General education)", isDefault: true },
      { id: "level0", label: "Level 0 (Modified-TEKS/IEP, night/summer, accelerated)" },
    ],
    weighted: {
      kind: "formula",
      op: "multiply",
      factors: { level3: 1.2, level2: 1.15, level1: 1.1, level0: 1.0 },
      resultNote: "The raw semester grade is multiplied by a category weight, so the result stays close to the raw 0-100 scale rather than a 4.0/5.0 GPA.",
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "EIC — Academic Achievement: Class Ranking",
      url: "https://pol.tasb.org/PolicyOnline/PolicyDetails?key=384&code=EIC",
      docType: "Board policy, TASB Policy Online",
      schoolYear: "2021",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "District records unweighted numerical grades on transcripts but doesn't define its own separate 4.0-scale unweighted GPA — the unweighted scale above instead applies the standard 4.0/3.0/2.0/1.0/0 convention directly to the raw numeric grade.",
  },

  // ------------------------------------------------------------------ Austin
  {
    id: "austin-isd",
    name: "Austin ISD",
    category: "district",
    state: "TX",
    metro: "Austin",
    gradeInput: "numeric",
    levels: [
      { id: "tier1", label: "Tier I / Advanced (AP, Pre-AP, IB, Magnet, dual credit)" },
      { id: "tier2", label: "Tier II / General Education", isDefault: true },
      { id: "tier3", label: "Tier III / Prescribed" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { tier1: 5.0, tier2: 4.0, tier3: 3.0 } },
        { min: 99, max: 99, points: { tier1: 4.9, tier2: 3.9, tier3: 2.9 } },
        { min: 98, max: 98, points: { tier1: 4.8, tier2: 3.8, tier3: 2.8 } },
        { min: 97, max: 97, points: { tier1: 4.7, tier2: 3.7, tier3: 2.7 } },
        { min: 96, max: 96, points: { tier1: 4.6, tier2: 3.6, tier3: 2.6 } },
        { min: 95, max: 95, points: { tier1: 4.5, tier2: 3.5, tier3: 2.55 } },
        { min: 94, max: 94, points: { tier1: 4.4, tier2: 3.4, tier3: 2.5 } },
        { min: 93, max: 93, points: { tier1: 4.3, tier2: 3.3, tier3: 2.4 } },
        { min: 92, max: 92, points: { tier1: 4.2, tier2: 3.2, tier3: 2.3 } },
        { min: 91, max: 91, points: { tier1: 4.1, tier2: 3.1, tier3: 2.2 } },
        { min: 90, max: 90, points: { tier1: 4.0, tier2: 3.0, tier3: 2.15 } },
        { min: 89, max: 89, points: { tier1: 3.9, tier2: 2.9, tier3: 2.1 } },
        { min: 88, max: 88, points: { tier1: 3.8, tier2: 2.8, tier3: 2.0 } },
        { min: 87, max: 87, points: { tier1: 3.7, tier2: 2.7, tier3: 1.9 } },
        { min: 86, max: 86, points: { tier1: 3.6, tier2: 2.6, tier3: 1.8 } },
        { min: 85, max: 85, points: { tier1: 3.5, tier2: 2.5, tier3: 1.7 } },
        { min: 84, max: 84, points: { tier1: 3.4, tier2: 2.4, tier3: 1.6 } },
        { min: 83, max: 83, points: { tier1: 3.3, tier2: 2.3, tier3: 1.55 } },
        { min: 82, max: 82, points: { tier1: 3.2, tier2: 2.2, tier3: 1.5 } },
        { min: 81, max: 81, points: { tier1: 3.1, tier2: 2.1, tier3: 1.4 } },
        { min: 80, max: 80, points: { tier1: 3.0, tier2: 2.0, tier3: 1.3 } },
        { min: 79, max: 79, points: { tier1: 2.9, tier2: 1.9, tier3: 1.2 } },
        { min: 78, max: 78, points: { tier1: 2.8, tier2: 1.8, tier3: 1.15 } },
        { min: 77, max: 77, points: { tier1: 2.7, tier2: 1.7, tier3: 1.1 } },
        { min: 76, max: 76, points: { tier1: 2.6, tier2: 1.6, tier3: 1.0 } },
        { min: 75, max: 75, points: { tier1: 2.5, tier2: 1.5, tier3: 0.9 } },
        { min: 74, max: 74, points: { tier1: 2.4, tier2: 1.4, tier3: 0.8 } },
        { min: 73, max: 73, points: { tier1: 2.3, tier2: 1.3, tier3: 0.7 } },
        { min: 72, max: 72, points: { tier1: 2.2, tier2: 1.2, tier3: 0.6 } },
        { min: 71, max: 71, points: { tier1: 2.1, tier2: 1.1, tier3: 0.55 } },
        { min: 70, max: 70, points: { tier1: 2.0, tier2: 1.0, tier3: 0.5 } },
        { min: 0, max: 69, points: { tier1: 0, tier2: 0, tier3: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "EIC (REGULATION)",
      url: "https://pol.tasb.org/PolicyOnline/PolicyDetails?key=1146&code=EIC",
      docType: "Board regulation, TASB Policy Online, cross-checked against an April 2025 district class-rank guide",
      schoolYear: "2019 (regulation text); guidance updated 04/2025",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Austin ISD describes an \"Unweighted GPA (Cumulative GPA in Naviance)\" conceptually, but never published its own numeric table for it. Rather than guess that it mirrors the Tier II column, the unweighted scale above applies the standard 4.0/3.0/2.0/0 convention to Austin's own letter-grade cutoffs (Austin's table never distinguishes a grade below 70, so there's no D tier).",
  },
  {
    id: "round-rock-isd",
    name: "Round Rock ISD",
    category: "district",
    state: "TX",
    metro: "Austin",
    gradeInput: "numeric",
    levels: [
      { id: "advanced", label: "Advanced, IB, AP, TAG, OnRamps (core/LOTE)" },
      { id: "regular", label: "Regular (core/LOTE)", isDefault: true },
    ],
    weightedLabel: "RIC (Rank in Class)",
    unweightedLabel: "GPA",
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { advanced: 6.0, regular: 5.0 } },
        { min: 99, max: 99, points: { advanced: 5.9, regular: 4.9 } },
        { min: 98, max: 98, points: { advanced: 5.8, regular: 4.8 } },
        { min: 97, max: 97, points: { advanced: 5.7, regular: 4.7 } },
        { min: 96, max: 96, points: { advanced: 5.6, regular: 4.6 } },
        { min: 95, max: 95, points: { advanced: 5.5, regular: 4.5 } },
        { min: 94, max: 94, points: { advanced: 5.4, regular: 4.4 } },
        { min: 93, max: 93, points: { advanced: 5.3, regular: 4.3 } },
        { min: 92, max: 92, points: { advanced: 5.2, regular: 4.2 } },
        { min: 91, max: 91, points: { advanced: 5.1, regular: 4.1 } },
        { min: 90, max: 90, points: { advanced: 5.0, regular: 4.0 } },
        { min: 89, max: 89, points: { advanced: 4.9, regular: 3.9 } },
        { min: 88, max: 88, points: { advanced: 4.8, regular: 3.8 } },
        { min: 87, max: 87, points: { advanced: 4.7, regular: 3.7 } },
        { min: 86, max: 86, points: { advanced: 4.6, regular: 3.6 } },
        { min: 85, max: 85, points: { advanced: 4.5, regular: 3.5 } },
        { min: 84, max: 84, points: { advanced: 4.4, regular: 3.4 } },
        { min: 83, max: 83, points: { advanced: 4.3, regular: 3.3 } },
        { min: 82, max: 82, points: { advanced: 4.2, regular: 3.2 } },
        { min: 81, max: 81, points: { advanced: 4.1, regular: 3.1 } },
        { min: 80, max: 80, points: { advanced: 4.0, regular: 3.0 } },
        { min: 79, max: 79, points: { advanced: 3.9, regular: 2.9 } },
        { min: 78, max: 78, points: { advanced: 3.8, regular: 2.8 } },
        { min: 77, max: 77, points: { advanced: 3.7, regular: 2.7 } },
        { min: 76, max: 76, points: { advanced: 3.6, regular: 2.6 } },
        { min: 75, max: 75, points: { advanced: 3.5, regular: 2.5 } },
        { min: 74, max: 74, points: { advanced: 3.4, regular: 2.4 } },
        { min: 73, max: 73, points: { advanced: 3.3, regular: 2.3 } },
        { min: 72, max: 72, points: { advanced: 3.2, regular: 2.2 } },
        { min: 71, max: 71, points: { advanced: 3.1, regular: 2.1 } },
        { min: 70, max: 70, points: { advanced: 3.0, regular: 2.0 } },
        { min: 0, max: 69, points: { advanced: 0, regular: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4.0 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3.0 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2.0 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0.0 } },
      ],
    },
    source: {
      label: "Computing the Rank in Class (RIC) Grade Point Average",
      url: "https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/5378/Rrisd/b4786626-ca6c-489c-8f3a-ede5e6fbf3bf/Computing_the_Rank_in_Class__RIC__Grade_Point_.pdf",
      docType: "District document, cross-verified against Board Policy EIC (LOCAL)",
      schoolYear: "2024",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Terminology is inverted from what you'd expect: RRISD's \"GPA\" is the unweighted figure; the weighted number used for actual ranking is called \"RIC,\" not GPA. RIC only covers core/LOTE courses and has no separate Pre-AP tier (shares the top tier with AP/IB/TAG/OnRamps).",
  },

  // ---------------------------------------------------------------- El Paso
  {
    id: "el-paso-isd",
    name: "El Paso ISD",
    category: "district",
    state: "TX",
    metro: "El Paso",
    gradeInput: "numeric",
    levels: [
      { id: "tier1", label: "Tier 1 (IB, AP, Dual Credit/Enrollment, Articulated Credit)" },
      { id: "tier2", label: "Tier 2 (IB Prep, Honors, Pre-AP)" },
      { id: "tier3", label: "Tier 3 (all other)", isDefault: true },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 100, max: 100, points: { tier3: 4.0, tier2: 4.5, tier1: 5.0 } },
        { min: 99, max: 99, points: { tier3: 3.95, tier2: 4.4438, tier1: 4.9375 } },
        { min: 98, max: 98, points: { tier3: 3.9, tier2: 4.3875, tier1: 4.875 } },
        { min: 97, max: 97, points: { tier3: 3.85, tier2: 4.3313, tier1: 4.8125 } },
        { min: 96, max: 96, points: { tier3: 3.8, tier2: 4.275, tier1: 4.75 } },
        { min: 95, max: 95, points: { tier3: 3.75, tier2: 4.2188, tier1: 4.6875 } },
        { min: 94, max: 94, points: { tier3: 3.7, tier2: 4.1625, tier1: 4.625 } },
        { min: 93, max: 93, points: { tier3: 3.65, tier2: 4.1063, tier1: 4.5625 } },
        { min: 92, max: 92, points: { tier3: 3.6, tier2: 4.05, tier1: 4.5 } },
        { min: 91, max: 91, points: { tier3: 3.55, tier2: 3.9938, tier1: 4.4375 } },
        { min: 90, max: 90, points: { tier3: 3.5, tier2: 3.9375, tier1: 4.375 } },
        { min: 89, max: 89, points: { tier3: 3.45, tier2: 3.8813, tier1: 4.3125 } },
        { min: 88, max: 88, points: { tier3: 3.4, tier2: 3.825, tier1: 4.25 } },
        { min: 87, max: 87, points: { tier3: 3.35, tier2: 3.7688, tier1: 4.1875 } },
        { min: 86, max: 86, points: { tier3: 3.3, tier2: 3.7125, tier1: 4.125 } },
        { min: 85, max: 85, points: { tier3: 3.25, tier2: 3.6563, tier1: 4.0625 } },
        { min: 84, max: 84, points: { tier3: 3.2, tier2: 3.6, tier1: 4.0 } },
        { min: 83, max: 83, points: { tier3: 3.15, tier2: 3.5438, tier1: 3.9375 } },
        { min: 82, max: 82, points: { tier3: 3.1, tier2: 3.4875, tier1: 3.875 } },
        { min: 81, max: 81, points: { tier3: 3.05, tier2: 3.4313, tier1: 3.8125 } },
        { min: 80, max: 80, points: { tier3: 3.0, tier2: 3.375, tier1: 3.75 } },
        { min: 79, max: 79, points: { tier3: 2.9, tier2: 3.2625, tier1: 3.625 } },
        { min: 78, max: 78, points: { tier3: 2.8, tier2: 3.15, tier1: 3.5 } },
        { min: 77, max: 77, points: { tier3: 2.7, tier2: 3.0375, tier1: 3.375 } },
        { min: 76, max: 76, points: { tier3: 2.6, tier2: 2.925, tier1: 3.25 } },
        { min: 75, max: 75, points: { tier3: 2.5, tier2: 2.8125, tier1: 3.125 } },
        { min: 74, max: 74, points: { tier3: 2.4, tier2: 2.7, tier1: 3.0 } },
        { min: 73, max: 73, points: { tier3: 2.3, tier2: 2.5875, tier1: 2.875 } },
        { min: 72, max: 72, points: { tier3: 2.2, tier2: 2.475, tier1: 2.75 } },
        { min: 71, max: 71, points: { tier3: 2.1, tier2: 2.3625, tier1: 2.625 } },
        { min: 70, max: 70, points: { tier3: 2.0, tier2: 2.25, tier1: 2.5 } },
        { min: 0, max: 69, points: { tier3: 1.9714, tier2: 2.2179, tier1: 2.4643 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
        { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "Board Policy EIC (LOCAL)",
      url: "https://pol.tasb.org/PolicyOnline/PolicyDetails?key=437&code=EIC",
      docType: "Board policy, TASB Policy Online",
      schoolYear: "2024",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes:
      "The 0-69 band above uses the value at exactly 69; El Paso's actual policy continues the same linear formula on down through 0 (a 0 scores 0 on every tier) — the Phase 1 research doc has the full per-integer breakdown if finer failing-grade precision is ever needed. El Paso publishes two GPAs that differ by which courses are counted (class-rank scope vs. overall), not by weighting method, and neither is a standard unweighted 4.0. The unweighted scale above instead applies the standard 4.0/3.0/2.0/0 convention, using El Paso's own stated letter cutoff (70=C-, 69=F) rather than the weighted table's continued decline below 70.",
  },
];

/** The 2-3 generic, non-district-specific conventions from the Phase 1 research, usable as starting points for "Custom Scale." */
export const genericConventions: District[] = [
  {
    id: "generic-fixed-bump",
    name: "Standard 4.0 unweighted + fixed bump (Honors +0.5, AP/IB +1.0)",
    category: "generic",
    gradeInput: "letter",
    levels: [
      { id: "regular", label: "Regular", isDefault: true },
      { id: "honors", label: "Honors" },
      { id: "ap", label: "AP / IB / College" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { regular: 4.0, honors: 4.5, ap: 5.0 } },
        { min: 80, max: 89, letter: "B", points: { regular: 3.0, honors: 3.5, ap: 4.0 } },
        { min: 70, max: 79, letter: "C", points: { regular: 2.0, honors: 2.5, ap: 3.0 } },
        { min: 60, max: 69, letter: "D", points: { regular: 1.0, honors: 1.5, ap: 2.0 } },
        { min: 0, max: 59, letter: "F", points: { regular: 0, honors: 0, ap: 0 } },
      ],
    },
    unweighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { unweighted: 4.0 } },
        { min: 80, max: 89, letter: "B", points: { unweighted: 3.0 } },
        { min: 70, max: 79, letter: "C", points: { unweighted: 2.0 } },
        { min: 60, max: 69, letter: "D", points: { unweighted: 1.0 } },
        { min: 0, max: 59, letter: "F", points: { unweighted: 0 } },
      ],
    },
    source: {
      label: "North Carolina State Board of Education Policy GRAD-009",
      url: "https://content.govdelivery.com/attachments/NCSBE/2025/10/03/file_attachments/3409884/GRAD-009%20-%20Grading%20and%20Transcript%20Standards%2010-02-2025.pdf",
      docType: "Statewide policy",
      schoolYear: "2024-2025",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "A real, current, state-mandated instance of this widely-used convention — not specific to any Texas district. The University of California's a-g GPA recalculation uses a capped variant (+1/semester, max 8 bonus points).",
  },
  {
    id: "generic-5point-scale",
    name: "5.0-point letter-grade scale",
    category: "generic",
    gradeInput: "letter",
    levels: [
      { id: "regular", label: "Regular", isDefault: true },
      { id: "honors", label: "Honors" },
      { id: "ap", label: "AP / IB" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 90, max: 100, letter: "A", points: { regular: 4.0, honors: 4.5, ap: 5.0 } },
        { min: 80, max: 89, letter: "B", points: { regular: 3.0, honors: 3.5, ap: 4.0 } },
        { min: 70, max: 79, letter: "C", points: { regular: 2.0, honors: 2.5, ap: 3.0 } },
        { min: 0, max: 69, letter: "F", points: { regular: 0, honors: 0, ap: 0 } },
      ],
    },
    source: {
      label: "El Paso ISD Board Policy EIC (LOCAL); see also the district entry above",
      url: "https://pol.tasb.org/PolicyOnline/PolicyDetails?key=437&code=EIC",
      docType: "Board policy (used here as a live example of the general convention)",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "Mechanically identical to the fixed-bump convention above, just described by its ceiling (a perfect Honors/AP grade tops out at 4.5/5.0 instead of being expressed as a +0.5/+1.0 bump).",
  },
  {
    id: "generic-numeric-lookup",
    name: "Numeric-grade-to-points lookup table",
    category: "generic",
    gradeInput: "numeric",
    levels: [
      { id: "regular", label: "Regular", isDefault: true },
      { id: "honors", label: "Honors" },
      { id: "ap", label: "AP / IB" },
    ],
    weighted: {
      kind: "table",
      bands: [
        { min: 97, max: 100, points: { regular: 4.0, honors: 4.5, ap: 5.0 } },
        { min: 93, max: 96, points: { regular: 3.8, honors: 4.3, ap: 4.8 } },
        { min: 90, max: 92, points: { regular: 3.6, honors: 4.1, ap: 4.6 } },
        { min: 87, max: 89, points: { regular: 3.4, honors: 3.9, ap: 4.4 } },
        { min: 83, max: 86, points: { regular: 3.2, honors: 3.7, ap: 4.2 } },
        { min: 80, max: 82, points: { regular: 3.0, honors: 3.5, ap: 4.0 } },
        { min: 77, max: 79, points: { regular: 2.8, honors: 3.3, ap: 3.8 } },
        { min: 73, max: 76, points: { regular: 2.6, honors: 3.1, ap: 3.6 } },
        { min: 70, max: 72, points: { regular: 2.4, honors: 2.9, ap: 3.4 } },
        { min: 0, max: 69, points: { regular: 0, honors: 0, ap: 0 } },
      ],
    },
    source: {
      label: "Illustrative — patterned after Dallas ISD, Arlington ISD, and McKinney ISD's real tables above",
      url: "https://resources.finalsite.net/images/v1731096139/dallasisdorg/zf7wgz3hztotzedka7ru/EICREGULATIONrev110724.pdf",
      docType: "Composite of sourced district tables (see linked districts for the real, non-illustrative versions)",
      confidence: "sourced",
      lastChecked: CHECKED,
    },
    notes: "This is a generic template representing the style, not one specific district's exact numbers — for a real district that uses this style, select that district directly rather than this generic preset.",
  },
];

export type CustomScaleTemplate = {
  gradeInput: District["gradeInput"];
  levels: CourseLevel[];
  weighted: TableScale;
  unweighted: TableScale;
};

/** Starting point offered when a student picks "Custom Scale." Fully editable in the UI. */
export const customScaleTemplate: CustomScaleTemplate = {
  gradeInput: "letter",
  levels: [
    { id: "regular", label: "Regular", isDefault: true },
    { id: "honors-preap", label: "Honors / Pre-AP" },
    { id: "ap", label: "AP" },
  ],
  weighted: {
    kind: "table",
    bands: [
      { min: 90, max: 100, letter: "A", points: { regular: 4, "honors-preap": 4.5, ap: 5 } },
      { min: 80, max: 89, letter: "B", points: { regular: 3, "honors-preap": 3.5, ap: 4 } },
      { min: 70, max: 79, letter: "C", points: { regular: 2, "honors-preap": 2.5, ap: 3 } },
      { min: 0, max: 69, letter: "F", points: { regular: 0, "honors-preap": 0, ap: 0 } },
    ],
  },
  unweighted: {
    kind: "table",
    bands: [
      { min: 90, max: 100, letter: "A", points: { unweighted: 4 } },
      { min: 80, max: 89, letter: "B", points: { unweighted: 3 } },
      { min: 70, max: 79, letter: "C", points: { unweighted: 2 } },
      { min: 0, max: 69, letter: "F", points: { unweighted: 0 } },
    ],
  },
};

export function getDistrictById(id: string): District | undefined {
  return gpaDistricts.find((d) => d.id === id);
}

/** Ranked substring search over district name, for the searchable dropdown. */
export function searchDistricts(query: string, limit = 8): District[] {
  const q = query.trim().toLowerCase();
  if (!q) return gpaDistricts;

  const scored: (District & { score: number })[] = [];
  for (const d of gpaDistricts) {
    const name = d.name.toLowerCase();
    let score = 0;
    if (name === q) score = 4;
    else if (name.startsWith(q)) score = 3;
    else if (name.includes(q)) score = 2;
    else if (d.metro?.toLowerCase().includes(q)) score = 1;
    if (score > 0) scored.push({ ...d, score });
  }
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, limit);
}
