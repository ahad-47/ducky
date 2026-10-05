import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import Link from "@/components/ui/SiteLink";
import { CopyEmail } from "@/components/sections/CopyEmail";
import { contactCopy } from "@/content/copy/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Security Scan | Contact SkilledScan",
  description: `Request a web application or API security scan, ask about early access, or ask a question. Email ${contactCopy.email}.`,
  path: "/contact",
});

const related = [
  { href: "/report-sample", label: "See a sample report", icon: "doc" as const },
  { href: "/engagements", label: "Compare scan types", icon: "layers" as const },
  { href: "/legal/acceptable-use", label: "Acceptable use policy", icon: "lock" as const },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={contactCopy.eyebrow} title={contactCopy.h1} intro={contactCopy.intro} />
      <Section className="pt-0">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Card pad="p-6 sm:p-8" className="relative overflow-hidden">
              <div className="relative">
                <p className="mt-5 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
                  {contactCopy.emailLabel}
                </p>
                <a
                  href={`mailto:${contactCopy.email}`}
                  className="mt-1 block break-all font-[family-name:var(--font-serif)] text-[clamp(1.5rem,3.6vw,2.25rem)] text-ink underline decoration-accent decoration-[1.5px] underline-offset-[6px] hover:text-accent-text"
                >
                  {contactCopy.email}
                </a>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${contactCopy.email}?subject=${encodeURIComponent("SkilledScan early access")}`}
                    className="inline-flex h-11 items-center rounded-[var(--radius-xs)] bg-accent px-5 text-[15px] font-semibold text-accent-ink hover:bg-accent-hover"
                  >
                    Write an email
                  </a>
                  <CopyEmail email={contactCopy.email} />
                </div>
              </div>
            </Card>
            <Card pad="p-6 sm:p-8">
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{contactCopy.include.h2}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {contactCopy.include.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] text-ink-soft">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
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
                      className="group flex items-center gap-3 rounded-[var(--radius-xs)] px-4 py-3 text-[15.5px] text-ink hover:bg-accent-tint"
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
