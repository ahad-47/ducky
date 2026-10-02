import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

// One editorial figure from a real scan, instead of a row of stat tiles.
export function ProofLine() {
  return (
    <section className="pb-[var(--section-padding)]">
      <Container>
        <div className="grid grid-cols-1 items-end gap-8 border-y border-rule py-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div>
            <p className="text-[14px] text-ink-soft">{homeCopy.proof.label}</p>
            <p className="mt-3 flex items-baseline gap-4 font-[family-name:var(--font-serif)] font-medium leading-none tracking-[-0.04em]">
              <span className="text-[clamp(3rem,7vw,5.5rem)] text-ink-soft/70">{facts.signalResult.raw}</span>
              <span aria-hidden className="text-[clamp(1.5rem,3vw,2.5rem)] text-ink-soft/50">→</span>
              <span className="text-[clamp(3rem,7vw,5.5rem)] text-accent">{facts.signalResult.verified}</span>
            </p>
            <p className="mt-3 flex gap-10 text-[14px] text-ink-soft">
              <span>{homeCopy.proof.raw}</span>
              <span>{homeCopy.proof.confirmed}</span>
            </p>
          </div>
          <p className="measure text-[18px] leading-relaxed text-ink-soft">{homeCopy.proof.body}</p>
        </div>
      </Container>
    </section>
  );
}
