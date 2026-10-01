"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap, durations } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

/**
 * Wraps a group of direct children and staggers them in (fade + rise) as the
 * group scrolls into view. Pass `selector` to target descendants instead of
 * direct children (e.g. list items inside a <ul>).
 */
export function ScrollReveal({
  children,
  className = "",
  selector,
  stagger = 0.08,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      registerGsap();

      const targets = selector ? ref.current.querySelectorAll(selector) : Array.from(ref.current.children);
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y: 24 });

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: durations.reveal,
            ease: "report",
            stagger,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: ref, dependencies: [reducedMotion, selector, stagger] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
