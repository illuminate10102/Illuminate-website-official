export type AnnualConference = {
  month: string;
  event: string;
  field: string;
  venue: string;
  studentAccess: string;
};

/** Ordered the way the year actually runs, not alphabetically — that order is
 *  what makes the table useful when you're skimming for "what's coming up." */
export const annualConferences: AnnualConference[] = [
  { month: "Jan", event: "Pipeline Pigging & Integrity Management", field: "Pipeline engineering", venue: "George R. Brown", studentAccess: "Professional, ask about student rate" },
  { month: "Feb", event: "TMC AI Summit", field: "Healthcare AI", venue: "TCH Neurological Research Institute", studentAccess: "Academic, students often welcome" },
  { month: "Feb-Mar", event: "Energy HPC & AI Conference", field: "HPC, AI, energy", venue: "Rice area", studentAccess: "University hosted, most accessible energy event" },
  { month: "Mar", event: "Houston MedTech Rodeo", field: "Medical devices", venue: "Armadillo Palace", studentAccess: "Small (~350), casual, very approachable" },
  { month: "Mar", event: "AMPP Annual Conference", field: "Materials, corrosion", venue: "George R. Brown", studentAccess: "Look for expo only pass" },
  { month: "Mar", event: "CERAWeek", field: "Global energy, policy", venue: "Hilton Americas", studentAccess: "Executive level, realistically out of reach" },
  { month: "Mar", event: "Energy Venture Day (Rice Alliance, Ion, HETI, TEX-E)", field: "Energy startups, VC", venue: "Ion + George R. Brown", studentAccess: "Often free or cheap to attend" },
  { month: "Mar-Apr", event: "H-Town Roundup (formerly Houston Tech Rodeo)", field: "Tech, startups", venue: "Across the city", studentAccess: "Free event series. One of the best on this list" },
  { month: "Apr", event: "Rice Business Plan Competition", field: "Student entrepreneurship", venue: "Rice University", studentAccess: "Student focused, good to attend as audience" },
  { month: "Apr", event: "AI in Oil & Gas", field: "AI in energy", venue: "Hyatt Regency West", studentAccess: "Professional, narrow" },
  { month: "Apr", event: "BioHouston Chili Cookout", field: "Life sciences", venue: "Varies", studentAccess: "Casual, unusually easy to talk to people" },
  { month: "Apr", event: "American LNG Forum", field: "Gas, LNG markets", venue: "Marriott West Loop", studentAccess: "Professional" },
  { month: "May", event: "Offshore Technology Conference (OTC)", field: "Offshore energy, engineering", venue: "NRG Park", studentAccess: "Runs high school programming — see below" },
  { month: "Jun", event: "Energy Projects Conference (EPC Expo)", field: "Engineering, construction", venue: "Varies", studentAccess: "Large, 10,000+. Target the expo floor" },
  { month: "Jun", event: "URTeC", field: "Geoscience, resources", venue: "George R. Brown", studentAccess: "Technical, student rates usually available" },
  { month: "Aug", event: "API Offshore Safe Lifting", field: "Offshore safety", venue: "Westin Memorial City", studentAccess: "Professional, niche" },
  { month: "Sep", event: "Houston Energy & Climate Startup Week", field: "Energy transition", venue: "Across the city", studentAccess: "Week long, lots of free side events" },
  { month: "Sep", event: "BSides Houston", field: "Cybersecurity", venue: "Varies", studentAccess: "Built for students. Cheap, hands-on villages, CTFs" },
  { month: "Sep", event: "Geothermal Rising", field: "Geothermal", venue: "Marriott Marquis", studentAccess: "Professional, project tours are the highlight" },
  { month: "Sep-Oct", event: "HOU.SEC.CON / CYBR.SEC.CON", field: "Cybersecurity", venue: "George R. Brown", studentAccess: "Houston's biggest security con. Student tickets and scholarships exist" },
  { month: "Oct", event: "Wood Mackenzie CCUS", field: "Carbon capture", venue: "Varies", studentAccess: "Professional" },
  { month: "Oct", event: "SPE Annual Technical Conference (ATCE)", field: "Petroleum engineering", venue: "George R. Brown", studentAccess: "Lists students in its audience. SPE student membership is cheap" },
];

export type RecurringEvent = {
  event: string;
  when: string;
  field: string;
  where: string;
  cost: string;
};

export const recurringEvents: RecurringEvent[] = [
  {
    event: "Cup of Joey",
    when: "Every Friday, 8:30–10:30am",
    field: "Tech, startups, general business",
    where: "The Ion (4201 Main St), plus The Woodlands, Space Center Houston, Sugar Land, Cannon West",
    cost: "Free. All ages welcome. RSVP requested",
  },
  { event: "HSC User Group", when: "Monthly", field: "Cybersecurity", where: "Varies", cost: "Free or cheap" },
  { event: "Ion District events", when: "Ongoing", field: "Tech, energy, health", where: "The Ion", cost: "Many free" },
  { event: "React.js HTX", when: "Monthly", field: "Software dev", where: "Ion District", cost: "Free" },
  { event: "Houston Product Community", when: "Monthly", field: "Product, design", where: "Varies", cost: "Free" },
  { event: "The Cannon happy hours", when: "Recurring", field: "Startups, small business", where: "The Cannon", cost: "Free or cheap" },
  {
    event: "Humans of Healthcare (Houston Methodist)",
    when: "Quarterly",
    field: "Healthcare careers",
    where: "The Ion",
    cost: "Free. Panelists talk about their own career paths",
  },
];
