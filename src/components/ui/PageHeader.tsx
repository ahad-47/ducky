import { RevealHeading } from "@/components/ui/RevealHeading";
import { Container } from "@/components/ui/Container";

// The opening block of every inner page: a short label, the page title, an
// intro paragraph, and optional actions or chips underneath.
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="pb-[calc(var(--section-padding)*0.5)] pt-[calc(var(--section-padding)*0.75)]">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <RevealHeading className="mt-3 max-w-[20ch] font-[family-name:var(--font-serif)] text-display-xl font-medium tracking-[-0.035em] text-ink">
          {title}
        </RevealHeading>
        {intro ? <p className="measure mt-6 text-[18px] text-ink-soft">{intro}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div> : null}
      </Container>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[14px] font-medium text-accent-text ${className}`}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className={`font-[family-name:var(--font-serif)] text-display-l font-medium tracking-[-0.03em] text-ink ${eyebrow ? "mt-2" : ""}`}>{title}</h2>
      {intro ? <div className="measure mt-4 text-[18px] text-ink-soft">{intro}</div> : null}
    </div>
  );
}
