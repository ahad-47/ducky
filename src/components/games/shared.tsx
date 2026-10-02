"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Best score per game, kept in this browser only.
export function useBest(key: string, lowerIsBetter = false) {
  const storageKey = `skilledscan-arcade:${key}`;
  const [best, setBest] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw === null ? null : Number(raw);
    } catch {
      return null;
    }
  });
  const submit = useCallback(
    (score: number) => {
      setBest((prev) => {
        const better = prev === null || (lowerIsBetter ? score < prev : score > prev);
        if (!better) return prev;
        try {
          window.localStorage.setItem(storageKey, String(score));
        } catch {}
        return score;
      });
    },
    [storageKey, lowerIsBetter],
  );
  return [best, submit] as const;
}

// Swipe direction from a touch or pen drag on an element.
export type Dir = "up" | "down" | "left" | "right";

export function useSwipe(onSwipe: (dir: Dir) => void, minDistance = 24) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const handler = useRef(onSwipe);
  useEffect(() => {
    handler.current = onSwipe;
  });
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < minDistance) return;
      handler.current(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    },
  };
}

export const keyToDir: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

// Square canvas that tracks its container width and device pixel ratio.
export function useSquareCanvas(maxSize = 420) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(320);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize(Math.floor(Math.min(maxSize, el.clientWidth))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxSize]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr;
    c.height = size * dpr;
    c.style.width = `${size}px`;
    c.style.height = `${size}px`;
    c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [size]);
  return { wrapRef, canvasRef, size };
}

export function GameHud({
  items,
  onRestart,
  restartLabel = "Restart",
}: {
  items: { label: string; value: React.ReactNode }[];
  onRestart: () => void;
  restartLabel?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <div key={it.label} className="rounded-[var(--radius-xs)] border border-rule bg-black/20 px-3 py-1.5">
          <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-ink-soft">{it.label}</p>
          <p className="font-[family-name:var(--font-mono)] text-[16px] leading-tight text-ink">{it.value}</p>
        </div>
      ))}
      <button
        type="button"
        onClick={onRestart}
        className="ml-auto h-10 rounded-[var(--radius-xs)] bg-accent px-4 text-[14px] font-semibold text-accent-ink hover:bg-accent-hover"
      >
        {restartLabel}
      </button>
    </div>
  );
}

export function Overlay({ title, body, action, onAction }: { title: string; body?: string; action: string; onAction: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[var(--radius-xs)] bg-paper/80 p-6 text-center backdrop-blur-sm">
      <p className="font-[family-name:var(--font-serif)] text-[24px] text-ink">{title}</p>
      {body ? <p className="max-w-[28ch] text-[14.5px] text-ink-soft">{body}</p> : null}
      <button
        type="button"
        onClick={onAction}
        className="mt-1 h-11 rounded-[var(--radius-xs)] bg-accent px-5 text-[15px] font-semibold text-accent-ink hover:bg-accent-hover"
      >
        {action}
      </button>
    </div>
  );
}

export function DPad({ onDir }: { onDir: (d: Dir) => void }) {
  const btn =
    "grid h-12 w-12 place-items-center rounded-xl border border-rule bg-white/5 text-ink active:bg-accent/30 select-none";
  const arrow = (rot: number) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M12 6l6 8H6z" fill="currentColor" />
    </svg>
  );
  return (
    <div className="mx-auto mt-4 grid w-fit grid-cols-3 gap-1.5 [touch-action:manipulation] pointer-fine:hidden">
      <span />
      <button type="button" aria-label="Up" className={btn} onPointerDown={() => onDir("up")}>
        {arrow(0)}
      </button>
      <span />
      <button type="button" aria-label="Left" className={btn} onPointerDown={() => onDir("left")}>
        {arrow(-90)}
      </button>
      <span />
      <button type="button" aria-label="Right" className={btn} onPointerDown={() => onDir("right")}>
        {arrow(90)}
      </button>
      <span />
      <button type="button" aria-label="Down" className={btn} onPointerDown={() => onDir("down")}>
        {arrow(180)}
      </button>
      <span />
    </div>
  );
}
