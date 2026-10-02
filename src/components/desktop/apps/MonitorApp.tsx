"use client";

import { useEffect, useRef, useState } from "react";
import { apps } from "@/components/desktop/apps/registry";
import { useOS } from "@/components/desktop/wm";

type Perf = Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } };

// Main-thread load is estimated from animation-frame lateness: the share of
// each second the page could not paint on time. It is a real measurement of
// this tab, not of the machine.
function useLoadSamples() {
  const [samples, setSamples] = useState<number[]>(() => Array(60).fill(0));
  const [heap, setHeap] = useState<number[]>(() => Array(60).fill(0));
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let busy = 0;
    let total = 0;
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      busy += Math.max(0, dt - 16.7);
      total += dt;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const id = window.setInterval(() => {
      const load = total ? Math.min(100, (busy / total) * 100) : 0;
      busy = 0;
      total = 0;
      setSamples((s) => [...s.slice(1), load]);
      const mem = (performance as Perf).memory;
      if (mem) setHeap((h) => [...h.slice(1), mem.usedJSHeapSize / 1048576]);
    }, 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);
  return { samples, heap };
}

function Graph({ data, max, color, label, unit }: { data: number[]; max: number; color: string; label: string; unit: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (h / 4) * i);
      ctx.lineTo(w, (h / 4) * i);
      ctx.stroke();
    }
    const step = w / (data.length - 1);
    ctx.beginPath();
    data.forEach((v, i) => {
      const y = h - (Math.min(v, max) / max) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * step, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = color + "22";
    ctx.fill();
  }, [data, max, color]);
  const current = data[data.length - 1];
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12.5px]">
        <span className="font-semibold text-[var(--os-fg)]">{label}</span>
        <span className="font-[family-name:var(--font-mono)] text-[var(--os-muted)]">
          {current.toFixed(1)} {unit}
        </span>
      </div>
      <canvas ref={ref} className="h-28 w-full rounded-md bg-black/25" />
    </div>
  );
}

export function MonitorApp() {
  const os = useOS();
  const [tab, setTab] = useState<"processes" | "resources">("processes");
  const { samples, heap } = useLoadSamples();
  const [now, setNow] = useState(() => Date.now());
  const [selected, setSelected] = useState<string | null>(null);
  const hasHeap = heap.some((h) => h > 0);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="@container flex h-full flex-col bg-[var(--os-surface)] text-[13px]">
      <div className="flex h-11 shrink-0 items-center justify-center gap-1 border-b border-[var(--os-border)]">
        {(["processes", "resources"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 capitalize ${tab === t ? "bg-white/10 text-[var(--os-fg)]" : "text-[var(--os-muted)] hover:bg-white/5"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "processes" ? (
        <>
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[var(--os-surface)] text-[12px] text-[var(--os-muted)]">
                <tr className="border-b border-[var(--os-border)]">
                  <th className="px-3 py-2 font-medium">Process</th>
                  <th className="px-3 py-2 font-medium">PID</th>
                  <th className="hidden px-3 py-2 font-medium @xl:table-cell">Window</th>
                  <th className="px-3 py-2 font-medium">State</th>
                  <th className="px-3 py-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="font-[family-name:var(--font-mono)] text-[12px]">
                {[
                  { id: "sys-1", name: "systemd", pid: 1, title: "", state: "Sleeping", time: now - os.bootedAt },
                  { id: "sys-2", name: "gnome-shell", pid: 412, title: "", state: "Running", time: now - os.bootedAt },
                  ...os.wins.map((w) => ({
                    id: w.id,
                    name: apps[w.app].command,
                    pid: w.pid,
                    title: w.title,
                    state: w.minimized ? "Sleeping" : os.activeId === w.id ? "Running" : "Idle",
                    time: now - w.startedAt,
                  })),
                ].map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    onDoubleClick={() => !p.id.startsWith("sys") && os.focus(p.id)}
                    className={`cursor-default border-b border-[var(--os-border)]/50 ${selected === p.id ? "bg-[var(--os-accent-soft)]" : "hover:bg-white/5"}`}
                  >
                    <td className="px-3 py-1.5 text-[var(--os-fg)]">{p.name}</td>
                    <td className="px-3 py-1.5 text-[var(--os-muted)]">{p.pid}</td>
                    <td className="hidden max-w-[260px] truncate px-3 py-1.5 text-[var(--os-muted)] @xl:table-cell">{p.title}</td>
                    <td className="px-3 py-1.5 text-[var(--os-muted)]">{p.state}</td>
                    <td className="px-3 py-1.5 text-[var(--os-muted)]">{fmt(p.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex h-12 shrink-0 items-center justify-end gap-2 border-t border-[var(--os-border)] px-3">
            <span className="mr-auto text-[12px] text-[var(--os-muted)]">{os.wins.length + 2} processes</span>
            <button
              type="button"
              className="os-pill"
              disabled={!selected || selected.startsWith("sys") || !os.wins.some((w) => w.id === selected)}
              onClick={() => selected && os.focus(selected)}
            >
              Switch To
            </button>
            <button
              type="button"
              className="os-pill os-pill-danger"
              disabled={!selected || selected.startsWith("sys") || !os.wins.some((w) => w.id === selected)}
              onClick={() => {
                if (selected) os.close(selected);
                setSelected(null);
              }}
            >
              End Process
            </button>
          </div>
        </>
      ) : (
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
          <Graph data={samples} max={100} color="#5eead4" label="Main thread load (this tab)" unit="%" />
          {hasHeap ? (
            <Graph data={heap} max={Math.max(64, ...heap) * 1.2} color="#8fa8ff" label="JavaScript heap" unit="MiB" />
          ) : (
            <p className="text-[var(--os-muted)]">JavaScript heap size is not exposed by this browser.</p>
          )}
          <p className="text-[12px] text-[var(--os-muted)]">
            Load is measured from late animation frames over the last minute. It reflects this browser tab only.
          </p>
        </div>
      )}
    </div>
  );
}
