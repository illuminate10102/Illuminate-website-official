import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { Callout, H2 } from "../components/content/Prose";
import {
  customScaleTemplate,
  getDistrictById,
  searchDistricts,
  type CourseLevel,
  type District,
  type TableScale,
} from "../data/gpaDistricts";
import {
  creditsForCourse,
  formatGpa,
  gradeResolves,
  letterOptionsFor,
  resolveBandLetter,
  resolveCoursePoints,
  resolvePassStatus,
  type CourseInput,
} from "../lib/gpaCalc";
import {
  creditWeightedAverage,
  cumulativeWithPrior,
  formatCredits,
  maxScalePoints,
  solveRequiredAverage,
  type WeightedTotal,
} from "../lib/cumulativeGpa";
import { exportTranscriptCsv, exportTranscriptPdf, type TranscriptData } from "../lib/transcriptExport";

type SourceLink = { label: string; href?: string; note?: string };

// Each district's own source is already surfaced inline in the sidebar
// summary card once it's selected — a static sidebar duplicating a handful
// of examples added noise without adding information, so this guide
// intentionally has no separate "Sources & links" sidebar.
export const gpaCalculatorSources: SourceLink[] = [];

// Illuminate's own generic 4.0/4.5/5.0 fixed-bump convention (sourced —
// see gpaDistricts.ts) — pre-selected so the tool is usable immediately
// without forcing a district search first.
const DEFAULT_DISTRICT_ID = "generic-fixed-bump";

type CourseState = CourseInput & { id: number; name: string };
type SemesterState = { id: number; label: string; courses: CourseState[] };

function cloneTable(scale: TableScale): TableScale {
  return structuredClone(scale);
}

function buildCustomDistrict(weighted: TableScale, unweighted: TableScale): District {
  return {
    id: "custom",
    name: "Custom Scale",
    category: "district",
    gradeInput: customScaleTemplate.gradeInput,
    levels: customScaleTemplate.levels,
    weighted,
    unweighted,
    source: { label: "Custom Scale", url: "", docType: "Student-entered", confidence: "sourced", lastChecked: "" },
  };
}

function defaultLevelId(levels: CourseLevel[]): string {
  return levels.find((l) => l.isDefault)?.id ?? levels[0]?.id ?? "";
}

function newCourse(nextId: { current: number }, district: District): CourseState {
  return { id: nextId.current++, name: "", levelId: defaultLevelId(district.levels), grade: "" };
}

// Unweighted scales award points per letter grade only, ignoring course
// rigor entirely — their bands key points by the literal "unweighted"
// column (see gpaDistricts.ts), not by a course's own levelId. Passing
// `levelIdOverride: "unweighted"` remaps every row onto that column before
// resolving, the same way the original single-list calculator did. Credits
// are computed from the course's real grade/level regardless of that
// override, since a course's credit-worthiness doesn't depend on which GPA
// figure is currently being calculated.
function toCredited(courses: CourseState[], district: District, levelIdOverride?: string) {
  return courses.map((c) => ({
    ...c,
    levelId: levelIdOverride ?? c.levelId,
    credits: creditsForCourse(district, c),
  }));
}

