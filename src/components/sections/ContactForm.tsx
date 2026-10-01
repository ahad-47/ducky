"use client";

import { useRef, useState } from "react";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { PrimaryButton } from "@/components/ui/Button";
import { assessmentRequestSchema, engagementOptions } from "@/lib/validation";

type FormState = {
  name: string;
  email: string;
  company: string;
  domain: string;
  engagement: string;
  message: string;
  authorized: boolean;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  domain: "",
  engagement: "",
  message: "",
  authorized: false,
  website: "",
};

export function ContactForm() {
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
    const result = assessmentRequestSchema.safeParse({
      type: "assessment",
      name: currentValues.name,
      email: currentValues.email,
      company: currentValues.company,
      domain: currentValues.domain,
      engagement: currentValues.engagement,
      message: currentValues.message,
      authorized: currentValues.authorized || undefined,
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
          type: "assessment",
          name: values.name,
          email: values.email,
          company: values.company,
          domain: values.domain,
          engagement: values.engagement,
          message: values.message,
          authorized: values.authorized,
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
          Request received
        </h2>
        <p className="mt-4 text-[17px] text-ink-soft">
          We will reply to {values.email} to confirm scope and authorization.
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
                  href={`#field-${field}`}
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
          id="field-name"
          label="Name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          onBlur={() => handleBlur("name")}
          error={touched.name || submitAttempted ? errors.name : undefined}
        />
        <Field
          id="field-email"
          label="Work email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => handleBlur("email")}
          error={touched.email || submitAttempted ? errors.email : undefined}
        />
        <Field
          id="field-company"
          label="Company"
          value={values.company}
          onChange={(e) =>
            setValues((v) => ({ ...v, company: e.target.value }))
          }
          onBlur={() => handleBlur("company")}
          error={
            touched.company || submitAttempted ? errors.company : undefined
          }
        />
        <Field
          id="field-domain"
          label="Primary domain"
          hint="The application you want assessed. You can add more later."
          value={values.domain}
          onChange={(e) => setValues((v) => ({ ...v, domain: e.target.value }))}
          onBlur={() => handleBlur("domain")}
          error={touched.domain || submitAttempted ? errors.domain : undefined}
        />
        <Select
          id="field-engagement"
          label="Engagement"
          required
          placeholder="Choose an engagement"
          options={engagementOptions}
          value={values.engagement}
          onChange={(e) =>
            setValues((v) => ({ ...v, engagement: e.target.value }))
          }
          onBlur={() => handleBlur("engagement")}
          error={
            touched.engagement || submitAttempted
              ? errors.engagement
              : undefined
          }
        />
        <Field
          id="field-message"
          as="textarea"
          label="What should we know?"
          required
          hint="Stack, environments, deadlines, anything that affects scope."
          value={values.message}
          onChange={(e) =>
            setValues((v) => ({ ...v, message: e.target.value }))
          }
          onBlur={() => handleBlur("message")}
          error={
            touched.message || submitAttempted ? errors.message : undefined
          }
        />
        <Checkbox
          id="field-authorized"
          label="I own the targets I will submit, or I have written permission to test them."
          required
          checked={values.authorized}
          onChange={(e) =>
            setValues((v) => ({ ...v, authorized: e.target.checked }))
          }
          onBlur={() => handleBlur("authorized")}
          error={
            touched.authorized || submitAttempted
              ? errors.authorized
              : undefined
          }
        />

        <p className="text-[14px] text-ink-soft">
          We use these details only to respond to this request.{" "}
          <a
            href="/legal/privacy"
            className="underline decoration-accent decoration-[1px] underline-offset-4"
          >
            Privacy policy
          </a>
        </p>

        {/* Honeypot: hidden from sighted and assistive users, left empty by real visitors. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="field-website">Website</label>
          <input
            id="field-website"
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
          {status === "pending" ? "Sending request" : "Send request"}
        </PrimaryButton>
      </div>
    </form>
  );
}
