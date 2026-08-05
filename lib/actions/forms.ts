"use server";

import { headers } from "next/headers";
import { env } from "@/config/env";
import { rateLimit } from "@/lib/security/rate-limit";
import { contactSchema, type ContactInput } from "@/lib/schemas/forms";

export type FormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string | undefined> };

const GENERIC_ERROR = "Something went wrong on our side. Please try again in a moment.";
const RATE_LIMIT_ERROR = "Too many requests from this connection — please wait a minute.";

function clientIp(headerList: Headers): string {
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

function toText(payload: Record<string, unknown>): string {
  return Object.entries(payload)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

async function deliver(subject: string, payload: Record<string, unknown>): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[forms] ${subject}`, toText(payload));
  }
  if (env.RESEND_API_KEY && env.EMAIL_TO) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM ?? "matte design <onboarding@resend.dev>",
        to: [env.EMAIL_TO],
        subject,
        text: toText(payload),
      }),
    });
    if (!res.ok) throw new Error(`Mail delivery failed: ${res.status}`);
  }
}

function isBot(data: { website?: string }): boolean {
  return Boolean(data.website && data.website.trim().length > 0);
}

function fieldErrors(error: import("zod").ZodError): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([key, value]) => [key, value?.[0]])
  );
}

export async function submitContact(input: ContactInput): Promise<FormResult> {
  const headerList = await headers();
  if (!rateLimit(clientIp(headerList))) return { ok: false, error: RATE_LIMIT_ERROR };
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  if (isBot(parsed.data)) return { ok: true };
  try {
    await deliver(`New inquiry — ${parsed.data.service}`, {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? "",
      service: parsed.data.service,
      message: parsed.data.message,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}
