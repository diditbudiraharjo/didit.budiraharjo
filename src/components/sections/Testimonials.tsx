"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import { easeOutExpo } from "@/lib/motion";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  return (
    <section className="border-t border-line bg-bg-elevated">
      <div className="container-xl py-28 md:py-36">
        <SectionHeading
          eyebrow="Client feedback"
          title="Don't just take our word for it."
        />

        <div className="mt-16 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              <p className="max-w-3xl text-balance font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
                &ldquo;{active.quote}&rdquo;
              </p>
              <p className="mt-6 text-sm text-ink-dim">
                <span className="text-ink">{active.name}</span> — {active.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            data-cursor-hover
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            data-cursor-hover
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
          >
            →
          </button>
          <div className="ml-4 flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
