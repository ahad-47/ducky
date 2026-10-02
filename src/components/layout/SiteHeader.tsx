"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/method", label: "Method" },
  { href: "/engagements", label: "Engagements" },
  { href: "/report-sample", label: "Report sample" },
  { href: "/compliance", label: "Compliance" },
  { href: "/roadmap", label: "Roadmap" },
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
        scrolled ? "border-white/10 bg-paper/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--content-max)] items-center gap-6 px-[var(--side-padding)]">
        <Link prefetch={false} href="/" className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="SkilledScan home">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-[family-name:var(--font-mono)] text-[12px] font-bold text-accent-ink"
          >
            SS
          </span>
          <span className="font-[family-name:var(--font-serif)] text-[19px] tracking-[-0.01em]">SkilledScan</span>
        </Link>

        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {links.map((link) => {
            const current = pathname === link.href;
            return (
              <Link prefetch={false}
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[14.5px] font-medium transition-colors duration-[160ms] ${
                  current ? "bg-white/10 text-ink" : "text-ink-soft hover:bg-white/5 hover:text-ink"
                }`}
              >
                {link.label}
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
          <Link prefetch={false}
            href="/contact"
            className="inline-flex h-9 items-center rounded-[var(--radius-xs)] bg-accent px-4 text-[14px] font-semibold text-accent-ink transition-colors duration-[160ms] hover:bg-accent-hover"
          >
            Request an assessment
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
            <Link prefetch={false}
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[13.5px] font-medium ${
                current ? "border-accent bg-accent/20 text-ink" : "border-rule text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
