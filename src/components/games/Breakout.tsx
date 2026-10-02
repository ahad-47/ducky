"use client";

import { roundRectPath } from "@/components/games/draw";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameHud, Overlay, useBest, useKeyGuard, useSquareCanvas } from "@/components/games/shared";

// All game maths runs in a fixed 400x400 world, scaled to the canvas.
const WORLD = 400;
const COLS = 8;
const ROWS = 5;
const PADDLE_W = 70;
const PADDLE_H = 10;
const BALL_R = 6;
const rowColors = ["#ff5a1f", "#ff7a45", "#ff9d47", "#f2c94c", "#eeebe5"];

type Brick = { x: number; y: number; w: number; h: number; alive: boolean; row: number };

function makeBricks(): Brick[] {
  const gap = 6;
  const w = (WORLD - gap * (COLS + 1)) / COLS;
  const h = 16;
  const out: Brick[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) out.push({ x: gap + c * (w + gap), y: 48 + r * (h + gap), w, h, alive: true, row: r });
  return out;
}

export function Breakout() {
  const { wrapRef, canvasRef, size } = useSquareCanvas();
  const [state, setState] = useState<"ready" | "serve" | "playing" | "over" | "won">("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, submitBest] = useBest("breakout");
  const keyOk = useKeyGuard();
  const g = useRef({
    paddle: WORLD / 2 - PADDLE_W / 2,
    ball: { x: WORLD / 2, y: WORLD - 40, vx: 0, vy: 0 },
    bricks: makeBricks(),
    keys: { left: false, right: false },
    score: 0,
    lives: 3,
  });

  const serve = useCallback(() => {
    const s = g.current;
    s.ball = { x: s.paddle + PADDLE_W / 2, y: WORLD - 40, vx: (Math.random() < 0.5 ? -1 : 1) * 2.6, vy: -4.2 };
    setState("playing");
  }, []);

  const restart = useCallback(() => {
    g.current = {
      paddle: WORLD / 2 - PADDLE_W / 2,
      ball: { x: WORLD / 2, y: WORLD - 40, vx: 0, vy: 0 },
      bricks: makeBricks(),
      keys: { left: false, right: false },
      score: 0,
      lives: 3,
    };
    setScore(0);
    setLives(3);
    setState("serve");
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const k = size / WORLD;
    const s = g.current;
    ctx.save();
    ctx.scale(k, k);
    ctx.fillStyle = "#111214";
    ctx.fillRect(0, 0, WORLD, WORLD);
    for (const b of s.bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = rowColors[b.row];
      roundRectPath(ctx, b.x, b.y, b.w, b.h, 4);
      ctx.fill();
    }
    ctx.fillStyle = "#eeebe5";
    roundRectPath(ctx, s.paddle, WORLD - 24, PADDLE_W, PADDLE_H, 5);
    ctx.fill();
    const bx = state === "playing" ? s.ball.x : s.paddle + PADDLE_W / 2;
    const by = state === "playing" ? s.ball.y : WORLD - 24 - BALL_R - 2;
    ctx.fillStyle = "#ff5a1f";
    ctx.beginPath();
    ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [canvasRef, size, state]);

  useEffect(draw, [draw]);

  useEffect(() => {
    if (state !== "playing") return;
    let raf = 0;
    const tick = () => {
      const s = g.current;
      if (s.keys.left) s.paddle = Math.max(0, s.paddle - 7);
      if (s.keys.right) s.paddle = Math.min(WORLD - PADDLE_W, s.paddle + 7);
      const b = s.ball;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < BALL_R || b.x > WORLD - BALL_R) {
        b.vx *= -1;
        b.x = Math.min(WORLD - BALL_R, Math.max(BALL_R, b.x));
      }
      if (b.y < BALL_R) {
        b.vy = Math.abs(b.vy);
        b.y = BALL_R;
      }
      // Paddle: bounce angle depends on where the ball lands.
      const py = WORLD - 24;
      if (b.vy > 0 && b.y + BALL_R >= py && b.y + BALL_R <= py + PADDLE_H + 6 && b.x >= s.paddle - BALL_R && b.x <= s.paddle + PADDLE_W + BALL_R) {
        const hit = (b.x - (s.paddle + PADDLE_W / 2)) / (PADDLE_W / 2);
        const speed = Math.min(7.5, Math.hypot(b.vx, b.vy) * 1.02);
        const angle = hit * 1.05;
        b.vx = speed * Math.sin(angle);
        b.vy = -Math.abs(speed * Math.cos(angle));
        b.y = py - BALL_R;
      }
      for (const br of s.bricks) {
        if (!br.alive) continue;
        if (b.x + BALL_R > br.x && b.x - BALL_R < br.x + br.w && b.y + BALL_R > br.y && b.y - BALL_R < br.y + br.h) {
          br.alive = false;
          const fromSide = b.x < br.x || b.x > br.x + br.w;
          if (fromSide) b.vx *= -1;
          else b.vy *= -1;
          s.score += (ROWS - br.row) * 10;
          setScore(s.score);
          break;
        }
      }
      if (s.bricks.every((br) => !br.alive)) {
        setState("won");
        submitBest(s.score);
        draw();
        return;
      }
      if (b.y > WORLD + BALL_R) {
        s.lives -= 1;
        setLives(s.lives);
        if (s.lives <= 0) {
          setState("over");
          submitBest(s.score);
        } else setState("serve");
        return;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, draw, submitBest]);

  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      if (state !== "playing" && state !== "serve") return;
      if (down && !keyOk(e)) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") g.current.keys.left = down;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") g.current.keys.right = down;
      else if (down && e.key === " " && state === "serve") serve();
      else return;
      e.preventDefault();
      if (state === "serve") draw();
    };
    const kd = (e: KeyboardEvent) => set(e, true);
    const ku = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [state, serve, draw, keyOk]);

  // Mouse or finger moves the paddle directly.
  function pointerMove(e: React.PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WORLD;
    g.current.paddle = Math.max(0, Math.min(WORLD - PADDLE_W, x - PADDLE_W / 2));
    if (state !== "playing") draw();
  }

  return (
    <div>
      <GameHud
        items={[
          { label: "Score", value: score },
          { label: "Lives", value: "●".repeat(Math.max(0, lives)) || "0" },
          { label: "Best", value: best ?? "–" },
        ]}
        onRestart={restart}
        restartLabel={state === "ready" ? "Start" : "Restart"}
      />
      <div
        ref={wrapRef}
        className="relative mx-auto w-full max-w-[420px] touch-none"
        onPointerMove={pointerMove}
        onPointerDown={(e) => {
          pointerMove(e);
          if (state === "serve") serve();
        }}
      >
        <canvas ref={canvasRef} className="block rounded-[var(--radius-xs)]" aria-label="Breakout board" role="img" />
        {state === "ready" ? (
          <Overlay
            title="Breakout"
            body="Clear every brick. Move with the mouse, a finger, or the arrow keys. Tap or press Space to launch."
            action="Start"
            onAction={restart}
          />
        ) : state === "over" ? (
          <Overlay title="Out of lives" body={`Score ${score}.`} action="Play again" onAction={restart} />
        ) : state === "won" ? (
          <Overlay title="Board cleared" body={`Score ${score}.`} action="Play again" onAction={restart} />
        ) : null}
        {state === "serve" ? (
          <p className="pointer-events-none absolute inset-x-0 top-[60%] text-center text-[14px] text-ink-soft">
            Tap or press Space to launch
          </p>
        ) : null}
      </div>
    </div>
  );
}
