import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

interface LogoState {
  scrollProgress: number;
}

export const logoStore = createStore<LogoState>(() => ({ scrollProgress: 0 }));

export function useLogoScrollProgress(): number {
  return useStore(logoStore, (s) => s.scrollProgress);
}
