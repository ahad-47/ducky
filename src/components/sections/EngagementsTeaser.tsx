import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

export function EngagementsTeaser() {
  return (
    <Section id="engagements">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.engagementsTeaser.h2}
      </h2>
      <ul className="mt-10 flex flex-col gap-8">
        {facts.engagements.map((engagement) => (
          <li
            key={engagement.name}
            className="border-t border-rule pt-8 first:border-t-0 first:pt-0"
          >
            <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
              {engagement.name}
            </h3>
            <p className="measure mt-2 text-[17px] text-ink-soft">
              {engagement.summary}
            </p>
          </li>
        ))}
      </ul>
      <SecondaryLink
        href={homeCopy.engagementsTeaser.link.href}
        className="mt-10"
      >
        {homeCopy.engagementsTeaser.link.label}
      </SecondaryLink>
    </Section>
  );
}
