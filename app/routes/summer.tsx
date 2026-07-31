import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { Icon, categoryIcon } from "../components/Icon";
import { getCategory } from "../data/categories";
import { tierHueStyle } from "../lib/tierStyle";
import { seoTags } from "../lib/seo";

export function meta() {
  const title = "Summer planning — Illuminate";
  const description =
    "Turn your summer into the strongest part of your story — internships, research, competitions, and honest advice on when to just rest.";
  return [
    { title },
    { name: "description", content: description },
    ...seoTags({ title, description, path: "/summer" }),
  ];
}

export default function SummerPage() {
  const category = getCategory("summer");
  if (!category) return null;
  const [planningTier, buildingTier, ownTimeTier] = category.tiers;

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
                style={{ background: "oklch(0.82 0.1 95 / 16%)", color: "var(--tier-accent-chalk)" }}
              >
                <Icon name={categoryIcon("summer")} className="w-4 h-4" />
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
              While other students sleep in, the most prepared ones are building
              their narrative. Here's how to make every summer count — from 8th
              grade through senior year.
            </p>
          </div>
        </section>

        <section className="bg-paper py-16 sm:py-20 border-b border-rule">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-8 text-center">
              {planningTier.label}
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {planningTier.fields.map((field) => (
                <Link
                  key={field.slug}
                  to={`/summer/${field.slug}`}
                  className="card-elevate group flex items-start gap-4 border border-rule rounded-lg p-5 bg-paper"
                  style={tierHueStyle(planningTier.hue)}
                >
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                    style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                  >
                    <Icon name={field.icon} className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block font-subtitle font-bold text-ink group-hover:text-[var(--tier-accent)] transition-colors">
                      {field.title}
                    </span>
                    <span className="block text-ink-soft text-sm leading-relaxed mt-1">{field.blurb}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3 text-center">
              {buildingTier.label}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight text-center mb-12">
              What to do this summer.
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {buildingTier.fields.map((field) => (
                <Link
                  key={field.slug}
                  to={`/summer/${field.slug}`}
                  className="card-elevate group rounded-xl overflow-hidden border border-rule bg-paper flex flex-col"
                  style={tierHueStyle(buildingTier.hue)}
                >
                  <div className="h-1.5" style={{ background: "var(--tier-accent)" }} aria-hidden="true" />
                  <div className="p-6 flex-1 flex flex-col">
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-full mb-4"
                      style={{ background: "var(--tier-accent-wash)", color: "var(--tier-accent)" }}
                    >
                      <Icon name={field.icon} className="w-4 h-4" />
                    </span>
                    <h3 className="font-subtitle font-bold text-xl text-ink mb-2 group-hover:text-[var(--tier-accent)] transition-colors">
                      {field.title}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed flex-1">{field.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper-dim py-20 sm:py-28 border-t border-rule">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3 text-center">
              {ownTimeTier.label}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight text-center mb-12">
              No program? Make your own.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ownTimeTier.fields.map((field) => (
                <Link
                  key={field.slug}
                  to={`/summer/${field.slug}`}
                  className="card-elevate group border border-rule rounded-lg p-6 bg-paper flex flex-col"
                  style={tierHueStyle(ownTimeTier.hue)}
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
