import { RoleIcon } from "./RoleIcon";
import { Icon, type IconName } from "./Icon";
import { APPLICATION_FORM_URL } from "./TeamStructure";

/**
 * Full role-by-role breakdown for the Get Involved page, sourced from the
 * team's own Hierarchy.pdf. Wording is preserved exactly as written there;
 * only spacing/punctuation artifacts from the PDF export and section
 * titles/formatting are cleaned up for the web.
 */

const accent: Record<
  string,
  { badge: string; ring: string; text: string; wash: string; header: string; edge: string }
> = {
  directors: {
    badge: "bg-pen-solid text-white",
    ring: "border-pen/30",
    text: "text-pen",
    wash: "bg-pen/8",
    header: "bg-pen/7 group-open:bg-pen/12 hover:bg-pen/12",
    edge: "border-l-pen-solid",
  },
  "vice-presidents": {
    // Uses the adaptive rose token, not chalkboard — chalkboard is a fixed
    // dark-navy value in both themes (by design, for surfaces that must
    // always read dark, like solid badges), so using it as flowing text
    // color read as invisible dark-on-dark once the page background itself
    // went dark in dark mode.
    badge: "bg-rose text-white",
    ring: "border-rose/35",
    text: "text-rose",
    wash: "bg-rose/8",
    header: "bg-rose/8 group-open:bg-rose/14 hover:bg-rose/14",
    edge: "border-l-rose",
  },
  officers: {
    badge: "bg-marker text-ink-solid",
    ring: "border-marker/40",
    text: "text-marker-dim",
    wash: "bg-marker/10",
    header: "bg-marker/10 group-open:bg-marker/16 hover:bg-marker/16",
    edge: "border-l-marker",
  },
  associates: {
    badge: "bg-mint text-white",
    ring: "border-mint/35",
    text: "text-mint",
    wash: "bg-mint/8",
    header: "bg-mint/8 group-open:bg-mint/14 hover:bg-mint/14",
    edge: "border-l-mint",
  },
  members: {
    badge: "bg-violet text-white",
    ring: "border-violet/35",
    text: "text-violet",
    wash: "bg-violet/8",
    header: "bg-violet/8 group-open:bg-violet/14 hover:bg-violet/14",
    edge: "border-l-violet",
  },
};

