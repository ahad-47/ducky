"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Button";
import { MobileMenu, type NavLink } from "@/components/layout/MobileMenu";

const navLinks: NavLink[] = [
  { href: "/method", label: "Method" },
  { href: "/engagements", label: "Engagements" },
  { href: "/report-sample", label: "Report sample" },
  { href: "/practice", label: "Practice" },
  { href: "/compliance", label: "Compliance" },
  { href: "/roadmap", label: "Roadmap" },
];

export function Header({ signInUrl }: { signInUrl: string | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/[0.92]">
        <div className="mx-auto flex h-20 max-w-[var(--content-max)] items-center justify-between px-[var(--side-padding)]">
          <Link
            href="/"
            className="font-[family-name:var(--font-serif)] text-2xl tracking-[-0.01em] text-ink"
          >
            SkilledScan
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`font-[family-name:var(--font-sans)] text-[15px] font-medium ${
                    current
                      ? "text-accent underline decoration-[2px] underline-offset-[6px]"
                      : "text-ink hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            {signInUrl ? (
              <a
                href={signInUrl}
                className="font-[family-name:var(--font-sans)] text-[15px] font-medium text-ink underline decoration-accent decoration-[1px] underline-offset-4"
              >
                Client sign in
              </a>
            ) : null}
            <PrimaryButton href="/contact">Request an assessment</PrimaryButton>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="font-[family-name:var(--font-sans)] text-base font-medium text-ink lg:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        signInUrl={signInUrl}
        menuButtonRef={menuButtonRef}
      />
    </>
  );
}
