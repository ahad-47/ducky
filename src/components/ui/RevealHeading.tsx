// The page title. Its line-by-line reveal is run by PageMotion, which treats
// the first <h1> on a page as the title.
export function RevealHeading({
  as: Tag = "h1",
  className,
  children,
}: {
  as?: "h1";
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={className}>{children}</Tag>;
}
