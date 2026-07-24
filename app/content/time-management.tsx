import { Callout, H2, H3, ul, ol } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const timeManagementAuthor = "Arnav Joshi";

export const timeManagementSources: SourceLink[] = [
  {
    label: "Google Calendar",
    href: "https://calendar.google.com/",
    note: "For scheduling classes, activities, and reminders.",
  },
  {
    label: "Notion",
    href: "https://www.notion.so/",
    note: "For organizing assignments, notes, and long-term projects.",
  },
  {
    label: "Microsoft To Do",
    href: "https://todo.microsoft.com/tasks/",
    note: "For simple task management.",
  },
  {
    label: "Onrise",
    note: "A great, simple way to organize your tasks; however, it's a bit restrictive (based on personal experience).",
  },
];

export function TimeManagementGuide() {
  return (
    <article className="space-y-14">
      <section>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Hello, in this section, we will be talking about time management, how to
            manage your time across your academics, extracurricular
            activities, and general social life.
          </p>
          <p>
            First off, what is time management? This concept seeks to explain how to
            organize and plan your time so you can achieve your important tasks without
            feeling overwhelmed.
          </p>
        </div>
      </section>

      <section>
        <H2>Let's go through some examples!</H2>

        <H3>Example 1: High school student</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          This high school student wakes up around 6 am and leaves school around 2 pm. After
          this, he has a set organizer that has all of his tasks for the day (ex, go to
          practice, workout, finish schoolwork). By having this organized, he can decide the
          times when he can work. If he has practice after school, he can work on his
          schoolwork after his practice, being efficient with his time.
        </p>

        <H3>Example 2: Student with family responsibilities</H3>
        <p className="text-ink-soft text-base leading-relaxed">
          Well, people may have different lives, so what about people who have to take care
          of their siblings? They would benefit from time management — studying or doing work
          whenever they have free time. They can also sort their homework into chunks, doing
          these chunks day by day. By doing this, they can take care of their siblings and
          work without the need to multitask.
        </p>
      </section>

      <section>
        <H2>Why does it matter?</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-3">
          Good time management can lead to:
        </p>
        <ul className={ul}>
          <li>Meeting deadlines</li>
          <li>Reduced stress</li>
          <li>Proper sleep</li>
          <li>Improvement in grades</li>
          <li>Time for social activities</li>
          <li>Avoidance of last-minute cramming</li>
        </ul>

        <p className="text-ink-soft text-base leading-relaxed mt-8 mb-3">
          Poor time management can lead to:
        </p>
        <ul className={ul}>
          <li>Piling up assignments</li>
          <li>Feeling overwhelmed</li>
          <li>Burnout</li>
          <li>Worse academic performance</li>
        </ul>

        <p className="text-ink-soft text-base leading-relaxed mt-8">
          If you invest time in time management, it can affect your college admissions,
          since it directly correlates with your grades, time for extracurricular
          activities, and demonstration of a social aspect of your life (like volunteering).
        </p>

        <p className="text-ink-soft text-base leading-relaxed mt-4">
          While time management seems like it's common sense, many do not practice efficient
          management methods. Developing these habits can help you in the long run, so it's
          key to understand how to do so. Let's take a look at efficient ways to manage your time:
        </p>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          First, I will guide you through 5 steps to successfully manage your time:
        </p>

        <H3>1. Write everything down!</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Make sure to write everything down that is mandatory to finish and/or in the
          process of completing. You can organize by sorting through academics,
          extracurriculars, etc.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          Here are some resources to help you organize your work:
        </p>
        <ol className={ol}>
          <li>Notion (Great accessibility to a variety of templates)</li>
          <li>Google Calendar (very simple, and linked to your Google account)</li>
          <li>A physical planner (great option if you enjoy physical items)</li>
          <li>A simple notebook (create a checklist)</li>
          <li>Apple Calendar (a good in-between)</li>
        </ol>

        <H3>2. Prioritize your tasks</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-3">
          See, writing it down was the easiest part; however, what you do past that can be
          just as important.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          Make sure to organize your tasks based on urgency — what needs to be done, and when.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-2">For example, you can list it as:</p>
        <ol className={ol}>
          <li>Urgent</li>
          <li>Important, not urgent</li>
          <li>Later work</li>
        </ol>

        <H3>3. Break down assignments</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          A common mistake is grouping assignments into one overarching task. A good way to
          organize tasks that are large is to break them down into smaller tasks. By
          doing this, you can gradually finish the task without it feeling overwhelming.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          For example, rather than writing "research paper," you can say:
        </p>
        <ol className={ol}>
          <li>Find sources</li>
          <li>Create the general outline</li>
          <li>Write intro</li>
          <li>Finish body paragraphs</li>
          <li>Finish conclusion</li>
        </ol>
        <p className="text-ink-soft text-base leading-relaxed mt-4">Much better!</p>

        <H3>4. Schedule study times</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-4">
          Of course, at some point, you will have tests and quizzes, so a good option is to
          schedule your study times. By doing this, you can have set times to focus on
          learning the material before the upcoming test/quiz.
        </p>
        <p className="text-ink-soft text-base leading-relaxed mb-3">Example:</p>
        <Callout label="Example schedule">
          <p>Monday:</p>
          <p className="mt-2">
            4:30–5:30 – Study for Algebra 2
            <br />
            5:30–6:30 – Study for English
          </p>
          <p className="mt-3">Tuesday:</p>
          <p className="mt-2">6:30–8:00 – Study for World History</p>
        </Callout>
        <p className="text-ink-soft text-base leading-relaxed mt-4">
          While this is just an example, study routines are a great way to organize your
          time, since they allow you to learn the concepts in chunks rather than all at once.
        </p>

        <H3>5. Reduce distractions</H3>
        <p className="text-ink-soft text-base leading-relaxed mb-2">
          While doing all this, make sure to turn the phone off.
        </p>
        <ol className={ol}>
          <li>Silence notifications</li>
          <li>Put your phone across the room</li>
          <li>Close distracting tabs</li>
          <li>Study in a quiet environment</li>
        </ol>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Next, let's talk about the pros and cons of different time management planners.
        </p>
        <div className="overflow-x-auto border border-rule rounded-lg">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-paper-dim">
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">Strategy</th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">Pros</th>
                <th className="text-left font-display font-bold text-ink p-4 border-b border-rule">Cons</th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              <tr>
                <td className="p-4 border-b border-rule align-top">Paper planner</td>
                <td className="p-4 border-b border-rule align-top">Simple, no distractions</td>
                <td className="p-4 border-b border-rule align-top">Easy to forget</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-rule align-top">Digital calendar</td>
                <td className="p-4 border-b border-rule align-top">Sends reminders, syncs across devices</td>
                <td className="p-4 border-b border-rule align-top">Requires checking your phone/computer</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-rule align-top">To-do lists</td>
                <td className="p-4 border-b border-rule align-top">Easy to organize tasks</td>
                <td className="p-4 border-b border-rule align-top">Doesn't show when to do them</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-rule align-top">Time blocking</td>
                <td className="p-4 border-b border-rule align-top">Helps build routines</td>
                <td className="p-4 border-b border-rule align-top">Can feel restrictive</td>
              </tr>
              <tr>
                <td className="p-4 align-top">Pomodoro Technique (25 minutes work, 5 minutes break)</td>
                <td className="p-4 align-top">Improves focus and prevents burnout</td>
                <td className="p-4 align-top">Doesn't work well for everyone or every task</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Finally, here are some more resources and tips to get started!
        </p>

        <H3>Tips to get started:</H3>
        <ol className={ol}>
          <li>Start with a planner of your choice!</li>
          <li>Spend 5-10 minutes organizing all your work into the planner</li>
          <li>Review your schedule every Sunday</li>
          <li>Prioritize your top 3 most important tasks every week (still do the other ones)</li>
          <li>
            Leave yourself enough time that if anything unexpected happens, you still can
            finish your work.
          </li>
          <li>
            The day is not set for you, so don't expect it to go as planned — move on and
            finish the work.
          </li>
        </ol>
      </section>
    </article>
  );
}
