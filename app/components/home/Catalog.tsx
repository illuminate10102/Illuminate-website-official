import { Link } from "react-router";
import { Icon, categoryIcon, iconBadgeClasses } from "../Icon";

const sections = [
  {
    code: "EC",
    label: "Extracurriculars",
    href: "/extracurriculars",
    desc: "Find activities that match your major and build a story that holds together.",
    count: "20+ guides",
  },
  {
    code: "AC",
    label: "Academics",
    href: "/academics",
    desc: "Raise your GPA, pick the right APs, and study with a plan instead of panic.",
    count: "18 guides",
  },
  {
    code: "ST",
    label: "Standardized testing",
    href: "/testing",
    desc: "SAT, ACT, and PSAT prep, explained without the jargon.",
    count: "8 guides",
  },
  {
    code: "LF",
    label: "Lifestyle",
    href: "/lifestyle",
    desc: "Time management, mental health, and the habits that keep you from burning out.",
    count: "16 guides",
  },
  {
    code: "CO",
    label: "College",
    href: "/college",
    desc: "Applications, essays, financial aid, and scholarships, explained plainly.",
    count: "9 guides",
  },
  {
    code: "SP",
    label: "Summer planning",
    href: "/summer",
    desc: "Turn your summer into the strongest part of your story.",
    count: "10 guides",
  },
];

export default function Catalog() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3">
              
            </p>
            <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight">
              The 6 fields of High School. 
            </h2>
          </div>
          
        </div>

        <div className="reveal reveal-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.code}
              to={s.href}
              className="stagger-item card-elevate group bg-paper hover:bg-paper-dim border border-rule rounded-lg p-7 flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${iconBadgeClasses(categoryIcon(s.href.slice(1)))}`}
                  >
                    <Icon name={categoryIcon(s.href.slice(1))} className="w-5 h-5" />
                  </span>
                  <span className="course-code text-sm text-pen border border-pen/30 rounded-md px-2 py-0.5">
                    {s.code}
                  </span>
                </div>
                <span className="course-code text-[0.65rem] text-ink-soft uppercase">
                  {s.count}
                </span>
              </div>
              <h3 className="font-subtitle font-bold text-3xl text-ink group-hover:text-[var(--field-title-hover)] underline decoration-transparent group-hover:decoration-[var(--field-underline-hover)] decoration-4 underline-offset-4 transition-colors mb-2">
                {s.label}
              </h3>
              <p className="text-ink-soft text-base leading-relaxed">
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
