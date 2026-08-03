import type { IconName } from "../components/Icon";

export type Field = {
  slug: string;
  title: string;
  blurb: string;
  code: string;
  icon: IconName;
};

export type Tier = {
  label: string;
  hue: number;
  fields: Field[];
};

export type Category = {
  slug: string;
  code: string;
  label: string;
  intro: string;
  tiers: Tier[];
};

type RawField = { slug: string; title: string; blurb: string; icon: IconName };
type RawTier = { label: string; hue: number; fields: RawField[] };
type RawCategory = {
  slug: string;
  code: string;
  label: string;
  intro: string;
  tiers: RawTier[];
};

const raw: RawCategory[] = [
  {
    slug: "extracurriculars",
    code: "EC",
    label: "Extracurriculars",
    intro: "",
    tiers: [
      {
        label: "Arts & performance",
        hue: 350,
        fields: [
          { slug: "fine-arts", title: "Fine arts", blurb: "Where music, art, and theater meet your application.", icon: "palette" },
          { slug: "video-photography", title: "Video & photography", blurb: "Turning a phone camera into a real portfolio.", icon: "camera" },
          { slug: "presentations", title: "Presentations & TED-Ed", blurb: "Getting picked to speak, and what to say once you're up there.", icon: "mic" },
        ],
      },
      {
        label: "Professional experience",
        hue: 195,
        fields: [
          { slug: "internships", title: "Internships", blurb: "Finding one as a high schooler, plus a searchable directory of real programs and Houston events.", icon: "briefcase" },
          { slug: "apprenticeships", title: "Apprenticeships", blurb: "Hands-on training that teaches you a real skill before college does.", icon: "wrench" },
          { slug: "jobs", title: "Jobs & employment", blurb: "Part-time work, and what colleges actually think of a paycheck.", icon: "dollar" },
          { slug: "freelancing", title: "Freelancing", blurb: "Getting paid for a skill you already have, on your own schedule.", icon: "briefcase" },
          { slug: "shadowing", title: "Shadowing", blurb: "Spending a day with someone doing the job you think you want.", icon: "search" },
          { slug: "interview-strategies", title: "Interview strategies", blurb: "Talking about your activities out loud without freezing up.", icon: "chat" },
        ],
      },
      {
        label: "Academic & research",
        hue: 265,
        fields: [
          { slug: "research", title: "Research programs", blurb: "A searchable list of real summer research programs, filterable by cost, format, and who's eligible.", icon: "atom" },
          { slug: "competitions", title: "Competitions", blurb: "Academic and creative competitions that are actually worth your weekends.", icon: "trophy" },
          { slug: "clubs", title: "Clubs & organizations", blurb: "Which clubs are worth joining, and which ones just eat your afternoons.", icon: "network" },
          { slug: "nonprofits", title: "Nonprofits", blurb: "Starting or joining one that does more than look good on paper.", icon: "heart" },
          { slug: "college-app-tiers", title: "College app tiers", blurb: "How admissions officers actually rank the things you did.", icon: "medal" },
        ],
      },
      {
        label: "Growth & community",
        hue: 140,
        fields: [
          { slug: "volunteering", title: "Volunteering", blurb: "How much is enough, and how to find work that isn't just a signature on a form.", icon: "heart" },
          { slug: "sports", title: "Sports", blurb: "How sports affect your GPA and PE requirement in Katy ISD, and what tryouts actually look like.", icon: "trophy" },
          { slug: "passion-projects", title: "Passion projects", blurb: "Building something nobody assigned you — that's the one that stands out.", icon: "rocket" },
          { slug: "travel-programs", title: "Travel programs", blurb: "Study-abroad and travel programs worth the cost — and the ones that aren't.", icon: "globe" },
          { slug: "guest-speakers", title: "Guest speakers", blurb: "Bringing in outside voices for your club or class, and getting it approved.", icon: "megaphone" },
          { slug: "officer-positions", title: "Officer positions", blurb: "How to actually get elected, not just show up to meetings.", icon: "flag" },
          { slug: "visa-international", title: "Visa & international", blurb: "Extracurriculars and applications for international and visa students.", icon: "shield" },
        ],
      },
    ],
  },
  {
    slug: "academics",
    code: "AC",
    label: "Academics",
    intro: "",
    tiers: [
      {
        label: "GPA & Performance",
        hue: 55,
        fields: [
          { slug: "gpa-strategy", title: "GPA strategy", blurb: "How weighted GPA actually gets calculated, and how to build a schedule that keeps yours competitive.", icon: "trending-up" },
          { slug: "gpa-calculator", title: "GPA calculator", blurb: "A tool for figuring out exactly what your next test needs to be.", icon: "calculator" },
          { slug: "ap-course-advice", title: "AP course advice", blurb: "Which AP classes are worth the workload, and which ones aren't.", icon: "medal" },
          { slug: "dual-credit", title: "Dual credit", blurb: "Earning college credit in high school, and whether it's worth doing.", icon: "document" },
          { slug: "credit-by-exam", title: "Credit By Exam(CBE)", blurb: "How the Katy ISD Credit by Exam actually works, from picking the right test to what happens if you don't pass.", icon: "clipboard-check" },
        ],
      },
      {
        label: "Study Strategies",
        hue: 240,
        fields: [
          { slug: "efficient-studying", title: "Efficient studying", blurb: "A way of studying that holds up under pressure, not just when you have time to spare.", icon: "book-open" },
          { slug: "memory-techniques", title: "Memory techniques", blurb: "Why re-reading your notes doesn't work, and the active recall method that actually does.", icon: "brain" },
          { slug: "essay-writing", title: "Essay writing", blurb: "Writing essays for class that don't sound like everyone else's.", icon: "pen-nib" },
          { slug: "study-resources", title: "Study resources", blurb: "A running list of the free websites, tools, and YouTube channels that actually help each subject click.", icon: "search-check" },
        ],
      },
      {
        label: "Planning & Strategy",
        hue: 305,
        fields: [
          { slug: "course-selection-strategy", title: "Course selection strategy", blurb: "Building a schedule around where you're actually headed.", icon: "compass" },
          { slug: "career-pathways", title: "Career pathways", blurb: "Figuring out what you might want to do, without picking wrong.", icon: "map" },
          { slug: "exemption-strategy", title: "Exemption strategy", blurb: "Skipping requirements you've already outgrown.", icon: "shield" },
          { slug: "summer-courses", title: "Summer courses", blurb: "Getting ahead over the summer without giving up your break.", icon: "calendar" },
        ],
      },
    ],
  },
  {
    slug: "testing",
    code: "ST",
    label: "Standardized testing",
    intro: "",
    tiers: [
      {
        label: "Standardized Tests",
        hue: 25,
        fields: [
          { slug: "sat", title: "SAT", blurb: "What's on it, how it's scored, and where to start.", icon: "document" },
          { slug: "act", title: "ACT", blurb: "How it's different from the SAT, and which one fits you better.", icon: "clipboard-check" },
          { slug: "psat", title: "PSAT", blurb: "The practice run that quietly matters for scholarships.", icon: "star" },
          { slug: "staar", title: "STAAR", blurb: "What it is, and how much it actually affects you.", icon: "flag" },
        ],
      },
      {
        label: "Strategy & Resources",
        hue: 205,
        fields: [
          { slug: "study-plans", title: "Study plans", blurb: "A prep schedule that fits around school instead of replacing it.", icon: "calendar" },
          { slug: "free-resources", title: "Free resources", blurb: "Prep material that costs nothing and actually works.", icon: "book-open" },
          { slug: "score-improvement", title: "Practice & score improvement", blurb: "How to use practice tests without wasting them.", icon: "trending-up" },
          { slug: "transfer-pathways", title: "Transfer pathways", blurb: "Community college routes into UH, A&M, and UT.", icon: "map" },
        ],
      },
    ],
  },
  {
    slug: "lifestyle",
    code: "LF",
    label: "Lifestyle",
    intro: "",
    tiers: [
      {
        label: "Productivity",
        hue: 45,
        fields: [
          { slug: "time-management", title: "Time management", blurb: "A five-step system for organizing your week, plus which planner actually fits how you work.", icon: "clock" },
          { slug: "study-schedules", title: "Study schedules", blurb: "Blocking out a week so studying doesn't eat every evening.", icon: "calendar" },
          { slug: "pomodoro-technique", title: "Pomodoro technique", blurb: "Short focused bursts, for when your attention span checks out early.", icon: "clock" },
          { slug: "digital-organization", title: "Digital organization", blurb: "Keeping assignments, tabs, and files from turning into chaos.", icon: "document" },
          { slug: "distraction-management", title: "Distraction management", blurb: "Closing the twelve tabs that aren't your homework.", icon: "target" },
          { slug: "staying-committed", title: "Staying committed", blurb: "Finishing what you started in September, in March.", icon: "flag" },
        ],
      },
      {
        label: "Wellbeing",
        hue: 340,
        fields: [
          { slug: "mental-physical-health", title: "Mental & physical health", blurb: "Taking care of yourself without treating it like extra homework.", icon: "heart" },
          { slug: "gym-fitness", title: "Gym & fitness", blurb: "Building a habit that sticks past the first two weeks.", icon: "dumbbell" },
          { slug: "meditation", title: "Meditation", blurb: "A few quiet minutes that actually change the rest of your day.", icon: "moon" },
          { slug: "discipline-motivation", title: "Discipline & motivation", blurb: "What to do on the days you don't feel like doing anything.", icon: "target" },
          { slug: "spiritual-grounding", title: "Spiritual grounding", blurb: "Finding steadiness in something bigger than your GPA.", icon: "leaf" },
          { slug: "friendships", title: "Friendships", blurb: "Keeping the people around you close while everything else gets busier.", icon: "users" },
        ],
      },
      {
        label: "Skills",
        hue: 285,
        fields: [
          { slug: "ai-literacy", title: "AI literacy", blurb: "Using new tools well, and knowing where the line is.", icon: "brain" },
          { slug: "critical-thinking", title: "Critical thinking", blurb: "Questioning what you read before you repeat it.", icon: "lightbulb" },
          { slug: "networking", title: "Networking & connections", blurb: "Meeting people who can actually help, without it feeling transactional.", icon: "network" },
          { slug: "social-media-usage", title: "Social media usage", blurb: "Using it without letting it use your whole evening.", icon: "megaphone" },
        ],
      },
    ],
  },
  {
    slug: "college",
    code: "CP",
    label: "College",
    intro: "",
    tiers: [
      {
        label: "Choosing a College",
        hue: 250,
        fields: [
          { slug: "how-to-choose", title: "How to choose", blurb: "The questions to ask yourself before you start comparing schools by their rankings.", icon: "compass" },
          { slug: "building-a-list", title: "Building your list", blurb: "Reach, target, and safety schools that actually fit you.", icon: "document" },
        ],
      },
      {
        label: "Applications",
        hue: 70,
        fields: [
          { slug: "building-your-narrative", title: "Building your narrative", blurb: "Connecting your classes, activities, and essays into one story.", icon: "pen-nib" },
          { slug: "essays", title: "Essays", blurb: "Finding a story worth telling instead of sounding like everyone else.", icon: "pen-nib" },
          { slug: "applications", title: "Applications", blurb: "The Common App, deadlines, and the small details people forget.", icon: "document" },
          { slug: "recommendation-letters", title: "Letters of recommendation", blurb: "Who to ask, when to ask, and what to give them.", icon: "users" },
          { slug: "application-timeline", title: "Application timeline", blurb: "What to do freshman through senior year, in order.", icon: "calendar" },
        ],
      },
      {
        label: "Financial",
        hue: 150,
        fields: [
          { slug: "scholarships", title: "Scholarships", blurb: "Free money worth the time it takes to apply for.", icon: "dollar" },
          { slug: "financial-aid-basics", title: "Financial aid basics", blurb: "FAFSA, the CSS Profile, and how aid actually gets decided.", icon: "dollar" },
        ],
      },
    ],
  },
  {
    slug: "summer",
    code: "SP",
    label: "Summer planning",
    intro: "",
    tiers: [
      {
        label: "Planning & Programs",
        hue: 95,
        fields: [
          { slug: "planning-your-summer", title: "Planning your summer", blurb: "Turning a free summer into something worth mentioning later.", icon: "calendar" },
          { slug: "summer-programs", title: "Summer programs", blurb: "Which ones are worth the cost, and which ones aren't.", icon: "sun" },
          { slug: "deadline-calendar", title: "Deadline calendar", blurb: "A month-by-month list so you're not applying in a panic in June.", icon: "clock" },
        ],
      },
      {
        label: "Building Experience",
        hue: 190,
        fields: [
          { slug: "research-programs", title: "Research programs", blurb: "Getting into a lab or project over the summer, not just during the year.", icon: "atom" },
          { slug: "internships", title: "Internships", blurb: "Finding summer work that actually adds to your story.", icon: "briefcase" },
          { slug: "competition-prep", title: "Competition prep", blurb: "Using the summer to get ready for competitions in the fall.", icon: "trophy" },
        ],
      },
      {
        label: "On Your Own Time",
        hue: 315,
        fields: [
          { slug: "jobs", title: "Jobs", blurb: "Paid work that still counts for something.", icon: "dollar" },
          { slug: "passion-projects", title: "Passion projects", blurb: "Building something on your own when no program fits.", icon: "rocket" },
          { slug: "independent-projects", title: "Independent projects", blurb: "Starting something without a program telling you how.", icon: "rocket" },
          { slug: "rest", title: "Rest", blurb: "Why doing nothing for part of the summer is still a good decision.", icon: "moon" },
        ],
      },
    ],
  },
];

