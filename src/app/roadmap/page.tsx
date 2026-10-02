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
        <Badge tone="next">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-medium" />
          {next.length} building
        </Badge>
      </PageHeader>

      <Section className="pt-0">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
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
          <Card pad="p-0">
            <div className="flex items-center justify-between border-b border-rule px-6 py-5">
              <h2 className="font-[family-name:var(--font-serif)] text-h3 text-ink">{roadmapCopy.nextLabel}</h2>
              <Badge tone="next">In progress</Badge>
            </div>
            <ul className="divide-y divide-rule">
              {next.map((item) => (
                <li key={item} className="flex gap-4 px-6 py-4 text-[16.5px] text-ink-soft">
                  <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-severity-medium/70" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
