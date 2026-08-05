"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "motion/react";
import { useCursor } from "@/components/providers/cursor-provider";

const SIZES = { default: 14, link: 14, view: 84, drag: 84 } as const;

export function Cursor() {
  const { state } = useCursor();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-ready");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  const size = SIZES[state.variant];

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      <motion.div
        style={{ x, y }}
        className="fixed left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink mix-blend-difference"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ width: size, height: size }}
        transition={{ width: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink mix-blend-difference"
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
