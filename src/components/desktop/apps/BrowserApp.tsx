"use client";

import { useEffect, useRef, useState } from "react";
import { Glyph } from "@/components/desktop/icons";
import { fileForRoute, getFs, pages, resolvePath, DESKTOP } from "@/components/desktop/fs";
import { useOS, useWin } from "@/components/desktop/wm";

function addressFor(route: string): string {
  const path = fileForRoute(route);
  return path.startsWith("/") && path.endsWith(".html") ? `file://${path}` : `skilledscan.com${route}`;
}

// Turn whatever is typed in the address bar into a site route.
function routeFromInput(raw: string): string | { external: string } {
  let input = raw.trim();
  if (!input) return "/";
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (url.hostname === window.location.hostname || url.hostname.endsWith("skilledscan.com")) {
        input = url.pathname;
      } else {
        return { external: url.href };
      }
    } catch {
      return "/__not-found";
    }
  }
  input = input.replace(/^file:\/\//, "").replace(/^skilledscan\.com/, "");
  if (input.endsWith(".html")) {
    const path = input.startsWith("/") ? input : resolvePath(DESKTOP, input);
    const node = getFs()[path];
    if (node && node.type === "file" && node.kind === "html") return node.route;
    const byName = pages.find((p) => p.file === input || p.file.endsWith("/" + input));
    if (byName) return byName.route;
    return "/__not-found";
  }
  if (!input.startsWith("/")) input = "/" + input;
  return input;
}

