"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";
import type { facts } from "@/content/facts";

type MethodStep = (typeof facts)["method"][number];

export function MethodLine({
  steps,
  showDetail = false,
}: {
  steps: readonly MethodStep[];
  showDetail?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const line = lineRef.current;
      const container = containerRef.current;
      if (!line || !container) return;

      function setFilled(marker: HTMLSpanElement, filled: boolean) {
        marker.classList.toggle("bg-accent", filled);
        marker.classList.toggle("border-accent", filled);
        marker.classList.toggle("text-accent-ink", filled);
        marker.classList.toggle("bg-paper", !filled);
        marker.classList.toggle("border-rule-strong", !filled);
        marker.classList.toggle("text-ink-soft", !filled);
      }

      if (reducedMotion) {
        gsap.set(line, { drawSVG: "100%" });
        markerRefs.current.forEach((marker) => marker && setFilled(marker, true));
        return;
      }

      gsap.set(line, { drawSVG: "0%" });
      markerRefs.current.forEach((marker) => marker && setFilled(marker, false));

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(line, { drawSVG: `${self.progress * 100}%` });
          const stepCount = steps.length;
          markerRefs.current.forEach((marker, index) => {
            if (!marker) return;
            const threshold = stepCount > 1 ? index / (stepCount - 1) : 0;
            setFilled(marker, self.progress >= threshold);
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: containerRef, dependencies: [reducedMotion, steps.length] },
  );

  return (
    <div ref={containerRef} className="relative">
      <svg
        className="pointer-events-none absolute left-0 top-0 h-full w-0.5 overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
        aria-hidden="true"
      >
        <line
          ref={lineRef}
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="var(--accent)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol data-method-line className="flex flex-col gap-12 pl-10">
        {steps.map((step, index) => (
          <li key={step.step} className="relative">
            <span
              ref={(el) => {
                markerRefs.current[index] = el;
              }}
              data-method-marker
              className="absolute -left-14 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-rule-strong bg-paper font-[family-name:var(--font-mono)] text-sm text-ink-soft transition-colors duration-150"
            >
              {step.step}
            </span>
            <h3 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{step.name}</h3>
            <p className="mt-2 text-[17px] text-ink-soft">{step.short}</p>
            {showDetail ? <p className="mt-2 text-[15px] text-ink-soft">{step.detail}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
