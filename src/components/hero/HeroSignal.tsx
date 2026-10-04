"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { StaticFrame } from "@/components/hero/StaticFrame";
import { Canvas2DRenderer } from "@/components/hero/Canvas2DRenderer";
import { getCounterValue, TOTAL_POINTS, FINDING_COUNT } from "@/components/hero/choreography";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { useStaticRender } from "@/components/ui/EmbedContext";
import { gsap, registerGsap, durations } from "@/motion/gsap";

const WebGLRenderer = dynamic(
  () => import("@/components/hero/WebGLRenderer").then((m) => m.WebGLRenderer),
  { ssr: false },
);

type RendererKind = "static" | "canvas2d" | "webgl";

function detectCanvas2DOnly(): boolean {
  if (typeof window === "undefined") return true;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return true;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) return true;
  return false;
}

export function HeroSignal() {
  const reducedMotion = useReducedMotion();
  const staticRender = useStaticRender();
  const [renderer, setRenderer] = useState<RendererKind>("static");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [counter, setCounter] = useState<number>(TOTAL_POINTS);
  const elapsedRef = useRef(0);
  const staticRef = useRef<HTMLDivElement>(null);
  const dynamicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || staticRender) return;

    const idle = (window as typeof window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const schedule = idle ? (cb: () => void) => idle(cb) : (cb: () => void) => window.setTimeout(cb, 200);

    schedule(() => {
      const canvas2DOnly = detectCanvas2DOnly();
      setRenderer(canvas2DOnly ? "canvas2d" : "webgl");
      setReady(true);
    });
  }, [reducedMotion, staticRender]);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      registerGsap();
      gsap.set(dynamicRef.current, { opacity: 0 });
      gsap.to(dynamicRef.current, { opacity: 1, duration: durations.ui, ease: "report" });
      gsap.to(staticRef.current, { opacity: 0, duration: durations.ui, ease: "report" });
    },
    { dependencies: [ready, reducedMotion] },
  );

  function handleProgress(t: number) {
    setCounter(getCounterValue(t));
  }

  function togglePlay() {
    setPlaying((p) => !p);
  }

  function replay() {
    elapsedRef.current = 0;
    setResetSignal((n) => n + 1);
    setPlaying(true);
  }

  const showControls = !reducedMotion && ready;
  const caption = counter <= FINDING_COUNT ? "confirmed findings" : "raw observations";

  return (
    <div className="relative aspect-square w-full">
      <div ref={staticRef} className="absolute inset-0">
        <StaticFrame />
      </div>

      {!reducedMotion && ready ? (
        <div ref={dynamicRef} className="absolute inset-0">
          {renderer === "webgl" ? (
            <WebGLRenderer playing={playing} elapsedRef={elapsedRef} />
          ) : (
            <Canvas2DRenderer playing={playing} resetSignal={resetSignal} onProgress={handleProgress} />
          )}
          <div className="pointer-events-none absolute bottom-0 left-0 flex flex-col rounded-tr-[var(--radius-xs)] bg-paper-raised pr-4 pt-1">
            <span className="font-[family-name:var(--font-serif)] text-display-l tabular-nums text-ink">
              {counter}
            </span>
            <span className="text-[15px] text-ink-soft">{caption}</span>
          </div>
        </div>
      ) : null}

      {showControls ? (
        <div className="absolute bottom-0 right-0 flex gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-full border border-rule bg-paper-raised px-4 py-2 text-[13px] font-medium text-ink"
          >
            {playing ? "Pause animation" : "Play animation"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="rounded-full border border-rule bg-paper-raised px-4 py-2 text-[13px] font-medium text-ink"
          >
            Replay
          </button>
        </div>
      ) : null}
    </div>
  );
}
