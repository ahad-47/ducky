import { Section } from "@/components/ui/Container";
import { roadmapCopy } from "@/content/copy/roadmap";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Roadmap | SkilledScan",
  description: "What SkilledScan delivers today and what is next.",
  path: "/roadmap",
});

export default function RoadmapPage() {
  return (
    <>
      <Section>
        <h1 className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {roadmapCopy.h1}
        </h1>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {roadmapCopy.intro}
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <div className="order-1">
            <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
              {roadmapCopy.liveLabel}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {facts.roadmap.live.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-2">
            <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
              {roadmapCopy.nextLabel}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {facts.roadmap.next.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule pt-3 text-[17px] text-ink-soft first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
