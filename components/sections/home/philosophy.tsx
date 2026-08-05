import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { brandEssence, philosophy } from "@/content/home";

export function PhilosophySection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 border-t border-border py-24 md:py-36">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <Reveal>
            <h2 id="about-title" className="text-balance font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
              {philosophy.statement}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg text-muted">{philosophy.body}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:pt-2">
          <Reveal delay={0.15}>
            <ul className="divide-y divide-border border-y border-border">
              {brandEssence.map((word) => (
                <li key={word} className="flex items-center justify-between py-4">
                  <span className="font-display text-lg font-medium sm:text-xl">{word}</span>
                  <span aria-hidden className="size-1.5 rounded-full bg-ink/50" />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
