"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { BrowserApp } from "@/components/desktop/apps/BrowserApp";
import { CalculatorApp } from "@/components/desktop/apps/CalculatorApp";
import { EditorApp } from "@/components/desktop/apps/EditorApp";
import { FilesApp } from "@/components/desktop/apps/FilesApp";
import { GameApp } from "@/components/desktop/apps/GameApp";
import { MonitorApp } from "@/components/desktop/apps/MonitorApp";
import type { AppId } from "@/components/desktop/apps/registry";
import { SettingsApp } from "@/components/desktop/apps/SettingsApp";
import { TerminalApp } from "@/components/desktop/apps/TerminalApp";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { Dock } from "@/components/desktop/Dock";
import { stat } from "@/components/desktop/fs";
import { Overview } from "@/components/desktop/Overview";
import { Panel } from "@/components/desktop/Panel";
import { BootScreen, LockScreen, OffScreen } from "@/components/desktop/Screens";
import { Window } from "@/components/desktop/Window";
import { Logo } from "@/components/ui/Logo";
import { installLongPress } from "@/components/desktop/longPress";
import { installTouchKeyboardGuard, isTouchDevice } from "@/components/desktop/touchKeyboard";
import {
  OSContext,
  activeWindow,
  defaultSettings,
  initialWm,
  wallpapers,
  wmReducer,
  type OS,
  type PowerState,
  type Rect,
  type Settings,
} from "@/components/desktop/wm";

const PANEL_H = 32;
const DOCK_W = 64;
const DOCK_H = 60;
const SETTINGS_KEY = "skilledscan-os:settings:v1";
const BOOTED_KEY = "skilledscan-os:booted";

const appViews: Record<AppId, () => React.ReactNode> = {
  browser: () => <BrowserApp />,
  terminal: () => <TerminalApp />,
  calculator: () => <CalculatorApp />,
  files: () => <FilesApp />,
  editor: () => <EditorApp />,
  settings: () => <SettingsApp />,
  monitor: () => <MonitorApp />,
  snake: () => <GameApp game="snake" />,
  game2048: () => <GameApp game="game2048" />,
  minesweeper: () => <GameApp game="minesweeper" />,
  memory: () => <GameApp game="memory" />,
  breakout: () => <GameApp game="breakout" />,
};

// Some mobile browsers (notably in-app webviews) report 0 for the window or
// visual viewport size during the first moments of loading. Fall back to
// the document and screen sizes so the shell never renders at zero height.
function readViewport() {
  const vv = window.visualViewport;
  const doc = document.documentElement;
  const w = window.innerWidth || doc.clientWidth || window.screen.width;
  const layoutH = window.innerHeight || doc.clientHeight || window.screen.height;
  const h = vv && vv.height > 0 ? vv.height : layoutH;
  return {
    w,
    h: Math.round(h),
    top: Math.round(vv && vv.height > 0 ? vv.offsetTop : 0),
    layoutH,
  };
}

// env(safe-area-inset-*) is only readable through CSS, so measure a probe.
function readSafeInsets() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)";
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = { top: parseFloat(cs.paddingTop) || 0, bottom: parseFloat(cs.paddingBottom) || 0 };
  probe.remove();
  return insets;
}

