import { cn } from "@/utils/cn";

type Props = { items: string[]; className?: string };

function Row({ items, ariaHidden = false }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-ink/90">
            {item}
          </span>
          <span aria-hidden className="size-2 rounded-full bg-ink/40" />
        </span>
      ))}
    </div>
  );
}

export function Marquee({ items, className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <div className="flex w-max animate-marquee">
        <Row items={items} />
        <Row items={items} ariaHidden />
      </div>
    </div>
  );
}
