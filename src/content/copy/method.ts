import { facts } from "@/content/facts";

export const methodCopy = {
  eyebrow: "Platform",
  h1: "How the SkilledScan vulnerability scanner works",
  intro:
    "Discovery, check selection and testing are automated and run under a policy you can read. Every action is logged, and a candidate has to be reproduced before it can become a finding.",
  badges: [`${facts.method.length}-stage pipeline`, "Policy-gated checks", "Full audit log"],
  phases: {
    h2: "The six stages",
  },
  system: {
    eyebrow: "The engine",
    h2: "What the engine does, and what it won't",
    intro: facts.system.summary,
    body: "The engine proposes checks that fit what it found. The checks themselves come from a fixed registry and run only when the policy gate approves them.",
    doesLabel: "What it does",
    doesNotLabel: "What it will never do",
  },
  governance: {
    h2: "Limits that apply to every scan",
  },
  verification: {
    h2: "A finding has to be reproduced first",
    body: `A candidate only becomes a finding once it is reproduced. On one scan that turned ${facts.verificationResult.raw} raw observations into ${facts.verificationResult.reported} reported findings.`,
    figureLabel: "Real result: one authorized client scan, client details withheld",
    survived: "of raw observations were confirmed and reported.",
  },
  authorization: {
    h2: "Written permission before any scan",
    body: "SkilledScan only scans targets you own or have written permission to test.",
    link: {
      label: "Read the acceptable use policy",
      href: "/legal/acceptable-use",
    },
  },
  closing: {
    primaryCta: "Request early access",
  },
} as const;
