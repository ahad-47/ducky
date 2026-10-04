// One consistent line set on a 24px grid: 1.5px strokes, round joins, no
// filled tiles behind them.
const paths = {
  check: "M4.5 12.75 9 17.25 19.5 6.75",
  x: "M6 6l12 12M18 6 6 18",
  shield: "M12 3.25 4.75 6v5.5c0 4.35 3.05 8.1 7.25 9.25 4.2-1.15 7.25-4.9 7.25-9.25V6L12 3.25Z",
  arrow: "M4.5 12h15m0 0-5.25-5.25M19.5 12l-5.25 5.25",
  external: "M13.5 4.5h6v6M19.5 4.5l-8.25 8.25M17.25 13.5v4.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V8.25A1.5 1.5 0 0 1 6 6.75h4.5",
  lock: "M7.5 10.5v-3a4.5 4.5 0 0 1 9 0v3M6.75 10.5h10.5a1.5 1.5 0 0 1 1.5 1.5v6.75a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z",
  doc: "M14.25 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V6.75L14.25 3Zm0 0v3.75H18M9 12.75h6M9 16.5h4.5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.3 2.45 3.5 5.45 3.5 9s-1.2 6.55-3.5 9c-2.3-2.45-3.5-5.45-3.5-9S9.7 5.45 12 3Z",
  scale: "M12 4.5v15M8.25 19.5h7.5M5.25 7.5h13.5M5.25 7.5 3 13.5a2.6 2.6 0 0 0 4.5 0L5.25 7.5Zm13.5 0L16.5 13.5a2.6 2.6 0 0 0 4.5 0l-2.25-6Z",
  bank: "M3.75 9.75h16.5M5.25 9.75v7.5m4.5-7.5v7.5m4.5-7.5v7.5m4.5-7.5v7.5M3.75 19.5h16.5M12 3.75l8.25 4.5H3.75L12 3.75Z",
  pulse: "M3 12h3.75l2.25-5.25 4.5 10.5L15.75 12H21",
  bug: "M9 7.5a3 3 0 0 1 6 0M7.5 10.5h9V15a4.5 4.5 0 0 1-9 0v-4.5Zm4.5 0V19.5M3.75 13.5H7.5m9 0h3.75M4.5 8.25l3 2.25m12-2.25-3 2.25M4.5 19.5l3-2.25m12 2.25-3-2.25",
  mail: "M4.5 6h15a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 4.5 6Zm-.75.75L12 12.75l8.25-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 1.75",
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm10.5 3-5.2-5.2",
  chevron: "m6 9 6 6 6-6",
  layers: "m12 3.75 8.25 4.5L12 12.75l-8.25-4.5L12 3.75Zm-8.25 8.25L12 16.5l8.25-4.5M3.75 15.75 12 20.25l8.25-4.5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
