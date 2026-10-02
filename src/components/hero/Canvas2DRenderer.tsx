"use client";

import { useEffect, useRef } from "react";
import {
  getFrame,
  getLoopState,
  TIMELINE_SECONDS,
  TOTAL_POINTS,
  FINDING_COUNT,
} from "@/components/hero/choreography";

export function Canvas2DRenderer({
  playing,
  resetSignal,
  onProgress,
}: {
  playing: boolean;
  resetSignal: number;
  onProgress?: (t: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) startRef.current = null;
  }, [playing]);

  useEffect(() => {
    elapsedRef.current = 0;
    startRef.current = null;
  }, [resetSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(timeMs: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      if (!canvas || !ctx) return;

      if (playingRef.current) {
        if (startRef.current === null) startRef.current = timeMs - elapsedRef.current * 1000;
        elapsedRef.current = (timeMs - startRef.current) / 1000;
      }

      const { t, loopAlpha } = getLoopState(elapsedRef.current);
      onProgress?.(t);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const points = getFrame(t);

      ctx.strokeStyle = `rgba(51, 65, 95, ${0.5 * loopAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.05);
      ctx.lineTo(w * 0.5, h * 0.95);
      ctx.stroke();

      ctx.strokeStyle = `rgba(36, 48, 73, ${loopAlpha})`;
      ctx.beginPath();
      ctx.moveTo(w * 0.02, h * 0.92);
      ctx.lineTo(w * 0.8, h * 0.92);
      ctx.stroke();

      for (const point of points) {
        ctx.beginPath();
        ctx.fillStyle =
          point.kind === "finding"
            ? `rgba(79, 124, 255, ${point.alpha * loopAlpha})`
            : `rgba(155, 168, 194, ${point.alpha * loopAlpha})`;
        ctx.arc(point.x * w, point.y * h, point.radius * (w / 600), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [onProgress]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${TOTAL_POINTS} raw observations resolved to ${FINDING_COUNT} confirmed findings.`}
      className="absolute inset-0 h-full w-full"
    />
  );
}

export { TIMELINE_SECONDS };
