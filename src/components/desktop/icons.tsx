import type { AppId } from "@/components/desktop/apps/registry";
import type { FsNode } from "@/components/desktop/fs";

type IconProps = { size?: number; className?: string };

export function AppIcon({ app, size = 48, className }: IconProps & { app: AppId }) {
  const common = { width: size, height: size, viewBox: "0 0 48 48", className, "aria-hidden": true } as const;
  switch (app) {
    case "snake":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#0f3d36" />
          <path d="M12 34h10a5 5 0 0 0 5-5v-6a5 5 0 0 1 5-5h4" fill="none" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="36" cy="18" r="3.4" fill="#5eead4" />
          <circle cx="15" cy="15" r="3" fill="#ff6b6b" />
        </svg>
      );
    case "game2048":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#ff9f55" />
          <text x="24" y="29.5" textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#2b1200" fontFamily="ui-sans-serif, system-ui, sans-serif">
            2048
          </text>
        </svg>
      );
    case "minesweeper":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#4b5263" />
          <g stroke="#1b1f27" strokeWidth="2.6" strokeLinecap="round">
            <path d="M24 12v24M12 24h24M15.5 15.5l17 17M32.5 15.5l-17 17" />
          </g>
          <circle cx="24" cy="24" r="8" fill="#1b1f27" />
          <circle cx="21.5" cy="21.5" r="2" fill="#f4f6fb" />
        </svg>
      );
    case "memory":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#4c3a8f" />
          <rect x="10" y="11" width="15" height="21" rx="3" fill="#22305a" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(-8 17.5 21.5)" />
          <rect x="23" y="15" width="15" height="21" rx="3" fill="#f4f6fb" transform="rotate(8 30.5 25.5)" />
          <path d="M30.5 20.5l-4 1.5v3c0 2.6 1.7 4.7 4 5.5 2.3-.8 4-2.9 4-5.5v-3z" fill="#5eead4" transform="rotate(8 30.5 25.5)" />
        </svg>
      );
    case "breakout":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#16203a" />
          {["#ff6b6b", "#ffd166", "#8fa8ff"].map((c, r) =>
            [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={9.5 + k * 10.3} y={10 + r * 5.5} width="8.6" height="3.6" rx="1" fill={c} />),
          )}
          <circle cx="27" cy="31" r="2.6" fill="#5eead4" />
          <rect x="15" y="36" width="16" height="3" rx="1.5" fill="#f4f6fb" />
        </svg>
      );
    case "browser":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ic-br" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5b7cff" />
              <stop offset="1" stopColor="#2a43b8" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" fill="url(#ic-br)" />
          <g fill="none" stroke="#e8eeff" strokeWidth="1.8" opacity="0.95">
            <circle cx="24" cy="24" r="13" />
            <ellipse cx="24" cy="24" rx="6" ry="13" />
            <path d="M11 24h26M13.5 17h21M13.5 31h21" />
          </g>
          <circle cx="35" cy="13" r="5" fill="#5eead4" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="40" height="34" rx="6" fill="#1b1f27" stroke="#3a4152" />
          <rect x="4" y="7" width="40" height="7" rx="3" fill="#2b313e" />
          <path d="M11 22l6 4.5-6 4.5" fill="none" stroke="#5eead4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 32h11" stroke="#e8eeff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "calculator":
      return (
        <svg {...common}>
          <rect x="8" y="4" width="32" height="40" rx="6" fill="#3a3f4b" />
          <rect x="12" y="8" width="24" height="9" rx="2" fill="#c9f7ec" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={12 + c * 8.5}
                y={20.5 + r * 7.5}
                width="6.5"
                height="5.5"
                rx="1.5"
                fill={c === 2 && r === 2 ? "#e95420" : "#6b7385"}
              />
            )),
          )}
        </svg>
      );
    case "files":
      return (
        <svg {...common}>
          <path d="M5 12a4 4 0 0 1 4-4h10l4 4h16a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="#2f4fbf" />
          <path d="M5 18a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="#5b7cff" />
          <rect x="17" y="24" width="14" height="3" rx="1.5" fill="#dfe7ff" />
        </svg>
      );
    case "editor":
      return (
        <svg {...common}>
          <path d="M10 4h20l8 8v30a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#f2f4f8" />
          <path d="M30 4v8h8" fill="#c9cfdb" />
          <path d="M13 18h18M13 23h18M13 28h12M13 33h15" stroke="#8a93a6" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 40l2-6 11-11 4 4-11 11z" fill="#ffd166" stroke="#a57f1b" strokeWidth="1" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="20" fill="#4b5263" />
          <g fill="#e8eeff">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="21.5" y="8" width="5" height="8" rx="1.5" transform={`rotate(${i * 45} 24 24)`} />
            ))}
            <circle cx="24" cy="24" r="10" />
          </g>
          <circle cx="24" cy="24" r="4.5" fill="#4b5263" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...common}>
          <rect x="4" y="8" width="40" height="30" rx="5" fill="#16202b" stroke="#2f3d4f" />
          <path d="M9 30l7-9 5 6 6-12 5 9 7-5" fill="none" stroke="#5eead4" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="18" y="40" width="12" height="3" rx="1.5" fill="#6b7385" />
        </svg>
      );
  }
}

