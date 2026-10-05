import { LegalPage } from "@/components/sections/LegalPage";
import { acceptableUseCopy } from "@/content/copy/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Acceptable use policy | SkilledScan",
  description: "SkilledScan acceptable use policy: scan only targets you own or have written permission to test, what is not allowed, and how misuse is handled.",
  path: "/legal/acceptable-use",
});

export default function AcceptableUsePage() {
  return (
    <LegalPage
      h1={acceptableUseCopy.h1}
      lastUpdated={acceptableUseCopy.lastUpdated}
      sections={acceptableUseCopy.sections}
    />
  );
}
