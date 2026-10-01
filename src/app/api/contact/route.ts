import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/validation";
import { sendContactMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";
import { env } from "@/lib/env";

const MAX_BODY_BYTES = 32 * 1024;
const MIN_SUBMIT_MS = 3000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
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
    if (origin && origin !== env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { ok: false, error: "invalid_origin" },
        { status: 403 },
      );
    }
  }

  const rawBody = await req.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
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

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Anti-spam: silently succeed without sending anything.
  const isHoneypotFilled = Boolean(data.website);
  const submittedTooFast = Date.now() - data.startedAt < MIN_SUBMIT_MS;
  if (isHoneypotFilled || submittedTooFast) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  const result = await sendContactMail(data);

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
