import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const routes = [
  "/",
  "/method",
  "/engagements",
  "/report-sample",
  "/compliance",
  "/roadmap",
  "/scanner",
  "/faq",
  "/contact",
  "/security",
  "/legal/privacy",
  "/legal/terms",
  "/legal/acceptable-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
