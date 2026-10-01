export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

const severityClass: Record<Severity, string> = {
  Critical: "bg-severity-critical",
  High: "bg-severity-high",
  Medium: "bg-severity-medium",
  Low: "bg-severity-low",
  Info: "bg-severity-info",
};

export function severitySwatchClass(severity: Severity): string {
  return severityClass[severity];
}

export function SeverityChip({ severity }: { severity: Severity }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-raised px-3 py-1">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 ${severityClass[severity]}`}
      />
      <span className="font-[family-name:var(--font-mono)] text-[13px] text-ink">
        {severity}
      </span>
    </span>
  );
}
