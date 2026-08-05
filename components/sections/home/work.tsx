"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { MaterialStudy } from "@/components/visuals/material-study";
import { useCursor } from "@/components/providers/cursor-provider";
import { work } from "@/content/home";
import { loadGsap } from "@/lib/engine/scroll";

const velocities = [-22, 30, -16, 24, -28, 18];

export function WorkSection() {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const { setCursor, reset } = useCursor();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        io.disconnect();
        const { gsap } = await loadGsap();
        if (cancelled) return;

        const ctx = gsap.context(() => {
          grid.querySelectorAll<HTMLElement>("[data-parallax]").forEach((tile) => {
            const distance = Number(tile.dataset.parallax ?? 24);
            gsap.fromTo(
              tile,
              { y: distance },
              {
                y: -distance,
                ease: "none",
                scrollTrigger: { trigger: grid, start: "top bottom", end: "bottom top", scrub: 1 },
              }
            );
          });
        }, grid);
        cleanup = () => ctx.revert();
      },
      { rootMargin: "300px 0px" }
    );

    io.observe(grid);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-24 border-t border-border py-24 md:py-36">
      <Container>
        <SectionHeading
          id="work-title"
          title="Selected work."
          lead="A sample of engagements across the three disciplines — the rest we can only show in a call."
          className="mb-14 md:mb-20"
        />

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.07}>
              <div data-parallax={reduced ? undefined : velocities[i % velocities.length]}>
                <article
                  className="group relative aspect-[4/5] cursor-pointer overflow-hidden border border-border"
                  onMouseEnter={() => setCursor("view", "View")}
                  onMouseLeave={reset}
                  tabIndex={0}
                >
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                    <MaterialStudy variant={item.variant} />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
                        {item.discipline} · {item.year}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-semibold text-ink">{item.title}</h3>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
