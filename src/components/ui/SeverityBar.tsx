"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { severitySwatchClass, type Severity } from "@/components/ui/SeverityChip";

export type SeverityBarSegment = {
  label: string;
  value: number;
  severity: Severity;
};

export function SeverityBar({
  segments,
  total,
  animated = false,
}: {
  segments: SeverityBarSegment[];
  total: number;
  animated?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!animated || reducedMotion || !containerRef.current) return;
      registerGsap();

      segmentRefs.current.forEach((el) => el && gsap.set(el, { width: "0%" }));
      countRefs.current.forEach((el) => el && (el.textContent = "0"));

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 50%",
        once: true,
        onEnter: () => {
          segments.forEach((segment, index) => {
            const el = segmentRefs.current[index];
            if (el) {
              gsap.to(el, {
                width: `${(segment.value / total) * 100}%`,
                duration: 0.9,
                ease: "report",
              });
            }
            const countEl = countRefs.current[index];
            if (countEl) {
              const counter = { value: 0 };
              gsap.to(counter, {
                value: segment.value,
                duration: 0.9,
                ease: "report",
                onUpdate: () => {
                  countEl.textContent = String(Math.round(counter.value));
                },
              });
            }
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: containerRef, dependencies: [animated, reducedMotion] },
  );

  return (
    <div ref={containerRef} data-severity-bar>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-rule bg-paper-raised">
        {segments.map((segment, index) => (
          <div
            key={segment.label}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
            data-severity-segment
            className={`h-full ${severitySwatchClass(segment.severity)}`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${severitySwatchClass(segment.severity)}`}
            />
            <dt className="sr-only">{segment.label}</dt>
            <dd className="font-[family-name:var(--font-mono)] text-[13px] text-ink-soft">
              <span
                ref={(el) => {
                  countRefs.current[index] = el;
                }}
                data-severity-count
                className="text-ink"
              >
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
