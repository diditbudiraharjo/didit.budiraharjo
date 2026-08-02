"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const projectTypes = [
  "Brand & Identity",
  "Product Design",
  "Web Experience",
  "Motion & 3D",
];
const budgets = ["< $25k", "$25k – $75k", "$75k – $150k", "$150k+"];

type Status = "idle" | "submitting" | "success";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-line bg-bg-elevated p-10 text-center"
      >
        <p className="font-display text-2xl font-medium text-ink">
          Thanks — that&apos;s in our inbox.
        </p>
        <p className="mt-3 text-ink-dim">
          We reply to every inquiry within one business day.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="input"
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="jane@company.com"
          />
        </Field>
      </div>

      <Field label="Company" htmlFor="company">
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className="input"
          placeholder="Company, Inc."
        />
      </Field>

      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-widest text-ink-dim">
          Project type
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                type="radio"
                name="projectType"
                value={type}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-ink-dim transition-colors peer-checked:border-accent peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-widest text-ink-dim">
          Estimated budget
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {budgets.map((budget) => (
            <label key={budget} className="cursor-pointer">
              <input
                type="radio"
                name="budget"
                value={budget}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-ink-dim transition-colors peer-checked:border-accent peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {budget}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Project details" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input resize-none"
          placeholder="Tell us what you're building and what success looks like."
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        data-cursor-hover
        className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-bg transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
        {status !== "submitting" && <span aria-hidden>→</span>}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-widest text-ink-dim"
      >
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}
