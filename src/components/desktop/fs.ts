"use client";

import { useSyncExternalStore } from "react";
import type { AppId } from "@/components/desktop/apps/registry";
import { pages } from "@/components/desktop/pages";

// A small in-memory filesystem shared by the desktop, Files, Terminal and the
// Text Editor. User changes persist to localStorage; system paths are read-only.

export type FsNode =
  | { type: "dir"; mtime: number; trashedFrom?: string }
  | { type: "file"; kind: "html"; route: string; mtime: number; trashedFrom?: string }
  | { type: "file"; kind: "text"; content: string; mtime: number; trashedFrom?: string }
  | { type: "file"; kind: "app"; app: AppId; mtime: number; trashedFrom?: string };

export type FsTable = Record<string, FsNode>;

export const HOME = "/home/guest";
export const DESKTOP = `${HOME}/Desktop`;
export const TRASH = `${HOME}/.Trash`;

export { pages };

const README = `Welcome to SkilledScan OS.

Every page of skilledscan.com lives on this desktop as an .html file.
Double-click one to open it in the web browser. Open as many windows as
you like: drag them by the title bar, resize them from any edge, snap
them to the sides of the screen, or double-click a title bar to maximize.

Keyboard
  Ctrl+Alt+T     open a terminal
  Super          toggle the activities overview
  Esc            close menus and overlays

Try in the terminal
  help           list commands
  ls             list files
  open method.html
  neofetch
  calc 2^10 / 4

Files you create or edit are kept in this browser only.
`;

const NOTES = `SkilledScan engagement checklist

[ ] Scope agreed in writing
[ ] Targets and test windows confirmed
[ ] Contacts for urgent findings exchanged
[ ] Report recipients named
`;

function seed(): FsTable {
  const t = 0;
  const table: FsTable = {
    "/": { type: "dir", mtime: t },
    "/home": { type: "dir", mtime: t },
    [HOME]: { type: "dir", mtime: t },
    [DESKTOP]: { type: "dir", mtime: t },
    [`${DESKTOP}/legal`]: { type: "dir", mtime: t },
    [`${HOME}/Documents`]: { type: "dir", mtime: t },
    [`${HOME}/Downloads`]: { type: "dir", mtime: t },
    [TRASH]: { type: "dir", mtime: t },
    "/etc": { type: "dir", mtime: t },
    "/usr": { type: "dir", mtime: t },
    "/usr/share": { type: "dir", mtime: t },
    "/usr/share/applications": { type: "dir", mtime: t },
    [`${DESKTOP}/README.txt`]: { type: "file", kind: "text", content: README, mtime: t },
    [`${HOME}/Documents/engagement-checklist.txt`]: {
      type: "file",
      kind: "text",
      content: NOTES,
      mtime: t,
    },
    "/etc/hostname": { type: "file", kind: "text", content: "skilledscan\n", mtime: t },
    "/etc/os-release": {
      type: "file",
      kind: "text",
      content:
        'NAME="SkilledScan OS"\nVERSION="1.0"\nID=skilledscan\nPRETTY_NAME="SkilledScan OS 1.0"\nHOME_URL="https://skilledscan.com"\n',
      mtime: t,
    },
  };
  for (const p of pages) {
    table[`${DESKTOP}/${p.file}`] = { type: "file", kind: "html", route: p.route, mtime: t };
  }
  const launchers: [string, AppId][] = [
    ["browser", "browser"],
    ["terminal", "terminal"],
    ["calculator", "calculator"],
    ["files", "files"],
    ["text-editor", "editor"],
    ["settings", "settings"],
    ["system-monitor", "monitor"],
  ];
  for (const [name, app] of launchers) {
    table[`/usr/share/applications/${name}.desktop`] = { type: "file", kind: "app", app, mtime: t };
  }
  return table;
}

const STORAGE_KEY = "skilledscan-os:fs:v1";

