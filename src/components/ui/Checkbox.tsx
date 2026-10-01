import type { InputHTMLAttributes } from "react";

type CheckboxProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ id, label, error, ...rest }: CheckboxProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-5 w-5 min-w-[44px] accent-accent focus-visible:outline-2 focus-visible:outline-accent sm:min-w-0"
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <label htmlFor={id} className="text-[15px] text-ink">
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-severity-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}
