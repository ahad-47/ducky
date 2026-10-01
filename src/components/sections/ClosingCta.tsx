import { Section } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/Button";

export function ClosingCta({
  h2,
  body,
  primaryCta = "Request an assessment",
}: {
  h2?: string;
  body?: string;
  primaryCta?: string;
}) {
  return (
    <Section>
      {h2 ? (
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {h2}
        </h2>
      ) : null}
      {body ? (
        <p className="measure mt-4 text-[18px] text-ink-soft">{body}</p>
      ) : null}
      <PrimaryButton href="/contact" className={h2 ? "mt-8" : ""}>
        {primaryCta}
      </PrimaryButton>
    </Section>
  );
}
