"use client";

import { useEffect, useRef, useState } from "react";
import { apps, type AppId } from "@/components/desktop/apps/registry";
import { evaluate, formatNumber } from "@/components/desktop/calc";
import {
  FsError,
  HOME,
  basename,
  copy,
  getFs,
  list,
  mkdir,
  move,
  prettyPath,
  remove,
  resolvePath,
  stat,
  touch,
  trash,
  writeFile,
  type FsNode,
} from "@/components/desktop/fs";
import { useOS, useWin, type OS } from "@/components/desktop/wm";
import { facts } from "@/content/facts";

type Line = { kind: "prompt"; cwd: string; text: string } | { kind: "out" | "err" | "info"; text: string };

const USER = "guest";
const HOST = "skilledscan";

const commandHelp: [string, string][] = [
  ["help", "show this list"],
  ["ls [-la] [dir]", "list directory contents"],
  ["cd [dir]", "change directory"],
  ["pwd", "print working directory"],
  ["cat <file>", "print a file"],
  ["open <file|app>", "open a file or app (also xdg-open)"],
  ["browser [page.html]", "open the web browser"],
  ["files [dir]", "open the file manager"],
  ["gedit <file>", "edit a file (also nano, vim)"],
  ["calc <expr>", "evaluate math, e.g. calc 2^10 / 4"],
  ["echo <text> [> file]", "print text, or write it to a file"],
  ["touch / mkdir", "create a file / directory"],
  ["rm [-r] / mv / cp", "remove, move, copy"],
  ["tree [dir]", "show a directory tree"],
  ["ps / kill <pid>", "list / close running windows"],
  ["neofetch", "system information"],
  ["whoami, hostname, uname, date, uptime", ""],
  ["history, clear, exit", ""],
  ["reboot, poweroff", "power actions"],
];

function splitArgs(input: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quote: string | null = null;
  let has = false;
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (/\s/.test(ch)) {
      if (cur || has) out.push(cur);
      cur = "";
      has = false;
    } else cur += ch;
  }
  if (cur || has) out.push(cur);
  return out;
}

