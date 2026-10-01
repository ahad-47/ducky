import { RevealHeading } from "@/components/ui/RevealHeading";
import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { engagementsCopy } from "@/content/copy/engagements";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Engagements | SkilledScan",
  description:
    "Web application assessments, API assessments, and retest with sign-off. Each ends in a report with evidence and a fix.",
  path: "/engagements",
});

export default function EngagementsPage() {
  return (
    <>
      <Section>
        <RevealHeading className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {engagementsCopy.h1}
        </RevealHeading>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {engagementsCopy.intro}
        </p>
      </Section>

      <Section>
        <div className="flex flex-col gap-12">
          {facts.engagements.map((engagement) => (
            <div
              key={engagement.name}
              className="border-t border-rule pt-10 first:border-t-0 first:pt-0"
            >
              <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
                {engagement.name}
              </h2>
              <p className="measure mt-4 text-[18px] text-ink-soft">
                {engagement.summary}
              </p>
              <p className="mt-3 text-[15px] text-ink-soft">
                {engagement.scopeNote}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {engagementsCopy.coverage.h2}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {facts.coverage.map((group) => (
            <div key={group.area}>
              <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
                {group.area}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="text-[17px] text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="measure mt-10 text-[15px] text-ink-soft">
          {engagementsCopy.coverage.note}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {engagementsCopy.receive.h2}
        </h2>
        <p className="mt-4 text-[18px] text-ink-soft">
          {engagementsCopy.receive.bodyLead}
        </p>
        <ol className="mt-4 flex flex-col gap-2">
          {facts.reportSample.sections.map((section, index) => (
            <li key={section} className="text-[17px] text-ink-soft">
              {index + 1}. {section}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[18px] text-ink-soft">
          {engagementsCopy.receive.bodyTrailing}
        </p>
        <SecondaryLink
          href={engagementsCopy.receive.link.href}
          className="mt-6"
        >
          {engagementsCopy.receive.link.label}
        </SecondaryLink>
      </Section>

      <ClosingCta primaryCta="Request an assessment" />
    </>
  );
}
