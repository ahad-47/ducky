"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { facts } from "@/content/facts";

const lines = [
  "SkilledScan OS v1.0.0",
  "[ OK ] mounting governed scan engine",
  "[ OK ] loading policy gate",
  `[ OK ] indexing ${facts.signalResult.raw} raw observations`,
  `[ OK ] confirming ${facts.signalResult.verified} verified findings`,
  "welcome.",
];

export function BootSequence() {
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // This is a one-time client-only bootstrap check (sessionStorage isn't
    // available during SSR), so it necessarily sets state directly here.
    if (reducedMotion || sessionStorage.getItem("skilledscan-booted")) {
      return;
    }
    sessionStorage.setItem("skilledscan-booted", "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time reveal gated on a client-only sessionStorage check; there is no non-effect way to make this decision.
    setHidden(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 220));
    });
    timers.push(setTimeout(() => setHidden(true), lines.length * 220 + 500));

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper transition-opacity duration-500">
      <div className="font-[family-name:var(--font-mono)] text-[14px] text-ink-soft">
        {lines.slice(0, visibleLines).map((line, i) => (
          <p key={i} className={i === 0 ? "mb-2 text-ink" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
