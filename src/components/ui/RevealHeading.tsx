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

      // Split by words, not lines, and animate opacity/transform only: no
      // element here ever gets `overflow: clip`. A line-mask reveal clips
      // each line to a box sized at split time, which silently cuts off
      // real text if that measurement races a webfont swap or a later
      // resize (confirmed happening intermittently with `type: "lines"` +
      // `mask: "lines"`). Word-level fade-and-rise reads almost the same
      // but can never hide content if the measurement is ever stale.
      split = SplitText.create(ref.current, {
        type: "words",
        wordsClass: "inline-block",
      });

      gsap.from(split.words, {
        opacity: 0,
        y: 16,
        duration: durations.reveal,
        stagger: 0.025,
        ease: "report",
      });

      return () => split?.revert();
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
