"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { osApps, osLegalApps, terminalApp } from "@/components/os/osConfig";

function AppIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
  };
  switch (slug) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "method":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      );
    case "engagements":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 2v4M16 2v4M4 10h16" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M8 3h6l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 0v5h5" />
        </svg>
      );
    case "compliance":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        </svg>
      );
    case "roadmap":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M8 12h4m0 0 4-6m-4 6 4 6" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3M13 15h4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function Sidebar({
  onNavigate,
  onOpenTerminal,
}: {
  onNavigate?: () => void;
  onOpenTerminal?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-5 py-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[13px] tracking-wide text-ink">
          SKILLEDSCAN<span className="text-accent-text"> OS</span>
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">v1.0.0</p>
      </div>

      <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
        <Link
          href={osApps[0].href}
          onClick={onNavigate}
          aria-current={pathname === osApps[0].href ? "page" : undefined}
          className={`flex items-center gap-3 rounded-[var(--radius-xs)] px-3 py-2 font-[family-name:var(--font-mono)] text-[13px] transition-colors ${
            pathname === osApps[0].href ? "glass text-ink" : "text-ink-soft hover:text-ink"
          }`}
        >
          <AppIcon slug={osApps[0].slug} />
          {osApps[0].label}
        </Link>

        <button
          type="button"
          onClick={() => {
            onOpenTerminal?.();
            onNavigate?.();
          }}
          className="flex items-center gap-3 rounded-[var(--radius-xs)] px-3 py-2 text-left font-[family-name:var(--font-mono)] text-[13px] text-ink-soft transition-colors hover:text-ink"
        >
          <AppIcon slug={terminalApp.slug} />
          {terminalApp.label}
        </button>

        {osApps.slice(1).map((app) => {
          const current = pathname === app.href;
          return (
            <Link
              key={app.href}
              href={app.href}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={`flex items-center gap-3 rounded-[var(--radius-xs)] px-3 py-2 font-[family-name:var(--font-mono)] text-[13px] transition-colors ${
                current ? "glass text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              <AppIcon slug={app.slug} />
              {app.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-8">
        {osLegalApps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            onClick={onNavigate}
            className="px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-ink-soft/70 hover:text-ink-soft"
          >
            {app.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
