"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/os/Sidebar";
import { TopBar } from "@/components/os/TopBar";
import { TerminalWindow } from "@/components/os/TerminalWindow";

export function OSShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  return (
    <div className="xl:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 xl:block">
        <Sidebar onOpenTerminal={() => setTerminalOpen(true)} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-paper shadow-2xl">
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="font-[family-name:var(--font-mono)] text-[13px] text-ink-soft"
              >
                [ x ] close
              </button>
            </div>
            <Sidebar
              onNavigate={() => setMobileOpen(false)}
              onOpenTerminal={() => setTerminalOpen(true)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col gap-4 p-4">
        <TopBar onMenuClick={() => setMobileOpen(true)} onTerminalClick={() => setTerminalOpen(true)} />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>

      <TerminalWindow isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </div>
  );
}
