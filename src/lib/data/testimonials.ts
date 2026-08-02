export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "NUMA didn't just redesign our product, they rebuilt how our team thinks about craft. Every release feels considered now.",
    name: "Priya Anand",
    role: "Co-founder, Fieldnote",
  },
  {
    quote:
      "The motion work alone paid for itself in demo conversions. Investors kept asking who built the site.",
    name: "Marcus Wray",
    role: "CEO, Halcyon Labs",
  },
  {
    quote:
      "Fast, opinionated, and genuinely collaborative. They pushed back when our ideas were weak and made them stronger.",
    name: "Elena Sato",
    role: "Head of Brand, Currency",
  },
  {
    quote:
      "We came in for a landing page and left with a full design system our engineers still thank us for.",
    name: "Diego Fuentes",
    role: "VP Product, Marrow",
  },
];
