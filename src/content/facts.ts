// Single source of truth. Every number, name, and claim on the site comes from this file.
export const facts = {
  brand: {
    name: "SkilledScan",
    url: "https://skilledscan.com",
    positioning:
      "A penetration testing practice where a governed system does the groundwork and a working tester verifies every finding.",
    oneLiner:
      "Expert-led web and API penetration testing, delivered as a report your developers and your auditor can both use.",
  },

  globalReach: {
    countries: "60+",
    note: "Assessments delivered for clients in 60+ countries worldwide, all run remotely under the same governed process.",
  },

  // The honest headline result from one authorized assessment.
  // Raw observations are what tooling surfaces; verified findings are what a human confirmed and reported.
  signalResult: {
    raw: 201,
    verified: 7,
    note: "One authorized assessment: 201 raw observations, 7 verified findings reported. The rest were duplicates, non-issues, or noise, kept in the raw log for audit.",
  },

  // A second, separate real result, used on /method only.
  verificationResult: {
    raw: 121,
    reported: 5,
    note: "A separate client engagement: 121 raw observations reduced to 5 reported findings.",
  },

  method: [
    {
      step: 1,
      name: "Recon and OSINT",
      short: "Map the target before touching it.",
      detail:
        "Domains, exposed services, technology stack, and public footprint are gathered first, so testing is aimed, not sprayed.",
    },
    {
      step: 2,
      name: "Enumeration",
      short: "Find the endpoints, parameters, and surfaces worth testing.",
      detail:
        "Routes, parameters, and exposed functionality are catalogued into a testable attack surface.",
    },
    {
      step: 3,
      name: "Vulnerability analysis",
      short: "Match the surface to likely weaknesses.",
      detail:
        "Detected technologies and versions are cross-referenced against known weaknesses and public advisories.",
    },
    {
      step: 4,
      name: "Active testing",
      short: "Test the candidates under strict limits.",
      detail:
        "Checks run against approved targets only, rate-limited, non-destructive, and logged. No brute force by default.",
    },
    {
      step: 5,
      name: "Manual verification",
      short: "A tester confirms every finding by hand.",
      detail:
        "Each candidate finding is reproduced and confirmed before it enters the report. Unconfirmed items stay in the raw log.",
    },
    {
      step: 6,
      name: "Reporting",
      short: "Write it up for the people who have to act on it.",
      detail:
        "Findings are prioritized and written for leadership and for the developer who owns the fix.",
    },
  ],

  // What the governed system does. Stated once, on /method. Honest, no overclaim.
  system: {
    summary:
      "Between recon and the written report, a governed system does the repeatable groundwork at machine speed so the tester spends time on judgement, not setup.",
    does: [
      "Maps the target's technology and attack surface.",
      "Proposes checks that fit what it found, from a fixed registry of approved checks.",
      "Runs approved checks in isolated sandboxes, rate-limited and non-destructive.",
      "Keeps raw observations separate from confirmed findings.",
    ],
    doesNot: [
      "Decides on its own what counts as a finding.",
      "Writes the client report unsupervised.",
      "Runs anything the policy gate has not approved.",
      "Expands scope or removes rate limits.",
    ],
    governance: [
      "Only approved, in-scope targets are tested.",
      "Every check is rate-limited and non-destructive.",
      "No brute force by default.",
      "Every proposed, allowed, and blocked action is written to an audit log.",
      "If the planning model is unavailable, the groundwork continues on a fixed plan.",
    ],
    note: "A human reviews the evidence and produces the report. The system does the groundwork; it does not sign off.",
  },

  engagements: [
    {
      name: "Web application assessment",
      summary:
        "A full assessment of a web application: authentication, access control, injection, configuration, and business logic, verified by hand and reported.",
      scopeNote: "Scope and depth agreed before testing starts.",
    },
    {
      name: "API assessment",
      summary:
        "Testing of REST and GraphQL APIs for broken authorization, injection, and data exposure, driven from your routes or specification.",
      scopeNote:
        "Bring an OpenAPI or Postman collection, or we map the routes first.",
    },
    {
      name: "Retest and sign-off",
      summary:
        "After you fix, we retest the reported findings and issue a closeout that states what was resolved.",
      scopeNote: "Covers the findings from a prior assessment.",
    },
  ],

  coverage: [
    {
      area: "Attack surface",
      items: [
        "Subdomains and exposed services",
        "Technology and version fingerprinting",
        "API routes and hidden parameters",
      ],
    },
    {
      area: "Injection",
      items: ["SQL injection", "Cross-site scripting", "CRLF injection"],
    },
    {
      area: "Access and session",
      items: [
        "Broken access control",
        "Authentication and session weaknesses",
        "JWT weaknesses",
        "CORS misconfiguration",
      ],
    },
    {
      area: "Configuration",
      items: [
        "TLS configuration",
        "Security headers",
        "Platform-specific checks for common CMS stacks",
      ],
    },
    {
      area: "Known vulnerabilities",
      items: [
        "Version-matched known vulnerabilities",
        "Cross-reference with public advisories",
      ],
    },
  ],

  reportSample: {
    title: "Web application assessment",
    subtitle: "Confidential security assessment report",
    meta: [
      { label: "Engagement", value: "Black-box web application assessment" },
      { label: "Scope", value: "One web application, agreed in writing" },
      { label: "Status", value: "Delivered" },
      { label: "Prepared by", value: "SkilledScan" },
    ],
    summaryCounts: { medium: 4, low: 11, info: 23, total: 38 },
    sections: [
      "Executive summary",
      "Risk breakdown",
      "Scope and rules of engagement",
      "Methodology",
      "Findings, each with evidence and a fix",
      "Remediation summary",
      "Coverage: what was tested and what was not",
      "Tools and references appendix",
    ],
    // One fully written sample finding, shown on /report-sample. Realistic, non-destructive, generic.
    finding: {
      id: "F-03",
      title: "Server and framework versions disclosed in HTTP response headers",
      severity: "Low",
      cvss: "3.7",
      url: "https://app.example-redacted.com/",
      summary:
        "The application returns response headers that name the web server and framework, including version numbers. This hands an attacker a precise target: known weaknesses for a named version can be looked up and tried directly, which shortens the time from first contact to a working exploit.",
      evidenceCaption:
        "Response headers observed on the application root. Redacted for the public sample.",
      evidence:
        "HTTP/2 200\nserver: [redacted]/[version redacted]\nx-powered-by: [redacted]/[version redacted]\ncache-control: no-store",
      impact:
        "On its own this does not compromise the application. Combined with an unpatched component it lets an attacker skip reconnaissance and go straight to a matching exploit.",
      fix: "Remove or mask the Server and X-Powered-By headers at the web server or reverse proxy. Confirm no version string is returned on any route, including error pages.",
      confidence: "Confirmed",
    },
    note: "This is a redacted sample for illustration. Real reports carry full evidence and client detail under the engagement agreement.",
  },

  findingFields: [
    { field: "Severity", text: "Critical, high, medium, low, or info." },
    {
      field: "Affected location",
      text: "The exact URL or component where the issue was observed.",
    },
    {
      field: "Evidence",
      text: "The request, response, or artifact that proves it.",
    },
    {
      field: "Business impact",
      text: "What it means for the business, in plain language.",
    },
    { field: "Fix", text: "A specific step for the developer who owns it." },
    {
      field: "Confidence",
      text: "Confirmed by hand, or flagged for your review.",
    },
  ],

  toolsAppendix: {
    note: "Reports include an appendix listing the professional tools used, so your auditor can see the method.",
    categories: [
      {
        group: "Interception and manual testing",
        items: ["Burp Suite Professional", "Postman"],
      },
      { group: "Scanning", items: ["Acunetix", "HCL AppScan"] },
      { group: "Reconnaissance", items: ["Shodan", "theHarvester"] },
      {
        group: "References",
        items: ["NVD", "public exploit and advisory databases"],
      },
    ],
  },

  roadmap: {
    live: [
      "Black-box web application assessments",
      "API assessments from routes or an OpenAPI or Postman collection",
      "Governed groundwork with an audit log of every action",
      "Manual verification of every reported finding",
      "Client-ready reports in HTML and PDF with a tools appendix",
      "Retest and closeout",
    ],
    next: [
      "Authenticated testing with saved browser sessions",
      "One-click retest after fixes",
      "Before and after remediation comparison",
      "White-label report branding for agencies",
      "Client portal",
      "Jira and GitHub issue export",
      "Scheduled assessments",
      "OWASP Top 10 mapping in the report",
      "CVSS and business-impact scoring on every finding",
    ],
  },

  legal: {
    lastUpdated: "2 October 2026",
    governingLaw: "India",
  },
} as const;
