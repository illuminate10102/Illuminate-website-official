export type ProgramCategory = "Federal & government" | "Corporate" | "Houston & Texas" | "Remote";

export type InternshipProgram = {
  name: string;
  category: ProgramCategory;
  eligibility: string;
  description: string;
  timing: string;
  url?: string;
};

export const internshipPrograms: InternshipProgram[] = [
  // ---------------------------------------------------------- Federal & government
  {
    name: "NASA OSTEM",
    category: "Federal & government",
    eligibility: "16+, US citizen, 3.0 GPA, full time student",
    description:
      "Paid work at NASA centers including Johnson Space Center in Houston, alongside NASA scientists and engineers. Some placements are virtual. Three sessions a year.",
    timing: "Spring 2027: Sept 14, 2026. Summer 2027: Feb 26, 2027. Fall 2027: May 21, 2027",
    url: "https://www.nasa.gov/learning-resources/internship-programs/",
  },
  {
    name: "NASA SEES",
    category: "Federal & government",
    eligibility: "Grades 10-11, 16 by early July, US citizen",
    description:
      "Earth and space science research using real NASA satellite data, run with UT Austin's Center for Space Research. Mostly virtual plus two weeks on campus with housing, meals, and travel covered.",
    timing: "Deadline usually late February",
  },
  {
    name: "NIH Summer Internship Program",
    category: "Federal & government",
    eligibility:
      "Usually 11th-12th grade, 16-18, US citizen or permanent resident. Under 18 must live within ~40 miles of the campus",
    description: "Paid 6 to 8 week biomedical research internship in NIH labs, ending in a poster presentation.",
    timing: "2027 cycle opens mid-November 2026, closes mid-February 2027",
    url: "https://www.training.nih.gov/research-training/pb/sip/",
  },
  {
    name: "Smithsonian NMNH High School Internship",
    category: "Federal & government",
    eligibility: "Ages 15-18, grades 9-12 — one of the few open to freshmen",
    description:
      "Stipended museum internship at the National Museum of Natural History across science and non-science departments. Recent stipend was $600/week.",
    timing: "2026: applied Feb 16 to Mar 20, program ran June 23 to Aug 14",
    url: "https://naturalhistory.si.edu/education/youth-programs/high-school-internship-program",
  },
  {
    name: "Fermilab TARGET",
    category: "Federal & government",
    eligibility: "High school juniors from underrepresented backgrounds, US citizen or permanent resident",
    description: "Paid summer internship at the DOE's particle physics lab. Physics, computing, engineering, accelerator tech.",
    timing: "Winter deadlines, check the Fermilab education page",
  },

  // ---------------------------------------------------------------------- Corporate
  {
    name: "Cisco High School Externship",
    category: "Corporate",
    eligibility: "Juniors and seniors",
    description:
      "Two week in-person program covering tech, business, and innovation. Runs in New York City, Austin, and Research Triangle Park — the Austin location makes this the most reachable big corporate program for a Texas student.",
    timing: "Summer 2026 deadline was April 13. Expect a similar spring window",
    url: "https://ciscohs.com/",
  },
  {
    name: "Microsoft Discovery Program",
    category: "Corporate",
    eligibility:
      "Graduating seniors only, 16+, pre-calc done. Must live and attend school within 50 miles of Redmond, WA or around Atlanta, GA. Redmond also requires membership in a Microsoft sponsored org",
    description:
      "Four week paid full time internship. Small pods working on real projects in software engineering, product, and UX. No prior technical experience needed. Paid $26/hr in 2026.",
    timing: "2026 ran July 13 to Aug 7. Applications open the winter before",
    url: "https://careers.microsoft.com/v2/global/en/discoveryprogram",
  },
  {
    name: "Meta Summer Academy",
    category: "Corporate",
    eligibility:
      "Current sophomores only. Must live in East Palo Alto, Belle Haven, North Fair Oaks, or Redwood City, CA. No exceptions, no remote",
    description: "Six week paid program at Menlo Park, about 30 hrs/week, with employee mentors. No coding experience required.",
    timing: "2026 ran June 15 to July 24",
  },
  {
    name: "MITRE Student Programs",
    category: "Corporate",
    eligibility: "9th and 10th graders in STEM — unusually early access",
    description: "Research, development, engineering, and analysis at a nonprofit running federally funded R&D centers.",
    timing: "Check MITRE's student page",
  },
  {
    name: "Genentech Futurelab",
    category: "Corporate",
    eligibility: "Mostly South San Francisco area",
    description:
      "Better known for its biotech curriculum and scholarships than a national internship, though scholarship recipients have gone on to Genentech roles.",
    timing: "Varies",
  },
  {
    name: "Bank of America Student Leaders",
    category: "Corporate",
    eligibility: "Changed for 2026 — no longer high school. Now needs 18+, diploma within 24 months, and 12-18 hours of college credit",
    description:
      "Six week paid nonprofit internship ($17/hr or local minimum, whichever is higher) plus an all expenses paid three day Leadership Summit.",
    timing: "2026: applied Feb 9 to Mar 16",
  },

  // --------------------------------------------------------------- Houston & Texas
  {
    name: "Hire Houston Youth",
    category: "Houston & Texas",
    eligibility: "Ages 16-24",
    description:
      "City initiative connecting young people with paid summer jobs and internships. The City of Houston Summer Jobs Program places students directly in city departments: accounting, public health, parks, police, council offices.",
    timing: "Applications usually open early February for a June start. About eight weeks at 32 hrs/week. City program requires Houston residence",
    url: "https://hirehoustonyouth.org",
  },
  {
    name: "MD Anderson, King Foundation Program",
    category: "Houston & Texas",
    eligibility: "Texas seniors, 18+",
    description: "Ten weeks of cancer research with MD Anderson researchers, plus lectures and seminars.",
    timing: "Stipend recently around $6,800. About 10 spots, extremely competitive",
  },
  {
    name: "MD Anderson, DACCPM Summer Research",
    category: "Houston & Texas",
    eligibility: "Seniors, 18+",
    description:
      "Biomedical and clinical research in Anesthesiology, Critical Care, and Pain Medicine, starting with a cancer biology boot camp. Ends in a poster symposium.",
    timing: "Free",
  },
  {
    name: "Houston Methodist Research Internship",
    category: "Houston & Texas",
    eligibility: "Juniors and seniors, 3.5+ GPA",
    description: "Translational research ending in a poster symposium with faculty.",
    timing: "Free",
  },
  {
    name: "UTHealth Houston",
    category: "Houston & Texas",
    eligibility: "Rising juniors and seniors",
    description: "Research internship in the UTHealth system.",
    timing: "Stipend recently around $750",
  },
  {
    name: "Rice Digital Health Young Scholars",
    category: "Houston & Texas",
    eligibility: "Sophomores and juniors",
    description:
      "Free three week program on digital circuits, CS, physics, and engineering applied to health tech. Work with pulse oximeters, accelerometers.",
    timing: "About 12 spots — one of the few here that takes sophomores",
  },
  {
    name: "Baylor College of Medicine DocPrep",
    category: "Houston & Texas",
    eligibility: "Rising seniors at affiliated South Texas high schools",
    description:
      "One week at the Texas Medical Center: medical lectures, simulation labs, admissions guidance, plus a communication course taught by Rice grad students. 60 students.",
    timing: "Free. Applications go out through affiliated schools starting in March — ask your counselor",
  },
  {
    name: "BCM Saturday Morning Science, Summer Research",
    category: "Houston & Texas",
    eligibility: "18+ by June 1, requires prior Saturday Morning Science participation",
    description: "Eight weeks at ~40 hrs/week in a BCM lab, plus weekly Lunch and Learn sessions.",
    timing: "Unpaid. Saturday Morning Science itself is the way in, so join that earlier in high school",
  },
  {
    name: "Houston Museum of Natural Science",
    category: "Houston & Texas",
    eligibility: "Ages 14-18",
    description: "Helping run summer science camps and giving exhibit hall presentations.",
    timing: "Not called an internship, but it's real supervised work at a real institution, and it takes freshmen",
  },

  // -------------------------------------------------------------------------- Remote
  {
    name: "NASA OSTEM (virtual)",
    category: "Remote",
    eligibility: "Same as the main NASA OSTEM listing",
    description: "Some OSTEM placements are fully remote.",
    timing: "Paid",
  },
  {
    name: "NASA SEES",
    category: "Remote",
    eligibility: "Grades 10-11, 16+, US citizen",
    description: "Mostly virtual with two weeks at UT Austin, travel and housing covered.",
    timing: "Free",
  },
  {
    name: "Johns Hopkins Brain Sciences, virtual track",
    category: "Remote",
    eligibility: "Nationwide",
    description: "Five week remote neuroscience research track.",
    timing: "$500 stipend",
  },
  {
    name: "Johns Hopkins APL, ASPIRE virtual",
    category: "Remote",
    eligibility: "Juniors and seniors nationwide",
    description:
      "Mentored projects at a federally funded lab. R&D support, communications, social impact. In-person tracks are DC/Baltimore only.",
    timing: "Free",
  },
  {
    name: "Smithsonian virtual internships",
    category: "Remote",
    eligibility: "Varies by posting",
    description:
      "Remote research, digital archiving, education programming, communications. Not all are virtual or open to high schoolers, so read each listing.",
    timing: "Varies",
  },
  {
    name: "Kode With Klossy",
    category: "Remote",
    eligibility: "Ages 13-18, young women and gender nonconforming students. No experience needed",
    description: "Free two week virtual coding camps in HTML, CSS, JavaScript, Swift. Not an internship, but a real free credential.",
    timing: "Free",
  },
];
