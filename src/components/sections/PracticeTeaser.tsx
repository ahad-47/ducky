import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { homeCopy } from "@/content/copy/home";

export function PracticeTeaser() {
  return (
    <Section id="practice">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.practice.h2}
      </h2>
      <p className="measure mt-4 text-[18px] text-ink-soft">
        {homeCopy.practice.body}
      </p>
      <SecondaryLink href={homeCopy.practice.link.href} className="mt-8">
        {homeCopy.practice.link.label}
      </SecondaryLink>
    </Section>
  );
}
