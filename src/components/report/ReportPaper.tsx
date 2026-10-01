export function ReportPaper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[var(--radius-paper)] border border-rule bg-paper-raised p-8 sm:p-12"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.05)",
      }}
    >
      {children}
    </div>
  );
}
