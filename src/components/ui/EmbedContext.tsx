"use client";

import { createContext, useContext } from "react";

// True when the page is rendering inside one of the desktop's browser
// windows (set by the root layout from the request).
const EmbedContext = createContext(false);

// True for the copy of the page that a top-level request carries for
// crawlers and no-JS visitors. It sits hidden under the desktop once
// scripts run, so animated or interactive parts render a still version.
const StaticContext = createContext(false);

export function EmbedProvider({
  embedded,
  staticRender = false,
  children,
}: {
  embedded: boolean;
  staticRender?: boolean;
  children: React.ReactNode;
}) {
  return (
    <EmbedContext.Provider value={embedded}>
      <StaticContext.Provider value={staticRender}>{children}</StaticContext.Provider>
    </EmbedContext.Provider>
  );
}

export function useEmbedded() {
  return useContext(EmbedContext);
}

export function useStaticRender() {
  return useContext(StaticContext);
}
