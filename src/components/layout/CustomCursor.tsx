"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const isFine = useMediaQuery("(pointer: fine)");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, {
    stiffness: 500,
    damping: 40,
    mass: 0.4,
  });
  const springY = useSpring(cursorY, {
    stiffness: 500,
    damping: 40,
    mass: 0.4,
  });

  useEffect(() => {
    if (!isFine) return;

    function handleMove(event: PointerEvent) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setIsVisible(true);

      const target = event.target as HTMLElement | null;
      setIsPointer(Boolean(target?.closest("a, button, [data-cursor-hover]")));
    }

    function handleLeave() {
      setIsVisible(false);
    }

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [isFine, cursorX, cursorY]);

  if (!isFine) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isPointer ? 2.4 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="h-3 w-3 rounded-full bg-ink" />
    </motion.div>
  );
}
