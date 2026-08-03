import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Callout, H2, H3, checklist, ul } from "../components/content/Prose";
import { internshipPrograms } from "../data/internshipPrograms";
import { annualConferences, recurringEvents } from "../data/houstonConferences";

type SourceLink = { label: string; href?: string; note?: string };

// Every source and every program's own official page is already linked
// inline in the tables below — a separate sidebar would just repeat a
// handful of them out of context, so this guide has no "Sources & links"
// sidebar of its own.
export const internshipsSources: SourceLink[] = [];

function EmailTemplate({ subject, children }: { subject?: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 pl-5 py-1 my-5" style={{ borderColor: "var(--tier-accent)" }}>
      {subject && (
        <p className="course-code text-xs uppercase tracking-wide text-ink-soft mb-3">Subject: {subject}</p>
      )}
      <div className="space-y-3 text-ink text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

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

const CATEGORY_OPTIONS = ["All", "Federal & government", "Corporate", "Houston & Texas", "Remote"] as const;
type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];

type ProgramSortKey = "name" | "category";
type ProgramSortState = { key: ProgramSortKey; dir: "asc" | "desc" } | null;

function ProgramsDirectory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<ProgramSortState>(null);

  function toggleSort(key: ProgramSortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = internshipPrograms.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (q) {
        const haystack = `${p.name} ${p.eligibility} ${p.description} ${p.timing}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort) {
      const key: keyof Pick<(typeof rows)[number], "name" | "category"> = sort.key;
      rows = [...rows].sort((a, b) => {
        const cmp = a[key].localeCompare(b[key]);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [search, category, sort]);

  const hasActiveFilters = search !== "" || category !== "All";

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by program, eligibility, or field…"
          className="flex-1 min-w-[220px] px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
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
        Showing {filtered.length} of {internshipPrograms.length} programs
      </p>

      <div className="hidden sm:block overflow-y-auto max-h-[70vh] border border-rule rounded-lg">
        <table className="w-full table-fixed text-sm border-collapse">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[13%]" />
            <col className="w-[22%]" />
            <col className="w-[27%]" />
            <col className="w-[20%]" />
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
                  label="Category"
                  active={sort?.key === "category"}
                  dir={sort?.key === "category" ? sort.dir : undefined}
                  onClick={() => toggleSort("category")}
                />
              </th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Who's eligible</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">What it is</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Timing</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {filtered.map((p, i) => (
              <tr key={`${p.name}-${i}`} className="hover:bg-paper-dim/60 transition-colors">
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
                <td className="p-4 border-b border-rule align-top break-words">{p.category}</td>
                <td className="p-4 border-b border-rule align-top break-words">{p.eligibility}</td>
                <td className="p-4 border-b border-rule align-top break-words">{p.description}</td>
                <td className="p-4 border-b border-rule align-top break-words">{p.timing}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">
                  No programs match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4 overflow-y-auto max-h-[70vh] pr-1">
        {filtered.map((p, i) => (
          <div key={`${p.name}-${i}`} className="border border-rule rounded-lg p-4">
            <p className="font-semibold text-ink mb-1">
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
            <p className="course-code text-[0.65rem] uppercase text-ink-soft/70 mb-3">{p.category}</p>
            <dl className="space-y-2 text-sm mb-3">
              <div>
                <dt className="course-code text-xs uppercase text-ink-soft/70">Who's eligible</dt>
                <dd className="text-ink-soft">{p.eligibility}</dd>
              </div>
              <div>
                <dt className="course-code text-xs uppercase text-ink-soft/70">Timing</dt>
                <dd className="text-ink-soft">{p.timing}</dd>
              </div>
            </dl>
            <p className="text-ink-soft text-sm leading-relaxed border-t border-rule pt-3">{p.description}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-8 text-center text-ink-soft">No programs match those filters.</p>}
      </div>
    </div>
  );
}

const MONTH_OPTIONS = ["All", ...Array.from(new Set(annualConferences.map((c) => c.month)))];

function ConferenceCalendar() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return annualConferences.filter((c) => {
      if (month !== "All" && c.month !== month) return false;
      if (q) {
        const haystack = `${c.event} ${c.field} ${c.venue} ${c.studentAccess}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, month]);

  const hasActiveFilters = search !== "" || month !== "All";

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by event, field, or venue…"
          className="flex-1 min-w-[220px] px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-pen transition-colors"
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3.5 py-2.5 bg-paper border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-pen transition-colors"
        >
          {MONTH_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m === "All" ? "All months" : m}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setMonth("All");
            }}
            className="px-3.5 py-2.5 text-sm font-semibold text-pen hover:text-pen-dim transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="course-code text-xs text-ink-soft uppercase mb-3">
        Showing {filtered.length} of {annualConferences.length} events
      </p>

      <div className="hidden sm:block overflow-y-auto max-h-[70vh] border border-rule rounded-lg">
        <table className="w-full table-fixed text-sm border-collapse">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[27%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[27%]" />
          </colgroup>
          <thead>
            <tr>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Month</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Event</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Field</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Venue</th>
              <th className="sticky top-0 z-10 bg-paper-dim text-left p-4 border-b border-rule">Student access</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {filtered.map((c, i) => (
              <tr key={`${c.event}-${i}`} className="hover:bg-paper-dim/60 transition-colors">
                <td className="p-4 border-b border-rule align-top font-semibold text-ink break-words">{c.month}</td>
                <td className="p-4 border-b border-rule align-top break-words">{c.event}</td>
                <td className="p-4 border-b border-rule align-top break-words">{c.field}</td>
                <td className="p-4 border-b border-rule align-top break-words">{c.venue}</td>
                <td className="p-4 border-b border-rule align-top break-words">{c.studentAccess}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">
                  No events match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4 overflow-y-auto max-h-[70vh] pr-1">
        {filtered.map((c, i) => (
          <div key={`${c.event}-${i}`} className="border border-rule rounded-lg p-4">
            <p className="course-code text-[0.65rem] uppercase text-ink-soft/70 mb-1">{c.month}</p>
            <p className="font-semibold text-ink mb-2">{c.event}</p>
            <dl className="space-y-2 text-sm mb-3">
              <div>
                <dt className="course-code text-xs uppercase text-ink-soft/70">Field</dt>
                <dd className="text-ink-soft">{c.field}</dd>
              </div>
              <div>
                <dt className="course-code text-xs uppercase text-ink-soft/70">Venue</dt>
                <dd className="text-ink-soft">{c.venue}</dd>
              </div>
            </dl>
            <p className="text-ink-soft text-sm leading-relaxed border-t border-rule pt-3">{c.studentAccess}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-8 text-center text-ink-soft">No events match those filters.</p>}
      </div>
    </div>
  );
}

function PlainTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto border border-rule rounded-lg">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-paper-dim">
            {columns.map((col) => (
              <th key={col} className="text-left font-semibold text-ink p-3 border-b border-rule">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-rule last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`p-3 align-top text-ink-soft ${j === 0 ? "font-semibold text-ink" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MISTAKES: [string, string][] = [
  ["Only applying to companies you've heard of", "Those are the ones with no mechanism to hire you"],
  ["Sending the same email to 40 companies", "Readers spot it instantly. One specific detail per email is the difference between 1% and 10%"],
  ["Emailing info@", "Nobody reads it"],
  ["Giving up after eight emails", "Eight isn't a sample size. Forty is"],
  ["Never following up", "About half of positive responses come from the second or third email"],
  ["Leading with what you want", "Lead with what you noticed and what you can do"],
  ["Waiting until you feel qualified", "You won't get there. Build one small thing, link it, send the email"],
  ["Not writing anything down", "Six months later you'll have no numbers and no examples"],
  ["Treating a no as final", '"Not right now" isn\'t never. Ask to check back in three months, then actually do it'],
];

export function InternshipsGuide() {
  return (
    <article className="space-y-14">
      <section>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Most extracurriculars are things you join. A club has a signup sheet. A summer program has an
            application portal and a decision date.
          </p>
          <p>
            Internships usually have none of that. The ones you'll actually get as a high schooler are mostly
            jobs that didn't exist until you asked for them — some small company had more work than people, a
            student sent a decent email, and they said sure.
          </p>
          <p>
            So if you spend your search filtering job boards for "high school internship," you'll find almost
            nothing and assume nothing is out there. Plenty is. It's just not posted anywhere.
          </p>
        </div>
      </section>

      <section>
        <H2>Before you start</H2>
        <ul className={ul}>
          <li>
            <strong className="text-ink">Big companies mostly can't hire you.</strong> Their internship programs
            are built around college recruiting cycles. A recruiter at a Fortune 500 company isn't rejecting you
            for being unimpressive — they usually have no way to say yes. Insurance, minor labor rules, badge
            access. Don't waste your best effort there.
          </li>
          <li>
            <strong className="text-ink">Small companies can decide in one email.</strong> At a 12 person
            startup, the person reading your email is the person who can hire you. If they've got a pile of data
            nobody has cleaned up and you're free, the math works out fast.
          </li>
          <li>
            <strong className="text-ink">Expect a low hit rate.</strong> Getting responses from 5 to 10 percent
            of cold emails is normal. If you send eight and hear nothing, that isn't proof the strategy failed —
            eight is just too few. Plan on forty.
          </li>
          <li>
            <strong className="text-ink">"Internship" is a loose word.</strong> Part time, remote, project based,
            unpaid, six hours a week during the school year — all of it counts. What matters is that you did
            real work and can say what you produced.
          </li>
        </ul>
      </section>

      <section>
        <H2>Path 1: Cold outreach</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Highest yield method available to you, and almost nobody does it well.
        </p>

        <H3>Build a list first</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Don't write the email yet. Build a list of 40 to 60 companies you'd actually be glad to work for.
          Target 5 to 100 employees — big enough to have real work, small enough that a founder reads their own
          inbox. Where to look:
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink">LinkedIn company search,</strong> filtered by location and headcount.
            Most efficient single tool.
          </li>
          <li>
            <strong className="text-ink">Local startup sites.</strong> In Houston:{" "}
            <a href="https://houston.innovationmap.com" target="_blank" rel="noopener noreferrer" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">InnovationMap</a>,
            the{" "}
            <a href="https://iondistrict.com" target="_blank" rel="noopener noreferrer" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">Ion District</a>{" "}
            tenant list,{" "}
            <a href="https://greentownlabs.com" target="_blank" rel="noopener noreferrer" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">Greentown Labs</a>,{" "}
            <a href="https://thecannon.com" target="_blank" rel="noopener noreferrer" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">The Cannon</a>.
          </li>
          <li>
            <strong className="text-ink">Recent accelerator cohorts.</strong> Companies that just got into an
            accelerator are growing and short staffed, which is exactly when they say yes.
          </li>
          <li>
            <strong className="text-ink">People you already know.</strong> Parents' coworkers, family friends,
            alumni from your school, your coach. Warm intros convert way better than cold ones and most students
            never bother asking.
          </li>
        </ul>

        <H3>Find an actual person</H3>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>Don't email info@ or contact@. Nobody reads those.</p>
          <p>
            At companies under 20 people, go to the founder. At 20 to 100, find a department head who owns the
            kind of work you want. Skip general recruiters unless there's a formal program.
          </p>
          <p>
            Most work emails follow a pattern like firstname@company.com or first.last@company.com. Find one real
            example on their site, then apply the same pattern.
          </p>
        </div>

        <H3>Write something that isn't a favor request</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Most student emails read like charity requests — <em>I'm a student, I want to learn, please give me a
          chance.</em> The reader has to invent a role and supervise you and gets nothing back. Deleted. Flip it:
          you noticed something specific, you're offering something specific, and saying yes is cheap.
        </p>

        <EmailTemplate subject="High school student, offering to help with [specific thing]">
          <p>Hi [Name],</p>
          <p>
            I'm a junior at [School] in [City]. I found [Company] through [where you actually found them] and the
            [specific thing] you're doing with [detail] caught my attention because [one honest sentence].
          </p>
          <p>I've been teaching myself [skill]. I recently [one concrete thing you built or ran]. [Link.]</p>
          <p>
            I'd like to intern with you this [summer/semester], paid or unpaid. I'm not asking you to build a
            program around me. If it's useful, I could start with one project: [something specific and bounded],
            and you can decide from there.
          </p>
          <p>Any chance you'd have 15 minutes? I'm free [two actual time windows].</p>
          <p>Thanks,
            <br />[Name] | [phone] | [LinkedIn] | [portfolio]</p>
        </EmailTemplate>

        <ul className={`${ul} mt-4`}>
          <li>Naming where you found them proves it isn't a mass email — the main thing readers use to decide whether to keep going.</li>
          <li>The concrete project turns "I'm eager to learn" into evidence.</li>
          <li>"Paid or unpaid" kills the budget objection, the most common silent no.</li>
          <li>The bounded first project makes the commitment small and reversible.</li>
          <li>Two specific times means they don't have to do scheduling work.</li>
        </ul>
        <p className="text-ink-soft text-base leading-relaxed mt-4">
          Keep it under 200 words. Write it long, then cut it in half.
        </p>

        <H3>Follow up</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Roughly half of positive responses come from a follow up, not the first email. People aren't ignoring
          you — your email just scrolled off the screen. Day 0, send it. Day 7, two sentences in the same thread
          with one new thing added. Day 21, one sentence, gracious, close the loop. Then stop. Three is the
          limit.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Track it in a spreadsheet so you don't double email someone, and so that when you're forty emails in
          and discouraged you can look at a real response rate instead of a feeling.
        </p>
        <PlainTable
          columns={["Company", "Contact", "Date sent", "FU1", "FU2", "Response", "Notes"]}
          rows={[]}
        />
      </section>

      <section>
        <H2>Path 2: LinkedIn</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">Use it as a relationship tool, not a job board.</p>

        <H3>Fix your profile first</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Nobody replies to a message from an empty profile.
        </p>
        <ul className={ul}>
          <li>Real photo. Plain background, decent light — a phone is fine.</li>
          <li>
            Headline that says what you do, not what you are. "Student" tells a reader nothing. "High school
            student | Python and data analysis | building [thing]" gives them a reason to reply.
          </li>
          <li>Three or four sentences in the About section.</li>
          <li>
            List projects and activities as experience. Robotics team, a research project, a site you built for
            a local business — all legitimate.
          </li>
          <li>Link your GitHub, portfolio, anything that lets someone verify you in one click.</li>
        </ul>

        <H3>Connect before you ask</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Never send a blank connection request to someone you want something from. Use the note. Under 300
          characters, no ask in it.
        </p>
        <EmailTemplate>
          <p>
            Hi [Name], I'm a high school student in [City] interested in [field]. Your post on [specific thing]
            was useful, especially the part about [detail]. Would like to follow your work.
          </p>
        </EmailTemplate>
        <p className="text-ink-soft text-base leading-relaxed">
          Then wait a week or two. Comment on something they post — something real, not "Great post!" By the
          time you message them you're a familiar name.
        </p>

        <H3>Ask for a conversation, not a job</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          The informational interview is the most underused move students have, because it costs the other
          person almost nothing.
        </p>
        <EmailTemplate>
          <p>
            Hi [Name], thanks for connecting. I'm trying to figure out if [field] is the right direction for me
            and you've taken a path I'd like to understand better. Would you have 15 minutes in the next few
            weeks? Mostly want to ask how you got started and what you'd tell someone at my stage.
          </p>
        </EmailTemplate>
        <p className="text-ink-soft text-base leading-relaxed">
          People who'd decline "can I intern for you" say yes to this all the time. On the call, ask good
          questions, listen more than you talk, take notes, and don't pitch yourself. At the end ask one thing:
        </p>
        <EmailTemplate>
          <p>This was helpful. Anyone else you'd suggest I talk to?</p>
        </EmailTemplate>
        <p className="text-ink-soft text-base leading-relaxed">
          That's how one conversation becomes six. Often the person brings up an opportunity themselves, because
          now they know you exist and know what you're looking for. Send a thank you within 24 hours and mention
          something specific they said — most people skip this, and it's what makes you memorable.
        </p>
      </section>

      <section>
        <H2>Path 3: Conferences and events</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            Almost no students do this, which is exactly why it works. Everyone at a conference is there to meet
            strangers — that's the whole point of the event, so the awkwardness that would normally stop you
            doesn't apply. A high schooler who shows up, asks decent questions, and follows up is unusual enough
            that people remember you.
          </p>
          <p>
            Houston is a good city for this. It has about 4.4 million square feet of convention space and hosts
            some of the largest events in the world in energy, medicine, and cybersecurity. If you live here,
            that's an advantage most students never touch.
          </p>
        </div>

        <H3>Getting in cheap</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Full passes to major conferences can run into the thousands. You almost never need one.
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink">Student rates.</strong> Most technical societies (SPE, IEEE, AMPP) have
            discounted student registration. Some require student membership, which is cheap or free. Join
            first, then register.
          </li>
          <li>
            <strong className="text-ink">Expo only passes.</strong> Many big conferences sell a separate, much
            cheaper pass that gets you on the exhibition floor but not into technical sessions. This is the one
            you want — the companies are on the floor, and the companies are where the internships are.
          </li>
          <li>
            <strong className="text-ink">Volunteer.</strong> Conferences run on volunteers at registration desks
            and session doors. Email the organizer six to eight weeks out. Volunteers usually get in free and
            spend the day meeting everyone who walks in.
          </li>
          <li>
            <strong className="text-ink">Free side events.</strong> Big conferences generate happy hours,
            meetups, and pitch nights around them — often better for networking than the main event because
            they're smaller.
          </li>
        </ul>

        <H3>What to actually do</H3>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            <strong className="text-ink">Before:</strong> read the exhibitor list and pick 10 companies to
            visit, weighted toward small and mid size ones — the giant booths are running product demos and
            won't have time for you. Make a simple card with your name, email, and a QR code to your LinkedIn.
            Takes five minutes and beats fumbling with your phone.
          </p>
          <p>
            <strong className="text-ink">During:</strong> go to the small booths. A three person company with a
            card table is thrilled someone stopped. Open with a question about their work — "what does your
            company actually do" is a fine opener and people like answering it. Then be direct: "I'm a high
            school student learning [skill] and looking for an internship this summer. Could I send you an
            email?" The answer is yes more often than you'd think. Write down one specific detail after every
            conversation — you won't remember by evening.
          </p>
          <p>
            <strong className="text-ink">After:</strong> email within 48 hours and mention that detail. This one
            habit puts you ahead of most of the room.
          </p>
        </div>

        <H3>Houston conference calendar</H3>
        <p className="text-ink-soft text-sm italic leading-relaxed mb-4">
          Dates rotate every year. These are the most recently confirmed editions, so treat them as rough timing
          and check the official site before planning anything.
        </p>
        <ConferenceCalendar />

        <Callout label="OTC's high school programming" icon="star">
          Worth calling out separately because almost no major conference does this. OTC runs an{" "}
          <strong>Energy Challenge</strong> that pairs Houston area high school teams with industry mentors to
          solve real engineering problems, with scholarship prizes for the winners. It also runs an{" "}
          <strong>Energy Education Institute</strong> workshop for high schoolers, including access to the
          exhibit floor. Both go through schools, so the way in is usually a science teacher or counselor rather
          than a direct application — ask in the fall, well before the May conference.
        </Callout>

        <H3>Free and recurring</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Start here instead. No ticket, no once-a-year window to miss.
        </p>
        <PlainTable
          columns={["Event", "When", "Field", "Where", "Cost"]}
          rows={recurringEvents.map((e) => [e.event, e.when, e.field, e.where, e.cost])}
        />
        <p className="text-ink-soft text-base leading-relaxed mt-4">
          If you go to one thing on this whole page, make it Cup of Joey. Free, weekly, open to all ages, and
          full of the exact small company founders who can offer you something on the spot. Show up four Fridays
          in a row and you'll get more out of it than attending four different conferences once each.
        </p>
      </section>

      <section>
        <H2>Path 4: Named programs</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Cold outreach is still the highest leverage thing you can do, but these exist and the deadlines are
          published. Four things to know before you dig in:
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink">16 is the real gate.</strong> Most of these require you to be 16 by the
            start date — labor law and insurance, not gatekeeping. If you're 14 or 15, look at Smithsonian,
            MITRE, and Kode With Klossy, and plan to apply broadly the year you turn 16.
          </li>
          <li>
            <strong className="text-ink">Location will disqualify you faster than anything else.</strong> Read
            the eligibility column first. Microsoft's program is open only to students within 50 miles of
            Redmond, Washington or around Atlanta. Meta's is limited to sophomores in four Bay Area
            neighborhoods. NIH generally wants you within 40 miles of the campus.
          </li>
          <li>
            <strong className="text-ink">Summer deadlines cluster in January through March.</strong> Reading
            this in the fall means you're early. Reading it in April means you missed most of this year's, so
            pivot to cold outreach and calendar next year's now.
          </li>
          <li>
            <strong className="text-ink">Check the official page, not a blog post.</strong> Eligibility changes
            — Bank of America Student Leaders below is a good example, and nearly every list online still has it
            wrong. A lot of the sites that rank highest for "high school internships" are companies selling
            their own paid programs, and the articles are written to funnel you there.
          </li>
        </ul>

        <div className="mt-6">
          <ProgramsDirectory />
        </div>

        <Callout label="On paid programs">
          There's a whole industry selling "internships" and "research mentorships" to high schoolers, often for
          thousands of dollars. Some are fine. Many are expensive credentials with not much behind them. Before
          paying anything, ask who supervises the work, what will exist at the end that you made, and whether
          you can talk to someone who did it last year. A project you built yourself for free reads better than
          a purchased placement, and admissions readers can usually tell.
        </Callout>
      </section>

      <section>
        <H2>Logistics</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Boring, but knowing this makes you look easy to hire.
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink">Work permits.</strong> In Texas, 16 and 17 year olds can generally work
            without a state permit or hour limits. Rules are much tighter at 14 and 15, and some employers ask
            for paperwork regardless. Rules vary by state — check your state labor department, and if an
            employer asks for something you don't have, say "I'll get that" instead of "I don't have that."
          </li>
          <li>
            <strong className="text-ink">Paid vs. unpaid.</strong> Unpaid internships at for-profit companies
            are legally limited in the US — the test is roughly whether you or the employer is the main
            beneficiary, meaning an unpaid role needs to be actually educational, not just free labor replacing
            a paid worker. Nonprofits have more room for volunteers. In practice: offering to work unpaid removes
            a real objection and is a fine way to get your first one, but if you're doing full time production
            work for free, something's off. It's completely fine to ask after a month of good work whether the
            role could become paid.
          </li>
          <li>
            <strong className="text-ink">School year internships are underrated.</strong> Everyone fights over
            summer. Far fewer students ask about 6 to 10 hours a week in the fall or spring, which is often
            easier for a small company to absorb. If summer outreach doesn't land, send the same list a
            school-year ask.
          </li>
          <li>
            <strong className="text-ink">Remote counts</strong> and it widens your list enormously. Data,
            research, writing, design, and social media all work remotely.
          </li>
          <li>
            <strong className="text-ink">Be reachable.</strong> Email address that's your name, replies within a
            day, an actual signature, a real voicemail greeting. Small stuff, but together it's the difference
            between reading as a professional and reading as a kid.
          </li>
        </ul>
      </section>

      <section>
        <H2>Once you have one</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Getting it is about half the value. The rest is what you do with it.
        </p>
        <ul className={checklist}>
          <li>
            <strong className="text-ink">Week one, ask what success looks like.</strong> "At the end of this,
            what would make you glad you brought me on?" Most interns never ask, and asking marks you as someone
            who thinks about outcomes.
          </li>
          <li>
            <strong className="text-ink">Keep a Friday log.</strong> What you did, what you produced, any number
            attached. Write it while it's fresh — three months later you won't remember, and this log becomes
            your resume, your college applications, and your recommendation request.
          </li>
          <li>
            <strong className="text-ink">Track numbers, not tasks.</strong> "Helped with marketing" is invisible.
            "Rebuilt the weekly report, cut a four hour manual process to about 20 minutes" gets you the next
            thing.
          </li>
          <li>
            <strong className="text-ink">Ask for more work when you finish early.</strong> This is the thing
            that most reliably turns a one-off internship into an ongoing relationship or a referral.
          </li>
          <li>
            <strong className="text-ink">Learn the business, not just your task.</strong> Ask how they make
            money. Ask what the hardest part of the job is. Sit in on meetings if they'll let you.
          </li>
          <li>
            <strong className="text-ink">Ask for a recommendation letter before you leave,</strong> while the
            work is fresh and you're still someone they see weekly. Send them your log so writing it is easy.
          </li>
          <li>
            <strong className="text-ink">Stay in touch.</strong> A short note every few months keeps a door open
            that otherwise closes by default. Your first supervisor is the person who introduces you to your
            third.
          </li>
        </ul>
      </section>

      <section>
        <H2>Two internships, found in Houston</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            The person who wrote this page currently holds two internships, both found in Houston while still in
            high school: <strong className="text-ink">Imaginex</strong>, an AR/VR company, working as a data
            analyst and on the marketing team; and <strong className="text-ink">iSpatial Technical Solutions</strong>,
            as a data analyst.
          </p>
          <p>A few things in that pattern generalize:</p>
        </div>
        <ul className={`${ul} mt-4`}>
          <li>
            Neither is a company you've heard of. Both are the kind of specialized mid-size technical firm
            Houston is full of, which is exactly why the opening existed — searching "internships near me"
            wouldn't have surfaced either one.
          </li>
          <li>
            One skill opened both doors. Data analysis was the common thread, and it carried across two totally
            different industries. Building one real capability deep enough to be useful on day one beats being
            vaguely familiar with five things.
          </li>
          <li>
            The Imaginex role covers analysis and marketing at the same time — typical of smaller companies, and
            a feature, not a downgrade. You get exposure to functions that would be walled off from an intern at
            a big firm.
          </li>
        </ul>
      </section>

      <section>
        <H2>Common mistakes</H2>
        <PlainTable columns={["Mistake", "Why it costs you"]} rows={MISTAKES} />
      </section>

      <section>
        <H2>Quick-start checklist</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Starting from zero, in order. The first four take a weekend.
        </p>
        <ul className={checklist}>
          <li>Build one thing you can link to — a project, an analysis, a site, a piece of writing. Doesn't have to be impressive, just has to exist.</li>
          <li>Fix your LinkedIn. Photo, real headline, About section, projects, working links.</li>
          <li>Set up a professional email address with a signature.</li>
          <li>Build the list — 40+ companies, 5 to 100 employees, fields you care about.</li>
          <li>Write your template, then cut it in half.</li>
          <li>Send the first ten emails. Ten, not two. Personalize the opening line of each.</li>
          <li>Set follow up reminders for day 7 and day 21.</li>
          <li>Screen the programs directory above for the three or four you're actually eligible for — check age and location first, it takes 30 seconds each.</li>
          <li>Calendar those deadlines with a two week early reminder. Most fall between January and March.</li>
          <li>RSVP to one free event this month — Cup of Joey if you're in Houston.</li>
          <li>Ask three adults you already know if they know anyone in your field. Highest conversion item on this list, takes ten minutes.</li>
          <li>Send ten more emails. Then ten more.</li>
        </ul>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed">
          Related:{" "}
          <Link to="/extracurriculars/research" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">
            Research programs
          </Link>
          ,{" "}
          <Link to="/academics/gpa-strategy" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">
            GPA strategy
          </Link>
          , and{" "}
          <Link to="/academics/credit-by-exam" className="text-pen hover:text-pen-dim underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4">
            Credit by Exam
          </Link>
          .
        </p>
        <p className="text-ink-soft text-xs italic leading-relaxed mt-4">
          Dates and program details change every year. Check the official source before planning around anything
          here.
        </p>
      </section>
    </article>
  );
}
