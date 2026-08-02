import RevealText from "@/components/ui/RevealText";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/lib/data/site";

const stats = [
  {
    label: "Years in practice",
    value: `${new Date().getFullYear() - site.founded}+`,
  },
  { label: "Projects shipped", value: "120+" },
  { label: "Team members", value: "14" },
  { label: "Repeat clients", value: "68%" },
];

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-bg-elevated">
      <div className="container-xl py-28 md:py-36">
        <SectionHeading
          eyebrow="The studio"
          title="Independent by choice, opinionated by necessity."
        />

        <RevealText
          as="p"
          delay={0.15}
          className="mt-10 max-w-3xl text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl"
        >
          We&apos;re a small studio that stayed small on purpose — senior
          designers and engineers working directly with founders, without the
          layers that slow good work down.
        </RevealText>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <RevealText key={stat.label} delay={i * 0.06}>
              <p className="font-display text-4xl font-medium text-accent sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-ink-dim">{stat.label}</p>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
