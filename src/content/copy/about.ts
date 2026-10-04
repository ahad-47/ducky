import { facts } from "@/content/facts";

const f = facts.founder;

export const aboutCopy = {
  eyebrow: "About",
  h1: "Who built SkilledScan",
  photoAlt: `${f.name}, cybersecurity consultant and founder of SkilledScan`,
  emailLabel: "Email Ahad",
  linkedinLabel: "LinkedIn",
  credentials: { eyebrow: "Recognition", h2: "Certifications and recognition" },
  expertise: {
    eyebrow: "Expertise",
    h2: "What Ahad Ansari works on",
    intro: "Drawn from the client projects he has delivered since 2017.",
  },
  skills: { h3: "Skills", tools: "Tools", sectors: "Sectors" },
  countries: {
    eyebrow: "Reach",
    h2: `Clients in ${facts.globalReach.countries} countries`,
    intro: "Clients include teams in these countries, among others.",
  },
  work: {
    eyebrow: "Track record",
    h2: "Selected projects",
    intro: "A sample of past client work. Client names are withheld.",
  },
  contact: {
    h2: "Work with Ahad Ansari",
    body: "For a penetration test, a security assessment or help with an incident, email him directly or connect on LinkedIn.",
  },
} as const;
