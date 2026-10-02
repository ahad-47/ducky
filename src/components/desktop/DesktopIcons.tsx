"use client";

import { useMemo, useRef, useState } from "react";
import { ContextMenu, type MenuItem } from "@/components/desktop/ContextMenu";
import {
  DESKTOP,
  FsError,
  HOME,
  TRASH,
  basename,
  dirname,
  emptyTrash,
  isWritable,
  list,
  mkdir,
  move,
  trash,
  uniqueName,
  useFs,
  writeFile,
  type FsNode,
} from "@/components/desktop/fs";
import { FileIcon, HomeIcon, TrashIcon } from "@/components/desktop/icons";
import { useOS } from "@/components/desktop/wm";

const CELL_W = 96;
const CELL_H = 104;
const ICONS_KEY = "skilledscan-os:icons:v1";

type Item = { key: string; label: string; path: string; node: FsNode; special?: "home" | "trash" };
type Cell = [number, number];

function loadPositions(): Record<string, Cell> {
  try {
    return JSON.parse(window.localStorage.getItem(ICONS_KEY) ?? "{}") as Record<string, Cell>;
  } catch {
    return {};
  }
}

export function DesktopIcons() {
  const os = useOS();
  const fs = useFs();
  const { area, mobile } = os;
  const [saved, setSaved] = useState<Record<string, Cell>>(loadPositions);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [band, setBand] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [renaming, setRenaming] = useState<{ path: string; value: string } | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const items: Item[] = useMemo(() => {
    const home: Item = { key: "::home", label: "Home", path: HOME, node: { type: "dir", mtime: 0 }, special: "home" };
    const bin: Item = { key: "::trash", label: "Trash", path: TRASH, node: { type: "dir", mtime: 0 }, special: "trash" };
    const files = list(DESKTOP, fs).map((e) => ({ key: e.name, label: e.name, path: e.path, node: e.node }));
    // Pages first in site order, then everything else alphabetically.
    const order = ["home.html", "method.html", "engagements.html", "report-sample.html", "compliance.html", "roadmap.html", "security.html", "contact.html", "legal", "README.txt"];
    files.sort((a, b) => {
      const ia = order.indexOf(a.key);
      const ib = order.indexOf(b.key);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return a.key.localeCompare(b.key);
    });
    return [home, ...files, bin];
  }, [fs]);

  // Phones: icons fill the width evenly, row by row, like a home screen.
  const cols = mobile
    ? Math.max(3, Math.floor((area.w - 16) / 84))
    : Math.max(1, Math.floor((area.w - 16) / CELL_W));
  const cellW = mobile ? (area.w - 16) / cols : CELL_W;
  const rows = Math.max(1, Math.floor((area.h - 16) / CELL_H));

  // Resolve every item to a cell: saved positions first, then fill gaps in
  // column-major order like a file-manager desktop.
  const placed = useMemo(() => {
    const taken = new Set<string>();
    const out = new Map<string, Cell>();
    for (const it of items) {
      // Positions dragged on a large screen do not carry over to a phone grid.
      const c = mobile ? undefined : saved[it.key];
      if (c && c[0] < cols && c[1] < rows && !taken.has(`${c[0]},${c[1]}`)) {
        out.set(it.key, c);
        taken.add(`${c[0]},${c[1]}`);
      }
    }
    let cursor = 0;
    for (const it of items) {
      if (out.has(it.key)) continue;
      if (it.special === "trash" && !saved[it.key] && !mobile) {
        // Trash lives in the bottom-right corner by default.
        const corner: Cell = [cols - 1, rows - 1];
        if (!taken.has(`${corner[0]},${corner[1]}`)) {
          out.set(it.key, corner);
          taken.add(`${corner[0]},${corner[1]}`);
          continue;
        }
      }
      const cellFor = (n: number): Cell => (mobile ? [n % cols, Math.floor(n / cols)] : [Math.floor(n / rows), n % rows]);
      while (taken.has(cellFor(cursor).join(","))) cursor++;
      const c = cellFor(cursor);
      out.set(it.key, c);
      taken.add(`${c[0]},${c[1]}`);
    }
    return out;
  }, [items, saved, rows, cols, mobile]);

  function persist(next: Record<string, Cell>) {
    setSaved(next);
    try {
      window.localStorage.setItem(ICONS_KEY, JSON.stringify(next));
    } catch {}
  }

  function cellAt(clientX: number, clientY: number): Cell {
    const c = Math.round((clientX - area.x - 8 - cellW / 2) / cellW);
    const r = Math.round((clientY - area.y - 8 - CELL_H / 2) / CELL_H);
    return [Math.max(0, Math.min(cols - 1, c)), Math.max(0, Math.min(rows - 1, r))];
  }

  function itemAtCell(cell: Cell): Item | undefined {
    return items.find((it) => {
      const c = placed.get(it.key);
      return c && c[0] === cell[0] && c[1] === cell[1];
    });
  }

  function attempt(fn: () => void) {
    try {
      fn();
    } catch (e) {
      os.notify("Could not complete action", e instanceof FsError ? e.message : undefined);
    }
  }

  function open(it: Item) {
    if (it.special) os.open("files", { path: it.path });
    else os.openPath(it.path);
  }

  function onIconPointerDown(e: React.PointerEvent, it: Item) {
    if (e.button !== 0 || renaming) return;
    e.stopPropagation();
    const additive = e.ctrlKey || e.metaKey || e.shiftKey;
    let sel = selected;
    if (additive) {
      sel = new Set(selected);
      if (sel.has(it.key)) sel.delete(it.key);
      else sel.add(it.key);
    } else if (!selected.has(it.key)) sel = new Set([it.key]);
    setSelected(sel);
    if (mobile || e.pointerType === "touch") return;

    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    const onMove = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      moved = true;
      setDrag({ dx: ev.clientX - sx, dy: ev.clientY - sy });
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDrag(null);
      if (!moved) return;
      const origin = placed.get(it.key)!;
      const dropCell = cellAt(
        area.x + 8 + origin[0] * cellW + cellW / 2 + ev.clientX - sx,
        area.y + 8 + origin[1] * CELL_H + CELL_H / 2 + ev.clientY - sy,
      );
      const target = itemAtCell(dropCell);
      const moving = items.filter((x) => sel.has(x.key));
      if (target && !sel.has(target.key) && (target.special === "trash" || target.node.type === "dir")) {
        attempt(() => {
          for (const m of moving) {
            if (m.special) continue;
            if (target.special === "trash") trash(m.path);
            else move(m.path, target.path);
          }
        });
        return;
      }
      // Reposition: shift every selected icon by the same cell offset.
      const dc = dropCell[0] - origin[0];
      const dr = dropCell[1] - origin[1];
      const next = { ...Object.fromEntries(placed) } as Record<string, Cell>;
      const occupied = new Map<string, string>();
      for (const [k, c] of Object.entries(next)) if (!sel.has(k)) occupied.set(`${c[0]},${c[1]}`, k);
      for (const m of moving) {
        const c = placed.get(m.key)!;
        const nc: Cell = [Math.max(0, Math.min(cols - 1, c[0] + dc)), Math.max(0, Math.min(rows - 1, c[1] + dr))];
        if (occupied.has(`${nc[0]},${nc[1]}`)) continue;
        next[m.key] = nc;
        occupied.set(`${nc[0]},${nc[1]}`, m.key);
      }
      persist(next);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onBackgroundPointerDown(e: React.PointerEvent) {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    (document.activeElement as HTMLElement | null)?.blur();
    layerRef.current?.focus({ preventScroll: true });
    setSelected(new Set());
    if (mobile) return;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const onMove = (ev: PointerEvent) => {
      const b = { x0, y0, x1: ev.clientX, y1: ev.clientY };
      setBand(b);
      const left = Math.min(b.x0, b.x1);
      const right = Math.max(b.x0, b.x1);
      const top = Math.min(b.y0, b.y1);
      const bottom = Math.max(b.y0, b.y1);
      const hit = new Set<string>();
      for (const it of items) {
        const c = placed.get(it.key)!;
        const ix = area.x + 8 + c[0] * cellW;
        const iy = area.y + 8 + c[1] * CELL_H;
        if (ix + cellW - 12 > left && ix + 12 < right && iy + CELL_H - 12 > top && iy + 8 < bottom) hit.add(it.key);
      }
      setSelected(hit);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setBand(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function newItem(kind: "folder" | "doc") {
    attempt(() => {
      const name = uniqueName(DESKTOP, kind === "folder" ? "New Folder" : "Untitled Document.txt");
      const path = `${DESKTOP}/${name}`;
      if (kind === "folder") mkdir(path);
      else writeFile(path, "");
      setSelected(new Set([name]));
      setRenaming({ path, value: name });
    });
  }

  function backgroundMenu(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setSelected(new Set());
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "New Folder", onClick: () => newItem("folder") },
        { label: "New Document", onClick: () => newItem("doc") },
        { separator: true },
        { label: "Open in Terminal", hint: "Ctrl+Alt+T", onClick: () => os.open("terminal", { cwd: DESKTOP }) },
        { label: "Show Desktop in Files", onClick: () => os.open("files", { path: DESKTOP }) },
        { separator: true },
        { label: "Arrange Icons", onClick: () => persist({}) },
        { label: "Change Background…", onClick: () => os.open("settings", { section: "Appearance" }) },
        { label: "Display Settings", onClick: () => os.open("settings", { section: "Display" }) },
      ],
    });
  }

  function iconMenu(e: React.MouseEvent, it: Item) {
    e.preventDefault();
    e.stopPropagation();
    if (!selected.has(it.key)) setSelected(new Set([it.key]));
    const writable = !it.special && isWritable(it.path);
    const items: MenuItem[] = [{ label: "Open", onClick: () => open(it) }];
    if (it.node.type === "file" && it.node.kind === "html") {
      items.push({ label: "Open in New Window", onClick: () => os.openPath(it.path) });
      items.push({ label: "View Page Source", onClick: () => os.openPath(it.path, { with: "editor" }) });
    }
    if (it.node.type === "file" && it.node.kind === "text") {
      items.push({ label: "Open With Text Editor", onClick: () => os.openPath(it.path, { with: "editor" }) });
    }
    if (it.node.type === "dir") items.push({ label: "Open in Terminal", onClick: () => os.open("terminal", { cwd: it.path }) });
    if (it.special === "trash") {
      items.push({ separator: true }, { label: "Empty Trash", danger: true, onClick: () => attempt(emptyTrash) });
    }
    if (writable) {
      items.push(
        { separator: true },
        { label: "Rename…", hint: "F2", onClick: () => setRenaming({ path: it.path, value: basename(it.path) }) },
        {
          label: "Move to Trash",
          hint: "Delete",
          danger: true,
          onClick: () => attempt(() => items_(selected.has(it.key) ? selected : new Set([it.key])).forEach((x) => trash(x.path))),
        },
      );
    }
    setMenu({ x: e.clientX, y: e.clientY, items });
  }

  function items_(keys: Set<string>) {
    return items.filter((x) => keys.has(x.key) && !x.special);
  }

  function commitRename() {
    if (!renaming) return;
    const value = renaming.value.trim();
    const from = renaming.path;
    setRenaming(null);
    if (!value || value === basename(from) || value.includes("/")) return;
    attempt(() => {
      move(from, `${dirname(from)}/${value}`);
      const pos = saved[basename(from)] ?? placed.get(basename(from));
      if (pos) persist({ ...saved, [value]: pos });
      setSelected(new Set([value]));
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (renaming) return;
    const sel = items.filter((x) => selected.has(x.key));
    if (e.key === "Enter") sel.forEach(open);
    else if (e.key === "Delete") attempt(() => items_(selected).forEach((x) => isWritable(x.path) && trash(x.path)));
    else if (e.key === "F2" && sel.length === 1 && !sel[0].special) setRenaming({ path: sel[0].path, value: sel[0].label });
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setSelected(new Set(items.map((x) => x.key)));
    }
  }

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 outline-none"
      tabIndex={-1}
      onPointerDown={onBackgroundPointerDown}
      onContextMenu={backgroundMenu}
      onKeyDown={onKeyDown}
      aria-label="Desktop"
    >
      {items.map((it) => {
        const c = placed.get(it.key)!;
        const isSel = selected.has(it.key);
        const offset = drag && isSel ? drag : null;
        return (
          <div
            key={it.key}
            role="button"
            tabIndex={0}
            aria-label={it.label}
            data-desktop-icon={it.key}
            className={`os-icon absolute flex flex-col items-center gap-1 rounded-lg px-1 pb-1 pt-2 ${isSel ? "os-icon-selected" : ""} ${offset ? "pointer-events-none opacity-80" : ""}`}
            style={{
              left: area.x + 8 + c[0] * cellW + (offset?.dx ?? 0),
              top: area.y + 8 + c[1] * CELL_H + (offset?.dy ?? 0),
              width: cellW - 6,
              zIndex: offset ? 5 : 1,
            }}
            onPointerDown={(e) => onIconPointerDown(e, it)}
            onClick={(e) => {
              if (mobile || (e.nativeEvent as PointerEvent).pointerType === "touch") open(it);
            }}
            onDoubleClick={() => !mobile && open(it)}
            onContextMenu={(e) => iconMenu(e, it)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !renaming) {
                e.stopPropagation();
                open(it);
              }
            }}
          >
            {it.special === "home" ? (
              <HomeIcon size={52} />
            ) : it.special === "trash" ? (
              <TrashIcon size={52} />
            ) : (
              <FileIcon node={it.node} name={it.label} size={52} />
            )}
            {renaming?.path === it.path ? (
              <input
                autoFocus
                value={renaming.value}
                onChange={(e) => setRenaming({ ...renaming, value: e.target.value })}
                onBlur={commitRename}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") setRenaming(null);
                }}
                onFocus={(e) => {
                  const dot = e.target.value.lastIndexOf(".");
                  e.target.setSelectionRange(0, dot > 0 ? dot : e.target.value.length);
                }}
                className="os-input w-full text-center text-[12px]"
              />
            ) : (
              <span className={`os-icon-label ${isSel ? "" : "line-clamp-2"}`}>{it.label}</span>
            )}
          </div>
        );
      })}
      {band ? (
        <div
          className="os-band pointer-events-none fixed"
          style={{
            left: Math.min(band.x0, band.x1),
            top: Math.min(band.y0, band.y1),
            width: Math.abs(band.x1 - band.x0),
            height: Math.abs(band.y1 - band.y0),
          }}
        />
      ) : null}
      {menu ? <ContextMenu {...menu} onClose={() => setMenu(null)} /> : null}
    </div>
  );
}
