import { Hero } from "@/components/sections/Hero";
import { ProofLine } from "@/components/sections/ProofLine";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ReportTeaser } from "@/components/sections/ReportTeaser";
import { EngagementsTeaser } from "@/components/sections/EngagementsTeaser";
import { GlobalReach } from "@/components/sections/GlobalReachLazy";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { homeCopy } from "@/content/copy/home";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "SkilledScan | Web and API security scanning",
  description:
    "SkilledScan maps your attack surface, runs approved security checks under strict limits, and reports only confirmed findings, with evidence and a fix for each.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProofLine />
      <Problem />
      <Features />
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
