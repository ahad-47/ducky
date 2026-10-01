import { facts } from "@/content/facts";

export const practiceCopy = {
  h1: "The practice behind SkilledScan",
  paragraphs: [
    `SkilledScan is run by ${facts.practitioner.name}, a penetration tester based in Hyderabad, India.`,
    `In over ${facts.practitioner.yearsOnPlatform} years on ${facts.practitioner.ratingPlatform}, he has delivered ${facts.practitioner.engagements} engagements with a ${facts.practitioner.rating} rating, holds Preferred Freelancer and Verified status, and has worked with clients in India, Singapore, and Vietnam. His work covers web application and API security, cloud misconfiguration, and incident response, and has been recognized in the ${facts.practitioner.recognition} (${facts.practitioner.recognitionBody}). He holds CEH, OSINT, and Cisco security certifications.`,
    `He began building SkilledScan in ${facts.brand.developmentStarted} to do the repeatable groundwork faster without giving up the manual verification that makes a report worth trusting.`,
  ],
  profileLink: "View the Freelancer.com profile",
  how: {
    h2: "How the practice works",
    items: [
      {
        lead: "Reconnaissance first.",
        body: "Understand the target before choosing a single check.",
      },
      {
        lead: "Confirm before reporting.",
        body: "Nothing reaches a client report unless it has been reproduced by hand.",
      },
      {
        lead: "Evidence with every finding.",
        body: "Proof, impact, and a fix. Anything less stays in the raw log.",
      },
    ],
  },
  honest: {
    h2: "Honest about the tooling",
    body: "We describe what the tooling does plainly and keep a human in charge of the verdict. The method page explains exactly where the automated groundwork helps and where it stops.",
    link: { label: "Read the method", href: "/method" },
  },
} as const;
