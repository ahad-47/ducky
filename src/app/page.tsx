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
  title: "Web Application & API Security Scanner | SkilledScan",
  description:
    "SkilledScan is a web application and API security scanner that reproduces every finding before it is reported. Each one comes with evidence and a fix.",
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
