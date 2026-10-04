import { LogoMark } from "@/components/ui/Logo";

// Decorative radar sweep for the coming-soon page. Pure CSS animation,
// paused for visitors who prefer reduced motion.
export function ScannerRadar({ label }: { label: string }) {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute inset-0 rounded-full border border-accent/30 bg-[radial-gradient(circle,rgba(36,83,230,0.08)_0%,transparent_70%)]" />
      {[0.75, 0.5, 0.25].map((s) => (
        <div
          key={s}
          className="absolute rounded-full border border-accent/20"
          style={{ inset: `${((1 - s) / 2) * 100}%` }}
        />
      ))}
      <div className="absolute inset-x-0 top-1/2 h-px bg-accent/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-accent/15" />
      <div
        className="scanner-sweep absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, rgba(36,83,230,0.22), transparent 22%)" }}
      />
      {[
        [28, 34],
        [68, 26],
        [74, 64],
        [36, 72],
        [55, 47],
      ].map(([x, y], i) => (
        <span
          key={i}
          className="scanner-blip absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-severity-low"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rule bg-paper-raised shadow-[var(--shadow-soft)] px-6 py-5 text-accent-text">
          <LogoMark className="h-12 w-12" />
          <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.2em] text-ink-soft">{label}</span>
        </div>
      </div>
    </div>
  );
}
