import { z } from "zod";

const email = z.string().min(1, "Enter your email address").email("Enter a valid email address");
const honeypot = { website: z.string().optional() };

export const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name").max(80, "Keep it under 80 characters"),
  email,
  company: z.string().max(120, "Keep it under 120 characters").optional(),
  service: z.enum(["creative-design", "brand-identities", "smart-development", "not-sure"], {
    errorMap: () => ({ message: "Choose the service you're interested in" }),
  }),
  message: z
    .string()
    .min(10, "Give us at least a sentence to work with")
    .max(2000, "Keep it under 2,000 characters"),
  ...honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;
