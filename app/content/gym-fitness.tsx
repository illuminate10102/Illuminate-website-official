import { H2, H3, ul, ol, checklist } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const gymFitnessAuthor = "Yana Arora";

export const gymFitnessSources: SourceLink[] = [
  {
    label: "Centers for Disease Control and Prevention (CDC)",
    href: "https://www.cdc.gov/physical-activity-basics/",
    note: "Physical activity basics and guidelines for staying active.",
  },
  {
    label: "Health.gov",
    href: "https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines",
    note: "Official U.S. physical activity guidelines.",
  },
  {
    label: "HealthyChildren.org",
    href: "https://www.healthychildren.org/",
    note: "Pediatrician-reviewed guidance for kids and teens, from the American Academy of Pediatrics.",
  },
  {
    label: "American College of Sports Medicine (ACSM)",
    href: "https://www.acsm.org/",
    note: "Evidence-based exercise science and fitness guidance.",
  },
];

export function GymFitnessGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Gym and fitness are not just about lifting heavy weights or changing how your body
            looks. Fitness is about building strength, endurance, mobility, coordination, and
            healthy habits that can support you throughout high school and beyond. This content
            will teach students how to approach exercise safely, create realistic routines,
            understand basic gym terminology, and make fitness a positive part of their
            lifestyle.
          </p>
          <p>
            This content is primarily designed for middle school students preparing to enter
            high school and current high school students who are new to the gym or unsure about
            how to exercise safely. Many students want to become more active but do not know
            where to start, what exercises to do, or how often they should work out. Some may
            also feel intimidated by gyms because they think everyone else already knows what
            they are doing.
          </p>
          <p>
            Learning the basics early can help students feel more comfortable being active and
            prevent common mistakes. The goal is not to encourage students to chase a certain
            body type or appearance. Instead, the focus should be on becoming stronger,
            improving physical abilities, taking care of your body, and developing habits that
            are sustainable.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            If I were explaining fitness to a middle schooler who had never been to a gym, I
            would start by making it clear that they do not need to know everything before they
            begin. A gym can seem intimidating because there are many different machines,
            exercises, and terms that students may not recognize. However, fitness can be much
            simpler than it appears. At its most basic level, it involves moving your body
            regularly, challenging yourself appropriately, getting enough recovery, and staying
            consistent.
          </p>
          <p>
            My own experience with fitness has taught me that progress does not happen
            overnight. When someone first starts exercising, it can be tempting to try to do too
            much too quickly because they want to see results immediately. This can make
            exercise exhausting and difficult to maintain. Learning to start gradually, focus on
            proper technique, and give my body enough time to recover helped me understand that
            consistency is much more important than trying to have the hardest workout every
            time.
          </p>
          <p>
            One challenge many students face is comparing themselves to other people at the gym.
            Someone who has been exercising for years may be able to lift more weight or perform
            an exercise more easily, but that does not mean a beginner is doing poorly. Everyone
            starts at a different level. Fitness should be viewed as personal progress rather
            than a competition with other people's bodies or abilities.
          </p>
          <p>
            I feel qualified to explain this topic because I have learned about the importance
            of exercise, consistency, recovery, and safe training through my own experiences and
            through researching reliable fitness and health information. My goal is to explain
            these concepts in a way that makes sense to students who may have little or no
            previous experience with exercise.
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Tips on how to get started</H3>
        <ul className={checklist}>
          <li>Start with simple exercises and activities you enjoy.</li>
          <li>Focus on proper form before increasing difficulty.</li>
          <li>Set realistic goals and stay consistent.</li>
          <li>Ask a coach, trainer, or trusted adult for help when needed.</li>
        </ul>

        <H3>Introduction to fitness</H3>
        <ul className={ul}>
          <li>
            Fitness includes strength, endurance, flexibility, mobility, balance, and
            cardiovascular health.
          </li>
          <li>Fitness is about feeling stronger and healthier, not looking a certain way.</li>
        </ul>

        <H3>Important definitions</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Rep:</strong> One complete exercise
            movement.
          </li>
          <li>
            <strong className="text-ink font-semibold">Set:</strong> A group of repetitions.
          </li>
          <li>
            <strong className="text-ink font-semibold">Warm-up:</strong> Light movement that
            prepares your body for exercise.
          </li>
          <li>
            <strong className="text-ink font-semibold">Cool-down:</strong> Lower-intensity
            movement after exercise.
          </li>
          <li>
            <strong className="text-ink font-semibold">Recovery:</strong> Time your body needs
            to rest and adapt.
          </li>
          <li>
            <strong className="text-ink font-semibold">Resistance:</strong> Something that makes
            an exercise more challenging.
          </li>
        </ul>

        <H3>Main theme</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Teach students how to exercise safely, build healthy habits, and make fitness a
          sustainable part of their lives.
        </p>

        <H3>Step-by-step approach</H3>
        <ol className={ol}>
          <li>Warm up.</li>
          <li>Choose a few basic exercises.</li>
          <li>Practice proper form.</li>
          <li>Take appropriate breaks.</li>
          <li>Cool down.</li>
          <li>Rest and recover.</li>
        </ol>

        <H3>Real-world examples</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed mb-3">
          Show how fitness can fit into different lifestyles, such as:
        </p>
        <ul className={ul}>
          <li>A beginner starting at the gym</li>
          <li>A student involved in sports</li>
          <li>A student with a busy school schedule</li>
          <li>Someone exercising at home</li>
        </ul>

        <H3>Pros and cons</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Compare gym workouts, home workouts, sports, and other activities based on cost,
          convenience, equipment, and enjoyment.
        </p>

        <H3>Successful strategies</H3>
        <ul className={checklist}>
          <li>Stay consistent instead of trying to do too much at once.</li>
          <li>Prioritize technique and recovery.</li>
          <li>Choose activities you enjoy.</li>
          <li>Avoid comparing your progress to others.</li>
          <li>Balance exercise with school, sleep, nutrition, and other responsibilities.</li>
        </ul>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Fitness is about more than appearance or how much weight someone can lift. Students
          can improve their physical abilities by consistently participating in activities such
          as strength training, cardio, sports, walking, and mobility exercises while focusing
          on proper technique and recovery. Beginners should start gradually, avoid comparing
          themselves to others, and choose activities that fit realistically into their lives.
          Most importantly, exercise should support a student's overall health and confidence
          rather than become a source of pressure or unhealthy comparison.
        </p>
      </section>
    </article>
  );
}
