import { H2, H3, ul, ol, checklist } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const disciplineMotivationAuthor = "Yana Arora";

export const disciplineMotivationSources: SourceLink[] = [
  { label: "American Psychological Association", href: "https://www.apa.org/" },
  { label: "National Institute of Mental Health", href: "https://www.nimh.nih.gov/" },
  { label: "Harvard Health Publishing", href: "https://www.health.harvard.edu/" },
  { label: "Greater Good Science Center at UC Berkeley", href: "https://greatergood.berkeley.edu/" },
];

export function DisciplineMotivationGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Everyone has days when they feel unmotivated, tired, distracted, or like they
            simply do not want to get anything done. This content will teach high school
            students how to handle those days without relying completely on motivation. The
            goal is to show students how small actions, realistic goals, routines, and
            discipline can help them keep moving forward even when they do not feel
            motivated.
          </p>
          <p>
            This is mainly for middle school students preparing for high school and current
            high school students who struggle with procrastination, low motivation, or
            staying consistent with their responsibilities. This topic matters because
            school, extracurriculars, relationships, and personal goals can become
            overwhelming, and students cannot always wait until they "feel motivated" to
            start. Learning how to take small steps on difficult days can help students
            become more consistent and less stressed.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Put yourself in the position of a student who has homework, studying, activities,
            and other responsibilities but has absolutely no motivation to start. Explain
            that feeling unmotivated does not automatically mean someone is lazy or
            incapable. Share personal experiences with procrastination, difficult school
            days, or times when you had to complete something even though you did not feel
            like doing it.
          </p>
          <p>
            Explain what helped you personally, such as breaking assignments into smaller
            tasks, using a timer, putting your phone away, making a short to-do list, or
            simply committing to starting for a few minutes. Discuss challenges you faced and
            how you learned that discipline is often about taking the next small step instead
            of waiting for motivation to appear.
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Step-by-step strategy for an unmotivated day</H3>
        <ol className={ol}>
          <li>
            <strong className="text-ink font-semibold">Pause and identify the problem:</strong>{" "}
            Ask yourself whether you are tired, overwhelmed, distracted, or simply avoiding
            something difficult.
          </li>
          <li>
            <strong className="text-ink font-semibold">Choose one priority:</strong> Do not
            try to fix your entire day at once.
          </li>
          <li>
            <strong className="text-ink font-semibold">Make the task smaller:</strong> Instead
            of "finish my project," start with "open the document and write the title."
          </li>
          <li>
            <strong className="text-ink font-semibold">Commit to a short amount of time:</strong>{" "}
            Work for 5 to 10 minutes and reassess.
          </li>
          <li>
            <strong className="text-ink font-semibold">Remove one distraction:</strong> Put
            your phone away, close unnecessary tabs, or move somewhere quieter.
          </li>
          <li>
            <strong className="text-ink font-semibold">Take a reasonable break:</strong> Rest
            after making progress instead of using breaks to avoid starting.
          </li>
          <li>
            <strong className="text-ink font-semibold">Give yourself credit:</strong> Finishing
            one small task is still progress.
          </li>
        </ol>

        <H3>Real-world examples</H3>
        <ul className={ul}>
          <li>
            You have three assignments due tomorrow and feel overwhelmed. Instead of trying
            to finish everything at once, list them by priority and start with the most
            urgent one.
          </li>
          <li>
            You need to study for a test but keep scrolling on your phone. Put your phone
            somewhere out of reach and study one topic for 10 minutes.
          </li>
          <li>
            You planned to exercise but have very little energy. Instead of abandoning your
            goal completely, do a short, manageable activity or take a genuine rest if you
            are actually tired.
          </li>
          <li>
            You have been putting off a large project because it feels intimidating. Break it
            into research, outline, first section, editing, and final review.
          </li>
        </ul>

        <H3>Pros and cons of different strategies</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">To-do lists:</strong> Help organize
            responsibilities, but making an extremely long list can become overwhelming.
          </li>
          <li>
            <strong className="text-ink font-semibold">Timers:</strong> Can make starting feel
            easier, but students should still take appropriate breaks.
          </li>
          <li>
            <strong className="text-ink font-semibold">Rewards:</strong> Can provide extra
            encouragement, but students should also learn to work toward goals without
            always needing an external reward.
          </li>
          <li>
            <strong className="text-ink font-semibold">Strict routines:</strong> Can make
            habits easier to maintain, but routines should be flexible enough to account for
            unexpected events or days when you genuinely need rest.
          </li>
        </ul>

        <H3>Successful strategies and tips</H3>
        <ul className={checklist}>
          <li>Follow the rule of "start small."</li>
          <li>Focus on completing the next step rather than the entire assignment.</li>
          <li>Keep your workspace organized and free from unnecessary distractions.</li>
          <li>Prepare materials ahead of time so starting requires less effort.</li>
          <li>Set realistic goals instead of trying to accomplish everything in one day.</li>
          <li>Use routines to reduce the number of decisions you have to make.</li>
          <li>Track progress over time rather than expecting yourself to be productive every day.</li>
          <li>Remember that taking a break is different from giving up.</li>
        </ul>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Not feeling motivated is normal, and students should not expect themselves to be
          productive every single day. Instead of waiting for motivation, students can use
          discipline, routines, and small steps to make difficult tasks easier to start.
          Breaking assignments into smaller pieces, removing distractions, taking appropriate
          breaks, and focusing on progress can make unmotivated days more manageable. Most
          importantly, students should learn to balance productivity with genuine rest and
          recognize that consistency matters more than having a perfect day.
        </p>
      </section>
    </article>
  );
}
