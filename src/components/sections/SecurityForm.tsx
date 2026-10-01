"use client";

import { useRef, useState } from "react";
import { Field } from "@/components/ui/Field";
import { Checkbox } from "@/components/ui/Checkbox";
import { PrimaryButton } from "@/components/ui/Button";
import { securityReportSchema } from "@/lib/validation";

type FormState = {
  name: string;
  email: string;
  location: string;
  details: string;
  followedGuidelines: boolean;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  location: "",
  details: "",
  followedGuidelines: false,
  website: "",
};

export function SecurityForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "server_error" | "rate_limited"
  >("idle");
  const [startedAt] = useState(() => Date.now());
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  function validate(currentValues: FormState): FieldErrors {
    const result = securityReportSchema.safeParse({
      type: "security",
      name: currentValues.name,
      email: currentValues.email,
      location: currentValues.location,
      details: currentValues.details,
      followedGuidelines: currentValues.followedGuidelines || undefined,
      website: currentValues.website,
      startedAt: startedAt,
    });

    if (result.success) return {};

    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormState | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return fieldErrors;
  }

  function handleBlur(field: keyof FormState) {
    setTouched((t) => ({ ...t, [field]: true }));
    if (submitAttempted) {
      setErrors(validate(values));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "security",
          name: values.name,
          email: values.email,
          location: values.location,
          details: values.details,
          followedGuidelines: values.followedGuidelines,
          website: values.website,
          startedAt: startedAt,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        requestAnimationFrame(() => successHeadingRef.current?.focus());
        return;
      }

      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }

      setStatus("server_error");
    } catch {
      setStatus("server_error");
    }
  }

  if (status === "success") {
    return (
      <div>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-[family-name:var(--font-serif)] text-display-l text-ink"
        >
          Report received
        </h2>
        <p className="mt-4 text-[17px] text-ink-soft">
          We will reply to {values.email}.
        </p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors) as [keyof FormState, string][];
  const showSummary = submitAttempted && errorEntries.length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {showSummary ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-[var(--radius-xs)] border border-severity-critical bg-paper-raised p-4"
        >
          <p className="font-medium text-severity-critical">
            Fix the following before sending:
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#sfield-${field}`}
                  className="text-[15px] text-severity-critical underline underline-offset-4"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status === "server_error" ? (
        <p role="alert" className="mb-6 text-[15px] text-severity-critical">
          The request was not sent. Try again in a few minutes.
        </p>
      ) : null}
      {status === "rate_limited" ? (
        <p role="alert" className="mb-6 text-[15px] text-severity-critical">
          Too many requests from this network. Try again in an hour.
        </p>
      ) : null}

      <div className="flex flex-col gap-6">
        <Field
          id="sfield-name"
          label="Name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          onBlur={() => handleBlur("name")}
          error={touched.name || submitAttempted ? errors.name : undefined}
        />
        <Field
          id="sfield-email"
          label="Email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => handleBlur("email")}
          error={touched.email || submitAttempted ? errors.email : undefined}
        />
        <Field
          id="sfield-location"
          label="Affected URL or component"
          required
          value={values.location}
          onChange={(e) =>
            setValues((v) => ({ ...v, location: e.target.value }))
          }
          onBlur={() => handleBlur("location")}
          error={
            touched.location || submitAttempted ? errors.location : undefined
          }
        />
        <Field
          id="sfield-details"
          as="textarea"
          label="Details"
          required
          hint="Steps to reproduce and the impact you observed."
          value={values.details}
          onChange={(e) =>
            setValues((v) => ({ ...v, details: e.target.value }))
          }
          onBlur={() => handleBlur("details")}
          error={
            touched.details || submitAttempted ? errors.details : undefined
          }
        />
        <Checkbox
          id="sfield-followedGuidelines"
          label="I followed the guidelines on this page."
          required
          checked={values.followedGuidelines}
          onChange={(e) =>
            setValues((v) => ({ ...v, followedGuidelines: e.target.checked }))
          }
          onBlur={() => handleBlur("followedGuidelines")}
          error={
            touched.followedGuidelines || submitAttempted
              ? errors.followedGuidelines
              : undefined
          }
        />

        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="sfield-website">Website</label>
          <input
            id="sfield-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) =>
              setValues((v) => ({ ...v, website: e.target.value }))
            }
          />
        </div>

        <PrimaryButton
          type="submit"
          disabled={status === "pending"}
          aria-busy={status === "pending"}
          className="w-fit"
        >
          {status === "pending" ? "Sending request" : "Send report"}
        </PrimaryButton>
      </div>
    </form>
  );
}
