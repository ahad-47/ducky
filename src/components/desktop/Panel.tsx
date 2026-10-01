"use client";

import { useEffect, useRef, useState } from "react";
import { apps } from "@/components/desktop/apps/registry";
import { Slider } from "@/components/desktop/apps/SettingsApp";
import { Glyph } from "@/components/desktop/icons";
import { useOS } from "@/components/desktop/wm";

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onBlur = () => setOpen(false);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onBlur);
    };
  }, [open]);
  return [open, setOpen, ref] as const;
}

export function Panel({ onActivities, overviewOpen }: { onActivities: () => void; overviewOpen: boolean }) {
  const os = useOS();
  const now = useClock();
  const active = os.wins.find((w) => w.id === os.activeId);
  const [calOpen, setCalOpen, calRef] = usePopover();
  const [sysOpen, setSysOpen, sysRef] = usePopover();

  const clock = now
    ? `${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}  ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
    : "";

  return (
    <div className="os-panel absolute inset-x-0 top-0 z-[5000] flex h-8 items-center px-1.5 text-[13px] font-semibold text-white">
      <button
        type="button"
        onClick={onActivities}
        className={`os-panel-btn ${overviewOpen ? "bg-white/20" : ""}`}
        aria-pressed={overviewOpen}
      >
        Activities
      </button>
      {active ? <span className="ml-3 hidden truncate font-semibold text-white/90 sm:block">{apps[active.app].name}</span> : null}

      <div ref={calRef} className="absolute left-1/2 -translate-x-1/2">
        <button type="button" className={`os-panel-btn ${calOpen ? "bg-white/20" : ""}`} onClick={() => setCalOpen((v) => !v)} suppressHydrationWarning>
          {clock}
        </button>
        {calOpen && now ? <CalendarPopover now={now} /> : null}
      </div>

      <div ref={sysRef} className="relative ml-auto">
        <button
          type="button"
          aria-label="System menu"
          className={`os-panel-btn flex items-center gap-2 ${sysOpen ? "bg-white/20" : ""}`}
          onClick={() => setSysOpen((v) => !v)}
        >
          {os.settings.wifi ? <Glyph.Wifi className="h-4 w-4" /> : null}
          <Glyph.Volume className={`h-4 w-4 ${os.settings.volume === 0 ? "opacity-40" : ""}`} />
          <Glyph.Battery className="h-4 w-4" />
        </button>
        {sysOpen ? <SystemMenu close={() => setSysOpen(false)} /> : null}
      </div>
    </div>
  );
}

function CalendarPopover({ now }: { now: Date }) {
  const [offset, setOffset] = useState(0);
  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const firstDay = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const isToday = (d: number) => offset === 0 && d === now.getDate();

  return (
    <div className="os-popover absolute left-1/2 top-9 w-[320px] -translate-x-1/2 p-4 font-normal">
      <p className="text-[12px] text-[var(--os-muted)]">{now.toLocaleDateString("en-US", { weekday: "long" })}</p>
      <p className="mb-3 text-[18px] font-semibold">
        {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="os-tbtn" aria-label="Previous month" onClick={() => setOffset((o) => o - 1)}>
          <Glyph.Back className="h-4 w-4" />
        </button>
        <button type="button" className="text-[13px] font-semibold" onClick={() => setOffset(0)}>
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </button>
        <button type="button" className="os-tbtn" aria-label="Next month" onClick={() => setOffset((o) => o + 1)}>
          <Glyph.Forward className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[12px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="py-1 text-[var(--os-muted)]">
            {d}
          </span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`grid h-8 place-items-center rounded-full ${d && isToday(d) ? "bg-[var(--os-accent)] font-semibold text-white" : d ? "hover:bg-white/10" : ""}`}
          >
            {d ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function SystemMenu({ close }: { close: () => void }) {
  const os = useOS();
  const { settings, updateSettings } = os;
  const [power, setPower] = useState(false);

  const tile = (on: boolean) =>
    `flex items-center gap-2 rounded-full px-3 py-2.5 text-left text-[12.5px] font-semibold ${on ? "bg-[var(--os-accent)] text-white" : "bg-white/10 text-[var(--os-fg)] hover:bg-white/15"}`;

  return (
    <div className="os-popover absolute right-0 top-9 w-[320px] p-3 font-normal">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="os-round"
          aria-label="Settings"
          onClick={() => {
            close();
            os.open("settings");
          }}
        >
          <Glyph.Gear className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="os-round"
          aria-label="Lock"
          onClick={() => {
            close();
            os.power("locked");
          }}
        >
          <Glyph.Lock className="h-4 w-4" />
        </button>
        <button type="button" className="os-round ml-auto" aria-label="Power off / log out" onClick={() => setPower((v) => !v)}>
          <Glyph.Power className="h-4 w-4" />
        </button>
      </div>
      {power ? (
        <div className="mb-3 space-y-1 rounded-xl bg-black/25 p-1.5">
          {[
            { label: "Restart…", act: () => os.power("boot") },
            { label: "Power Off…", act: () => os.power("off") },
            { label: "Lock", act: () => os.power("locked") },
          ].map((x) => (
            <button
              key={x.label}
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-white/10"
              onClick={() => {
                close();
                x.act();
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mb-2 flex items-center gap-3 px-1">
        <Glyph.Volume className="h-4 w-4 shrink-0 text-[var(--os-muted)]" />
        <Slider value={settings.volume} onChange={(v) => updateSettings({ volume: v })} />
      </div>
      <div className="mb-3 flex items-center gap-3 px-1">
        <Glyph.Sun className="h-4 w-4 shrink-0 text-[var(--os-muted)]" />
        <Slider value={settings.brightness} min={30} onChange={(v) => updateSettings({ brightness: v })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={tile(settings.wifi)} onClick={() => updateSettings({ wifi: !settings.wifi })}>
          <Glyph.Wifi className="h-4 w-4" />
          Wi-Fi
        </button>
        <button type="button" className={tile(settings.bluetooth)} onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}>
          <Glyph.Bluetooth className="h-4 w-4" />
          Bluetooth
        </button>
        <button type="button" className={tile(settings.nightLight)} onClick={() => updateSettings({ nightLight: !settings.nightLight })}>
          <Glyph.Moon className="h-4 w-4" />
          Night Light
        </button>
        <button
          type="button"
          className={tile(false)}
          onClick={() => {
            close();
            os.open("terminal");
          }}
        >
          <span className="font-[family-name:var(--font-mono)] text-[12px]">&gt;_</span>
          Terminal
        </button>
      </div>
    </div>
  );
}
