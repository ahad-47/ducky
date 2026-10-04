"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { pages } from "@/components/desktop/pages";

// The desktop depends on viewport size and browser storage from its first
// render, so it renders on the client only.
const Desktop = dynamic(() => import("@/components/desktop/Desktop").then((m) => m.Desktop), {
  ssr: false,
  loading: () => <div className="desktop-boot fixed inset-0 bg-black" />,
});

// If the desktop's code fails to download (flaky mobile network, a CDN
// refusing requests) or crashes on an unusual browser, show the plain
// pages instead of a black screen, plus the error so it can be reported.
class DesktopBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="fixed inset-0 overflow-y-auto bg-paper px-6 py-10 text-ink">
        <div className="mx-auto max-w-md">
          <p className="font-[family-name:var(--font-logo)] text-[20px] uppercase">
            <span className="font-extrabold">Skilled</span>
            <span className="font-light">Scan</span>
          </p>
          <h1 className="mt-6 text-[22px] font-semibold">The desktop did not start.</h1>
          <p className="mt-2 text-[15px] text-ink-soft">You can retry, or open any page directly:</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 h-11 rounded-[var(--radius-xs)] bg-accent px-5 text-[15px] font-semibold text-accent-ink"
          >
            Retry
          </button>
          <ul className="mt-6 divide-y divide-rule rounded-[var(--radius-sm)] border border-rule">
            {pages.map((p) => (
              <li key={p.route}>
                <a className="block px-4 py-3 text-[15px] hover:bg-white/5" href={`${p.route}${p.route.includes("?") ? "&" : "?"}embed=1`}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 break-words font-[family-name:var(--font-mono)] text-[12px] text-ink-soft">
            Error: {error.message || String(error)}
          </p>
        </div>
      </div>
    );
  }
}

export function DesktopClient() {
  return (
    <DesktopBoundary>
      <Desktop />
    </DesktopBoundary>
  );
}
