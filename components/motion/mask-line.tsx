"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { motionTokens } from "@/config/motion";

type Props = { children: ReactNode; delay?: number; className?: string };

/** Reveals a line of text by sliding it up out of a clipped mask. */
export function MaskLine({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: [...motionTokens.ease.outExpo], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
