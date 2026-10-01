export type DefinitionItem = {
  term: string;
  description: string;
};

export function DefinitionList({ items }: { items: DefinitionItem[] }) {
  return (
    <dl className="flex flex-col gap-4">
      {items.map((item) => (
        <div
          key={item.term}
          className="flex flex-col gap-1 border-t border-rule pt-4 first:border-t-0 first:pt-0"
        >
          <dt className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-wide text-ink-soft">
            {item.term}
          </dt>
          <dd className="text-[17px] text-ink">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
