export type OSApp = {
  slug: string;
  label: string;
  href: string;
  keywords: string[];
};

export const osApps: OSApp[] = [
  { slug: "home", label: "home", href: "/", keywords: ["home", "index", "~"] },
  { slug: "method", label: "method", href: "/method", keywords: ["method", "how"] },
  { slug: "engagements", label: "engagements", href: "/engagements", keywords: ["engagements", "book", "services"] },
  { slug: "report", label: "report-sample", href: "/report-sample", keywords: ["report", "report-sample", "sample"] },
  { slug: "compliance", label: "compliance", href: "/compliance", keywords: ["compliance", "legal-evidence"] },
  { slug: "roadmap", label: "roadmap", href: "/roadmap", keywords: ["roadmap", "changelog"] },
  { slug: "security", label: "security.txt", href: "/security", keywords: ["security", "disclosure"] },
  { slug: "contact", label: "contact", href: "/contact", keywords: ["contact", "assessment", "request"] },
];

export const terminalApp: OSApp = {
  slug: "terminal",
  label: "terminal",
  href: "",
  keywords: ["terminal", "term", "console", "shell"],
};

export const osLegalApps: OSApp[] = [
  { slug: "privacy", label: "privacy", href: "/legal/privacy", keywords: ["privacy"] },
  { slug: "terms", label: "terms", href: "/legal/terms", keywords: ["terms"] },
  { slug: "acceptable-use", label: "acceptable-use", href: "/legal/acceptable-use", keywords: ["acceptable-use", "aup"] },
];
