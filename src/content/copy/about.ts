import { facts } from "@/content/facts";

const f = facts.founder;

export const aboutCopy = {
  eyebrow: "About",
  h1: "Who builds SkilledScan",
  intro: `SkilledScan is founded and built by ${f.name}, a penetration tester based in ${f.location}, with ${f.stats[0].value} client security projects delivered since ${f.since}.`,
  statsNote: `Figures as of ${f.checkedOn}.`,
  credentials: { eyebrow: "Recognition", h2: "Certifications and recognition" },
  countries: {
    eyebrow: "Reach",
    h2: `Clients in ${f.countries.length} countries`,
    intro: "Number of reviewed projects per client country.",
  },
  work: {
    eyebrow: "Track record",
    h2: "Selected projects",
    intro: "A sample of past client work. Client names are withheld.",
  },
  sectors: "Sectors served",
} as const;
