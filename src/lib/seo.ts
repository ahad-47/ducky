import type { Metadata } from "next";
import { env } from "@/lib/env";
import { facts } from "@/content/facts";

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${env.NEXT_PUBLIC_SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: facts.brand.name,
      type: "website",
      images: [`${path === "/" ? "" : path}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${path === "/" ? "" : path}/opengraph-image`],
    },
  };
}
