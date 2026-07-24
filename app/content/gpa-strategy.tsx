import { H2, H3, ul } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const gpaStrategyAuthor = "Arman Richhariya";

export const gpaStrategySources: SourceLink[] = [
  {
    label: "U.S. News — What a good college GPA is and why it matters",
    href: "https://www.usnews.com/education/best-colleges/articles/what-a-good-college-gpa-is-and-why-it-matters",
  },
  {
    label: "UChicago Consortium — Predictive Power of Ninth Grade (PDF)",
    href: "https://consortium.uchicago.edu/sites/default/files/2018-10/Predictive%20Power%20of%20Ninth-Grade-Sept%202017-Consortium.pdf",
  },
  {
    label: "PrepExpert — How to Improve Your GPA",
    href: "https://prepexpert.com/how-to-improve-your-gpa/",
  },
];

export function GpaStrategyGuide() {
  return (
    <article className="space-y-14">
      <section>
        <p className="course-code text-xs uppercase tracking-wide text-marker mb-6">
          Simplified summary down below!
        </p>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          While various factors can cause your Grade Point Average (GPA) to fluctuate,
          mastering a few key strategies can help you build and maintain a highly competitive
          academic record. Below is a breakdown of how the GPA system works and the best
          techniques for maximizing your score.
        </p>
      </section>

      <section>
        <H2>1. Course Selection: The Foundation of Your GPA</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Your course selection is your top priority. High school classes are generally
          divided into different tiers of rigor. Most schools use a 5.0 point scale with
          typically 3 tiers of courses in their respective hierarchy.
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Academic (ACA) / Standard Classes:</strong>{" "}
            These are the foundational courses and have the easiest workload, though you can
            only obtain a maximum of 4.0 points if you earn an A (90–100).
          </li>
          <li>
            <strong className="text-ink font-semibold">KAP / Honors Classes:</strong> These
            intermediate courses require more effort and faster pacing. Because of the
            increased rigor you can obtain a maximum of 5.0 points if you earn an A (90–100).
          </li>
          <li>
            <strong className="text-ink font-semibold">Advanced Placement (AP) Classes:</strong>{" "}
            This is the highest tier of coursework in this hierarchy. This is due to the fact
            that not only do AP classes use a 5.0 point scale, but they also prepare you for
            the AP Exams in May. Scoring a 3 or higher (on a 1–5 scale) can earn you college
            credit and demonstrate to universities that you are capable of college-level
            work.
          </li>
        </ul>
      </section>

      <section>
        <H2>2. Grades: How the Math Works</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          A's do not always yield the same GPA points and are determined by what type of
          courses you take. A display is provided below for better understanding.
        </p>
        <div className="overflow-x-auto border border-rule rounded-lg">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-paper-dim">
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  Letter Grade
                </th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  Number Grade
                </th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  5.0 Scale (Honors/AP)
                </th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  4.0 Scale (Standard/ACA)
                </th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              <tr>
                <td className="p-4 border-b border-rule align-top font-semibold text-ink">A</td>
                <td className="p-4 border-b border-rule align-top">90–100</td>
                <td className="p-4 border-b border-rule align-top">5 Points</td>
                <td className="p-4 border-b border-rule align-top">4 Points</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-rule align-top font-semibold text-ink">B</td>
                <td className="p-4 border-b border-rule align-top">80–89</td>
                <td className="p-4 border-b border-rule align-top">4 Points</td>
                <td className="p-4 border-b border-rule align-top">3 Points</td>
              </tr>
              <tr>
                <td className="p-4 align-top font-semibold text-ink">C</td>
                <td className="p-4 align-top">70–79</td>
                <td className="p-4 align-top">3 Points</td>
                <td className="p-4 align-top">2 Points</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-ink-soft text-base leading-relaxed italic mt-6">
          Your goal is to earn as many A's as possible in 5.0-point classes.
        </p>
      </section>

      <section>
        <H2>3. GPA "Leveling" and Strategy</H2>
        <p className="text-ink-soft text-base leading-relaxed">
          Since GPA is an average, taking a high volume of 4.0 classes will skew your overall
          GPA down even if you have straight A's. To keep your GPA highly competitive, limit
          your 4.0-scale classes strictly to graduation requirements and/or interest classes
          for your future career path. Fill the remainder of your schedule with 5.0-scale
          Honors/KAP and AP courses to offset the drop from ACA/Standard classes.
        </p>
      </section>

      <section>
        <H2>4. Virtual and Summer Courses</H2>
        <p className="text-ink-soft text-base leading-relaxed">
          Consider taking additional virtual courses during the school year or over the
          summer. If your school provides 5.0 virtual classes it is highly recommended you
          take them because they add on to your GPA roster and can further increase it as
          long as you earn an A.
        </p>

        <H3>My Personal Experience</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          When I entered my freshman year, I was overwhelmed by the sheer volume of choices. I
          was unaware of the math behind calculating GPA and took many 4.0's, which were
          hurting my potential without me noticing. The good news is that you can always recover. I
          learned to identify which foundational classes were required for my graduation and
          career interests, and then intentionally filled the rest of my schedule with
          5.0-scale courses to pull my average back up.
        </p>

        <H3>Why All of This Matters</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Colleges and universities will always analyze your GPA. Implementing these
          strategies does more than just keep your GPA high (in the 4.5–4.9 range); it acts as
          proof of your academic dedication. Admissions officers actively look for students
          who are willing to push beyond the minimum requirements and challenge themselves
          with rigorous coursework.
        </p>
      </section>

      <section>
        <H2>5. The Math Behind GPA</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          To see how this works in action, let's look at the math. In a typical high school
          year, you will take 7 classes. To find your GPA, you add up the points from your
          grades and divide them by the total number of classes.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-3">
          Let's say you take four 5.0 classes (Honors/KAP/AP) and three 4.0 classes (ACA).
          Assuming you earn a perfect A(90-100) in all of them:
        </p>
        <ul className={ul}>
          <li>4 Honors classes × 5 points = 20 points</li>
          <li>3 Standard classes × 4 points = 12 points</li>
          <li>Total = 32 points</li>
        </ul>
        <p className="text-ink-soft text-base leading-relaxed mt-6">
          Now, divide your 32 points by your 7 classes (32 ÷ 7). Your overall average is a
          4.57 GPA. Even with straight A's, standard classes mathematically pull your average
          down from a perfect 5.0. You can scale this formula throughout high school simply by
          adding up the points for every class you've taken and dividing by your total number
          of classes.
        </p>
      </section>

      <section id="simplified-wrap-up" className="scroll-mt-24">
        <H2>Simplified Wrap-Up</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Short on time? Here are the four key takeaways for boosting your GPA:
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Take the hard classes:</strong> Honors
            and AP classes operate on a 5.0 scale, meaning an 'A' is worth 5 points instead of
            4. Fill your schedule with as many of these as you can comfortably handle.
          </li>
          <li>
            <strong className="text-ink font-semibold">Limit standard classes:</strong> Every
            standard (4.0 scale) class you take lowers your <em>weighted</em> average, even if
            you get an A. Only take the standard classes strictly required for graduation.
          </li>
          <li>
            <strong className="text-ink font-semibold">Protect your grades:</strong> An 'A' in
            an AP class is the gold standard, but remember that a 'B' in an AP class is
            mathematically equal to an 'A' in a standard class.
          </li>
          <li>
            <strong className="text-ink font-semibold">Colleges care about rigor:</strong> A
            high weighted GPA proves to universities that you aren't just smart, but that you
            are willing to challenge yourself with college-level workloads.
          </li>
        </ul>
      </section>
    </article>
  );
}
