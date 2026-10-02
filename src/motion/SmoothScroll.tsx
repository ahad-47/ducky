"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      // In-page links (legal tables of contents) clear the sticky header.
      anchors: { offset: -88 },
    });

    lenis.on("scroll", ScrollTrigger.update);

    function tick(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
