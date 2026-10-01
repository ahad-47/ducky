import { facts } from "@/content/facts";

export const complianceCopy = {
  h1: "Evidence for the rules you answer to.",
  intro:
    "SkilledScan does not certify compliance. It produces the testing evidence a compliance program needs: scope, method, findings with evidence, and remediation, in a report your auditor can read.",
  dpdp: {
    h2: "India's DPDP Rules",
    body: `The Digital Personal Data Protection Rules were notified on ${facts.compliance.dpdpRulesNotified}, with substantive obligations from ${facts.compliance.dpdpSubstantiveFrom}. Data fiduciaries must take reasonable security safeguards, and failing to do so can draw a penalty of up to ${facts.compliance.dpdpMaxPenaltySafeguards} under the Digital Personal Data Protection Act, 2023. Periodic vulnerability assessment and penetration testing is a common way to show those safeguards are in place.`,
  },
  regulated: {
    h2: "Regulated sectors",
    body: "Regulators including RBI and SEBI expect periodic vulnerability assessment and penetration testing from the entities they supervise. A SkilledScan report gives your auditor a record of scope, method, findings, and remediation.",
  },
  record: {
    h2: "What a report leaves on record",
    items: [
      "Agreed scope and rules of engagement",
      "What was tested and what was not",
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
