export const site = {
  name: "NUMA",
  legalName: "Numa Studio",
  tagline: "A design & motion studio building digital products that move.",
  description:
    "NUMA is an independent design and motion studio partnering with founders and brands to design, animate, and ship digital products that feel alive.",
  url: "https://numa-studio.example",
  email: "hello@numa.studio",
  phone: "+1 (415) 555-0142",
  location: "San Francisco, CA",
  founded: 2018,
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ],
} as const;

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
