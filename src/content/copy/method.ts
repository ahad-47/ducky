import { facts } from "@/content/facts";

export const methodCopy = {
  eyebrow: "Platform",
  h1: "The scanning engine behind every report.",
  intro:
    "Discovery, check selection and execution run at machine speed, under policy, with every action logged. Candidates are reproduced before they are reported, so what you read is what is real.",
  badges: [`${facts.method.length}-stage pipeline`, "Policy-gated checks", "Full audit log"],
  phases: {
    h2: "Six stages, one report",
  },
  system: {
    eyebrow: "The engine",
    h2: "Powerful by default, safe by design",
    intro: facts.system.summary,
    body: "The engine proposes checks that fit what it found. The checks themselves come from a fixed registry and run only when the policy gate approves them.",
    doesLabel: "What it does",
    doesNotLabel: "What it will never do",
  },
  governance: {
    h2: "Guardrails on every scan",
  },
  verification: {
    h2: "Confirmed findings, not guesses.",
    body: `A candidate only becomes a finding once it is reproduced. On one scan that turned ${facts.verificationResult.raw} raw observations into ${facts.verificationResult.reported} reported findings.`,
    figureLabel: "Real result: one authorized client scan, client details withheld",
    survived: "of raw observations were confirmed and reported.",
  },
  authorization: {
    h2: "Authorization comes first.",
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
