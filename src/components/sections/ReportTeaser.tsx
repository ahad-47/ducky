import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { SeverityBar } from "@/components/ui/SeverityBar";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

const counts = facts.reportSample.summaryCounts;

export function ReportTeaser() {
  return (
    <Section id="report">
      <h2 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        {homeCopy.reportTeaser.h2}
      </h2>
      <p className="measure mt-4 text-[18px] text-ink-soft">
        {homeCopy.reportTeaser.body}
      </p>
      <div className="mt-10 max-w-xl">
        <SeverityBar
          animated
          total={counts.total}
          segments={[
            { label: "medium", value: counts.medium, severity: "Medium" },
            { label: "low", value: counts.low, severity: "Low" },
            { label: "info", value: counts.info, severity: "Info" },
          ]}
        />
        <p className="mt-4 text-[15px] text-ink-soft">
          {homeCopy.reportTeaser.caption}
        </p>
      </div>
      <SecondaryLink href={homeCopy.reportTeaser.link.href} className="mt-10">
        {homeCopy.reportTeaser.link.label}
      </SecondaryLink>
    </Section>
  );
}
