export type NavItem = { label: string; href: string };

const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const site = {
  name: "matte design",
  tagline: "Design with Purpose. Build with Intelligence.",
  url: envUrl || "http://localhost:3000",
  email: "hello@mattedesign.example",
};

export const navigation: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
];

export const sectionIds = ["services", "work", "about", "process"] as const;

// Empty until real profiles are provided — prevents false `sameAs` structured data
// and dead social links. Add entries here once the accounts exist.
export const socials: { label: string; href: string }[] = [];
