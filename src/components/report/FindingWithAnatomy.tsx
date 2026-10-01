"use client";

import { useState } from "react";
import { Finding, type AnatomyField } from "@/components/report/Finding";
import { facts } from "@/content/facts";

const fieldKeys: AnatomyField[] = [
  "severity",
  "location",
  "evidence",
  "impact",
  "fix",
  "confidence",
];
const regionIds: Record<AnatomyField, string> = {
  severity: "finding-severity",
  location: "finding-location",
  evidence: "finding-evidence",
  impact: "finding-impact",
  fix: "finding-fix",
  confidence: "finding-confidence",
};

export function FindingWithAnatomy() {
  const [highlighted, setHighlighted] = useState<AnatomyField | null>(null);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
      <Finding finding={facts.reportSample.finding} highlighted={highlighted} />

      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
          Anatomy of a finding
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {facts.findingFields.map((item, index) => {
            const key = fieldKeys[index];
            return (
              <li key={item.field}>
                <button
                  type="button"
                  aria-controls={regionIds[key]}
                  aria-expanded={highlighted === key}
                  onMouseEnter={() => setHighlighted(key)}
                  onMouseLeave={() =>
                    setHighlighted((current) =>
                      current === key ? null : current,
                    )
                  }
                  onFocus={() => setHighlighted(key)}
                  onBlur={() =>
                    setHighlighted((current) =>
                      current === key ? null : current,
                    )
                  }
                  onClick={() =>
                    setHighlighted((current) => (current === key ? null : key))
                  }
                  className={`w-full rounded-[var(--radius-xs)] border border-rule px-4 py-3 text-left text-[15px] transition-colors duration-150 ${
                    highlighted === key
                      ? "bg-paper-raised text-ink"
                      : "text-ink-soft hover:bg-paper-raised"
                  }`}
                >
                  <span className="block font-medium text-ink">
                    {item.field}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink-soft">
                    {item.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
