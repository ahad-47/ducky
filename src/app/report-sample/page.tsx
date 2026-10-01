import { Section } from "@/components/ui/Container";
import { ReportPaper } from "@/components/report/ReportPaper";
import { MetaGrid } from "@/components/report/MetaGrid";
import { SeverityBar } from "@/components/ui/SeverityBar";
import { FindingWithAnatomy } from "@/components/report/FindingWithAnatomy";
import { DefinitionList } from "@/components/ui/DefinitionList";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { reportSampleCopy } from "@/content/copy/report-sample";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sample report | SkilledScan",
  description:
    "A redacted sample, styled exactly like the report you receive, with one finding shown in full.",
  path: "/report-sample",
});

const counts = facts.reportSample.summaryCounts;

export default function ReportSamplePage() {
  return (
    <>
      <Section>
        <h1 className="font-[family-name:var(--font-serif)] text-display-xl text-ink">
          {reportSampleCopy.h1}
        </h1>
        <p className="measure mt-6 text-[18px] text-ink-soft">
          {reportSampleCopy.intro}
        </p>
      </Section>

      <Section className="pt-0">
        <ReportPaper>
          <header>
            <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
              {facts.reportSample.title}
            </h2>
            <p className="mt-2 text-[17px] text-ink-soft">
              {facts.reportSample.subtitle}
            </p>
            <div className="mt-8">
              <MetaGrid items={facts.reportSample.meta} />
            </div>
          </header>

          <section className="mt-12">
            <h3 className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-wide text-ink-soft">
              {reportSampleCopy.atAGlance}
            </h3>
            <div className="mt-4 max-w-xl">
              <SeverityBar
                total={counts.total}
                segments={[
                  { label: "medium", value: counts.medium, severity: "Medium" },
                  { label: "low", value: counts.low, severity: "Low" },
                  { label: "info", value: counts.info, severity: "Info" },
                ]}
              />
            </div>
          </section>

          <section className="mt-12">
            <h3 className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-wide text-ink-soft">
              {reportSampleCopy.contents}
            </h3>
            <ol className="mt-4 flex flex-col gap-2">
              {facts.reportSample.sections.map((item, index) => (
                <li key={item} className="text-[17px] text-ink">
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 border-t border-rule pt-12">
            <h3 className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-wide text-ink-soft">
              {reportSampleCopy.sampleFinding}
            </h3>
            <div className="mt-6">
              <FindingWithAnatomy />
            </div>
          </section>

          <section className="mt-12 border-t border-rule pt-12">
            <h3 className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-wide text-ink-soft">
              {reportSampleCopy.toolsAppendixHeading}
            </h3>
            <p className="mt-3 text-[17px] text-ink-soft">
              {facts.toolsAppendix.note}
            </p>
            <div className="mt-6">
              <DefinitionList
                items={facts.toolsAppendix.categories.map((category) => ({
                  term: category.group,
                  description: category.items.join(", "),
                }))}
              />
            </div>
          </section>

          <p className="mt-12 text-[15px] text-ink-soft">
            {facts.reportSample.note}
          </p>
        </ReportPaper>
      </Section>

      <ClosingCta
        h2={reportSampleCopy.closing.h2}
        primaryCta={reportSampleCopy.closing.primaryCta}
      />
    </>
  );
}
