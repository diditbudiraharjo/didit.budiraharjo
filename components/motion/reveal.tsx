"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { motionTokens } from "@/config/motion";

type Props = { children: ReactNode; delay?: number; y?: number; once?: boolean; className?: string };

export function Reveal({ children, delay = 0, y = 28, once = true, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: motionTokens.duration.slow, ease: [...motionTokens.ease.outExpo], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
