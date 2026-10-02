// The shield-and-check mark as plain SVG elements, for next/og images
// (which cannot use className). Mirrors src/components/ui/Logo.tsx.
export function OgLogoMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 3.5 6 8.5v10.2c0 8.6 5.9 15.6 14 18.3 2-.7 3.9-1.6 5.6-2.8" strokeWidth={2.6} />
      <path d="M20 3.5 34 8.5v9.3" strokeWidth={2.6} />
      <path d="M20 8.6 10.5 12v6.7c0 6 3.9 11 9.5 13.3" strokeWidth={1.6} opacity={0.75} />
      <path d="M20 8.6 29.5 12v5" strokeWidth={1.6} opacity={0.75} />
      <circle cx="29.5" cy="28.5" r="7.2" strokeWidth={2.6} />
      <path d="m26.2 28.6 2.3 2.3 4.4-4.6" strokeWidth={2.6} />
    </svg>
  );
}
