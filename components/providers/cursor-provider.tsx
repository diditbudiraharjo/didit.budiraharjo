"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CursorVariant = "default" | "link" | "view" | "drag";

interface CursorState {
  variant: CursorVariant;
  label?: string;
}

interface CursorCtx {
  state: CursorState;
  setCursor: (variant: CursorVariant, label?: string) => void;
  reset: () => void;
}

const DEFAULT_STATE: CursorState = { variant: "default" };

const Ctx = createContext<CursorCtx>({
  state: DEFAULT_STATE,
  setCursor: () => {},
  reset: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);

  const value = useMemo<CursorCtx>(
    () => ({
      state,
      setCursor: (variant, label) => setState({ variant, label }),
      reset: () => setState(DEFAULT_STATE),
    }),
    [state]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCursor = () => useContext(Ctx);
