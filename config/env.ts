import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_TO: z.string().optional(),
});

export const env = envSchema.parse(process.env);
