import { headers } from "next/headers";
import { Section } from "@/components/ui/Container";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { aboutCopy } from "@/content/copy/about";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

const f = facts.founder;

export const metadata = buildMetadata({
  title: "About | SkilledScan",
  description: `SkilledScan is built by ${f.name}: CEH, NCIIPC Hall of Fame, ${f.stats[0].value} client security projects for clients in ${f.countries.length} countries since ${f.since}.`,
  path: "/about",
});

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.name,
    jobTitle: f.role,
    worksFor: { "@id": `${facts.brand.url}/#organization` },
    hasCredential: f.credentials.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.title })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        // Built only from facts via JSON.stringify.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={aboutCopy.eyebrow} title={aboutCopy.h1} intro={aboutCopy.intro} />

      <Section className="pt-0">
        <dl className="grid grid-cols-2 border-y border-rule lg:grid-cols-4">
          {f.stats.map((s, i) => (
            <div key={s.label} className={`py-8 pr-6 ${i > 0 ? "lg:border-l lg:border-rule lg:pl-8" : ""} ${i % 2 ? "border-l border-rule pl-6 lg:pl-8" : ""}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-[family-name:var(--font-serif)] text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                  {s.value}
                </span>
                <span className="mt-3 block text-[14.5px] text-ink-soft">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13.5px] text-ink-soft">{aboutCopy.statsNote}</p>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.credentials.eyebrow} title={aboutCopy.credentials.h2} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.credentials.map((c) => (
            <Card key={c.title} pad="p-7" className="flex flex-col gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent-text">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <h3 className="text-[18px] font-semibold text-ink">{c.title}</h3>
              <p className="text-[15.5px] text-ink-soft">{c.detail}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[14.5px] text-ink-soft">{aboutCopy.sectors}</span>
          {f.sectors.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.countries.eyebrow} title={aboutCopy.countries.h2} intro={aboutCopy.countries.intro} />
        <ul className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {f.countries.map((c) => (
            <li key={c.name} className="flex items-baseline justify-between gap-4 border-b border-rule py-3 text-[15.5px]">
              <span className="text-ink">{c.name}</span>
              <span className="font-[family-name:var(--font-mono)] text-[13px] tabular-nums text-ink-soft">
                {c.projects} {c.projects === 1 ? "project" : "projects"}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.work.eyebrow} title={aboutCopy.work.h2} intro={aboutCopy.work.intro} />
        <div className="mt-10 overflow-hidden rounded-[var(--radius-sm)] border border-rule">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-white/[0.03] text-[13px] text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Year</th>
                <th scope="col" className="px-5 py-3 font-medium">Project</th>
                <th scope="col" className="hidden px-5 py-3 font-medium sm:table-cell">Client country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {f.work.map((w) => (
                <tr key={`${w.year}-${w.title}`}>
                  <td className="whitespace-nowrap px-5 py-3.5 align-top font-[family-name:var(--font-mono)] text-[13px] text-ink-soft">{w.year}</td>
                  <td className="px-5 py-3.5 text-ink">
                    {w.title}
                    <span className="mt-0.5 block text-[13.5px] text-ink-soft sm:hidden">{w.country}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-ink-soft sm:table-cell">{w.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
