import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaSection() {
  return (
    <section
      id="contact"
      aria-labelledby="cta-title"
      className="tone-light relative scroll-mt-24 overflow-hidden bg-bg py-28 text-ink md:py-40"
    >
      <Container className="relative text-center">
        <Reveal>
          <h2
            id="cta-title"
            className="mx-auto max-w-3xl text-balance font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]"
          >
            Let&rsquo;s design something intelligent.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            Tell us what you&rsquo;re building. We reply within one business day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact" size="lg">
              Start a project
            </ButtonLink>
            <ButtonLink href="/#work" variant="ghost" size="lg">
              See the work
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
