/**
 * Reusable design-system primitives, generated once per site and shared by every synthesized
 * section component - not copy-pasted per section. Styled entirely through the semantic
 * Tailwind color tokens (bg-surface, text-ink, bg-brand, ...) defined in globals.css, so they
 * automatically respect dark mode without any dark: variants of their own.
 */
export function buildUiPrimitives(): Map<string, string> {
  const files = new Map<string, string>();

  files.set(
    "components/ui/Button.tsx",
    [
      `import type { ButtonHTMLAttributes, ReactNode } from "react";`,
      "",
      `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {`,
      `  variant?: "primary" | "secondary";`,
      `  children: ReactNode;`,
      `}`,
      "",
      `export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {`,
      `  const base =`,
      `    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";`,
      `  const variants = {`,
      `    primary: "bg-brand text-white hover:opacity-90",`,
      `    secondary: "border border-border text-ink hover:bg-surface-2",`,
      `  };`,
      `  return (`,
      `    <button className={\`\${base} \${variants[variant]} \${className}\`} {...props}>`,
      `      {children}`,
      `    </button>`,
      `  );`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "components/ui/Card.tsx",
    [
      `import type { ReactNode } from "react";`,
      "",
      `export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {`,
      `  return (`,
      `    <div`,
      `      className={\`rounded-2xl border border-border bg-surface-2 p-6 shadow-sm transition-shadow duration-200 hover:shadow-md \${className}\`}`,
      `    >`,
      `      {children}`,
      `    </div>`,
      `  );`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "components/ui/Container.tsx",
    [
      `import type { ReactNode } from "react";`,
      "",
      `export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {`,
      `  return <div className={\`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 \${className}\`}>{children}</div>;`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "components/ui/SectionHeading.tsx",
    [
      `export function SectionHeading({`,
      `  eyebrow,`,
      `  title,`,
      `  subtitle,`,
      `  align = "left",`,
      `}: {`,
      `  eyebrow?: string;`,
      `  title: string;`,
      `  subtitle?: string;`,
      `  align?: "left" | "center";`,
      `}) {`,
      `  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";`,
      `  return (`,
      `    <div className={\`flex max-w-2xl flex-col gap-3 \${alignment}\`}>`,
      `      {eyebrow && <span className="text-sm font-semibold uppercase tracking-wide text-brand">{eyebrow}</span>}`,
      `      <h2 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h2>`,
      `      {subtitle && <p className="text-base text-muted sm:text-lg">{subtitle}</p>}`,
      `    </div>`,
      `  );`,
      `}`,
      "",
    ].join("\n"),
  );

  return files;
}
