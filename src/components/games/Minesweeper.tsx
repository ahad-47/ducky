"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameHud, Overlay, useBest } from "@/components/games/shared";

const W = 9;
const H = 9;
const MINES = 10;

type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };

function neighbours(i: number) {
  const x = i % W;
  const y = Math.floor(i / W);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < W && ny < H) out.push(ny * W + nx);
    }
  return out;
}

function emptyGrid(): Cell[] {
  return Array.from({ length: W * H }, () => ({ mine: false, open: false, flag: false, n: 0 }));
}

// Mines are placed on the first reveal, never on or next to that cell.
function seed(grid: Cell[], safe: number): Cell[] {
  const banned = new Set([safe, ...neighbours(safe)]);
  const next = grid.map((c) => ({ ...c }));
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * next.length);
    if (banned.has(i) || next[i].mine) continue;
    next[i].mine = true;
    placed++;
  }
  next.forEach((c, i) => (c.n = neighbours(i).filter((j) => next[j].mine).length));
  return next;
}

function flood(grid: Cell[], start: number): Cell[] {
  const next = grid.map((c) => ({ ...c }));
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    const c = next[i];
    if (c.open || c.flag) continue;
    c.open = true;
    if (c.n === 0 && !c.mine) stack.push(...neighbours(i));
  }
  return next;
}

const numberColor = ["", "#8fa8ff", "#5eead4", "#ff9f55", "#c4b5fd", "#ff6b6b", "#38c2b1", "#f4f6fb", "#9ba8c2"];

export function Minesweeper() {
  const [grid, setGrid] = useState<Cell[]>(emptyGrid);
  const [state, setState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [flagMode, setFlagMode] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [best, submitBest] = useBest("minesweeper", true);
  const pressTimer = useRef<number | undefined>(undefined);
  const longPressed = useRef(false);

  useEffect(() => {
    if (state !== "playing") return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [state]);

  const seconds = state === "ready" ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  const restart = useCallback(() => {
    setGrid(emptyGrid());
    setState("ready");
    setStartedAt(0);
    setNow(0);
  }, []);

  // `t` is the click time, read in the event handler.
  function reveal(i: number, t: number) {
    if (state === "won" || state === "lost") return;
    let g = grid;
    let start = startedAt;
    if (state === "ready") {
      g = seed(grid, i);
      start = t;
      setStartedAt(t);
      setNow(t);
      setState("playing");
    }
    const c = g[i];
    if (c.flag) return;
    if (c.open) {
      // Chord: an open number with the right count of flags opens the rest.
      const ns = neighbours(i);
      if (c.n && ns.filter((j) => g[j].flag).length === c.n) {
        let next = g;
        for (const j of ns) if (!next[j].open && !next[j].flag) next = next[j].mine ? lose(next, j) : flood(next, j);
        finish(next, t, start);
      }
      return;
    }
    if (c.mine) {
      finish(lose(g, i), t, start);
      return;
    }
    finish(flood(g, i), t, start);
  }

  function lose(g: Cell[], i: number) {
    const next = g.map((c) => ({ ...c, open: c.open || c.mine }));
    next[i] = { ...next[i], n: -1 }; // -1 marks the mine that went off
    return next;
  }

  function finish(next: Cell[], t: number, start: number) {
    setGrid(next);
    if (next.some((c) => c.mine && c.open)) {
      setState("lost");
      setNow(t);
    } else if (next.every((c) => c.mine || c.open)) {
      setState("won");
      setNow(t);
      submitBest(Math.max(1, Math.floor((t - start) / 1000)));
    }
  }

  function toggleFlag(i: number) {
    if (state === "won" || state === "lost" || grid[i].open) return;
    setGrid((g) => g.map((c, j) => (j === i ? { ...c, flag: !c.flag } : c)));
  }

  const flags = grid.filter((c) => c.flag).length;

  return (
    <div>
      <GameHud
        items={[
          { label: "Mines left", value: MINES - flags },
          { label: "Time", value: `${seconds}s` },
          { label: "Best", value: best === null ? "–" : `${best}s` },
        ]}
        onRestart={restart}
        restartLabel="New board"
      />
      <div className="mb-3 flex items-center justify-center gap-2 text-[13.5px]">
        <span className="text-ink-soft">Tap to</span>
        <div className="inline-flex rounded-full border border-rule p-0.5">
          {[
            { on: false, label: "Reveal" },
            { on: true, label: "Flag" },
          ].map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setFlagMode(m.on)}
              className={`rounded-full px-3 py-1 font-medium ${flagMode === m.on ? "bg-accent text-accent-ink" : "text-ink-soft"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="relative mx-auto grid aspect-square w-full max-w-[420px] select-none gap-1 rounded-[var(--radius-xs)] bg-[#0e1526] p-1.5 [touch-action:manipulation]"
        style={{ gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${H}, minmax(0, 1fr))` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={c.open ? (c.mine ? "Mine" : `${c.n} nearby`) : c.flag ? "Flagged" : "Hidden"}
            onClick={() => {
              if (longPressed.current) {
                longPressed.current = false;
                return;
              }
              if (flagMode) toggleFlag(i);
              else reveal(i, Date.now());
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleFlag(i);
            }}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse") return;
              longPressed.current = false;
              pressTimer.current = window.setTimeout(() => {
                longPressed.current = true;
                toggleFlag(i);
                navigator.vibrate?.(15);
              }, 380);
            }}
            onPointerUp={() => window.clearTimeout(pressTimer.current)}
            onPointerLeave={() => window.clearTimeout(pressTimer.current)}
            className={`grid place-items-center rounded-[5px] font-[family-name:var(--font-logo)] text-[clamp(13px,4vw,19px)] font-extrabold ${
              c.open
                ? c.mine
                  ? c.n === -1
                    ? "bg-severity-critical/80"
                    : "bg-severity-critical/25"
                  : "bg-white/[0.03]"
                : "bg-[#24304d] hover:bg-[#2c3a5d] active:bg-[#33446c]"
            }`}
            style={c.open && !c.mine ? { color: numberColor[c.n] } : undefined}
          >
            {c.open ? (c.mine ? "✱" : c.n || "") : c.flag ? <span className="text-severity-high">⚑</span> : ""}
          </button>
        ))}
        {state === "won" ? (
          <Overlay title="Cleared" body={`All ${MINES} mines found in ${seconds}s.`} action="New board" onAction={restart} />
        ) : state === "lost" ? (
          <Overlay title="Boom" body="That one was a mine." action="Try again" onAction={restart} />
        ) : null}
      </div>
      <p className="mt-3 text-center text-[13.5px] text-ink-soft">
        Right-click or long-press to flag. Tap an open number to clear around it.
      </p>
    </div>
  );
}
