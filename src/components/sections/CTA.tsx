import Link from "next/link";
import RevealText from "@/components/ui/RevealText";
import { site } from "@/lib/data/site";

export default function CTA() {
  return (
    <section className="container-xl py-28 md:py-36">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-elevated px-8 py-20 text-center sm:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(215,255,63,0.12),transparent_60%)]" />
        <RevealText
          as="h2"
          className="relative mx-auto max-w-3xl text-balance font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl"
        >
          Let&apos;s design something worth talking about.
        </RevealText>
        <RevealText
          as="p"
          delay={0.1}
          className="relative mx-auto mt-6 max-w-lg text-balance text-lg text-ink-dim"
        >
          Tell us about your project and we&apos;ll get back within one business
          day.
        </RevealText>
        <RevealText delay={0.2} className="relative mt-10 flex justify-center">
          <Link
            href="/contact"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-bg transition-transform hover:scale-105"
          >
            Start a project
            <span aria-hidden>→</span>
          </Link>
        </RevealText>
        <RevealText
          as="p"
          delay={0.25}
          className="relative mt-6 text-sm text-ink-dim"
        >
          Or write to us at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline underline-offset-4"
          >
            {site.email}
          </a>
        </RevealText>
      </div>
    </section>
  );
}
