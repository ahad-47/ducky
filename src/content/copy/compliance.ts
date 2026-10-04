export const complianceCopy = {
  h1: "Evidence for the rules you answer to.",
  intro:
    "SkilledScan does not certify compliance. A SkilledScan report is one input to your evidence set: the vulnerability scan evidence, with scope, method, confirmed findings and remediation, in a form your auditor can read.",
  frameworks: {
    h2: "One input to your evidence set",
    body: "Most security frameworks expect you to test for weaknesses and fix what you find. For SOC 2, ISO 27001, GDPR or a regional data protection law, a SkilledScan report covers that part: vulnerability scan evidence. It does not cover the other controls your auditor reviews.",
  },
  regulated: {
    h2: "Regulated industries",
    body: "Financial services, healthcare, and other regulated industries commonly require periodic vulnerability scanning and security testing. Repeat SkilledScan reports give your auditor a consistent record of scope, method, findings, and remediation.",
  },
  record: {
    h2: "What a report leaves on record",
    items: [
      "Approved scope and rules of engagement",
      "What was scanned and what was not",
      "Findings with evidence and a fix",
      "Remediation summary",
      "HTML and PDF report",
    ],
  },
  roadmap: {
    h2: "On the roadmap",
    body: "OWASP Top 10 mapping in the report, and CVSS with business-impact scoring on every finding.",
  },
  note: "Nothing on this page is legal advice.",
} as const;
