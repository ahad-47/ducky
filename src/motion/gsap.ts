"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase);

  CustomEase.create("report", "0.22, 1, 0.36, 1");
  CustomEase.create("gate", "0.65, 0, 0.35, 1");

  gsap.ticker.lagSmoothing(0);
}

export const durations = {
  micro: 0.16,
  ui: 0.28,
  reveal: 0.7,
} as const;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase };
