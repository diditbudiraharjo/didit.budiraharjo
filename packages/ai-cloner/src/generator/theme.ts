/** Dark mode infrastructure: a working ThemeProvider + toggle button, not just a Tailwind flag. */
export function buildThemeFiles(): Map<string, string> {
  const files = new Map<string, string>();

  files.set(
    "components/ThemeProvider.tsx",
    [
      `"use client";`,
      "",
      `import { createContext, useContext, useEffect, useState, type ReactNode } from "react";`,
      "",
      `type Theme = "light" | "dark";`,
      `interface ThemeContextValue {`,
      `  theme: Theme;`,
      `  toggle: () => void;`,
      `}`,
      "",
      `const ThemeContext = createContext<ThemeContextValue | null>(null);`,
      "",
      `export function useTheme() {`,
      `  const ctx = useContext(ThemeContext);`,
      `  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");`,
      `  return ctx;`,
      `}`,
      "",
      `export function ThemeProvider({ children }: { children: ReactNode }) {`,
      `  const [theme, setTheme] = useState<Theme>("light");`,
      "",
      `  useEffect(() => {`,
      `    const stored = window.localStorage.getItem("theme") as Theme | null;`,
      `    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");`,
      `    setTheme(initial);`,
      `  }, []);`,
      "",
      `  useEffect(() => {`,
      `    document.documentElement.classList.toggle("dark", theme === "dark");`,
      `    window.localStorage.setItem("theme", theme);`,
      `  }, [theme]);`,
      "",
      `  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));`,
      "",
      `  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "components/ui/ThemeToggle.tsx",
    [
      `"use client";`,
      "",
      `import { useTheme } from "../ThemeProvider";`,
      "",
      `export function ThemeToggle() {`,
      `  const { theme, toggle } = useTheme();`,
      `  return (`,
      `    <button`,
      `      type="button"`,
      `      onClick={toggle}`,
      `      aria-label="Toggle dark mode"`,
      `      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-surface-2"`,
      `    >`,
      `      {theme === "dark" ? "☀️" : "🌙"}`,
      `    </button>`,
      `  );`,
      `}`,
      "",
    ].join("\n"),
  );

  // Runs before hydration (blocking, inline in <head>) so the correct theme applies on first
  // paint - without this, the page would flash light mode before React mounts.
  files.set(
    "components/ThemeScript.tsx",
    [
      `const SCRIPT = \``,
      `(function () {`,
      `  try {`,
      `    var stored = window.localStorage.getItem("theme");`,
      `    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");`,
      `    if (theme === "dark") document.documentElement.classList.add("dark");`,
      `  } catch (e) {}`,
      `})();`,
      `\`;`,
      "",
      `export function ThemeScript() {`,
      `  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;`,
      `}`,
      "",
    ].join("\n"),
  );

  return files;
}
