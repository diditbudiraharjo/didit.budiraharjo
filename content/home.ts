export type ServiceKey = "creative-design" | "brand-identities" | "smart-development";

export interface Service {
  key: ServiceKey;
  index: string;
  title: string;
  body: string;
  capabilities: string[];
}

export const services: Service[] = [
  {
    key: "creative-design",
    index: "01",
    title: "Creative Design",
    body: "Art direction, motion, and visual systems built to hold attention in a room full of noise — every surface considered, nothing left to template defaults.",
    capabilities: ["Art direction", "Motion & 3D", "Visual systems", "Campaign design"],
  },
  {
    key: "brand-identities",
    index: "02",
    title: "Brand Identities",
    body: "Marks, voice, and guidelines that stay legible at every size and every context — a signature, not a sticker, applied with the same discipline on a business card and a building facade.",
    capabilities: ["Naming & strategy", "Identity systems", "Guidelines", "Brand collateral"],
  },
  {
    key: "smart-development",
    index: "03",
    title: "Smart Development",
    body: "Production-grade web experiences — engineered scroll, real-time 3D, and interfaces that perform, not just prototypes that demo well once.",
    capabilities: ["Web experiences", "Interactive 3D", "Design engineering", "Performance"],
  },
];

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Design",
    body: "We start from the problem, not the mood board — research, positioning, and concept work that earns the visual direction that follows.",
  },
  {
    index: "02",
    title: "Brand",
    body: "Identity systems built to survive contact with the real world: every touchpoint, every scale, every context, considered before it ships.",
  },
  {
    index: "03",
    title: "Develop",
    body: "Design engineered into working software — motion, 3D, and interaction built with the same rigor as the visual system it expresses.",
  },
];

export type WorkVariant = "ribbon" | "lattice" | "monolith" | "current" | "facet" | "aperture";

export interface WorkItem {
  id: string;
  variant: WorkVariant;
  discipline: string;
  title: string;
  year: string;
}

export const work: WorkItem[] = [
  { id: "orbital", variant: "ribbon", discipline: "Brand Identity", title: "Orbital", year: "2026" },
  { id: "northline", variant: "lattice", discipline: "Smart Development", title: "Northline", year: "2025" },
  { id: "kiln", variant: "monolith", discipline: "Creative Design", title: "Kiln Studio", year: "2025" },
  { id: "vantage", variant: "current", discipline: "Brand Identity", title: "Vantage", year: "2025" },
  { id: "meridian", variant: "facet", discipline: "Smart Development", title: "Meridian Labs", year: "2024" },
  { id: "aperture", variant: "aperture", discipline: "Creative Design", title: "Aperture", year: "2024" },
];

export const brandEssence = ["Creative", "Strategic", "Intelligent", "Reliable", "Premium"] as const;

export const philosophy = {
  eyebrow: "About",
  statement:
    "We design experiences, build brands, and develop smart solutions that drive real impact — matte design exists at the point where creative judgment and technical rigor stop being separate disciplines.",
  body: "Founded on a simple refusal: nothing ships that measures average. Every engagement runs through the same three-phase discipline — design, brand, develop — so the identity a client leaves with is the same one their engineers can actually build.",
};
