export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-rule px-3 py-1 text-sm text-ink-soft">
      {children}
    </span>
  );
}
