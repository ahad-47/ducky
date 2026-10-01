"use client";

import dynamic from "next/dynamic";

// The desktop depends on viewport size and browser storage from its first
// render, so it renders on the client only.
export const DesktopClient = dynamic(() => import("@/components/desktop/Desktop").then((m) => m.Desktop), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});
