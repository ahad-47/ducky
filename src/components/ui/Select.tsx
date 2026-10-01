import type { SelectHTMLAttributes } from "react";

type SelectProps = {
  id: string;
  label: string;
  error?: string;
  options: readonly string[];
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  id,
  label,
  error,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium text-ink">
        {label}
        {rest.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <select
        id={id}
        className="w-full rounded-[var(--radius-xs)] border border-rule bg-paper-raised px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-accent"
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-sm text-severity-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}
