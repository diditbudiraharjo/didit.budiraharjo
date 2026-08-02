"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { work } from "@/lib/data/work";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line bg-bg-elevated py-24"
    >
      <div className="container-xl">
        <SectionHeading
          eyebrow="In motion"
          title="Every project, one continuous scroll."
        />
      </div>

      <div
        ref={trackRef}
        className="mt-14 flex w-max gap-8 px-6 will-change-transform sm:px-10"
      >
        {work.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            data-cursor-hover
            className="group relative h-[52vh] w-[74vw] shrink-0 overflow-hidden rounded-2xl sm:w-[42vw] lg:w-[30vw]"
            style={{
              background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg/80 via-transparent to-transparent p-8">
              <span className="text-xs font-medium uppercase tracking-widest text-ink/70">
                {project.category}
              </span>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent">
                {project.client}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
