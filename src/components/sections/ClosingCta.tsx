import { Container } from "@/components/ui/Container";
import { PrimaryButton, SecondaryLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/PageHeader";
import { homeCopy } from "@/content/copy/home";

export function ClosingCta({
  h2 = homeCopy.closing.h2,
  body = homeCopy.closing.body,
  primaryCta = homeCopy.closing.primaryCta,
  secondary = { href: "/report-sample", label: "See a sample report" },
}: {
  h2?: string;
  body?: string;
  primaryCta?: string;
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="py-[var(--section-padding)]">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-paper)] border border-rule bg-paper-raised p-8 sm:p-12">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 className="mt-2 max-w-[20ch] font-[family-name:var(--font-serif)] text-display-l font-medium tracking-[-0.03em] text-ink">{h2}</h2>
              <p className="measure mt-4 text-[17px] text-ink-soft">{body}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-6">
              <PrimaryButton href="/contact">{primaryCta}</PrimaryButton>
              {secondary ? <SecondaryLink href={secondary.href}>{secondary.label}</SecondaryLink> : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
