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
        <div className="relative overflow-hidden rounded-[var(--radius-paper)] border border-white/10 bg-paper-raised/60 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-[90px]"
            style={{ background: "radial-gradient(circle, #3d5fde 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full opacity-30 blur-[90px]"
            style={{ background: "radial-gradient(circle, #5eead4 0%, transparent 70%)" }}
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 className="mt-3 max-w-[20ch] font-[family-name:var(--font-serif)] text-display-l text-ink">{h2}</h2>
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
