import { RevealHeading } from "@/components/ui/RevealHeading";
import { Section } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactCopy } from "@/content/copy/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request an assessment | SkilledScan",
  description:
    "Tell us the target and the scope. We confirm authorization before any testing begins.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section>
      <RevealHeading className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
        {contactCopy.h1}
      </RevealHeading>
      <p className="measure mt-6 text-[18px] text-ink-soft">
        {contactCopy.intro}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
            {contactCopy.sidePanel.h2}
          </h2>
          <ol className="mt-6 flex flex-col gap-4">
            {contactCopy.sidePanel.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="font-[family-name:var(--font-mono)] text-[15px] text-ink-soft">
                  {index + 1}.
                </span>
                <span className="text-[17px] text-ink-soft">{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}
