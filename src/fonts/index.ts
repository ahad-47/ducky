import { DM_Sans, IBM_Plex_Mono } from "next/font/google";

// If any of these fail to fetch at build time, the build fails. This is
// intentional: no silent runtime fallback to a system font.
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: false,
});
