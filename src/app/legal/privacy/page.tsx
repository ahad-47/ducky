import { LegalPage } from "@/components/sections/LegalPage";
import { privacyCopy } from "@/content/copy/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy | SkilledScan",
  description: "What skilledscan.com collects and why.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      h1={privacyCopy.h1}
      lastUpdated={privacyCopy.lastUpdated}
      sections={privacyCopy.sections}
    />
  );
}
