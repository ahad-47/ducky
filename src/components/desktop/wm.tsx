"use client";

import { createContext, useContext } from "react";
import { apps, type AppId } from "@/components/desktop/apps/registry";

export type Rect = { x: number; y: number; w: number; h: number };
export type WinMode = "normal" | "max" | "left" | "right";

export type Win = {
  id: string;
  pid: number;
  app: AppId;
  title: string;
  rect: Rect;
  mode: WinMode;
  z: number;
  minimized: boolean;
  props: Record<string, unknown>;
  startedAt: number;
};

export type WmState = { wins: Win[]; zTop: number; nextPid: number };

export type WmAction =
  | { type: "open"; app: AppId; props: Record<string, unknown>; area: Rect; mobile: boolean }
  | { type: "close"; id: string }
  | { type: "closeAll" }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "mode"; id: string; mode: WinMode; rect?: Rect }
  | { type: "rect"; id: string; rect: Rect }
  | { type: "title"; id: string; title: string }
  | { type: "props"; id: string; props: Record<string, unknown> };

export const initialWm: WmState = { wins: [], zTop: 10, nextPid: 1200 };

export function wmReducer(state: WmState, action: WmAction): WmState {
  switch (action.type) {
    case "open": {
      const meta = apps[action.app];
      const { area } = action;
      const w = Math.min(meta.size[0], area.w - 24);
      const h = Math.min(meta.size[1], area.h - 24);
      const visible = state.wins.filter((x) => !x.minimized).length;
      const offset = (visible % 6) * 30;
      const rect = {
        x: Math.round(area.x + (area.w - w) / 2 + 40 + offset),
        y: Math.round(area.y + Math.max(12, (area.h - h) / 2 - 60) + offset),
        w,
        h,
      };
      rect.x = Math.max(area.x + 8, Math.min(rect.x, area.x + area.w - w - 8));
      rect.y = Math.max(area.y + 8, Math.min(rect.y, area.y + area.h - h - 8));
      const pid = state.nextPid;
      const win: Win = {
        id: `w${pid}`,
        pid,
        app: action.app,
        title: meta.name,
        rect,
        mode: action.mobile ? "max" : "normal",
        z: state.zTop + 1,
        minimized: false,
        props: action.props,
        startedAt: Date.now(),
      };
      return { wins: [...state.wins, win], zTop: state.zTop + 1, nextPid: pid + 1 + Math.floor(Math.random() * 7) };
    }
    case "close":
      return { ...state, wins: state.wins.filter((w) => w.id !== action.id) };
    case "closeAll":
      return { ...state, wins: [] };
    case "focus":
      return {
        ...state,
        zTop: state.zTop + 1,
        wins: state.wins.map((w) => (w.id === action.id ? { ...w, z: state.zTop + 1, minimized: false } : w)),
      };
    case "minimize":
      return { ...state, wins: state.wins.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)) };
    case "mode":
      return {
        ...state,
        wins: state.wins.map((w) =>
          w.id === action.id ? { ...w, mode: action.mode, rect: action.rect ?? w.rect } : w,
        ),
      };
    case "rect":
      return { ...state, wins: state.wins.map((w) => (w.id === action.id ? { ...w, rect: action.rect } : w)) };
    case "title":
      return { ...state, wins: state.wins.map((w) => (w.id === action.id ? { ...w, title: action.title } : w)) };
    case "props":
      return {
        ...state,
        wins: state.wins.map((w) => (w.id === action.id ? { ...w, props: { ...w.props, ...action.props } } : w)),
      };
  }
}

export function activeWindow(wins: Win[]): Win | undefined {
  let top: Win | undefined;
  for (const w of wins) if (!w.minimized && (!top || w.z > top.z)) top = w;
  return top;
}

export type Settings = {
  wallpaper: string;
  accent: string;
  brightness: number;
  volume: number;
  nightLight: boolean;
  wifi: boolean;
  bluetooth: boolean;
};

export const defaultSettings: Settings = {
  wallpaper: "signal",
  accent: "#3d5fde",
  brightness: 100,
  volume: 60,
  nightLight: false,
  wifi: true,
  bluetooth: false,
};

export type PowerState = "boot" | "on" | "locked" | "off";

export type OS = {
  wins: Win[];
  activeId: string | undefined;
  area: Rect;
  mobile: boolean;
  insets: { top: number; bottom: number };
  keyboardOpen: boolean;
  open: (app: AppId, props?: Record<string, unknown>) => void;
  openPath: (path: string, opts?: { with?: AppId }) => void;
  openRoute: (route: string) => void;
  close: (id: string) => void;
  closeApp: (app: AppId) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  setMode: (id: string, mode: WinMode, rect?: Rect) => void;
  setRect: (id: string, rect: Rect) => void;
  setTitle: (id: string, title: string) => void;
  setProps: (id: string, props: Record<string, unknown>) => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  notify: (title: string, body?: string) => void;
  power: (state: PowerState) => void;
  bootedAt: number;
};

export const OSContext = createContext<OS | null>(null);

export function useOS(): OS {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS outside OSContext");
  return ctx;
}

export const WindowContext = createContext<Win | null>(null);

export function useWin(): Win {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWin outside a window");
  return ctx;
}

export const wallpapers: { id: string; name: string; css: string }[] = [
  {
    id: "signal",
    name: "Signal",
    css: "radial-gradient(ellipse at 18% 22%, rgba(61,95,222,0.55) 0%, transparent 52%), radial-gradient(ellipse at 82% 70%, rgba(94,234,212,0.32) 0%, transparent 50%), radial-gradient(ellipse at 60% 10%, rgba(143,168,255,0.18) 0%, transparent 40%), linear-gradient(160deg, #0b1120 0%, #0d1529 55%, #081019 100%)",
  },
  {
    id: "dusk",
    name: "Dusk",
    css: "radial-gradient(ellipse at 30% 80%, rgba(233,84,32,0.55) 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, rgba(119,41,83,0.7) 0%, transparent 55%), linear-gradient(135deg, #2c001e 0%, #3a0f2e 50%, #1a0612 100%)",
  },
  {
    id: "terminal",
    name: "Phosphor",
    css: "repeating-linear-gradient(0deg, rgba(94,234,212,0.04) 0px, rgba(94,234,212,0.04) 1px, transparent 1px, transparent 4px), radial-gradient(ellipse at center, #0f2a24 0%, #050c0b 75%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    css: "radial-gradient(ellipse at 20% 100%, rgba(94,234,212,0.5) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(167,139,250,0.55) 0%, transparent 55%), linear-gradient(180deg, #0a0f24 0%, #111a3a 100%)",
  },
  {
    id: "slate",
    name: "Slate",
    css: "linear-gradient(145deg, #2b2f36 0%, #1d2026 60%, #15171b 100%)",
  },
  {
    id: "ember",
    name: "Ember",
    css: "radial-gradient(circle at 50% 120%, rgba(255,159,85,0.65) 0%, transparent 55%), radial-gradient(circle at 10% 10%, rgba(255,107,107,0.3) 0%, transparent 40%), linear-gradient(180deg, #120a0a 0%, #241311 100%)",
  },
];

export const accents = ["#3d5fde", "#5eead4", "#e95420", "#a78bfa", "#ff6b6b", "#ffd166", "#22c55e"];
