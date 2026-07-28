import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { Icon, categoryIcon } from "../components/Icon";
import { getCategory } from "../data/categories";
import { tierHueStyle } from "../lib/tierStyle";

export function meta() {
  return [
    { title: "Standardized testing — Illuminate" },
    {
      name: "description",
      content:
        "Clear, anxiety-reducing guides for the SAT, ACT, PSAT, and STAAR — free resources, study plans, and proven strategies.",
    },
  ];
}

/**
 * Fixed (non-adaptive) fill per test — same reasoning as --color-pen-solid:
 * these sit behind white text as a solid block, so they need to stay the
 * same brightness in both themes rather than following --tier-l, which
 * intentionally goes light in dark mode for text/icon use, not fills.
 */
const TEST_META: Record<string, { range: string; rangeLabel: string; fill: string; hue: number }> = {
  sat: { range: "400–1600", rangeLabel: "Score range", fill: "oklch(0.5 0.19 264)", hue: 264 },
  // Hue/fill re-based on the updated palette's Terracotta (was rose's old
  // hue 20) and Sage Green (was mint's old hue 155) accents — see app.css.
  act: { range: "1–36", rangeLabel: "Score range", fill: "oklch(0.53 0.17 35)", hue: 35 },
  psat: { range: "320–1520", rangeLabel: "Score range", fill: "oklch(0.48 0.09 165)", hue: 165 },
  staar: { range: "Approaches → Masters", rangeLabel: "Score bands", fill: "oklch(0.6 0.17 55)", hue: 55 },
};

export default function TestingPage() {
  const category = getCategory("testing");
  if (!category) return null;
  const [testsTier, resourcesTier] = category.tiers;
  const transferField = resourcesTier.fields.find((f) => f.slug === "transfer-pathways");
  const otherResourceFields = resourcesTier.fields.filter((f) => f.slug !== "transfer-pathways");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative bg-chalkboard overflow-hidden">
          <HeroWaves />
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                style={{ background: "oklch(0.82 0.1 264 / 16%)", color: "var(--tier-accent-chalk)" }}
              >
                <Icon name={categoryIcon("testing")} className="w-4 h-4" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-marker">
                <Link to="/" className="hover:text-chalk transition-colors">
                  Illuminate
                </Link>
                <span className="text-chalk-soft mx-2">/</span>
                {category.label}
              </p>
            </div>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-chalk tracking-tight max-w-2xl">
              {category.label}
            </h1>
            <p className="text-chalk-soft text-lg sm:text-xl leading-relaxed mt-6 max-w-xl">
              Clear, anxiety-reducing guides for every major standardized test. Free
              resources, study plans, and proven strategies — no expensive prep
              courses needed.
            </p>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3 text-center">
              {testsTier.label}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight text-center mb-14">
              Pick your test. Get a plan.
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 mb-20">
              {testsTier.fields.map((field) => {
                const meta = TEST_META[field.slug];
                return (
                  <Link
                    key={field.slug}
                    to={`/testing/${field.slug}`}
                    className="card-elevate group rounded-xl overflow-hidden border border-rule bg-paper flex flex-col"
                    style={tierHueStyle(meta?.hue ?? testsTier.hue)}
                  >
                    <div className="p-6 flex items-start justify-between gap-4" style={{ background: meta?.fill }}>
                      <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                        {field.title}
                      </span>
                      {meta && (
                        <span className="text-right shrink-0">
                          <span className="block text-[0.65rem] uppercase tracking-wide text-white/75">
                            {meta.rangeLabel}
                          </span>
                          <span className="course-code text-sm font-bold text-white">{meta.range}</span>
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-ink-soft text-sm leading-relaxed mb-5 flex-1">{field.blurb}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-[var(--tier-accent)] transition-colors">
                        Full {field.title} guide <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-rule pt-16">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3 text-center">
                {resourcesTier.label}
              </p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight text-center mb-12">
                Prep without the price tag.
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {otherResourceFields.map((field) => (
                  <Link
                    key={field.slug}
                    to={`/testing/${field.slug}`}
                    className="card-elevate group border border-rule rounded-lg p-6 bg-paper flex flex-col"
                    style={tierHueStyle(resourcesTier.hue)}
                  >
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-full mb-4"
                      style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                    >
                      <Icon name={field.icon} className="w-4 h-4" />
                    </span>
                    <h3 className="font-subtitle font-bold text-lg text-ink mb-1.5 group-hover:text-[var(--tier-accent)] transition-colors">
                      {field.title}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed">{field.blurb}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {transferField && (
          <section className="bg-paper-dim py-20 sm:py-28 border-t border-rule">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl" style={tierHueStyle(resourcesTier.hue)}>
                <p
                  className="font-mono text-xs uppercase tracking-[0.15em] mb-3"
                  style={{ color: "var(--tier-accent)" }}
                >
                  Community college routes
                </p>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                  {transferField.title}
                </h2>
                <p className="text-ink-soft text-lg leading-relaxed mb-8">{transferField.blurb}</p>
                <Link
                  to={`/testing/${transferField.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-white font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ background: "var(--tier-accent)" }}
                >
                  Read the guide <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
