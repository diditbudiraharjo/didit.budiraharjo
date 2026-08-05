"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { createLenis } from "@/lib/engine/lenis";
import { HEADER_HEIGHT } from "@/config/motion";

type LenisCtx = {
  scrollTo: (target: string, offset?: number) => void;
  stop: () => void;
  start: () => void;
};

const Ctx = createContext<LenisCtx>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const instance = createLenis();
    lenisRef.current = instance;
    return () => {
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback((target: string, offset = -HEADER_HEIGHT + 16) => {
    const lenis = lenisRef.current?.lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.1 });
      return;
    }
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const stop = useCallback(() => lenisRef.current?.lenis.stop(), []);
  const start = useCallback(() => lenisRef.current?.lenis.start(), []);

  return <Ctx.Provider value={{ scrollTo, stop, start }}>{children}</Ctx.Provider>;
}

export const useLenis = () => useContext(Ctx);
