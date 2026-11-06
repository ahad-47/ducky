import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/validation";
import { sendContactMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { logSubmission, type SubmissionOutcome } from "@/lib/submission-log";

const MAX_BODY_BYTES = 32 * 1024;
const MIN_SUBMIT_MS = 3000;
// Caps all submissions per hour, whatever IP they claim. The per-IP limit
// keys on X-Forwarded-For, which a client can set, so this bounds what a
// spoofing sender can push into the log and the inbox.
const GLOBAL_MAX_PER_HOUR = 100;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return "unknown";
}

function allowedOrigins(): Set<string> {
  const site = new URL(env.NEXT_PUBLIC_SITE_URL);
  const www = new URL(site);
  www.hostname = `www.${site.hostname}`;
  return new Set([site.origin, www.origin]);
}

// Reads at most `limit` bytes so an oversized body is never buffered whole.
async function readBodyCapped(
  req: NextRequest,
  limit: number,
): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "invalid_content_type" },
      { status: 415 },
    );
  }

  if (env.NODE_ENV === "production") {
    const origin = req.headers.get("origin");
    if (origin && !allowedOrigins().has(origin)) {
      return NextResponse.json(
        { ok: false, error: "invalid_origin" },
        { status: 403 },
      );
    }
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  const rawBody =
    declaredLength > MAX_BODY_BYTES
      ? null
      : await readBodyCapped(req, MAX_BODY_BYTES);
  if (rawBody === null) {
    return NextResponse.json(
      { ok: false, error: "payload_too_large" },
      { status: 413 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const forwardedFor = req.headers.get("x-forwarded-for")?.slice(0, 512) ?? "";
  const userAgent = req.headers.get("user-agent")?.slice(0, 512) ?? "unknown";

  // Rate limits run before anything is written, so a flood cannot grow the
  // log file without bound. Refused requests leave a one-line note only.
  if (isRateLimited(ip) || isRateLimited("*", GLOBAL_MAX_PER_HOUR)) {
    console.warn(
      `[contact] rate_limited ${JSON.stringify({ ip, forwardedFor, userAgent })}`,
    );
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  const log = (outcome: SubmissionOutcome) =>
    logSubmission({ outcome, ip, forwardedFor, userAgent, payload: json });

  // Anti-spam: silently succeed without sending anything. The honeypot is
  // checked first because the schema would reject it as a validation error.
  const honeypot = (json as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot !== "") {
    await log("spam_honeypot");
    return NextResponse.json({ ok: true });
  }

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    await log("validation_failed");
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (Date.now() - data.startedAt < MIN_SUBMIT_MS) {
    await log("spam_too_fast");
    return NextResponse.json({ ok: true });
  }

  const { stored } = await log("received");
  const result = await sendContactMail(data);

  // A stored entry is not lost, so the sender sees success even if mail fails.
  if (stored && result.status !== "sent" && result.status !== "logged") {
    console.error(`[contact] mail ${result.status}; entry kept in the log`);
    return NextResponse.json({ ok: true });
  }

  if (result.status === "unconfigured") {
    return NextResponse.json(
      { ok: false, error: "mail_unconfigured" },
      { status: 503 },
    );
  }
  if (result.status === "failed") {
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
