import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { MethodLine } from "@/components/sections/MethodLine";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.howItWorks.h2}
      </h2>
      <p className="measure mt-4 text-[18px] text-ink-soft">
        {homeCopy.howItWorks.intro}
      </p>
      <div className="mt-12">
        <MethodLine steps={facts.method} />
      </div>
      <SecondaryLink href={homeCopy.howItWorks.link.href} className="mt-10">
        {homeCopy.howItWorks.link.label}
      </SecondaryLink>
    </Section>
  );
}
