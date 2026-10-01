"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useClock } from "@/components/desktop/Panel";
import { Glyph } from "@/components/desktop/icons";
import { facts } from "@/content/facts";

const bootLines = [
  "SkilledScan OS 1.0 (tty1)",
  "[  OK  ] Started Journal Service.",
  "[  OK  ] Mounted /home/guest.",
  "[  OK  ] Started governed scan engine.",
  "[  OK  ] Reached target Policy Gate.",
  `[  OK  ] Indexed ${facts.signalResult.raw} raw observations.`,
  `[  OK  ] Confirmed ${facts.signalResult.verified} verified findings.`,
  "[  OK  ] Started GNOME Display Manager.",
];

export function BootScreen({ onDone, quick }: { onDone: () => void; quick: boolean }) {
  const [shown, setShown] = useState(0);
  const done = useEffectEvent(() => onDone());

  useEffect(() => {
    const step = quick ? 0 : 110;
    if (step === 0) {
      done();
      return;
    }
    const timers = bootLines.map((_, i) => window.setTimeout(() => setShown(i + 1), step * (i + 1)));
    timers.push(window.setTimeout(() => done(), step * bootLines.length + 450));
    return () => timers.forEach(clearTimeout);
  }, [quick]);

  return (
    <div className="absolute inset-0 z-[9500] bg-black p-6 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[#c9d1e0]">
      {bootLines.slice(0, shown).map((l) => (
        <p key={l}>
          {l.startsWith("[  OK  ]") ? (
            <>
              [<span className="text-[#7ee787]">  OK  </span>]{l.slice(8)}
            </>
          ) : (
            l
          )}
        </p>
      ))}
      <span className="inline-block h-4 w-2 animate-pulse bg-[#c9d1e0]" />
    </div>
  );
}

export function LockScreen({ wallpaper, onUnlock }: { wallpaper: string; onUnlock: () => void }) {
  const now = useClock();
  const [prompt, setPrompt] = useState(false);
  const [pw, setPw] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prompt) inputRef.current?.focus();
  }, [prompt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!prompt && !e.metaKey && !e.ctrlKey) setPrompt(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prompt]);

  return (
    <div
      className="absolute inset-0 z-[9400] flex flex-col items-center justify-center text-white"
      onClick={() => setPrompt(true)}
      role="dialog"
      aria-label="Lock screen"
    >
      <div className="absolute inset-0 scale-110 blur-2xl" style={{ background: wallpaper }} />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-col items-center">
        {prompt ? (
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUnlock();
            }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white/15 text-3xl font-semibold">G</div>
            <p className="text-[18px] font-semibold">guest</p>
            <input
              ref={inputRef}
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password (anything works)"
              aria-label="Password"
              className="w-64 rounded-full bg-white/15 px-4 py-2 text-center text-[14px] outline-none ring-1 ring-white/20 placeholder:text-white/50 focus:ring-2 focus:ring-[var(--os-accent)]"
              onKeyDown={(e) => e.key === "Escape" && setPrompt(false)}
            />
            <button type="submit" className="rounded-full bg-[var(--os-accent)] px-6 py-1.5 text-[13px] font-semibold">
              Unlock
            </button>
          </form>
        ) : (
          <>
            <p className="text-[88px] font-light leading-none tracking-tight" suppressHydrationWarning>
              {now?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </p>
            <p className="mt-3 text-[20px]" suppressHydrationWarning>
              {now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="mt-16 text-[13px] text-white/60">Click or press a key to unlock</p>
          </>
        )}
      </div>
    </div>
  );
}

export function OffScreen({ onPower }: { onPower: () => void }) {
  return (
    <div className="absolute inset-0 z-[9600] flex flex-col items-center justify-center gap-6 bg-black text-white/70">
      <button
        type="button"
        autoFocus
        onClick={onPower}
        aria-label="Power on"
        className="grid h-20 w-20 place-items-center rounded-full ring-2 ring-white/30 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-[var(--os-accent)]"
      >
        <Glyph.Power className="h-9 w-9" />
      </button>
      <p className="font-[family-name:var(--font-mono)] text-[12px]">System halted. Press to power on.</p>
    </div>
  );
}
