import { facts } from "@/content/facts";

export const scannerCopy = {
  h1: "Self-serve scanning is coming.",
  intro:
    "Soon you will start scans, track findings and download reports from your own SkilledScan console. Until it opens, scans are set up with you by email and delivered as full reports.",
  status: "Coming soon",
  building: {
    h2: "On the way to self-serve",
    intro: "These are on the public roadmap and move to Live only when they ship.",
    items: facts.roadmap.next,
  },
  meantime: {
    h2: "Want in early?",
    body: `Email ${facts.brand.email} to request early access, or to have your first scan set up now.`,
  },
} as const;
