import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { work } from "@/lib/data/work";
import RevealText from "@/components/ui/RevealText";
import CTA from "@/components/sections/CTA";
import WorkGrid from "@/components/sections/WorkGrid";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return work.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = work.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.client,
    description: project.summary,
    openGraph: {
      title: `${project.client} — ${project.title}`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = work.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <section className="container-xl pb-16 pt-40 md:pt-48">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
        >
          ← All work
        </Link>

        <RevealText
          delay={0.05}
          className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-ink-dim"
        >
          <span>{project.category}</span>
          <span aria-hidden>•</span>
          <span>{project.year}</span>
        </RevealText>

        <RevealText
          as="h1"
          delay={0.1}
          className="mt-4 max-w-4xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl"
        >
          {project.title}
        </RevealText>

        <RevealText
          as="p"
          delay={0.15}
          className="mt-6 max-w-xl text-lg text-ink-dim"
        >
          {project.summary}
        </RevealText>
      </section>

      <section className="container-xl" aria-hidden>
        <div
          className="h-[45vh] w-full rounded-3xl sm:h-[60vh]"
          style={{
            background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
          }}
        />
      </section>

      <section className="container-xl grid grid-cols-1 gap-16 py-24 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Client
            </p>
            <p className="mt-2 font-display text-lg text-ink">
              {project.client}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Services
            </p>
            <ul className="mt-2 space-y-1">
              {project.services.map((s) => (
                <li key={s} className="font-display text-lg text-ink">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Results
            </p>
            <dl className="mt-4 space-y-4">
              {project.results.map((r) => (
                <div key={r.label}>
                  <dt className="text-sm text-ink-dim">{r.label}</dt>
                  <dd className="font-display text-3xl font-medium text-accent">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
              Overview
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-dim">
              {project.overview}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
              The challenge
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-dim">
              {project.challenge}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
              Our approach
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-dim">
              {project.approach}
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <WorkGrid limit={2} showHeading={false} />
      </div>
      <CTA />
    </>
  );
}
