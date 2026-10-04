"use client";

import Link from "@/components/ui/SiteLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const links: { href: string; label: string; soon?: boolean }[] = [
  { href: "/method", label: "Platform" },
  { href: "/engagements", label: "Scan types" },
  { href: "/report-sample", label: "Report sample" },
  { href: "/compliance", label: "Compliance" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/scanner", label: "Console", soon: true },
];

export function SiteHeader({ signInUrl }: { signInUrl: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-[280ms] ${
        scrolled ? "border-rule bg-paper/80 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--content-max)] items-center gap-6 px-[var(--side-padding)]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="SkilledScan home">
          <Logo markClassName="h-7 w-7 text-accent-text" textClassName="text-[18px]" />
        </Link>

        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {links.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[14.5px] font-medium transition-colors duration-[160ms] ${
                  current ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                }`}
              >
                {link.label}
                {link.soon ? <SoonPill /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-4">
          {signInUrl ? (
            <a href={signInUrl} className="hidden text-[14.5px] font-medium text-ink-soft hover:text-ink sm:block">
              Client sign in
            </a>
          ) : null}
          <Link
            href="/contact"
            className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-[var(--radius-xs)] bg-accent px-3.5 sm:px-4 text-[14px] font-semibold text-accent-ink transition-colors duration-[160ms] hover:bg-accent-hover"
          >
            <span className="sm:hidden">Early access</span>
            <span className="hidden sm:inline">Request early access</span>
          </Link>
        </div>
      </div>

      {/* Narrow windows: the links become a scrollable row under the bar. */}
      <nav
        aria-label="Main (compact)"
        className="flex gap-1 overflow-x-auto px-[var(--side-padding)] pb-2 [scrollbar-width:none] lg:hidden"
      >
        {links.map((link) => {
          const current = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[13.5px] font-medium ${
                current ? "border-accent bg-accent/20 text-ink" : "border-rule text-ink-soft"
              }`}
            >
              {link.label}
              {link.soon ? <SoonPill /> : null}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function SoonPill() {
  return (
    <span className="ml-1.5 rounded-full bg-severity-medium/15 px-1.5 py-0.5 align-middle font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-severity-medium">
      Soon
    </span>
  );
}
