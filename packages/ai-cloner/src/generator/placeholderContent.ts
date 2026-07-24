/**
 * The analysis/ input never carries the original site's text (only style statistics), so
 * every block synthesizer needs original placeholder copy of its own - deterministic (not
 * random) so a given analysis always regenerates the same output.
 */
export const NAV_LABELS = ["Home", "About", "Services", "Pricing", "Blog", "Contact"];
export const CTA_LABELS = ["Get Started", "Learn More", "Sign Up", "Book a Demo"];
export const FOOTER_COLUMN_TITLES = ["Product", "Company", "Resources", "Legal"];
export const FOOTER_LINKS = ["Overview", "Features", "Careers", "Support", "Privacy", "Terms"];
export const CARD_TITLES = [
  "Built for speed",
  "Secure by default",
  "Scales with you",
  "Simple integrations",
  "Real-time insights",
  "Always in sync",
];
export const CARD_BODIES = [
  "Everything you need, without the extra complexity.",
  "Designed to fit right into your existing workflow.",
  "Reliable performance, day in and day out.",
];
export const TESTIMONIAL_QUOTES = [
  "This completely changed how our team works together.",
  "We shipped faster than we ever thought possible.",
  "Exactly what we needed, exactly when we needed it.",
];
export const FORM_FIELD_LABELS = ["Name", "Email", "Message"];

export function pick<T>(items: T[], index: number): T {
  return items[index % items.length]!;
}
