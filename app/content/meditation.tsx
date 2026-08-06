import { H2, H3, ul, ol, checklist } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const meditationAuthor = "Yana Arora";

export const meditationSources: SourceLink[] = [
  {
    label: "American Psychological Association",
    href: "https://www.apa.org/",
    note: "Information about mindfulness, stress, and psychological well-being.",
  },
  {
    label: "National Center for Complementary and Integrative Health",
    href: "https://www.nccih.nih.gov/",
    note: "Research and information about meditation and mindfulness practices.",
  },
  {
    label: "Mindful",
    href: "https://www.mindful.org/",
    note: "Beginner-friendly explanations and guided mindfulness practices.",
  },
  {
    label: "Nemours KidsHealth",
    href: "https://kidshealth.org/",
    note: "Student-friendly information about managing stress and developing healthy habits.",
  },
];

export function MeditationGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Meditation is a simple practice that involves training your attention and
            becoming more aware of your thoughts, feelings, and surroundings. This content
            will explain how meditation can be used as a healthy tool for managing everyday
            stress, improving focus, and creating a few moments of calm during a busy school
            day.
          </p>
          <p>
            The goal is not to teach students that they need to completely clear their minds
            or meditate for a long time. Instead, students will learn simple techniques they
            can realistically use before studying, during stressful days, or whenever they
            need a short mental break.
          </p>
          <p>
            This content is mainly for middle school and high school students, especially
            students who are dealing with schoolwork, extracurricular activities, social
            situations, tests, and other everyday sources of stress. Meditation matters
            because students often have very busy schedules and may have trouble slowing
            down or focusing on one thing at a time. Learning a few basic meditation
            techniques can give students another healthy way to pause, refocus, and become
            more aware of how they are feeling.
          </p>
          <p>
            Students do not need any previous experience with meditation. The content will
            explain what meditation is, what it is not, and how beginners can get started
            without needing special equipment or a large amount of free time.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Imagine being a student who has never meditated before. You might think
            meditation means sitting completely still for 30 minutes and having absolutely no
            thoughts. In reality, it is normal for your mind to wander. Meditation is more
            about noticing when your attention has wandered and gently bringing it back to
            whatever you are focusing on.
          </p>
          <p>
            From a student's perspective, one of the biggest challenges can be staying
            consistent. It can also feel strange or boring at first because students are used
            to constantly being entertained or distracted. Starting with just a few minutes
            can make meditation feel much more manageable.
          </p>
          <p>
            Personal experiences with meditation can be used to explain situations where it
            may be helpful, such as taking a short break before an important test, calming
            down after a difficult day, or taking a few minutes to focus before starting
            homework. The author should explain what techniques have worked for them
            personally while making it clear that different students may prefer different
            approaches.
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Tips on how to get started</H3>
        <ul className={checklist}>
          <li>Start with 2 to 5 minutes.</li>
          <li>Find a quiet, comfortable place.</li>
          <li>Put away distractions like your phone.</li>
          <li>Choose one technique and practice consistently.</li>
          <li>Remember that your mind does not have to be completely empty.</li>
        </ul>

        <H3>Introduction &amp; background</H3>
        <ul className={ul}>
          <li>Explain what meditation and mindfulness are.</li>
          <li>Explain how meditation works and why people practice it.</li>
          <li>Clarify that meditation can be practiced by anyone.</li>
        </ul>

        <H3>Main techniques</H3>
        <ul className={ul}>
          <li>Focused breathing</li>
          <li>Guided meditation</li>
          <li>Body awareness</li>
          <li>Mindful observation</li>
          <li>Short mindfulness breaks</li>
        </ul>

        <H3>Simple steps</H3>
        <ol className={ol}>
          <li>Sit somewhere comfortable.</li>
          <li>Focus on your breathing.</li>
          <li>Notice when your mind wanders.</li>
          <li>Gently return your attention to your breathing.</li>
          <li>Continue for a few minutes.</li>
        </ol>

        <H3>Real-world examples</H3>
        <ul className={ul}>
          <li>Before a test or presentation</li>
          <li>During a stressful day</li>
          <li>Before homework or studying</li>
          <li>During a study break</li>
          <li>Before going to sleep</li>
        </ul>

        <H3>Pros and cons</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Guided meditation:</strong> Easy for
            beginners, but some may find it distracting.
          </li>
          <li>
            <strong className="text-ink font-semibold">Breathing meditation:</strong> Simple
            and accessible, but concentration can be difficult at first.
          </li>
          <li>
            <strong className="text-ink font-semibold">Body awareness:</strong> Helps with
            awareness and relaxation, but may take practice.
          </li>
        </ul>

        <H3>Successful tips</H3>
        <ul className={checklist}>
          <li>Start small and stay consistent.</li>
          <li>Do not worry about being perfect.</li>
          <li>Try different techniques to find what works for you.</li>
          <li>If your mind wanders, simply bring your attention back.</li>
        </ul>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Meditation is a practical skill that can help students practice attention and
          become more aware of the present moment. Students can start with simple techniques
          such as focused breathing or guided meditation for just a few minutes at a time.
          The most important part is consistency, not being perfect or completely clearing
          your mind. Students should experiment with different techniques and use meditation
          as one healthy tool for handling everyday stress, improving focus, and taking
          intentional breaks.
        </p>
      </section>
    </article>
  );
}
