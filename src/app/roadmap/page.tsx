import { Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { roadmapCopy } from "@/content/copy/roadmap";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Roadmap | SkilledScan",
  description: "What SkilledScan delivers today and what is next.",
  path: "/roadmap",
});

export default function RoadmapPage() {
  const live = facts.roadmap.live;
  const next = facts.roadmap.next;
  return (
    <>
      <PageHeader eyebrow="Roadmap" title={roadmapCopy.h1} intro={roadmapCopy.intro}>
        <Badge tone="live">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-low" />
          {live.length} live
        </Badge>
      </PageHeader>

      <Section className="pt-0">
        <div className="flex flex-col gap-5">
          <Card pad="p-0">
            <div className="flex items-center justify-between border-b border-rule px-6 py-5">
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{roadmapCopy.liveLabel}</h2>
              <Badge tone="live">Shipping today</Badge>
            </div>
            <ul className="divide-y divide-rule">
              {live.map((item) => (
                <li key={item} className="flex gap-4 px-6 py-4 text-[16.5px] text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-severity-low/15 text-severity-low">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          {/* Live leads; work in progress is one click away, without dates
              we cannot commit to. */}
          <details className="group glass rounded-[var(--radius-sm)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-serif)] text-h3 text-ink">{roadmapCopy.nextLabel}</span>
                <Badge tone="next">{next.length} in progress</Badge>
              </span>
              <span aria-hidden className="text-ink-soft transition-transform duration-[160ms] group-open:rotate-180">
                <Icon name="chevron" className="h-4 w-4" />
              </span>
            </summary>
            <p className="border-t border-rule px-6 py-4 text-[15px] text-ink-soft">{roadmapCopy.nextNote}</p>
            <ul className="divide-y divide-rule border-t border-rule">
              {next.map((item) => (
                <li key={item} className="flex gap-4 px-6 py-4 text-[16.5px] text-ink-soft">
                  <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-severity-medium/70" />
                  {item}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
