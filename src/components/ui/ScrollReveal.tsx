// Kept as a plain wrapper: PageMotion reveals the children of every section
// as they scroll in, so this no longer animates on its own.
export function ScrollReveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  return <Tag className={className}>{children}</Tag>;
}
