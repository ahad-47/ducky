// Every public page, grouped for the XML sitemap, the /site-map page and
// llms.txt. `updated` is the date the page's content last changed; bump it
// when you edit a page so search engines recrawl it.
export type SitePage = {
  path: string;
  title: string;
  summary: string;
  updated: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

export const siteMap: { group: string; pages: SitePage[] }[] = [
  {
    group: "Product",
    pages: [
      { path: "/", title: "Web and API security scanner", summary: "What SkilledScan does and how it keeps unconfirmed findings out of your report.", updated: "2026-10-05", priority: 1, changeFrequency: "monthly" },
      { path: "/engagements", title: "Web application and API scanning", summary: "Scan types: web application scanning, REST and GraphQL API testing, and rescans after fixes.", updated: "2026-10-05", priority: 0.9, changeFrequency: "monthly" },
      { path: "/method", title: "How the vulnerability scanner works", summary: "The six stages from recon to report, the policy gate, and the audit log.", updated: "2026-10-05", priority: 0.8, changeFrequency: "monthly" },
      { path: "/report-sample", title: "Sample vulnerability scan report", summary: "A redacted report with one finding written out in full.", updated: "2026-10-05", priority: 0.8, changeFrequency: "monthly" },
      { path: "/compliance", title: "Vulnerability scan evidence for compliance", summary: "How a report serves as scan evidence for SOC 2, ISO 27001 and GDPR reviews.", updated: "2026-10-05", priority: 0.7, changeFrequency: "monthly" },
      { path: "/scanner", title: "Self-serve scanning console", summary: "The self-serve console, in development.", updated: "2026-10-05", priority: 0.5, changeFrequency: "monthly" },
      { path: "/roadmap", title: "Product roadmap", summary: "What is live today and what is being built.", updated: "2026-10-05", priority: 0.5, changeFrequency: "monthly" },
    ],
  },
  {
    group: "Company",
    pages: [
      { path: "/about", title: "Ahad Ansari, founder", summary: "Who built SkilledScan: credentials, expertise and track record.", updated: "2026-10-05", priority: 0.8, changeFrequency: "monthly" },
      { path: "/faq", title: "Security scanning FAQ", summary: "Authorization, scope, production safety, reports, rescans and compliance.", updated: "2026-10-05", priority: 0.7, changeFrequency: "monthly" },
      { path: "/contact", title: "Request a security scan", summary: "How to set up a scan or ask a question.", updated: "2026-10-05", priority: 0.7, changeFrequency: "yearly" },
    ],
  },
  {
    group: "Trust and legal",
    pages: [
      { path: "/security", title: "Vulnerability disclosure", summary: "How to report a vulnerability in SkilledScan.", updated: "2026-10-05", priority: 0.4, changeFrequency: "yearly" },
      { path: "/legal/privacy", title: "Privacy policy", summary: "What this site collects and why.", updated: "2026-10-02", priority: 0.2, changeFrequency: "yearly" },
      { path: "/legal/terms", title: "Terms of use", summary: "Terms for using this site.", updated: "2026-10-02", priority: 0.2, changeFrequency: "yearly" },
      { path: "/legal/acceptable-use", title: "Acceptable use policy", summary: "Authorized targets only, and what is not allowed.", updated: "2026-10-02", priority: 0.2, changeFrequency: "yearly" },
      { path: "/site-map", title: "Site map", summary: "Every page on this site.", updated: "2026-10-05", priority: 0.2, changeFrequency: "monthly" },
    ],
  },
];
