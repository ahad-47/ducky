"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useStaticRender } from "@/components/ui/EmbedContext";

const loading = () => (
  <div className="mx-auto grid aspect-square w-full max-w-[420px] place-items-center rounded-[var(--radius-xs)] bg-[#e4eaf4] text-[14px] text-ink-soft">
    Loading…
  </div>
);

// Each game loads only when its tab is opened.
const games = [
  { id: "snake", name: "Snake", blurb: "Catch the bugs", Component: dynamic(() => import("./Snake").then((m) => m.Snake), { ssr: false, loading }) },
  { id: "2048", name: "2048", blurb: "Merge the tiles", Component: dynamic(() => import("./Game2048").then((m) => m.Game2048), { ssr: false, loading }) },
  { id: "mines", name: "Minesweeper", blurb: "Flag the mines", Component: dynamic(() => import("./Minesweeper").then((m) => m.Minesweeper), { ssr: false, loading }) },
  { id: "memory", name: "Memory", blurb: "Match the pairs", Component: dynamic(() => import("./Memory").then((m) => m.Memory), { ssr: false, loading }) },
  { id: "breakout", name: "Breakout", blurb: "Clear the wall", Component: dynamic(() => import("./Breakout").then((m) => m.Breakout), { ssr: false, loading }) },
];

export function Arcade() {
  const [active, setActive] = useState(games[0].id);
  const game = games.find((g) => g.id === active)!;
  // The hidden static copy of a page must not start a game or take keys.
  const staticRender = useStaticRender();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <div role="tablist" aria-label="Games" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible">
        {games.map((g, i) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={g.id === active}
            aria-controls="arcade-panel"
            onClick={() => setActive(g.id)}
            className={`flex shrink-0 items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-left transition-colors duration-[160ms] ${
              g.id === active ? "border-accent/40 bg-accent-tint" : "border-rule bg-paper-raised hover:border-accent/25"
            }`}
          >
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-accent-text">0{i + 1}</span>
            <span>
              <span className="block text-[15.5px] font-semibold text-ink">{g.name}</span>
              <span className="block text-[13px] text-ink-soft">{g.blurb}</span>
            </span>
          </button>
        ))}
      </div>
      <div id="arcade-panel" data-motion-skip role="tabpanel" aria-labelledby={`tab-${game.id}`} className="glass rounded-[var(--radius-sm)] p-4 sm:p-6">
        {staticRender ? loading() : <game.Component key={game.id} />}
      </div>
    </div>
  );
}
