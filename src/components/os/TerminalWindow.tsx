"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { osApps, osLegalApps } from "@/components/os/osConfig";
import { facts } from "@/content/facts";

const allApps = [...osApps, ...osLegalApps];
const PROMPT = "guest@skilledscan:~$";
const DEFAULT_SIZE = { width: 640, height: 420 };
const MIN_SIZE = { width: 360, height: 220 };

type LogLine = { text: string; kind: "input" | "output" };

function helpText(): string[] {
  return [
    "available commands:",
    `  ${allApps.map((a) => a.slug).join(", ")}`,
    "  ls          list available pages",
    "  pwd         show the current path",
    "  whoami      about this site",
    "  date        show the current date and time",
    "  clear       clear the terminal",
    "  exit        close the terminal",
    "  help        show this message",
  ];
}

export function TerminalWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogLine[]>([
    { text: `SkilledScan OS v1.0.0. Type "help" to get started.`, kind: "output" },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  );
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !minimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, minimized]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [log]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [isOpen, onClose]);

  // Dragging the title bar.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy });
    }
    function onUp() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Resizing from the bottom-right corner.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!resizeRef.current) return;
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      setSize({
        width: Math.max(MIN_SIZE.width, resizeRef.current.startW + dx),
        height: Math.max(MIN_SIZE.height, resizeRef.current.startH + dy),
      });
    }
    function onUp() {
      resizeRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  function startDrag(e: React.PointerEvent) {
    if (maximized) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: position.x, originY: position.y };
  }

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    if (maximized) return;
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.width, startH: size.height };
  }

  function push(text: string, kind: LogLine["kind"]) {
    setLog((l) => [...l, { text, kind }]);
  }

  function runCommand(raw: string) {
    const command = raw.trim().toLowerCase();
    push(`${PROMPT} ${raw}`, "input");
    if (raw.trim()) {
      setHistory((h) => [...h, raw]);
    }
    setHistoryIndex(null);
    if (!command) return;

    if (command === "clear") {
      setLog([]);
      return;
    }
    if (command === "exit") {
      onClose();
      return;
    }
    if (command === "help") {
      helpText().forEach((line) => push(line, "output"));
      return;
    }
    if (command === "pwd") {
      push(window.location.pathname === "/" ? "/home" : window.location.pathname, "output");
      return;
    }
    if (command === "ls") {
      push(allApps.map((a) => a.slug).join("  "), "output");
      return;
    }
    if (command === "date") {
      push(new Date().toString(), "output");
      return;
    }
    if (command === "whoami") {
      push(facts.brand.oneLiner, "output");
      return;
    }

    const match = allApps.find((a) => a.slug === command || a.keywords.includes(command));
    if (match) {
      push(`navigating to ${match.href || "/"}...`, "output");
      router.push(match.href || "/");
      return;
    }

    push(`command not found: ${raw}. type "help" for a list.`, "output");
  }

  function onInputKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex]);
      }
    }
  }

  if (!isOpen) return null;

  const windowStyle: React.CSSProperties = maximized
    ? { top: 16, left: 16, right: 16, bottom: 16, width: "auto", height: "auto" }
    : {
        top: "50%",
        left: "50%",
        width: size.width,
        height: minimized ? "auto" : size.height,
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      };

  return (
    <div className={`fixed inset-0 z-[90] ${minimized ? "pointer-events-none" : ""}`}>
      {!minimized ? (
        <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      ) : null}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="pointer-events-auto absolute flex flex-col overflow-hidden rounded-[var(--radius-sm)] border border-white/10 bg-[#0a0e16] shadow-2xl"
        style={windowStyle}
      >
        <div
          onPointerDown={startDrag}
          className="flex shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3 active:cursor-grabbing"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="h-3 w-3 rounded-full bg-[#ff5f57]"
          />
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? "Restore terminal" : "Minimize terminal"}
            className="h-3 w-3 rounded-full bg-[#febc2e]"
          />
          <button
            type="button"
            onClick={() => {
              setMaximized((v) => !v);
              setMinimized(false);
            }}
            aria-label={maximized ? "Restore terminal" : "Maximize terminal"}
            className="h-3 w-3 rounded-full bg-[#28c840]"
          />
          <span className="ml-3 select-none font-[family-name:var(--font-mono)] text-[12px] text-ink-soft">
            {PROMPT.replace("$", "")}
          </span>
        </div>

        {!minimized ? (
          <>
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed"
            >
              {log.map((line, index) => (
                <p
                  key={index}
                  className={`whitespace-pre-wrap ${line.kind === "input" ? "text-ink" : "text-ink-soft"}`}
                >
                  {line.text}
                </p>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runCommand(value);
                  setValue("");
                }}
                className="flex items-center gap-2"
              >
                <span aria-hidden="true" className="text-accent-text">
                  {PROMPT}
                </span>
                <label htmlFor="terminal-input" className="sr-only">
                  Terminal command input
                </label>
                <input
                  ref={inputRef}
                  id="terminal-input"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onInputKeydown}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent text-ink caret-accent-text focus:outline-none"
                />
              </form>
            </div>

            {!maximized ? (
              <div
                onPointerDown={startResize}
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0 50%, rgba(255,255,255,.25) 50% 60%, transparent 60% 70%, rgba(255,255,255,.25) 70% 80%, transparent 80%)",
                }}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
