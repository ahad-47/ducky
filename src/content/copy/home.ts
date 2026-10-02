import { facts } from "@/content/facts";

export const homeCopy = {
  hero: {
    eyebrow: "Web and API security scanning",
    h1: "Find the vulnerabilities that matter. Skip the noise.",
    subhead:
      "SkilledScan maps your attack surface, runs approved security checks under strict limits, and reports only confirmed findings, each with evidence and a fix.",
    primaryCta: "Request early access",
    secondaryCta: "See a sample report",
    caption: `One scan: ${facts.signalResult.raw} raw observations, ${facts.signalResult.verified} confirmed findings reported. Duplicates, non-issues and noise stay in the raw log for audit.`,
  },
  proofLine: `Most scanners hand you a list of maybes. SkilledScan reproduces each candidate before it reaches your report: one scan took ${facts.signalResult.raw} raw observations down to ${facts.signalResult.verified} confirmed findings.`,
  stats: {
    raw: "raw observations surfaced",
    confirmed: "confirmed findings reported",
    phases: "stage scanning pipeline",
    countries: "countries scanned from, all remotely",
  },
  problem: {
    eyebrow: "Why SkilledScan",
    h2: "Signal, not a spreadsheet of maybes.",
    items: [
      {
        lead: "Noise wastes engineering time.",
        body: "Raw scanner output is full of duplicates and false positives that someone has to triage.",
      },
      {
        lead: "Confirmed findings only.",
        body: "Every candidate is reproduced before it is reported. Unconfirmed items stay in the raw log.",
      },
      {
        lead: "Reports your team can act on.",
        body: "Prioritized findings with evidence and a specific fix for the developer who owns it.",
      },
    ],
    closing: "Scan wide. Report what is real.",
  },
  features: {
    eyebrow: "Platform",
    h2: "Built for safe, thorough scanning",
    items: [
      { icon: "search", title: "Attack surface discovery", body: "Maps subdomains, exposed services, technologies, routes and parameters before testing." },
      { icon: "layers", title: "Approved check registry", body: "Checks are chosen to fit the target from a fixed registry, never improvised." },
      { icon: "shield", title: "Sandboxed and rate-limited", body: "Checks run in isolated sandboxes, non-destructive, within the agreed scope." },
      { icon: "check", title: "Confirmed findings", body: "Raw observations are kept apart from findings that were reproduced and confirmed." },
      { icon: "doc", title: "Audit log", body: "Every proposed, allowed and blocked action is recorded for your auditor." },
      { icon: "pulse", title: "HTML and PDF reports", body: "Executive summary, risk breakdown, evidence, fixes and coverage in one report." },
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
