import { appendFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { env } from "@/lib/env";

// Every contact submission is appended as one JSON line, whatever its
// outcome, so nothing is lost when mail is unconfigured or fails.
// The directory must be outside the build output and public/, and on a
// volume that survives redeploys.

export type SubmissionOutcome =
  | "received"
  | "validation_failed"
  | "spam_honeypot"
  | "spam_too_fast"
  | "rate_limited";

export type SubmissionEntry = {
  outcome: SubmissionOutcome;
  ip: string;
  userAgent: string;
  payload: unknown;
};

function logFilePath(): string {
  const dir = env.CONTACT_LOG_DIR ?? path.join(process.cwd(), "data");
  return path.join(dir, "contact-submissions.jsonl");
}

export async function logSubmission(
  entry: SubmissionEntry,
): Promise<{ id: string; stored: boolean }> {
  const id = randomUUID();
  const record = { id, receivedAt: new Date().toISOString(), ...entry };
  const line = JSON.stringify(record);

  // Hosting dashboards capture stdout, which keeps a copy if the file write fails.
  console.log(`[contact] ${line}`);

  try {
    const file = logFilePath();
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    await appendFile(file, `${line}\n`, { encoding: "utf8", mode: 0o600 });
    return { id, stored: true };
  } catch (err) {
    console.error("[contact] failed to write submission log", err);
    return { id, stored: false };
  }
}
