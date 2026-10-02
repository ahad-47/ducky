import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/PageHeader";
import { homeCopy } from "@/content/copy/home";

// A two-column specification list rather than a grid of icon cards.
export function Features() {
  return (
    <Section id="platform">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow={homeCopy.features.eyebrow} title={homeCopy.features.h2} className="lg:sticky lg:top-28 lg:self-start" />
        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {homeCopy.features.items.map((f) => (
            <div key={f.title} className="border-t border-rule py-6">
              <dt className="text-[17px] font-medium text-ink">{f.title}</dt>
              <dd className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
