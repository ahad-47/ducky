import Link from "next/link";
import { Section } from "@/components/ui/Container";

type LegalSection = {
  heading: string;
  body?: string;
  list?: readonly string[];
  link?: { label: string; href: string };
};

export function LegalPage({
  h1,
  lastUpdated,
  sections,
}: {
  h1: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
}) {
  return (
    <Section>
      <h1 className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
        {h1}
      </h1>
      <p className="mt-4 text-[15px] text-ink-soft">{lastUpdated}</p>
      <div className="measure mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
              {section.heading}
            </h2>
            {section.body ? (
              <p className="mt-2 text-[17px] text-ink-soft">{section.body}</p>
            ) : null}
            {section.list ? (
              <ul className="mt-2 flex flex-col gap-2">
                {section.list.map((item) => (
                  <li key={item} className="text-[17px] text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.link ? (
              <Link
                href={section.link.href}
                className="mt-2 inline-block text-[15px] text-ink underline decoration-accent decoration-[1px] underline-offset-4"
              >
                {section.link.label}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