function fmtDate(ms: number) {
  const d = new Date(ms || Date.UTC(2026, 0, 1));
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

function sizeOf(node: FsNode): number {
  if (node.type === "dir") return 4096;
  if (node.kind === "text") return new Blob([node.content]).size;
  return node.kind === "html" ? 18432 : 312;
}

function fmtUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${String(m).padStart(2, "0")}` : `${m} min`;
}

const appCommands: Record<string, AppId> = {
  browser: "browser",
  firefox: "browser",
  web: "browser",
  files: "files",
  nautilus: "files",
  gedit: "editor",
  nano: "editor",
  vim: "editor",
  vi: "editor",
  edit: "editor",
  "gnome-text-editor": "editor",
  calculator: "calculator",
  "gnome-calculator": "calculator",
  top: "monitor",
  htop: "monitor",
  "gnome-system-monitor": "monitor",
  settings: "settings",
  "gnome-control-center": "settings",
  terminal: "terminal",
  "gnome-terminal": "terminal",
};

type Ctx = { cwd: string; setCwd: (c: string) => void; os: OS; winId: string; history: string[]; clear: () => void };

function run(argv: string[], ctx: Ctx, stdin?: string): { out: string[]; err?: boolean } {
  const [cmd, ...args] = argv;
  const flags = new Set(args.filter((a) => a.startsWith("-") && a.length > 1).flatMap((a) => a.slice(1).split("")));
  const operands = args.filter((a) => !(a.startsWith("-") && a.length > 1));
  const p = (x: string) => resolvePath(ctx.cwd, x);
  const ok = (...out: string[]) => ({ out });
  const fail = (...out: string[]) => ({ out, err: true });

  switch (cmd) {
    case "help":
      return ok(
        "SkilledScan shell. Commands:",
        ...commandHelp.map(([c, d]) => (d ? `  ${c.padEnd(26)} ${d}` : `  ${c}`)),
      );
    case "pwd":
      return ok(ctx.cwd);
    case "whoami":
      return ok(USER);
    case "hostname":
      return ok(HOST);
    case "uname":
      return ok(flags.has("a") ? `SkilledScan 1.0.0-web #1 SMP ${HOST} ${navigator.platform || "web"} GNU/Linux` : "SkilledScan");
    case "date":
      return ok(new Date().toString());
    case "uptime":
      return ok(
        ` ${new Date().toLocaleTimeString("en-US", { hour12: false })} up ${fmtUptime(Date.now() - ctx.os.bootedAt)},  1 user,  ${ctx.os.wins.length} windows`,
      );
    case "echo":
      return ok(stdin ?? operands.join(" "));
    case "clear":
      ctx.clear();
      return ok();
    case "history":
      return ok(...ctx.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`));
    case "cd": {
      const target = p(operands[0] ?? "~");
      const node = stat(target);
      if (!node) return fail(`cd: ${operands[0]}: No such file or directory`);
      if (node.type !== "dir") return fail(`cd: ${operands[0]}: Not a directory`);
      ctx.setCwd(target);
      return ok();
    }
    case "ls":
    case "dir":
    case "ll": {
      const long = flags.has("l") || cmd === "ll";
      const all = flags.has("a") || cmd === "ll";
      const targets = operands.length ? operands : ["."];
      const out: string[] = [];
      for (const t of targets) {
        const path = p(t);
        const node = stat(path);
        if (!node) {
          out.push(`ls: cannot access '${t}': No such file or directory`);
          continue;
        }
        const entries = node.type === "dir" ? list(path, getFs(), all) : [{ name: t, path, node }];
        if (targets.length > 1 && node.type === "dir") out.push(`${t}:`);
        if (long) {
          out.push(`total ${entries.length}`);
          for (const e of entries) {
            const perm = e.node.type === "dir" ? "drwxr-xr-x" : e.path.startsWith(HOME) ? "-rw-r--r--" : "-r--r--r--";
            const owner = e.path.startsWith(HOME) ? USER : "root";
            out.push(
              `${perm} 1 ${owner.padEnd(5)} ${owner.padEnd(5)} ${String(sizeOf(e.node)).padStart(6)} ${fmtDate(e.node.mtime)} ${decorate(e.name, e.node)}`,
            );
          }
        } else if (entries.length) {
          out.push(entries.map((e) => decorate(e.name, e.node)).join("  "));
        }
      }
      return { out, err: out.some((l) => l.startsWith("ls:")) };
    }
    case "tree": {
      const root = p(operands[0] ?? ".");
      if (stat(root)?.type !== "dir") return fail(`tree: ${operands[0] ?? "."}: not a directory`);
      const out = [operands[0] ?? "."];
      let dirs = 0;
      let files = 0;
      const walk = (dir: string, prefix: string) => {
        const entries = list(dir);
        entries.forEach((e, i) => {
          const last = i === entries.length - 1;
          out.push(`${prefix}${last ? "└── " : "├── "}${decorate(e.name, e.node)}`);
          if (e.node.type === "dir") {
            dirs++;
            walk(e.path, prefix + (last ? "    " : "│   "));
          } else files++;
        });
      };
      walk(root, "");
      out.push("", `${dirs} directories, ${files} files`);
      return ok(...out);
    }
    case "cat":
    case "less":
    case "more": {
      if (!operands.length) return fail(`${cmd}: missing file operand`);
      const out: string[] = [];
      for (const t of operands) {
        const node = stat(p(t));
        if (!node) return fail(`${cmd}: ${t}: No such file or directory`);
        if (node.type === "dir") return fail(`${cmd}: ${t}: Is a directory`);
        if (node.kind === "text") out.push(...node.content.replace(/\n$/, "").split("\n"));
        else if (node.kind === "html")
          out.push(`<!-- ${basename(p(t))}: page ${node.route} -->`, `<!-- open it with: open ${t} -->`);
        else out.push("[Desktop Entry]", `Name=${apps[node.app].name}`, `Exec=${apps[node.app].command}`, "Type=Application");
      }
      return ok(...out);
    }
    case "touch":
    case "mkdir":
    case "rm":
    case "rmdir": {
      if (!operands.length) return fail(`${cmd}: missing operand`);
      for (const t of operands) {
        if (cmd === "touch") touch(p(t));
        else if (cmd === "mkdir") mkdir(p(t));
        else if (cmd === "rmdir") {
          if (list(p(t), getFs(), true).length) return fail(`rmdir: failed to remove '${t}': Directory not empty`);
          remove(p(t), true);
        } else remove(p(t), flags.has("r") || flags.has("R"));
      }
      return ok();
    }
    case "trash":
    case "gio":
      for (const t of operands.filter((o) => o !== "trash")) trash(p(t));
      return ok();
    case "mv":
    case "cp": {
      if (operands.length < 2) return fail(`${cmd}: missing destination file operand`);
      const dst = p(operands[operands.length - 1]);
      for (const s of operands.slice(0, -1)) (cmd === "mv" ? move : copy)(p(s), dst);
      return ok();
    }
    case "calc":
    case "bc":
    case "expr": {
      const src = stdin ?? operands.join(" ");
      if (!src) return fail(`${cmd}: usage: ${cmd} <expression>`);
      try {
        return ok(formatNumber(evaluate(src)));
      } catch (e) {
        return fail(`${cmd}: ${(e as Error).message}`);
      }
    }
    case "open":
    case "xdg-open":
    case "gio-open": {
      if (!operands.length) return fail(`${cmd}: missing file operand`);
      for (const t of operands) {
        if (appCommands[t]) {
          ctx.os.open(appCommands[t]);
          continue;
        }
        if (/^https?:\/\//.test(t)) {
          window.open(t, "_blank", "noopener,noreferrer");
          continue;
        }
        const path = p(t);
        if (!stat(path)) return fail(`${cmd}: ${t}: No such file or directory`);
        ctx.os.openPath(path);
      }
      return ok();
    }
    case "ps": {
      const rows = [
        "    PID TTY          TIME CMD",
        "      1 ?        00:00:01 systemd",
        "    412 ?        00:00:00 gnome-shell",
        ...ctx.os.wins.map((w) => {
          const secs = Math.floor((Date.now() - w.startedAt) / 1000);
          const time = `00:${String(Math.floor(secs / 60) % 60).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
          return `${String(w.pid).padStart(7)} pts/0    ${time} ${apps[w.app].command}${w.app === "browser" ? `  [${w.title}]` : ""}`;
        }),
      ];
      return ok(...rows);
    }
    case "kill":
    case "pkill":
    case "killall": {
      if (!operands.length) return fail(`${cmd}: usage: ${cmd} <pid|name>`);
      for (const t of operands) {
        const pid = Number(t);
        if (pid === 1 || pid === 412) return fail(`${cmd}: (${t}) - Operation not permitted`);
        const targets = ctx.os.wins.filter((w) =>
          Number.isFinite(pid) ? w.pid === pid : apps[w.app].command === t || w.app === appCommands[t],
        );
        if (!targets.length) return fail(`${cmd}: (${t}) - No such process`);
        targets.forEach((w) => ctx.os.close(w.id));
      }
      return ok();
    }
    case "neofetch":
    case "fastfetch": {
      const cores = navigator.hardwareConcurrency;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const logo = [
        "   _____ __   ____",
        "  / ___// /__/ __/",
        "  \\__ \\/ //_/\\ \\  ",
        " ___/ / ,< ___/ / ",
        "/____/_/|_/____/  ",
        "                  ",
        "                  ",
        "                  ",
        "                  ",
        "                  ",
      ];
      const info = [
        `${USER}@${HOST}`,
        "-".repeat(USER.length + HOST.length + 1),
        "OS: SkilledScan OS 1.0",
        `Kernel: 1.0.0-web`,
        `Uptime: ${fmtUptime(Date.now() - ctx.os.bootedAt)}`,
        "Shell: sksh 1.0",
        `Resolution: ${window.screen.width}x${window.screen.height}`,
        "DE: SkilledScan Desktop",
        `CPU: ${cores ? `${cores} logical cores` : "unknown"}`,
        `Memory: ${mem ? `${mem} GiB (reported by browser)` : "not exposed by this browser"}`,
      ];
      return ok(...logo.map((l, i) => `${l}   ${info[i] ?? ""}`), "", `${facts.brand.oneLiner}`);
    }
    case "which": {
      return ok(...operands.map((o) => (appCommands[o] || commandNames.includes(o) ? `/usr/bin/${o}` : `${o} not found`)));
    }
    case "man":
      return ok(`No manual entry for ${operands[0] ?? "nothing"}. Try "help".`);
    case "sudo":
      return fail(`${USER} is not in the sudoers file.  This incident will be reported.`);
    case "exit":
    case "logout":
      ctx.os.close(ctx.winId);
      return ok();
    case "reboot":
      ctx.os.power("boot");
      return ok();
    case "poweroff":
    case "shutdown":
    case "halt":
      ctx.os.power("off");
      return ok();
    case "lock":
      ctx.os.power("locked");
      return ok();
    default:
      if (appCommands[cmd]) {
        const app = appCommands[cmd];
        if (operands.length && (app === "editor" || app === "browser" || app === "files")) {
          const path = p(operands[0]);
          if (app === "editor" && !stat(path)) writeFile(path, "");
          if (!stat(path)) return fail(`${cmd}: ${operands[0]}: No such file or directory`);
          ctx.os.openPath(path, { with: app });
        } else ctx.os.open(app);
        return ok();
      }
      return fail(`${cmd}: command not found`);
  }
}

