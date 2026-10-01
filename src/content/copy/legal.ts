import { facts } from "@/content/facts";

export const privacyCopy = {
  h1: "Privacy policy",
  lastUpdated: `Last updated: ${facts.legal.lastUpdated}`,
  sections: [
    {
      heading: "Who we are",
      body: "SkilledScan, Hyderabad, Telangana, India. This policy covers the website at skilledscan.com. Data processed during an assessment is covered by the agreement for that engagement.",
    },
    {
      heading: "What we collect",
      body: "When you submit the request form or the disclosure form, we collect the details you enter: name, email, company, domain, engagement choice, message, and your authorization confirmation. Our hosting provider records standard server logs, including IP addresses, to keep the site secure and running.",
    },
    {
      heading: "What we do not collect",
      body: "This site sets no tracking cookies and uses no advertising pixels and no third-party analytics.",
    },
    {
      heading: "Why we use it",
      body: "To reply, to confirm scope and authorization, and to keep a record of authorization for any assessment we run.",
    },
    {
      heading: "Legal basis",
      body: "Your consent, given when you submit a form, under the Digital Personal Data Protection Act, 2023.",
    },
    {
      heading: "Sharing",
      body: "We do not sell your data. Form submissions reach us by email through our mail provider.",
    },
    {
      heading: "Retention",
      body: "We keep submissions only as long as we need them to respond and to keep a record of authorization.",
    },
    {
      heading: "Your rights",
      body: "You can ask to access, correct, or erase your data, withdraw consent, raise a grievance, or nominate someone to exercise these rights. Use the form at /contact and say which right you are exercising.",
      link: { label: "/contact", href: "/contact" },
    },
    {
      heading: "Changes",
      body: "We update this page when our practices change and show the date above.",
    },
  ],
} as const;

export const termsCopy = {
  h1: "Terms of use",
  lastUpdated: `Last updated: ${facts.legal.lastUpdated}`,
  sections: [
    {
      heading: "Use of this site",
      body: "This site describes SkilledScan and how to request an assessment. Its content is general information, not legal or security advice for your situation.",
    },
    {
      heading: "Changes to content",
      body: "We may change or remove content at any time.",
    },
    {
      heading: "Intellectual property",
      body: "The SkilledScan name, this site's text, and its design belong to SkilledScan.",
    },
    {
      heading: "External links",
      body: "Links to other sites are for reference. We do not control them.",
    },
    {
      heading: "Liability",
      body: "This site is provided as is. To the extent the law allows, SkilledScan is not liable for any indirect loss arising from your use of it.",
    },
    {
      heading: "Assessments",
      body: "Assessments are governed by a separate agreement and by the acceptable use policy.",
      link: { label: "/legal/acceptable-use", href: "/legal/acceptable-use" },
    },
    {
      heading: "Governing law",
      body: `These terms are governed by the laws of ${facts.legal.governingLaw}. Courts at ${facts.legal.courts} have jurisdiction.`,
    },
  ],
} as const;

export const acceptableUseCopy = {
  h1: "Acceptable use policy",
  lastUpdated: `Last updated: ${facts.legal.lastUpdated}`,
  sections: [
    {
      heading: "Authorized targets only",
      body: "You may submit only targets you own or have written permission to test, and you must be able to show that permission when asked.",
    },
    {
      heading: "Not allowed",
      list: [
        "Testing any target without permission.",
        "Attempting to bypass scope or rate limits.",
        "Using results to attack, extort, or harm anyone.",
      ],
    },
    {
      heading: "Our controls",
      body: "We enforce scope, rate limits, and safety rules on every assessment and keep an audit log of every action.",
    },
    {
      heading: "Enforcement",
      body: "We may refuse, pause, or stop any assessment, and suspend access, when we believe this policy has been breached.",
    },
    {
      heading: "Report misuse",
      body: "Report suspected misuse through the form at /contact.",
      link: { label: "/contact", href: "/contact" },
    },
  ],
} as const;
