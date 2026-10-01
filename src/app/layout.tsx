import type { Metadata } from "next";
import { headers } from "next/headers";
import { instrumentSerif, dmSans, ibmPlexMono } from "@/fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { facts } from "@/content/facts";
import { env, appSignInUrl } from "@/lib/env";
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
    areaServed: facts.practitioner.clientCountries,
    address: {
      "@type": "PostalAddress",
      addressLocality: facts.brand.city,
      addressRegion: facts.brand.region,
      addressCountry: facts.brand.countryCode,
    },
    founder: {
      "@type": "Person",
      name: facts.practitioner.name,
      sameAs: [facts.practitioner.profileUrl],
    },
  };

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          nonce={nonce}
          // Built only from facts via JSON.stringify, per the brief's CSP policy.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipLink />
        <Header signInUrl={appSignInUrl} />
        <main id="main" className="relative flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
          >
            <div className="mx-auto h-full max-w-[var(--content-max)] px-[var(--side-padding)]">
              <div className="h-full border-l border-rule" />
            </div>
          </div>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
