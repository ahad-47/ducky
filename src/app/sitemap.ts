import type { MetadataRoute } from "next";
import { siteMap } from "@/content/site-map";
import { facts } from "@/content/facts";
import { env } from "@/lib/env";

// Built from src/content/site-map.ts. The arcade is left out on purpose:
// it is not content anyone searches for, and it is marked noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  return siteMap.flatMap(({ pages }) =>
    pages.map((page) => ({
      url: `${base}${page.path === "/" ? "" : page.path}`,
      lastModified: new Date(`${page.updated}T00:00:00Z`),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.path === "/about" ? { images: [`${base}${facts.founder.photo}`] } : {}),
    })),
  );
}
