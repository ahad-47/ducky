"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { BrowserApp } from "@/components/desktop/apps/BrowserApp";
import { CalculatorApp } from "@/components/desktop/apps/CalculatorApp";
import { EditorApp } from "@/components/desktop/apps/EditorApp";
import { FilesApp } from "@/components/desktop/apps/FilesApp";
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
};

type Toast = { id: number; title: string; body?: string };

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function Desktop() {
  const [wm, dispatch] = useReducer(wmReducer, initialWm);
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
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
  const area: Rect = useMemo(
    () =>
      mobile
        ? { x: 0, y: PANEL_H, w: viewport.w, h: viewport.h - PANEL_H - DOCK_H }
        : { x: DOCK_W, y: PANEL_H, w: viewport.w - DOCK_W, h: viewport.h - PANEL_H },
    [mobile, viewport],
  );

  useEffect(() => {
    const measure = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
    [wm.wins, active?.id, area, mobile, open, openPath, settings, updateSettings, notify, power, bootedAt],
  );

  // Once booted on first load, open the page the visitor asked for.
  function finishBoot() {
    try {
      window.sessionStorage.setItem(BOOTED_KEY, "1");
    } catch {}
    setPowerState("on");
    if (!ready.current) {
      ready.current = true;
      const route = window.location.pathname + window.location.search;
      open("browser", { route });
      try {
        if (!window.localStorage.getItem("skilledscan-os:welcomed")) {
          window.localStorage.setItem("skilledscan-os:welcomed", "1");
          window.setTimeout(
            () => notify("Welcome to SkilledScan OS", "Every page is an .html file on the desktop. Press Ctrl+Alt+T for a terminal."),
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

  // Accent colour drives the OS chrome through CSS variables.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--os-accent", settings.accent);
    root.style.setProperty("--os-accent-rgb", hexToRgb(settings.accent));
  }, [settings.accent]);

  const wallpaper = wallpapers.find((w) => w.id === settings.wallpaper) ?? wallpapers[0];

  return (
    <OSContext.Provider value={os}>
      <div className="os-root fixed inset-0 select-none overflow-hidden" style={{ background: wallpaper.css }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center font-[family-name:var(--font-mono)] text-[clamp(28px,6vw,72px)] font-bold tracking-tight text-white/[0.035]"
        >
          SkilledScan
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
