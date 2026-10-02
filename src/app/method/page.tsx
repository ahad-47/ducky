import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MethodLine } from "@/components/sections/MethodLine";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { methodCopy } from "@/content/copy/method";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Platform | SkilledScan",
  description:
    "The SkilledScan engine: six stages from discovery to report, policy-gated checks, sandboxed execution, and a full audit log.",
  path: "/method",
});

const raw = facts.verificationResult.raw;
const reported = facts.verificationResult.reported;

export default function MethodPage() {
  return (
    <>
      <PageHeader eyebrow={methodCopy.eyebrow} title={methodCopy.h1} intro={methodCopy.intro}>
        <Badge>{methodCopy.badges[0]}</Badge>
        <Badge tone="live">{methodCopy.badges[1]}</Badge>
        <Badge tone="neutral">{methodCopy.badges[2]}</Badge>
      </PageHeader>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="Pipeline" title={methodCopy.phases.h2} />
          </div>
          <div className="pl-4">
            <MethodLine steps={facts.method} showDetail />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={methodCopy.system.eyebrow}
          title={methodCopy.system.h2}
          intro={
            <>
              <p>{methodCopy.system.intro}</p>
              <p className="mt-4">{methodCopy.system.body}</p>
            </>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h3 className="flex items-center gap-3 font-[family-name:var(--font-serif)] text-h3 text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-severity-low/15 text-severity-low">
                <Icon name="check" className="h-5 w-5" />
              </span>
              {methodCopy.system.doesLabel}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {facts.system.does.map((item) => (
                <li key={item} className="flex gap-3 text-[16.5px] text-ink-soft">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-severity-low" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="flex items-center gap-3 font-[family-name:var(--font-serif)] text-h3 text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-severity-critical/15 text-severity-critical">
                <Icon name="x" className="h-5 w-5" />
              </span>
              {methodCopy.system.doesNotLabel}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {facts.system.doesNot.map((item) => (
                <li key={item} className="flex gap-3 text-[16.5px] text-ink-soft">
                  <Icon name="x" className="mt-1 h-4 w-4 shrink-0 text-severity-critical" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <p className="mt-6 flex items-start gap-3 rounded-[var(--radius-sm)] border border-accent/30 bg-accent/10 px-5 py-4 text-[16px] text-ink">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" />
          {facts.system.note}
        </p>
      </Section>

      <Section>
        <SectionHeading eyebrow="Guardrails" title={methodCopy.governance.h2} />
        <ul className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {facts.system.governance.map((item) => (
            <li key={item} className="flex gap-3 border-t border-rule py-5 text-[16.5px] text-ink">
              <Icon name="shield" className="mt-1 h-4 w-4 shrink-0 text-accent-text" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Verification" title={methodCopy.verification.h2} intro={methodCopy.verification.body} />
          <Card pad="p-8">
            <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
              {methodCopy.verification.figureLabel}
            </p>
            <div className="mt-6 flex items-end gap-4">
              <div>
                <p className="font-[family-name:var(--font-serif)] text-[clamp(2.75rem,5vw,4rem)] leading-none text-ink-soft">{raw}</p>
                <p className="mt-2 text-[14px] text-ink-soft">raw observations</p>
              </div>
              <Icon name="arrow" className="mb-8 h-7 w-7 shrink-0 text-accent-text" />
              <div>
                <p className="font-[family-name:var(--font-serif)] text-[clamp(2.75rem,5vw,4rem)] leading-none text-ink">{reported}</p>
                <p className="mt-2 text-[14px] text-ink-soft">reported findings</p>
              </div>
            </div>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, (reported / raw) * 100)}%` }} />
            </div>
            <p className="mt-3 text-[14px] text-ink-soft">
              {((reported / raw) * 100).toFixed(1)}% {methodCopy.verification.survived}
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <Card pad="p-8 sm:p-10" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-text">
              <Icon name="lock" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{methodCopy.authorization.h2}</h2>
              <p className="mt-2 text-[17px] text-ink-soft">{methodCopy.authorization.body}</p>
            </div>
          </div>
          <SecondaryLink href={methodCopy.authorization.link.href} className="shrink-0">
            {methodCopy.authorization.link.label}
          </SecondaryLink>
        </Card>
      </Section>

      <ClosingCta primaryCta={methodCopy.closing.primaryCta} />
    </>
  );
}
