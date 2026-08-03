import { Callout, H2, ul } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const howToChooseAuthor = "Dia Vimal Talari";

export const howToChooseSources: SourceLink[] = [
  { label: "College Board" },
  { label: "U.S. Department of Education" },
  { label: "NCES" },
  { label: "Official college admissions websites" },
];

export function HowToChooseGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Choosing a college is one of the hardest decisions you'll make in school, not just
          because of the necessary steps to get there, but knowing how to follow the right path.
          With thousands of colleges, and endless rankings and majors, it's easy to get mixed up
          in so much advice, and end up choosing what is best based on others, not you.{" "}
          <strong className="text-ink font-semibold">
            The truth is, there is no such thing as a perfect college, just what's a perfect fit
            for you;
          </strong>{" "}
          And that is exactly what college prep will help achieve: A college that fits{" "}
          <strong className="text-ink font-semibold">YOUR</strong> goals, interests, learning
          style, and budget. This guide will help you focus on what actually matters so you can
          make the decision that you spent 12 years working towards.
        </p>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            When I first started researching colleges, I had no idea where to begin. I assumed
            the process was simply about finding the most prestigious school I could possibly
            get into. As I started exploring more and more colleges, I quickly realized that
            choosing a college is much more personal and requires thought and intake of
            different priorities — whether it's a specific major, affordability, campus culture,
            people, location, research opportunities, or career outcomes. Once I shifted from
            believing others to believing myself and my goals, I had the chance to grow more
            academically and personally.
          </p>
          <p>
            One advice I would give to every student starting this journey is to choose the
            place where you can envision yourself growing and learning and thriving;{" "}
            <strong className="text-ink font-semibold">
              becoming the person you want to be is far more important than what others believe
              you to be.
            </strong>
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>
        <div className="space-y-8">
          <div>
            <p className="text-ink-soft text-base sm:text-lg leading-relaxed mb-4">
              Before researching colleges, spend time learning about yourself. Ask questions
              such as:
            </p>
            <ul className={ul}>
              <li>What subjects do I enjoy the most?</li>
              <li>Do I have a career or major in mind?</li>
              <li>Would I want to stay close to home or go international?</li>
              <li>What kind of campus culture would help me succeed?</li>
              <li>What is my budget range and do I have any scholarships?</li>
            </ul>
          </div>

          <div>
            <p className="text-ink-soft text-base sm:text-lg leading-relaxed mb-4">
              Academics are a major factor, but have you thought about factors such as:
            </p>
            <ul className={ul}>
              <li>Student Organizations</li>
              <li>Campus traditions</li>
              <li>Housing options</li>
              <li>Diversity and Inclusion</li>
              <li>Campus safety</li>
              <li>Recreation and clubs</li>
            </ul>
          </div>

          <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
            If you have the opportunity, visit campuses or attend virtual tours. Statistics are
            great, but reality is more part of your own story. Walk through campuses, speak with
            current students, and attend information sessions displayed by them to figure out
            which college is the right fit.
          </p>

          <Callout label="Tip" icon="lightbulb">
            Instead of asking "Can I get accepted here?" think about personal growth and the
            ability to achieve higher things after college. Think about your job and future
            achievements. Think about personal growth and beyond. These are the dreams that will
            be achieved when you choose what's right for you.
          </Callout>
        </div>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Choose a college that is fit for you not only based on academics, but based on future
          visions and dreams. Take time to understand your goals, research your options, compare
          colleges thoughtfully, and consider academic and personal factors before making your
          decision.{" "}
          <strong className="text-ink font-semibold">
            A college should help you grow, and thrive, not eliminate your possibilities.
          </strong>
        </p>
      </section>
    </article>
  );
}
