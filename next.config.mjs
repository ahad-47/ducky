// Plain JavaScript on purpose: Hostinger's build servers run a glibc too old
// for Next's native compiler, and the WebAssembly fallback fails to load a
// TypeScript config. See the "build" script for the matching --webpack flag.

// Sitemap paths left over from the old WordPress site. Search Console still
// tries them, so they point permanently at the current sitemap.
const oldSitemaps = [
  "/sitemap_index.xml",
  "/page-sitemap.xml",
  "/post-sitemap.xml",
  "/pxl-template-sitemap.xml",
  "/wp-sitemap.xml",
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return oldSitemaps.map((source) => ({ source, destination: "/sitemap.xml", permanent: true }));
  },
};

export default nextConfig;
