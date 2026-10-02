import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { homeCopy } from "@/content/copy/home";

export function Features() {
  return (
    <Section id="platform">
      <SectionHeading eyebrow={homeCopy.features.eyebrow} title={homeCopy.features.h2} />
      <ScrollReveal as="ul" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeCopy.features.items.map((f) => (
          <li key={f.title} className="glass flex flex-col gap-3 rounded-[var(--radius-sm)] p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent-text">
              <Icon name={f.icon as IconName} className="h-5 w-5" />
            </span>
            <h3 className="text-[17px] font-semibold text-ink">{f.title}</h3>
            <p className="text-[15.5px] text-ink-soft">{f.body}</p>
          </li>
        ))}
      </ScrollReveal>
    </Section>
  );
}
