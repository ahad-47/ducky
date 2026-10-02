// Single source of truth. Every number, name, and claim on the site comes from this file.
export const facts = {
  brand: {
    name: "SkilledScan",
    url: "https://skilledscan.com",
    positioning:
      "A security scanning platform for web applications and APIs. It maps your attack surface, runs approved checks under strict limits, and reports only confirmed findings.",
    oneLiner:
      "Security scanning for web applications and APIs, with confirmed findings and reports your developers and auditors can both use.",
    email: "contact@skilledscan.com",
  },

  globalReach: {
    countries: "60+",
    note: "Scans delivered for teams in 60+ countries, all run remotely under the same governed process.",
  },

  // The honest headline result from one authorized scan.
  // Raw observations are what checks surface; confirmed findings are what was reproduced and reported.
  signalResult: {
    raw: 201,
    verified: 7,
    note: "One authorized scan: 201 raw observations, 7 confirmed findings reported. The rest were duplicates, non-issues, or noise, kept in the raw log for audit.",
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
      name: "Verification",
      short: "Every candidate finding is reproduced before it is reported.",
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

  // What the scanning engine does and never does. Honest, no overclaim.
  system: {
    summary:
      "The SkilledScan engine does the repeatable work of a security assessment at machine speed: discovery, check selection, and execution, all under policy.",
    does: [
      "Maps the target's technology and attack surface.",
      "Proposes checks that fit what it found, from a fixed registry of approved checks.",
      "Runs approved checks in isolated sandboxes, rate-limited and non-destructive.",
      "Keeps raw observations separate from confirmed findings.",
    ],
    doesNot: [
      "Test anything outside the approved scope.",
      "Run a check the policy gate has not approved.",
      "Remove rate limits or run destructive checks.",
      "Brute-force credentials by default.",
    ],
    governance: [
      "Only approved, in-scope targets are tested.",
      "Every check is rate-limited and non-destructive.",
      "No brute force by default.",
      "Every proposed, allowed, and blocked action is written to an audit log.",
      "If the planning model is unavailable, scanning continues on a fixed plan.",
    ],
    note: "Only findings that are reproduced and confirmed reach your report. Everything else stays in the raw log for audit.",
  },

  engagements: [
    {
      name: "Web application scanning",
      summary:
        "Full coverage of a web application: authentication, access control, injection, configuration, and business logic, with confirmed findings in the report.",
      scopeNote: "Scope and depth agreed before testing starts.",
    },
    {
      name: "API scanning",
      summary:
        "Testing of REST and GraphQL APIs for broken authorization, injection, and data exposure, driven from your routes or specification.",
      scopeNote:
        "Bring an OpenAPI or Postman collection, or we map the routes first.",
    },
    {
      name: "Rescan and sign-off",
      summary:
        "After you fix, the reported findings are scanned again and a closeout states what was resolved.",
      scopeNote: "Covers the findings from a prior scan.",
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
    title: "Web application security scan",
    subtitle: "Confidential security report",
    meta: [
      { label: "Scan type", value: "Black-box web application scan" },
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
      text: "Confirmed, or flagged for your review.",
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
      "Black-box web application scanning",
      "API scanning from routes or an OpenAPI or Postman collection",
      "Policy-gated checks with an audit log of every action",
      "Verification of every reported finding",
      "Client-ready reports in HTML and PDF with a tools appendix",
      "Rescan and closeout",
    ],
    next: [
      "Authenticated testing with saved browser sessions",
      "One-click rescan after fixes",
      "Before and after remediation comparison",
      "White-label report branding for agencies",
      "Client portal",
      "Jira and GitHub issue export",
      "Scheduled scans",
      "OWASP Top 10 mapping in the report",
      "CVSS and business-impact scoring on every finding",
    ],
  },

  legal: {
    lastUpdated: "2 October 2026",
    governingLaw: "India",
  },
} as const;
