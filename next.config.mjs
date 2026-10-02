// Plain JavaScript on purpose: Hostinger's build servers run a glibc too old
// for Next's native compiler, and the WebAssembly fallback fails to load a
// TypeScript config. See the "build" script for the matching --webpack flag.

/** @type {import("next").NextConfig} */
const nextConfig = {};

export default nextConfig;
