"use client";

import dynamic from "next/dynamic";
import { useStaticRender } from "@/components/ui/EmbedContext";

// react-simple-maps computes projection math that can round a few trailing
// digits differently between server and client, causing a hydration
// mismatch. It's a visualization with no meaningful server-rendered state,
// so it's loaded client-only. `ssr: false` requires a Client Component.
const Map = dynamic(
  () => import("@/components/sections/GlobalReach").then((m) => m.GlobalReach),
  { ssr: false },
);

export function GlobalReach() {
  // The hidden static copy of the page never loads the map.
  return useStaticRender() ? null : <Map />;
}
