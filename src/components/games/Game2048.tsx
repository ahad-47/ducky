"use client";

import { useCallback, useEffect, useState } from "react";
import { GameHud, Overlay, keyToDir, useBest, useKeyGuard, useSwipe, type Dir } from "@/components/games/shared";

type Board = number[]; // 16 cells, row-major, 0 = empty

function addTile(b: Board): Board {
  const empty = b.flatMap((v, i) => (v === 0 ? [i] : []));
  if (!empty.length) return b;
  const next = [...b];
  next[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function fresh(): Board {
  return addTile(addTile(Array(16).fill(0)));
}

// Slide one row toward index 0, merging equal neighbours once.
function slideRow(row: number[]): { row: number[]; gained: number } {
  const vals = row.filter(Boolean);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2);
      gained += vals[i] * 2;
      i++;
    } else out.push(vals[i]);
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

function move(b: Board, dir: Dir): { board: Board; gained: number; moved: boolean } {
  const next = Array(16).fill(0);
  let gained = 0;
  for (let k = 0; k < 4; k++) {
    const idx = [0, 1, 2, 3].map((j) => {
      if (dir === "left") return k * 4 + j;
      if (dir === "right") return k * 4 + (3 - j);
      if (dir === "up") return j * 4 + k;
      return (3 - j) * 4 + k;
    });
    const res = slideRow(idx.map((i) => b[i]));
    gained += res.gained;
    idx.forEach((i, j) => (next[i] = res.row[j]));
  }
  return { board: next, gained, moved: next.some((v, i) => v !== b[i]) };
}

function canMove(b: Board) {
  return (["up", "down", "left", "right"] as Dir[]).some((d) => move(b, d).moved);
}

const tileStyle: Record<number, string> = {
  2: "bg-white text-ink shadow-[0_1px_2px_rgba(10,19,36,0.08)]",
  4: "bg-[#eef3ff] text-ink",
  8: "bg-[#dbe6ff] text-[#1d45c8]",
  16: "bg-[#c2d4ff] text-[#1a3fb8]",
  32: "bg-[#9db8ff] text-[#10287a]",
  64: "bg-[#7096ff] text-white",
  128: "bg-[#4f7cff] text-white",
  256: "bg-[#2f62f0] text-white",
  512: "bg-[#2453e6] text-white",
  1024: "bg-[#1a3fb8] text-white",
  2048: "bg-[#0a1324] text-white",
};

export function Game2048() {
  const [board, setBoard] = useState<Board>(fresh);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepGoing, setKeepGoing] = useState(false);
  const [best, submitBest] = useBest("2048");
  const keyOk = useKeyGuard();

  const restart = useCallback(() => {
    setBoard(fresh());
    setScore(0);
    setOver(false);
    setWon(false);
    setKeepGoing(false);
  }, []);

  const play = useCallback(
    (dir: Dir) => {
      if (over || (won && !keepGoing)) return;
      const res = move(board, dir);
      if (!res.moved) return;
      const next = addTile(res.board);
      const total = score + res.gained;
      setBoard(next);
      setScore(total);
      if (next.includes(2048) && !won) setWon(true);
      if (!canMove(next)) {
        setOver(true);
        submitBest(total);
      }
    },
    [board, score, over, won, keepGoing, submitBest],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!keyOk(e)) return;
      const d = keyToDir[e.key];
      if (!d) return;
      // Only claim the arrow keys while the board is on screen.
      const el = document.getElementById("game-2048");
      const r = el?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      e.preventDefault();
      play(d);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play, keyOk]);

  const swipe = useSwipe(play);

  return (
    <div>
      <GameHud
        items={[
          { label: "Score", value: score },
          { label: "Best", value: best ?? "–" },
        ]}
        onRestart={() => {
          if (score) submitBest(score);
          restart();
        }}
        restartLabel="New game"
      />
      <div
        id="game-2048"
        className="relative mx-auto grid aspect-square w-full max-w-[420px] touch-none grid-cols-4 gap-2 rounded-[var(--radius-xs)] bg-[#e4eaf4] p-2"
        {...swipe}
      >
        {board.map((v, i) => (
          <div
            key={i}
            className={`grid place-items-center rounded-lg font-[family-name:var(--font-logo)] font-extrabold transition-colors duration-100 ${
              v ? tileStyle[v] ?? "bg-[#0a1324] text-white" : "bg-white/50"
            } ${v >= 1024 ? "text-[clamp(16px,5vw,26px)]" : v >= 128 ? "text-[clamp(18px,6vw,30px)]" : "text-[clamp(20px,7vw,34px)]"}`}
          >
            {v || ""}
          </div>
        ))}
        {over ? (
          <Overlay title="No moves left" body={`Final score ${score}.`} action="New game" onAction={restart} />
        ) : won && !keepGoing ? (
          <Overlay title="2048!" body="You reached the 2048 tile." action="Keep going" onAction={() => setKeepGoing(true)} />
        ) : null}
      </div>
      <p className="mt-3 text-center text-[13.5px] text-ink-soft">Arrow keys or WASD. Swipe on touch screens.</p>
    </div>
  );
}
