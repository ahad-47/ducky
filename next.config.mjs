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

// Next injects inline bootstrap scripts and styles, so those need
// 'unsafe-inline'. Everything else is limited to this origin, which still
// blocks scripts, frames and form posts from anywhere else.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The desktop shell frames its own pages, so same-origin framing stays.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return oldSitemaps.map((source) => ({ source, destination: "/sitemap.xml", permanent: true }));
  },
};

export default nextConfig;
