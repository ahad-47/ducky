import { Section } from "@/components/ui/Container";
import { homeCopy } from "@/content/copy/home";

export function Problem() {
  return (
    <Section id="problem">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.problem.h2}
      </h2>
      <ul className="mt-10 flex flex-col gap-8">
        {homeCopy.problem.items.map((item) => (
          <li
            key={item.lead}
            className="border-t border-rule pt-8 first:border-t-0 first:pt-0"
          >
            <p className="text-[20px] font-semibold text-ink">{item.lead}</p>
            <p className="mt-2 max-w-xl text-[17px] text-ink-soft">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.problem.closing}
      </p>
    </Section>
  );
}
