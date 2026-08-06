import { H2, H3, ul, ol, checklist } from "../components/content/Prose";

type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const friendshipsAuthor = "Yana Arora";

export const friendshipsSources: SourceLink[] = [
  { label: "American Psychological Association", href: "https://www.apa.org/" },
  { label: "Nemours KidsHealth", href: "https://kidshealth.org/" },
];

export function FriendshipsGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Brief description</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            High school can get overwhelming with classes, extracurriculars, sports, family
            responsibilities, and other commitments. It can become easy to lose touch with
            friends, even when those friendships are important to you. This content will
            explain how students can maintain meaningful friendships, communicate when life
            gets busy, and make time for the people they care about without feeling like
            they have to choose between their responsibilities and their relationships.
          </p>
          <p>
            This is primarily for middle school students preparing for high school and
            current high school students. It is especially helpful for students who feel
            like they are becoming more distant from their friends because of busy
            schedules, changing interests, or the pressures of school. The goal is to show
            students that strong friendships do not require constant communication or
            spending every day together. What matters is making an effort, communicating
            honestly, and making sure both people feel valued.
          </p>
        </div>
      </section>

      <section>
        <H2>Personal experience</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Starting high school can change the way friendships work. As school becomes more
            demanding, it can be difficult to find time to text, call, hang out, or even have
            a real conversation with friends. Sometimes you may notice that you are talking
            to someone less often and start wondering if the friendship is falling apart,
            even when both of you are simply busy.
          </p>
          <p>
            A major challenge is learning that being busy does not automatically mean you are
            a bad friend. At the same time, friendships do require effort. Simple actions
            like checking in, remembering something important to your friend, inviting them
            to spend time together, or sending a quick message can make a big difference.
            This topic is important because learning how to balance friendships with other
            responsibilities is a skill that will continue to matter throughout high school,
            college, work, and adulthood.
          </p>
        </div>
      </section>

      <section>
        <H2>Main points</H2>

        <H3>Tips on how to get started</H3>
        <ul className={checklist}>
          <li>Identify the friendships that are most meaningful to you.</li>
          <li>Make small efforts to stay connected instead of waiting for the "perfect" time.</li>
          <li>Communicate when your schedule becomes overwhelming.</li>
          <li>Make plans ahead of time when spontaneous hangouts are difficult.</li>
          <li>Focus on quality time rather than constantly being together.</li>
        </ul>

        <H3>Introduction and background</H3>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          Explain why friendships can become harder to maintain during high school. Students
          may have more homework, extracurricular activities, jobs, family responsibilities,
          and new social groups. Being busy is normal, but friendships can still remain
          strong when both people make an effort to stay connected.
        </p>

        <H3>Main themes</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Communication:</strong> Let friends
            know when you are busy instead of disappearing.
          </li>
          <li>
            <strong className="text-ink font-semibold">Consistency:</strong> Small check-ins
            can help maintain a friendship over time.
          </li>
          <li>
            <strong className="text-ink font-semibold">Quality over quantity:</strong> You do
            not have to talk every day to have a meaningful friendship.
          </li>
          <li>
            <strong className="text-ink font-semibold">Balance:</strong> Friendships should
            fit into your life without preventing you from handling important
            responsibilities.
          </li>
          <li>
            <strong className="text-ink font-semibold">Mutual effort:</strong> Healthy
            friendships involve effort from both people.
          </li>
        </ul>

        <H3>Step-by-step strategy</H3>
        <ol className={ol}>
          <li>Think about the friends you want to stay close with.</li>
          <li>Check in with them regularly, even if it is just a short message.</li>
          <li>Make plans around both of your schedules.</li>
          <li>Be honest when school or other responsibilities become overwhelming.</li>
          <li>Listen to your friend and show interest in what is happening in their life.</li>
          <li>Address misunderstandings instead of letting them build up.</li>
          <li>Recognize when a friendship is healthy, supportive, and worth continuing.</li>
        </ol>

        <H3>Real-world examples</H3>
        <ul className={ul}>
          <li>
            You have three tests coming up but still want to stay connected with your
            friends, so you plan a short lunch together instead of canceling everything.
          </li>
          <li>
            You have not talked to a friend in several weeks because both of you are busy, so
            you send them a message and make plans for the weekend.
          </li>
          <li>
            A friend feels like you have been ignoring them, so instead of becoming
            defensive, you explain what has been keeping you busy and listen to how they
            feel.
          </li>
        </ul>

        <H3>Pros and cons of different strategies</H3>
        <ul className={ul}>
          <li>
            <strong className="text-ink font-semibold">Texting or messaging:</strong> Easy
            and convenient, but messages can sometimes feel less personal or lead to
            misunderstandings.
          </li>
          <li>
            <strong className="text-ink font-semibold">Planning ahead:</strong> Makes it
            easier to find time together, but it requires flexibility when schedules change.
          </li>
          <li>
            <strong className="text-ink font-semibold">Spending time together in person:</strong>{" "}
            Can create stronger connections, but may be difficult when both people have busy
            schedules.
          </li>
          <li>
            <strong className="text-ink font-semibold">Taking space when needed:</strong>{" "}
            Gives people time to focus on school and personal responsibilities, but too much
            distance without communication can make a friendship feel disconnected.
          </li>
        </ul>

        <H3>Successful strategies</H3>
        <ul className={checklist}>
          <li>Send a quick "How are you?" message.</li>
          <li>Remember birthdays, important events, and things your friend cares about.</li>
          <li>Schedule regular hangouts when possible.</li>
          <li>Be willing to apologize and talk through disagreements.</li>
          <li>Celebrate your friends' accomplishments instead of only talking when something is wrong.</li>
          <li>Give your friends space when they need it while still letting them know you care.</li>
        </ul>
      </section>

      <section>
        <H2>Summary</H2>
        <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
          High school can make friendships harder to maintain because students have more
          responsibilities and less free time, but being busy does not mean friendships have
          to disappear. Small actions like checking in, making plans, communicating honestly,
          and showing interest in your friends can help keep relationships strong. Focus on
          the quality of your friendships rather than how often you see or talk to someone,
          and remember that healthy friendships involve mutual effort, respect, and
          understanding.
        </p>
      </section>
    </article>
  );
}
