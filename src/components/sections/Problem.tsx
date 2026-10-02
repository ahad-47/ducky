import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/PageHeader";
import { homeCopy } from "@/content/copy/home";

// A plain comparison: what a raw scan gives you versus a SkilledScan report.
export function Problem() {
  const { columns, rows } = homeCopy.problem;
  return (
    <Section id="problem">
      <SectionHeading eyebrow={homeCopy.problem.eyebrow} title={homeCopy.problem.h2} className="max-w-3xl" />
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule-strong text-[14px]">
              {columns.map((c, i) => (
                <th key={i} scope="col" className={`py-3 pr-6 font-medium ${i === 2 ? "text-ink" : "text-ink-soft"}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, raw, ours]) => (
              <tr key={label} className="border-b border-rule">
                <th scope="row" className="w-[22%] py-5 pr-6 align-top text-[15px] font-medium text-ink-soft">
                  {label}
                </th>
                <td className="w-[36%] py-5 pr-6 align-top text-[16.5px] text-ink-soft/80">{raw}</td>
                <td className="py-5 align-top text-[16.5px] text-ink">
                  <span className="mr-2 inline-block h-2 w-2 -translate-y-0.5 rounded-full bg-accent" aria-hidden />
                  {ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
