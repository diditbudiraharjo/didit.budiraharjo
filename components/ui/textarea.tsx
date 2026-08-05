import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-y border border-border bg-transparent px-4 py-3 text-[15px] text-ink",
        "placeholder:text-muted transition-colors duration-200",
        "focus-visible:border-ink aria-invalid:border-ink/60 disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
