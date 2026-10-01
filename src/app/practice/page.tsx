import { RevealHeading } from "@/components/ui/RevealHeading";
import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { practiceCopy } from "@/content/copy/practice";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The practice | SkilledScan",
  description:
    "Run by a penetration tester with 150+ engagements, a 4.9 rating, and NCIIPC Hall of Fame recognition.",
  path: "/practice",
});

export default function PracticePage() {
  return (
    <>
      <Section>
        <RevealHeading className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {practiceCopy.h1}
        </RevealHeading>
        <div className="measure mt-6 flex flex-col gap-4 text-[18px] text-ink-soft">
          {practiceCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ExternalLink
          href={facts.practitioner.profileUrl}
          className="mt-6 inline-block text-[15px]"
        >
          {practiceCopy.profileLink}
        </ExternalLink>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {practiceCopy.how.h2}
        </h2>
        <ul className="mt-10 flex flex-col gap-8">
          {practiceCopy.how.items.map((item) => (
            <li
              key={item.lead}
              className="border-t border-rule pt-8 first:border-t-0 first:pt-0"
            >
              <p className="text-[20px] font-semibold text-ink">{item.lead}</p>
              <p className="mt-2 max-w-xl text-[17px] text-ink-soft">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {practiceCopy.honest.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {practiceCopy.honest.body}
        </p>
        <SecondaryLink href={practiceCopy.honest.link.href} className="mt-6">
          {practiceCopy.honest.link.label}
        </SecondaryLink>
      </Section>

      <ClosingCta primaryCta="Request an assessment" />
    </>
  );
}
