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

      const split = SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: durations.reveal,
            stagger: 0.08,
            ease: "report",
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
