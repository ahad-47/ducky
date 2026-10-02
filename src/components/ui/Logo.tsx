// The SkilledScan mark (shield with a check) and wordmark: SKILLED in
// Montserrat ExtraBold, SCAN in Montserrat Light. Colours follow the
// surrounding text unless overridden.

export function LogoMark({ className = "h-7 w-7", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M20 3.5 6 8.5v10.2c0 8.6 5.9 15.6 14 18.3 2-.7 3.9-1.6 5.6-2.8" strokeWidth={2.6} />
      <path d="M20 3.5 34 8.5v9.3" strokeWidth={2.6} />
      <path d="M20 8.6 10.5 12v6.7c0 6 3.9 11 9.5 13.3" strokeWidth={1.6} opacity={0.75} />
      <path d="M20 8.6 29.5 12v5" strokeWidth={1.6} opacity={0.75} />
      <circle cx="29.5" cy="28.5" r="7.2" strokeWidth={2.6} />
      <path d="m26.2 28.6 2.3 2.3 4.4-4.6" strokeWidth={2.6} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`whitespace-nowrap font-[family-name:var(--font-logo)] uppercase leading-none tracking-[0.02em] ${className}`}
    >
      <span className="font-extrabold">Skilled</span>
      <span className="font-light">Scan</span>
    </span>
  );
}

export function Logo({
  className = "",
  markClassName = "h-7 w-7",
  textClassName = "text-[19px]",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <Wordmark className={textClassName} />
    </span>
  );
}
