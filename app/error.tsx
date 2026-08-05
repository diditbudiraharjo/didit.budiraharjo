"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center pb-24 pt-32 text-center">
      <p className="font-mono text-sm text-muted">SIGNAL_INTERRUPTED</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl">Something skipped.</h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        An unexpected error occurred. Try again, and if it persists, we&rsquo;d like to know.
      </p>
      <div className="mt-10 flex gap-4">
        <Button size="lg" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
