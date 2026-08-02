"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type RevealTextProps = {
  children: ReactNode;
  as?: keyof typeof MOTION_TAGS;
  className?: string;
  delay?: number;
};

export default function RevealText({
  children,
  as = "div",
  className,
  delay = 0,
}: RevealTextProps) {
  const MotionTag = MOTION_TAGS[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
