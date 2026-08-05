"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { HeroContent } from "./hero-content";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="bg-grain relative flex min-h-svh flex-col justify-end overflow-hidden bg-bg"
    >
      <HeroVisual heroRef={sectionRef} />

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-t from-bg via-bg/70 to-transparent" />

      <Container className="relative z-10 pb-16 pt-40 sm:pb-24">
        <HeroContent />
      </Container>

      <div
        aria-hidden
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 sm:right-10 sm:flex lg:right-16"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-ink/50">SCROLL</span>
        <span className="relative block h-12 w-px overflow-hidden bg-border">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-full bg-ink" />
        </span>
      </div>
    </section>
  );
}
