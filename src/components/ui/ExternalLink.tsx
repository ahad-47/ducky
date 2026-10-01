type ExternalLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function ExternalLink({
  href,
  className = "",
  children,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline decoration-accent decoration-[1px] underline-offset-4 hover:decoration-[2px] ${className}`}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
