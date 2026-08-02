"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/data/work";
import { fadeUp, viewportOnce } from "@/lib/motion";

export default function WorkCard({
  project,
  index,
}: {
  project: CaseStudy;
  index: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay: (index % 2) * 0.08 }}
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor-hover
        className="group block"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
          }}
        >
          <div className="absolute inset-0 bg-bg/0 transition-colors duration-500 group-hover:bg-bg/10" />
          <div className="absolute inset-0 flex items-end justify-between p-6">
            <span className="rounded-full bg-bg/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-ink backdrop-blur-sm">
              {project.category}
            </span>
            <span className="rounded-full bg-bg/70 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
              {project.year}
            </span>
          </div>
          <div className="absolute inset-0 origin-bottom scale-y-0 bg-ink/[0.04] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
              {project.client}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-ink-dim">
              {project.summary}
            </p>
          </div>
          <span
            aria-hidden
            className="mt-1 shrink-0 text-xl text-ink-dim transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          >
            ↗
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
