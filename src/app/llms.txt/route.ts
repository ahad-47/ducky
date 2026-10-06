import { siteMap } from "@/content/site-map";
import { facts } from "@/content/facts";
import { faqCopy } from "@/content/copy/faq";

// llms.txt (https://llmstxt.org): a plain summary for language-model
// crawlers, built from the same content files as the pages.
export function GET() {
  const base = facts.brand.url;
  const f = facts.founder;
  const body = `# ${facts.brand.name}

> ${facts.brand.positioning}

Contact: ${facts.brand.email}

## What it does
${facts.system.does.map((d) => `- ${d}`).join("\n")}

## Guardrails
${facts.system.governance.map((d) => `- ${d}`).join("\n")}

## Scan types
${facts.engagements.map((e) => `- ${e.name}: ${e.summary}`).join("\n")}

${siteMap
  .map(
    ({ group, pages }) =>
      `## ${group}\n${pages.map((p) => `- [${p.title}](${base}${p.path === "/" ? "" : p.path}): ${p.summary}`).join("\n")}`,
  )
  .join("\n\n")}

## Founder: ${f.name}
${f.bio.join("\n\n")}

- Role: ${f.role}
- Location: ${f.location}
- Email: ${f.email}
- LinkedIn: ${f.linkedin}
- Profile: ${base}/about
${f.stats.map((s) => `- ${s.value} ${s.label}`).join("\n")}


### Expertise
${f.expertise.map((e) => `- ${e.area}: ${e.items.join("; ")}`).join("\n")}

### Skills
${f.skills.join(", ")}


### Client countries (selection)
${f.regions.map((r) => `- ${r.region}: ${r.countries.join(", ")}`).join("\n")}

## FAQ
${faqCopy.items.map((i) => `- ${i.q} ${i.a}`).join("\n")}

`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
