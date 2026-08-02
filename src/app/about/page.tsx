import type { Metadata } from "next";
import RevealText from "@/components/ui/RevealText";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Meet NUMA — an independent design and motion studio partnering with founders and brands since 2018.",
};

const values = [
  {
    title: "Craft over noise",
    description:
      "We'd rather ship one considered detail than ten decorative ones.",
  },
  {
    title: "Design in the browser",
    description:
      "We prototype in code early so what you see is close to what ships.",
  },
  {
    title: "Small team, senior hands",
    description:
      "Every project is led by the people who'll actually do the work.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title="A studio built around craft, not headcount."
        description="NUMA is a small, independent team of designers, motion artists, and engineers. We've spent the better part of a decade helping founders turn ambitious ideas into products people trust."
      />

      <section className="container-xl pb-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {values.map((value, i) => (
            <RevealText
              key={value.title}
              delay={i * 0.08}
              className="border-t border-line pt-6"
            >
              <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                {value.title}
              </h3>
              <p className="mt-3 text-ink-dim">{value.description}</p>
            </RevealText>
          ))}
        </div>
      </section>

      <About />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}
