"use client";

import { useEffect, useRef, useState } from "react";
import { FsError, HOME, basename, dirname, isWritable, prettyPath, resolvePath, stat, uniqueName, writeFile } from "@/components/desktop/fs";
import { useOS, useWin } from "@/components/desktop/wm";

type Loaded = { text: string; readOnly: boolean; note: string | null; sourceOf?: string };

function load(path: string | null): Loaded {
  if (!path) return { text: "", readOnly: false, note: null };
  const node = stat(path);
  if (!node || node.type !== "file") return { text: "", readOnly: false, note: `${path} does not exist. Saving will create it.` };
  if (node.kind === "text") {
    const writable = isWritable(path);
    return { text: node.content, readOnly: !writable, note: writable ? null : "Read-only system file." };
  }
  if (node.kind === "html") {
    return { text: "Loading source…", readOnly: true, note: `Page source of ${node.route}, read-only.`, sourceOf: node.route };
  }
  const entry = `[Desktop Entry]\nType=Application\nExec=${node.app}\n`;
  return { text: entry, readOnly: true, note: null };
}

export function EditorApp() {
  const os = useOS();
  const win = useWin();
  const [initial] = useState(() => {
    const path = typeof win.props.path === "string" ? win.props.path : null;
    return { path, ...load(path) };
  });
  const [path, setPath] = useState<string | null>(initial.path);
  const [text, setText] = useState(initial.text);
  const [saved, setSaved] = useState(initial.text);
  const [readOnly, setReadOnly] = useState(initial.readOnly);
  const [note, setNote] = useState<string | null>(initial.note);
  const [saveAs, setSaveAs] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // "View Page Source" fetches the rendered page.
  useEffect(() => {
    const route = initial.sourceOf;
    if (!route) return;
    let cancelled = false;
    fetch(`${route}${route.includes("?") ? "&" : "?"}embed=1`)
      .then((r) => r.text())
      .then((src) => {
        if (cancelled) return;
        const pretty = src.replace(/></g, ">\n<");
        setText(pretty);
        setSaved(pretty);
      })
      .catch(() => {
        if (!cancelled) setText("Could not load page source.");
      });
    return () => {
      cancelled = true;
    };
  }, [initial.sourceOf]);

  const dirty = text !== saved && !readOnly;
  const name = path ? basename(path) : "Untitled Document";

  useEffect(() => {
    os.setTitle(win.id, `${dirty ? "• " : ""}${name}${path ? ` (${prettyPath(dirname(path))})` : ""} - Text Editor`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, name, path, win.id]);

  function save(target = path) {
    if (!target) {
      setSaveAs(`${HOME}/Documents/${uniqueName(`${HOME}/Documents`, "Untitled.txt")}`);
      return;
    }
    try {
      writeFile(target, text);
      setSaved(text);
      setReadOnly(false);
      setNote(null);
      if (target !== path) setPath(target);
    } catch (e) {
      setNote(e instanceof FsError ? e.message : "Save failed.");
    }
  }

  function updateCursor() {
    const el = areaRef.current;
    if (!el) return;
    const before = el.value.slice(0, el.selectionStart);
    const lines = before.split("\n");
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  }

  const lineCount = text.split("\n").length;

  return (
    <div
      className="flex h-full flex-col bg-[var(--os-surface)]"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          if (e.shiftKey || readOnly) setSaveAs(path && isWritable(path) ? path : `${HOME}/Documents/${name}`);
          else save();
        }
      }}
    >
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[var(--os-border)] px-2 text-[13px]">
        <button
          type="button"
          className="os-pill"
          onClick={() => os.open("editor")}
        >
          New
        </button>
        <button type="button" className="os-pill" onClick={() => os.open("files", { path: path ? dirname(path) : `${HOME}/Documents` })}>
          Open…
        </button>
        <button type="button" className="os-pill os-pill-accent" disabled={readOnly ? false : !dirty && !!path} onClick={() => (readOnly ? setSaveAs(`${HOME}/Documents/${name}`) : save())}>
          {readOnly ? "Save a copy" : "Save"}
        </button>
        <span className="ml-2 truncate text-[12px] text-[var(--os-muted)]">{note}</span>
      </div>
      {saveAs !== null ? (
        <form
          className="flex shrink-0 items-center gap-2 border-b border-[var(--os-border)] bg-black/20 px-3 py-2 text-[13px]"
          onSubmit={(e) => {
            e.preventDefault();
            const target = resolvePath(HOME, saveAs);
            setSaveAs(null);
            save(target);
          }}
        >
          <label htmlFor={`${win.id}-saveas`} className="text-[var(--os-muted)]">
            Save as
          </label>
          <input
            id={`${win.id}-saveas`}
            autoFocus
            value={saveAs}
            onChange={(e) => setSaveAs(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setSaveAs(null)}
            className="os-input min-w-0 flex-1 font-[family-name:var(--font-mono)] text-[12.5px]"
          />
          <button type="submit" className="os-pill os-pill-accent">
            Save
          </button>
          <button type="button" className="os-pill" onClick={() => setSaveAs(null)}>
            Cancel
          </button>
        </form>
      ) : null}
      <div className="flex min-h-0 flex-1 overflow-auto font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]">
        <div aria-hidden className="sticky left-0 select-none border-r border-[var(--os-border)] bg-black/15 px-2 py-2 text-right text-[var(--os-muted)]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={areaRef}
          data-autofocus
          value={text}
          readOnly={readOnly}
          onChange={(e) => setText(e.target.value)}
          onSelect={updateCursor}
          onKeyUp={updateCursor}
          onClick={updateCursor}
          spellCheck={false}
          wrap="off"
          aria-label="Document"
          className="min-h-full flex-1 resize-none bg-transparent px-3 py-2 text-[var(--os-fg)] outline-none"
          style={{ height: `${lineCount * 1.6 + 1}em` }}
        />
      </div>
      <div className="flex h-7 shrink-0 items-center justify-end gap-4 border-t border-[var(--os-border)] px-3 text-[11.5px] text-[var(--os-muted)]">
        <span>{readOnly ? "Read-only" : dirty ? "Modified" : "Saved"}</span>
        <span>Plain Text</span>
        <span>
          Ln {cursor.line}, Col {cursor.col}
        </span>
      </div>
    </div>
  );
}
