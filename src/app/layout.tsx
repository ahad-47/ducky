import type { Metadata } from "next";
import { headers } from "next/headers";
import { dmSans, ibmPlexMono } from "@/fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import { OSShell } from "@/components/os/OSShell";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { facts } from "@/content/facts";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "SkilledScan | Expert-led penetration testing",
    template: "%s",
  },
  description:
    "A penetration testing practice where a governed system does the groundwork and a working tester verifies every finding. Reports your developers and your auditor can both use.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: facts.brand.name,
    url: facts.brand.url,
    description: facts.brand.oneLiner,
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          nonce={nonce}
          // Built only from facts via JSON.stringify, per the brief's CSP policy.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <SkipLink />
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
              className="ambient-blob absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full opacity-40 blur-[120px]"
              style={{ background: "radial-gradient(circle, #3d5fde 0%, transparent 70%)" }}
            />
            <div
              className="ambient-blob absolute -right-[15%] top-[30%] h-[45vw] w-[45vw] rounded-full opacity-30 blur-[120px]"
              style={{
                background: "radial-gradient(circle, #5eead4 0%, transparent 70%)",
                animationDelay: "-9s",
              }}
            />
          </div>
          <OSShell>{children}</OSShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
