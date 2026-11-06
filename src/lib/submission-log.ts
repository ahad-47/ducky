import { appendFile, mkdir, stat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { env } from "@/lib/env";

// Every contact submission is appended as one JSON line, whatever its
// outcome, so nothing is lost when mail is unconfigured or fails.
// The directory must be outside the build output and public/, and on a
// volume that survives redeploys.

export type SubmissionOutcome =
  "received" | "validation_failed" | "spam_honeypot" | "spam_too_fast";

export type SubmissionEntry = {
  outcome: SubmissionOutcome;
  ip: string;
  forwardedFor: string;
  userAgent: string;
  payload: unknown;
};

// Past this size new entries go to stdout only, so the disk cannot fill.
const MAX_LOG_BYTES = 100 * 1024 * 1024;

async function sizeOf(file: string): Promise<number> {
  try {
    return (await stat(file)).size;
  } catch {
    return 0;
  }
}

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
    if ((await sizeOf(file)) > MAX_LOG_BYTES) {
      console.error(
        "[contact] submission log is full; entry kept in stdout only",
      );
      return { id, stored: false };
    }
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    await appendFile(file, `${line}\n`, { encoding: "utf8", mode: 0o600 });
    return { id, stored: true };
  } catch (err) {
    console.error("[contact] failed to write submission log", err);
    return { id, stored: false };
  }
}
