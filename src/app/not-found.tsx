import { SecondaryLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-[var(--side-padding)] text-center">
      <h1 className="font-[family-name:var(--font-serif)] text-display-l text-ink">
        Out of scope.
      </h1>
      <p className="mt-4 text-[17px] text-ink-soft">
        Nothing lives at this address.
      </p>
      <SecondaryLink href="/" className="mt-8">
        Back to the homepage
      </SecondaryLink>
    </div>
  );
}
