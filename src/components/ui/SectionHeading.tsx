import RevealText from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <RevealText
          as="span"
          className="text-xs font-medium uppercase tracking-[0.25em] text-accent"
        >
          {eyebrow}
        </RevealText>
      )}
      <RevealText
        as="h2"
        delay={0.05}
        className="text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl"
      >
        {title}
      </RevealText>
      {description && (
        <RevealText
          as="p"
          delay={0.1}
          className={cn(
            "max-w-xl text-balance text-lg text-ink-dim",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </RevealText>
      )}
    </div>
  );
}
