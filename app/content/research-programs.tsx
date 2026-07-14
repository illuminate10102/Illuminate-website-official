import { useMemo, useState } from "react";
import { researchPrograms } from "../data/researchPrograms";

export const researchProgramsAuthor = "Sarvesh Shanthibooshan Subramanian";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const researchProgramsSources: SourceLink[] = [
  {
    label: "Before you apply",
    note: "Cost, format, and eligibility can change year to year — confirm current details on each program's official page before applying.",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mb-5">
      {children}
    </h2>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-marker/50 bg-marker/10 rounded-lg p-5 mb-5">
      <p className="font-mono text-xs uppercase tracking-wide text-ink mb-2">{label}</p>
      <div className="text-ink text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

const COST_OPTIONS = ["All", "Free", "Paid"] as const;
type CostFilter = (typeof COST_OPTIONS)[number];

const FORMAT_OPTIONS = [
  "All",
  ...Array.from(new Set(researchPrograms.map((p) => p.format))).sort(),
];

const ELIGIBILITY_OPTIONS = [
  "All",
  ...Array.from(new Set(researchPrograms.map((p) => p.eligibility))).sort(),
];

type SortKey = "name" | "field" | "cost" | "format" | "eligibility";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 font-display font-bold text-ink hover:text-pen transition-colors"
    >
      {label}
      <span aria-hidden="true" className={`text-xs ${active ? "text-pen" : "text-ink-soft/40"}`}>
        {active ? (dir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

function ResearchProgramsTable() {
  const [search, setSearch] = useState("");
  const [cost, setCost] = useState<CostFilter>("All");
  const [format, setFormat] = useState("All");
  const [eligibility, setEligibility] = useState("All");
  const [sort, setSort] = useState<SortState>(null);

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = researchPrograms.filter((p) => {
      if (cost !== "All" && !p.cost.startsWith(cost)) return false;
      if (format !== "All" && p.format !== format) return false;
      if (eligibility !== "All" && p.eligibility !== eligibility) return false;
      if (q) {
        const haystack = `${p.name} ${p.field} ${p.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort) {
      const keyMap: Record<SortKey, "name" | "field" | "cost" | "format" | "eligibility"> = {
        name: "name",
        field: "field",
        cost: "cost",
        format: "format",
        eligibility: "eligibility",
      };
      const field = keyMap[sort.key];
      rows = [...rows].sort((a, b) => {
        const cmp = a[field].localeCompare(b[field]);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [search, cost, format, eligibility, sort]);

  const hasActiveFilters = search || cost !== "All" || format !== "All" || eligibility !== "All";

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by program, field, or description…"
          className="flex-1 min-w-[220px] px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={cost}
          onChange={(e) => setCost(e.target.value as CostFilter)}
          className="px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-pen transition-colors"
        >
          {COST_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All costs" : c}
            </option>
          ))}
        </select>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-pen transition-colors"
        >
          {FORMAT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f === "All" ? "All formats" : f}
            </option>
          ))}
        </select>
        <select
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          className="px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-pen transition-colors"
        >
          {ELIGIBILITY_OPTIONS.map((e) => (
            <option key={e} value={e}>
              {e === "All" ? "All eligibility" : e}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCost("All");
              setFormat("All");
              setEligibility("All");
            }}
            className="px-3.5 py-2.5 text-sm font-semibold text-pen hover:text-pen-dim transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <Callout label="How to use this table">
        Click a program's name to open its official page — the application or sign-up page
        where one exists, otherwise the program's homepage.
      </Callout>

      <p className="course-code text-xs text-ink-soft uppercase mb-3">
        Showing {filtered.length} of {researchPrograms.length} programs
      </p>

      {/* Desktop / tablet: table with wrapping cells, so it fills the available width
          instead of forcing a horizontal scroll. */}
      <div className="hidden sm:block overflow-y-auto max-h-[70vh] border border-rule rounded-lg">
        <table className="w-full table-fixed text-sm border-collapse">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Program"
                  active={sort?.key === "name"}
                  dir={sort?.key === "name" ? sort.dir : undefined}
                  onClick={() => toggleSort("name")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Field"
                  active={sort?.key === "field"}
                  dir={sort?.key === "field" ? sort.dir : undefined}
                  onClick={() => toggleSort("field")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Cost"
                  active={sort?.key === "cost"}
                  dir={sort?.key === "cost" ? sort.dir : undefined}
                  onClick={() => toggleSort("cost")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Format"
                  active={sort?.key === "format"}
                  dir={sort?.key === "format" ? sort.dir : undefined}
                  onClick={() => toggleSort("format")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Eligibility"
                  active={sort?.key === "eligibility"}
                  dir={sort?.key === "eligibility" ? sort.dir : undefined}
                  onClick={() => toggleSort("eligibility")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                Quick description
              </th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {filtered.map((p) => (
              <tr key={p.name} className="hover:bg-paper-dim/60 transition-colors">
                <td className="p-4 border-b border-rule align-top font-semibold break-words">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-pen transition-colors underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4"
                    >
                      {p.name} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="text-ink">{p.name}</span>
                  )}
                </td>
                <td className="p-4 border-b border-rule align-top break-words">{p.field}</td>
                <td className="p-4 border-b border-rule align-top break-words">{p.cost}</td>
                <td className="p-4 border-b border-rule align-top break-words">{p.format}</td>
                <td className="p-4 border-b border-rule align-top break-words">
                  {p.eligibility}
                </td>
                <td className="p-4 border-b border-rule align-top break-words">{p.description}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-soft">
                  No programs match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: one card per program instead of a cramped table, so every field
          stays fully readable on a small screen. */}
      <div className="sm:hidden space-y-4 overflow-y-auto max-h-[70vh] pr-1">
        {filtered.map((p) => (
          <div key={p.name} className="border border-rule rounded-lg p-4">
            <p className="font-semibold text-ink mb-2">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-pen transition-colors underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4"
                >
                  {p.name} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                p.name
              )}
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm mb-3">
              <dt className="course-code text-xs uppercase text-ink-soft/70">Field</dt>
              <dd className="text-ink-soft">{p.field}</dd>
              <dt className="course-code text-xs uppercase text-ink-soft/70">Cost</dt>
              <dd className="text-ink-soft">{p.cost}</dd>
              <dt className="course-code text-xs uppercase text-ink-soft/70">Format</dt>
              <dd className="text-ink-soft">{p.format}</dd>
              <dt className="course-code text-xs uppercase text-ink-soft/70">Eligibility</dt>
              <dd className="text-ink-soft">{p.eligibility}</dd>
            </dl>
            <p className="text-ink-soft text-sm leading-relaxed border-t border-rule pt-3">
              {p.description}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-8 text-center text-ink-soft">No programs match those filters.</p>
        )}
      </div>
    </div>
  );
}

export function ResearchProgramsGuide() {
  return (
    <article className="space-y-14">
      <section>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          A list of some of the best summer programs for high school students covering
          science, technology, engineering, mathematics, biomedical sciences, business,
          journalism, creative writing, the arts, law, and the social sciences. The programs
          can be filtered on the basis of cost, type, and eligibility to suit your interests.
        </p>
      </section>

      <section>
        <H2>Personal experience</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Research programs allowed me to pursue subjects that I found truly interesting and
          undertake projects beyond the scope of a regular class assignment. It was amazing
          for me to be able to learn under the guidance of mentors who taught me the process
          of conducting actual research by posing questions, gathering data, and analyzing
          outcomes. Despite the difficulty of the task, it gave me satisfaction and confidence
          to solve the problems on my own. These experiences allowed me to see that high
          school is not only a stage when you study more advanced material but also an
          opportunity to find new interests and useful skills.
        </p>
      </section>

      <section>
        <H2>Programs</H2>
        <ResearchProgramsTable />
      </section>
    </article>
  );
}
