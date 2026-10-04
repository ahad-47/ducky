"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

// The page title comes into focus as one block: a slow fade, a short rise
// and a blur that clears. No per-word stagger, nothing that can clip text.
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
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 14, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "lux", clearProps: "filter,transform" },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
