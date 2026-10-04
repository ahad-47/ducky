import { facts } from "@/content/facts";

// Every answer restates something already established elsewhere on the site.
// Questions without a settled answer (pricing, data residency, retention
// periods, turnaround times) are left out until they have one.
export const faqCopy = {
  eyebrow: "FAQ",
  h1: "Questions before a scan",
  intro: "Short answers about authorization, scope, safety and what you receive.",
  items: [
    {
      q: "Do you need permission to scan my application?",
      a: "Yes. SkilledScan only scans targets you own or have written permission to test, and written authorization is confirmed before any scan runs.",
    },
    {
      q: "How is the scope agreed?",
      a: "Scope and depth are agreed in writing before testing starts. Checks never run against anything outside the approved scope, and every proposed, allowed and blocked action is written to an audit log.",
    },
    {
      q: "Can a scan break production?",
      a: "Checks are rate-limited and non-destructive, and credential brute forcing stays off unless the agreed scope includes it. You can ask for staging instead of production and state any timing constraints when you set up the scan.",
    },
    {
      q: "What do I receive?",
      a: `A report in HTML and PDF with ${facts.reportSample.sections.length} sections, including an executive summary, scope, methodology, findings with evidence and a fix, a remediation summary, and a statement of what was and was not covered.`,
    },
    {
      q: "What happens to results that are not confirmed?",
      a: "Only findings that are reproduced and confirmed reach your report. Everything else stays in the raw log for audit.",
    },
    {
      q: "Do you scan again after we fix the findings?",
      a: "Yes. A rescan covers the findings from a prior scan, and a closeout states what was resolved.",
    },
    {
      q: "Does a report make us compliant with SOC 2 or ISO 27001?",
      a: "No. A SkilledScan report is one input to your evidence set: the vulnerability scan evidence. It does not cover the other controls your auditor reviews.",
    },
    {
      q: "How is data from a scan handled?",
      a: "Data processed during a scan is covered by the written agreement for that engagement, settled before the scan runs.",
    },
    {
      q: "Can I start a scan myself?",
      a: `Not yet. The self-serve console is in development. Until it opens, scans are set up by email at ${facts.brand.email}.`,
    },
  ],
} as const;
