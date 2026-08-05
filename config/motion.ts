export const HEADER_HEIGHT = 88;

export const motionTokens = {
  duration: { instant: 0.1, fast: 0.2, base: 0.4, slow: 0.7, glacial: 1.1 },
  ease: {
    outExpo: [0.16, 1, 0.3, 1] as const,
    outQuint: [0.22, 1, 0.36, 1] as const,
    inOutSmooth: [0.65, 0, 0.35, 1] as const,
  },
  spring: {
    snappy: { stiffness: 340, damping: 28 },
    smooth: { stiffness: 120, damping: 22 },
  },
  stagger: 0.06,
};
