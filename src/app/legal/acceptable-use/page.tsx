import { LegalPage } from "@/components/sections/LegalPage";
import { acceptableUseCopy } from "@/content/copy/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Acceptable use policy | SkilledScan",
  description: "Authorized targets only, and what is not allowed.",
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
