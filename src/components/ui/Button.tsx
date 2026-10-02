import Link from "@/components/ui/SiteLink";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const baseClass =
  "inline-flex items-center justify-center font-[family-name:var(--font-sans)] font-semibold transition-colors duration-[160ms] active:scale-[0.98]";

const primaryClass = `${baseClass} h-12 rounded-[var(--radius-sm)] bg-accent px-5 text-accent-ink hover:bg-accent-hover`;
const secondaryClass =
  "inline-flex items-center font-[family-name:var(--font-sans)] font-medium text-ink underline decoration-accent decoration-[1px] underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] duration-[160ms] hover:decoration-[2px]";

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
    </Link>
  );
}
