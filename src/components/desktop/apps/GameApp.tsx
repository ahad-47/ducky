"use client";

import dynamic from "next/dynamic";
import type { GameId } from "@/components/desktop/apps/registry";
import { GameFocusContext } from "@/components/games/shared";
import { useOS, useWin } from "@/components/desktop/wm";

const loading = () => <div className="grid h-40 place-items-center text-[13px] text-[var(--os-muted)]">Loading…</div>;

// The same games as the home page's arcade, each in its own window.
const views: Record<GameId, React.ComponentType> = {
  snake: dynamic(() => import("@/components/games/Snake").then((m) => m.Snake), { ssr: false, loading }),
  game2048: dynamic(() => import("@/components/games/Game2048").then((m) => m.Game2048), { ssr: false, loading }),
  minesweeper: dynamic(() => import("@/components/games/Minesweeper").then((m) => m.Minesweeper), { ssr: false, loading }),
  memory: dynamic(() => import("@/components/games/Memory").then((m) => m.Memory), { ssr: false, loading }),
  breakout: dynamic(() => import("@/components/games/Breakout").then((m) => m.Breakout), { ssr: false, loading }),
};

export function GameApp({ game }: { game: GameId }) {
  const os = useOS();
  const win = useWin();
  const View = views[game];
  return (
    <GameFocusContext.Provider value={os.activeId === win.id}>
      {/* data-autofocus: raising this window moves keyboard focus here, out
          of whatever text field (the terminal) had it, so arrows reach the game. */}
      <div tabIndex={-1} data-autofocus className="h-full overflow-y-auto bg-[var(--paper)] p-4 text-[var(--ink)] outline-none sm:p-5">
        <View />
      </div>
    </GameFocusContext.Provider>
  );
}
