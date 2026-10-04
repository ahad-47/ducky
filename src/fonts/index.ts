import localFont from "next/font/local";

// Self-hosted (latin subset) so builds never depend on reaching Google
// Fonts: a failed fetch there used to fail the whole build. All are SIL
// Open Font License 1.1; see LICENSE.txt.
export const geistSans = localFont({
  src: "./geist-sans-variable.woff2",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

export const geistMono = localFont({
  src: "./geist-mono-variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
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
