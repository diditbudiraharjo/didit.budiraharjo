export type Service = {
  index: string;
  title: string;
  description: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Brand & Identity",
    description:
      "Naming, visual systems, and motion identity for companies that need to look as sharp as they think.",
    capabilities: [
      "Positioning",
      "Visual identity",
      "Design systems",
      "Motion identity",
    ],
  },
  {
    index: "02",
    title: "Product Design",
    description:
      "End-to-end UX and UI for web and native products, from first wireframe to shipped release.",
    capabilities: [
      "UX research",
      "Interface design",
      "Prototyping",
      "Design engineering",
    ],
  },
  {
    index: "03",
    title: "Web Experiences",
    description:
      "Marketing sites and product experiences engineered for performance, built with the same care as the design.",
    capabilities: [
      "Art direction",
      "Next.js builds",
      "3D & WebGL",
      "Performance tuning",
    ],
  },
  {
    index: "04",
    title: "Motion & 3D",
    description:
      "Scroll-driven storytelling, real-time 3D, and micro-interaction systems that make interfaces feel alive.",
    capabilities: [
      "Motion systems",
      "3D & WebGL art direction",
      "Interaction design",
      "Prototype animation",
    ],
  },
];
