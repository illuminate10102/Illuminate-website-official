import { Callout, H2, H3 } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const memoryTechniquesAuthor = "Yana Arora";

export const memoryTechniquesSources: SourceLink[] = [
  {
    label: "BOK Center — Harvard",
    href: "https://bokcenter.harvard.edu",
  },
  {
    label: "The Learning Scientists",
    href: "https://www.learningscientists.org",
  },
  {
    label: "Ali Abdaal — Evidence-Based Study Tips",
    note: "Video",
  },
];

export function MemoryTechniquesGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Memory techniques are methods that make it easier to learn, remember, and recall
            information over time. While many students think that doing well in school depends
            on having a naturally good memory, that's actually not true.{" "}
            <strong className="text-ink font-semibold">
              Memory is a skill that anyone can strengthen with practice and the right
              strategies.
            </strong>{" "}
            Instead of relying on last-minute cramming or rereading the same notes over and
            over, students can use proven memory techniques to study more effectively, save
            time, and feel more confident when it's time to take a test.
          </p>
          <p>
            This guide is designed for middle school students preparing for high school, as
            well as current high school students who want to improve the way they study. As
            students move into more challenging classes, they're expected to remember larger
            amounts of information in subjects like biology, history, chemistry, math, and
            foreign languages. Learning memory techniques early can make studying feel less
            overwhelming, improve academic performance, and build strong learning habits that
            will continue to be useful in high school, college, and even future careers.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            When I first started taking harder classes, I thought studying meant reading my
            notes over and over until I could almost recite them. Sometimes I'd highlight
            nearly every sentence because I thought that would help me remember it later. I'd
            spend hours studying the night before a test, but once the test was in front of me,
            it felt like everything disappeared.
          </p>
          <p>
            After a while, I realized that the problem wasn't that I wasn't studying enough, it
            was that I wasn't studying in a way that actually helped my brain remember
            information. I started learning about memory techniques like{" "}
            <strong className="text-ink font-semibold">active recall</strong> and{" "}
            <strong className="text-ink font-semibold">spaced repetition</strong>, and even
            though they felt a little weird at first, I noticed a huge difference. Instead of
            just looking at my notes, I started testing myself and reviewing information over
            several days. I wasn't studying longer, I was just studying smarter.
          </p>
          <p>
            Now, I still use these techniques whenever I have a big test or quiz. They don't
            magically make studying fun, but they do make it much more effective. I don't panic
            as much before exams because I know I've actually learned the material instead of
            just reading it a bunch of times.
          </p>
        </div>

        <Callout label="Tip" icon="lightbulb">
          I wasn't studying longer, I was just studying smarter.
        </Callout>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Introduction</H3>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Have you ever finished reading a chapter and thought, "Okay, I totally get this,"
            but then couldn't answer a single question without looking back at your notes? If
            that sounds familiar, you're definitely not the only one.{" "}
            <strong className="text-ink font-semibold">
              A lot of students mistake recognizing information for actually remembering it.
            </strong>
          </p>
          <p>
            Think of your brain like building a path through a forest. The first time you learn
            something, the path is tiny and hard to find. Every time you review that
            information the right way, the path gets wider and easier to walk on. Eventually,
            finding that information becomes almost automatic. That's exactly what memory
            techniques are designed to do — they help your brain build stronger, longer-lasting
            connections so you can remember information when you actually need it.
          </p>
        </div>

        <H3>Why traditional studying doesn't always work</H3>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            A lot of us were never really taught how to study. We just do whatever seems
            productive. That usually means highlighting pages of notes, rereading the textbook,
            or watching the same review video over and over again.
          </p>
          <p>
            The problem is that these methods mostly make the information look familiar. When
            you keep seeing the same page, your brain starts thinking, "I've seen this before,"
            which feels like learning. But when it's time to take the test and you have to
            remember everything without your notes, that's when you realize{" "}
            <strong className="text-ink font-semibold">
              familiarity isn't the same thing as actually knowing something.
            </strong>
          </p>
          <p>
            That's why so many students leave a study session feeling confident, only to freeze
            during the quiz. The goal isn't to recognize the answer when you see it — it's to be
            able to remember it on your own.
          </p>
        </div>

        <H3>Active recall</H3>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            If I could recommend just one study technique, it would probably be{" "}
            <strong className="text-ink font-semibold">active recall</strong>. It sounds
            complicated, but it's actually really simple. Instead of looking at your notes and
            hoping something sticks, you close them and try to remember everything you can
            without any help.
          </p>
          <p>
            For example, if you're studying biology, don't keep rereading the chapter about
            cells. Close the book and ask yourself questions like, "What does the nucleus do?"
            or "Can I name the organelles?" You'll probably forget a few things at first, and
            that's completely normal. In fact,{" "}
            <strong className="text-ink font-semibold">
              struggling to remember is what helps strengthen your memory.
            </strong>{" "}
            Every time you retrieve information from your brain, you're making it easier to
            find again later.
          </p>
        </div>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Memory techniques are study strategies that help you remember information more
          effectively and for longer. Instead of relying on rereading notes or cramming, methods
          like active recall, spaced repetition, chunking, mnemonics, and visualization help your
          brain store and retrieve information more easily.{" "}
          <strong className="text-ink font-semibold">
            By using these techniques consistently, students can study more efficiently, reduce
            stress, and feel more confident on quizzes and exams.
          </strong>{" "}
          Whether you're in middle school or high school, building strong memory habits now can
          make learning easier throughout your academic journey.
        </p>
      </section>
    </article>
  );
}
