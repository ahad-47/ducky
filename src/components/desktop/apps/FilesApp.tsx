"use client";

import { useEffect, useState } from "react";
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
  prettyPath,
  restore,
  trash,
  uniqueName,
  useFs,
  writeFile,
} from "@/components/desktop/fs";
import { FileIcon, Glyph, HomeIcon, TrashIcon } from "@/components/desktop/icons";
import { useOS, useWin } from "@/components/desktop/wm";

const places = [
  { label: "Home", path: HOME },
  { label: "Desktop", path: DESKTOP },
  { label: "Documents", path: `${HOME}/Documents` },
  { label: "Downloads", path: `${HOME}/Downloads` },
  { label: "Trash", path: TRASH },
  { label: "Computer", path: "/" },
];

export function FilesApp() {
  const os = useOS();
  const win = useWin();
  const fs = useFs();
  const start = typeof win.props.path === "string" && fs[win.props.path]?.type === "dir" ? win.props.path : HOME;
  const [nav, setNav] = useState({ stack: [start], index: 0 });
  // Fall back to Home if the open folder was deleted out from under us.
  const cwd = fs[nav.stack[nav.index]]?.type === "dir" ? nav.stack[nav.index] : HOME;
  const [selected, setSelected] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ path: string; value: string } | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const entries = list(cwd, fs);
  const inTrash = cwd === TRASH;
  const writable = isWritable(cwd) || cwd === HOME;

  useEffect(() => {
    os.setTitle(win.id, cwd === TRASH ? "Trash" : cwd === HOME ? "Home" : basename(cwd) || "Computer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cwd, win.id]);

  function go(path: string) {
    setSelected(null);
    setRenaming(null);
    setNav((n) => ({ stack: [...n.stack.slice(0, n.index + 1), path], index: n.index + 1 }));
  }

  function attempt(fn: () => void) {
    try {
      fn();
      setError(null);
    } catch (e) {
      setError(e instanceof FsError ? e.message : "Operation failed");
    }
  }

  function open(path: string) {
    const node = fs[path];
    if (!node) return;
    if (node.type === "dir") go(path);
    else os.openPath(path);
  }

  function commitRename() {
    if (!renaming) return;
    const value = renaming.value.trim();
    const from = renaming.path;
    setRenaming(null);
    if (!value || value === basename(from)) return;
    if (value.includes("/")) return setError("Names cannot contain “/”");
    attempt(() => move(from, `${dirname(from)}/${value}`));
  }

  function itemMenu(e: React.MouseEvent, path: string) {
    e.preventDefault();
    e.stopPropagation();
    setSelected(path);
    const node = fs[path];
    const canWrite = isWritable(path);
    const items: MenuItem[] = inTrash
      ? [
          { label: "Restore From Trash", onClick: () => attempt(() => restore(path)) },
          { label: "Delete Permanently", danger: true, onClick: () => attempt(() => trash(path)) },
        ]
      : [
          { label: node?.type === "dir" ? "Open" : "Open", onClick: () => open(path) },
          ...(node?.type === "file" && node.kind === "html"
            ? [
                { label: "Open in New Window", onClick: () => os.openPath(path) },
                { label: "View Page Source", onClick: () => os.openPath(path, { with: "editor" }) },
              ]
            : []),
          ...(node?.type === "file" && node.kind === "text"
            ? [{ label: "Open With Text Editor", onClick: () => os.openPath(path, { with: "editor" }) }]
            : []),
          ...(node?.type === "dir" ? [{ label: "Open in Terminal", onClick: () => os.open("terminal", { cwd: path }) }] : []),
          { separator: true },
          { label: "Rename…", disabled: !canWrite, onClick: () => setRenaming({ path, value: basename(path) }) },
          { label: "Move to Trash", disabled: !canWrite, danger: true, onClick: () => attempt(() => trash(path)) },
        ];
    setMenu({ x: e.clientX, y: e.clientY, items });
  }

  function backgroundMenu(e: React.MouseEvent) {
    e.preventDefault();
    setSelected(null);
    const items: MenuItem[] = inTrash
      ? [{ label: "Empty Trash", danger: true, disabled: !entries.length, onClick: () => emptyTrash() }]
      : [
          {
            label: "New Folder",
            disabled: !writable,
            onClick: () =>
              attempt(() => {
                const name = uniqueName(cwd, "New Folder");
                mkdir(`${cwd}/${name}`);
                setRenaming({ path: `${cwd}/${name}`, value: name });
              }),
          },
          {
            label: "New Document",
            disabled: !writable,
            onClick: () =>
              attempt(() => {
                const name = uniqueName(cwd, "Untitled Document.txt");
                writeFile(`${cwd}/${name}`, "");
                setRenaming({ path: `${cwd}/${name}`, value: name });
              }),
          },
          { separator: true },
          { label: "Open in Terminal", onClick: () => os.open("terminal", { cwd }) },
        ];
    setMenu({ x: e.clientX, y: e.clientY, items });
  }

  const crumbs: string[] = [];
  if (cwd.startsWith(HOME)) {
    crumbs.push(HOME);
    let acc = HOME;
    for (const seg of cwd.slice(HOME.length).split("/").filter(Boolean)) crumbs.push((acc = `${acc}/${seg}`));
  } else {
    crumbs.push("/");
    let acc = "";
    for (const seg of cwd.split("/").filter(Boolean)) crumbs.push((acc = `${acc}/${seg}`));
  }

  return (
    <div
      className="flex h-full bg-[var(--os-surface)] text-[13px]"
      onKeyDown={(e) => {
        if (renaming) return;
        if (e.key === "Enter" && selected) open(selected);
        else if (e.key === "Delete" && selected && isWritable(selected)) attempt(() => trash(selected));
        else if (e.key === "F2" && selected && isWritable(selected)) setRenaming({ path: selected, value: basename(selected) });
        else if (e.key === "Backspace" && cwd !== "/") go(dirname(cwd));
      }}
    >
      <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-[var(--os-border)] bg-black/15 p-2 sm:flex">
        {places.map((p) => (
          <button
            key={p.path}
            type="button"
            onClick={() => go(p.path)}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left ${cwd === p.path ? "bg-[var(--os-accent-soft)] text-[var(--os-fg)]" : "text-[var(--os-muted)] hover:bg-white/5"}`}
          >
            {p.path === TRASH ? <TrashIcon size={18} /> : p.path === HOME ? <HomeIcon size={18} /> : <FileIcon node={{ type: "dir", mtime: 0 }} name={p.label} size={18} />}
            {p.label}
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center gap-1 border-b border-[var(--os-border)] px-2">
          <button type="button" className="os-tbtn" aria-label="Back" disabled={nav.index === 0} onClick={() => setNav((n) => ({ ...n, index: n.index - 1 }))}>
            <Glyph.Back className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="os-tbtn"
            aria-label="Forward"
            disabled={nav.index >= nav.stack.length - 1}
            onClick={() => setNav((n) => ({ ...n, index: n.index + 1 }))}
          >
            <Glyph.Forward className="h-4 w-4" />
          </button>
          <button type="button" className="os-tbtn" aria-label="Up" disabled={cwd === "/"} onClick={() => go(dirname(cwd))}>
            <Glyph.Up className="h-4 w-4" />
          </button>
          <nav aria-label="Path" className="ml-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto rounded-md bg-black/20 px-1 py-1">
            {crumbs.map((c, i) => (
              <span key={c} className="flex shrink-0 items-center">
                {i > 0 ? <span className="px-0.5 text-[var(--os-muted)]">/</span> : null}
                <button
                  type="button"
                  onClick={() => go(c)}
                  className={`rounded px-1.5 py-0.5 hover:bg-white/10 ${c === cwd ? "font-semibold text-[var(--os-fg)]" : "text-[var(--os-muted)]"}`}
                >
                  {c === HOME ? "Home" : c === "/" ? "Computer" : basename(c)}
                </button>
              </span>
            ))}
          </nav>
          {inTrash && entries.length ? (
            <button type="button" className="os-pill ml-1" onClick={() => emptyTrash()}>
              Empty
            </button>
          ) : null}
        </div>
        {error ? (
          <div className="flex items-center justify-between bg-[#5a1d1d] px-3 py-1.5 text-[12.5px] text-[#ffd6d6]">
            {error}
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
              <Glyph.Close className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
        <div
          className="min-h-0 flex-1 overflow-y-auto p-3 outline-none"
          tabIndex={0}
          data-autofocus
          onClick={() => setSelected(null)}
          onContextMenu={backgroundMenu}
        >
          {entries.length === 0 ? (
            <p className="mt-16 text-center text-[var(--os-muted)]">{inTrash ? "Trash is empty" : "Folder is empty"}</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-1">
              {entries.map((e) => (
                <div
                  key={e.path}
                  role="button"
                  tabIndex={-1}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelected(e.path);
                  }}
                  onDoubleClick={() => open(e.path)}
                  onContextMenu={(ev) => itemMenu(ev, e.path)}
                  className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center ${selected === e.path ? "bg-[var(--os-accent-soft)]" : "hover:bg-white/5"}`}
                  title={prettyPath(e.path)}
                >
                  <FileIcon node={e.node} name={e.name} size={52} />
                  {renaming?.path === e.path ? (
                    <input
                      autoFocus
                      value={renaming.value}
                      onChange={(ev) => setRenaming({ ...renaming, value: ev.target.value })}
                      onBlur={commitRename}
                      onKeyDown={(ev) => {
                        ev.stopPropagation();
                        if (ev.key === "Enter") commitRename();
                        if (ev.key === "Escape") setRenaming(null);
                      }}
                      onFocus={(ev) => {
                        const dot = ev.target.value.lastIndexOf(".");
                        ev.target.setSelectionRange(0, dot > 0 ? dot : ev.target.value.length);
                      }}
                      className="os-input w-full text-center text-[12px]"
                    />
                  ) : (
                    <span className="line-clamp-2 break-all text-[12px] leading-tight text-[var(--os-fg)]">{e.name}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex h-7 shrink-0 items-center border-t border-[var(--os-border)] px-3 text-[11.5px] text-[var(--os-muted)]">
          {selected ? `“${basename(selected)}” selected` : `${entries.length} item${entries.length === 1 ? "" : "s"}`}
          <span className="ml-auto font-[family-name:var(--font-mono)]">{prettyPath(cwd)}</span>
        </div>
      </div>
      {menu ? <ContextMenu {...menu} onClose={() => setMenu(null)} /> : null}
    </div>
  );
}
