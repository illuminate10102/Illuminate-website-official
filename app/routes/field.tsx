import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { VideoPlaceholder } from "../components/VideoPlaceholder";
import { getField } from "../data/categories";
import { tierHueStyle } from "../lib/tierStyle";
import { Icon, categoryIcon } from "../components/Icon";
import { CreditByExamGuide, creditByExamAuthor, creditByExamSources } from "../content/credit-by-exam";
import { TimeManagementGuide, timeManagementAuthor, timeManagementSources } from "../content/time-management";
import { GpaStrategyGuide, gpaStrategyAuthor, gpaStrategySources } from "../content/gpa-strategy";
import {
  ResearchProgramsGuide,
  researchProgramsAuthor,
  researchProgramsSources,
} from "../content/research-programs";
import { SportsGuide, sportsAuthor, sportsSources } from "../content/sports";
import {
  StudyResourcesGuide,
  studyResourcesAuthor,
  studyResourcesSources,
} from "../content/study-resources";
import {
  MemoryTechniquesGuide,
  memoryTechniquesAuthor,
  memoryTechniquesSources,
} from "../content/memory-techniques";
import { HowToChooseGuide, howToChooseAuthor, howToChooseSources } from "../content/how-to-choose";
import { seoTags, SITE_URL } from "../lib/seo";
import { FeedbackForm } from "../components/content/FeedbackForm";

type SourceLink = { label: string; href?: string; note?: string };

const guides: Record<
  string,
  { Body: React.ComponentType; sources: SourceLink[]; author?: string }
> = {
  "academics/credit-by-exam": {
    Body: CreditByExamGuide,
    sources: creditByExamSources,
    author: creditByExamAuthor,
  },
  "lifestyle/time-management": {
    Body: TimeManagementGuide,
    sources: timeManagementSources,
    author: timeManagementAuthor,
  },
  "academics/gpa-strategy": {
    Body: GpaStrategyGuide,
    sources: gpaStrategySources,
    author: gpaStrategyAuthor,
  },
  "extracurriculars/research": {
    Body: ResearchProgramsGuide,
    sources: researchProgramsSources,
    author: researchProgramsAuthor,
  },
  "extracurriculars/sports": {
    Body: SportsGuide,
    sources: sportsSources,
    author: sportsAuthor,
  },
  "academics/study-resources": {
    Body: StudyResourcesGuide,
    sources: studyResourcesSources,
    author: studyResourcesAuthor,
  },
  "academics/memory-techniques": {
    Body: MemoryTechniquesGuide,
    sources: memoryTechniquesSources,
    author: memoryTechniquesAuthor,
  },
  "college/how-to-choose": {
    Body: HowToChooseGuide,
    sources: howToChooseSources,
    author: howToChooseAuthor,
  },
};

export function meta({ params }: { params: { category?: string; field?: string } }) {
  const result = getField(params.category, params.field);
  if (!result) return [{ title: "Illuminate" }];
  const { category, field } = result;
  const title = `${field.title} — Illuminate`;
  const description = field.blurb;
  const path = `/${category.slug}/${field.slug}`;
  return [
    { title },
    { name: "description", content: description },
    ...seoTags({ title, description, path }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Illuminate", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: category.label, item: `${SITE_URL}/${category.slug}` },
          { "@type": "ListItem", position: 3, name: field.title, item: `${SITE_URL}${path}` },
        ],
      },
    },
  ];
}

