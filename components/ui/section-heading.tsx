import { cn } from "@/utils/cn";
import { Reveal } from "@/components/motion/reveal";

type Props = {
  id?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * No eyebrow by design (see DESIGN.md Don'ts) — the headline itself carries
 * the section's weight instead of a small tracked label above it.
 */
export function SectionHeading({ id, title, lead, align = "left", className }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2
        id={id}
        className="text-balance font-display text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.015em]"
      >
        {title}
      </h2>
      {lead ? <p className="mt-5 text-lg text-muted">{lead}</p> : null}
    </Reveal>
  );
}
