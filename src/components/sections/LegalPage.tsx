import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Card";
import { slugify } from "@/lib/slug";

type LegalSection = {
  heading: string;
  body?: string;
  list?: readonly string[];
  link?: { label: string; href: string };
};

const legalPages = [
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/acceptable-use", label: "Acceptable use" },
];

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
    <>
      <PageHeader eyebrow="Legal" title={h1}>
        <Badge tone="neutral">{lastUpdated}</Badge>
      </PageHeader>
      <Section className="pt-0">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28">
            <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">On this page</p>
            <ol className="mt-3 flex flex-col gap-1 border-l border-rule">
              {sections.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#${slugify(section.heading)}`}
                    className="-ml-px block border-l border-transparent py-1 pl-4 text-[14.5px] text-ink-soft hover:border-accent hover:text-ink"
                  >
                    <span className="mr-2 font-[family-name:var(--font-mono)] text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">Policies</p>
            <ul className="mt-3 flex flex-col gap-1">
              {legalPages.map((p) => (
                <li key={p.href}>
                  <Link prefetch={false} href={p.href} className="text-[14.5px] text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="measure flex flex-col">
            {sections.map((section, i) => (
              <section
                key={section.heading}
                id={slugify(section.heading)}
                className="border-t border-rule py-8 first:border-t-0 first:pt-0"
              >
                <h2 className="flex items-baseline gap-3 font-[family-name:var(--font-serif)] text-h3 text-ink">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                {section.body ? <p className="mt-3 text-[17px] text-ink-soft">{section.body}</p> : null}
                {section.list ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-[17px] text-ink-soft">
                        <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent-text" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.link ? (
                  <Link prefetch={false}
                    href={section.link.href}
                    className="mt-3 inline-block text-[15px] text-ink underline decoration-accent decoration-[1px] underline-offset-4"
                  >
                    {section.link.label}
                  </Link>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
