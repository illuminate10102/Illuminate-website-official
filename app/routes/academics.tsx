import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { getCategory } from "../data/categories";
import { subjects } from "../data/subjects";
import { Icon } from "../components/Icon";
import { tierHueStyle } from "../lib/tierStyle";
import { seoTags } from "../lib/seo";

const INTRO =
  "GPA strategy, course selection, and how to actually study — plus every subject, broken into its courses.";

export function meta() {
  const title = "Academics — Illuminate";
  return [
    { title },
    { name: "description", content: INTRO },
    ...seoTags({ title, description: INTRO, path: "/academics" }),
  ];
}

export default function AcademicsPage() {
  const category = getCategory("academics");
  if (!category) return null;

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
              {category.label}
            </p>
            <h1 className="reveal reveal-1 font-display font-extrabold text-5xl sm:text-6xl text-chalk tracking-tight max-w-2xl">
              {category.label}
            </h1>
            <p className="reveal reveal-2 text-chalk-soft text-lg leading-relaxed mt-6 max-w-xl">
              {INTRO}
            </p>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {category.tiers.map((tier) => (
              <div key={tier.label} className="reveal" style={tierHueStyle(tier.hue)}>
                <p
                  className="font-mono text-xs uppercase tracking-[0.15em] mb-6"
                  style={{ color: "var(--tier-accent)" }}
                >
                  {tier.label}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tier.fields.map((field) => (
                    <Link
                      key={field.slug}
                      to={`/${category.slug}/${field.slug}`}
                      className="stagger-item card-elevate group min-w-0 bg-paper hover:bg-paper-dim border border-rule rounded-lg p-7 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <span
                          className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                          style={{
                            background: "var(--tier-accent-wash)",
                            color: "var(--tier-accent)",
                          }}
                        >
                          <Icon name={field.icon} className="w-4 h-4" />
                        </span>
                        <span
                          className="course-code text-sm rounded-md px-2 py-0.5 w-fit border"
                          style={{
                            color: "var(--tier-accent)",
                            borderColor: "var(--tier-accent-border)",
                          }}
                        >
                          {field.code}
                        </span>
                      </div>
                      <h3 className="font-subtitle font-bold text-3xl text-ink underline decoration-transparent group-hover:decoration-4 underline-offset-4 transition-colors mb-2 group-hover:text-[var(--tier-accent)] group-hover:decoration-[var(--tier-accent)]">
                        {field.title}
                      </h3>
                      <p className="text-ink-soft text-base leading-relaxed">{field.blurb}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-paper-dim py-20 sm:py-28 border-t border-rule">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
              Beyond the basics
            </p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-ink tracking-tight mb-4 max-w-xl">
              Every subject, course by course.
            </h2>
            <p className="text-ink-soft text-lg max-w-xl mb-14">
              Main courses and every AP option, sorted into the five core
              subjects — for when you already know which class you're asking
              about.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {subjects.map((subject) => (
                <Link
                  key={subject.slug}
                  to={`/academics/subjects#${subject.slug}`}
                  className="stagger-item card-elevate group min-w-0 bg-paper hover:bg-paper-dim border border-rule rounded-lg p-6 flex flex-col items-start"
                  style={tierHueStyle(subject.hue)}
                >
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 mb-4"
                    style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                  >
                    <Icon name={subject.icon} className="w-5 h-5" />
                  </span>
                  <h3 className="font-subtitle font-bold text-xl text-ink group-hover:text-[var(--tier-accent)] transition-colors mb-1">
                    {subject.label}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    {subject.courses.length} courses
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
