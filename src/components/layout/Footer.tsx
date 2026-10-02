import Link from "next/link";
import { facts } from "@/content/facts";

const columns = [
  {
    heading: "Platform",
    links: [
      { href: "/method", label: "Method" },
      { href: "/engagements", label: "Engagements" },
      { href: "/report-sample", label: "Report sample" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/compliance", label: "Compliance" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/contact", label: "Request an assessment" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { href: "/security", label: "Security and disclosure" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/terms", label: "Terms of use" },
      { href: "/legal/acceptable-use", label: "Acceptable use" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper/60">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--side-padding)] py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 font-[family-name:var(--font-serif)] text-2xl text-ink">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-[family-name:var(--font-mono)] text-[12px] font-bold text-accent-ink"
              >
                SS
              </span>
              SkilledScan
            </p>
            <p className="mt-4 max-w-sm text-[15px] text-ink-soft">
              {facts.brand.oneLiner}
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.heading}>
              <p className="font-[family-name:var(--font-sans)] text-[15px] font-semibold text-ink">
                {column.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link prefetch={false}
                      href={link.href}
                      className="text-[15px] text-ink-soft hover:text-accent-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6 text-sm text-ink-soft">
          <p>© {year} SkilledScan.</p>
          <p className="font-[family-name:var(--font-mono)] text-[12.5px]">Every finding verified by hand.</p>
        </div>
      </div>
    </footer>
  );
}
