import { pages } from "@/components/desktop/pages";
import { facts } from "@/content/facts";
import { faqCopy } from "@/content/copy/faq";

// llms.txt (https://llmstxt.org): a plain summary for language-model
// crawlers, built from the same content files as the pages.
const summaries: Record<string, string> = {
  "/method": "How the scanning engine works: six stages, policy-gated checks, verification before reporting.",
  "/engagements": "Scan types: web application scanning, API scanning, rescan and sign-off.",
  "/report-sample": "A redacted sample report with one finding written out in full.",
  "/compliance": "How a report serves as vulnerability scan evidence for SOC 2, ISO 27001 and data protection reviews.",
  "/roadmap": "What is live today and what is being built.",
  "/about": `Who built SkilledScan: ${facts.founder.name}, ${facts.founder.headline.toLowerCase()}.`,
  "/faq": "Authorization, scope, production safety, deliverables, rescans and compliance.",
  "/scanner": "The self-serve console, in development.",
  "/contact": `How to request a scan: email ${facts.brand.email}.`,
  "/security": "Vulnerability disclosure for SkilledScan itself.",
};

export function GET() {
  const base = facts.brand.url;
  const f = facts.founder;
  const link = (route: string) => {
    const page = pages.find((p) => p.route === route);
    return `- [${page?.title ?? route}](${base}${route}): ${summaries[route]}`;
  };
  const body = `# ${facts.brand.name}

> ${facts.brand.positioning}

Contact: ${facts.brand.email}

## What it does
${facts.system.does.map((d) => `- ${d}`).join("\n")}

## Guardrails
${facts.system.governance.map((d) => `- ${d}`).join("\n")}

## Scan types
${facts.engagements.map((e) => `- ${e.name}: ${e.summary}`).join("\n")}

## Pages
${Object.keys(summaries).map(link).join("\n")}

## Founder: ${f.name}
${f.bio.join("\n\n")}

- Role: ${f.role}
- Location: ${f.location}
- Email: ${f.email}
- LinkedIn: ${f.linkedin}
- Profile: ${base}/about
${f.stats.map((s) => `- ${s.value} ${s.label}`).join("\n")}

### Certifications and recognition
${f.credentials.map((c) => `- ${c.title}: ${c.detail}`).join("\n")}

### Expertise
${f.expertise.map((e) => `- ${e.area}: ${e.items.join("; ")}`).join("\n")}

### Skills
${f.skills.join(", ")}

### Tools
${f.tools.join(", ")}

### Client countries (selection)
${f.regions.map((r) => `- ${r.region}: ${r.countries.join(", ")}`).join("\n")}

## FAQ
${faqCopy.items.map((i) => `- ${i.q} ${i.a}`).join("\n")}

## Legal
- [Privacy policy](${base}/legal/privacy)
- [Terms of use](${base}/legal/terms)
- [Acceptable use](${base}/legal/acceptable-use)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