export function FileIcon({ node, name, size = 48, className }: IconProps & { node: FsNode; name: string }) {
  const common = { width: size, height: size, viewBox: "0 0 48 48", className, "aria-hidden": true } as const;
  if (node.type === "dir") {
    if (name === ".Trash" || name === "Trash") return <TrashIcon size={size} className={className} />;
    return (
      <svg {...common}>
        <path d="M4 12a4 4 0 0 1 4-4h11l4 4h17a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#3552c9" />
        <path d="M4 17a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#6b8bff" />
      </svg>
    );
  }
  if (node.kind === "app") return <AppIcon app={node.app} size={size} className={className} />;
  if (node.kind === "html") {
    return (
      <svg {...common}>
        <path d="M10 3h20l9 9v31a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#eef1f7" />
        <path d="M30 3v9h9" fill="#c7cedc" />
        <rect x="8" y="27" width="31" height="11" fill="#e95420" />
        <text x="23.5" y="35.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="ui-monospace, monospace">
          HTML
        </text>
        <path d="M17 15l-4 4 4 4M24 15l4 4-4 4" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M10 3h20l9 9v31a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#eef1f7" />
      <path d="M30 3v9h9" fill="#c7cedc" />
      <path d="M14 19h20M14 24h20M14 29h20M14 34h13" stroke="#8a93a6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M12 14h24l-2 28a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="#9aa3b5" />
      <rect x="9" y="9" width="30" height="5" rx="2" fill="#c2c9d6" />
      <rect x="19" y="5" width="10" height="4" rx="1.5" fill="#c2c9d6" />
      <path d="M19 20v19M24 20v19M29 20v19" stroke="#6b7385" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M4 12a4 4 0 0 1 4-4h11l4 4h17a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#3552c9" />
      <path d="M4 17a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#6b8bff" />
      <path d="M24 19l-8 7h2.5v7h4v-5h3v5h4v-7H32z" fill="#eef2ff" />
    </svg>
  );
}

type GlyphProps = { className?: string };
const glyph = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

export const Glyph = {
  Back: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Forward: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Up: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  ),
  Reload: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
    </svg>
  ),
  Stop: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Home: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
    </svg>
  ),
  Lock: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  File: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  ),
  NewWindow: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <rect x="4" y="6" width="14" height="14" rx="2" />
      <path d="M10 3h11v11" />
    </svg>
  ),
  Power: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M12 3v9M6.3 7.3a8 8 0 1 0 11.4 0" />
    </svg>
  ),
  Wifi: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" />
    </svg>
  ),
  Volume: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  ),
  Battery: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 11v2" />
      <rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Sun: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  ),
  Bluetooth: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <path d="M7 7l10 10-5 5V2l5 5L7 17" />
    </svg>
  ),
  Gear: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  Grid: ({ className }: GlyphProps) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={5 + c * 7} cy={5 + r * 7} r="1.9" />))}
    </svg>
  ),
  Search: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  ),
  Close: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className} strokeWidth={2}>
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  ),
  Minimize: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className} strokeWidth={2}>
      <path d="M7 15h10" />
    </svg>
  ),
  Maximize: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className} strokeWidth={2}>
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  ),
  Restore: ({ className }: GlyphProps) => (
    <svg {...glyph} className={className} strokeWidth={2}>
      <rect x="6.5" y="9" width="8.5" height="8.5" rx="1" />
      <path d="M9.5 6.5H17.5V14.5" />
    </svg>
  ),
};
