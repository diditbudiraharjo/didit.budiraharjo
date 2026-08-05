import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const variants = {
  // Inverts automatically per-section: bg-ink/text-bg flip with the
  // .tone-light token swap, so the button always contrasts its surface.
  primary: "bg-ink text-bg",
  ghost: "border border-border text-ink hover:border-ink/80",
} as const;

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-13 px-7 text-sm",
  lg: "h-15 px-9 text-base",
} as const;

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-display font-medium " +
  "transition-[border-color,transform] duration-200 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = "Button";

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
