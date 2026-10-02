"use client";

import { useCallback, useEffect, useState } from "react";
import { GameHud, Overlay, useBest } from "@/components/games/shared";
import { Icon, type IconName } from "@/components/ui/Icon";

const symbols: { name: IconName; color: string }[] = [
  { name: "shield", color: "#5eead4" },
  { name: "lock", color: "#8fa8ff" },
  { name: "bug", color: "#ff6b6b" },
  { name: "globe", color: "#ffd166" },
  { name: "doc", color: "#c4b5fd" },
  { name: "layers", color: "#ff9f55" },
  { name: "search", color: "#38c2b1" },
  { name: "mail", color: "#f4f6fb" },
];

type Card = { id: number; sym: number; matched: boolean };

function deal(): Card[] {
  const cards = symbols.flatMap((_, sym) => [sym, sym]).map((sym, id) => ({ id, sym, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function Memory() {
  const [cards, setCards] = useState<Card[]>(deal);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, submitBest] = useBest("memory", true);
  const done = cards.every((c) => c.matched);

  const restart = useCallback(() => {
    setCards(deal());
    setOpen([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (cards[a].sym === cards[b].sym) {
      const next = cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
      const id = window.setTimeout(() => {
        setCards(next);
        setOpen([]);
        if (next.every((c) => c.matched)) submitBest(moves);
      }, 250);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setOpen([]), 750);
    return () => window.clearTimeout(id);
  }, [open, cards, moves, submitBest]);

  function flip(i: number) {
    if (open.length === 2 || open.includes(i) || cards[i].matched) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) setMoves((m) => m + 1);
  }

  return (
    <div>
      <GameHud
        items={[
          { label: "Moves", value: moves },
          { label: "Pairs", value: `${cards.filter((c) => c.matched).length / 2}/${symbols.length}` },
          { label: "Best", value: best ?? "–" },
        ]}
        onRestart={restart}
        restartLabel="Shuffle"
      />
      <div className="relative mx-auto grid aspect-square w-full max-w-[420px] grid-cols-4 gap-2 [touch-action:manipulation]">
        {cards.map((c, i) => {
          const shown = c.matched || open.includes(i);
          const s = symbols[c.sym];
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => flip(i)}
              aria-label={shown ? `${s.name} card` : "Hidden card"}
              className="[perspective:600px]"
            >
              <span
                className="relative block h-full w-full transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: shown ? "rotateY(180deg)" : "none" }}
              >
                <span className="absolute inset-0 grid place-items-center rounded-xl border border-rule bg-[#1c1d21] [backface-visibility:hidden]">
                  <span className="h-3 w-3 rounded-full border-2 border-accent/60" />
                </span>
                <span
                  className={`absolute inset-0 grid place-items-center rounded-xl border [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    c.matched ? "border-severity-low/50 bg-severity-low/10" : "border-accent/50 bg-[#2a1c16]"
                  }`}
                  style={{ color: s.color }}
                >
                  <Icon name={s.name} className="h-[45%] w-[45%]" />
                </span>
              </span>
            </button>
          );
        })}
        {done ? (
          <Overlay title="All pairs found" body={`${moves} moves.`} action="Play again" onAction={restart} />
        ) : null}
      </div>
      <p className="mt-3 text-center text-[13.5px] text-ink-soft">Flip two cards at a time and match all eight pairs.</p>
    </div>
  );
}
