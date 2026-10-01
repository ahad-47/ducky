export function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[var(--radius-xs)] border border-rule bg-paper-raised p-6 ${className}`}
    >
      {children}
    </div>
  );
}
