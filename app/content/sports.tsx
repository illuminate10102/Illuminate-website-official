type SourceLink = {
  label: string;
  href?: string;
  note?: string;
};

export const sportsAuthor = "Vinh Tran";

export const sportsSources: SourceLink[] = [
  {
    label: "RankOne",
    note: "Where you submit your Physical and Health forms before tryouts.",
  },
  {
    label: "Pay 'N Go (KatyISD)",
    note: "Where sports fees are paid.",
  },
  {
    label: "GPA Exempt (KatyISD Family Access)",
    note: "Where you apply to exempt a sports course from your GPA, starting in 10th grade.",
  },
];

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-marker/50 bg-marker/10 rounded-lg p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-ink mb-2">{label}</p>
      <div className="text-ink text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}

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

const ul = "space-y-2.5 text-ink-soft text-base leading-relaxed list-disc pl-5 marker:text-pen";

export function SportsGuide() {
  return (
    <article className="space-y-14">
      <section>
        <H2>Why play sports in high school?</H2>
        <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          <p>
            Playing high school sports such as basketball, football, tennis, or others gives
            students the opportunity to connect with a larger variety of people on a different
            level. I mean, making a friend while being tackled down onto the field is much
            different than saying "Hi" to a new classmate, isn't it? Sports can give students a
            more personal level of understanding and mutual companionship, which can even
            extend into adulthood friendships or even personal careers.
          </p>
          <p>
            However, sports aren't just about making friends. It's about showing colleges{" "}
            <em>who you are</em>.
          </p>
          <p>
            A long-time commitment to sports, combined with strong academics, essays, and more,
            shows colleges your character as well as how versatile and well-rounded you are as
            an individual.
          </p>
          <p>
            A strong involvement in sports throughout your high school career can display
            strong traits such as leadership, time management, discipline, communication,
            passion, and many other strong qualities that colleges value. These traits are
            reflected on the individual, giving colleges a better understanding of who you are
            and how capable you are as both a student and an athlete, and could potentially
            have a significant impact on your college application.
          </p>
        </div>

        <div className="mt-6">
          <Callout label="College admissions">
            <p>
              You should ask your teachers/coaches for recommendations later in your high
              school career (usually around 11th grade/junior year). Colleges especially value
              recommendations from someone who knows you for the long-term!
            </p>
            <p className="mt-3">
              So, make sure you talk to your coaches and show strong character throughout your
              time in sports.
            </p>
          </Callout>
        </div>
      </section>

      <section>
        <H2>What sports are in high school</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          Although the sports actually available at your specific school may vary, common
          sports in high school include football, baseball, basketball, soccer, tennis, golf,
          and others. There may also be clubs for sports that aren't "officially" offered as a
          school course, such as Badminton Club, Pickleball Club, Bowling Club, or others.
        </p>

        <Callout label="Tip">
          <p>
            If there's a sport you're interested in but isn't offered at school as either a
            course or as a club, you could become the founder of a club for that sport! This
            can expose other students to activities they may have never heard about, or allow
            students who were already interested but didn't have a place in school to finally
            be able to play with others.
          </p>
          <p className="mt-3">
            This also shows colleges' strong initiative and leadership potential as part of
            your college application, significantly boosting your chances of being accepted to
            your dream school!
          </p>
        </Callout>
      </section>

      <section>
        <H2>PE requirement</H2>
        <p className="text-ink-soft text-base leading-relaxed mb-6">
          In KatyISD, students are required to fulfill 1.0 credit of "PE" at any time
          throughout their four years in high school. But don't be alarmed! You don't have to
          take, for example, football AND a PE course. In the KatyISD district, sports fulfill
          this requirement. So, if you've signed up for a sports course like Football or
          baseball, for example, and it's on your physical schedule, completing one year of the
          sport completes this PE requirement. Of course, you can continue with the sport for
          the rest of high school even after finishing the requirement.
        </p>

        <Callout label="Don't skip this">
          Make sure to note that playing a sport as part of a club that's not a course offering/
          in your schedule does NOT count towards your PE requirement.
        </Callout>
      </section>

      <section>
        <H2>How does it count towards GPA?</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            Although you might want to play sports in high school, there is something you
            should consider: the effect on your GPA.
          </p>
          <p>
            In KatyISD, for example, having a sports course in your schedule is a 4.0, meaning
            it counts the same as an ACA course (see Nidhish's page for more specific GPA
            breakdowns).
          </p>
        </div>

        <div className="my-6">
          <Callout label="Don't skip this either">
            Playing a sport that's not a course offering/ in your schedule doesn't count
            towards the GPA because, well, it's not going to be in your transcript (which is
            like an album of every class you took, as well as your grades, that's used to
            calculate your GPA).
          </Callout>
        </div>

        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            So, if your goal is to obtain the highest GPA possible, saving your sports
            requirement until 12th grade, also known as senior year, is likely something you're
            considering. However, waiting until 12th grade also has its own downsides. Waiting
            until senior year means missing out on a lot of the friends, activities, events, and
            memories that people cherish and rejoice in when it comes time to leave high school.
          </p>
          <p>
            A more physical downside, however, is more blunt; an incoming senior MUST make the
            varsity team, or they're cut. This might not be true for all sports in high school,
            but for sports like tennis, you either make it or you don't.
          </p>
        </div>
      </section>

      <section>
        <H2>Tryout process</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            As mentioned previously, going to sports as an incoming 12th grader/senior often
            means you either make it or you're cut.
          </p>
          <p>
            The tryouts for sports are often held sometime in the summer. When it specifically
            is would be depending on the sport, and even when the coaches set the tryout date,
            so make sure you join your sports' mode of communication, ex, SportsYou, to stay
            updated.
          </p>
          <p>
            Your coaches may also hold practices for anyone who is going to be trying out in
            the weeks leading up to your actual tryout. If you can, attend them! This gives you
            a chance to talk to your coaches and peers who may have already been on the team,
            and make new friends. This gives you the opportunity to find out what the school
            year with your involvement in sports is like, and overall gives you a feel for what
            your new homecourt/homefield feels and looks like.
          </p>
        </div>

        <div className="my-6">
          <Callout label="Important">
            <p>
              A Physical (from RankOne and to be submitted to RankONE) is required to try out
              for your chosen sport. Physicals do expire, so you should renew them anytime
              after May 1st. However, keep in mind when your tryout date is. It can be
              difficult to get a Physical form filled out by a doctor on short notice, so keep
              that timeframe in mind. If possible, getting the Physical form filled at the
              start of the summer is most likely optimal, as most students may be waiting later
              into the middle/end of the summer to get their Physicals checked.
            </p>
          </Callout>
        </div>

        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            A Health form is also required, which can be found from the same place you'll find the
            Physical Form on the RankOne website.
          </p>
          <p>
            The Physical and Health Form pictures should be taken separately, as the RankOne
            upload submission will most likely ask for their files to be uploaded separately.
          </p>
        </div>

        <div className="mt-6">
          <Callout label="Tips for tryouts">
            Don't feel pressured during these practices or during your actual tryouts! I know
            you've probably heard something like this before, but it's crucial to understand.
            Just because someone is older or more experienced or looks cooler, or any other
            reason, doesn't mean you need to shrink up mentally. Play your best! Play the game
            you love and the game you've practiced, and win! Even if you lose, playing the way
            you love the game can show the coach how passionate and how strong your mentality
            and mindset are in a live match.
          </Callout>
        </div>

        <p className="text-ink-soft text-base leading-relaxed italic mt-6">
          Good luck and have fun at tryouts!
        </p>
      </section>

      <section>
        <H2>Practice schedule/time commitment</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            After playing your very best and making the team, your Coach may inform or post you
            about your practice schedule and your game days. Practices can vary from early in
            the morning at 5:30 or 6 am to after school when the sun is raining down.
          </p>
          <p>
            However, it's important, especially as a 9th grader, to show up to practice as much
            as possible to show your commitment and dedication to improving your game.
          </p>
          <p>
            At the end of the day, Coach doesn't care if you're the best player in the world but
            you don't show up to practice and don't care for the team. In high school, sports
            are a team effort, not an individual one. Even if you're playing a 1v1, your whole
            team is there to cheer you and your peers on, no matter what. Your team is your
            community.
          </p>
        </div>
      </section>

      <section>
        <H2>Tournaments</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            Although it's usually more common in the second semester, you might miss an entire
            day of school to be out with your sports team.
          </p>
          <p>Always remember to stay on top of your school work. You are primarily a student, after all.</p>
          <p>
            Make sure to alert your teachers in advance if you know you're going to miss a day
            of school for a game/tournament with your team so you and your teacher can set up a
            time to do make-up work or a quiz/test.
          </p>
        </div>
      </section>

      <section>
        <H2>GPA exemption</H2>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            If you have signed up to play your sport for two or more years in a row, you should
            be eligible for a GPA exemption.
          </p>
          <p>
            The GPA exemption tile for KatyISD is called "GPA Exempt", and begins IN 10th
            grade. You should apply for this as soon as possible after the year starts. If it's
            your second year in the course in a row, you should be able to click on it to
            exempt the class from your transcript/GPA.
          </p>
        </div>

        <ul className={`${ul} mt-4`}>
          <li>Each student only gets 3.0 credits of total GPA exemptions</li>
          <li>0.5 credits = 1 semester, so to GPA exempt the whole year of the course it will take 1.0 credits</li>
        </ul>

        <H3>What does it mean?</H3>
        <div className="space-y-4 text-ink-soft text-base leading-relaxed">
          <p>
            It means that the sports course you're in can be absolved or released from the 4.0
            GPA that comes with taking the class.
          </p>
          <p>In other words, this simply means that it doesn't count towards your GPA.</p>
          <p>
            Strategically, GPA exempting the class can boost your GPA if you're above a 4.0
            GPA, since it takes away the equivalent of an ACA course (or getting a B in a KAP or
            AP class), boosting your GPA closer to a 5.0.
          </p>
        </div>
      </section>

      <section>
        <H2>Costs</H2>
        <p className="text-ink-soft text-base leading-relaxed">
          The specific costs depend on the sport, but all sports' fees are payable through the
          Pay 'N Go tile for KatyISD.
        </p>
      </section>
    </article>
  );
}