const commandNames = [
  "help", "pwd", "whoami", "hostname", "uname", "date", "uptime", "echo", "clear", "history", "cd", "ls", "tree",
  "cat", "touch", "mkdir", "rm", "rmdir", "mv", "cp", "calc", "bc", "open", "xdg-open", "ps", "kill", "neofetch",
  "which", "man", "sudo", "exit", "reboot", "poweroff", "lock", ...Object.keys(appCommands),
];

function decorate(name: string, node: FsNode) {
  return node.type === "dir" ? `${name}/` : name;
}

export function TerminalApp() {
  const os = useOS();
  const win = useWin();
  const initialCwd = typeof win.props.cwd === "string" && stat(win.props.cwd)?.type === "dir" ? win.props.cwd : `${HOME}/Desktop`;
  const [cwd, setCwd] = useState<string>(initialCwd);
  const [lines, setLines] = useState<Line[]>([
    { kind: "info", text: `SkilledScan OS 1.0 (tty${win.pid % 7})` },
    { kind: "info", text: 'Type "help" for commands. Every page of the site is an .html file in ~/Desktop.' },
    { kind: "info", text: "" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    os.setTitle(win.id, `${USER}@${HOST}: ${prettyPath(cwd)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cwd, win.id]);

  function execute(raw: string) {
    const input = raw.trim();
    const out: Line[] = [{ kind: "prompt", cwd, text: raw }];
    const nextHistory = input ? [...history, input] : history;
    if (input) setHistory(nextHistory);
    setHIndex(null);
    let cleared = false;
    let dir = cwd;

    for (const part of input.split(/\s*(?:;|&&)\s*/).filter(Boolean)) {
      // Output redirection: cmd > file, cmd >> file
      const m = part.match(/^(.*?)\s*(>>?)\s*(\S+)$/);
      const body = m ? m[1] : part;
      const argv = splitArgs(body);
      if (!argv.length) continue;
      const ctx: Ctx = {
        cwd: dir,
        setCwd: (c) => (dir = c),
        os,
        winId: win.id,
        history: nextHistory,
        clear: () => (cleared = true),
      };
      let result: { out: string[]; err?: boolean };
      try {
        result = run(argv, ctx);
      } catch (e) {
        result = { out: [`${argv[0]}: ${e instanceof FsError ? e.message : "error"}`], err: true };
      }
      if (m && !result.err) {
        try {
          const target = resolvePath(dir, m[3]);
          writeFile(target, result.out.join("\n") + (result.out.length ? "\n" : ""), m[2] === ">>");
        } catch (e) {
          out.push({ kind: "err", text: `sksh: ${e instanceof FsError ? e.message : "write failed"}` });
        }
        continue;
      }
      for (const text of result.out) out.push({ kind: result.err ? "err" : "out", text });
      if (result.err && part !== input) break;
    }

    setCwd(dir);
    setLines((prev) => (cleared ? [] : [...prev, ...out]));
  }

  function complete() {
    const parts = value.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    let candidates: string[];
    if (parts.length === 1) {
      candidates = commandNames.filter((c) => c.startsWith(last));
    } else {
      const slash = last.lastIndexOf("/");
      const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
      const stem = slash >= 0 ? last.slice(slash + 1) : last;
      const dir = resolvePath(cwd, dirPart || ".");
      candidates = list(dir, getFs(), stem.startsWith("."))
        .filter((e) => e.name.startsWith(stem))
        .map((e) => dirPart + e.name + (e.node.type === "dir" ? "/" : ""));
    }
    if (!candidates.length) return;
    if (candidates.length === 1) {
      parts[parts.length - 1] = candidates[0] + (candidates[0].endsWith("/") ? "" : " ");
      setValue(parts.join(" "));
      return;
    }
    let prefix = candidates[0];
    for (const c of candidates) while (!c.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (prefix.length > last.length) {
      parts[parts.length - 1] = prefix;
      setValue(parts.join(" "));
    } else {
      setLines((prev) => [...prev, { kind: "prompt", cwd, text: value }, { kind: "out", text: candidates.join("  ") }]);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      execute(value);
      setValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex === null) return;
      const i = hIndex + 1;
      if (i >= history.length) {
        setHIndex(null);
        setValue("");
      } else {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && (e.key === "c" || e.key === "C") && !window.getSelection()?.toString()) {
      e.preventDefault();
      setLines((prev) => [...prev, { kind: "prompt", cwd, text: value + "^C" }]);
      setValue("");
    }
  }

  return (
    <div
      ref={scrollRef}
      className="os-terminal h-full overflow-y-auto px-3 py-2 font-[family-name:var(--font-mono)] text-[13px] leading-[1.45]"
      onMouseUp={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      {lines.map((l, i) =>
        l.kind === "prompt" ? (
          <div key={i} className="whitespace-pre-wrap break-all">
            <Prompt cwd={l.cwd} />
            {l.text}
          </div>
        ) : (
          <div
            key={i}
            className={`whitespace-pre-wrap break-words ${l.kind === "err" ? "text-[#ff7b7b]" : l.kind === "info" ? "text-[#8b97ad]" : ""}`}
          >
            {l.text || " "}
          </div>
        ),
      )}
      <div className="flex">
        <span className="shrink-0 whitespace-pre">
          <Prompt cwd={cwd} />
        </span>
        <input
          ref={inputRef}
          data-autofocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-inherit caret-[#5eead4] outline-none"
        />
      </div>
    </div>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <>
      <span className="font-semibold text-[#7ee787]">
        {USER}@{HOST}
      </span>
      <span>:</span>
      <span className="font-semibold text-[#79a8ff]">{prettyPath(cwd)}</span>
      <span>$ </span>
    </>
  );
}

