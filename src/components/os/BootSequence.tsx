"use client";

import { useEffect, useRef, useState } from "react";
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
const LINE_MS = 220;
const HOLD_MS = 500;
const TOTAL_MS = lines.length * LINE_MS + HOLD_MS;

export function BootSequence() {
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [hidden, setHidden] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    // Gate on sessionStorage only to read it; the "booted" flag is written
    // only once the sequence actually completes (see below). Writing it
    // eagerly at the start of this effect, instead of at the end, breaks
    // under React Strict Mode's dev-only mount -> cleanup -> mount replay:
    // the first (soon-to-be-cleaned-up) invocation would mark the session
    // as booted and set the overlay visible, its own cleanup would then
    // cancel its timers before they fire, and the second invocation would
    // see the session already marked booted and skip starting a new timer
    // loop entirely, leaving the overlay permanently stuck on screen.
    if (reducedMotion || completedRef.current || sessionStorage.getItem("skilledscan-booted")) {
      return;
    }

    const startedAt = Date.now();
    setHidden(false);

    let rafId: number;
    function tick() {
      const elapsed = Date.now() - startedAt;
      setVisibleLines(Math.min(lines.length, Math.floor(elapsed / LINE_MS) + 1));

      if (elapsed >= TOTAL_MS) {
        completedRef.current = true;
        sessionStorage.setItem("skilledscan-booted", "1");
        setHidden(true);
        return;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
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
