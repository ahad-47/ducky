import { Hero } from "@/components/sections/Hero";
import { ProofLine } from "@/components/sections/ProofLine";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ReportTeaser } from "@/components/sections/ReportTeaser";
import { EngagementsTeaser } from "@/components/sections/EngagementsTeaser";
import { GlobalReach } from "@/components/sections/GlobalReachLazy";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { homeCopy } from "@/content/copy/home";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "SkilledScan | Expert-led penetration testing",
  description:
    "A penetration testing practice where a governed system does the groundwork and a working tester verifies every finding. Reports your developers and your auditor can both use.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProofLine />
      <Problem />
      <HowItWorks />
      <ReportTeaser />
      <EngagementsTeaser />
      <GlobalReach />
      <ClosingCta
        h2={homeCopy.closing.h2}
        body={homeCopy.closing.body}
        primaryCta={homeCopy.closing.primaryCta}
      />
    </>
  );
}
