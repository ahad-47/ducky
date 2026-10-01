import nodemailer from "nodemailer";
import { env, smtpConfigured } from "@/lib/env";
import type { AssessmentRequest, SecurityReport } from "@/lib/validation";

function escapeForPlainText(value: string): string {
  // Strip control characters that could be used for header or log injection.
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildAssessmentEmail(data: AssessmentRequest) {
  const subject = `[SkilledScan] Assessment request: ${escapeForPlainText(data.company || data.name)}`;
  const lines = [
    `Name: ${escapeForPlainText(data.name)}`,
    `Email: ${escapeForPlainText(data.email)}`,
    `Company: ${escapeForPlainText(data.company || "(not provided)")}`,
    `Domain: ${escapeForPlainText(data.domain || "(not provided)")}`,
    `Engagement: ${escapeForPlainText(data.engagement)}`,
    `Authorized: ${data.authorized ? "yes" : "no"}`,
    "",
    "Message:",
    escapeForPlainText(data.message),
  ];
  return { subject, text: lines.join("\n"), replyTo: data.email };
}

function buildSecurityEmail(data: SecurityReport) {
  const subject = `[SkilledScan] Security report: ${escapeForPlainText(data.location)}`;
  const lines = [
    `Name: ${escapeForPlainText(data.name)}`,
    `Email: ${escapeForPlainText(data.email)}`,
    `Affected URL or component: ${escapeForPlainText(data.location)}`,
    `Followed guidelines: ${data.followedGuidelines ? "yes" : "no"}`,
    "",
    "Details:",
    escapeForPlainText(data.details),
  ];
  return { subject, text: lines.join("\n"), replyTo: data.email };
}

export type MailResult =
  | { status: "sent" }
  | { status: "logged" }
  | { status: "unconfigured" }
  | { status: "failed" };

export async function sendContactMail(
  data: AssessmentRequest | SecurityReport,
): Promise<MailResult> {
  const built =
    data.type === "assessment"
      ? buildAssessmentEmail(data)
      : buildSecurityEmail(data);

  if (!smtpConfigured) {
    if (env.NODE_ENV === "production") {
      return { status: "unconfigured" };
    }
    console.log(
      `[contact] SMTP not configured. Would send:\n${built.subject}\n${built.text}`,
    );
    return { status: "logged" };
  }

  try {
    const transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transport.sendMail({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: built.replyTo,
      subject: built.subject,
      text: built.text,
    });

    return { status: "sent" };
  } catch {
    return { status: "failed" };
  }
}
