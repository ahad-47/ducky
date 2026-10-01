import { facts } from "@/content/facts";

export const homeCopy = {
  hero: {
    h1: `${facts.signalResult.raw} observations. ${facts.signalResult.verified} findings worth fixing.`,
    subhead:
      "SkilledScan is a penetration testing practice. A governed system does the groundwork, a working tester verifies every finding, and you get a report your developers and your auditor can both use.",
    primaryCta: "Request an assessment",
    secondaryCta: "See a sample report",
    caption: facts.signalResult.note,
  },
  proofLine: `Every reported finding is reproduced by hand before it reaches you. One authorized assessment took ${facts.signalResult.raw} raw observations down to ${facts.signalResult.verified} verified findings, each one confirmed, not guessed at.`,
  problem: {
    h2: "A scan is not an assessment.",
    items: [
      {
        lead: "A scan lists possibilities.",
        body: "A tool can surface hundreds of maybes in a minute. None are confirmed.",
      },
      {
        lead: "An assessment confirms them.",
        body: "Someone has to reproduce each one, judge the impact, and throw out the noise.",
      },
      {
        lead: "A report is what you can act on.",
        body: "Prioritized, with evidence and a fix, for the person who owns the code.",
      },
    ],
    closing: "SkilledScan does all three, and shows its work.",
  },
  howItWorks: {
    h2: "How an assessment runs",
    intro:
      "Six phases, from first look to final report. Every reported finding is confirmed by hand before it reaches you.",
    link: {
      label: "How the groundwork stays fast and in scope",
      href: "/method",
    },
  },
  reportTeaser: {
    h2: "A report both of your readers will use.",
    body: "Leadership gets the summary and the risk picture. Developers get the evidence and the fix. Both get a record of what was tested and what was not.",
    caption: `Severity mix from one delivered assessment: ${facts.reportSample.summaryCounts.medium} medium, ${facts.reportSample.summaryCounts.low} low, ${facts.reportSample.summaryCounts.info} info.`,
    link: { label: "Read a sample report", href: "/report-sample" },
  },
  engagementsTeaser: {
    h2: "Three ways to work together",
    link: { label: "See engagements", href: "/engagements" },
  },
  closing: {
    h2: "Start with one target.",
    body: "Tell us the target and the scope. We confirm authorization before any testing begins.",
    primaryCta: "Request an assessment",
  },
} as const;