export default function FieldPage() {
  const params = useParams();
  const result = getField(params.category, params.field);

  if (!result) {
    return <FieldNotFound />;
  }

  const { category, tier, field } = result;
  const guide = guides[`${category.slug}/${field.slug}`];

  const categoryBadge = (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0"
      style={{
        background: "oklch(0.82 0.1 var(--tier-h, 264) / 16%)",
        color: "var(--tier-accent-chalk)",
      }}
      title={category.label}
    >
      <Icon name={categoryIcon(category.slug)} className="w-4 h-4" />
    </span>
  );

  const breadcrumb = (
    <p className="font-mono text-xs uppercase tracking-[0.15em] text-marker mb-8">
      <Link to="/" className="hover:text-chalk transition-colors">
        Illuminate
      </Link>
      <span className="text-chalk-soft mx-2">/</span>
      <Link to={`/${category.slug}`} className="hover:text-chalk transition-colors">
        {category.label}
      </Link>
    </p>
  );

  if (guide) {
    const { Body, sources, author } = guide;
    return (
      <div
        key={`${category.slug}/${field.slug}`}
        data-no-scroll-reveal
        className="min-h-screen flex flex-col"
        style={tierHueStyle(tier.hue)}
      >
        <Navbar />
        <main className="flex-1">
          <section className="relative bg-chalkboard overflow-hidden">
            <HeroWaves />
            <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    {categoryBadge}
                    {breadcrumb}
                  </div>

                  <span
                    className="course-code text-sm rounded-md px-2 py-0.5 inline-block border"
                    style={{
                      color: "var(--tier-accent-chalk)",
                      borderColor: "var(--tier-accent-chalk-border)",
                    }}
                  >
                    {field.code}
                  </span>

                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-chalk tracking-tight mt-5 mb-4">
                    {field.title}
                  </h1>

                  <p className="text-chalk-soft text-lg leading-relaxed max-w-xl mb-4">
                    {field.blurb}
                  </p>

                  {author && (
                    <p className="course-code text-xs text-chalk-soft uppercase">
                      Written by a student — {author}
                    </p>
                  )}
                </div>

                <VideoPlaceholder />
              </div>
            </div>
          </section>

          <section className="bg-paper py-20 sm:py-28">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-[1fr_320px] gap-16">
                <div className="min-w-0 max-w-[720px]">
                  <Body />

                  <FeedbackForm page={`${field.title} (${category.label})`} />

                  <Link
                    to={`/${category.slug}`}
                    className="inline-flex items-center gap-2 mt-14 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
                  >
                    <span aria-hidden="true">←</span> Back to {category.label}
                  </Link>
                </div>

                <aside className="min-w-0 lg:sticky lg:top-28 self-start">
                  <div className="border border-rule rounded-lg p-6 bg-paper-dim">
                    <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-4">
                      Sources &amp; links
                    </p>
                    <ul className="space-y-5">
                      {sources.map((s) => (
                        <li key={s.href ?? s.label}>
                          {s.href ? (
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ink font-semibold text-sm hover:text-pen transition-colors underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4"
                            >
                              {s.label} <span aria-hidden="true">↗</span>
                            </a>
                          ) : (
                            <span className="text-ink font-semibold text-sm">{s.label}</span>
                          )}
                          {s.note && (
                            <p className="text-ink-soft text-xs leading-relaxed mt-1.5">
                              {s.note}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      key={`${category.slug}/${field.slug}`}
      data-no-scroll-reveal
      className="min-h-screen flex flex-col"
      style={tierHueStyle(tier.hue)}
    >
      <Navbar />
      <main className="flex-1">
        <section className="relative bg-chalkboard overflow-hidden">
          <HeroWaves />
          <div className="relative max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
            <div className="flex items-center gap-3">
              {categoryBadge}
              {breadcrumb}
            </div>

            <span
              className="course-code text-sm rounded-md px-2 py-0.5 inline-block border"
              style={{
                color: "var(--tier-accent-chalk)",
                borderColor: "var(--tier-accent-chalk-border)",
              }}
            >
              {field.code}
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-chalk tracking-tight mt-5 mb-6">
              {field.title}
            </h1>

            <p className="text-chalk-soft text-lg leading-relaxed max-w-xl">{field.blurb}</p>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-rule rounded-lg p-8 bg-paper-dim">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                Coming soon
              </p>
              <p className="text-ink text-base leading-relaxed">
                This guide isn't written yet. We're working through the catalog in order —
                check back soon, or explore another topic below.
              </p>
            </div>

            <Link
              to={`/${category.slug}`}
              className="inline-flex items-center gap-2 mt-12 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
            >
              <span aria-hidden="true">←</span> Back to {category.label}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FieldNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center px-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">404</p>
          <h1 className="font-display font-extrabold text-4xl text-ink mb-4">
            We haven't written this page yet.
          </h1>
          <p className="text-ink-soft mb-8">That guide doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
