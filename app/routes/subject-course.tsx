import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroWaves } from "../components/HeroWaves";
import { Icon } from "../components/Icon";
import { getCourse } from "../data/subjects";
import { tierHueStyle } from "../lib/tierStyle";
import { seoTags } from "../lib/seo";

export function meta({ params }: { params: { subject?: string; course?: string } }) {
  const result = getCourse(params.subject, params.course);
  if (!result) return [{ title: "Illuminate" }];
  const { subject, course } = result;
  const title = `${course.title} — Illuminate`;
  const description = course.blurb;
  const path = `/academics/subjects/${subject.slug}/${course.slug}`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex" },
    ...seoTags({ title, description, path }),
  ];
}

export default function SubjectCoursePage() {
  const params = useParams();
  const result = getCourse(params.subject, params.course);

  if (!result) {
    return <CourseNotFound />;
  }

  const { subject, course } = result;

  return (
    <div
      key={`${subject.slug}/${course.slug}`}
      data-no-scroll-reveal
      className="min-h-screen flex flex-col"
      style={tierHueStyle(subject.hue)}
    >
      <Navbar />
      <main className="flex-1">
        <section className="relative bg-chalkboard overflow-hidden">
          <HeroWaves />
          <div className="relative max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                style={{
                  background: "oklch(0.82 0.1 var(--tier-h, 264) / 16%)",
                  color: "var(--tier-accent-chalk)",
                }}
                title={subject.label}
              >
                <Icon name={subject.icon} className="w-4 h-4" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-marker">
                <Link to="/" className="hover:text-chalk transition-colors">
                  Illuminate
                </Link>
                <span className="text-chalk-soft mx-2">/</span>
                <Link to="/academics/subjects" className="hover:text-chalk transition-colors">
                  Subjects
                </Link>
                <span className="text-chalk-soft mx-2">/</span>
                {subject.label}
              </p>
            </div>

            <span
              className="course-code text-sm rounded-md px-2 py-0.5 inline-block border mt-5"
              style={{
                color: "var(--tier-accent-chalk)",
                borderColor: "var(--tier-accent-chalk-border)",
              }}
            >
              {course.kind === "ap" ? "AP course" : "Core course"}
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-chalk tracking-tight mt-5 mb-6">
              {course.title}
            </h1>

            <p className="text-chalk-soft text-lg leading-relaxed max-w-xl">{course.blurb}</p>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-rule rounded-lg p-8 bg-paper-dim">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                Coming soon
              </p>
              <p className="text-ink text-base leading-relaxed">
                This guide isn't written yet. We're working through the course catalog —
                check back soon, or explore another subject below.
              </p>
            </div>

            <Link
              to={`/academics/subjects#${subject.slug}`}
              className="inline-flex items-center gap-2 mt-12 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
            >
              <span aria-hidden="true">←</span> Back to {subject.label}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CourseNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center px-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">404</p>
          <h1 className="font-display font-extrabold text-4xl text-ink mb-4">
            We haven't written this page yet.
          </h1>
          <p className="text-ink-soft mb-8">That course doesn't exist.</p>
          <Link
            to="/academics/subjects"
            className="inline-flex items-center gap-2 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
          >
            <span aria-hidden="true">←</span> Back to Subjects
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
