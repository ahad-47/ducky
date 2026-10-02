// On touch screens, focusing a text field normally raises the on-screen
// keyboard, which covers half the screen. Here every text field is given
// inputmode="none" so it can take focus (caret, selection, programmatic
// focus) without the keyboard. A second tap on the same field within
// DOUBLE_TAP_MS unlocks it and refocuses inside that tap, which is a user
// gesture, so the keyboard opens. Leaving the field locks it again.
// Fields inside [data-keyboard="always"] (the terminal) are never locked.

const TEXT_FIELDS =
  'input:not([type]),input[type="text"],input[type="search"],input[type="email"],input[type="url"],input[type="tel"],input[type="password"],input[type="number"],textarea';
const DOUBLE_TAP_MS = 450;

type Field = HTMLInputElement | HTMLTextAreaElement;

export function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function installTouchKeyboardGuard(doc: Document): () => void {
  if (!isTouchDevice()) return () => {};

  const exempt = (el: Element) => !!el.closest('[data-keyboard="always"]');

  const lock = (el: Field) => {
    if (exempt(el) || el.dataset.kbUnlocked === "1") return;
    if (el.dataset.kbLocked !== "1") {
      el.dataset.kbPrev = el.getAttribute("inputmode") ?? "";
      el.dataset.kbLocked = "1";
    }
    el.setAttribute("inputmode", "none");
  };

  const unlock = (el: Field) => {
    const prev = el.dataset.kbPrev;
    if (prev) el.setAttribute("inputmode", prev);
    else el.removeAttribute("inputmode");
    el.dataset.kbUnlocked = "1";
    delete el.dataset.kbLocked;
  };

  const lockAll = (root: ParentNode) => {
    root.querySelectorAll<Field>(TEXT_FIELDS).forEach(lock);
  };

  lockAll(doc);
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if ((n as Element).matches(TEXT_FIELDS)) lock(n as Field);
        lockAll(n as Element);
      });
    }
  });
  observer.observe(doc.documentElement, { childList: true, subtree: true });

  let lastTarget: Field | null = null;
  let lastTime = 0;

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    const field = (e.target as Element | null)?.closest?.(TEXT_FIELDS) as Field | null;
    if (!field || exempt(field) || field.readOnly || field.disabled) {
      lastTarget = null;
      return;
    }
    const now = performance.now();
    if (field === lastTarget && now - lastTime < DOUBLE_TAP_MS && field.dataset.kbUnlocked !== "1") {
      unlock(field);
      // Refocus inside the tap so the browser treats it as user-initiated.
      field.blur();
      field.focus();
      lastTarget = null;
      return;
    }
    lastTarget = field;
    lastTime = now;
  };

  const onFocusOut = (e: FocusEvent) => {
    const field = e.target as Element | null;
    if (field && field.matches?.(TEXT_FIELDS) && (field as Field).dataset.kbUnlocked === "1") {
      // Relock once focus has really left (blur+focus during unlock fires this too).
      window.setTimeout(() => {
        if (doc.activeElement === field) return;
        delete (field as Field).dataset.kbUnlocked;
        lock(field as Field);
      }, 0);
    }
  };

  // React's autoFocus focuses a new field before the observer has seen it.
  // Lock it and refocus so the keyboard does not stay up.
  const onFocusIn = (e: FocusEvent) => {
    const field = e.target as Element | null;
    if (!field || !field.matches?.(TEXT_FIELDS) || exempt(field)) return;
    const f = field as Field;
    if (f.dataset.kbLocked === "1" || f.dataset.kbUnlocked === "1") return;
    lock(f);
    f.blur();
    f.focus({ preventScroll: true });
  };

  doc.addEventListener("pointerup", onPointerUp, true);
  doc.addEventListener("focusout", onFocusOut, true);
  doc.addEventListener("focusin", onFocusIn, true);
  return () => {
    observer.disconnect();
    doc.removeEventListener("pointerup", onPointerUp, true);
    doc.removeEventListener("focusout", onFocusOut, true);
    doc.removeEventListener("focusin", onFocusIn, true);
  };
}
