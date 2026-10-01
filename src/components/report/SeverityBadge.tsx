import {
  severitySwatchClass,
  type Severity,
} from "@/components/ui/SeverityChip";

export function SeverityBadge({
  severity,
  cvss,
}: {
  severity: Severity;
  cvss: string;
}) {
  return (
    <span className="inline-flex items-center overflow-hidden rounded-full border border-rule bg-paper-raised font-[family-name:var(--font-mono)] text-[13px]">
      <span className="flex items-center gap-2 px-3 py-1.5">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full ${severitySwatchClass(severity)}`}
        />
        <span className="uppercase text-ink">{severity}</span>
      </span>
      <span className="border-l border-rule px-3 py-1.5 text-ink-soft">
        CVSS {cvss}
      </span>
    </span>
  );
}
