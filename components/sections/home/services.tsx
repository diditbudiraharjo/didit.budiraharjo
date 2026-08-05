"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowUpRight } from "react-icons/lu";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { MaterialStudy } from "@/components/visuals/material-study";
import { services } from "@/content/home";
import { cn } from "@/utils/cn";
import type { WorkVariant } from "@/content/home";

const previewByService: Record<string, WorkVariant> = {
  "creative-design": "facet",
  "brand-identities": "ribbon",
  "smart-development": "lattice",
};

export function ServicesSection() {
  const [hovered, setHovered] = useState(services[0].key);

  return (
    <section id="services" aria-labelledby="services-title" className="scroll-mt-24 border-t border-border py-24 md:py-36">
      <Container>
        <SectionHeading
          id="services-title"
          title="Three disciplines. One standard."
          lead="Every engagement draws on the same three capabilities, in whatever mix the problem calls for."
          className="mb-14 md:mb-20"
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <ul className="lg:col-span-7">
            {services.map((service, i) => (
              <Reveal key={service.key} delay={i * 0.06}>
                <li
                  onMouseEnter={() => setHovered(service.key)}
                  onFocus={() => setHovered(service.key)}
                  className="group border-b border-border py-8 first:border-t sm:py-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5 sm:gap-8">
                      <span className="pt-1 font-mono text-sm text-muted">{service.index}</span>
                      <div>
                        <h3 className="font-display text-2xl font-semibold tracking-[-0.01em] transition-opacity sm:text-3xl">
                          {service.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-muted transition-colors group-hover:text-ink/80">
                          {service.body}
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                          {service.capabilities.map((c) => (
                            <li key={c} className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <LuArrowUpRight
                      aria-hidden
                      className="mt-2 size-6 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink"
                    />
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32 aspect-[4/5] overflow-hidden border border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hovered}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("h-full w-full")}
                >
                  <MaterialStudy variant={previewByService[hovered]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
