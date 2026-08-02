import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  reverse?: boolean;
  durationSeconds?: number;
};

export default function Marquee({
  items,
  className,
  reverse = false,
  durationSeconds = 28,
}: MarqueeProps) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 gap-10 [animation:marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
