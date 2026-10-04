import { facts } from "@/content/facts";

export const contactCopy = {
  eyebrow: "Contact",
  h1: "Get in touch",
  intro: "Ask a question, request early access or set up a scan. One inbox handles all of it.",
  email: facts.brand.email,
  emailLabel: "Email us",
  include: {
    h2: "To set up a scan, include",
    items: [
      "Your name and company",
      "The application URL or API you want scanned",
      "The scan type: web application, API, or rescan",
      "Production or staging, and any timing constraints",
      "Confirmation that you own the target or have written permission to test it",
    ],
  },
  sidePanel: {
    h2: "What happens next",
    steps: [
      "We reply to confirm the target and scan type.",
      "We confirm scope and written authorization.",
      "The scan runs and you receive the report.",
    ],
  },
} as const;
