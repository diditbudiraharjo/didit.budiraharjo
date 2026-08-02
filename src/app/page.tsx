import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import WorkGrid from "@/components/sections/WorkGrid";
import HorizontalShowcase from "@/components/sections/HorizontalShowcase";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WorkGrid limit={4} />
      <HorizontalShowcase />
      <About />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}
