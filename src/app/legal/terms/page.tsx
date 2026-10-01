import { LegalPage } from "@/components/sections/LegalPage";
import { termsCopy } from "@/content/copy/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use | SkilledScan",
  description: "Terms for using skilledscan.com.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      h1={termsCopy.h1}
      lastUpdated={termsCopy.lastUpdated}
      sections={termsCopy.sections}
    />
  );
}
