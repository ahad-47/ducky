import { z } from "zod";

export const engagementOptions = [
  "Web application assessment",
  "API assessment",
  "Retest and sign-off",
  "Not sure yet",
] as const;

const domainSchema = z
  .string()
  .max(253)
  .regex(
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
    {
      message: "Enter a domain without http or a path.",
    },
  )
  .optional()
  .or(z.literal(""));

export const assessmentRequestSchema = z.object({
  type: z.literal("assessment"),
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  domain: domainSchema,
  engagement: z.enum(engagementOptions, "Choose an engagement."),
  message: z.string().trim().min(20, "Add at least 20 characters.").max(4000),
  authorized: z.literal(
    true,
    "Confirm you are authorized to test these targets.",
  ),
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number(),
});

export const securityReportSchema = z.object({
  type: z.literal("security"),
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  location: z
    .string()
    .trim()
    .min(1, "Enter the affected URL or component.")
    .max(500),
  details: z.string().trim().min(50, "Add at least 50 characters.").max(8000),
  followedGuidelines: z.literal(
    true,
    "Confirm you followed the guidelines on this page.",
  ),
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number(),
});

export const contactRequestSchema = z.discriminatedUnion("type", [
  assessmentRequestSchema,
  securityReportSchema,
]);

export type AssessmentRequest = z.infer<typeof assessmentRequestSchema>;
export type SecurityReport = z.infer<typeof securityReportSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
