"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas/forms";
import { submitContact } from "@/lib/actions/forms";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorBanner, SuccessPanel } from "./panels";

const serviceOptions = [
  { value: "creative-design", label: "Creative Design" },
  { value: "brand-identities", label: "Brand Identities" },
  { value: "smart-development", label: "Smart Development" },
  { value: "not-sure", label: "Not sure yet" },
];

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const result = await submitContact(data);
    if (result.ok) return;
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        if (message) setError(name as keyof ContactInput, { message });
      }
    }
    setServerError(result.error);
  });

  if (isSubmitSuccessful) {
    return (
      <SuccessPanel
        title="Message sent"
        body="Thanks for writing in — we reply within one business day."
        action="Send another message"
        onAction={() => reset()}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {serverError && <ErrorBanner message={serverError} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message}>
          {(aria) => <Input {...aria} {...register("name")} autoComplete="name" placeholder="Your name" />}
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          {(aria) => (
            <Input {...aria} type="email" {...register("email")} autoComplete="email" placeholder="you@company.com" />
          )}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Company" error={errors.company?.message} hint="Optional">
          {(aria) => <Input {...aria} {...register("company")} autoComplete="organization" placeholder="Company or studio" />}
        </Field>
        <Field label="Service" required error={errors.service?.message}>
          {(aria) => (
            <Select {...aria} {...register("service")} defaultValue="">
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field label="Message" required error={errors.message?.message}>
        {(aria) => (
          <Textarea {...aria} {...register("message")} rows={5} placeholder="Tell us about the project." />
        )}
      </Field>

      <div aria-hidden="true" className="hidden">
        <input {...register("website")} tabIndex={-1} autoComplete="off" placeholder="Leave this field empty" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-muted">* Required fields</p>
      </div>
    </form>
  );
}
