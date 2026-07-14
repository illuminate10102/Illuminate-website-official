import { useMemo, useState } from "react";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const studyResourcesAuthor = "Henry Nguyen";

export const studyResourcesSources: SourceLink[] = [
  {
    label: "thea.study",
    href: "https://thea.study/",
    note: "Extra study resource link mentioned below — not used as a source for this guide.",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mb-5">
      {children}
    </h2>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <>
      <div className="hidden sm:block overflow-x-auto border border-rule rounded-lg">
        <table className="w-full table-fixed text-sm border-collapse">
          <thead>
            <tr className="bg-paper-dim">
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left font-display font-bold text-ink p-4 border-b border-rule"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-paper-dim/60 transition-colors">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`p-4 border-b border-rule align-top break-words ${
                      j === 0 ? "font-semibold text-ink" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="border border-rule rounded-lg p-4">
            <p className="font-semibold text-ink mb-2">{row[0]}</p>
            <dl className="space-y-2 text-sm">
              {row.slice(1).map((cell, j) => (
                <div key={j}>
                  <dt className="course-code text-xs uppercase text-ink-soft/70">
                    {columns[j + 1]}
                  </dt>
                  <dd className="text-ink-soft mt-0.5">{cell}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

type StudyResource = { resource: string; category: string; description: string };

const studyResourcesData: StudyResource[] = [
  { resource: "Khan Academy", category: "Website", description: "Free lessons, videos, and practice for math, science, history, AP courses, and SAT prep." },
  { resource: "College Board AP Classroom", category: "Website", description: "Official AP videos, progress checks, and practice exams." },
  { resource: "Fiveable", category: "Website", description: "AP study guides, cram sessions, and practice questions." },
  { resource: "Albert.io", category: "Website", description: "AP-level practice questions with detailed explanations." },
  { resource: "Quizlet", category: "Study Tool", description: "Flashcards, games, quizzes, and study sets for every subject." },
  { resource: "Anki", category: "Study Tool", description: "Uses spaced repetition to improve long-term memory." },
  { resource: "Knowt", category: "Study Tool", description: "Notes, flashcards, quizzes, explanations, MCQ, FRQ practice" },
  { resource: "CK-12 Foundation", category: "Website", description: "Free digital textbooks, simulations, and interactive lessons." },
  { resource: "OpenStax", category: "Website", description: "College-level textbooks available for free." },
  { resource: "Desmos", category: "Math Tool", description: "Interactive graphing calculator for Algebra and Calculus." },
  { resource: "GeoGebra", category: "Math Tool", description: "Dynamic software for graphing, geometry, and algebra." },
  { resource: "Wolfram Alpha", category: "Math Tool", description: "Solves math problems with step-by-step explanations." },
  { resource: "Symbolab", category: "Math Tool", description: "Step-by-step solutions for algebra, trigonometry, and calculus." },
  { resource: "Grammarly", category: "Writing Tool", description: "Checks grammar, spelling, and writing clarity." },
  { resource: "Purdue OWL", category: "Writing Tool", description: "Trusted resource for essays, MLA, APA, and grammar." },
  { resource: "SparkNotes", category: "English", description: "Literature summaries, themes, and character analysis." },
  { resource: "LitCharts", category: "English", description: "Detailed literature guides with quotes and themes." },
  { resource: "Google Docs", category: "Productivity", description: "Organize notes and collaborate on assignments." },
  { resource: "Notion", category: "Productivity", description: "Organize notes, homework, calendars, and study plans." },
  { resource: "Forest", category: "Productivity", description: "Focus timer that helps reduce phone distractions." },
  { resource: "Pomofocus", category: "Productivity", description: "Free Pomodoro timer for effective study sessions." },
  { resource: "Heimler's History", category: "YouTube", description: "Best for AP histories like AP World, APUSH, AP Gov, and AP Euro review, as well as explaining DBQs, SAQs, LEQs, and MCQ writing and strategies." },
  { resource: "Jacob Clifford", category: "YouTube", description: "The top resource for AP Macroeconomics, AP Microeconomics, and personal finance." },
  { resource: "Mr. Sinn", category: "YouTube", description: "Excellent AP Psychology, AP Human Geography reviews, vocab, FRQs, and unit summaries." },
  { resource: "Amoeba Sisters", category: "YouTube", description: "Fun animations that simplify Biology and AP Biology concepts." },
  { resource: "Bozeman Science", category: "YouTube", description: "Detailed science lessons for Biology, Chemistry, Physics, and Environmental Science." },
  { resource: "Organic Chemistry Tutor", category: "YouTube", description: "Clear step-by-step explanations for Math, Chemistry, and Physics." },
  { resource: "Tyler DeWitt", category: "YouTube", description: "Makes chemistry concepts easy to understand." },
  { resource: "Flipping Physics", category: "YouTube", description: "Comprehensive AP Physics lessons and problem solving." },
  { resource: "Professor Dave Explains", category: "YouTube", description: "Covers science and math topics from beginner to advanced." },
  { resource: "Crash Course", category: "YouTube", description: "Fast-paced videos on history, economics, psychology, literature, and science." },
  { resource: "3Blue1Brown", category: "YouTube", description: "Beautiful visual explanations of higher-level math concepts." },
  { resource: "MinutePhysics", category: "YouTube", description: "Short videos explaining physics concepts intuitively." },
  { resource: "Veritasium", category: "YouTube", description: "Science experiments and real-world applications of scientific ideas." },
  { resource: "TED-Ed", category: "YouTube", description: "Animated educational videos across many school subjects." },
  { resource: "Science with Susanna", category: "YouTube", description: "AP Biology review, practice questions, and exam preparation." },
  { resource: "Freesciencelessons", category: "YouTube", description: "Straightforward Biology, Chemistry, and Physics lessons." },
  { resource: "Simple History", category: "YouTube", description: "Animated history videos covering important events and civilizations." },
  { resource: "Oversimplified", category: "YouTube", description: "Humorous history animations that make learning memorable." },
  { resource: "Crash Course Study Skills", category: "YouTube", description: "Teaches note-taking, memory, productivity, and study strategies." },
  { resource: "Gohar Khan", category: "YouTube", description: "Study tips, productivity, college admissions, and learning techniques." },
  { resource: "Garden of English", category: "YouTube", description: "AP English Language and Literature writing and analysis help." },
  { resource: "Marco Learning", category: "YouTube", description: "AP exam reviews, FRQs, scoring guides, and test strategies." },
  { resource: "Princeton Review", category: "YouTube", description: "SAT, ACT, and AP preparation with test-taking strategies." },
  { resource: "Kaplan Test Prep", category: "YouTube", description: "Standardized test prep, study skills, and AP review videos." },
];

const CATEGORY_OPTIONS = [
  "All",
  ...Array.from(new Set(studyResourcesData.map((r) => r.category))).sort(),
];

type SortKey = "resource" | "category";
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

function StudyResourcesTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
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
    let rows = studyResourcesData.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (q) {
        const haystack = `${r.resource} ${r.category} ${r.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = a[sort.key].localeCompare(b[sort.key]);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [search, category, sort]);

  const hasActiveFilters = search || category !== "All";

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by resource, category, or description…"
          className="flex-1 min-w-[220px] px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-pen transition-colors"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="px-3.5 py-2.5 text-sm font-semibold text-pen hover:text-pen-dim transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="course-code text-xs text-ink-soft uppercase mb-3">
        Showing {filtered.length} of {studyResourcesData.length} resources
      </p>

      <div className="hidden sm:block overflow-auto max-h-[70vh] border border-rule rounded-lg">
        <table className="w-full table-fixed text-sm border-collapse">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[18%]" />
            <col className="w-[58%]" />
          </colgroup>
          <thead>
            <tr>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Resource"
                  active={sort?.key === "resource"}
                  dir={sort?.key === "resource" ? sort.dir : undefined}
                  onClick={() => toggleSort("resource")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                <SortButton
                  label="Category"
                  active={sort?.key === "category"}
                  dir={sort?.key === "category" ? sort.dir : undefined}
                  onClick={() => toggleSort("category")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">
                Short Description
              </th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {filtered.map((r) => (
              <tr key={r.resource} className="hover:bg-paper-dim/60 transition-colors">
                <td className="p-4 border-b border-rule align-top font-semibold text-ink break-words">
                  {r.resource}
                </td>
                <td className="p-4 border-b border-rule align-top break-words">{r.category}</td>
                <td className="p-4 border-b border-rule align-top break-words">{r.description}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-ink-soft">
                  No resources match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4 overflow-y-auto max-h-[70vh] pr-1">
        {filtered.map((r) => (
          <div key={r.resource} className="border border-rule rounded-lg p-4">
            <p className="font-semibold text-ink mb-2">{r.resource}</p>
            <dl className="space-y-2 text-sm mb-3">
              <dt className="course-code text-xs uppercase text-ink-soft/70">Category</dt>
              <dd className="text-ink-soft mt-0.5">{r.category}</dd>
            </dl>
            <p className="text-ink-soft text-sm leading-relaxed border-t border-rule pt-3">
              {r.description}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-8 text-center text-ink-soft">No resources match those filters.</p>
        )}
      </div>
    </div>
  );
}

const resourcesPerClassRows: string[][] = [
  ["AP Human Geography", "Khan Academy, Fiveable, AP Classroom"],
  ["KAP/AP Biology", "Amoeba Sisters, Bozeman Science, Science with Susanna, Khan Academy"],
  ["AP Physics", "Flipping Physics, Organic Chemistry Tutor, Bozeman Science, Khan Academy"],
  ["Chemistry", "Tyler DeWitt, Organic Chemistry Tutor, Professor Dave Explains"],
  [
    "Math",
    "Khan Academy, Organic Chemistry Tutor, 3Blue1Brown, Desmos, Symbolab, Mario's Math tutoring, Eddie Woo, Mr H Tutoring, Brian McLogan",
  ],
  ["AP History", "Heimler's History, Crash Course, Simple History, Oversimplified"],
  ["AP Economics", "Jacob Clifford, Khan Academy, AP Classroom"],
  ["English", "Garden of English, Purdue OWL, Grammarly, LitCharts"],
  [
    "SAT/ACT",
    "Khan Academy, Princeton Review, Gohar Khan, Crackd, CookSAT, or in-person test prep, e.g., Testmasters, but can be expensive",
  ],
  ["Study Skills", "Crash Course Study Skills, Forest, Pomofocus, Anki, Notion"],
];

const exampleRoutinesRows: string[][] = [
  ["Quiz (MCQ)", "20–30 questions", "35–45 min", "45–60 min", "Understand concepts and practice questions."],
  ["Quiz (FRQ)", "1–3 FRQs", "35–45 min", "45–60 min", "Practice writing and reviewing scoring guidelines."],
  ["Test", "30–60 questions", "1 hr 30 min", "2–3 hours", "Master all units, vocabulary, and practice problems."],
  [
    "Unit Exam (AP/KAP)",
    "50–70 questions + FRQ",
    "2–3 hours",
    "3–4 hours",
    "Combine review, practice tests, and error analysis.",
  ],
  [
    "Final Exam",
    "Multiple Units",
    "4–8 hours (over several days)",
    "1–2 weeks of review",
    "Comprehensive review of every unit.",
  ],
];

const stagesOfStudyRows: string[][] = [
  [
    "Pre-Study (Before Class)",
    "Learn the basics before the teacher introduces them.",
    "Khan Academy, Heimler, Mr. Sinn, Amoeba Sisters, Flipping Physics",
    "Watch one lesson (10–20 min), then take brief notes so class feels like a review instead of new material.",
  ],
  [
    "After School Practice",
    "Reinforce what you learned the same day.",
    "AP Classroom, Albert.io, Quizlet, Knowt, Desmos, Symbolab",
    "Complete practice questions, review mistakes, and make flashcards for new vocabulary.",
  ],
  [
    "Understanding Difficult Topics",
    "Learn concepts from a different explanation.",
    "Organic Chemistry Tutor, Bozeman Science, Professor Dave, Tyler DeWitt, 3Blue1Brown",
    "Watch the specific lesson you're struggling with and pause to solve examples before continuing.",
  ],
  [
    "Cramming (Night Before)",
    "Refresh important concepts quickly.",
    "Fiveable, Heimler Review Videos, Mr. Sinn Unit Reviews, Quizlet, Knowt",
    "Review summary guides, vocabulary, and complete one practice quiz. Avoid learning brand-new material.",
  ],
  [
    "Exam Day Review (10–30 min)",
    "Recall key information before the test.",
    "Flashcards, Knowt, Quizlet, Your Notes",
    "Review formulas, vocabulary, diagrams, and common mistakes only.",
  ],
];

const satActRows: string[][] = [
  [
    "TestMasters",
    "In-Person & Online",
    "Highly regarded Texas-based SAT/ACT prep with experienced instructors, high-level instruction, and realistic practice tests",
  ],
  ["Princeton Review", "Online & In-Person", "Comprehensive SAT and ACT courses, tutoring, and practice exams."],
  ["Kaplan Test Prep", "Online & In-Person", "Offers self-paced courses, live classes, tutoring, and extensive question banks."],
  ["PrepScholar", "Online", "Personalized SAT and ACT prep program that adapts to student performance."],
  [
    "Schoolhouse.world",
    "Free Online",
    "Free SAT tutoring sessions led by volunteer peer tutors in partnership with Khan Academy.",
  ],
  ["UWorld", "Online", "Excellent SAT practice questions with detailed answer explanations."],
  [
    "Bluebook",
    "Free SAT Provided by College Board",
    "An excellent free SAT mock test that provided the same environment as the real test",
  ],
];

export function StudyResourcesGuide() {
  return (
    <article className="space-y-14">
      <section>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            We've all heard the same phrase: "Make sure you study!" Yet, teachers often never
            tell us how to study or where to study, leaving students to fend for themselves,
            struggling and losing valuable time as the test tomorrow approaches closer and
            closer.
          </p>
          <p>
            On this page, we have put together a list of resources we've found useful in our
            studying, helping us and many other students achieve A's in class and 5's on AP
            exams.
          </p>
          <p>
            Of course, there <em>are</em> other resources scattered around the internet.
            However, these resources have been proven to help <em>thousands</em> of students,
            and ourselves, too.
          </p>
          <p>
            There are thousands of educational websites and YouTube channels available online,
            but not all of them are equally effective. The resources below have consistently
            helped students improve their understanding, earn higher grades, and score well on
            AP exams as well as standardized tests like the SAT. Whether you're trying to learn
            a new concept, review before an exam, or find extra practice, these are excellent
            places to start.
          </p>
        </div>
      </section>

      <section>
        <H2>Study resources</H2>
        <StudyResourcesTable />
      </section>

      <section>
        <H2>Resources per class</H2>
        <DataTable columns={["Subject", "Recommended Resources"]} rows={resourcesPerClassRows} />
      </section>

      <section>
        <H2>Example routines when studying for quizzes/tests</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Different types of assessment require different amounts of time spent on
          preparation. These recommendations can help you avoid rushing, last-minute cramming,
          while still giving yourself enough time to understand the material
        </p>
        <DataTable
          columns={["Assessment", "Typical Length", "Minimum Study Time", "Ideal Study Time", "Goal"]}
          rows={exampleRoutinesRows}
        />
      </section>

      <section>
        <H2>Stages of study</H2>
        <DataTable
          columns={["Stage", "Purpose", "Best Resources", "How to Use It"]}
          rows={stagesOfStudyRows}
        />
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          SAT & ACT are very important and vital in order to get to college. These provided
          resources contain practice tests, personalized instructions, and preparation
          tutoring. While some of these can be expensive, it is worth the price to direct
          students for competitive colleges.
        </p>
        <DataTable columns={["Resource", "Type", "Description"]} rows={satActRows} />
        <p className="text-ink-soft text-sm mt-6">
          Links: thea.study (not a source, extra study resouce link)
        </p>
      </section>
    </article>
  );
}
