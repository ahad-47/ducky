import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/PageHeader";
import { MethodLine } from "@/components/sections/MethodLine";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="How it works" title={homeCopy.howItWorks.h2} intro={homeCopy.howItWorks.intro} />
          <SecondaryLink href={homeCopy.howItWorks.link.href} className="mt-8">
            {homeCopy.howItWorks.link.label}
          </SecondaryLink>
        </div>
        <div className="pl-4">
          <MethodLine steps={facts.method} />
        </div>
      </div>
    </Section>
  );
}
