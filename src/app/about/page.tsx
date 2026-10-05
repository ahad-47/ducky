import Image from "next/image";
import { headers } from "next/headers";
import { Section } from "@/components/ui/Container";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Badge, Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { aboutCopy } from "@/content/copy/about";
import { facts } from "@/content/facts";
import { buildMetadata } from "@/lib/seo";

const f = facts.founder;

export const metadata = buildMetadata({
  title: `${f.name}: Penetration Tester, Founder of SkilledScan`,
  description: `${f.name} is a CEH-certified penetration tester from India in the NCIIPC Hall of Fame, with 500+ security projects in 70+ countries. Founder of SkilledScan.`,
  path: "/about",
});

function ContactButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`mailto:${f.email}`}
        className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-xs)] bg-accent px-5 text-[15px] font-semibold text-accent-ink hover:bg-accent-hover"
      >
        <Icon name="mail" className="h-4 w-4" />
        {f.email}
      </a>
      <a
        href={f.linkedin}
        target="_blank"
        rel="noopener noreferrer me"
        className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-xs)] border border-rule-strong px-5 text-[15px] font-semibold text-ink hover:bg-accent-tint"
      >
        <Icon name="external" className="h-4 w-4" />
        {aboutCopy.linkedinLabel}
      </a>
    </div>
  );
}

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const url = `${facts.brand.url}/about`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    name: `${f.name}, founder of SkilledScan`,
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: f.name,
      url,
      image: `${facts.brand.url}${f.photo}`,
      email: `mailto:${f.email}`,
      jobTitle: f.headline,
      description: f.bio[0],
      homeLocation: { "@type": "Country", name: f.location },
      worksFor: { "@id": `${facts.brand.url}/#organization` },
      sameAs: [f.linkedin],
      award: "NCIIPC Hall of Fame",
      hasCredential: f.credentials.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.title })),
      knowsAbout: [...f.expertise.flatMap((e) => e.items), ...f.skills],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        // Built only from facts via JSON.stringify.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={aboutCopy.eyebrow} title={aboutCopy.h1} />

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
          <div>
            <Image
              src={f.photo}
              alt={aboutCopy.photoAlt}
              width={400}
              height={400}
              priority
              className="aspect-square w-full max-w-[320px] rounded-[var(--radius-sm)] border border-rule object-cover"
            />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-display-l font-medium tracking-[-0.03em] text-ink">{f.name}</h2>
            <p className="mt-2 text-[17px] text-accent-text">
              {f.headline} · {f.role}
            </p>
            <p className="mt-1 text-[15px] text-ink-soft">{f.location}</p>
            <div className="mt-6 flex flex-col gap-4">
              {f.bio.map((p) => (
                <p key={p.slice(0, 24)} className="measure text-[17px] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <ContactButtons />
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-y border-rule lg:grid-cols-4">
          {f.stats.map((s, i) => (
            <div key={s.label} className={`py-8 pr-6 ${i > 0 ? "lg:border-l lg:border-rule lg:pl-8" : ""} ${i % 2 ? "border-l border-rule pl-6 lg:pl-8" : ""}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-[family-name:var(--font-serif)] text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                  {s.value}
                </span>
                <span className="mt-3 block text-[14.5px] text-ink-soft">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.credentials.eyebrow} title={aboutCopy.credentials.h2} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.credentials.map((c) => (
            <Card key={c.title} pad="p-7" className="flex flex-col gap-3">
              <h3 className="text-[18px] font-semibold text-ink">{c.title}</h3>
              <p className="text-[15.5px] text-ink-soft">{c.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.expertise.eyebrow} title={aboutCopy.expertise.h2} intro={aboutCopy.expertise.intro} />
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {f.expertise.map((e) => (
            <div key={e.area}>
              <h3 className="border-b border-rule pb-3 text-[17px] font-semibold text-ink">{e.area}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {e.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15.5px] text-ink-soft">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-8">
          {[
            { label: aboutCopy.skills.h3, items: f.skills },
            { label: aboutCopy.skills.tools, items: f.tools },
            { label: aboutCopy.skills.sectors, items: f.sectors },
          ].map((group) => (
            <div key={group.label}>
              <h3 className="text-[15px] font-semibold text-ink">{group.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge tone="neutral">{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.countries.eyebrow} title={aboutCopy.countries.h2} intro={aboutCopy.countries.intro} />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {f.regions.map((r) => (
            <div key={r.region}>
              <h3 className="border-b border-rule pb-3 text-[15px] font-semibold text-ink">{r.region}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-[15.5px] text-ink-soft">
                {r.countries.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={aboutCopy.work.eyebrow} title={aboutCopy.work.h2} intro={aboutCopy.work.intro} />
        <div className="mt-10 overflow-hidden rounded-[var(--radius-sm)] border border-rule">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-accent-tint/60 text-[13px] text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Year</th>
                <th scope="col" className="px-5 py-3 font-medium">Project</th>
                <th scope="col" className="hidden px-5 py-3 font-medium sm:table-cell">Client country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {f.work.map((w) => (
                <tr key={`${w.year}-${w.title}`}>
                  <td className="whitespace-nowrap px-5 py-3.5 align-top font-[family-name:var(--font-mono)] text-[13px] text-ink-soft">{w.year}</td>
                  <td className="px-5 py-3.5 text-ink">
                    {w.title}
                    <span className="mt-0.5 block text-[13.5px] text-ink-soft sm:hidden">{w.country}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-ink-soft sm:table-cell">{w.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-[var(--radius-paper)] border border-rule bg-paper-raised p-8 sm:p-12">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          <h2 className="max-w-[20ch] font-[family-name:var(--font-serif)] text-display-l font-medium tracking-[-0.03em] text-ink">
            {aboutCopy.contact.h2}
          </h2>
          <p className="measure mt-4 text-[17px] text-ink-soft">{aboutCopy.contact.body}</p>
          <div className="mt-8">
            <ContactButtons />
          </div>
        </div>
      </Section>
    </>
  );
}
