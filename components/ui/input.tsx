import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-13 w-full border border-border bg-transparent px-4 text-[15px] text-ink",
        "placeholder:text-muted transition-colors duration-200",
        "focus-visible:border-ink aria-invalid:border-ink/60 disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
