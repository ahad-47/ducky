"use client";

export function Marquee({ items }: { items: readonly string[] }) {
  const loopItems = [...items, ...items];

  return (
    <div className="glass overflow-hidden border-x-0 py-6" aria-hidden="true">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12 motion-reduce:animate-none">
        {loopItems.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 whitespace-nowrap font-[family-name:var(--font-serif)] text-2xl text-ink-soft"
          >
            {item}
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
