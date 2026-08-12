import type { IconName } from "../components/Icon";

export type Course = {
  slug: string;
  title: string;
  blurb: string;
  kind: "core" | "ap";
};

export type Subject = {
  slug: string;
  label: string;
  icon: IconName;
  hue: number;
  courses: Course[];
};

export const subjects: Subject[] = [
  {
    slug: "humanities",
    label: "Humanities",
    icon: "book-open",
    hue: 340,
    courses: [
      { slug: "english-1", title: "English I", blurb: "Foundational literature and writing — the building blocks for every English class after this.", kind: "core" },
      { slug: "english-2", title: "English II", blurb: "World literature and essay writing, one level up from freshman year.", kind: "core" },
      { slug: "english-3", title: "English III", blurb: "American literature, paired with the essay skills colleges actually look for.", kind: "core" },
      { slug: "english-4", title: "English IV", blurb: "British literature and college-level writing, the last English class before you're on your own.", kind: "core" },
      { slug: "spanish-1", title: "Spanish I", blurb: "Starting from scratch — basic conversation, grammar, and vocabulary.", kind: "core" },
      { slug: "art-1", title: "Art I", blurb: "Foundational drawing, painting, and design — no experience required.", kind: "core" },
      { slug: "speech-debate", title: "Speech & Debate", blurb: "Public speaking and argument, whether you're naturally good at it or terrified of it.", kind: "core" },
      { slug: "ap-english-language", title: "AP English Language and Composition", blurb: "Analyzing and writing nonfiction — rhetoric, argument, and how language actually persuades.", kind: "ap" },
      { slug: "ap-english-literature", title: "AP English Literature and Composition", blurb: "Close reading fiction and poetry, and writing the kind of essays that show it.", kind: "ap" },
      { slug: "ap-art-history", title: "AP Art History", blurb: "The history of art as a story, from cave paintings to contemporary work.", kind: "ap" },
      { slug: "ap-music-theory", title: "AP Music Theory", blurb: "How music is actually built — notation, harmony, and ear training.", kind: "ap" },
      { slug: "ap-2d-art-and-design", title: "AP 2-D Art and Design", blurb: "Building a portfolio in drawing, painting, or design across two dimensions.", kind: "ap" },
      { slug: "ap-3d-art-and-design", title: "AP 3-D Art and Design", blurb: "Sculpture, ceramics, and other three-dimensional work, built into a portfolio.", kind: "ap" },
      { slug: "ap-drawing", title: "AP Drawing", blurb: "A portfolio built entirely around drawing — observation, technique, and a personal voice.", kind: "ap" },
      { slug: "ap-spanish-language", title: "AP Spanish Language and Culture", blurb: "Advanced Spanish conversation, writing, and culture, at a near-fluent level.", kind: "ap" },
      { slug: "ap-spanish-literature", title: "AP Spanish Literature and Culture", blurb: "Reading and analyzing literature written in Spanish, for students who are already fluent.", kind: "ap" },
      { slug: "ap-french-language", title: "AP French Language and Culture", blurb: "Advanced French across speaking, writing, listening, and reading.", kind: "ap" },
      { slug: "ap-german-language", title: "AP German Language and Culture", blurb: "Advanced German across speaking, writing, listening, and reading.", kind: "ap" },
      { slug: "ap-italian-language", title: "AP Italian Language and Culture", blurb: "Advanced Italian across speaking, writing, listening, and reading.", kind: "ap" },
      { slug: "ap-japanese-language", title: "AP Japanese Language and Culture", blurb: "Advanced Japanese across speaking, writing, listening, and reading.", kind: "ap" },
      { slug: "ap-chinese-language", title: "AP Chinese Language and Culture", blurb: "Advanced Mandarin across speaking, writing, listening, and reading.", kind: "ap" },
      { slug: "ap-latin", title: "AP Latin", blurb: "Reading Latin poetry and prose in the original — Virgil and Caesar included.", kind: "ap" },
    ],
  },
  {
    slug: "math",
    label: "Math",
    icon: "calculator",
    hue: 264,
    courses: [
      { slug: "algebra-1", title: "Algebra I", blurb: "Variables, equations, and graphing — the foundation for every math class after it.", kind: "core" },
      { slug: "geometry", title: "Geometry", blurb: "Shapes, proofs, and spatial reasoning, with an emphasis on why things are true.", kind: "core" },
      { slug: "algebra-2", title: "Algebra II", blurb: "Building on Algebra I with more complex functions, logarithms, and equations.", kind: "core" },
      { slug: "precalculus", title: "Precalculus", blurb: "Trigonometry and advanced functions, built specifically to get you ready for calculus.", kind: "core" },
      { slug: "statistics", title: "Statistics", blurb: "Making sense of data — probability, distributions, and how to not be fooled by numbers.", kind: "core" },
      { slug: "ap-calculus-ab", title: "AP Calculus AB", blurb: "Limits, derivatives, and integrals — the first semester of college calculus.", kind: "ap" },
      { slug: "ap-calculus-bc", title: "AP Calculus BC", blurb: "Everything in AB plus series and more advanced integration — a full year of college calculus.", kind: "ap" },
      { slug: "ap-statistics", title: "AP Statistics", blurb: "College-level statistics — designing studies, analyzing data, and drawing real conclusions from it.", kind: "ap" },
      { slug: "ap-computer-science-a", title: "AP Computer Science A", blurb: "Programming in Java, with a real focus on object-oriented design.", kind: "ap" },
      { slug: "ap-computer-science-principles", title: "AP Computer Science Principles", blurb: "A broader look at computing — less code, more of how computing actually works.", kind: "ap" },
    ],
  },
  {
    slug: "science",
    label: "Science",
    icon: "atom",
    hue: 165,
    courses: [
      { slug: "biology", title: "Biology", blurb: "Cells, genetics, and ecosystems — the foundation for every science class after it.", kind: "core" },
      { slug: "chemistry", title: "Chemistry", blurb: "Atoms, reactions, and the math behind them.", kind: "core" },
      { slug: "physics", title: "Physics", blurb: "Motion, forces, and energy, explained with the math to back it up.", kind: "core" },
      { slug: "environmental-science", title: "Environmental Science", blurb: "How ecosystems, climate, and human impact actually connect.", kind: "core" },
      { slug: "anatomy-physiology", title: "Anatomy & Physiology", blurb: "How the human body is built, and how it actually works.", kind: "core" },
      { slug: "ap-biology", title: "AP Biology", blurb: "College-level biology — molecular processes, genetics, and ecology, with a heavy lab component.", kind: "ap" },
      { slug: "ap-chemistry", title: "AP Chemistry", blurb: "College-level chemistry, with the lab work and problem sets to match.", kind: "ap" },
      { slug: "ap-physics-1", title: "AP Physics 1", blurb: "Algebra-based physics covering mechanics — motion, forces, and energy.", kind: "ap" },
      { slug: "ap-physics-2", title: "AP Physics 2", blurb: "Algebra-based physics covering electricity, magnetism, fluids, and modern physics.", kind: "ap" },
      { slug: "ap-physics-c-mechanics", title: "AP Physics C: Mechanics", blurb: "Calculus-based physics, mechanics only — the version engineering majors usually take.", kind: "ap" },
      { slug: "ap-physics-c-em", title: "AP Physics C: Electricity and Magnetism", blurb: "Calculus-based physics covering circuits, fields, and electromagnetism.", kind: "ap" },
      { slug: "ap-environmental-science", title: "AP Environmental Science", blurb: "College-level environmental science — ecosystems, pollution, and policy, backed by real data.", kind: "ap" },
    ],
  },
  {
    slug: "social-studies",
    label: "Social studies",
    icon: "globe",
    hue: 35,
    courses: [
      { slug: "world-geography", title: "World Geography", blurb: "How physical geography and human history actually shape each other.", kind: "core" },
      { slug: "world-history", title: "World History", blurb: "A survey of world history from ancient civilizations to the modern era.", kind: "core" },
      { slug: "us-history", title: "US History", blurb: "American history from colonization through the present.", kind: "core" },
      { slug: "us-government", title: "US Government", blurb: "How the US government actually works, beyond what you learned in middle school.", kind: "core" },
      { slug: "economics", title: "Economics", blurb: "The basics of how markets, money, and policy actually work.", kind: "core" },
      { slug: "ap-us-history", title: "AP US History", blurb: "College-level American history — same story, a lot more primary sources and analysis.", kind: "ap" },
      { slug: "ap-world-history-modern", title: "AP World History: Modern", blurb: "A college-level survey of world history from around 1200 CE to today.", kind: "ap" },
      { slug: "ap-european-history", title: "AP European History", blurb: "College-level European history from the Renaissance to the present.", kind: "ap" },
      { slug: "ap-us-government", title: "AP US Government and Politics", blurb: "A closer, more analytical look at how US government and politics actually function.", kind: "ap" },
      { slug: "ap-comparative-government", title: "AP Comparative Government and Politics", blurb: "Comparing how different countries' governments and political systems actually work.", kind: "ap" },
      { slug: "ap-human-geography", title: "AP Human Geography", blurb: "How population, culture, and geography shape each other — a common freshman-year AP.", kind: "ap" },
      { slug: "ap-psychology", title: "AP Psychology", blurb: "An introduction to how the brain and behavior actually work.", kind: "ap" },
      { slug: "ap-macroeconomics", title: "AP Macroeconomics", blurb: "How economies work at the national level — inflation, growth, and policy.", kind: "ap" },
      { slug: "ap-microeconomics", title: "AP Microeconomics", blurb: "How individual markets, businesses, and consumers actually make decisions.", kind: "ap" },
      { slug: "ap-african-american-studies", title: "AP African American Studies", blurb: "An interdisciplinary look at African American history, culture, and literature.", kind: "ap" },
    ],
  },
  {
    slug: "other",
    label: "Other",
    icon: "lightbulb",
    hue: 55,
    courses: [
      { slug: "health", title: "Health", blurb: "The basics your school requires you to know — usually a one-semester class.", kind: "core" },
      { slug: "personal-finance", title: "Personal Finance", blurb: "Budgeting, credit, and taxes — the money class that's actually useful later.", kind: "core" },
      { slug: "journalism", title: "Journalism", blurb: "Reporting, writing, and running a real publication, usually the school newspaper.", kind: "core" },
      { slug: "yearbook", title: "Yearbook", blurb: "Design, photography, and deadlines — producing the actual yearbook.", kind: "core" },
      { slug: "physical-education", title: "Physical Education", blurb: "The credit you need, in whatever form your school offers it.", kind: "core" },
      { slug: "ap-seminar", title: "AP Seminar", blurb: "Research, argument, and presentation skills — the first course in the AP Capstone program.", kind: "ap" },
      { slug: "ap-research", title: "AP Research", blurb: "An independent, year-long research project — the second course in the AP Capstone program, built on AP Seminar.", kind: "ap" },
    ],
  },
];

export function getSubject(slug: string | undefined): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}

export function getCourse(
  subjectSlug: string | undefined,
  courseSlug: string | undefined,
): { subject: Subject; course: Course } | undefined {
  const subject = getSubject(subjectSlug);
  if (!subject) return undefined;
  const course = subject.courses.find((c) => c.slug === courseSlug);
  if (!course) return undefined;
  return { subject, course };
}

export type SubjectSearchResult = { subject: Subject; course: Course };

export function searchSubjectCourses(query: string, limit = 6): SubjectSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: (SubjectSearchResult & { score: number })[] = [];
  for (const subject of subjects) {
    for (const course of subject.courses) {
      const title = course.title.toLowerCase();
      let score = 0;
      if (title === q) score = 4;
      else if (title.startsWith(q)) score = 3;
      else if (title.includes(q)) score = 2;
      else if (course.blurb.toLowerCase().includes(q) || subject.label.toLowerCase().includes(q)) score = 1;

      if (score > 0) scored.push({ subject, course, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.course.title.localeCompare(b.course.title));
  return scored.slice(0, limit).map(({ subject, course }) => ({ subject, course }));
}
