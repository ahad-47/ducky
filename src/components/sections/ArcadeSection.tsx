import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/PageHeader";
import { Arcade } from "@/components/games/Arcade";

export function ArcadeSection() {
  return (
    <Section id="arcade">
      <SectionHeading
        eyebrow="Arcade"
        title="Games"
        intro="Five small games that run right here, with a keyboard, a mouse, or a touch screen. Best scores stay in this browser."
      />
      <div className="mt-10">
        <Arcade />
      </div>
    </Section>
  );
}
