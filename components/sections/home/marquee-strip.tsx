import { Marquee } from "@/components/ui/marquee";

const items = ["Creative Design", "Brand Identities", "Smart Development"];

export function MarqueeStrip() {
  return (
    <section aria-label="Disciplines" className="border-y border-border py-8 sm:py-10">
      <Marquee items={items} />
    </section>
  );
}
