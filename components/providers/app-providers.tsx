"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { LenisProvider } from "./lenis-provider";
import { CursorProvider } from "./cursor-provider";
import { Cursor } from "@/components/ui/cursor";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CursorProvider>
        <LenisProvider>
          {children}
          <Cursor />
        </LenisProvider>
      </CursorProvider>
    </MotionConfig>
  );
}
