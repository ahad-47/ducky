"use client";

import type { AnchorHTMLAttributes } from "react";
import { useEmbedded } from "@/components/ui/EmbedContext";

// A plain <a> used in place of next/link across the site. Every click is a
// normal page load, so the site never asks the server for Next.js's
// client-navigation payloads. A CDN that ignores cache headers once served
// one of those payloads (text/x-component) to a phone as the home page,
// which the browser offered as a "document.txt" download.
// Inside a desktop window, internal links keep ?embed=1 so the next page
// also renders bare, including on browsers without Sec-Fetch-Dest.
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean };

export default function SiteLink({ href, prefetch, ...rest }: Props) {
  void prefetch;
  const embedded = useEmbedded();
  return <a href={embedded ? withEmbed(href) : href} {...rest} />;
}

function withEmbed(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api")) return href;
  const hashAt = href.indexOf("#");
  const base = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? "" : href.slice(hashAt);
  if (/[?&]embed=1(&|$)/.test(base)) return href;
  return `${base}${base.includes("?") ? "&" : "?"}embed=1${hash}`;
}
