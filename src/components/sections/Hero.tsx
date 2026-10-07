import { RevealHeading } from "@/components/ui/RevealHeading";
import { Container } from "@/components/ui/Container";
import { PrimaryButton, SecondaryLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/PageHeader";
import { HeroSignal } from "@/components/hero/HeroSignal";
import { WindowChrome } from "@/components/os/WindowChrome";
import { homeCopy } from "@/content/copy/home";

export function Hero() {
  return (
    <section className="pb-[calc(var(--section-padding)*0.6)] pt-[calc(var(--section-padding)*0.7)]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>{homeCopy.hero.eyebrow}</Eyebrow>
            <RevealHeading className="mt-4 font-[family-name:var(--font-serif)] text-display-xl text-ink">
              {homeCopy.hero.h1}
            </RevealHeading>
            <p className="measure mt-6 text-[18px] text-ink-soft">{homeCopy.hero.subhead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <PrimaryButton href="/contact">{homeCopy.hero.primaryCta}</PrimaryButton>
              <SecondaryLink href="/report-sample">{homeCopy.hero.secondaryCta}</SecondaryLink>
            </div>
          </div>
          <div data-motion="hero-visual" className="glass-strong rounded-[var(--radius-paper)] p-5">
            <WindowChrome title="scan.live" />
            <HeroSignal />
            <p className="mt-4 text-[15px] text-ink-soft">{homeCopy.hero.caption}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
