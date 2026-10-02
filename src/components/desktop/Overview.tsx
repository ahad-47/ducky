"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apps, gameApps, type AppId } from "@/components/desktop/apps/registry";
import { DESKTOP, HOME, getFs, pages, prettyPath, type FsNode } from "@/components/desktop/fs";
import { AppIcon, FileIcon, Glyph } from "@/components/desktop/icons";
import { useOS } from "@/components/desktop/wm";

type Result = { key: string; label: string; sub?: string; icon: React.ReactNode; run: () => void };

export function Overview({ onClose }: { onClose: () => void }) {
  const os = useOS();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const appResults: Result[] = (Object.keys(apps) as AppId[]).map((id) => ({
    key: `app:${id}`,
    label: apps[id].name,
    icon: <AppIcon app={id} size={56} />,
    run: () => os.open(id),
  }));

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    const matchApps = appResults.filter((r) => {
      const meta = apps[r.key.slice(4) as AppId];
      return meta.name.toLowerCase().includes(query) || meta.keywords.some((k) => k.includes(query));
    });
    const files: Result[] = [];
    for (const [path, node] of Object.entries(getFs())) {
      if (!path.startsWith(HOME) || path.includes("/.")) continue;
      const name = path.slice(path.lastIndexOf("/") + 1);
      const page = node.type === "file" && node.kind === "html" ? pages.find((p) => p.route === node.route) : undefined;
      if (!name.toLowerCase().includes(query) && !page?.title.toLowerCase().includes(query)) continue;
      files.push({
        key: path,
        label: name,
        sub: prettyPath(path),
        icon: <FileIcon node={node as FsNode} name={name} size={40} />,
        run: () => os.openPath(path),
      });
    }
    return { apps: matchApps, files: files.slice(0, 12) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function runFirst() {
    const first = results ? [...results.apps, ...results.files][0] : undefined;
    if (first) {
      onClose();
      first.run();
    }
  }

  const launch = (r: Result) => {
    onClose();
    r.run();
  };

  return (
    <div
      className="os-overview absolute inset-0 z-[4800] overflow-y-auto px-4 pb-24 pt-14"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="mx-auto mb-8 flex max-w-md items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-[var(--os-accent)]">
        <Glyph.Search className="h-4 w-4 text-white/60" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runFirst()}
          placeholder="Type to search apps and files"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/50"
        />
      </div>

      {results ? (
        <div className="mx-auto max-w-3xl space-y-6" onPointerDown={(e) => e.stopPropagation()}>
          {results.apps.length ? (
            <div className="flex flex-wrap gap-2">
              {results.apps.map((r) => (
                <button key={r.key} type="button" onClick={() => launch(r)} className="os-grid-item">
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          ) : null}
          {results.files.length ? (
            <div className="overflow-hidden rounded-2xl bg-white/[0.07]">
              {results.files.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => launch(r)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-white/10"
                >
                  {r.icon}
                  <span>
                    <span className="block text-[14px] text-white">{r.label}</span>
                    <span className="block font-[family-name:var(--font-mono)] text-[11.5px] text-white/50">{r.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          {!results.apps.length && !results.files.length ? <p className="text-center text-white/60">No results</p> : null}
        </div>
      ) : (
        <>
          {os.wins.length ? (
            <div className="mx-auto mb-10 max-w-5xl" onPointerDown={(e) => e.stopPropagation()}>
              <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-wider text-white/50">Open windows</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[...os.wins]
                  .sort((a, b) => b.z - a.z)
                  .map((w) => (
                    <div key={w.id} className="os-win-card group relative">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          os.focus(w.id);
                        }}
                        className="flex w-52 flex-col items-center gap-2 rounded-xl p-4"
                      >
                        <AppIcon app={w.app} size={44} />
                        <span className="w-full truncate text-center text-[12.5px] text-white">{w.title}</span>
                        <span className="text-[11px] text-white/50">{w.minimized ? "Minimized" : apps[w.app].name}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Close ${w.title}`}
                        onClick={() => os.close(w.id)}
                        className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#2b2f3a] text-white opacity-0 ring-1 ring-white/20 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Glyph.Close className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6" onPointerDown={(e) => e.stopPropagation()}>
            {appResults.filter((r) => !apps[r.key.slice(4) as AppId].game).map((r) => (
              <button key={r.key} type="button" onClick={() => launch(r)} className="os-grid-item">
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
          <p className="mx-auto mb-3 mt-10 max-w-4xl text-center text-[12px] font-semibold uppercase tracking-wider text-white/50">
            Games
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:grid-cols-5" onPointerDown={(e) => e.stopPropagation()}>
            {gameApps.map((id) => (
              <button key={id} type="button" onClick={() => launch(appResults.find((r) => r.key === `app:${id}`)!)} className="os-grid-item">
                <AppIcon app={id} size={56} />
                <span>{apps[id].name}</span>
              </button>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-md text-center text-[12.5px] text-white/50">
            Pages live in {prettyPath(DESKTOP)}. Search for one by name, for example “method”.
          </p>
        </>
      )}
    </div>
  );
}
