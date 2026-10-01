export function MetaGrid({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-4 border-y border-rule py-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-ink-soft">
            {item.label}
          </dt>
          <dd className="mt-1 text-[17px] text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