// Saved desktops predate pages added to the site later (scanner.html).
// Any page with no file anywhere, trash included, is added at its default
// place. A page the visitor deleted permanently therefore comes back on the
// next visit, which is fine for a demo filesystem.
function addMissingPages(saved: FsTable): FsTable {
  const routes = new Set<string>();
  for (const node of Object.values(saved)) {
    if (node.type === "file" && node.kind === "html") routes.add(node.route);
  }
  const next = { ...saved };
  for (const p of pages) {
    if (routes.has(p.route)) continue;
    const path = `${DESKTOP}/${p.file}`;
    const parent = path.slice(0, path.lastIndexOf("/"));
    if (next[parent]?.type === "dir" && !next[path]) {
      next[path] = { type: "file", kind: "html", route: p.route, mtime: Date.now() };
    }
  }
  return next;
}

let table: FsTable = seed();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) table = addMissingPages(JSON.parse(raw) as FsTable);
  } catch {
    // Storage unavailable or corrupt: keep the seeded table.
  }
}

function commit(next: FsTable) {
  table = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
  } catch {
    // Private mode or quota: changes still live for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverTable = seed();

export function useFs(): FsTable {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return table;
    },
    () => serverTable,
  );
}

export function getFs(): FsTable {
  load();
  return table;
}

// ---------- paths ----------

