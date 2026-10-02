import localFont from "next/font/local";

// Self-hosted (latin subset) so builds never depend on reaching Google
// Fonts: a failed fetch there used to fail the whole build. All three are
// SIL Open Font License 1.1; see LICENSE.txt.
export const dmSans = localFont({
  src: "./dm-sans-400-800.woff2",
  weight: "400 800",
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const ibmPlexMono = localFont({
  src: [
    { path: "./ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: false,
});

// Logo wordmark: SKILLED in ExtraBold (800), SCAN in Light (300).
export const montserrat = localFont({
  src: "./montserrat-300-800.woff2",
  weight: "300 800",
  variable: "--font-logo",
  display: "swap",
  preload: true,
});
