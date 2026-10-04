export function Card({
  className = "",
  pad = "p-6 sm:p-7",
  as: Tag = "div",
  children,
  id,
}: {
  className?: string;
  pad?: string;
  as?: "div" | "li" | "article" | "aside";
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={`glass rounded-[var(--radius-sm)] ${pad} ${className}`}>
      {children}
    </Tag>
  );
}

export function Badge({
  tone = "accent",
  children,
}: {
  tone?: "accent" | "live" | "next" | "neutral" | "warn";
  children: React.ReactNode;
}) {
  const tones = {
    accent: "border-accent/25 bg-accent-tint text-accent-text",
    live: "border-severity-low/40 bg-severity-low/10 text-severity-low",
    next: "border-severity-medium/40 bg-severity-medium/10 text-severity-medium",
    warn: "border-severity-high/40 bg-severity-high/10 text-severity-high",
    neutral: "border-rule bg-paper-raised text-ink-soft",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-[family-name:var(--font-mono)] text-[12px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
