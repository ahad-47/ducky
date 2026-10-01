"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { osApps, osLegalApps } from "@/components/os/osConfig";
import { facts } from "@/content/facts";

const allApps = [...osApps, ...osLegalApps];
const PROMPT = "guest@skilledscan:~$";

type LogLine = { id: number; text: string; kind: "input" | "output" };

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
    { id: -1, text: `SkilledScan OS v1.0.0. Type "help" to get started.`, kind: "output" },
  ]);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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

  function push(text: string, kind: LogLine["kind"]) {
    idRef.current += 1;
    setLog((l) => [...l, { id: idRef.current, text, kind }]);
  }

  function runCommand(raw: string) {
    const command = raw.trim().toLowerCase();
    push(`${PROMPT} ${raw}`, "input");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-sm)] border border-white/10 bg-[#0a0e16] shadow-2xl"
        style={{ height: "60vh", maxHeight: 520 }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="h-3 w-3 rounded-full bg-[#ff5f57]"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-[family-name:var(--font-mono)] text-[12px] text-ink-soft">
            {PROMPT.replace("$", "")}
          </span>
        </div>

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
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent text-ink caret-accent-text focus:outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
