// Touch browsers do not reliably turn a long press into a contextmenu event
// (iOS Safari never does for ordinary elements). Holding a finger still for
// HOLD_MS dispatches one at the touch point, so every right-click menu on
// the desktop works by touch. The click that follows the release is
// swallowed so the long press does not also open the item.

const HOLD_MS = 520;
const MOVE_TOLERANCE = 10;

export function installLongPress(doc: Document): () => void {
  let timer: number | undefined;
  let start: { x: number; y: number; target: EventTarget | null } | null = null;
  let nativeFired = false;
  let swallowClick = false;

  const cancel = () => {
    window.clearTimeout(timer);
    start = null;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    cancel();
    nativeFired = false;
    start = { x: e.clientX, y: e.clientY, target: e.target };
    timer = window.setTimeout(() => {
      if (!start || nativeFired) return;
      const target = start.target as Element | null;
      if (!target || target.closest("input,textarea,[contenteditable],iframe")) return;
      swallowClick = true;
      target.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: start.x, clientY: start.y, button: 2 }),
      );
      navigator.vibrate?.(12);
      start = null;
    }, HOLD_MS);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_TOLERANCE) cancel();
  };

  const onContextMenu = (e: Event) => {
    // Android fires its own contextmenu on long press; use it and skip ours.
    if (e.isTrusted && start) {
      nativeFired = true;
      swallowClick = true;
    }
  };

  const onClick = (e: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerUp = () => {
    window.clearTimeout(timer);
    start = null;
    // A click only follows a release; clear the flag if none comes.
    if (swallowClick) window.setTimeout(() => (swallowClick = false), 400);
  };

  doc.addEventListener("pointerdown", onPointerDown, true);
  doc.addEventListener("pointermove", onPointerMove, true);
  doc.addEventListener("pointerup", onPointerUp, true);
  doc.addEventListener("pointercancel", cancel, true);
  doc.addEventListener("contextmenu", onContextMenu, true);
  doc.addEventListener("click", onClick, true);
  return () => {
    cancel();
    doc.removeEventListener("pointerdown", onPointerDown, true);
    doc.removeEventListener("pointermove", onPointerMove, true);
    doc.removeEventListener("pointerup", onPointerUp, true);
    doc.removeEventListener("pointercancel", cancel, true);
    doc.removeEventListener("contextmenu", onContextMenu, true);
    doc.removeEventListener("click", onClick, true);
  };
}
