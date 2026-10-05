import { headers } from "next/headers";
import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { faqCopy } from "@/content/copy/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security Scanning FAQ | SkilledScan",
  description:
    "Answers on authorization, scope, production safety, report contents, rescans and compliance evidence for SkilledScan web and API scans.",
  path: "/faq",
});

export default async function FaqPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCopy.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        // Built only from content files via JSON.stringify.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={faqCopy.eyebrow} title={faqCopy.h1} intro={faqCopy.intro} />
      <Section className="pt-0">
        <div className="glass divide-y divide-rule rounded-[var(--radius-sm)]">
          {faqCopy.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                <h2>{item.q}</h2>
                <span aria-hidden className="shrink-0 text-ink-soft transition-transform duration-[160ms] group-open:rotate-180">
                  <Icon name="chevron" className="h-4 w-4" />
                </span>
              </summary>
              <p className="measure px-6 pb-6 text-[16.5px] leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <ClosingCta />
    </>
  );
}
