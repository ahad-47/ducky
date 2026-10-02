import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { complianceCopy } from "@/content/copy/compliance";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compliance | SkilledScan",
  description:
    "Testing evidence for global compliance frameworks and regulated industries: scope, method, findings, and remediation in one report.",
  path: "/compliance",
});

// Named in the frameworks copy below; shown as chips for scanning.
const frameworks = ["GDPR", "SOC 2 readiness", "ISO 27001 alignment", "Regional data protection laws"];

export default function CompliancePage() {
  return (
    <>
      <PageHeader eyebrow="Compliance" title={complianceCopy.h1} intro={complianceCopy.intro}>
        <Badge tone="warn">Evidence, not certification</Badge>
      </PageHeader>

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card pad="p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-text">
              <Icon name="globe" className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-[family-name:var(--font-serif)] text-h3 text-ink">{complianceCopy.frameworks.h2}</h2>
            <p className="mt-3 text-[16.5px] text-ink-soft">{complianceCopy.frameworks.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Frameworks mentioned">
              {frameworks.map((f) => (
                <li key={f}>
                  <Badge tone="neutral">{f}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card pad="p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-text">
              <Icon name="bank" className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-[family-name:var(--font-serif)] text-h3 text-ink">{complianceCopy.regulated.h2}</h2>
            <p className="mt-3 text-[16.5px] text-ink-soft">{complianceCopy.regulated.body}</p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="On record" title={complianceCopy.record.h2} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {complianceCopy.record.items.map((item) => (
            <li key={item} className="glass flex items-center gap-4 rounded-[var(--radius-sm)] px-5 py-4 text-[16.5px] text-ink">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-severity-low/15 text-severity-low">
                <Icon name="check" className="h-4 w-4" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Card pad="p-8" className="flex flex-col gap-5 border-severity-medium/30 bg-severity-medium/[0.04] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="next">Building</Badge>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-h3 text-ink">{complianceCopy.roadmap.h2}</h2>
            <p className="mt-2 text-[16.5px] text-ink-soft">{complianceCopy.roadmap.body}</p>
          </div>
          <Link
            href="/roadmap"
            className="inline-flex shrink-0 items-center gap-2 font-medium text-ink underline decoration-accent underline-offset-4"
          >
            View the roadmap
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </Card>
        <p className="mt-6 text-[14px] text-ink-soft">{complianceCopy.note}</p>
      </Section>

      <ClosingCta />
    </>
  );
}
