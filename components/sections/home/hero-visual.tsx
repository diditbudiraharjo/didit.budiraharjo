"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/utils/cn";
import { supportsWebGL } from "@/lib/webgl";
import { logoStore } from "@/components/three/logo-store";
import { LogoMark } from "@/components/layout/logo-mark";

const LogoScene = dynamic(() => import("@/components/three/logo-scene").then((m) => m.LogoScene), {
  ssr: false,
});

export function HeroVisual({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setWebgl(supportsWebGL()), []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    logoStore.setState({ scrollProgress: v });
  });

  const showScene = webgl && !reduced;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-700", showScene && ready && "opacity-0")}>
        <LogoMark className="h-[34vh] w-auto text-ink/90 sm:h-[42vh]" />
      </div>
      {showScene && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <LogoScene onReady={() => setReady(true)} />
        </div>
      )}
      <p className="sr-only">
        The matte design signature mark, rendered in three dimensions: a continuous handwritten line
        forming the letter M, rotating slowly and tilting toward the cursor.
      </p>
    </div>
  );
}
