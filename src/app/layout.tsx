import type { Metadata } from "next";
import { headers } from "next/headers";
import { dmSans, ibmPlexMono } from "@/fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import { DesktopClient } from "@/components/desktop/DesktopClient";
import { EmbedBridge } from "@/components/desktop/EmbedBridge";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { pages } from "@/components/desktop/pages";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { facts } from "@/content/facts";
import { appSignInUrl, env } from "@/lib/env";
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
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  // Top-level visits get the desktop; pages inside its browser windows
  // (iframes, flagged by src/proxy.ts) render as plain pages.
  const embedded = requestHeaders.get("x-os-embed") === "1";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: facts.brand.name,
    url: facts.brand.url,
    description: facts.brand.oneLiner,
  };

  const structuredData = (
    <script
      type="application/ld+json"
      nonce={nonce}
      // Built only from facts via JSON.stringify, per the brief's CSP policy.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );

  if (!embedded) {
    return (
      <html lang="en" className={`${dmSans.variable} ${ibmPlexMono.variable} h-full`}>
        <body className="h-full overflow-hidden bg-black text-ink">
          {structuredData}
          <noscript>
            <div className="p-8">
              <p className="mb-4">SkilledScan OS needs JavaScript. The pages are available directly:</p>
              <ul className="list-disc pl-6">
                {pages.map((p) => (
                  <li key={p.route}>
                    <a className="underline" href={`${p.route}?embed=1`}>
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </noscript>
          <DesktopClient />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {structuredData}
        <EmbedBridge />
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
          <SiteHeader signInUrl={appSignInUrl} />
          <main id="main" className="relative flex-1">
            {children}
          </main>
          <div className="relative">
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
