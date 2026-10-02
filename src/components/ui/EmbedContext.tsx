"use client";

import { createContext, useContext } from "react";

// True when the page is rendering inside one of the desktop's browser
// windows (set by the root layout from the request).
const EmbedContext = createContext(false);

export function EmbedProvider({ embedded, children }: { embedded: boolean; children: React.ReactNode }) {
  return <EmbedContext.Provider value={embedded}>{children}</EmbedContext.Provider>;
}

export function useEmbedded() {
  return useContext(EmbedContext);
}