export function BrowserApp() {
  const os = useOS();
  const win = useWin();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const initial = typeof win.props.route === "string" ? win.props.route : "/";
  const [src] = useState(() => `${initial}${initial.includes("?") ? "&" : "?"}embed=1`);
  const [route, setRoute] = useState(initial);
  const [address, setAddress] = useState(() => addressFor(initial));
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const pending = useRef(initial);
  const retries = useRef(0);
  const [stack, setStack] = useState<{ entries: string[]; index: number }>({ entries: [initial], index: 0 });
  const travelling = useRef(false);
  const activeRef = useRef(false);
  useEffect(() => {
    activeRef.current = os.activeId === win.id;
  }, [os.activeId, win.id]);

  function navigate(target: string) {
    const frame = frameRef.current;
    if (!frame?.contentWindow) return;
    setLoading(true);
    setFailed(false);
    if (pending.current !== target) retries.current = 0;
    pending.current = target;
    const url = `${target}${target.includes("?") ? "&" : "?"}embed=1`;
    try {
      frame.contentWindow.location.replace(url);
    } catch {
      frame.src = url;
    }
  }

  function go(delta: number) {
    const index = stack.index + delta;
    if (index < 0 || index >= stack.entries.length) return;
    travelling.current = true;
    setStack({ ...stack, index });
    navigate(stack.entries[index]);
  }

  // Messages from the page running inside this window's frame.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== frameRef.current?.contentWindow || e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; route?: string; title?: string };
      if (data.type === "os:nav" && typeof data.route === "string") {
        const next = data.route;
        setRoute(next);
        setLoading(false);
        if (!editing) setAddress(addressFor(next));
        if (data.title) os.setTitle(win.id, data.title);
        setStack((s) => {
          if (travelling.current) {
            travelling.current = false;
            return s;
          }
          if (s.entries[s.index] === next) return s;
          const entries = [...s.entries.slice(0, s.index + 1), next];
          return { entries, index: entries.length - 1 };
        });
        if (activeRef.current) window.history.replaceState(null, "", next);
      } else if (data.type === "os:title" && data.title) {
        os.setTitle(win.id, data.title);
      } else if (data.type === "os:focus") {
        os.focus(win.id);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, win.id]);

  useEffect(() => {
    if (os.activeId === win.id) window.history.replaceState(null, "", route);
  }, [os.activeId, win.id, route]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const target = routeFromInput(address);
    setEditing(false);
    (document.activeElement as HTMLElement | null)?.blur();
    if (typeof target === "object") {
      window.open(target.external, "_blank", "noopener,noreferrer");
      setAddress(addressFor(route));
      return;
    }
    navigate(target);
  }

  const canBack = stack.index > 0;
  const canForward = stack.index < stack.entries.length - 1;

  return (
    <div className="flex h-full flex-col bg-[var(--os-surface)]">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-[var(--os-border)] px-2">
        <button type="button" className="os-tbtn" aria-label="Back" disabled={!canBack} onClick={() => go(-1)}>
          <Glyph.Back className="h-4 w-4" />
        </button>
        <button type="button" className="os-tbtn" aria-label="Forward" disabled={!canForward} onClick={() => go(1)}>
          <Glyph.Forward className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="os-tbtn"
          aria-label={loading ? "Stop" : "Reload"}
          onClick={() => {
            if (loading) {
              frameRef.current?.contentWindow?.stop();
              setLoading(false);
            } else navigate(route);
          }}
        >
          {loading ? <Glyph.Stop className="h-4 w-4" /> : <Glyph.Reload className="h-4 w-4" />}
        </button>
        <button type="button" className="os-tbtn" aria-label="Home" onClick={() => navigate("/")}>
          <Glyph.Home className="h-4 w-4" />
        </button>
        <form onSubmit={submit} className="mx-1 min-w-0 flex-1">
          <label className="os-address flex h-8 items-center gap-2 rounded-full px-3">
            <Glyph.Lock className="h-3.5 w-3.5 shrink-0 text-[var(--os-muted)]" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={(e) => {
                setEditing(true);
                e.currentTarget.select();
              }}
              onBlur={() => {
                setEditing(false);
                setAddress(addressFor(route));
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") e.currentTarget.blur();
              }}
              spellCheck={false}
              aria-label="Address"
              className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--os-fg)] outline-none"
            />
          </label>
        </form>
        <button
          type="button"
          className="os-tbtn"
          aria-label="Open in new window"
          title="Open in new window"
          onClick={() => os.open("browser", { route })}
        >
          <Glyph.NewWindow className="h-4 w-4" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#0b1120]">
        {loading ? <div className="os-progress absolute inset-x-0 top-0 z-10 h-0.5" /> : null}
        <iframe
          ref={frameRef}
          src={src}
          title={win.title}
          className="h-full w-full border-0"
          onLoad={() => {
            setLoading(false);
            let doc: Document | null | undefined;
            try {
              doc = frameRef.current?.contentDocument;
            } catch {
              doc = null;
            }
            // Every site page renders <main id="main">. An empty or foreign
            // document means the server refused the request (for example a
            // CDN rate limit answering 429 with no body), which would
            // otherwise show as a blank white window.
            if (!doc?.getElementById("main")) {
              setFailed(true);
              if (retries.current < 2) {
                retries.current += 1;
                window.setTimeout(() => navigate(pending.current), 1500 * retries.current);
              }
              return;
            }
            retries.current = 0;
            setFailed(false);
            if (doc.title) os.setTitle(win.id, doc.title);
          }}
        />
        {failed ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0b1120] p-6 text-center">
            <p className="text-[15px] font-semibold text-[var(--os-fg)]">This page did not load</p>
            <p className="max-w-sm text-[13px] text-[var(--os-muted)]">
              {loading
                ? "Retrying…"
                : "The server returned an empty response. This usually clears up after a few seconds."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="os-pill os-pill-accent"
                onClick={() => {
                  retries.current = 0;
                  navigate(pending.current);
                }}
              >
                Try again
              </button>
              <button
                type="button"
                className="os-pill"
                onClick={() => {
                  const t = pending.current;
                  window.open(`${t}${t.includes("?") ? "&" : "?"}embed=1`, "_blank", "noopener,noreferrer");
                }}
              >
                Open in a tab
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
