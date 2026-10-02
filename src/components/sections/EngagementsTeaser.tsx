import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";
import { slugify } from "@/lib/slug";

export function EngagementsTeaser() {
  return (
    <Section id="engagements">
      <SectionHeading eyebrow="Engagements" title={homeCopy.engagementsTeaser.h2} />
      <ScrollReveal as="ul" className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {facts.engagements.map((engagement, i) => (
          <li key={engagement.name}>
            <Link prefetch={false}
              href={`/engagements#${slugify(engagement.name)}`}
              className="glass group flex h-full flex-col gap-3 rounded-[var(--radius-sm)] p-7 transition-colors duration-[160ms] hover:border-accent/60 hover:bg-white/[0.08]"
            >
              <span className="font-[family-name:var(--font-mono)] text-[12.5px] text-accent-text">0{i + 1}</span>
              <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{engagement.name}</h3>
              <p className="text-[16px] text-ink-soft">{engagement.summary}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[14.5px] font-medium text-ink">
                Details
                <Icon name="arrow" className="h-4 w-4 transition-transform duration-[160ms] group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ScrollReveal>
      <SecondaryLink href={homeCopy.engagementsTeaser.link.href} className="mt-10">
        {homeCopy.engagementsTeaser.link.label}
      </SecondaryLink>
    </Section>
  );
}
