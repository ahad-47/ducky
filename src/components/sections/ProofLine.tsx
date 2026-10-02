import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

const stats = [
  { value: String(facts.signalResult.raw), label: homeCopy.stats.raw },
  { value: String(facts.signalResult.verified), label: homeCopy.stats.confirmed },
  { value: String(facts.method.length), label: homeCopy.stats.phases },
  { value: facts.globalReach.countries, label: homeCopy.stats.countries },
];

export function ProofLine() {
  return (
    <section className="pb-[var(--section-padding)]">
      <Container>
        <div className="glass overflow-hidden rounded-[var(--radius-paper)]">
          <dl className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
            {stats.map((s, i) => (
              <div key={s.label} className={`p-6 sm:p-8 ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-white/10 md:border-r-0" : ""}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-[family-name:var(--font-serif)] text-[clamp(2.25rem,4vw,3.25rem)] leading-none text-ink">
                    {s.value}
                  </span>
                  <span className="mt-3 block text-[14.5px] leading-snug text-ink-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-white/10 px-6 py-5 text-[16px] text-ink-soft sm:px-8">{homeCopy.proofLine}</p>
        </div>
      </Container>
    </section>
  );
}
