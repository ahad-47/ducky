import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

export function EngagementsTeaser() {
  return (
    <Section id="engagements">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.engagementsTeaser.h2}
      </h2>
      <ScrollReveal as="ul" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {facts.engagements.map((engagement, i) => (
          <li
            key={engagement.name}
            className="glass relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-sm)] p-8"
          >
            <span className="font-[family-name:var(--font-mono)] text-[13px] text-accent-text">
              0{i + 1}
            </span>
            <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
              {engagement.name}
            </h3>
            <p className="text-[16px] text-ink-soft">{engagement.summary}</p>
          </li>
        ))}
      </ScrollReveal>
      <SecondaryLink href={homeCopy.engagementsTeaser.link.href} className="mt-10">
        {homeCopy.engagementsTeaser.link.label}
      </SecondaryLink>
    </Section>
  );
}
