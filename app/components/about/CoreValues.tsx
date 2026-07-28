import { Icon, type IconName } from "../Icon";

/**
 * Wording taken verbatim from CoreValues.pdf (the team's own core-values
 * doc) — only formatted into cards here, not reworded.
 */
const values: { title: string; desc: string; icon: IconName; swatch: string }[] = [
  {
    title: "Accessibility",
    desc: "We believe every single person, regardless of their background, income or location, deserves equal access to high quality information, resources and guidance, whether it be academic, extracurricular, or career-related. Our goal is to empower students by maximizing their potential with each and every product and service Project Illuminate provides.",
    icon: "globe",
    swatch: "bg-pen/15 text-pen",
  },
  {
    title: "Credibility",
    desc: "At Illuminate, nothing is written without basis. Whether it's from the experiences and advice of upperclassmen, resources from trusted academic sources, or tips based on district policy, Project Illuminate uses trusted information to provide reliable and credible guidance for everyone. Our content is sourced from credible resources as well as real experiences to produce accurate information to help students navigate their high school journey.",
    icon: "shield",
    swatch: "bg-amber/15 text-amber",
  },
  {
    title: "Community",
    desc: "Illuminate is built on collaboration. We encourage students to grow in a supportive environment by facilitating collaborative learning and contribution, informative workshops, and shared experiences. The result is an engaging and encouraging community that fosters development and growth academically and socially.",
    icon: "users",
    swatch: "bg-violet/15 text-violet",
  },
  {
    title: "Compatibility",
    desc: "Our resources are meant to be relevant, informative, functional, and easy to understand so every student can put them to efficient and effective use. We offer a wide variety of products and services to appeal to different types of students and their learning styles.",
    icon: "wrench",
    swatch: "bg-mint/15 text-mint",
  },
];

export function CoreValues() {
  return (
    <section className="bg-chalkboard py-24 sm:py-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mx-auto text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-marker mb-4">
            Core values
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-chalk tracking-tight">
            What we stand by.
          </h2>
        </div>

        <div className="reveal reveal-2 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="stagger-item rounded-lg border border-rule-dark bg-chalkboard-soft p-6 flex flex-col"
            >
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 mb-5 ${v.swatch}`}
              >
                <Icon name={v.icon} className="w-5 h-5" />
              </span>
              <h3 className="font-subtitle font-bold text-xl text-chalk mb-2">{v.title}</h3>
              <p className="text-chalk-soft text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
