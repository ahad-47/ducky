export const securityCopy = {
  h1: "Security and disclosure",
  intro:
    "Found a vulnerability in SkilledScan? Report it through the form on this page.",
  guidelines: {
    h2: "Guidelines",
    items: [
      "Test only against accounts and data you own.",
      "Do not access, change, or delete data that is not yours.",
      "No denial of service, spam, or social engineering against SkilledScan or its users.",
      "Give us reasonable time to fix before public disclosure.",
    ],
    bodyInclude:
      "Include the affected URL or component, steps to reproduce, and the impact you observed.",
    bodyGoodFaith:
      "We will not pursue legal action for good-faith research within these guidelines.",
    bodySecurityTxt:
      "Machine-readable contact details are at /.well-known/security.txt.",
  },
} as const;
