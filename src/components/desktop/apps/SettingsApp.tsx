"use client";

import { useEffect, useState } from "react";
import { resetFs } from "@/components/desktop/fs";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { accents, useOS, useWin, wallpapers } from "@/components/desktop/wm";

const sections = ["Appearance", "Display", "Sound", "Network", "About"] as const;
type Section = (typeof sections)[number];

export function SettingsApp() {
  const os = useOS();
  const win = useWin();
  const initial = sections.find((s) => s === win.props.section) ?? "Appearance";
  const [section, setSection] = useState<Section>(initial);
  const { settings, updateSettings } = os;

  useEffect(() => {
    os.setTitle(win.id, `${section} - Settings`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, win.id]);

  return (
    <div className="@container flex h-full flex-col bg-[var(--os-surface)] text-[13.5px] @xl:flex-row">
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--os-border)] bg-black/15 p-2 [scrollbar-width:none] @xl:block @xl:w-48 @xl:space-y-0.5 @xl:border-b-0 @xl:border-r">
        {sections.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-left @xl:block @xl:w-full ${section === s ? "bg-[var(--os-accent-soft)] text-[var(--os-fg)]" : "text-[var(--os-muted)] hover:bg-white/5"}`}
          >
            {s}
          </button>
        ))}
      </nav>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 @xl:p-6">
        {section === "Appearance" ? (
          <>
            <h2 className="os-h">Background</h2>
            <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3">
              {wallpapers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => updateSettings({ wallpaper: w.id })}
                  className={`overflow-hidden rounded-lg border-2 text-left ${settings.wallpaper === w.id ? "border-[var(--os-accent)]" : "border-transparent hover:border-white/20"}`}
                >
                  <div className="aspect-video" style={{ background: w.css }} />
                  <p className="bg-black/30 px-2 py-1 text-[12px] text-[var(--os-muted)]">{w.name}</p>
                </button>
              ))}
            </div>
            <h2 className="os-h mt-8">Accent color</h2>
            <div className="flex flex-wrap gap-3">
              {accents.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-label={`Accent ${a}`}
                  onClick={() => updateSettings({ accent: a })}
                  className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-[var(--os-surface)] ${settings.accent === a ? "ring-2 ring-white" : ""}`}
                  style={{ background: a }}
                />
              ))}
            </div>
          </>
        ) : null}

        {section === "Display" ? (
          <>
            <h2 className="os-h">Brightness</h2>
            <Slider value={settings.brightness} min={30} onChange={(v) => updateSettings({ brightness: v })} />
            <h2 className="os-h mt-8">Night Light</h2>
            <Toggle
              label="Warmer colors to reduce eye strain"
              checked={settings.nightLight}
              onChange={(v) => updateSettings({ nightLight: v })}
            />
            <h2 className="os-h mt-8">Resolution</h2>
            <p className="text-[var(--os-muted)]">
              {os.area.w + (os.mobile ? 0 : 64)} × {os.area.h + 32} (browser viewport)
            </p>
          </>
        ) : null}

        {section === "Sound" ? (
          <>
            <h2 className="os-h">Output volume</h2>
            <Slider value={settings.volume} onChange={(v) => updateSettings({ volume: v })} />
            <p className="mt-3 text-[var(--os-muted)]">The desktop makes no sound. Pages you open control their own audio.</p>
          </>
        ) : null}

        {section === "Network" ? (
          <>
            <h2 className="os-h">Wi-Fi</h2>
            <Toggle label="Wireless networking" checked={settings.wifi} onChange={(v) => updateSettings({ wifi: v })} />
            <h2 className="os-h mt-8">Bluetooth</h2>
            <Toggle label="Bluetooth" checked={settings.bluetooth} onChange={(v) => updateSettings({ bluetooth: v })} />
            <p className="mt-6 text-[var(--os-muted)]">
              These toggles are cosmetic. Your browser&apos;s real connection is{" "}
              {typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline"}.
            </p>
          </>
        ) : null}

        {section === "About" ? <About /> : null}
      </div>
    </div>
  );
}

function About() {
  const os = useOS();
  const [confirm, setConfirm] = useState(false);
  const [info] = useState<[string, string][]>(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    return [
      ["Device name", "skilledscan"],
      ["OS name", "SkilledScan OS 1.0"],
      ["Windowing system", "Browser DOM"],
      ["Processor", nav.hardwareConcurrency ? `${nav.hardwareConcurrency} logical cores` : "Unknown"],
      ["Memory", nav.deviceMemory ? `${nav.deviceMemory} GiB (approximate)` : "Not exposed by this browser"],
      ["Screen", `${window.screen.width} × ${window.screen.height}`],
      ["Language", nav.language],
    ];
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--os-accent)] text-white">
          <LogoMark className="h-10 w-10" />
        </div>
        <div>
          <p className="text-[var(--os-fg)]">
            <Wordmark className="text-[20px]" /> <span className="text-[15px] font-semibold text-[var(--os-muted)]">OS 1.0</span>
          </p>
          <p className="text-[var(--os-muted)]">Expert-led penetration testing, on a desktop.</p>
        </div>
      </div>
      <dl className="divide-y divide-[var(--os-border)] overflow-hidden rounded-lg border border-[var(--os-border)]">
        {info.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-[var(--os-muted)]">{k}</dt>
            <dd className="text-right text-[var(--os-fg)]">{v}</dd>
          </div>
        ))}
      </dl>
      <h2 className="os-h mt-8">Reset</h2>
      <p className="mb-3 text-[var(--os-muted)]">Restore the default files, wallpaper and desktop icon layout.</p>
      {confirm ? (
        <div className="flex gap-2">
          <button
            type="button"
            className="os-pill os-pill-danger"
            onClick={() => {
              resetFs();
              try {
                window.localStorage.removeItem("skilledscan-os:icons:v1");
              } catch {}
              os.updateSettings({ wallpaper: "cobalt", accent: "#2453e6", brightness: 100, nightLight: false });
              os.notify("Desktop reset", "Default files and settings restored.");
              setConfirm(false);
            }}
          >
            Reset everything
          </button>
          <button type="button" className="os-pill" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" className="os-pill" onClick={() => setConfirm(true)}>
          Reset desktop…
        </button>
      )}
    </>
  );
}

export function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="os-range w-full max-w-md"
    />
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex max-w-md cursor-pointer items-center justify-between gap-4 rounded-lg bg-black/15 px-4 py-3">
      <span className="text-[var(--os-fg)]">{label}</span>
      <input type="checkbox" className="os-switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
