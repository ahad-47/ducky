import { Section } from "@/components/ui/Container";
import { SecurityForm } from "@/components/sections/SecurityForm";
import { securityCopy } from "@/content/copy/security";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security and disclosure | SkilledScan",
  description: "How to report a vulnerability in SkilledScan.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <>
      <Section>
        <h1 className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {securityCopy.h1}
        </h1>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {securityCopy.intro}
        </p>
      </Section>

      <Section className="pt-0">
        <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
          {securityCopy.guidelines.h2}
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {securityCopy.guidelines.items.map((item) => (
            <li
              key={item}
              className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="measure mt-8 flex flex-col gap-4 text-[17px] text-ink-soft">
          <p>{securityCopy.guidelines.bodyInclude}</p>
          <p>{securityCopy.guidelines.bodyGoodFaith}</p>
          <p>
            Machine-readable contact details are at{" "}
            <a
              href="/.well-known/security.txt"
              className="underline decoration-accent decoration-[1px] underline-offset-4"
            >
              /.well-known/security.txt
            </a>
            .
          </p>
        </div>
      </Section>

      <Section>
        <SecurityForm />
      </Section>
    </>
  );
}
