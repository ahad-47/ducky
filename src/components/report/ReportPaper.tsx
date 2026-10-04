import { WindowChrome } from "@/components/os/WindowChrome";

export function ReportPaper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="glass-strong rounded-[var(--radius-paper)] p-8 sm:p-12"
    >
      <WindowChrome title="report-sample.pdf" />
      {children}
    </div>
  );
}