export function normalize(path: string): string {
  const parts: string[] = [];
  for (const seg of path.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

export function resolvePath(cwd: string, input: string): string {
  if (!input || input === "~") return HOME;
  if (input.startsWith("~/")) return normalize(HOME + input.slice(1));
  if (input.startsWith("/")) return normalize(input);
  return normalize(`${cwd}/${input}`);
}

export function dirname(path: string): string {
  const i = path.lastIndexOf("/");
  return i <= 0 ? "/" : path.slice(0, i);
}

export function basename(path: string): string {
  return path === "/" ? "/" : path.slice(path.lastIndexOf("/") + 1);
}

export function prettyPath(path: string): string {
  if (path === HOME) return "~";
  if (path.startsWith(HOME + "/")) return "~" + path.slice(HOME.length);
  return path;
}

export function isWritable(path: string): boolean {
  return path.startsWith(HOME + "/");
}

// ---------- queries ----------

export function stat(path: string): FsNode | undefined {
  return getFs()[path];
}

export type Entry = { name: string; path: string; node: FsNode };

export function list(dir: string, fs: FsTable = getFs(), showHidden = false): Entry[] {
  const prefix = dir === "/" ? "/" : dir + "/";
  const out: Entry[] = [];
  for (const [path, node] of Object.entries(fs)) {
    if (path === dir || !path.startsWith(prefix)) continue;
    const rest = path.slice(prefix.length);
    if (rest.includes("/")) continue;
    if (!showHidden && rest.startsWith(".")) continue;
    out.push({ name: rest, path, node });
  }
  return out.sort((a, b) => {
    if (a.node.type !== b.node.type) return a.node.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function routeToPath(route: string): string | null {
  const page = pages.find((p) => p.route === route);
  return page ? `${DESKTOP}/${page.file}` : null;
}

export function fileForRoute(route: string): string {
  for (const [path, node] of Object.entries(getFs())) {
    if (node.type === "file" && node.kind === "html" && node.route === route && !path.startsWith(TRASH)) {
      return path;
    }
  }
  return routeToPath(route) ?? route;
}

// ---------- mutations ----------

export class FsError extends Error {}

function assertWritable(path: string) {
  if (!isWritable(path)) throw new FsError(`${path}: Permission denied`);
}

function assertParent(path: string) {
  const parent = stat(dirname(path));
  if (!parent) throw new FsError(`${dirname(path)}: No such file or directory`);
  if (parent.type !== "dir") throw new FsError(`${dirname(path)}: Not a directory`);
}

export function mkdir(path: string) {
  assertWritable(path);
  assertParent(path);
  if (stat(path)) throw new FsError(`${basename(path)}: File exists`);
  commit({ ...getFs(), [path]: { type: "dir", mtime: Date.now() } });
}

export function writeFile(path: string, content: string, append = false) {
  assertWritable(path);
  assertParent(path);
  const existing = stat(path);
  if (existing && existing.type === "dir") throw new FsError(`${basename(path)}: Is a directory`);
  if (existing && existing.type === "file" && existing.kind !== "text") {
    throw new FsError(`${basename(path)}: Read-only file`);
  }
  const prev = existing && existing.type === "file" && existing.kind === "text" ? existing.content : "";
  commit({
    ...getFs(),
    [path]: { type: "file", kind: "text", content: append ? prev + content : content, mtime: Date.now() },
  });
}

export function touch(path: string) {
  const existing = stat(path);
  if (existing) {
    assertWritable(path);
    commit({ ...getFs(), [path]: { ...existing, mtime: Date.now() } });
    return;
  }
  writeFile(path, "");
}

export function remove(path: string, recursive = false) {
  assertWritable(path);
  const node = stat(path);
  if (!node) throw new FsError(`${basename(path)}: No such file or directory`);
  if (node.type === "dir" && !recursive) throw new FsError(`${basename(path)}: Is a directory`);
  const next: FsTable = {};
  for (const [p, n] of Object.entries(getFs())) {
    if (p === path || p.startsWith(path + "/")) continue;
    next[p] = n;
  }
  commit(next);
}

export function move(src: string, dst: string) {
  assertWritable(src);
  assertWritable(dst);
  const node = stat(src);
  if (!node) throw new FsError(`${basename(src)}: No such file or directory`);
  const dstNode = stat(dst);
  if (dstNode && dstNode.type === "dir") dst = `${dst}/${basename(src)}`;
  if (dst === src) return;
  if (dst.startsWith(src + "/")) throw new FsError(`cannot move ${basename(src)} into itself`);
  if (stat(dst)) throw new FsError(`${basename(dst)}: File exists`);
  assertParent(dst);
  const next: FsTable = {};
  for (const [p, n] of Object.entries(getFs())) {
    if (p === src || p.startsWith(src + "/")) next[dst + p.slice(src.length)] = n;
    else next[p] = n;
  }
  commit(next);
}

export function copy(src: string, dst: string) {
  assertWritable(dst);
  const node = stat(src);
  if (!node) throw new FsError(`${basename(src)}: No such file or directory`);
  const dstNode = stat(dst);
  if (dstNode && dstNode.type === "dir") dst = `${dst}/${basename(src)}`;
  if (stat(dst)) throw new FsError(`${basename(dst)}: File exists`);
  assertParent(dst);
  const next: FsTable = { ...getFs() };
  for (const [p, n] of Object.entries(getFs())) {
    if (p === src || p.startsWith(src + "/")) next[dst + p.slice(src.length)] = { ...n, mtime: Date.now() };
  }
  commit(next);
}

export function uniqueName(dir: string, base: string): string {
  const fs = getFs();
  if (!fs[`${dir}/${base}`]) return base;
  const dot = base.lastIndexOf(".");
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : "";
  for (let i = 2; ; i++) {
    const candidate = `${stem} (${i})${ext}`;
    if (!fs[`${dir}/${candidate}`]) return candidate;
  }
}

export function trash(path: string) {
  assertWritable(path);
  if (path.startsWith(TRASH + "/")) return remove(path, true);
  const name = uniqueName(TRASH, basename(path));
  const target = `${TRASH}/${name}`;
  move(path, target);
  const node = stat(target);
  if (node) commit({ ...getFs(), [target]: { ...node, trashedFrom: path } });
}

export function restore(trashPath: string) {
  const node = stat(trashPath);
  if (!node) return;
  const original = node.trashedFrom ?? `${HOME}/${basename(trashPath)}`;
  const parent = dirname(original);
  const dest = stat(parent) ? `${parent}/${uniqueName(parent, basename(original))}` : `${HOME}/${basename(original)}`;
  move(trashPath, dest);
  const moved = stat(dest);
  if (moved) {
    const { trashedFrom: _drop, ...rest } = moved;
    void _drop;
    commit({ ...getFs(), [dest]: rest as FsNode });
  }
}

export function emptyTrash() {
  const next: FsTable = {};
  for (const [p, n] of Object.entries(getFs())) {
    if (p.startsWith(TRASH + "/")) continue;
    next[p] = n;
  }
  commit(next);
}

export function resetFs() {
  commit(seed());
}
