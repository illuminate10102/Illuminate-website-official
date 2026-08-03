import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { Callout, H2 } from "../components/content/Prose";
import {
  customScaleTemplate,
  getDistrictById,
  searchDistricts,
  type CourseLevel,
  type District,
  type Scale,
  type TableScale,
} from "../data/gpaDistricts";
import {
  computeUnweightedGpa,
  computeWeightedGpa,
  formatGpa,
  gradeResolves,
  letterOptionsFor,
  resolveBandLetter,
  type CourseInput,
} from "../lib/gpaCalc";

type SourceLink = { label: string; href?: string; note?: string };

// Each district's own source is already surfaced inline in the results panel
// once it's selected (see ResultsPanel below) — a static sidebar duplicating
// a handful of examples added noise without adding information, so this
// guide intentionally has no separate "Sources & links" sidebar.
export const gpaCalculatorSources: SourceLink[] = [];

type CourseState = CourseInput & { id: number; name: string };

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

function DistrictPicker({
  selectedId,
  districtName,
  onSelect,
}: {
  selectedId: string | null;
  districtName: string | null;
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

  if (selectedId) {
    return (
      <div className="flex items-center justify-between gap-4 border border-rule rounded-lg px-4 py-3 bg-paper-dim">
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon name="search-check" className="w-4 h-4 text-pen shrink-0" />
          <span className="font-semibold text-ink truncate">{districtName}</span>
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
                    <span className="text-sm font-semibold text-ink">{d.name}</span>
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

function CourseRow({
  index,
  course,
  levels,
  gradeMode,
  letterOptions,
  weightedScale,
  onChange,
  onRemove,
}: {
  index: number;
  course: CourseState;
  levels: CourseLevel[];
  gradeMode: "letter" | "numeric";
  letterOptions: string[];
  weightedScale: Scale;
  onChange: (patch: Partial<CourseState>) => void;
  onRemove: () => void;
}) {
  const unresolved = !gradeResolves(weightedScale, course);
  // Only relevant in numeric mode — confirms which band a typed number like
  // "97" landed in, since the field itself no longer shows a letter.
  const matchedLetter = gradeMode === "numeric" ? resolveBandLetter(weightedScale, course.grade) : undefined;

  return (
    <div className="border border-rule rounded-lg p-4 bg-paper">
      <div className="flex items-center justify-between mb-3">
        <span className="course-code text-xs text-ink-soft uppercase">Course {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove course ${index + 1}`}
          className="text-ink-soft hover:text-rose transition-colors p-1 -m-1"
        >
          <Icon name="trash" className="w-4 h-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-start">
        <input
          type="text"
          value={course.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Course name (optional)"
          className="min-w-0 border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={course.levelId}
          onChange={(e) => onChange({ levelId: e.target.value })}
          className="border border-rule rounded-md px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors sm:w-52"
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
            className="border border-rule rounded-md px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-pen transition-colors sm:w-24"
          >
            <option value="">Grade</option>
            {letterOptions.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        ) : (
          <div className="sm:w-24">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={course.grade}
              onChange={(e) => onChange({ grade: e.target.value })}
              placeholder="0–100"
              className="w-full border border-rule rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-soft bg-paper focus:outline-none focus:border-pen transition-colors"
            />
            {matchedLetter && <p className="text-xs text-mint mt-1">→ {matchedLetter}</p>}
          </div>
        )}
      </div>
      {unresolved && (
        <p className="text-xs text-amber mt-2">
          This grade isn't counted yet — {gradeMode === "numeric" ? "enter a number from 0–100" : "pick a grade"}.
        </p>
      )}
    </div>
  );
}

function ResultsPanel({ district, courses }: { district: District; courses: CourseState[] }) {
  const weighted = computeWeightedGpa(district, courses);
  const unweighted = district.unweighted ? computeUnweightedGpa(district, courses) : null;
  const filledCourses = courses.filter((c) => c.grade.trim()).length;

  return (
    <div className="border-2 border-pen/20 rounded-xl p-6 sm:p-8 bg-pen/5">
      <p className="course-code text-xs uppercase tracking-wide text-pen mb-5">
        Estimated GPA — {district.name}
      </p>
      <div className="flex flex-wrap gap-x-10 gap-y-6">
        <div>
          <p className="text-4xl sm:text-5xl font-display font-black text-ink tabular-nums leading-none">
            {formatGpa(weighted)}
          </p>
          <p className="text-sm text-ink-soft mt-2">{district.weightedLabel ?? "Weighted GPA"}</p>
        </div>
        {district.unweighted && (
          <div>
            <p className="text-4xl sm:text-5xl font-display font-black text-ink-soft tabular-nums leading-none">
              {formatGpa(unweighted)}
            </p>
            <p className="text-sm text-ink-soft mt-2">{district.unweightedLabel ?? "Unweighted GPA"}</p>
          </div>
        )}
      </div>

      {filledCourses === 0 && (
        <p className="text-sm text-ink-soft mt-5 italic">Add a course above and fill in a grade to see your estimate.</p>
      )}

      {district.weighted.kind === "formula" && (
        <p className="text-xs text-ink-soft mt-5 pt-5 border-t border-rule leading-relaxed">{district.weighted.resultNote}</p>
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

export function GpaCalculator() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseState[]>([]);
  const [gradeMode, setGradeMode] = useState<"letter" | "numeric">("letter");
  const nextId = useRef(1);

  const [customWeighted, setCustomWeighted] = useState<TableScale>(() => cloneTable(customScaleTemplate.weighted));
  const [customUnweighted, setCustomUnweighted] = useState<TableScale>(() =>
    cloneTable(customScaleTemplate.unweighted!),
  );

  const district: District | null = useMemo(() => {
    if (!selectedId) return null;
    if (selectedId === "custom") return buildCustomDistrict(customWeighted, customUnweighted);
    return getDistrictById(selectedId) ?? null;
  }, [selectedId, customWeighted, customUnweighted]);

  // Course-level ids and grade formats are both district-specific — two
  // districts can coincidentally reuse the same level id (e.g. "on-level")
  // for tiers that don't mean the same thing, and a letter grade like "A"
  // isn't valid input once you switch to a district that grades numerically.
  // Rather than risk a stale row silently pointing at the wrong points, or
  // sitting there unresolved, every row's level and grade reset on district
  // change — the course name and row count carry over, everything else asks
  // to be re-entered against the new scale. Grade mode resets to that
  // district's own default too (formula-scale districts have no letters at
  // all, so they always land on "numeric").
  useEffect(() => {
    if (!district) return;
    const fallback = defaultLevelId(district.levels);
    setCourses((prev) => prev.map((c) => ({ ...c, levelId: fallback, grade: "" })));
    setGradeMode(district.weighted.kind === "table" ? district.gradeInput : "numeric");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district?.id]);

  const letterOptions = useMemo(() => (district ? letterOptionsFor(district.weighted) : []), [district]);

  // Every table-scale district's bands carry real min/max ranges as well as
  // letters (see gpaDistricts.ts), so either entry style resolves correctly
  // regardless of which one the district's data defaults to — the toggle
  // just lets a student pick whichever they actually have on hand.
  const canToggleGradeMode = district?.weighted.kind === "table";

  function changeGradeMode(mode: "letter" | "numeric") {
    setGradeMode(mode);
    // A value typed in one mode (e.g. "A") isn't meaningful input for the
    // other mode's widget, so rows clear on switch rather than showing a
    // stale/invalid value.
    setCourses((prev) => prev.map((c) => ({ ...c, grade: "" })));
  }

  function addCourse() {
    if (!district) return;
    setCourses((prev) => [...prev, { id: nextId.current++, name: "", levelId: defaultLevelId(district.levels), grade: "" }]);
  }

  function updateCourse(id: number, patch: Partial<CourseState>) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCourse(id: number) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <article className="space-y-12">
      <section>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed mb-6">
          Pick your school district, add your courses, and see your estimated GPA update as you go — weighted and,
          where your district publishes one, unweighted too.
        </p>
        <Callout label="Estimate, not official record" icon="shield">
          This tool calculates from your district's published grading scale, but your school's own transcript is
          always the official source for your real GPA and class rank.
        </Callout>
      </section>

      <section>
        <H2>1. Choose your district</H2>
        <DistrictPicker selectedId={selectedId} districtName={district?.name ?? null} onSelect={setSelectedId} />

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
      </section>

      {!district ? (
        <div className="border border-dashed border-rule rounded-lg p-8 text-center">
          <p className="text-ink-soft text-sm">Pick your district above to start adding courses.</p>
        </div>
      ) : (
        <>
          <section>
            <H2>2. Add your courses</H2>
            {canToggleGradeMode && (
              <label className="flex items-center gap-3 mb-5 flex-wrap">
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
            {courses.length === 0 ? (
              <p className="text-ink-soft text-sm mb-4">No courses yet — add your first one below.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {courses.map((course, i) => (
                  <CourseRow
                    key={course.id}
                    index={i}
                    course={course}
                    levels={district.levels}
                    gradeMode={gradeMode}
                    letterOptions={letterOptions}
                    weightedScale={district.weighted}
                    onChange={(patch) => updateCourse(course.id, patch)}
                    onRemove={() => removeCourse(course.id)}
                  />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addCourse}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-pen-solid text-white hover:bg-pen-solid-dim hover:-translate-y-0.5 hover:scale-[1.02] shadow-sm hover:shadow-md transition-all"
            >
              <Icon name="plus" className="w-4 h-4" />
              Add Course
            </button>
          </section>

          <section>
            <H2>Your estimated GPA</H2>
            <ResultsPanel district={district} courses={courses} />
          </section>
        </>
      )}
    </article>
  );
}
