"use client";

import { useEffect, useRef, useState } from "react";
import { apps } from "@/components/desktop/apps/registry";
import { Glyph } from "@/components/desktop/icons";
import { WindowContext, useOS, type Rect, type Win, type WinMode } from "@/components/desktop/wm";

type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const dirs: Dir[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const EDGE = 6;

function tiledRect(mode: WinMode, area: Rect): Rect | null {
  if (mode === "max") return area;
  if (mode === "left") return { x: area.x, y: area.y, w: Math.round(area.w / 2), h: area.h };
  if (mode === "right") {
    const w = Math.round(area.w / 2);
    return { x: area.x + area.w - w, y: area.y, w, h: area.h };
  }
  return null;
}

function beginGesture(cursor: string) {
  document.body.classList.add("wm-gesture");
  document.body.style.cursor = cursor;
}
function endGesture() {
  document.body.classList.remove("wm-gesture");
  document.body.style.cursor = "";
}

export function Window({ win, children }: { win: Win; children: React.ReactNode }) {
  const os = useOS();
  const { area, mobile } = os;
  const active = os.activeId === win.id;
  const meta = apps[win.app];
  const [live, setLive] = useState<Rect | null>(null);
  const [snap, setSnap] = useState<WinMode | null>(null);
  const [closing, setClosing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const mode: WinMode = mobile ? "max" : win.mode;
  const shown: Rect = live ?? tiledRect(mode, area) ?? win.rect;

  // Keep at least part of the title bar reachable when the screen shrinks.
  const clamped: Rect = {
    ...shown,
    x: Math.min(Math.max(shown.x, area.x - shown.w + 120), area.x + area.w - 120),
    y: Math.min(Math.max(shown.y, area.y), area.y + area.h - 40),
  };

  useEffect(() => {
    if (active && !win.minimized) {
      const el = rootRef.current;
      if (el && !el.contains(document.activeElement)) {
        const target = el.querySelector<HTMLElement>("[data-autofocus]");
        target?.focus({ preventScroll: true });
      }
    }
  }, [active, win.minimized]);

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => os.close(win.id), 140);
  }

  function toggleMax() {
    os.setMode(win.id, mode === "normal" ? "max" : "normal");
  }

  function onHeaderPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button,input,[data-nodrag]")) return;
    os.focus(win.id);
    if (mobile) return;
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    let base = { ...shown };
    let originX = startX;
    let originY = startY;
    let tiled = mode !== "normal";
    let moved = false;
    let pendingSnap: WinMode | null = null;
    let last = base;

    beginGesture("grabbing");

    function onMove(ev: PointerEvent) {
      // Button released somewhere we never heard about (outside the browser).
      if (ev.buttons === 0) return onUp();
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 4) return;
      moved = true;
      if (tiled) {
        // Pull a tiled window off the edge at its remembered size, keeping
        // the grab point proportional so it stays under the pointer.
        const ratio = (startX - base.x) / base.w;
        base = { x: ev.clientX - win.rect.w * ratio, y: area.y, w: win.rect.w, h: win.rect.h };
        originX = ev.clientX;
        originY = ev.clientY;
        tiled = false;
        os.setMode(win.id, "normal");
      }
      const next = {
        ...base,
        x: Math.round(base.x + ev.clientX - originX),
        y: Math.round(Math.max(area.y, base.y + ev.clientY - originY)),
      };
      last = next;
      setLive(next);
      if (ev.clientY <= area.y + 2) pendingSnap = "max";
      else if (ev.clientX <= area.x + 2) pendingSnap = "left";
      else if (ev.clientX >= area.x + area.w - 2) pendingSnap = "right";
      else pendingSnap = null;
      setSnap(pendingSnap);
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      endGesture();
      setSnap(null);
      setLive(null);
      if (!moved) return;
      if (pendingSnap) os.setMode(win.id, pendingSnap, { ...last, y: Math.max(area.y + 8, last.y) });
      else os.setRect(win.id, last);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    // Alt-tab or a release outside the browser must not leave every page
    // window ignoring the mouse (frames are click-through during a gesture).
    window.addEventListener("blur", onUp);
  }

  function onResizePointerDown(e: React.PointerEvent, dir: Dir) {
    if (e.button !== 0 || mobile) return;
    e.preventDefault();
    e.stopPropagation();
    os.focus(win.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const base = { ...shown };
    const [minW, minH] = meta.minSize;
    let last = base;
    if (mode !== "normal") os.setMode(win.id, "normal", base);

    beginGesture(`${dir}-resize`);

    function onMove(ev: PointerEvent) {
      if (ev.buttons === 0) return onUp();
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let { x, y, w, h } = base;
      if (dir.includes("e")) w = Math.max(minW, base.w + dx);
      if (dir.includes("s")) h = Math.max(minH, base.h + dy);
      if (dir.includes("w")) {
        w = Math.max(minW, base.w - dx);
        x = base.x + base.w - w;
      }
      if (dir.includes("n")) {
        const top = Math.max(area.y, base.y + dy);
        h = Math.max(minH, base.y + base.h - top);
        y = base.y + base.h - h;
      }
      last = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
      setLive(last);
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      endGesture();
      setLive(null);
      os.setRect(win.id, last);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    // Alt-tab or a release outside the browser must not leave every page
    // window ignoring the mouse (frames are click-through during a gesture).
    window.addEventListener("blur", onUp);
  }

  const snapRect = snap ? tiledRect(snap, area) : null;
  const tiledNow = mode !== "normal";

  return (
    <>
      {snapRect ? (
        <div
          className="os-snap-preview pointer-events-none absolute"
          style={{ left: snapRect.x + 6, top: snapRect.y + 6, width: snapRect.w - 12, height: snapRect.h - 12, zIndex: win.z - 1 }}
        />
      ) : null}
      <div
        ref={rootRef}
        role="dialog"
        aria-label={win.title}
        data-window={win.app}
        data-active={active ? "true" : "false"}
        className={[
          "os-window absolute flex flex-col",
          live ? "" : "os-window-anim",
          tiledNow ? "os-window-tiled" : "",
          win.minimized ? "os-window-min" : "",
          closing ? "os-window-closing" : "",
        ].join(" ")}
        style={{ left: clamped.x, top: clamped.y, width: clamped.w, height: clamped.h, zIndex: win.z }}
        onPointerDownCapture={() => {
          if (!active) os.focus(win.id);
        }}
      >
        <header
          className="os-titlebar relative flex h-10 shrink-0 select-none items-center px-2"
          onPointerDown={onHeaderPointerDown}
          onDoubleClick={(e) => {
            if ((e.target as HTMLElement).closest("button,input,[data-nodrag]")) return;
            if (!mobile) toggleMax();
          }}
        >
          <div className="pointer-events-none absolute inset-x-28 truncate text-center text-[13px] font-semibold text-[var(--os-fg)]">
            {win.title}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="os-wbtn" aria-label="Minimize" onClick={() => os.minimize(win.id)}>
              <Glyph.Minimize className="h-3.5 w-3.5" />
            </button>
            {mobile ? null : (
              <button
                type="button"
                className="os-wbtn"
                aria-label={tiledNow ? "Restore" : "Maximize"}
                onClick={toggleMax}
              >
                {tiledNow ? <Glyph.Restore className="h-3.5 w-3.5" /> : <Glyph.Maximize className="h-3.5 w-3.5" />}
              </button>
            )}
            <button type="button" className="os-wbtn os-wbtn-close" aria-label="Close" onClick={requestClose}>
              <Glyph.Close className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <WindowContext.Provider value={win}>{children}</WindowContext.Provider>
        </div>
        {mobile || win.mode === "max"
          ? null
          : dirs.map((d) => (
              <div
                key={d}
                className={`os-resize os-resize-${d}`}
                style={{ ["--edge" as string]: `${EDGE}px` }}
                onPointerDown={(e) => onResizePointerDown(e, d)}
              />
            ))}
      </div>
    </>
  );
}
