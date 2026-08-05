"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

/** The flat, single-stroke rendering of the brand's handwritten "M" signature. */
export const SIGNATURE_PATH =
  "M8 62 C18 40 26 22 40 22 C56 22 56 62 72 62 C88 62 88 22 104 22 C118 22 122 50 140 58 C165 68 200 62 232 40";

type Props = { className?: string; animate?: boolean };

export function LogoMark({ className, animate = false }: Props) {
  const reduced = useReducedMotion();
  const shouldAnimate = animate && !reduced;

  return (
    <svg
      viewBox="0 0 240 84"
      className={cn("h-full w-auto overflow-visible", className)}
      aria-hidden="true"
    >
      <motion.path
        d={SIGNATURE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldAnimate ? { pathLength: 0 } : undefined}
        animate={shouldAnimate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />
    </svg>
  );
}
