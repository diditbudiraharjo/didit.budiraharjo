"use client";

import { motion } from "motion/react";
import { MaskLine } from "@/components/motion/mask-line";
import { Button, ButtonLink } from "@/components/ui/button";
import { useLenis } from "@/components/providers/lenis-provider";

export function HeroContent() {
  const { scrollTo } = useLenis();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
        <MaskLine delay={0.25}>Design with purpose.</MaskLine>
        <MaskLine delay={0.37}>Build with intelligence.</MaskLine>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-6 max-w-md text-lg text-ink/70"
      >
        matte design is a creative agency working across creative design, brand identities, and smart
        development — one studio, three disciplines, a single standard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="mt-9 flex flex-wrap items-center gap-4"
      >
        <ButtonLink href="/contact" size="lg">
          Start a project
        </ButtonLink>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => scrollTo("#services")}
        >
          Explore services
        </Button>
      </motion.div>
    </div>
  );
}
