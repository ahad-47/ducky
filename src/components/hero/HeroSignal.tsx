import { StaticFrame } from "@/components/hero/StaticFrame";

// Phase 2: static end-state only. Phase 3 adds the WebGL/Canvas2D renderers,
// the pause/replay controls, and the counting animation on top of this.
export function HeroSignal() {
  return <StaticFrame />;
}
