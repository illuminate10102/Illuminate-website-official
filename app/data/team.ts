export type TeamRole = {
  slug: string;
  title: string;
  singular: string;
  subtitle: string;
  responsibilities: string[];
};

export const teamRoles: TeamRole[] = [
  {
    slug: "directors",
    title: "Directors",
    singular: "Director",
    subtitle: "",
    responsibilities: [
      "Nidhish Kakkireni",
      "Arnav Joshi",
      "Dhruv Nandy",
      "Sarvesh Shanthibooshan Subramanian",
      "Vinh Tran"
    ],
  },
  {
    slug: "vice-presidents",
    title: "Vice Presidents",
    singular: "Vice President",
    subtitle: "",
    responsibilities: [
      "Lead a section of the nonprofit",
      "Visual Media VP",
      "Website Assistance VP",
      "Outreach VP",
    ],
  },
  {
    slug: "officers",
    title: "Officers",
    singular: "Officer",
    subtitle: "",
    responsibilities: [
      "Manage associates based on their expertise",
      "Coordinate in-person activities and webinars",
      "Lead a section of the website (e.g. Arts & Performance)",
    ],
  },
  {
    slug: "associates",
    title: "Associates",
    singular: "Associate",
    subtitle: "",
    responsibilities: [
      "Write content for their area of expertise, using guidance and materials from officers",
      "Help volunteer at in-person activities",
      "Follow each article's writing guidelines",
    ],
  },
  {
    slug: "members",
    title: "Members",
    singular: "Member",
    subtitle: "Community",
    responsibilities: ["Use our materials", "Attend our meetings"],
  },
];
