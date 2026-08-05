import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center pb-24 pt-32 text-center">
      <p className="font-mono text-sm text-muted">ERROR_404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl">Signal lost.</h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        The page you&rsquo;re looking for has been moved, deleted, or never existed.
      </p>
      <div className="mt-10 flex gap-4">
        <ButtonLink href="/" size="lg">
          Return home
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost" size="lg">
          Contact us
        </ButtonLink>
      </div>
    </Container>
  );
}
