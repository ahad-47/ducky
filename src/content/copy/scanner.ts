import { facts } from "@/content/facts";

export const scannerCopy = {
  h1: "The SkilledScan scanner is coming.",
  intro:
    "It is in development and not available yet. Until it ships, every SkilledScan assessment is run and verified by a tester, the way the method page describes.",
  status: "Coming soon",
  building: {
    h2: "Already in the build queue",
    intro: "These are on the public roadmap and move to Live only when they ship.",
    items: facts.roadmap.next,
  },
  meantime: {
    h2: "Need testing now?",
    body: "Request an assessment today. Ask us in the same form to tell you when the scanner launches.",
  },
} as const;
