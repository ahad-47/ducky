"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Button";
import { appSignInUrl } from "@/lib/env";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Sets state synchronously on mount so the clock shows immediately
    // instead of waiting a full second for the first tick.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TopBar({
  onMenuClick,
  onTerminalClick,
}: {
  onMenuClick: () => void;
  onTerminalClick: () => void;
}) {
  const pathname = usePathname();
  const now = useClock();
  const signInUrl = appSignInUrl;

  const timeLabel = now
    ? `${now.toLocaleTimeString("en-US", { hour12: false })}  ${now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
      })}`
    : "";

  return (
    <div className="glass flex h-14 items-center justify-between rounded-[var(--radius-xs)] px-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="font-[family-name:var(--font-mono)] text-[13px] text-ink-soft xl:hidden"
        >
          [ = ]
        </button>
        <p className="font-[family-name:var(--font-mono)] text-[13px] text-ink-soft">
          {pathname === "/" ? "/home" : pathname}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onTerminalClick}
          className="hidden items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] text-ink-soft hover:text-ink sm:flex"
          aria-label="Open terminal"
          title="Open terminal (Ctrl+`)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="m7 9 3 3-3 3M13 15h4" />
          </svg>
          terminal
        </button>
        <p className="hidden font-[family-name:var(--font-mono)] text-[12px] text-ink-soft sm:block" suppressHydrationWarning>
          {timeLabel}
        </p>
        {signInUrl ? (
          <a
            href={signInUrl}
            className="hidden font-[family-name:var(--font-sans)] text-[14px] font-medium text-ink-soft hover:text-ink sm:block"
          >
            Sign in
          </a>
        ) : null}
        <PrimaryButton href="/contact" className="h-9 px-4 text-[13px]">
          Request an assessment
        </PrimaryButton>
      </div>
    </div>
  );
}
