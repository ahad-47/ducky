const paths = {
  check: "m5 12.5 4.5 4.5L19 7.5",
  x: "M7 7l10 10M17 7 7 17",
  shield: "M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z",
  doc: "M8 3h6l5 5v13H8zM14 3v5h5M10.5 13h6M10.5 17h6",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z",
  scale: "M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zm14 0-2.5 6a3 3 0 0 0 5 0z",
  bank: "M3 10h18M5 10v8m4.7-8v8m4.6-8v8M19 10v8M3 20h18M12 3l9 5H3z",
  pulse: "M3 12h4l2.5-6 4 12 2.5-6H21",
  bug: "M9 7a3 3 0 0 1 6 0M7 10h10v4a5 5 0 0 1-10 0zm5 0v9M3 13h4m10 0h4M4 8l3 2m13-2-3 2M4 19l3-2.5m13 2.5-3-2.5",
  mail: "M4 6h16v12H4zm0 0 8 7 8-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  chevron: "m6 9 6 6 6-6",
  layers: "m12 3 9 5-9 5-9-5zm-9 9 9 5 9-5m-18 4 9 5 9-5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
