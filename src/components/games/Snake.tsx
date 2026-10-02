"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DPad, GameHud, Overlay, keyToDir, useBest, useSquareCanvas, useSwipe, type Dir } from "@/components/games/shared";

const N = 18;
const START_MS = 140;

type P = { x: number; y: number };
const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
const step: Record<Dir, P> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

function freeCell(snake: P[]): P {
  for (;;) {
    const p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export function Snake() {
  const { wrapRef, canvasRef, size } = useSquareCanvas();
  const [state, setState] = useState<"ready" | "playing" | "paused" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, submitBest] = useBest("snake");
  const game = useRef({ snake: [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }] as P[], dir: "right" as Dir, queue: [] as Dir[], food: { x: 13, y: 9 } as P, score: 0 });

  const reset = useCallback(() => {
    const snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    game.current = { snake, dir: "right", queue: [], food: freeCell(snake), score: 0 };
    setScore(0);
    setState("playing");
  }, []);

  const turn = useCallback(
    (d: Dir) => {
      if (state === "ready" || state === "over") reset();
      const g = game.current;
      const last = g.queue[g.queue.length - 1] ?? g.dir;
      if (d !== last && d !== opposite[last] && g.queue.length < 3) g.queue.push(d);
    },
    [state, reset],
  );

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const c = size / N;
    ctx.fillStyle = "#0e1526";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    for (let i = 1; i < N; i++) {
      ctx.beginPath();
      ctx.moveTo(i * c, 0);
      ctx.lineTo(i * c, size);
      ctx.moveTo(0, i * c);
      ctx.lineTo(size, i * c);
      ctx.stroke();
    }
    const g = game.current;
    // Food: a "bug" to catch.
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc((g.food.x + 0.5) * c, (g.food.y + 0.5) * c, c * 0.32, 0, Math.PI * 2);
    ctx.fill();
    g.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#5eead4" : `rgba(94,234,212,${Math.max(0.35, 0.9 - i * 0.03)})`;
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x * c + pad, s.y * c + pad, c - pad * 2, c - pad * 2, c * 0.25);
      ctx.fill();
    });
  }, [canvasRef, size]);

  useEffect(draw, [draw, score, state]);

  useEffect(() => {
    if (state !== "playing") return;
    const speed = Math.max(70, START_MS - game.current.score * 3);
    const id = window.setInterval(() => {
      const g = game.current;
      if (g.queue.length) g.dir = g.queue.shift()!;
      const head = { x: g.snake[0].x + step[g.dir].x, y: g.snake[0].y + step[g.dir].y };
      const hit =
        head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || g.snake.some((s) => s.x === head.x && s.y === head.y);
      if (hit) {
        setState("over");
        submitBest(g.score);
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1;
        g.food = freeCell(g.snake);
        setScore(g.score);
      } else g.snake.pop();
      draw();
    }, speed);
    return () => window.clearInterval(id);
  }, [state, score, draw, submitBest]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = keyToDir[e.key];
      if (d && state === "playing") {
        e.preventDefault();
        turn(d);
      } else if (e.key === " " && (state === "playing" || state === "paused")) {
        e.preventDefault();
        setState(state === "playing" ? "paused" : "playing");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, turn]);

  const swipe = useSwipe(turn);

  return (
    <div>
      <GameHud
        items={[
          { label: "Bugs caught", value: score },
          { label: "Best", value: best ?? "–" },
        ]}
        onRestart={reset}
        restartLabel={state === "ready" ? "Start" : "Restart"}
      />
      <div ref={wrapRef} className="relative mx-auto w-full max-w-[420px] touch-none" {...swipe}>
        <canvas ref={canvasRef} className="block rounded-[var(--radius-xs)]" aria-label="Snake board" role="img" />
        {state === "ready" ? (
          <Overlay title="Snake" body="Catch the red bugs. Arrow keys or WASD, swipe on touch. Space pauses." action="Start" onAction={reset} />
        ) : state === "paused" ? (
          <Overlay title="Paused" action="Resume" onAction={() => setState("playing")} />
        ) : state === "over" ? (
          <Overlay title="Game over" body={`You caught ${score} bug${score === 1 ? "" : "s"}.`} action="Play again" onAction={reset} />
        ) : null}
      </div>
      <DPad onDir={turn} />
    </div>
  );
}
