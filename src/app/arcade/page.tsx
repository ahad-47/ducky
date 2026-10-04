import { ArcadeSection } from "@/components/sections/ArcadeSection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Arcade | SkilledScan",
  description: "Five small browser games from the SkilledScan desktop: Snake, 2048, Minesweeper, Memory and Breakout.",
  path: "/arcade",
});

export default function ArcadePage() {
  return <ArcadeSection />;
}