export const categories: Category[] = raw.map((c) => ({
  ...c,
  tiers: c.tiers.map((tier, tierIndex) => ({
    label: tier.label,
    hue: tier.hue,
    fields: tier.fields.map((field, fieldIndex) => ({
      ...field,
      code: `${c.code} ${(tierIndex + 1) * 100 + (fieldIndex + 1)}`,
    })),
  })),
}));

export function getCategory(slug: string | undefined): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryFieldCount(category: Category): number {
  return category.tiers.reduce((sum, tier) => sum + tier.fields.length, 0);
}

export function getField(
  categorySlug: string | undefined,
  fieldSlug: string | undefined,
): { category: Category; tier: Tier; field: Field } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  for (const tier of category.tiers) {
    const field = tier.fields.find((f) => f.slug === fieldSlug);
    if (field) return { category, tier, field };
  }
  return undefined;
}

export type SearchResult = { category: Category; field: Field };

/** Ranked substring search over every field's title, blurb, and category label. */
export function searchFields(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: (SearchResult & { score: number })[] = [];
  for (const category of categories) {
    const categoryLabel = category.label.toLowerCase();
    for (const tier of category.tiers) {
      for (const field of tier.fields) {
        const title = field.title.toLowerCase();
        let score = 0;
        if (title === q) score = 4;
        else if (title.startsWith(q)) score = 3;
        else if (title.includes(q)) score = 2;
        else if (field.blurb.toLowerCase().includes(q) || categoryLabel.includes(q)) score = 1;

        if (score > 0) scored.push({ category, field, score });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score || a.field.title.localeCompare(b.field.title));
  return scored.slice(0, limit).map(({ category, field }) => ({ category, field }));
}
