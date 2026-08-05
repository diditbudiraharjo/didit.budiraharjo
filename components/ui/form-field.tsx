"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export type FieldAria = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (aria: FieldAria) => ReactNode;
};

export function Field({ label, error, hint, required = false, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && !error ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block font-display text-sm font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-muted">
            *
          </span>
        )}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-ink underline decoration-2 underline-offset-2">
          {error}
        </p>
      )}
    </div>
  );
}
