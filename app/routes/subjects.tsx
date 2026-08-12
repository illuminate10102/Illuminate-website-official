import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { Icon } from "../components/Icon";
import { subjects } from "../data/subjects";
import { tierHueStyle } from "../lib/tierStyle";
import { seoTags } from "../lib/seo";

export function meta() {
  const title = "Subjects — Illuminate";
  const description = "Every core subject, broken down into its main courses and AP options.";
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex" },
    ...seoTags({ title, description, path: "/academics/subjects" }),
  ];
}

export default function Subjects() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative bg-chalkboard overflow-hidden">
          <HeroWaves />
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
            <p className="reveal font-mono text-xs uppercase tracking-[0.15em] text-marker mb-6">
              <Link to="/" className="hover:text-chalk transition-colors">
                Illuminate
              </Link>
              <span className="text-chalk-soft mx-2">/</span>
              <Link to="/academics" className="hover:text-chalk transition-colors">
                Academics
              </Link>
              <span className="text-chalk-soft mx-2">/</span>
              Subjects
            </p>
            <h1 className="reveal reveal-1 font-display font-extrabold text-5xl sm:text-6xl text-chalk tracking-tight max-w-2xl">
              Every subject, course by course.
            </h1>
            <p className="reveal reveal-2 text-chalk-soft text-lg leading-relaxed mt-6 max-w-xl">
              Pick a subject below for its main courses and every AP option — jump
              straight to one, or scroll through all five.
            </p>

            <nav className="reveal reveal-3 flex flex-wrap gap-2 mt-10" aria-label="Jump to subject">
              {subjects.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-rule-dark text-chalk-soft hover:text-chalk hover:border-chalk-soft/60 transition-colors text-sm font-semibold"
                >
                  <Icon name={s.icon} className="w-4 h-4" />
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            {subjects.map((subject) => {
              const core = subject.courses.filter((c) => c.kind === "core");
              const ap = subject.courses.filter((c) => c.kind === "ap");
              return (
                <div
                  key={subject.slug}
                  id={subject.slug}
                  className="scroll-mt-24"
                  style={tierHueStyle(subject.hue)}
                >
                  <div className="flex items-center gap-4 mb-10 pb-4 border-b border-rule">
                    <span
                      className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
                      style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                    >
                      <Icon name={subject.icon} className="w-6 h-6" />
                    </span>
                    <h2 className="font-display font-extrabold text-4xl text-ink tracking-tight">
                      {subject.label}
                    </h2>
                  </div>

                  {core.length > 0 && (
                    <div className="mb-12">
                      <p
                        className="course-code text-xs uppercase tracking-[0.15em] mb-6"
                        style={{ color: "var(--tier-accent)" }}
                      >
                        Main courses
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {core.map((course) => (
                          <CourseCard key={course.slug} subjectSlug={subject.slug} course={course} />
                        ))}
                      </div>
                    </div>
                  )}

                  {ap.length > 0 && (
                    <div>
                      <p
                        className="course-code text-xs uppercase tracking-[0.15em] mb-6"
                        style={{ color: "var(--tier-accent)" }}
                      >
                        AP &amp; other
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ap.map((course) => (
                          <CourseCard key={course.slug} subjectSlug={subject.slug} course={course} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({
  subjectSlug,
  course,
}: {
  subjectSlug: string;
  course: { slug: string; title: string; blurb: string; kind: "core" | "ap" };
}) {
  return (
    <Link
      to={`/academics/subjects/${subjectSlug}/${course.slug}`}
      className="stagger-item card-elevate group min-w-0 bg-paper hover:bg-paper-dim border border-rule rounded-lg p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="course-code text-[0.65rem] uppercase tracking-wide rounded-md px-2 py-0.5 border"
          style={{ color: "var(--tier-accent)", borderColor: "var(--tier-accent-border)" }}
        >
          {course.kind === "ap" ? "AP" : "Core"}
        </span>
      </div>
      <h3 className="font-subtitle font-bold text-xl text-ink group-hover:text-[var(--tier-accent)] transition-colors mb-1.5">
        {course.title}
      </h3>
      <p className="text-ink-soft text-sm leading-relaxed">{course.blurb}</p>
    </Link>
  );
}
