import { H2, H3, ul, ol, checklist } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const spiritualGroundingAuthor = "Yana Arora";

export const spiritualGroundingSources: SourceLink[] = [
  { label: "American Psychological Association", href: "https://www.apa.org/" },
  { label: "Mindful", href: "https://www.mindful.org/" },
  { label: "Greater Good Science Center at UC Berkeley", href: "https://greatergood.berkeley.edu/" },
  { label: "APA Handbook of Psychology, Religion, and Spirituality" },
];

export function SpiritualGroundingGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            High school can easily make students feel like their grades, achievements, and
            college plans determine their worth. Spiritual grounding is about developing a
            sense of meaning, purpose, connection, and inner steadiness that does not depend
            entirely on academic success. This can look different for everyone, whether it
            comes from religion, nature, family, service, personal values, mindfulness,
            community, or simply taking time to understand yourself.
          </p>
          <p>
            This content is primarily designed for middle and high school students who feel
            overwhelmed by academic pressure, competition, or the expectation to constantly
            achieve. It is especially helpful for students who feel like their GPA, test
            scores, extracurriculars, or future plans have become too closely connected to
            their identity.
          </p>
          <p>
            Spiritual grounding does not require following a specific religion or belief
            system. It is about finding something meaningful that helps you remember that
            you are more than your accomplishments. Students can explore what gives them
            purpose, what values they want to live by, and what helps them feel connected to
            something beyond school.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Put yourself in the position of a student who feels like every grade matters and
            every mistake could affect their future. Explain how easy it is to compare
            yourself to classmates, become focused on achievements, and forget about your
            life outside of school.
          </p>
          <p>
            Share personal experiences with academic pressure, uncertainty about the future,
            or feeling like accomplishments define success. Discuss how developing a stronger
            connection to personal values, family, community, faith, nature, service, or
            other meaningful parts of life can create a healthier perspective.
          </p>
          <p>
            The goal is not to tell students what they should believe. Instead, explain how
            exploring your own beliefs and values can help you understand yourself better and
            create a stronger sense of purpose.
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Tips on how to get started</H3>
        <ul className={checklist}>
          <li>Identify what matters to you outside of school.</li>
          <li>Spend time reflecting, journaling, praying, meditating, or being present.</li>
          <li>Connect with people, activities, or communities that give you meaning.</li>
          <li>Remember that your grades do not determine your worth.</li>
        </ul>

        <H3>Introduction to the topic</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Explain how high school can make students feel like grades and achievements define
          success. Introduce spiritual grounding as a way to build purpose and stability
          beyond academics.
        </p>

        <H3>Definitions and background</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Define <strong className="text-ink font-semibold">spiritual grounding</strong> as
          finding meaning, purpose, connection, and stability through something beyond
          short-term achievements. This can come from religion, relationships, nature,
          service, values, or personal reflection.
        </p>

        <H3>Main theme</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Your GPA represents your academic performance, but it does not define who you are.
          Building meaningful parts of your life outside school can help you stay grounded
          during stressful times.
        </p>

        <H3>Step-by-step practice</H3>
        <ol className={ol}>
          <li>
            <strong className="text-ink font-semibold">Pause:</strong> Step away from
            schoolwork for a moment.
          </li>
          <li>
            <strong className="text-ink font-semibold">Reflect:</strong> Think about what
            matters to you.
          </li>
          <li>
            <strong className="text-ink font-semibold">Connect:</strong> Spend time with
            people or activities that ground you.
          </li>
          <li>
            <strong className="text-ink font-semibold">Act:</strong> Do something that
            reflects your values.
          </li>
          <li>
            <strong className="text-ink font-semibold">Repeat:</strong> Make grounding a
            regular habit.
          </li>
        </ol>

        <H3>Real-world examples</H3>
        <ul className={ul}>
          <li>Handling a disappointing grade without letting it define you.</li>
          <li>Spending time with family or friends during stressful periods.</li>
          <li>Volunteering or helping others to find a sense of purpose.</li>
          <li>Using prayer, meditation, journaling, or nature to reconnect with yourself.</li>
        </ul>

        <H3>Pros and cons of different strategies</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Prayer/religious practice:</strong>{" "}
            Can provide meaning and community.
          </li>
          <li>
            <strong className="text-ink font-semibold">Meditation:</strong> Can help with
            reflection and staying present.
          </li>
          <li>
            <strong className="text-ink font-semibold">Journaling:</strong> Can help clarify
            thoughts and values.
          </li>
          <li>
            <strong className="text-ink font-semibold">Community/service:</strong> Can create
            connection and purpose.
          </li>
          <li>
            <strong className="text-ink font-semibold">Nature/quiet time:</strong> Can
            provide space away from academic pressure.
          </li>
        </ul>

        <H3>Successful strategies/tips</H3>
        <ul className={checklist}>
          <li>Create a short daily grounding routine.</li>
          <li>Spend time with people who value you beyond achievements.</li>
          <li>Do something meaningful each week unrelated to grades.</li>
          <li>Remember that your sense of purpose can grow and change over time.</li>
        </ul>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Spiritual grounding helps students remember that they are more than their GPA, test
          scores, and accomplishments. By developing meaningful connections with their
          values, relationships, beliefs, community, nature, or other important parts of
          life, students can build a stronger sense of purpose and stability. The goal is not
          to follow one specific spiritual path, but to discover what genuinely gives your
          life meaning and helps you stay grounded when school becomes stressful. Most
          importantly, success should be viewed as more than academic achievement because a
          fulfilling life involves learning who you are, what you value, and what kind of
          person you want to become.
        </p>
      </section>
    </article>
  );
}
