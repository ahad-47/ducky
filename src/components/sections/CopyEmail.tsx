"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked (e.g. insecure context): the address is visible to copy by hand.
        }
      }}
      className="inline-flex h-11 items-center rounded-[var(--radius-xs)] border border-rule-strong px-5 text-[15px] font-semibold text-ink hover:bg-accent-tint"
    >
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}
