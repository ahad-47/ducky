import { Section } from "@/components/ui/Container";
import { homeCopy } from "@/content/copy/home";

export function ProofLine() {
  return (
    <Section className="py-0 pb-[var(--section-padding)]">
      <p className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.proofLine}
      </p>
    </Section>
  );
}
