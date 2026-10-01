import { Section } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { homeCopy } from "@/content/copy/home";

const icons = [
  // scan / search
  <path key="scan" d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3" />,
  // confirm / check
  <path key="confirm" d="m5 13 4 4L19 7" />,
  // report / document
  <path
    key="report"
    d="M8 3h6l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 0v5h5M9 13h6M9 17h6"
  />,
];

export function Problem() {
  return (
    <Section id="problem">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.problem.h2}
      </h2>
      <ScrollReveal as="ul" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {homeCopy.problem.items.map((item, i) => (
          <li
            key={item.lead}
            className="glass flex flex-col gap-4 rounded-[var(--radius-sm)] p-8"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9 text-accent-text"
            >
              {icons[i]}
            </svg>
            <p className="text-[20px] font-semibold text-ink">{item.lead}</p>
            <p className="text-[16px] text-ink-soft">{item.body}</p>
          </li>
        ))}
      </ScrollReveal>
      <p className="mt-12 font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.problem.closing}
      </p>
    </Section>
  );
}
