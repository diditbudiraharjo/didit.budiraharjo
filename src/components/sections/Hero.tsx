"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { staggerChildren, fadeUp, easeOutExpo } from "@/lib/motion";
import Marquee from "@/components/ui/Marquee";
import { services } from "@/lib/data/services";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

const headlineWords = [
  "Design",
  "and",
  "motion",
  "that",
  "moves",
  "the",
  "needle.",
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(215,255,63,0.08),transparent_55%)]" />
        <div className="absolute right-[-10%] top-[8%] h-[70vmin] w-[70vmin] opacity-80 md:right-[-4%]">
          <HeroScene />
        </div>
      </div>

      <div className="container-xl relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-ink-dim"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Design &amp; motion studio — est. 2018
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={staggerChildren(0.06, 0.15)}
          className="max-w-4xl font-display text-[13vw] font-medium leading-[0.95] tracking-tight text-ink sm:text-[9vw] lg:text-[6.5vw]"
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={fadeUp}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: easeOutExpo }}
          className="mt-8 max-w-md text-balance text-lg text-ink-dim"
        >
          NUMA partners with founders and brands to design, animate, and ship
          digital products that feel alive from the first click.
        </motion.p>
      </div>

      <div className="relative mt-16 border-y border-line py-5">
        <Marquee
          durationSeconds={32}
          items={services.map((s) => (
            <span
              key={s.title}
              className="flex items-center gap-3 px-6 text-sm font-medium uppercase tracking-widest text-ink-dim"
            >
              {s.title}
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            </span>
          ))}
        />
      </div>
    </section>
  );
}
