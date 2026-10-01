"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Button";

export type NavLink = { href: string; label: string };

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  signInUrl: string | null;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
};

export function MobileMenu({
  isOpen,
  onClose,
  links,
  signInUrl,
  menuButtonRef,
}: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, menuButtonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className="fixed inset-0 z-50 flex flex-col bg-paper-raised"
    >
      <div className="flex items-center justify-between px-[var(--side-padding)] py-6">
        <Link
          href="/"
          onClick={onClose}
          className="font-[family-name:var(--font-serif)] text-2xl text-ink"
        >
          SkilledScan
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose();
            menuButtonRef.current?.focus();
          }}
          className="font-[family-name:var(--font-sans)] text-base font-medium text-ink"
        >
          Close
        </button>
      </div>
      <nav
        aria-label="Main"
        className="flex flex-1 flex-col justify-center gap-6 px-[var(--side-padding)]"
      >
        {links.map((link) => {
          const current = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={current ? "page" : undefined}
              className={`font-[family-name:var(--font-serif)] text-4xl ${current ? "text-accent" : "text-ink"}`}
            >
              {link.label}
            </Link>
          );
        })}
        {signInUrl ? (
          <a
            href={signInUrl}
            className="font-[family-name:var(--font-sans)] text-lg font-medium text-ink underline decoration-accent decoration-[1px] underline-offset-4"
          >
            Client sign in
          </a>
        ) : null}
        <PrimaryButton href="/contact" onClick={onClose} className="mt-2 w-fit">
          Request an assessment
        </PrimaryButton>
      </nav>
    </div>
  );
}
