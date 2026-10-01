import { RevealHeading } from "@/components/ui/RevealHeading";
import { Section } from "@/components/ui/Container";
import { complianceCopy } from "@/content/copy/compliance";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compliance | SkilledScan",
  description:
    "Testing evidence for DPDP safeguards and regulated-sector VAPT: scope, method, findings, and remediation in one report.",
  path: "/compliance",
});

export default function CompliancePage() {
  return (
    <>
      <Section>
        <RevealHeading className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {complianceCopy.h1}
        </RevealHeading>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {complianceCopy.intro}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {complianceCopy.dpdp.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {complianceCopy.dpdp.body}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {complianceCopy.regulated.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {complianceCopy.regulated.body}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {complianceCopy.record.h2}
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {complianceCopy.record.items.map((item) => (
            <li
              key={item}
              className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {complianceCopy.roadmap.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {complianceCopy.roadmap.body}
        </p>
        <p className="mt-10 text-[14px] text-ink-soft">{complianceCopy.note}</p>
      </Section>
    </>
  );
}
