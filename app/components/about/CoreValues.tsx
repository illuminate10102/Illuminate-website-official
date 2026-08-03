import { Icon, type IconName } from "../Icon";
import { StraightUnderline } from "../StraightUnderline";

/**
 * Wording taken verbatim from CoreValues.pdf (the team's own core-values
 * doc) — only formatted into cards here, not reworded.
 */
const values: { title: string; desc: string; icon: IconName; swatch: string; edge: string }[] = [
  {
    title: "Accessibility",
    desc: "We believe every single person, regardless of their background, income or location, deserves equal access to high quality information, resources and guidance, whether it be academic, extracurricular, or career-related. Our goal is to empower students by maximizing their potential with each and every product and service Project Illuminate provides.",
    icon: "globe",
    swatch: "bg-pen/15 text-pen",
    edge: "border-l-pen",
  },
  {
    title: "Credibility",
    desc: "At Illuminate, nothing is written without basis. Whether it's from the experiences and advice of upperclassmen, resources from trusted academic sources, or tips based on district policy, Project Illuminate uses trusted information to provide reliable and credible guidance for everyone. Our content is sourced from credible resources as well as real experiences to produce accurate information to help students navigate their high school journey.",
    icon: "shield",
    swatch: "bg-amber/15 text-amber",
    edge: "border-l-amber",
  },
  {
    title: "Community",
    desc: "Illuminate is built on collaboration. We encourage students to grow in a supportive environment by facilitating collaborative learning and contribution, informative workshops, and shared experiences. The result is an engaging and encouraging community that fosters development and growth academically and socially.",
    icon: "users",
    swatch: "bg-violet/15 text-violet",
    edge: "border-l-violet",
  },
  {
    title: "Compatibility",
    desc: "Our resources are meant to be relevant, informative, functional, and easy to understand so every student can put them to efficient and effective use. We offer a wide variety of products and services to appeal to different types of students and their learning styles.",
    icon: "wrench",
    swatch: "bg-mint/15 text-mint",
    edge: "border-l-mint",
  },
];

export function CoreValues() {
  return (
    <section className="bg-values py-24 sm:py-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mx-auto text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-values-eyebrow mb-4">
            Core values
          </p>
          <h2 className="relative inline-block font-display font-extrabold text-4xl sm:text-5xl text-values-fg tracking-tight">
            What we stand by.
            <StraightUnderline />
          </h2>
        </div>

        <div className="reveal reveal-2 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {values.map((v) => (
            <details
              key={v.title}
              className={`group stagger-item rounded-lg border border-values-edge border-l-4 ${v.edge} bg-values-card overflow-hidden`}
            >
              <summary className="list-none cursor-pointer select-none p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${v.swatch}`}
                  >
                    <Icon name={v.icon} className="w-5 h-5" />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-values-fg-soft shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <h3 className="font-subtitle font-bold text-xl text-values-fg">{v.title}</h3>
              </summary>
              <p className="accordion-content text-values-fg-soft text-sm leading-relaxed px-6 pb-6">{v.desc}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
