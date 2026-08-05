"use client";

import { useEffect, useRef } from "react";
import { LuCircleCheckBig, LuTriangleAlert } from "react-icons/lu";
import { Button } from "@/components/ui/button";

type SuccessProps = { title: string; body: string; action?: string; onAction?: () => void };

export function SuccessPanel({ title, body, action, onAction }: SuccessProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);

  return (
    <div ref={ref} tabIndex={-1} role="status" className="border border-border bg-surface p-8 focus:outline-none">
      <LuCircleCheckBig aria-hidden className="size-7 text-ink" />
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{body}</p>
      {action && onAction && (
        <Button variant="ghost" className="mt-6" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 border border-border bg-surface px-4 py-3 text-sm font-medium text-ink">
      <LuTriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}
