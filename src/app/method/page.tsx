import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { MethodLine } from "@/components/sections/MethodLine";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { methodCopy } from "@/content/copy/method";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Method | SkilledScan",
  description:
    "Six phases from recon to report. Fast groundwork under strict limits, every finding confirmed by hand.",
  path: "/method",
});

export default function MethodPage() {
  return (
    <>
      <Section>
        <h1 className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {methodCopy.h1}
        </h1>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {methodCopy.intro}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {methodCopy.phases.h2}
        </h2>
        <div className="mt-12">
          <MethodLine steps={facts.method} showDetail />
        </div>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {methodCopy.system.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {methodCopy.system.intro}
        </p>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {methodCopy.system.body}
        </p>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
              {methodCopy.system.doesLabel}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {facts.system.does.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
              {methodCopy.system.doesNotLabel}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {facts.system.doesNot.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-[17px] text-ink-soft">{facts.system.note}</p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {methodCopy.governance.h2}
        </h2>
        <ul className="mt-10 flex flex-col gap-3">
          {facts.system.governance.map((item) => (
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
          {methodCopy.verification.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {methodCopy.verification.body}
        </p>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {methodCopy.authorization.h2}
        </h2>
        <p className="measure mt-4 text-[18px] text-ink-soft">
          {methodCopy.authorization.body}
        </p>
        <SecondaryLink
          href={methodCopy.authorization.link.href}
          className="mt-6"
        >
          {methodCopy.authorization.link.label}
        </SecondaryLink>
      </Section>

      <ClosingCta primaryCta={methodCopy.closing.primaryCta} />
    </>
  );
}
