export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  year: string;
  category: string;
  services: string[];
  gradient: [string, string];
  results: { label: string; value: string }[];
  overview: string;
  challenge: string;
  approach: string;
};

export const work: CaseStudy[] = [
  {
    slug: "fieldnote",
    client: "Fieldnote",
    title: "Rebuilding a field-ops platform for scale",
    summary:
      "A full product redesign and design system for a fast-growing operations platform.",
    year: "2025",
    category: "Product Design",
    services: ["Product Design", "Design System", "Web App"],
    gradient: ["#d7ff3f", "#0a0a0b"],
    results: [
      { label: "Faster onboarding", value: "38%" },
      { label: "Support tickets", value: "-24%" },
      { label: "NPS increase", value: "+19" },
    ],
    overview:
      "Fieldnote came to us with a product that had outgrown its original design. We rebuilt the core experience and shipped a design system their team still uses today.",
    challenge:
      "Three years of fast shipping had left Fieldnote with an interface that worked but no longer scaled — inconsistent patterns, unclear hierarchy, and a growing support burden.",
    approach:
      "We ran a two-week discovery sprint with their ops and support teams, then rebuilt the product's core flows around a new component system, shipping incrementally alongside their engineering team.",
  },
  {
    slug: "halcyon-labs",
    client: "Halcyon Labs",
    title: "A motion-first brand launch",
    summary:
      "Identity, site, and investor deck for a stealth-mode hardware startup going public.",
    year: "2025",
    category: "Brand & Web",
    services: ["Brand Identity", "Motion Design", "Web Experience"],
    gradient: ["#ff6b4a", "#0a0a0b"],
    results: [
      { label: "Press mentions", value: "40+" },
      { label: "Waitlist signups", value: "12k" },
      { label: "Launch week traffic", value: "220k" },
    ],
    overview:
      "Halcyon Labs needed to go from stealth to public in six weeks with a brand and site that matched the ambition of their hardware.",
    challenge:
      "No existing brand assets, an aggressive launch date, and a technical product that needed to feel accessible to a broad audience.",
    approach:
      "We developed the identity and motion language in parallel with the site build, using a shared component library so brand and product shipped in lockstep.",
  },
  {
    slug: "currency",
    client: "Currency",
    title: "Design system for a fintech at scale",
    summary:
      "A token-based design system unifying six product surfaces under one visual language.",
    year: "2024",
    category: "Design System",
    services: ["Design System", "Product Design", "Documentation"],
    gradient: ["#7fd7ff", "#0a0a0b"],
    results: [
      { label: "Design-to-dev handoff time", value: "-45%" },
      { label: "Component reuse", value: "82%" },
      { label: "Surfaces unified", value: "6" },
    ],
    overview:
      "Currency's product surfaces had each evolved their own visual language. We unified them into a single token-based system.",
    challenge:
      "Six teams, six slightly different visual languages, and no shared source of truth for spacing, color, or type.",
    approach:
      "We audited every surface, extracted a shared token set, and built a documented component library in Figma and code side by side.",
  },
  {
    slug: "marrow",
    client: "Marrow",
    title: "A 3D-driven product landing experience",
    summary:
      "An interactive WebGL landing page that turned a complex product into a visual story.",
    year: "2024",
    category: "Web & 3D",
    services: ["Art Direction", "WebGL", "Web Development"],
    gradient: ["#c9a6ff", "#0a0a0b"],
    results: [
      { label: "Avg. session time", value: "+3.1min" },
      { label: "Demo requests", value: "+61%" },
      { label: "Lighthouse performance", value: "96" },
    ],
    overview:
      "Marrow's product was technically dense and hard to explain. We built a scroll-driven 3D experience that let the product explain itself.",
    challenge:
      "Translate a complex technical product into something a non-technical buyer could understand in under two minutes of scrolling.",
    approach:
      "We storyboarded the entire scroll journey before touching 3D, then built a lightweight WebGL scene tuned to load fast and run smoothly on mid-range devices.",
  },
];
