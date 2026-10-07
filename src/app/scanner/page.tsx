import Link from "@/components/ui/SiteLink";
import { Section } from "@/components/ui/Container";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ScannerRadar } from "@/components/sections/ScannerRadar";
import { scannerCopy } from "@/content/copy/scanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Self-Serve Scanning Console, Coming Soon | SkilledScan",
  description:
    "The self-serve SkilledScan console for starting scans, tracking findings and downloading reports is in development. Request early access by email.",
  path: "/scanner",
});

export default function ScannerPage() {
  return (
    <>
      <div className="grid grid-cols-1 items-center lg:grid-cols-[1.2fr_1fr]">
        <PageHeader eyebrow="Console" title={scannerCopy.h1} intro={scannerCopy.intro}>
          <Badge tone="next">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-severity-medium" />
            {scannerCopy.status}
          </Badge>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-accent underline-offset-4"
          >
            View the roadmap
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </PageHeader>
        <div data-motion="hero-visual" className="px-[var(--side-padding)] pb-12 lg:pb-0 lg:pr-[var(--side-padding)]">
          <ScannerRadar label={scannerCopy.status} />
        </div>
      </div>

      <Section className="pt-0">
        <SectionHeading eyebrow="Building" title={scannerCopy.building.h2} intro={scannerCopy.building.intro} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scannerCopy.building.items.map((item) => (
            <Card as="li" key={item} pad="px-5 py-4" className="flex items-start gap-3 text-[16px] text-ink">
              <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-severity-medium/70" />
              {item}
            </Card>
          ))}
        </ul>
      </Section>

      <ClosingCta h2={scannerCopy.meantime.h2} body={scannerCopy.meantime.body} />
    </>
  );
}
