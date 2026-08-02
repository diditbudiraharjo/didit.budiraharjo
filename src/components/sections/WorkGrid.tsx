import Link from "next/link";
import { work } from "@/lib/data/work";
import SectionHeading from "@/components/ui/SectionHeading";
import WorkCard from "@/components/sections/WorkCard";

export default function WorkGrid({
  limit,
  showHeading = true,
}: {
  limit?: number;
  showHeading?: boolean;
}) {
  const projects = limit ? work.slice(0, limit) : work;

  return (
    <section id="work" className="container-xl py-28 md:py-36">
      {showHeading && (
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Products we've shipped, brands we've built."
            className="max-w-2xl"
          />
          <Link
            href="/work"
            data-cursor-hover
            className="hidden shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent md:inline-flex"
          >
            View all work
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
        {projects.map((project, i) => (
          <WorkCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {showHeading && (
        <Link
          href="/work"
          data-cursor-hover
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent md:hidden"
        >
          View all work
          <span aria-hidden>→</span>
        </Link>
      )}
    </section>
  );
}
