import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { servicesJsonLd } from "@/lib/seo/jsonld";
import { Hero } from "@/components/sections/home/hero";
import { MarqueeStrip } from "@/components/sections/home/marquee-strip";
import { ServicesSection } from "@/components/sections/home/services";
import { WorkSection } from "@/components/sections/home/work";
import { PhilosophySection } from "@/components/sections/home/philosophy";
import { ProcessSection } from "@/components/sections/home/process";
import { CtaSection } from "@/components/sections/home/cta";

export const metadata: Metadata = buildMetadata({
  title: "matte design — Creative Design, Brand Identities, Smart Development",
  description:
    "matte design is a creative agency working across creative design, brand identities, and smart development. Design with purpose. Build with intelligence.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
      />
      <Hero />
      <MarqueeStrip />
      <ServicesSection />
      <WorkSection />
      <PhilosophySection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
