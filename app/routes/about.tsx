import { Link } from "react-router";
import type { Route } from "./+types/about";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChalkUnderline } from "../components/ChalkUnderline";
import { TeamStructure } from "../components/TeamStructure";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About — Illuminate" },
    {
      name: "description",
      content: "Why a group of students started Illuminate, and who keeps it running.",
    },
  ];
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative bg-chalkboard overflow-hidden">
          {/* Mobile: photo and title stack in normal flow so the text never
              sits on top of (and hides) faces in the photo. Desktop keeps
              the original full-bleed photo with text overlaid on top. */}
          <img
            src="/about-group-photo.jpg"
            alt=""
            aria-hidden="true"
            className="relative w-full aspect-[4/3] object-cover sm:absolute sm:inset-0 sm:aspect-auto sm:h-full sm:object-[center_20%] opacity-100 sm:opacity-70"
          />
          <div className="hidden sm:block absolute inset-0 bg-chalkboard/55" />
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-64 sm:pb-36">
            <p className="reveal font-mono text-xs sm:text-sm uppercase tracking-[0.15em] text-marker mb-8">
              About us
            </p>
            <h1 className="reveal reveal-1 font-display font-black text-[2.75rem] leading-[0.98] sm:text-[4rem] text-chalk tracking-tight max-w-3xl">
              We built the{" "}
              <span className="relative inline-block">
                guide
                <ChalkUnderline />
              </span>{" "}
              we wished we had.
            </h1>
            <p className="reveal reveal-2 text-chalk-soft text-lg sm:text-xl leading-relaxed mt-10 max-w-xl">
              A few of us went through the college process with no counselor,
              no plan, and way too many browser tabs. Illuminate is everything
              we figured out, written down for the next kid doing this alone.
            </p>
          </div>
        </section>

        <section className="bg-paper py-24 sm:py-32">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="reveal">
              <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-8">
                How it Started
              </h2>
            </div>
            <div className="reveal reveal-1 space-y-6 text-ink-soft text-xl leading-relaxed">
              <p>
                We can all agree that high school can be confusing at times. 
                From course selection to extracurriculars, or study strategies to time management, many aspects of high school are hard to navigate.  
                Having personally gone through this pain, we decided to create a platform to guide students throughout their high school journey.
              </p>
              <p>
                Thus, the idea of Project Illuminate was born. Six Cinco Ranch students, Arnav, Dhruv, Nidhish, Sarvesh, Henry, and Vinh, sought to end this lingering issue that affects many aspiring students nationwide.
              </p>
              <p>
                After constant calls, meetings, and discussions, we brought Project Illuminate to life. With the help of officers, associates, and members, we built a platform that brings together resources, information, and community.
              </p>
            </div>
          </div>
        </section>

        <section id="team" className="bg-paper-dim py-24 sm:py-32 border-y border-rule scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="reveal font-mono text-xs uppercase tracking-[0.15em] text-pen mb-4">
              Our structure
            </p>
            <h2 className="reveal reveal-1 font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-4 max-w-xl">
              How Illuminate is organized
            </h2>
            

            <div className="reveal reveal-3">
              <TeamStructure variant="info" />
            </div>

            <p className="text-ink-soft mt-12 max-w-xl">
              Want in? See{" "}
              <Link
                to="/get-involved"
                className="font-semibold text-ink border-b-2 border-pen hover:text-pen transition-colors"
              >
                how to get involved
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
