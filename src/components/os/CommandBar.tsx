"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { osApps, osLegalApps } from "@/components/os/osConfig";

const allApps = [...osApps, ...osLegalApps];

type LogLine = { id: number; text: string; kind: "input" | "output" };

function helpText(): string[] {
  return [
    "available commands:",
    `  ${allApps.map((a) => a.slug).join(", ")}`,
    "  help        show this message",
    "  clear       clear the log",
    "  whoami      about this site",
  ];
}

export function CommandBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogLine[]>([]);
  const [open, setOpen] = useState(false);
  const idRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "end" });
  }, [log]);

  function push(text: string, kind: LogLine["kind"]) {
    idRef.current += 1;
    setLog((l) => [...l.slice(-20), { id: idRef.current, text, kind }]);
  }

  function runCommand(raw: string) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    push(`> ${raw}`, "input");

    if (command === "clear") {
      setLog([]);
      return;
    }
    if (command === "help") {
      helpText().forEach((line) => push(line, "output"));
      return;
    }
    if (command === "whoami") {
      push("SkilledScan: governed penetration testing, verified by hand.", "output");
      return;
    }

    const match = allApps.find((a) => a.slug === command || a.keywords.includes(command));
    if (match) {
      push(`navigating to ${match.href}`, "output");
      router.push(match.href);
      setOpen(false);
      return;
    }

    push(`command not found: ${raw}. type "help" for a list.`, "output");
  }

  return (
    <div className="glass flex flex-col rounded-[var(--radius-xs)]">
      {open && log.length > 0 ? (
        <div className="max-h-40 overflow-y-auto border-b border-white/10 px-4 py-3">
          {log.map((line) => (
            <p
              key={line.id}
              className={`font-[family-name:var(--font-mono)] text-[12px] ${
                line.kind === "input" ? "text-ink" : "text-ink-soft"
              }`}
            >
              {line.text}
            </p>
          ))}
          <div ref={logEndRef} />
        </div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCommand(value);
          setValue("");
        }}
        className="flex items-center gap-3 px-4 py-3"
      >
        <span aria-hidden="true" className="font-[family-name:var(--font-mono)] text-[13px] text-accent-text">
          {">"}
        </span>
        <label htmlFor="os-command-input" className="sr-only">
          Command input. Type a page name and press enter to navigate, or &quot;help&quot; for commands.
        </label>
        <input
          id="os-command-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="type a page name or &quot;help&quot;, then press enter..."
          autoComplete="off"
          className="w-full bg-transparent font-[family-name:var(--font-mono)] text-[13px] text-ink placeholder:text-ink-soft/60 focus:outline-none"
        />
      </form>
    </div>
  );
}
