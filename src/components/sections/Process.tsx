import { process } from "@/lib/data/process";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealText from "@/components/ui/RevealText";

export default function Process() {
  return (
    <section id="process" className="container-xl py-28 md:py-36">
      <SectionHeading
        eyebrow="How we work"
        title="A process built for momentum."
        description="No black boxes. You'll always know what we're working on and why."
      />

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-5">
        {process.map((step, i) => (
          <RevealText
            key={step.index}
            delay={i * 0.07}
            className="md:col-span-1"
          >
            <span className="font-display text-sm text-accent">
              {step.index}
            </span>
            <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              {step.description}
            </p>
          </RevealText>
        ))}
      </div>
    </section>
  );
}
