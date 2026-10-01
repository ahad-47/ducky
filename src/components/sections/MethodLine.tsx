import type { facts } from "@/content/facts";

type MethodStep = (typeof facts)["method"][number];

export function MethodLine({
  steps,
  showDetail = false,
}: {
  steps: readonly MethodStep[];
  showDetail?: boolean;
}) {
  return (
    <ol
      data-method-line
      className="relative flex flex-col gap-12 border-l-2 border-accent pl-10"
    >
      {steps.map((step) => (
        <li key={step.step} className="relative">
          <span
            data-method-marker
            className="absolute -left-14 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-mono)] text-sm text-accent-ink"
          >
            {step.step}
          </span>
          <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
            {step.name}
          </h3>
          <p className="mt-2 text-[17px] text-ink-soft">{step.short}</p>
          {showDetail ? (
            <p className="mt-2 text-[15px] text-ink-soft">{step.detail}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
