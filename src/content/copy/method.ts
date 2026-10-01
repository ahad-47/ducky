import { facts } from "@/content/facts";

export const methodCopy = {
  h1: "Fast groundwork. Human judgement. One report.",
  intro:
    "Reconnaissance and the repeatable checks run at machine speed, under strict limits, with everything logged. A tester reviews the evidence, confirms each finding, and writes the report. The speed comes from the system; the verdict comes from a person.",
  phases: {
    h2: "The six phases",
  },
  system: {
    h2: "Where the system helps, and where it stops",
    intro: facts.system.summary,
    body: "It uses AI to plan which checks fit the target, then runs them under policy. This is the only place AI touches your assessment, and it never has the last word.",
    doesLabel: "What it does",
    doesNotLabel: "What it never does",
  },
  governance: {
    h2: "Governed by default",
  },
  verification: {
    h2: "Verification is the product.",
    body: `A finding only reaches your report after a tester reproduces it. On one engagement that meant ${facts.verificationResult.raw} raw observations became ${facts.verificationResult.reported} reported findings. The difference is the work you are paying for.`,
  },
  authorization: {
    h2: "Authorization comes first.",
    body: "We test only targets you own or have written permission to test.",
    link: {
      label: "Read the acceptable use policy",
      href: "/legal/acceptable-use",
    },
  },
  closing: {
    primaryCta: "Request an assessment",
  },
} as const;
