"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { PrimaryButton } from "@/components/ui/Button";
import { MobileMenu, type NavLink } from "@/components/layout/MobileMenu";
import { gsap, ScrollTrigger, registerGsap, durations } from "@/motion/gsap";
import { useReducedMotion } from "@/motion/useReducedMotion";

const navLinks: NavLink[] = [
  { href: "/method", label: "Method" },
  { href: "/engagements", label: "Engagements" },
  { href: "/report-sample", label: "Report sample" },
  { href: "/compliance", label: "Compliance" },
  { href: "/roadmap", label: "Roadmap" },
];

export function Header({ signInUrl }: { signInUrl: string | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  function toggleMenu(open: boolean) {
    setMenuOpen(open);
    window.dispatchEvent(new CustomEvent("skilledscan:menu-toggle", { detail: { open } }));
  }

  useGSAP(
    () => {
      registerGsap();
      const header = headerRef.current;
      if (!header) return;

      if (reducedMotion) {
        header.classList.add("glass");
        return;
      }

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.classList.toggle("glass", y > 24);

          const shouldHide = self.direction === 1 && y > 120;
          gsap.to(header, {
            yPercent: shouldHide ? -100 : 0,
            duration: durations.ui,
            ease: "report",
            overwrite: true,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: headerRef, dependencies: [reducedMotion] },
  );

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 transition-colors duration-[280ms]"
      >
        <div className="mx-auto flex h-20 max-w-[var(--content-max)] items-center justify-between px-[var(--side-padding)]">
          <Link
            href="/"
            className="font-[family-name:var(--font-serif)] text-2xl tracking-[-0.01em] text-ink"
          >
            SkilledScan
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-5 xl:flex">
            {navLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`whitespace-nowrap font-[family-name:var(--font-sans)] text-[15px] font-medium ${
                    current
                      ? "text-accent-text underline decoration-[2px] underline-offset-[6px]"
                      : "text-ink hover:text-accent-text"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            {signInUrl ? (
              <a
                href={signInUrl}
                className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[15px] font-medium text-ink underline decoration-accent decoration-[1px] underline-offset-4"
              >
                Client sign in
              </a>
            ) : null}
            <PrimaryButton href="/contact" className="whitespace-nowrap">
              Request an assessment
            </PrimaryButton>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => toggleMenu(true)}
            className="font-[family-name:var(--font-sans)] text-base font-medium text-ink xl:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => toggleMenu(false)}
        links={navLinks}
        signInUrl={signInUrl}
        menuButtonRef={menuButtonRef}
      />
    </>
  );
}
