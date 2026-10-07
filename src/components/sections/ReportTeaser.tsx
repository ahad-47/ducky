import { Section } from "@/components/ui/Container";
import { SecondaryLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/PageHeader";
import { SeverityBar } from "@/components/ui/SeverityBar";
import { WindowChrome } from "@/components/os/WindowChrome";
import { homeCopy } from "@/content/copy/home";
import { facts } from "@/content/facts";

const counts = facts.reportSample.summaryCounts;

export function ReportTeaser() {
  return (
    <Section id="report">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="The report" title={homeCopy.reportTeaser.h2} intro={homeCopy.reportTeaser.body} />
          <SecondaryLink href={homeCopy.reportTeaser.link.href} className="mt-8">
            {homeCopy.reportTeaser.link.label}
          </SecondaryLink>
        </div>
        <div className="glass-strong rounded-[var(--radius-sm)] p-6 sm:p-8">
          <WindowChrome title="report-summary" />
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
            At a glance
          </p>
          <p className="mt-2 font-[family-name:var(--font-serif)] text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-ink">
            <span data-count className="tabular-nums">{counts.total}</span>{" "}
            <span className="text-[18px] text-ink-soft">findings, by severity</span>
          </p>
          <div className="mt-6">
            <SeverityBar
              animated
              total={counts.total}
              segments={[
                { label: "medium", value: counts.medium, severity: "Medium" },
                { label: "low", value: counts.low, severity: "Low" },
                { label: "info", value: counts.info, severity: "Info" },
              ]}
            />
          </div>
          <p className="mt-5 text-[14.5px] text-ink-soft">{homeCopy.reportTeaser.caption}</p>
          <ol className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-rule pt-5 text-[14.5px] text-ink-soft sm:grid-cols-2">
            {facts.reportSample.sections.slice(0, 6).map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="font-[family-name:var(--font-mono)] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
