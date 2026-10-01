import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

type InputFieldProps = BaseProps & {
  as?: "input";
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = BaseProps & {
  as: "textarea";
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type FieldProps = InputFieldProps | TextareaFieldProps;

const inputClass =
  "w-full rounded-[var(--radius-xs)] border border-rule bg-paper-raised px-4 py-3 text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-accent";

export function Field(props: FieldProps) {
  const { id, label, hint, error, as, ...rest } = props;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium text-ink">
        {label}
        {rest.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      {as === "textarea" ? (
        <textarea
          id={id}
          className={`${inputClass} min-h-32 resize-y`}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClass}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-2 text-sm text-severity-critical"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
