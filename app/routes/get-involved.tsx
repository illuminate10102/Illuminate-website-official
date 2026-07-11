import type { Route } from "./+types/get-involved";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChalkUnderline } from "../components/ChalkUnderline";
import { TeamStructure } from "../components/TeamStructure";
import { Icon, iconBadgeClasses, type IconName } from "../components/Icon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Get involved — Illuminate" },
    {
      name: "description",
      content: "Write a guide, tutor a student, or bring Illuminate to your school.",
    },
  ];
}

const ways: { code: string; title: string; desc: string; icon: IconName }[] = [
  {
    code: "01",
    title: "Write a guide",
    desc: "Turn what you already figured out — an essay, a test, a schedule — into a guide someone else can use.",
    icon: "pen-nib",
  },
  {
    code: "02",
    title: "Edit and fact-check",
    desc: "Read drafts, catch mistakes, and keep the advice accurate as deadlines and rules change.",
    icon: "search-check",
  },
  {
    code: "03",
    title: "Tutor or mentor",
    desc: "Answer questions from students a grade or two behind you, one-on-one or in a group.",
    icon: "users",
  },
  {
    code: "04",
    title: "Spread the word",
    desc: "Tell a teacher, a counselor, or a group chat. Most students find us because someone told them.",
    icon: "megaphone",
  },
];

export default function GetInvolved() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-chalkboard">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pt-32 sm:pb-36">
            <h1 className="reveal reveal-1 font-display font-black text-[2.75rem] leading-[0.98] sm:text-[4rem] text-chalk tracking-tight max-w-3xl">
              Get{" "}
              <span className="relative inline-block">
                Involved
                <ChalkUnderline />
              </span>
            </h1>
            <p className="reveal reveal-2 text-chalk-soft text-lg sm:text-xl leading-relaxed mt-10 max-w-xl">
              Illuminate runs on students who are willing to write down what
              they know. No experience required — just something worth
              sharing.
            </p>
          </div>
        </section>

        {/* Temporarily removed — Ways to help section.
        <section className="bg-paper py-24 sm:py-32">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="reveal font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
              Ways to help
            </p>
            <h2 className="reveal reveal-1 font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-16 max-w-xl">
              Pick what fits your time.
            </h2>
            <div className="reveal reveal-2 grid sm:grid-cols-2 gap-6">
              {ways.map((w) => (
                <div
                  key={w.code}
                  className="card-elevate bg-paper hover:bg-paper-dim border border-rule rounded-lg p-7 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${iconBadgeClasses(w.icon)}`}
                    >
                      <Icon name={w.icon} className="w-4 h-4" />
                    </span>
                    <span className="course-code text-sm text-pen border border-pen/30 rounded-md px-2 py-0.5 w-fit">
                      {w.code}
                    </span>
                  </div>
                  <h3 className="font-subtitle font-bold text-3xl text-ink mb-2">{w.title}</h3>
                  <p className="text-ink-soft text-base leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
            <a
              href="mailto:hello@illuminate.org?subject=I%20want%20to%20help"
              className="reveal reveal-3 inline-flex items-center gap-2 mt-12 px-6 py-3.5 bg-pen-solid hover:bg-pen-solid-dim text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Tell us you're in <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
        */}

        <section id="apply" className="bg-paper py-24 sm:py-32 border-t border-rule scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="reveal font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
              Apply for a position
            </p>
            <h2 className="reveal reveal-1 font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-4 max-w-xl">
              Four tiers, one starting point.
            </h2>
            <p className="reveal reveal-2 text-ink-soft text-lg max-w-xl mb-16">
              Pick the tier that fits where you're at. Every director started as a member.
            </p>

            <div className="reveal reveal-3">
              <TeamStructure variant="apply" />
            </div>
          </div>
        </section>

        {/* Temporarily removed — Partner with us section.
        <section id="partner" className="bg-paper-dim py-24 sm:py-32 border-t border-rule scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
                Partner with us
              </p>
              <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-6">
                Bring Illuminate to your school.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-10">
                We work with schools, counseling offices, and other nonprofits
                to get these guides in front of more students — as a linked
                resource, a workshop, or something else that fits what you
                already do. Reach out and tell us what you have in mind.
              </p>
              <a
                href="mailto:hello@illuminate.org?subject=Partnership%20inquiry"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-pen-solid hover:bg-pen-solid-dim text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Start a conversation
              </a>
            </div>
          </div>
        </section>
        */}
      </main>
      <Footer />
    </div>
  );
}
