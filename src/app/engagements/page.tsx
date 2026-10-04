import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { engagementsCopy } from "@/content/copy/engagements";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";
import { slugify } from "@/lib/slug";

export const metadata = buildMetadata({
  title: "Scan types | SkilledScan",
  description:
    "Web application scanning, API scanning, and rescan with sign-off. Each ends in a report with evidence and a fix for every finding.",
  path: "/engagements",
});


export default function EngagementsPage() {
  return (
    <>
      <PageHeader eyebrow={engagementsCopy.eyebrow} title={engagementsCopy.h1} intro={engagementsCopy.intro} />

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {facts.engagements.map((engagement, i) => (
            <Card as="article" key={engagement.name} id={slugify(engagement.name)} pad="p-8" className="flex flex-col gap-4">
              <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-accent-text">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{engagement.name}</h2>
              <p className="text-[16.5px] text-ink-soft">{engagement.summary}</p>
              <p className="mt-auto flex items-start gap-2 border-t border-rule pt-4 text-[14.5px] text-ink-soft">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
                {engagement.scopeNote}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Coverage" title={engagementsCopy.coverage.h2} intro={engagementsCopy.coverage.note} />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.coverage.map((group, i) => (
            <Card key={group.area}>
              <h3 className="flex items-baseline gap-3 text-[18px] font-semibold text-ink">
                <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-normal text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                {group.area}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15.5px] text-ink-soft">
                    <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Deliverable" title={engagementsCopy.receive.h2} intro={engagementsCopy.receive.bodyLead} />
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="neutral">HTML</Badge>
              <Badge tone="neutral">PDF</Badge>
            </div>
            <SecondaryLink href={engagementsCopy.receive.link.href} className="mt-8">
              {engagementsCopy.receive.link.label}
            </SecondaryLink>
          </div>
          <Card pad="p-0">
            <ol className="divide-y divide-rule">
              {facts.reportSample.sections.map((section, index) => (
                <li key={section} className="flex items-center gap-4 px-6 py-4 text-[16.5px] text-ink">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
