export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We start by understanding your business, your users, and the constraints that actually matter before a single pixel moves.",
  },
  {
    index: "02",
    title: "Define",
    description:
      "Strategy becomes structure: information architecture, positioning, and a clear brief everyone can build against.",
  },
  {
    index: "03",
    title: "Design",
    description:
      "We design in high fidelity from day one, iterating in the browser so what you review is close to what ships.",
  },
  {
    index: "04",
    title: "Build",
    description:
      "Our design engineers build the real thing — performant, accessible, and animated with intention, not decoration.",
  },
  {
    index: "05",
    title: "Launch",
    description:
      "We ship, measure, and keep refining. A launch is a starting line, and we stay close through the first iterations.",
  },
];
