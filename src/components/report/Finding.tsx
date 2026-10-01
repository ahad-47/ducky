import { SeverityBadge } from "@/components/report/SeverityBadge";
import type { facts } from "@/content/facts";
import type { Severity } from "@/components/ui/SeverityChip";

export type AnatomyField =
  "severity" | "location" | "evidence" | "impact" | "fix" | "confidence";

type FindingData = (typeof facts)["reportSample"]["finding"];

const regionBase = "rounded-[var(--radius-xs)] transition-colors duration-150";
const regionHighlight = "bg-paper-raised outline outline-2 outline-accent";

function regionClass(
  field: AnatomyField,
  highlighted: AnatomyField | null,
  extra = "",
) {
  return `${regionBase} ${extra} ${highlighted === field ? regionHighlight : ""}`;
}

export function Finding({
  finding,
  highlighted = null,
}: {
  finding: FindingData;
  highlighted?: AnatomyField | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div
        id="finding-severity"
        className={regionClass(
          "severity",
          highlighted,
          "inline-flex w-fit p-1",
        )}
      >
        <SeverityBadge
          severity={finding.severity as Severity}
          cvss={finding.cvss}
        />
      </div>

      <div className="border-l-2 border-accent pl-5">
        <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">
          {finding.title}
        </h3>
        <p
          id="finding-location"
          className={regionClass(
            "location",
            highlighted,
            "mt-2 inline-block px-1 font-[family-name:var(--font-mono)] text-[14px] text-ink-soft",
          )}
        >
          {finding.url}
        </p>
      </div>

      <p className="text-[17px] text-ink-soft">{finding.summary}</p>

      <div
        id="finding-evidence"
        className={regionClass("evidence", highlighted, "p-4")}
      >
        <div className="rounded-[var(--radius-xs)] border border-rule bg-paper-raised p-4">
          <pre className="whitespace-pre-wrap font-[family-name:var(--font-mono)] text-[13px] text-ink">
            {finding.evidence}
          </pre>
        </div>
        <p className="mt-2 text-[13px] text-ink-soft">
          {finding.evidenceCaption}
        </p>
      </div>

      <div
        id="finding-impact"
        className={regionClass("impact", highlighted, "p-4")}
      >
        <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
          Business impact
        </p>
        <p className="mt-2 text-[17px] text-ink">{finding.impact}</p>
      </div>

      <div id="finding-fix" className={regionClass("fix", highlighted, "p-4")}>
        <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
          Fix
        </p>
        <p className="mt-2 text-[17px] text-ink">{finding.fix}</p>
      </div>

      <div
        id="finding-confidence"
        className={regionClass(
          "confidence",
          highlighted,
          "inline-flex w-fit p-4",
        )}
      >
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
            Confidence
          </p>
          <p className="mt-2 text-[17px] text-ink">{finding.confidence}</p>
        </div>
      </div>
    </div>
  );
}
