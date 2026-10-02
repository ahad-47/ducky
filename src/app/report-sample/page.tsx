import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Card";
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
      <PageHeader eyebrow="Report sample" title={reportSampleCopy.h1} intro={reportSampleCopy.intro}>
        <Badge tone="neutral">Redacted</Badge>
        <Badge tone="neutral">{counts.total} findings</Badge>
        <Badge tone="neutral">HTML and PDF</Badge>
      </PageHeader>

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
            <ol className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
              {facts.reportSample.sections.map((item, index) => (
                <li key={item} className="flex gap-3 border-b border-rule pb-3 text-[16.5px] text-ink">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] leading-7 text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
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

          <p className="mt-12 rounded-[var(--radius-xs)] border border-rule bg-black/20 px-5 py-4 text-[15px] text-ink-soft">
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
