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

// Zoom stays available (WCAG 1.4.4). iOS zooming into focused inputs is
// avoided with 16px inputs on touch screens instead (globals.css). The
// shell draws under the notch and home indicator and pads for itself.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0d0f",
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

  const path = requestHeaders.get("x-os-path") ?? "/";
  const page = pages.find((p) => p.route === path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${facts.brand.url}/#organization`,
        name: facts.brand.name,
        url: facts.brand.url,
        logo: `${facts.brand.url}/apple-icon`,
        email: facts.brand.email,
        description: facts.brand.oneLiner,
        founder: { "@type": "Person", name: facts.founder.name },
      },
      {
        "@type": "WebSite",
        "@id": `${facts.brand.url}/#website`,
        name: facts.brand.name,
        url: facts.brand.url,
        publisher: { "@id": `${facts.brand.url}/#organization` },
      },
      ...(page && page.route !== "/"
        ? [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: facts.brand.url },
                { "@type": "ListItem", position: 2, name: page.title, item: `${facts.brand.url}${page.route}` },
              ],
            },
          ]
        : []),
    ],
  };

  // Cloudflare's email obfuscation rewrites addresses into
  // /cdn-cgi/l/email-protection links that crawlers cannot read. These
  // documented markers switch it off for everything between them.
  const emailOff = <span hidden dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }} />;
  const emailOn = <span hidden dangerouslySetInnerHTML={{ __html: "<!--/email_off-->" }} />;

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
          {emailOff}
          {structuredData}
          {/* The page itself, rendered on the server for crawlers and for
              browsers without JavaScript. With scripts on it stays hidden
              under the desktop, which opens the same page in a window. */}
          <noscript>
            <style>{`.ssr-page{display:block}.desktop-boot{display:none}body{height:auto;overflow:auto;background:var(--paper)}`}</style>
          </noscript>
          <EmbedProvider embedded={false} staticRender>
            <div className="ssr-page relative hidden min-h-full flex-col bg-paper">
              <SkipLink />
              <SiteHeader signInUrl={appSignInUrl} />
              <main id="main" className="relative flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </EmbedProvider>
          <DesktopClient />
          {emailOn}
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
        {emailOff}
        {structuredData}
        <EmbedBridge />
        <EmbedProvider embedded>
          <SmoothScroll>
            <SkipLink />
            <div
              aria-hidden
              className="page-backdrop pointer-events-none absolute inset-x-0 top-0 h-[900px]"
            />
            <SiteHeader signInUrl={appSignInUrl} />
            <main id="main" className="relative flex-1">
              {children}
            </main>
            <div className="relative">
              <Footer />
            </div>
          </SmoothScroll>
        </EmbedProvider>
        {emailOn}
      </body>
    </html>
  );
}
