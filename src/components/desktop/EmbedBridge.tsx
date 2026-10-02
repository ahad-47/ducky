"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { installTouchKeyboardGuard } from "@/components/desktop/touchKeyboard";

// Runs inside a browser window's frame. Reports navigation and title changes
// to the desktop, raises the window on click, and forwards OS shortcuts so
// they work while the page has keyboard focus.
export function EmbedBridge() {
  const pathname = usePathname();

  // Forms inside windows follow the desktop's touch rule: a text field
  // raises the keyboard only on a second tap.
  useEffect(() => {
    if (window.parent === window) return;
    return installTouchKeyboardGuard(document);
  }, []);

  useEffect(() => {
    if (window.parent === window) return;
    const params = new URLSearchParams(window.location.search);
    params.delete("embed");
    const query = params.toString();
    window.parent.postMessage(
      { type: "os:nav", route: pathname + (query ? `?${query}` : ""), title: document.title },
      window.location.origin,
    );
  }, [pathname]);

  useEffect(() => {
    if (window.parent === window) return;
    const post = (msg: object) => window.parent.postMessage(msg, window.location.origin);

    const titleObserver = new MutationObserver(() => post({ type: "os:title", title: document.title }));
    titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });

    const onPointerDown = () => post({ type: "os:focus" });
    const onKeyDown = (e: KeyboardEvent) => {
      const shortcut =
        (e.ctrlKey && e.altKey && (e.key === "t" || e.key === "T")) ||
        (e.ctrlKey && e.key === "`") ||
        (e.key === "Meta" && !e.repeat);
      if (shortcut) {
        if (e.key !== "Meta") e.preventDefault();
        post({ type: "os:key", key: e.key, ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey });
      }
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      titleObserver.disconnect();
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
