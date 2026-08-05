import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const widths = {
  default: "max-w-[1440px]",
  narrow: "max-w-[680px]",
  wide: "max-w-[1680px]",
} as const;

type Props = HTMLAttributes<HTMLDivElement> & { size?: keyof typeof widths };

export function Container({ size = "default", className, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto w-full px-6 sm:px-10 lg:px-16", widths[size], className)}
      {...props}
    />
  );
}
