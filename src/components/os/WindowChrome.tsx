export function WindowChrome({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-rule pb-3">
      <span className="h-3 w-3 rounded-full bg-[#d6dbe4]" />
      <span className="h-3 w-3 rounded-full bg-[#d6dbe4]" />
      <span className="h-3 w-3 rounded-full bg-[#d6dbe4]" />
      <span className="ml-3 font-[family-name:var(--font-mono)] text-[12px] text-ink-soft">{title}</span>
    </div>
  );
}
