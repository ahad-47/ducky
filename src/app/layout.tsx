import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { dmSans, ibmPlexMono, montserrat } from "@/fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import { DesktopClient } from "@/components/desktop/DesktopClient";
import { EmbedBridge } from "@/components/desktop/EmbedBridge";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EmbedProvider } from "@/components/ui/EmbedContext";
import { pages } from "@/components/desktop/pages";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { facts } from "@/content/facts";
import { appSignInUrl, env } from "@/lib/env";
import "./globals.css";

// The desktop is an app surface, not a document: no pinch or double-tap
// zoom (which also stops iOS zooming into focused inputs), and draw under
// the notch and home indicator, which the shell pads for itself.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "SkilledScan | Web and API security scanning",
    template: "%s",
  },
  description:
    "SkilledScan maps your attack surface, runs approved security checks under strict limits, and reports only confirmed findings, with evidence and a fix for each.",
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
      <html
        lang="en"
        className={`${dmSans.variable} ${ibmPlexMono.variable} ${montserrat.variable} h-full`}
      >
        <body className="h-full overflow-hidden bg-black text-ink">
          {structuredData}
          <noscript>
            <div className="p-8">
              <p className="mb-4">
                SkilledScan OS needs JavaScript. The pages are available
                directly:
              </p>
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
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexMono.variable} ${montserrat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {structuredData}
        <EmbedBridge />
        <EmbedProvider embedded>
          <SmoothScroll>
            <SkipLink />
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 overflow-hidden"
            >
              <div
                className="ambient-blob absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full opacity-40 blur-[120px]"
                style={{
                  background:
                    "radial-gradient(circle, #3d5fde 0%, transparent 70%)",
                }}
              />
              <div
                className="ambient-blob absolute -right-[15%] top-[30%] h-[45vw] w-[45vw] rounded-full opacity-30 blur-[120px]"
                style={{
                  background:
                    "radial-gradient(circle, #5eead4 0%, transparent 70%)",
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
        </EmbedProvider>
      </body>
    </html>
  );
}
