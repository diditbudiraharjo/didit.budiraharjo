"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, viewportOnce } from "@/lib/motion";

export default function Services() {
  return (
    <section id="services" className="container-xl py-28 md:py-36">
      <SectionHeading
        eyebrow="What we do"
        title="Four disciplines, one team."
        description="We keep the team small and senior so strategy, design, and engineering never lose the thread between each other."
      />

      <div className="mt-16 divide-y divide-line border-y border-line">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ delay: i * 0.06 }}
            className="group grid grid-cols-1 gap-6 py-10 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-12"
          >
            <span className="font-display text-sm text-ink-dim">
              {service.index}
            </span>

            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-3xl">
                {service.title}
              </h3>
              <p className="mt-3 max-w-md text-ink-dim">
                {service.description}
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 self-center md:justify-end">
              {service.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="text-sm text-ink-dim transition-colors group-hover:text-ink"
                >
                  {cap}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
