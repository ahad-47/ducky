import Link from "@/components/ui/SiteLink";
import { Icon } from "@/components/ui/Icon";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

// Solid cobalt with a hairline top highlight and a soft blue shadow; it
// rises a pixel on hover and settles on press.
const primaryClass =
  "inline-flex h-12 items-center justify-center rounded-[var(--radius-xs)] bg-accent px-6 font-[family-name:var(--font-sans)] text-[15px] font-medium text-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(10,19,36,0.16),0_10px_24px_-12px_rgba(36,83,230,0.7)] transition-[transform,background-color,box-shadow] duration-300 ease-[var(--ease-lux)] hover:-translate-y-px hover:bg-accent-hover active:translate-y-0";
// Text link with an arrow that slides on hover.
const secondaryClass =
  "group inline-flex items-center gap-1.5 font-[family-name:var(--font-sans)] text-[15px] font-medium text-accent-text transition-colors duration-300 hover:text-ink";

type PrimaryButtonProps = {
  variant?: "primary";
  href?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  href,
  className = "",
  children,
  ...props
}: PrimaryButtonProps) {
  if (href) {
    return (
      <Link href={href} className={`${primaryClass} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`${primaryClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

type SecondaryLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function SecondaryLink({
  href,
  className = "",
  children,
}: SecondaryLinkProps) {
  return (
    <Link href={href} className={`${secondaryClass} ${className}`}>
      {children}
      <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-0.5" />
    </Link>
  );
}