function DistrictPicker({
  selectedId,
  district,
  onSelect,
}: {
  selectedId: string | null;
  district: District | null;
  onSelect: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchDistricts(query, 8), [query]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (selectedId && district) {
    return (
      <div>
        <div className="flex items-center justify-between gap-4 border border-rule rounded-lg px-4 py-3 bg-paper-dim">
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon name="search-check" className="w-4 h-4 text-pen shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-ink truncate">{district.shortName ?? district.name}</p>
              {district.category === "generic" && (
                <p className="text-xs text-ink-soft">General / not district-specific</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setQuery("");
            }}
            className="course-code text-xs text-pen hover:text-pen-dim underline decoration-rule hover:decoration-pen underline-offset-4 shrink-0"
          >
            Change
          </button>
        </div>
        {district.id === DEFAULT_DISTRICT_ID && (
          <p className="text-sm text-ink-soft leading-relaxed mt-3">
            Illuminate's general default — most U.S. districts use a similar +0.5 Honors / +1.0 AP-IB weighting.
            Select your exact district below if it's listed, or build a custom scale.
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center border border-rule rounded-lg px-3 focus-within:border-pen transition-colors bg-paper">
        <Icon name="search" className="w-4 h-4 text-ink-soft shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for your school district…"
          className="w-full bg-transparent py-3 px-3 text-base text-ink placeholder:text-ink-soft outline-none"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 border border-rule rounded-lg bg-dropdown-bg shadow-lg max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="p-1.5">
              {results.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(d.id);
                      setOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-md hover:bg-pen/10 transition-colors"
                  >
                    <span className="text-sm font-semibold text-ink">{d.shortName ?? d.name}</span>
                    {d.metro && <span className="course-code text-[0.65rem] text-ink-soft shrink-0">{d.metro}</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-ink-soft">No districts match "{query}" yet.</p>
          )}
          <div className="border-t border-rule p-1.5">
            <button
              type="button"
              onClick={() => {
                onSelect("custom");
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-marker/10 transition-colors text-marker-dim font-semibold text-sm"
            >
              <Icon name="pen-nib" className="w-4 h-4 shrink-0" />
              Don't see your district? Use a Custom Scale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PointInput({ value, onChange }: { value: number; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      step="0.5"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-16 border border-rule rounded-md px-2 py-1.5 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors tabular-nums"
    />
  );
}

function CustomScaleEditor({
  weighted,
  unweighted,
  onChangeWeighted,
  onChangeUnweighted,
}: {
  weighted: TableScale;
  unweighted: TableScale;
  onChangeWeighted: (next: TableScale) => void;
  onChangeUnweighted: (next: TableScale) => void;
}) {
  const levels = customScaleTemplate.levels;

  function updateWeighted(bandIndex: number, levelId: string, raw: string) {
    const n = raw === "" ? 0 : Number(raw);
    if (!Number.isFinite(n)) return;
    onChangeWeighted({
      ...weighted,
      bands: weighted.bands.map((b, i) => (i === bandIndex ? { ...b, points: { ...b.points, [levelId]: n } } : b)),
    });
  }

  function updateUnweighted(bandIndex: number, raw: string) {
    const n = raw === "" ? 0 : Number(raw);
    if (!Number.isFinite(n)) return;
    onChangeUnweighted({
      ...unweighted,
      bands: unweighted.bands.map((b, i) => (i === bandIndex ? { ...b, points: { unweighted: n } } : b)),
    });
  }

  return (
    <div className="border border-rule rounded-lg p-4 sm:p-5 bg-paper-dim space-y-4">
      <p className="text-sm text-ink-soft leading-relaxed">
        Enter the points your district awards for each letter grade, at each course level. These start at a common
        4.0 / 4.5 / 5.0 scale — change any number to match your district.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left font-semibold text-ink pb-2 pr-4">Grade</th>
              {levels.map((l) => (
                <th key={l.id} className="text-left font-semibold text-ink pb-2 pr-4">
                  {l.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weighted.bands.map((band, i) => (
              <tr key={band.letter ?? i} className="border-t border-rule">
                <td className="py-2 pr-4 font-semibold text-ink">{band.letter}</td>
                {levels.map((l) => (
                  <td key={l.id} className="py-2 pr-4">
                    <PointInput value={band.points[l.id] ?? 0} onChange={(v) => updateWeighted(i, l.id, v)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details>
        <summary className="cursor-pointer text-pen font-semibold text-sm select-none">
          Also set unweighted points
        </summary>
        <div className="overflow-x-auto mt-3 accordion-content">
          <table className="text-sm border-collapse">
            <tbody>
              {unweighted.bands.map((band, i) => (
                <tr key={band.letter ?? i} className="border-t border-rule">
                  <td className="py-2 pr-4 font-semibold text-ink w-16">{band.letter}</td>
                  <td className="py-2">
                    <PointInput value={band.points.unweighted ?? 0} onChange={(v) => updateUnweighted(i, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function SemesterCourseRow({
  course,
  levels,
  gradeMode,
  letterOptions,
  district,
  onChange,
  onRemove,
}: {
  course: CourseState;
  levels: CourseLevel[];
  gradeMode: "letter" | "numeric";
  letterOptions: string[];
  district: District;
  onChange: (patch: Partial<CourseState>) => void;
  onRemove: () => void;
}) {
  const unresolved = !gradeResolves(district.weighted, course);
  // Only relevant in numeric mode — confirms which band a typed number like
  // "97" landed in, since the field itself no longer shows a letter.
  const matchedLetter = gradeMode === "numeric" ? resolveBandLetter(district.weighted, course.grade) : undefined;
  const passStatus = resolvePassStatus(district, course);

  return (
    <div className="py-2.5 border-b border-rule last:border-b-0">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_84px_28px] gap-2 sm:gap-3 sm:items-center">
        <input
          type="text"
          value={course.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. AP World History"
          className="min-w-0 border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={course.levelId}
          onChange={(e) => onChange({ levelId: e.target.value })}
          className="border border-rule rounded-md px-2.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors"
        >
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        {gradeMode === "letter" ? (
          <select
            value={course.grade}
            onChange={(e) => onChange({ grade: e.target.value })}
            className="border border-rule rounded-md px-2.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors"
          >
            <option value="">Grade</option>
            {letterOptions.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={course.grade}
            onChange={(e) => onChange({ grade: e.target.value })}
            placeholder="0–100"
            className="border border-rule rounded-md px-2.5 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors"
          />
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove course"
          className="justify-self-end sm:justify-self-center text-ink-soft hover:text-rose transition-colors p-1"
        >
          <Icon name="trash" className="w-4 h-4" />
        </button>
      </div>
      {matchedLetter && <p className="text-xs text-mint mt-1">→ {matchedLetter}</p>}
      {unresolved && (
        <p className="text-xs text-amber mt-1">
          This grade isn't counted yet — {gradeMode === "numeric" ? "enter a number from 0–100" : "pick a grade"}.
        </p>
      )}
      {passStatus === "fail" && (
        <p className="text-xs text-rose mt-1">Below passing grade — earns 0 credits for this semester.</p>
      )}
    </div>
  );
}

function SemesterCard({
  semester,
  district,
  gradeMode,
  letterOptions,
  onRename,
  onRemove,
  canRemove,
  onDuplicate,
  onAddCourse,
  onUpdateCourse,
  onRemoveCourse,
}: {
  semester: SemesterState;
  district: District;
  gradeMode: "letter" | "numeric";
  letterOptions: string[];
  onRename: (label: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  onDuplicate: () => void;
  onAddCourse: () => void;
  onUpdateCourse: (courseId: number, patch: Partial<CourseState>) => void;
  onRemoveCourse: (courseId: number) => void;
}) {
  const gpa = creditWeightedAverage(district.weighted, toCredited(semester.courses, district)).gpa;

  return (
    <div className="border border-rule rounded-lg p-5 sm:p-6 bg-paper">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          value={semester.label}
          onChange={(e) => onRename(e.target.value)}
          aria-label="Semester name"
          className="min-w-0 flex-1 bg-transparent font-display font-bold text-xl text-ink outline-none border-b border-transparent focus:border-pen transition-colors py-0.5"
        />
        <div className="flex items-center gap-3 shrink-0">
          <span className="course-code text-xs text-ink font-bold whitespace-nowrap">{formatGpa(gpa)} GPA</span>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label={`Duplicate ${semester.label}`}
            title="Duplicate this semester's courses into a new semester"
            className="text-ink-soft hover:text-pen transition-colors p-1 -m-1"
          >
            <Icon name="copy" className="w-4 h-4" />
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${semester.label}`}
              className="text-ink-soft hover:text-rose transition-colors p-1 -m-1"
            >
              <Icon name="trash" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {semester.courses.length > 0 && (
        <div className="hidden sm:grid grid-cols-[1fr_150px_84px_28px] gap-3 px-1 mb-1">
          <span className="course-code text-[0.65rem] text-ink-soft uppercase">Course</span>
          <span className="course-code text-[0.65rem] text-ink-soft uppercase">Level</span>
          <span className="course-code text-[0.65rem] text-ink-soft uppercase">Grade</span>
          <span />
        </div>
      )}

      {semester.courses.length === 0 ? (
        <p className="text-ink-soft text-sm mb-3">No courses yet — add your first one below.</p>
      ) : (
        <div className="mb-3">
          {semester.courses.map((course) => (
            <SemesterCourseRow
              key={course.id}
              course={course}
              levels={district.levels}
              gradeMode={gradeMode}
              letterOptions={letterOptions}
              district={district}
              onChange={(patch) => onUpdateCourse(course.id, patch)}
              onRemove={() => onRemoveCourse(course.id)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAddCourse}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border border-rule bg-paper hover:bg-paper-dim transition-colors"
      >
        <Icon name="plus" className="w-4 h-4" />
        Add a course
      </button>
    </div>
  );
}

function buildTranscriptData({
  district,
  semesters,
  studentName,
  weightedTotal,
  unweightedTotal,
}: {
  district: District;
  semesters: SemesterState[];
  studentName: string;
  weightedTotal: WeightedTotal;
  unweightedTotal: WeightedTotal | null;
}): TranscriptData {
  const levelLabel = (id: string) => district.levels.find((l) => l.id === id)?.label ?? id;
  return {
    studentName: studentName.trim() || "Student",
    districtName: district.shortName ?? district.name,
    weightedLabel: district.weightedLabel ?? "Weighted GPA",
    unweightedLabel: district.unweighted ? district.unweightedLabel ?? "Unweighted GPA" : null,
    weighted: formatGpa(weightedTotal.gpa),
    unweighted: district.unweighted ? formatGpa(unweightedTotal?.gpa ?? null) : null,
    totalCredits: formatCredits(weightedTotal.credits),
    generatedAt: new Date().toLocaleString(),
    semesters: semesters.map((s) => ({
      label: s.label,
      gpa: formatGpa(creditWeightedAverage(district.weighted, toCredited(s.courses, district)).gpa),
      rows: s.courses
        .filter((c) => c.grade.trim())
        .map((c, i) => ({
          name: c.name.trim() || `Course ${i + 1}`,
          level: levelLabel(c.levelId),
          grade: c.grade,
          credits: formatCredits(creditsForCourse(district, c)),
          points: formatGpa(resolveCoursePoints(district.weighted, c)),
        })),
    })),
  };
}

type ExportFormat = "pdf" | "csv";

function TranscriptExport({
  district,
  semesters,
  studentName,
  onStudentNameChange,
  weightedTotal,
  unweightedTotal,
}: {
  district: District;
  semesters: SemesterState[];
  studentName: string;
  onStudentNameChange: (v: string) => void;
  weightedTotal: WeightedTotal;
  unweightedTotal: WeightedTotal | null;
}) {
  const [pending, setPending] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runExport(format: ExportFormat) {
    setPending(format);
    setError(null);
    try {
      const data = buildTranscriptData({ district, semesters, studentName, weightedTotal, unweightedTotal });
      if (format === "pdf") {
        await exportTranscriptPdf(data);
      } else {
        exportTranscriptCsv(data);
      }
    } catch {
      setError("Something went wrong generating that file — please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-rule">
      <label className="block mb-4">
        <span className="text-sm font-semibold text-ink">Student name (optional, for the export)</span>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          placeholder="Your name"
          className="mt-1.5 w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors"
        />
      </label>

      <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-2 rounded-lg bg-pen/10 border border-pen/25">
        <Icon name="save" className="w-5 h-5 text-pen" />
        <span className="font-bold text-base sm:text-lg text-ink">Exports:</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => runExport("pdf")}
          disabled={pending !== null}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-ink border border-rule bg-paper hover:bg-paper-dim transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          <Icon name="document" className="w-4 h-4 text-pen" />
          {pending === "pdf" ? "Preparing…" : "PDF"}
        </button>
        <button
          type="button"
          onClick={() => runExport("csv")}
          disabled={pending !== null}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-ink border border-rule bg-paper hover:bg-paper-dim transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          <Icon name="table" className="w-4 h-4 text-mint" />
          {pending === "csv" ? "Preparing…" : "CSV"}
        </button>
      </div>

      {error && <p className="text-xs text-rose mt-3">{error}</p>}
    </div>
  );
}

function CumulativeSummaryCard({
  district,
  semesters,
  weightedTotal,
  unweightedTotal,
  priorCredits,
}: {
  district: District;
  semesters: SemesterState[];
  weightedTotal: WeightedTotal;
  unweightedTotal: WeightedTotal | null;
  priorCredits: number;
}) {
  const [studentName, setStudentName] = useState("");
  const weightedScaleMax = maxScalePoints(district.weighted);

  return (
    <div className="border-2 border-pen/30 rounded-xl p-6 bg-paper">
      <p className="course-code text-xs uppercase tracking-wide text-ink-soft mb-1">
        Cumulative {district.weightedLabel ?? "Weighted GPA"}
        {weightedScaleMax !== null && ` · ${weightedScaleMax.toFixed(1)} scale`}
      </p>
      <p className="text-5xl font-display font-black text-ink tabular-nums leading-none mt-3">
        {formatGpa(weightedTotal.gpa)}
      </p>

      <p className="text-sm text-ink-soft mt-3">
        {district.unweighted && (
          <>
            Unweighted equivalent:{" "}
            <span className="font-semibold text-ink">{formatGpa(unweightedTotal?.gpa ?? null)}</span>
            {" · "}
          </>
        )}
        {formatCredits(weightedTotal.credits)} total credits
      </p>

      {priorCredits > 0 && district.unweighted && (
        <p className="text-xs text-ink-soft/70 italic mt-1">
          Unweighted figure reflects courses entered in semesters above only, not your prior-credit total.
        </p>
      )}

      {weightedTotal.gpa === null ? (
        <p className="text-sm text-ink-soft mt-4 italic">
          Add a course in a semester (or your prior GPA below) to see your estimate.
        </p>
      ) : (
        <TranscriptExport
          district={district}
          semesters={semesters}
          studentName={studentName}
          onStudentNameChange={setStudentName}
          weightedTotal={weightedTotal}
          unweightedTotal={unweightedTotal}
        />
      )}

      {district.weighted.kind === "formula" && (
        <p className="text-xs text-ink-soft mt-4 pt-4 border-t border-rule leading-relaxed">
          {district.weighted.resultNote}
        </p>
      )}

      {district.id !== "custom" && district.source.url && (
        <a
          href={district.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-pen hover:text-pen-dim underline decoration-rule hover:decoration-pen underline-offset-4 mt-4"
        >
          Source: {district.source.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}

function TargetPlanner({
  district,
  unweightedTotal,
}: {
  district: District;
  unweightedTotal: WeightedTotal | null;
}) {
  const [targetRaw, setTargetRaw] = useState("");
  const [creditsAheadRaw, setCreditsAheadRaw] = useState("");

  const target = Number(targetRaw);
  const hasTarget = targetRaw.trim() !== "" && Number.isFinite(target);
  const creditsAhead = Number(creditsAheadRaw) || 0;

  const plan =
    district.unweighted && hasTarget
      ? solveRequiredAverage({
          targetGpa: target,
          gpaSoFar: unweightedTotal?.gpa ?? null,
          creditsSoFar: unweightedTotal?.credits ?? 0,
          creditsAhead,
          scale: district.unweighted,
        })
      : null;

  return (
    <div className="border border-rule rounded-xl p-6 bg-paper">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet/10 text-violet shrink-0">
          <Icon name="target" className="w-4 h-4" />
        </span>
        <p className="font-subtitle font-bold text-base text-ink">Grade target planner</p>
      </div>

      {!district.unweighted ? (
        <p className="text-sm text-ink-soft leading-relaxed">
          Your selected scale doesn't publish a separate unweighted GPA, so this planner isn't available here — try
          a listed district, or Custom Scale.
        </p>
      ) : (
        <>
          <label className="block mb-3">
            <span className="course-code text-[0.65rem] uppercase text-ink-soft">
              Target unweighted GPA (4.0 scale)
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={targetRaw}
              onChange={(e) => setTargetRaw(e.target.value)}
              placeholder="e.g. 3.8"
              className="mt-1.5 w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors tabular-nums"
            />
          </label>
          <label className="block mb-4">
            <span className="course-code text-[0.65rem] uppercase text-ink-soft">Credits still ahead of you</span>
            <input
              type="number"
              step="0.5"
              min="0"
              value={creditsAheadRaw}
              onChange={(e) => setCreditsAheadRaw(e.target.value)}
              placeholder="e.g. 6"
              className="mt-1.5 w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors tabular-nums"
            />
          </label>

          <div className="pt-4 border-t border-rule">
            {!hasTarget ? (
              <p className="text-sm text-ink-soft leading-relaxed">
                Enter a target GPA and how many credits you have left to see the average you'll need.
              </p>
            ) : plan?.status === "no-credits-ahead" ? (
              <p className="text-sm text-ink-soft leading-relaxed">
                Enter how many credits you have left to plan for.
              </p>
            ) : plan?.status === "already-there" ? (
              <p className="text-sm text-ink-soft leading-relaxed">
                You're already at or above <span className="font-bold text-ink">{formatGpa(target)}</span>{" "}
                unweighted — any passing average from here keeps you there.
              </p>
            ) : plan?.status === "not-achievable" ? (
              <p className="text-sm text-amber leading-relaxed">
                Not mathematically possible — even a perfect {formatGpa(plan.scaleMax)} average across those credits
                doesn't reach {formatGpa(target)}.
              </p>
            ) : plan?.status === "ok" ? (
              <p className="text-sm text-ink leading-relaxed">
                Average <span className="font-bold text-lg text-pen tabular-nums">{formatGpa(plan.requiredAvg)}</span>
                {plan.letter && <span className="font-bold text-ink"> ({plan.letter})</span>} across those{" "}
                {formatCredits(creditsAhead)} credits and you land on{" "}
                <span className="font-bold text-ink">{formatGpa(target)}</span>.
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export function GpaCalculator() {
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_DISTRICT_ID);
  const [semesters, setSemesters] = useState<SemesterState[]>([]);
  const [gradeMode, setGradeMode] = useState<"letter" | "numeric">("letter");
  const [priorGpaRaw, setPriorGpaRaw] = useState("");
  const [priorCreditsRaw, setPriorCreditsRaw] = useState("");
  const nextSemesterId = useRef(1);
  const nextCourseId = useRef(1);

  const [customWeighted, setCustomWeighted] = useState<TableScale>(() => cloneTable(customScaleTemplate.weighted));
  const [customUnweighted, setCustomUnweighted] = useState<TableScale>(() =>
    cloneTable(customScaleTemplate.unweighted!),
  );

  const district: District | null = useMemo(() => {
    if (!selectedId) return null;
    if (selectedId === "custom") return buildCustomDistrict(customWeighted, customUnweighted);
    return getDistrictById(selectedId) ?? null;
  }, [selectedId, customWeighted, customUnweighted]);

  // Seed a first semester (with one blank course) the first time a district
  // becomes available — covers both the pre-selected default on mount and
  // picking a district for the first time after "Change".
  useEffect(() => {
    if (!district) return;
    setSemesters((prev) => {
      if (prev.length > 0) return prev;
      return [{ id: nextSemesterId.current++, label: "Semester 1", courses: [newCourse(nextCourseId, district)] }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!district]);

  // Course-level ids and grade formats are both district-specific — two
  // districts can coincidentally reuse the same level id (e.g. "on-level")
  // for tiers that don't mean the same thing, and a letter grade like "A"
  // isn't valid input once you switch to a district that grades numerically.
  // Rather than risk a stale row silently pointing at the wrong points,
  // every course row's level and grade reset across every semester on
  // district change — semester/course structure and names carry over.
  useEffect(() => {
    if (!district) return;
    const fallback = defaultLevelId(district.levels);
    setSemesters((prev) =>
      prev.map((s) => ({ ...s, courses: s.courses.map((c) => ({ ...c, levelId: fallback, grade: "" })) })),
    );
    setGradeMode(district.weighted.kind === "table" ? district.gradeInput : "numeric");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district?.id]);

  const letterOptions = useMemo(() => (district ? letterOptionsFor(district.weighted) : []), [district]);
  const canToggleGradeMode = district?.weighted.kind === "table";

  function changeGradeMode(mode: "letter" | "numeric") {
    setGradeMode(mode);
    setSemesters((prev) => prev.map((s) => ({ ...s, courses: s.courses.map((c) => ({ ...c, grade: "" })) })));
  }

  function addSemester() {
    if (!district) return;
    setSemesters((prev) => [
      ...prev,
      {
        id: nextSemesterId.current++,
        label: `Semester ${prev.length + 1}`,
        courses: [newCourse(nextCourseId, district)],
      },
    ]);
  }

  function removeSemester(id: number) {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  }

  // Copies a semester's course list (name, level) onto a brand-new semester
  // appended at the end — grades reset to blank, since a repeated course is
  // unlikely to land the exact same grade in a new term. Credits aren't
  // copied since they're derived from the (now-blank) grade.
  function duplicateSemester(id: number) {
    setSemesters((prev) => {
      const source = prev.find((s) => s.id === id);
      if (!source) return prev;
      const copy: SemesterState = {
        id: nextSemesterId.current++,
        label: `Semester ${prev.length + 1}`,
        courses: source.courses.map((c) => ({
          id: nextCourseId.current++,
          name: c.name,
          levelId: c.levelId,
          grade: "",
        })),
      };
      return [...prev, copy];
    });
  }

  function renameSemester(id: number, label: string) {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
  }

  function addCourse(semesterId: number) {
    if (!district) return;
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semesterId ? { ...s, courses: [...s.courses, newCourse(nextCourseId, district)] } : s,
      ),
    );
  }

  function updateCourse(semesterId: number, courseId: number, patch: Partial<CourseState>) {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semesterId
          ? { ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c)) }
          : s,
      ),
    );
  }

  function removeCourse(semesterId: number, courseId: number) {
    setSemesters((prev) =>
      prev.map((s) => (s.id === semesterId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s)),
    );
  }

  const priorGpaNum = priorGpaRaw.trim() !== "" && Number.isFinite(Number(priorGpaRaw)) ? Number(priorGpaRaw) : null;
  const priorCreditsNum = Number(priorCreditsRaw) || 0;

  const allCoursesRaw = useMemo(() => semesters.flatMap((s) => s.courses), [semesters]);
  const allCoursesWeighted = useMemo(
    () => (district ? toCredited(allCoursesRaw, district) : []),
    [allCoursesRaw, district],
  );
  const allCoursesUnweighted = useMemo(
    () => (district ? toCredited(allCoursesRaw, district, "unweighted") : []),
    [allCoursesRaw, district],
  );

  const weightedTotal = useMemo(
    () =>
      district
        ? cumulativeWithPrior(district.weighted, allCoursesWeighted, priorGpaNum, priorCreditsNum)
        : { gpa: null, credits: 0 },
    [district, allCoursesWeighted, priorGpaNum, priorCreditsNum],
  );
  const unweightedTotal = useMemo(
    () => (district?.unweighted ? creditWeightedAverage(district.unweighted, allCoursesUnweighted) : null),
    [district, allCoursesUnweighted],
  );

  return (
    <article className="space-y-10">
      <section className="max-w-2xl">
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed mb-6">
          Pick a grading scale, add your semesters, and watch your cumulative GPA update as you go — plus a what-if
          planner for exactly what average you'll need to hit a target.
        </p>
        <Callout label="Estimate, not official record" icon="shield">
          This tool calculates from a district's published grading scale, but your school's own transcript is always
          the official source for your real GPA and class rank.
        </Callout>
      </section>

      <section className="max-w-2xl">
        <H2>Grading scale</H2>
        <DistrictPicker selectedId={selectedId} district={district} onSelect={setSelectedId} />

        {selectedId === "custom" && (
          <div className="mt-4">
            <CustomScaleEditor
              weighted={customWeighted}
              unweighted={customUnweighted}
              onChangeWeighted={setCustomWeighted}
              onChangeUnweighted={setCustomUnweighted}
            />
          </div>
        )}

        {canToggleGradeMode && (
          <label className="flex items-center gap-3 mt-5 flex-wrap">
            <span className="text-sm font-semibold text-ink">How grades are recorded</span>
            <select
              value={gradeMode}
              onChange={(e) => changeGradeMode(e.target.value as "letter" | "numeric")}
              className="border border-rule rounded-md px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors"
            >
              <option value="letter">Letter grades (A, B, C…)</option>
              <option value="numeric">Raw numeric average (0–100)</option>
            </select>
          </label>
        )}
      </section>

      {!district ? (
        <div className="border border-dashed border-rule rounded-lg p-8 text-center max-w-2xl">
          <p className="text-ink-soft text-sm">Pick a grading scale above to start adding semesters.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
          <div className="space-y-6 min-w-0">
            <div className="space-y-5">
              {semesters.map((semester) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  district={district}
                  gradeMode={gradeMode}
                  letterOptions={letterOptions}
                  onRename={(label) => renameSemester(semester.id, label)}
                  onRemove={() => removeSemester(semester.id)}
                  canRemove={semesters.length > 1}
                  onDuplicate={() => duplicateSemester(semester.id)}
                  onAddCourse={() => addCourse(semester.id)}
                  onUpdateCourse={(courseId, patch) => updateCourse(semester.id, courseId, patch)}
                  onRemoveCourse={(courseId) => removeCourse(semester.id, courseId)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addSemester}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-pen-solid text-white hover:bg-pen-solid-dim hover:-translate-y-0.5 hover:scale-[1.02] shadow-sm hover:shadow-md transition-all"
            >
              <Icon name="plus" className="w-4 h-4" />
              Add a semester
            </button>

            <section className="pt-4">
              <H2>Cumulative GPA</H2>
              <p className="text-ink-soft text-sm sm:text-base leading-relaxed mb-5">
                Already have a GPA and credit total from before this tool? Enter them here and every semester above
                folds into your running total.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <label className="block">
                  <span className="course-code text-[0.65rem] uppercase text-ink-soft">Current weighted GPA</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priorGpaRaw}
                    onChange={(e) => setPriorGpaRaw(e.target.value)}
                    placeholder="e.g. 4.2"
                    className="mt-1.5 w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors tabular-nums"
                  />
                </label>
                <label className="block">
                  <span className="course-code text-[0.65rem] uppercase text-ink-soft">Total credits earned</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={priorCreditsRaw}
                    onChange={(e) => setPriorCreditsRaw(e.target.value)}
                    placeholder="e.g. 12"
                    className="mt-1.5 w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors tabular-nums"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 self-start">
            <CumulativeSummaryCard
              district={district}
              semesters={semesters}
              weightedTotal={weightedTotal}
              unweightedTotal={unweightedTotal}
              priorCredits={priorCreditsNum}
            />
            <TargetPlanner district={district} unweightedTotal={unweightedTotal} />
          </div>
        </div>
      )}
    </article>
  );
}
