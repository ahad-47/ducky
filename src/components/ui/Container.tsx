export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto max-w-[var(--content-max)] px-[var(--side-padding)] ${className}`}
    >
      <div className="lg:pl-6">{children}</div>
    </div>
  );
}

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-[var(--section-padding)] ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
