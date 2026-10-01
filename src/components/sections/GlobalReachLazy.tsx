"use client";

import dynamic from "next/dynamic";

// react-simple-maps computes projection math that can round a few trailing
// digits differently between server and client, causing a hydration
// mismatch. It's a visualization with no meaningful server-rendered state,
// so it's loaded client-only. `ssr: false` requires a Client Component.
export const GlobalReach = dynamic(
  () => import("@/components/sections/GlobalReach").then((m) => m.GlobalReach),
  { ssr: false },
);
