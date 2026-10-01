"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, registerGsap, durations } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

export function RevealHeading({
  as: Tag = "h1",
  className,
  children,
}: {
  as?: "h1";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      registerGsap();

      let split: SplitText | null = null;
      let cancelled = false;
      let resizeTimer: ReturnType<typeof setTimeout> | null = null;
      let hasRevealed = false;

      // autoSplit's own resize handling re-splits immediately on resize,
      // which can race with layout/font settling the same way the initial
      // split can. Splitting (and re-splitting on resize) is done manually
      // here, always behind the same "wait two frames" safety net, so a
      // line's clipped mask box is never sized against stale metrics.
      function settleThenSplit(reveal: boolean) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled || !ref.current) return;
            split?.revert();
            split = SplitText.create(ref.current, {
              type: "lines",
              mask: "lines",
            });
            if (reveal && !hasRevealed) {
              hasRevealed = true;
              gsap.from(split.lines, {
                yPercent: 100,
                duration: durations.reveal,
                stagger: 0.08,
                ease: "report",
              });
            }
          });
        });
      }

      document.fonts.ready.then(() => {
        if (cancelled) return;
        settleThenSplit(true);
      });

      function onResize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => settleThenSplit(false), 150);
      }
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        split?.revert();
      };
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
