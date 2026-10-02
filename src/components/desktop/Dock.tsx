"use client";

import { useState } from "react";
import { ContextMenu, type MenuItem } from "@/components/desktop/ContextMenu";
import { apps, dockApps, type AppId } from "@/components/desktop/apps/registry";
import { AppIcon, Glyph } from "@/components/desktop/icons";
import { useOS } from "@/components/desktop/wm";

export function Dock({ onShowApps, overviewOpen }: { onShowApps: () => void; overviewOpen: boolean }) {
  const os = useOS();
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);

  function activate(app: AppId) {
    const mine = os.wins.filter((w) => w.app === app).sort((a, b) => b.z - a.z);
    if (!mine.length) {
      os.open(app);
      return;
    }
    const active = mine.find((w) => w.id === os.activeId);
    if (!active) {
      os.focus(mine[0].id);
    } else if (mine.length === 1) {
      os.minimize(active.id);
    } else {
      // Cycle through this app's windows, oldest-raised first.
      os.focus(mine[mine.length - 1].id);
    }
  }

  function contextMenu(e: React.MouseEvent, app: AppId) {
    e.preventDefault();
    const mine = os.wins.filter((w) => w.app === app);
    setMenu({
      x: e.clientX + 8,
      y: e.clientY,
      items: [
        ...mine.map((w) => ({ label: w.title, onClick: () => os.focus(w.id) })),
        ...(mine.length ? [{ separator: true } as MenuItem] : []),
        { label: "New Window", onClick: () => os.open(app) },
        ...(mine.length ? [{ label: mine.length > 1 ? `Quit ${mine.length} Windows` : "Quit", danger: true, onClick: () => os.closeApp(app) }] : []),
      ],
    });
  }

  // While the on-screen keyboard is up the dock steps aside.
  if (os.keyboardOpen) return null;

  return (
    <nav
      aria-label="Dock"
      className={`os-dock absolute z-[4500] flex items-center gap-1 p-1.5 ${
        os.mobile ? "inset-x-0 bottom-0 flex-row justify-between overflow-x-auto" : "bottom-0 left-0 w-16 flex-col gap-1.5"
      }`}
      style={
        os.mobile
          ? { height: 60 + os.insets.bottom, paddingBottom: 6 + os.insets.bottom }
          : { top: 32 + os.insets.top }
      }
    >
      {dockApps.map((app) => {
        const running = os.wins.filter((w) => w.app === app);
        const focused = running.some((w) => w.id === os.activeId);
        return (
          <button
            key={app}
            type="button"
            title={apps[app].name}
            aria-label={apps[app].name}
            onClick={() => activate(app)}
            onContextMenu={(e) => contextMenu(e, app)}
            className={`os-dock-item group relative grid shrink-0 place-items-center rounded-xl ${os.mobile ? "h-10 w-10 min-[400px]:h-11 min-[400px]:w-11" : "h-12 w-12"} ${focused ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <AppIcon app={app} size={os.mobile ? 30 : 38} />
            {running.length ? (
              <span
                className={`absolute flex gap-0.5 ${os.mobile ? "bottom-0 left-1/2 -translate-x-1/2" : "left-0 top-1/2 -translate-y-1/2 flex-col"}`}
              >
                {running.slice(0, 3).map((w) => (
                  <span key={w.id} className={`h-1 w-1 rounded-full ${focused ? "bg-[var(--os-accent-bright)]" : "bg-white/70"}`} />
                ))}
              </span>
            ) : null}
            {os.mobile ? null : <span className="os-tooltip">{apps[app].name}</span>}
          </button>
        );
      })}
      {os.mobile ? null : <div className="mt-auto" />}
      <button
        type="button"
        aria-label="Show Applications"
        title="Show Applications"
        onClick={onShowApps}
        className={`os-dock-item group relative grid shrink-0 place-items-center rounded-xl text-white ${os.mobile ? "h-10 w-10 min-[400px]:h-11 min-[400px]:w-11" : "h-12 w-12"} ${overviewOpen ? "bg-white/15" : "hover:bg-white/10"}`}
      >
        <Glyph.Grid className="h-6 w-6" />
        {os.mobile ? null : <span className="os-tooltip">Show Applications</span>}
      </button>
      {menu ? <ContextMenu {...menu} onClose={() => setMenu(null)} /> : null}
    </nav>
  );
}
