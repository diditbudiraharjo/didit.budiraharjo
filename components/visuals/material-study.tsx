import type { WorkVariant } from "@/content/home";

const common = {
  viewBox: "0 0 480 360",
  className: "h-full w-full",
  "aria-hidden": true as const,
  preserveAspectRatio: "xMidYMid slice" as const,
};

const grainFilter = (id: string) => (
  <filter id={id}>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
    <feColorMatrix in="noise" type="saturate" values="0" />
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.06" />
    </feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic" />
  </filter>
);

/**
 * Procedural monochrome "material studies" that stand in for photography —
 * strict matte-black / warm-white, in the same register as the brand
 * moodboard's own abstract liquid-metal and architectural renders.
 */
export function MaterialStudy({ variant }: { variant: WorkVariant }) {
  switch (variant) {
    case "ribbon":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ribbon-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#211f1c" />
              <stop offset="100%" stopColor="#0e0e0e" />
            </linearGradient>
            {grainFilter("ribbon-grain")}
          </defs>
          <rect width="480" height="360" fill="url(#ribbon-bg)" />
          {[40, 90, 140, 190].map((offset, i) => (
            <path
              key={offset}
              d={`M-20 ${200 + offset * 0.4} C 120 ${60 + offset}, 280 ${340 - offset}, 500 ${140 + offset * 0.3}`}
              fill="none"
              stroke="#f7f6f3"
              strokeOpacity={0.14 + i * 0.09}
              strokeWidth={2.5 + i}
            />
          ))}
          <rect width="480" height="360" filter="url(#ribbon-grain)" opacity="0.5" />
        </svg>
      );
    case "lattice":
      return (
        <svg {...common}>
          <defs>
            <pattern id="lattice-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0 L0 0 0 24" fill="none" stroke="#33312c" strokeWidth="1" />
            </pattern>
            {grainFilter("lattice-grain")}
          </defs>
          <rect width="480" height="360" fill="#0e0e0e" />
          <rect width="480" height="360" fill="url(#lattice-grid)" />
          <line x1="0" y1="80" x2="480" y2="280" stroke="#f7f6f3" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="0" y1="280" x2="480" y2="80" stroke="#f7f6f3" strokeOpacity="0.18" strokeWidth="1.5" />
          <circle cx="240" cy="180" r="3" fill="#f7f6f3" />
          <rect width="480" height="360" filter="url(#lattice-grain)" opacity="0.4" />
        </svg>
      );
    case "monolith":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="monolith-face" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#211f1c" />
              <stop offset="55%" stopColor="#141312" />
              <stop offset="100%" stopColor="#0e0e0e" />
            </linearGradient>
            {grainFilter("monolith-grain")}
          </defs>
          <rect width="480" height="360" fill="#0e0e0e" />
          <rect x="150" y="-40" width="230" height="440" fill="url(#monolith-face)" />
          <rect x="150" y="-40" width="230" height="440" fill="none" stroke="#f7f6f3" strokeOpacity="0.16" />
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <line
              key={row}
              x1="150"
              y1={20 + row * 68}
              x2="380"
              y2={20 + row * 68}
              stroke="#f7f6f3"
              strokeOpacity="0.08"
            />
          ))}
          <rect width="480" height="360" filter="url(#monolith-grain)" opacity="0.4" />
        </svg>
      );
    case "current":
      return (
        <svg {...common}>
          {grainFilter("current-grain")}
          <rect width="480" height="360" fill="#0e0e0e" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M-20 ${180 + i * 26} C 100 ${90 + i * 26}, 180 ${270 - i * 26}, 260 ${180 + i * 26} S 420 ${90 + i * 26}, 500 ${180 + i * 26}`}
              fill="none"
              stroke="#f7f6f3"
              strokeOpacity={0.55 - i * 0.16}
              strokeWidth={2}
            />
          ))}
          <line x1="0" y1="180" x2="480" y2="180" stroke="#33312c" strokeDasharray="2 8" />
          <rect width="480" height="360" filter="url(#current-grain)" opacity="0.4" />
        </svg>
      );
    case "facet":
      return (
        <svg {...common}>
          <defs>
            {grainFilter("facet-grain")}
          </defs>
          <rect width="480" height="360" fill="#141312" />
          <polygon points="240,40 380,150 320,320 160,320 100,150" fill="#0e0e0e" stroke="#f7f6f3" strokeOpacity="0.14" />
          <polygon points="240,40 380,150 240,190" fill="#211f1c" />
          <polygon points="240,40 100,150 240,190" fill="#1a1917" />
          <polygon points="240,190 320,320 160,320" fill="#0e0e0e" />
          <line x1="240" y1="40" x2="240" y2="190" stroke="#f7f6f3" strokeOpacity="0.22" />
          <rect width="480" height="360" filter="url(#facet-grain)" opacity="0.35" />
        </svg>
      );
    case "aperture":
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="aperture-glow" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#f7f6f3" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0e0e0e" stopOpacity="0" />
            </radialGradient>
            {grainFilter("aperture-grain")}
          </defs>
          <rect width="480" height="360" fill="#0e0e0e" />
          <rect width="480" height="360" fill="url(#aperture-glow)" />
          {[130, 100, 70, 42, 18].map((r, i) => (
            <circle
              key={r}
              cx="240"
              cy="176"
              r={r}
              fill="none"
              stroke="#f7f6f3"
              strokeOpacity={0.12 + i * 0.11}
              strokeWidth={i === 4 ? 2 : 1}
            />
          ))}
          <rect width="480" height="360" filter="url(#aperture-grain)" opacity="0.4" />
        </svg>
      );
  }
}
