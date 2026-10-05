import Link from "@/components/ui/SiteLink";
import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteMap } from "@/content/site-map";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Site Map | SkilledScan",
  description:
    "Every page on skilledscan.com: web and API security scanning, how the scanner works, a sample report, compliance evidence, the founder, FAQ and policies.",
  path: "/site-map",
});

export default function SiteMapPage() {
  return (
    <>
      <PageHeader eyebrow="Site map" title="Every page on SkilledScan" />
      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {siteMap.map(({ group, pages }) => (
            <section key={group}>
              <h2 className="border-b border-rule pb-3 text-[17px] font-semibold tracking-[-0.01em] text-ink">{group}</h2>
              <ul className="mt-2 flex flex-col">
                {pages.map((page) => (
                  <li key={page.path} className="border-b border-rule py-4">
                    <Link href={page.path} className="text-[16px] font-medium text-accent-text hover:text-ink">
                      {page.title}
                    </Link>
                    <p className="mt-1 text-[14.5px] text-ink-soft">{page.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