function ApplyLink({ slug, label }: { slug: string; label: string }) {
  const a = accent[slug];
  return (
    <a
      href={APPLICATION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] transition-all ${a.badge}`}
    >
      Apply as {label} <span aria-hidden="true">→</span>
    </a>
  );
}

/** Colored, no-clutter wrapper for a role's lead paragraph(s). */
function IntroCard({ slug, children }: { slug: string; children: React.ReactNode }) {
  const a = accent[slug];
  return <div className={`rounded-lg border ${a.ring} p-5 sm:p-6 space-y-3 ${a.wash}`}>{children}</div>;
}

/** Nudges first-time visitors that the summary row is interactive; hides itself once opened. */
function ExpandHint({ slug }: { slug: string }) {
  const a = accent[slug];
  return (
    <span
      className={`hidden sm:inline-flex items-center gap-1 course-code text-[0.65rem] uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 group-open:hidden ${a.wash} ${a.text}`}
    >
      Tap to expand
    </span>
  );
}

function NumberedList({ items, slug }: { items: string[]; slug: string }) {
  const a = accent[slug];
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-ink-soft text-sm sm:text-base leading-relaxed">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${a.wash} ${a.text}`}
          >
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Misconceptions({ items, slug }: { items: string[]; slug: string }) {
  const a = accent[slug];
  return (
    <div className={`rounded-lg border ${a.ring} ${a.wash} p-5`}>
      <p className={`font-mono text-xs font-semibold uppercase tracking-wide ${a.text} mb-3`}>
        Common misconceptions
      </p>
      <ul className={`list-disc pl-5 space-y-3 marker:${a.text}`}>
        {items.map((item, i) => (
          <li key={i} className="text-ink-soft text-sm leading-relaxed pl-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoleSection({
  slug,
  title,
  children,
  defaultOpen = false,
}: {
  slug: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const a = accent[slug];
  return (
    <details
      open={defaultOpen}
      className={`group card-elevate border border-rule border-l-4 ${a.edge} rounded-lg bg-paper overflow-hidden`}
    >
      <summary
        className={`list-none cursor-pointer select-none flex items-center gap-4 p-5 sm:p-6 transition-colors duration-200 ${a.header}`}
      >
        <span className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 ${a.badge}`}>
          <RoleIcon slug={slug} className="w-5 h-5" />
        </span>
        <h3 className="font-subtitle font-bold text-xl sm:text-2xl text-ink flex-1">{title}</h3>
        <ExpandHint slug={slug} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-ink-soft shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="accordion-content px-5 sm:px-6 pb-6 sm:pb-7 pt-4 space-y-6 border-t border-rule">
        {children}
      </div>
    </details>
  );
}

const directors = [
  "Nidhish Kakkireni",
  "Arnav Joshi",
  "Dhruv Nandy",
  "Sarvesh Shanthibooshan Subramanian",
  "Vinh Tran",
  
];

const deptAccent: Record<string, { border: string; wash: string; text: string }> = {
  violet: { border: "border-violet/30", wash: "bg-violet/6", text: "text-violet" },
  amber: { border: "border-amber/30", wash: "bg-amber/6", text: "text-amber" },
  mint: { border: "border-mint/30", wash: "bg-mint/6", text: "text-mint" },
  pen: { border: "border-pen/30", wash: "bg-pen/6", text: "text-pen" },
};

const vpDepartments: {
  title: string;
  status: string;
  body: string;
  color: keyof typeof deptAccent;
  icon: IconName;
}[] = [
  {
    title: "Social Media Vice President",
    status: "Filled",
    body: "The Social Media Vice President manages the social media of Illuminate. Their main responsibilities include: posting videos, updates about changes, teasers, and broadcasting important events to our online audience.",
    color: "violet",
    icon: "megaphone",
  },
  {
    title: "Visual Media Vice President",
    status: "Filled",
    body: "The Visual Media Vice President manages the visual aspect of Illuminate. This can include videos both in and out of the website and pictures during in-person events.",
    color: "amber",
    icon: "camera",
  },
  {
    title: "Outreach Vice President",
    status: "Open!",
    body: "The Outreach Vice President manages the expansion of Illuminate. This individual actively advocates for Project Illuminate’s mission- recruiting potential candidates, managing expansion, and spreading awareness to a larger audience.",
    color: "mint",
    icon: "network",
  },
  {
    title: "Website Vice President",
    status: "Filled",
    body: "The Website Vice President helps the directors build and maintain the website. They make sure that articles are being uploaded timely, technical issues are being solved, and features are working properly.",
    color: "pen",
    icon: "wrench",
  },
];

export function HierarchyDetails() {
  return (
    <div className="space-y-5">
      <RoleSection slug="directors" title="Directors" defaultOpen>
        <IntroCard slug="directors">
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            We are the founders of this Nonprofit. We appoint tasks, coordinate potential
            and lead the hierarchy holistically, ensuring that everyone has a voice within
            the organization. Secondly, we take in the suggestions, ideas, and issues that
            may arise while being part of the organization. Additionally, we manage the
            external affairs of the nonprofit. These include funding, marketing, and
            holding the non-profit status of Illuminate. Lastly, we orchestrate the process
            in which people are appointed through interviews, forms, and discussion.
          </p>
        </IntroCard>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-pen mb-3">
            As of now, the directors of Illuminate are as follows
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {directors.map((name) => (
              <li key={name} className="flex items-center gap-2.5 text-ink text-sm sm:text-base">
                <span className="w-1.5 h-1.5 rounded-full bg-pen shrink-0" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </RoleSection>

      <RoleSection slug="vice-presidents" title="Vice Presidents (VPs)">
        <IntroCard slug="vice-presidents">
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Illuminate runs on different departments working together that manage the
            organization. The Vice President's responsibility is to lead one of these
            departments. The departments are as follows:
          </p>
        </IntroCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {vpDepartments.map((d) => {
            const da = deptAccent[d.color];
            return (
              <div key={d.title} className={`border ${da.border} rounded-lg p-4 ${da.wash}`}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 bg-paper ${da.text}`}
                    >
                      <Icon name={d.icon} className="w-3.5 h-3.5" />
                    </span>
                    <p className={`font-subtitle font-bold text-sm sm:text-base ${da.text}`}>{d.title}</p>
                  </div>
                  <span
                    className={`course-code text-[0.65rem] uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      d.status === "Filled"
                        ? "bg-ink-soft/10 text-ink-soft"
                        : "bg-mint/15 text-mint"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-ink-soft text-xs sm:text-sm leading-relaxed">{d.body}</p>
              </div>
            );
          })}
        </div>
        <p className="text-ink-soft text-xs italic">Note: New roles might be added in the future.</p>
        <Misconceptions
          slug="vice-presidents"
          items={[
            "Vice Presidents are NOT Officers, meaning they do not manage content within the website (sole exception is the website VP). Instead, they lead departments of Illuminate (as specified above).",
            "Vice Presidents aren't the next level of Officers. Vice Presidents have a special expertise within their designated department. For instance, the website VP might have the special skill of programming. On the other hand, officers use their expertise and experience in a subsection like Arts and Performance.",
          ]}
        />
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-rose mb-3">Responsibilities</p>
          <NumberedList
            slug="vice-presidents"
            items={[
              "Vice presidents must actively connect with the directors, officers, and other vice presidents to guarantee the completion of tasks.",
              "Vice Presidents must do their best to complete their tasks on time while also matching the outline specified by the directors.",
              "Vice presidents have to try to offer their expertise that can add to the articles created by the associates.",
            ]}
          />
        </div>
        <ApplyLink slug="vice-presidents" label="a Vice President" />
      </RoleSection>

      <RoleSection slug="officers" title="Officers">
        <IntroCard slug="officers">
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Officers have a substantial role in this organization. They serve as the leads
            for each subsection of the six fields. For instance, within the Extracurriculars
            field, an officer may lead the subsection of Arts and Performance. The officers
            are responsible for overseeing the associates who write the articles of each
            subsection. Lastly, Officers offer their expertise and experience to the
            associates, where the associates put it into words.
          </p>
        </IntroCard>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-marker-dim mb-3">Responsibilities</p>
          <NumberedList
            slug="officers"
            items={[
              "Must lead the associates in their designated subsection.",
              "They must actively update and communicate with the VPs and Directors on their associates' progress.",
              "They must offer their advice and expertise to the associates in order to produce quality articles that effectively help readers.",
              "They are responsible for making sure that their assignments (for themselves and the associates) are completed on time.",
              "They must also actively assist the directors and associates in managing events. (This is not extremely strict, and volunteer hours will be provided.)",
            ]}
          />
        </div>
        <Misconceptions
          slug="officers"
          items={[
            "Officers are not Vice Presidents, meaning that they don't lead a department of the non-profit which contributes to the organization as a whole. Instead, they serve as leaders within their subsections in the website to guide the associates as they write their articles.",
            "Officers don't earn their position automatically, they start off by writing content as an associate. Consequently, they climb their way to being a leader based on the special leadership traits, and expertise within their content. The promotion is decided by the directors through a holistic process.",
          ]}
        />
        <ApplyLink slug="officers" label="an Officer" />
      </RoleSection>

      <RoleSection slug="associates" title="Associates">
        <IntroCard slug="associates">
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Associates are the backbone of Project Illuminate. They use their knowledge and
            experience to write and create content for their desired subsection.
          </p>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed border-l-2 border-mint/40 pl-4 italic">
            For example, an SAT expert can write article(s) and research, review, and list
            related resources on their SAT prep content page.
          </p>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            The specific checklist for each article will be provided once the associate is
            accepted (shared through a folder). Associates must be able to portray what the
            officers are attempting to create. Their writing must be detailed, credible, and
            easy to understand.
          </p>

          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Associates earn volunteer hours by contributing to their content pages and/or helping the nonprofit in other ways (e.g. webinars, in-school chapters, etc.)
          </p>
        </IntroCard>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-mint mb-3">Responsibilities</p>
          <NumberedList
            slug="associates"
            items={[
              "They must have strong communication with Vice Presidents, Officers, and Directors.",
              "They must follow most, if not all, of the requirements listed in the checklist.",
              "They must be able to complete their assignments within their deadlines (which are mostly flexible).",
              "They should be able to put themselves in the reader's shoes and understand the issue at hand.",
            ]}
          />
        </div>
        <ApplyLink slug="associates" label="an Associate" />
      </RoleSection>

      <RoleSection slug="members" title="Members">
        <IntroCard slug="members">
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            All these efforts of coordination, quality information, and  specialized expertise are meant for the members. They can access the information free of cost and use it to better their academic pursuits. There is no specific path or application to become a member as most of our information is open source.
          </p>
        </IntroCard>
      </RoleSection>
    </div>
  );
}
