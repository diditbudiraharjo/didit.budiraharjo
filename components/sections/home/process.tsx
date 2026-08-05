"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { processSteps } from "@/content/home";
import { loadGsap } from "@/lib/engine/scroll";

export function ProcessSection() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const line = wrap.querySelector<HTMLElement>("[data-draw-line]");

    if (reduced) {
      line?.classList.remove("scale-y-0");
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        io.disconnect();
        const { gsap } = await loadGsap();
        if (cancelled) return;

        const dots = wrap.querySelectorAll<HTMLElement>("[data-dot]");
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: wrap, start: "top 75%", end: "bottom 65%", scrub: 1 },
          });
          tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0);
          dots.forEach((dot, i) => {
            tl.to(dot, { scale: 1.3, backgroundColor: "var(--c-ink)", duration: 0.2, ease: "back.out(2.5)" }, (i + 0.4) / dots.length);
          });
        }, wrap);
        cleanup = () => ctx.revert();
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(wrap);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section id="process" aria-labelledby="process-title" className="scroll-mt-24 border-t border-border py-24 md:py-36">
      <Container>
        <SectionHeading id="process-title" title="How the work moves." className="mb-14 md:mb-20" />

        <div ref={wrapRef} className="relative max-w-3xl">
          <div aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-border" />
          <div aria-hidden data-draw-line className="absolute bottom-2 left-0 top-2 w-px origin-top scale-y-0 bg-ink" />
          <ol className="space-y-14 pl-10 sm:pl-14">
            {processSteps.map((step) => (
              <li key={step.index} className="relative">
                <Reveal>
                  <span
                    data-dot
                    aria-hidden
                    className="absolute -left-[42px] top-1.5 size-3 rounded-full border border-border bg-bg sm:-left-[58px]"
                  />
                  <p className="font-mono text-xs text-muted">{step.index}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-muted">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
