import {
  severitySwatchClass,
  type Severity,
} from "@/components/ui/SeverityChip";

export type SeverityBarSegment = {
  label: string;
  value: number;
  severity: Severity;
};

export function SeverityBar({
  segments,
  total,
}: {
  segments: SeverityBarSegment[];
  total: number;
}) {
  return (
    <div data-severity-bar>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-rule bg-paper-raised">
        {segments.map((segment) => (
          <div
            key={segment.label}
            data-severity-segment
            className={`h-full ${severitySwatchClass(segment.severity)}`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${severitySwatchClass(segment.severity)}`}
            />
            <dt className="sr-only">{segment.label}</dt>
            <dd className="font-[family-name:var(--font-mono)] text-[13px] text-ink-soft">
              <span data-severity-count className="text-ink">
                {segment.value}
              </span>{" "}
              {segment.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