type Toast = { id: number; title: string; body?: string };

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function Desktop() {
  const [wm, dispatch] = useReducer(wmReducer, initialWm);
  const [viewport, setViewport] = useState(readViewport);
  const [insets] = useState(readSafeInsets);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...defaultSettings, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch {}
    return defaultSettings;
  });
  const [powerState, setPowerState] = useState<PowerState>("boot");
  // First visit in a session plays the boot log; later loads skip it.
  const [quickBoot, setQuickBoot] = useState(() => {
    try {
      if (window.sessionStorage.getItem(BOOTED_KEY) === "1") return true;
    } catch {}
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [overview, setOverview] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bootedAt] = useState(() => Date.now());
  const ready = useRef(false);

  const mobile = viewport.w < 768;
  // On phones the on-screen keyboard shrinks the visual viewport; the dock
  // steps aside so the focused window keeps the space.
  const keyboardOpen = mobile && viewport.layoutH - viewport.h > 120;
  const panelH = PANEL_H + insets.top;
  const dockH = keyboardOpen ? 0 : DOCK_H + insets.bottom;
  const area: Rect = useMemo(
    () =>
      mobile
        ? { x: 0, y: panelH, w: viewport.w, h: viewport.h - panelH - dockH }
        : { x: DOCK_W, y: panelH, w: viewport.w - DOCK_W, h: viewport.h - panelH },
    [mobile, viewport, panelH, dockH],
  );

  useEffect(() => {
    const measure = () => setViewport(readViewport());
    const vv = window.visualViewport;
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.addEventListener("load", measure);
    vv?.addEventListener("resize", measure);
    vv?.addEventListener("scroll", measure);
    // Re-measure shortly after mount in case the first reading was not final.
    const t1 = window.setTimeout(measure, 300);
    const t2 = window.setTimeout(measure, 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
      vv?.removeEventListener("resize", measure);
      vv?.removeEventListener("scroll", measure);
    };
  }, []);

  // Touch screens: no keyboard until a text field is tapped twice, and a
  // long press acts as a right-click.
  useEffect(() => {
    const uninstallGuard = installTouchKeyboardGuard(document);
    const uninstallLongPress = installLongPress(document);
    return () => {
      uninstallGuard();
      uninstallLongPress();
    };
  }, []);

  const open = useCallback(
    (app: AppId, props: Record<string, unknown> = {}) => {
      dispatch({ type: "open", app, props, area, mobile });
      setOverview(false);
    },
    [area, mobile],
  );

  const notify = useCallback((title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  const openPath = useCallback(
    (path: string, opts?: { with?: AppId }) => {
      const node = stat(path);
      if (!node) return notify("File not found", path);
      if (opts?.with === "editor" || (node.type === "file" && node.kind === "text")) {
        const existing = wm.wins.find((w) => w.app === "editor" && w.props.path === path);
        if (existing) dispatch({ type: "focus", id: existing.id });
        else open("editor", { path });
        return;
      }
      if (node.type === "dir") return void open("files", { path });
      if (node.kind === "html") return void open("browser", { route: node.route });
      if (node.kind === "app") return void open(node.app);
    },
    [open, notify, wm.wins],
  );

  const power = useCallback((state: PowerState) => {
    setOverview(false);
    if (state === "boot" || state === "off") dispatch({ type: "closeAll" });
    if (state === "boot") setQuickBoot(false);
    setPowerState(state);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const active = activeWindow(wm.wins);

  const os: OS = useMemo(
    () => ({
      wins: wm.wins,
      activeId: active?.id,
      area,
      mobile,
      insets,
      keyboardOpen,
      open,
      openPath,
      openRoute: (route: string) => open("browser", { route }),
      close: (id) => dispatch({ type: "close", id }),
      closeApp: (app) => wm.wins.filter((w) => w.app === app).forEach((w) => dispatch({ type: "close", id: w.id })),
      focus: (id) => dispatch({ type: "focus", id }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      setMode: (id, mode, rect) => dispatch({ type: "mode", id, mode, rect }),
      setRect: (id, rect) => dispatch({ type: "rect", id, rect }),
      setTitle: (id, title) => dispatch({ type: "title", id, title }),
      setProps: (id, props) => dispatch({ type: "props", id, props }),
      settings,
      updateSettings,
      notify,
      power,
      bootedAt,
    }),
    [wm.wins, active?.id, area, mobile, insets, keyboardOpen, open, openPath, settings, updateSettings, notify, power, bootedAt],
  );

  // Once booted on first load, open the page the visitor asked for.
  function finishBoot() {
    try {
      window.sessionStorage.setItem(BOOTED_KEY, "1");
    } catch {}
    setPowerState("on");
    if (!ready.current) {
      ready.current = true;
      // A plain visit starts on the empty desktop. A direct link to a page
      // (/method, /contact…) still opens that page so shared links work.
      const route = window.location.pathname + window.location.search;
      if (window.location.pathname !== "/") open("browser", { route });
      try {
        if (!window.localStorage.getItem("skilledscan-os:welcomed")) {
          window.localStorage.setItem("skilledscan-os:welcomed", "1");
          window.setTimeout(
            () =>
              notify(
                "Welcome to SkilledScan OS",
                isTouchDevice()
                  ? "Every page is an .html file on the desktop: tap one to open it. Games are under Show Applications. Long-press for options; double-tap a text field to type."
                  : "Every page is an .html file on the desktop: double-click one to open it. Games are under Show Applications. Ctrl+Alt+T opens a terminal.",
              ),
            900,
          );
        }
      } catch {}
    }
  }

  // Global shortcuts, including ones forwarded from pages inside browser windows.
  useEffect(() => {
    let superAlone = false;
    function handle(key: string, ctrl: boolean, alt: boolean) {
      if (ctrl && alt && key.toLowerCase() === "t") open("terminal");
      else if (ctrl && key === "`") open("terminal");
      else if (key === "Meta") setOverview((v) => !v);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Meta") {
        superAlone = true;
        return;
      }
      superAlone = false;
      if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") || (e.ctrlKey && e.key === "`")) {
        e.preventDefault();
        handle(e.key, e.ctrlKey, e.altKey);
      } else if (e.key === "Escape") setOverview(false);
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Meta" && superAlone) handle("Meta", false, false);
      superAlone = false;
    }
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; key?: string; ctrlKey?: boolean; altKey?: boolean };
      if (d.type === "os:key" && d.key) handle(d.key, !!d.ctrlKey, !!d.altKey);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("message", onMessage);
    };
  }, [open]);

  // With no page open, the address bar goes back to the bare desktop URL,
  // so a reload starts on the desktop instead of the last page viewed.
  const hasBrowser = wm.wins.some((w) => w.app === "browser");
  useEffect(() => {
    if (!hasBrowser && powerState === "on" && window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }, [hasBrowser, powerState]);

  // Accent colour drives the OS chrome through CSS variables.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--os-accent", settings.accent);
    root.style.setProperty("--os-accent-rgb", hexToRgb(settings.accent));
  }, [settings.accent]);

  const wallpaper = wallpapers.find((w) => w.id === settings.wallpaper) ?? wallpapers[0];

  return (
    <OSContext.Provider value={os}>
      <div
        className="os-root fixed inset-x-0 select-none overflow-hidden"
        style={{ background: wallpaper.css, top: viewport.top, height: viewport.h }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center text-white/[0.05]">
          <Logo markClassName="h-[clamp(36px,6vw,80px)] w-[clamp(36px,6vw,80px)]" textClassName="text-[clamp(26px,5vw,68px)]" />
        </div>

        <h1 className="sr-only">SkilledScan OS desktop</h1>
        <DesktopIcons />

        {wm.wins.map((w) => (
          <Window key={w.id} win={w}>
            {appViews[w.app]()}
          </Window>
        ))}

        {overview ? <Overview onClose={() => setOverview(false)} /> : null}

        <Dock
          overviewOpen={overview}
          onShowApps={() => setOverview((v) => !v)}
        />
        <Panel overviewOpen={overview} onActivities={() => setOverview((v) => !v)} />

        <div className="pointer-events-none absolute left-1/2 top-11 z-[6000] flex w-[min(380px,calc(100vw-32px))] -translate-x-1/2 flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} role="status" className="os-toast pointer-events-auto px-4 py-3">
              <p className="text-[13px] font-semibold text-[var(--os-fg)]">{t.title}</p>
              {t.body ? <p className="mt-0.5 text-[12.5px] text-[var(--os-muted)]">{t.body}</p> : null}
            </div>
          ))}
        </div>

        {settings.nightLight ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[9000] bg-[#ff9a3c] mix-blend-multiply opacity-[0.18]" />
        ) : null}
        {settings.brightness < 100 ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[9001] bg-black"
            style={{ opacity: (100 - settings.brightness) / 100 }}
          />
        ) : null}

        {powerState === "locked" ? <LockScreen wallpaper={wallpaper.css} onUnlock={() => setPowerState("on")} /> : null}
        {powerState === "off" ? <OffScreen onPower={() => power("boot")} /> : null}
        {powerState === "boot" ? (
<BootScreen quick={quickBoot} onDone={finishBoot} />
        ) : null}
      </div>
    </OSContext.Provider>
  );
}
