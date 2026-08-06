import { Link } from "react-router";
import type { Route } from "./+types/meet-the-team";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChalkUnderline } from "../components/ChalkUnderline";
import { DirectorAvatar } from "../components/DirectorAvatar";
import { directors, directorsClosing } from "../data/directors";
import { seoTags } from "../lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Meet the Directors — Illuminate";
  const description = "The founding directors of Illuminate, in their own words.";
  return [
    { title },
    { name: "description", content: description },
    ...seoTags({ title, description, path: "/meet-the-team" }),
  ];
}

export default function MeetTheTeam() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-chalkboard py-20 sm:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/about#meet-the-team"
              className="reveal inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-marker mb-8 hover:text-chalk transition-colors"
            >
              <span aria-hidden="true">←</span> Back to About
            </Link>
            <p className="reveal reveal-1 font-mono text-xs sm:text-sm uppercase tracking-[0.15em] text-marker mb-6">
              The founders
            </p>
            <h1 className="reveal reveal-2 font-display font-black text-[2.75rem] leading-[0.98] sm:text-[4rem] text-chalk tracking-tight max-w-3xl">
              Meet the{" "}
              <span className="relative inline-block">
                directors
                <ChalkUnderline />
              </span>
            </h1>
          </div>
        </section>

        {directors.map((director, i) => (
          <section
            key={director.slug}
            id={director.slug}
            className={`scroll-mt-24 py-20 sm:py-24 border-b border-rule ${
              i % 2 === 0 ? "bg-paper" : "bg-paper-dim"
            }`}
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-5 gap-10 lg:gap-16 items-start ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="lg:col-span-2">
                  <DirectorAvatar
                    name={director.name}
                    photo={director.photo}
                    className="w-full aspect-[4/5] rounded-lg border border-rule card-elevate"
                  />
                  {!director.photo && (
                    <p className="text-ink-soft/60 text-xs mt-3 italic">
                      Photo coming soon.
                    </p>
                  )}
                </div>
                <div className="lg:col-span-3 min-w-0">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-pen mb-3">
                    Director 0{i + 1}
                  </p>
                  <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-ink tracking-tight mb-6">
                    {director.name}
                  </h2>
                  <div className="space-y-5 text-ink-soft text-lg leading-relaxed">
                    {director.story.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>

                  {i === directors.length - 1 && (
                    <div className="mt-10 pt-8 border-t border-rule space-y-5">
                      {directorsClosing.paragraphs.map((paragraph, k) => (
                        <p
                          key={k}
                          className={
                            k === directorsClosing.paragraphs.length - 1
                              ? "font-subtitle font-bold text-2xl text-ink leading-snug"
                              : "text-ink-soft text-lg leading-relaxed"
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
