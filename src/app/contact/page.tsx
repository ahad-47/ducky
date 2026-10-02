import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactCopy } from "@/content/copy/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request an assessment | SkilledScan",
  description:
    "Tell us the target and the scope. We confirm authorization before any testing begins.",
  path: "/contact",
});

const related = [
  { href: "/report-sample", label: "See a sample report", icon: "doc" as const },
  { href: "/engagements", label: "Compare engagements", icon: "layers" as const },
  { href: "/legal/acceptable-use", label: "Acceptable use policy", icon: "lock" as const },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title={contactCopy.h1} intro={contactCopy.intro} />
      <Section className="pt-0">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <Card pad="p-6 sm:p-8" className="lg:col-span-7">
            <ContactForm />
          </Card>
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:col-span-5">
            <Card>
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{contactCopy.sidePanel.h2}</h2>
              <ol className="relative mt-6 flex flex-col gap-6 border-l border-rule-strong pl-6">
                {contactCopy.sidePanel.steps.map((step, index) => (
                  <li key={step} className="relative text-[16px] text-ink-soft">
                    <span className="absolute -left-[37px] top-0 grid h-6 w-6 place-items-center rounded-full bg-accent font-[family-name:var(--font-mono)] text-[12px] text-accent-ink">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
            <Card pad="p-2">
              <ul>
                {related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="group flex items-center gap-3 rounded-[var(--radius-xs)] px-4 py-3 text-[15.5px] text-ink hover:bg-white/5"
                    >
                      <Icon name={r.icon} className="h-5 w-5 text-accent-text" />
                      {r.label}
                      <Icon name="arrow" className="ml-auto h-4 w-4 text-ink-soft transition-transform duration-[160ms] group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
