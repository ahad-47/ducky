"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

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
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    function onMenuToggle(e: Event) {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      if (detail.open) lenisRef.current?.stop();
      else lenisRef.current?.start();
    }
    window.addEventListener("skilledscan:menu-toggle", onMenuToggle);
    return () => window.removeEventListener("skilledscan:menu-toggle", onMenuToggle);
  }, []);

  return <>{children}</>;
}
