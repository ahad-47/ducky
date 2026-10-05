export const engagementsCopy = {
  eyebrow: "Scan types",
  h1: "Web application and API security scanning",
  intro:
    "Scans are black-box: SkilledScan tests the running application or API from the outside, the way an attacker would, without needing your source code. Every scan type ends in the same kind of report: evidence and a fix for each finding, plus a record of what was covered.",
  coverage: {
    h2: "What every scan covers",
    note: "Coverage includes common OWASP Top 10 risk areas such as broken access control, injection and security misconfiguration; formal OWASP Top 10 mapping in the report is on the roadmap. Depth depends on the scan type and on what the target runs, and each report's coverage section states what was scanned and what was not.",
  },
  receive: {
    h2: "What you receive",
    bodyLead: "A report with these sections:",
    bodyTrailing: "In HTML and PDF.",
    link: { label: "See a sample report", href: "/report-sample" },
  },
} as const;
