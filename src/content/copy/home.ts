import { facts } from "@/content/facts";

export const homeCopy = {
  hero: {
    eyebrow: "Web and API security scanning",
    h1: "A scanner that only reports what it can reproduce.",
    subhead:
      "SkilledScan maps your web applications and APIs, runs approved checks under strict limits, and keeps duplicates and false positives out of your report. Each finding comes with evidence and a fix.",
    primaryCta: "Request early access",
    secondaryCta: "See a sample report",
    caption: `One scan: ${facts.signalResult.raw} raw observations, ${facts.signalResult.verified} confirmed findings reported. Duplicates, non-issues and noise stay in the raw log for audit.`,
  },
  proof: {
    label: "Real result: one authorized client scan, client details withheld",
    raw: "raw observations",
    confirmed: "confirmed findings",
    body: `Every candidate is reproduced before it reaches the report. On this scan that removed ${facts.signalResult.raw - facts.signalResult.verified} duplicates, non-issues and noise. They stay in the raw log, so your auditor can still see them.`,
  },
  problem: {
    eyebrow: "Why SkilledScan",
    h2: "Raw scanner output is where the work starts, not where it ends.",
    columns: ["", "Raw scanner output", "A SkilledScan report"],
    rows: [
      ["Candidates", "Hundreds of possibilities, none confirmed", "Each one reproduced before it is reported"],
      ["Duplicates and noise", "Mixed in with real issues", "Kept in the raw log, out of the report"],
      ["What to do next", "Your team triages the list", "Prioritized findings with evidence and a fix"],
      ["Audit trail", "Rarely kept", "Every proposed, allowed and blocked action logged"],
    ],
  },
  features: {
    eyebrow: "Platform",
    h2: "What runs on every scan",
    items: [
      { title: "Attack surface discovery", body: "Maps subdomains, exposed services, technologies, routes and parameters before testing." },
      { title: "Approved check registry", body: "Checks are chosen to fit the target from a fixed registry, never improvised." },
      { title: "Sandboxed and rate-limited", body: "Checks run in isolated sandboxes, non-destructive, within the agreed scope." },
      { title: "Confirmed findings", body: "Raw observations are kept apart from findings that were reproduced and confirmed." },
      { title: "Audit log", body: "Every proposed, allowed and blocked action is recorded for your auditor." },
      { title: "HTML and PDF reports", body: "Executive summary, risk breakdown, evidence, fixes and coverage in one report." },
    ],
  },
  howItWorks: {
    h2: "How a scan runs",
    intro: "Six stages, from discovery to the final report. Only confirmed findings make it to the end.",
    link: {
      label: "Explore the scanning engine",
      href: "/method",
    },
  },
  reportTeaser: {
    h2: "One report for engineering and leadership.",
    body: "Leadership gets the summary and the risk picture. Developers get the evidence and the fix. Both get a record of what was scanned and what was not.",
    caption: `Severity mix from one delivered scan: ${facts.reportSample.summaryCounts.medium} medium, ${facts.reportSample.summaryCounts.low} low, ${facts.reportSample.summaryCounts.info} info.`,
    link: { label: "Read a sample report", href: "/report-sample" },
  },
  engagementsTeaser: {
    h2: "Scan what you ship",
    link: { label: "Compare scan types", href: "/engagements" },
  },
  closing: {
    h2: "Start with one target.",
    body: `Email ${facts.brand.email} with the application or API you want scanned. Written authorization is confirmed before any scan runs.`,
    primaryCta: "Request early access",
  },
} as const;
