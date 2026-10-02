import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SecurityForm } from "@/components/sections/SecurityForm";
import { securityCopy } from "@/content/copy/security";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security and disclosure | SkilledScan",
  description: "How to report a vulnerability in SkilledScan.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <>
      <PageHeader eyebrow="Security" title={securityCopy.h1} intro={securityCopy.intro}>
        <a href="/.well-known/security.txt" className="inline-flex">
          <Badge tone="neutral">
            <Icon name="doc" className="h-3.5 w-3.5" />
            /.well-known/security.txt
          </Badge>
        </a>
        <Badge tone="live">No legal action for good-faith research</Badge>
      </PageHeader>

      <Section className="pt-0">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{securityCopy.guidelines.h2}</h2>
            <ol className="flex flex-col gap-3">
              {securityCopy.guidelines.items.map((item, i) => (
                <li key={item} className="glass flex gap-4 rounded-[var(--radius-sm)] px-5 py-4 text-[16px] text-ink">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] leading-6 text-accent-text">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3 rounded-[var(--radius-sm)] border border-accent/30 bg-accent/10 p-5 text-[15.5px] text-ink">
              <p className="flex gap-3">
                <Icon name="bug" className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" />
                {securityCopy.guidelines.bodyInclude}
              </p>
              <p className="flex gap-3">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" />
                {securityCopy.guidelines.bodyGoodFaith}
              </p>
            </div>
          </div>

          <Card pad="p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">Report a vulnerability</h2>
            <p className="mb-8 mt-2 text-[15.5px] text-ink-soft">We reply to the email address you enter.</p>
            <SecurityForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
