export function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass rounded-[var(--radius-sm)] p-6 ${className}`}>
      {children}
    </div>
  );
}
