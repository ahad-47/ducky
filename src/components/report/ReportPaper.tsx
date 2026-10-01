export function ReportPaper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="glass-strong rounded-[var(--radius-paper)] p-8 sm:p-12"
      style={{
        boxShadow: "0 1px 0 rgba(255,255,255,.08) inset, 0 24px 48px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </div>
  );
}
