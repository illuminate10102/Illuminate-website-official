import { Link } from "react-router";

const points = [
  {
    tag: "1",
    title: "Narrative",
    desc: "From classes to extracurriculars, we guide you throughout your high school journey to help shape your college narrative.",
    swatch: "bg-pen/10 text-pen",
  },
  {
    tag: "2",
    title: "Students",
    desc: "We offer real-world experience from experts throughout all fields. These include successful students, high school/college alumni, and more who provide accurate and credible information for all to use.",
    swatch: "bg-violet/10 text-violet",
  },
  {
    tag: "3",
    title: "Free of Cost, Full Of Form",
    desc: "While other educational services are locked behind paywalls, we give quality guidance and information for completely free.",
    swatch: "bg-mint/10 text-mint",
  },
  {
    tag: "4",
    title: "Functional",
    desc: "We structure our website to make accessibility a priority. Content is organized clearly and thoughtfully to make the learning process easier.",
    swatch: "bg-amber/10 text-amber",
  },
];

export default function WhyIlluminate() {
  return (
    <section className="bg-paper-dim py-24 sm:py-32 border-y border-rule">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
            Why Illuminate
          </p>
          <h2 className="reveal reveal-1 font-display font-extrabold text-6xl sm:text-7xl text-ink tracking-tight mb-8">
            The gap isn't information.{" "}
            <span className="marker-stroke">It's access.</span>
          </h2>
          <p className="reveal reveal-2 text-ink-soft text-xl sm:text-2xl leading-relaxed mb-16 mx-auto">
            Most students don't struggle because the advice doesn't exist —
            it's scattered across forums, paywalled, or locked behind a
            $200/hr counselor. Illuminate puts it in one place, organized
            and ready to use.
          </p>
        </div>

        <dl className="reveal reveal-3 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((p) => (
            <div
              key={p.tag}
              className="rounded-lg p-8 text-center bg-paper border border-rule shadow-sm"
            >
              <dt
                className={`course-code inline-flex items-center justify-center w-9 h-9 rounded-full text-sm mb-4 ${p.swatch}`}
              >
                {p.tag}
              </dt>
              <dd>
                <p className="font-subtitle font-bold text-2xl text-ink mb-2">
                  {p.title}
                </p>
                <p className="text-ink-soft text-base leading-relaxed">
                  {p.desc}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="text-center mt-16">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
          >
            Read our story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
