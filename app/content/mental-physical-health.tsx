type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const mentalHealthAuthor = "Arnav Madiwale";

export const mentalHealthSources: SourceLink[] = [
  {
    label: "Toggl Track: Time Tracking Software for Any Workflow",
    href: "https://toggl.com/",
  },
  {
    label: "Apple Clock app",
  },
  {
    label: "Critique AI - Gain Confidence",
    href: "https://www.critiqueai.app/",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mb-5">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-subtitle font-bold text-xl text-ink tracking-tight mb-3 mt-8">
      {children}
    </h3>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-marker/50 bg-marker/10 rounded-lg p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-ink mb-2">{label}</p>
      <div className="text-ink text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

const ul = "space-y-2.5 text-ink-soft text-base leading-relaxed list-disc pl-5 marker:text-pen";
const ol = "space-y-2 text-ink-soft text-base leading-relaxed list-decimal pl-5 marker:text-pen";

export function MentalPhysicalHealthGuide() {
  return (
    <article className="space-y-14">
      <section>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Welcome! On this page, we are going to talk about how to maintain your mental and
            physical health, and why they are so important. Your mental and physical health are
            important for your well-being, and failing to maintain them can have dire
            consequences
          </p>
          <p>
            <strong className="text-ink font-semibold">
              Why is your mental and physical health so important?
            </strong>{" "}
            Because your mental and physical health work together to support your well-being.
            Taking care of them makes you feel good and healthy, and lets you live a long and
            healthy life.
          </p>
        </div>
      </section>

      <section>
        <H2>Here are some examples of why your mental and physical health are so important</H2>
        <ol className={ol}>
          <li>
            A sophomore spends his night studying for an important exam, believing that
            sacrificing his sleep will help him earn a better grade. He stays awake until after
            2:00 a.m., leaving himself mentally and emotionally exhausted. By the time he
            arrives at school, he is unable to concentrate, struggles to remember what he
            studied, and ultimately fails the test. This experience shows how stress and sleep
            deprivation can negatively affect both mental health and academic performance. To
            protect his health, he should start studying several days in advance, take regular
            breaks, manage stress in healthy ways, and get enough sleep each night. Healthy
            study habits and adequate rest can improve focus, memory, and overall mental
            wellness.
          </li>
          <li>
            A junior in high school lives a very sedentary lifestyle. He spends most of his day
            indoors, eats mostly junk food, and drinks unhealthy amounts of sugary sodas daily,
            and rarely participates in any physical activities. If he keeps up these habits,
            they could have serious, life-changing consequences for his health over time. To
            improve his health, he can start by cutting out all junk food, then eating a
            balanced diet of fruits, vegetables, and proteins, while cutting back on sugary
            drinks and drinking water instead. He could also start exercising by going to the
            gym or being active daily. If he stays consistent, he can begin to see positive
            results over time.
          </li>
        </ol>
      </section>

      <section>
        <H2>Why does it matter?</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-3">
          Good mental and physical health will lead to-
        </p>
        <ul className={ul}>
          <li>Good mood</li>
          <li>Confidence</li>
          <li>Motivation</li>
          <li>Long life</li>
          <li>Staying active</li>
          <li>Better time management</li>
          <li>Lower risk of health problems</li>
        </ul>

        <p className="text-ink-soft text-base leading-relaxed mt-8 mb-3">
          Poor mental and physical health will lead to-
        </p>
        <ul className={ul}>
          <li>Loss of patience</li>
          <li>Increase in stress</li>
          <li>Unhealthy habits</li>
          <li>Low energy</li>
          <li>Trouble focusing</li>
          <li>Higher risk of health problems</li>
        </ul>
      </section>

      <section>
        <H2>How Does Maintaining Your Mental and Physical Health Impact Your College Application?</H2>
        <p className="text-ink-soft text-base leading-relaxed">
          Maintaining your mental and physical health can have positive impacts on your college
          application by helping you perform better academically, helping you stay involved in
          many extracurricular activities, and improving your confidence, which also
          strengthens your application. With better mental and physical health, you are more
          likely to handle college workload, make strong, positive habits, and manage stress.
        </p>

        <H3>How does it relate to you?</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Your mental and physical health impact how you think, feel, and live each day.
          Maintaining both helps you manage your confidence, stress, focus, health, and your
          overall well-being and helps you live an enjoyable life.
        </p>
      </section>

      <section>
        <H2>What can YOU do to maintain your health?</H2>

        <H3>1. Take breaks!</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          When you take a short break after a long study session, it can improve your focus,
          minimize your stress, and help your brain retain what you have learned. If you study
          for a long time without a break, you will get stressed, and it will be harder to
          concentrate. Your study schedule should have breaks so you can learn more effectively
          and protect your mental health.
        </p>

        <Callout label="Example schedule">
          <p>"I want to study for my AP Chemistry Test!"</p>
          <p className="mt-3">My schedule</p>
          <p className="mt-2">
            5:30- 6:30 study
            <br />
            6:30- break- 10 minutes
            <br />
            6:40-7:30 study
          </p>
        </Callout>

        <p className="text-ink-soft text-base leading-relaxed mt-6 mb-2">
          You can use apps such as-
        </p>
        <ul className={ul}>
          <li>Toggl Track</li>
          <li>Session</li>
        </ul>

        <H3>2. Be Active!</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          Staying active is an important aspect of maintaining your mental and physical health.
          Exercise helps improve your mood, minimize your stress, make you more energized, and
          make your body strong and healthy. An active lifestyle can lead to long-term benefits
          for your well-being. Ways to be active include -
        </p>
        <ul className={ul}>
          <li>Going for a walk</li>
          <li>Going for a run</li>
          <li>Going to the gym</li>
          <li>Swimming</li>
          <li>Playing Sports</li>
        </ul>

        <p className="text-ink-soft text-base leading-relaxed mt-6 mb-2">
          You can use apps such as-
        </p>
        <ul className={ul}>
          <li>Critique AI</li>
        </ul>

        <H3>3. Get Enough Sleep!</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Sleep affects both your mental and physical health drastically. Sleep helps your brain
          recharge, improves your focus, and allows your body to recover. A lack of sleep can
          make it harder to concentrate on a lesson or test and make it harder to learn and
          manage stress. You should sleep a minimum of 7-8 hours.
        </p>

        <H3>4. Eat Healthy!</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          The food you eat has a big effect on your energy levels, your mood, and your overall
          health. Eating a balanced meal with fruits, veggies, and proteins, helps your body be
          as healthy as it can get. You should avoid eating junk food such as cheeseburgers,
          pizza, and cake on a daily basis but you can enjoy these foods as an occasional treat.
          Healthy foods include-
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Vegetables:</strong> Broccoli, Peppers,
            Carrots, Spinach
          </li>
          <li>
            <strong className="text-ink font-semibold">Fruits:</strong> Bananas, Apples,
            Berries, Oranges
          </li>
          <li>
            <strong className="text-ink font-semibold">Proteins:</strong> Eggs, Fish, Chicken
          </li>
          <li>
            <strong className="text-ink font-semibold">Healthy Snacks:</strong> Nuts, Fruit,
            Yogurt
          </li>
        </ul>

        <p className="text-ink-soft text-base leading-relaxed mt-6 mb-2">
          You can use apps such as-
        </p>
        <ul className={ul}>
          <li>Critique AI</li>
        </ul>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Here are some Pros and Cons of many strategies to maintain your health
        </p>
        <div className="overflow-x-auto border border-rule rounded-lg">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-paper-dim">
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  Strategy
                </th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  Pros
                </th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">
                  Cons
                </th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              <tr>
                <td className="p-4 border-b border-rule align-top font-semibold text-ink">
                  Regular exercise
                </td>
                <td className="p-4 border-b border-rule align-top">
                  Reduces stress, improves mood, supports health
                </td>
                <td className="p-4 border-b border-rule align-top">
                  It can be tough to find time or motivation
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-rule align-top font-semibold text-ink">
                  Healthy eating
                </td>
                <td className="p-4 border-b border-rule align-top">
                  Increases your energy, mood, and fitness
                </td>
                <td className="p-4 border-b border-rule align-top">
                  Healthy foods may be too expensive or inaccessible
                </td>
              </tr>
              <tr>
                <td className="p-4 align-top font-semibold text-ink">Limiting screen time</td>
                <td className="p-4 align-top">Improves focus, sleep and eye health.</td>
                <td className="p-4 align-top">
                  Many people need phones for texting, work, and school
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Here are some resources/tips to get started.
        </p>

        <H3>Tips to get Started-</H3>
        <ol className={ol}>
          <li>Have realistic goals (Don't start too big!)</li>
          <li>Take small breaks when under stress over school/work</li>
          <li>Eat nutritious meals</li>
          <li>Find activities that you enjoy, such as playing sports, walking, and running</li>
          <li>Stay hydrated- Drink a healthy amount of water to keep your body hydrated.</li>
        </ol>

        <H3>Resource Apps</H3>
        <div className="space-y-3 text-ink-soft text-base leading-relaxed">
          <p>
            <a
              href="https://toggl.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pen hover:text-pen-dim transition-colors underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4"
            >
              Toggl Track: Time Tracking Software for Any Workflow
            </a>
          </p>
          <p>Apple Clock app</p>
          <p>
            <a
              href="https://www.critiqueai.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pen hover:text-pen-dim transition-colors underline decoration-rule hover:decoration-marker decoration-2 underline-offset-4"
            >
              Critique AI - Gain Confidence
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
