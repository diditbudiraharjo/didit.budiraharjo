import { forwardRef, type SelectHTMLAttributes } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-13 w-full appearance-none border border-border bg-transparent pl-4 pr-10 text-[15px] text-ink",
          "transition-colors duration-200 focus-visible:border-ink aria-invalid:border-ink/60 disabled:opacity-40",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <LuChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
);
Select.displayName = "Select";
