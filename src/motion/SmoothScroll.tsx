"use client";

import { useEffect } from "react";
import { ScrollTrigger, registerGsap } from "@/motion/gsap";

// Pages scroll natively. A JavaScript smooth-scroll layer (Lenis) used to sit
// here; inside the desktop's browser windows it intercepted the mouse wheel
// and could stop a page from scrolling, so it was removed. GSAP's scroll
// animations still run off the native scroll position.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return <>{children}</>;
}
