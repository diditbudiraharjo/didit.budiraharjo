import { parseColor } from "../utils/color.js";

/** Tailwind arbitrary-value color utility using the exact extracted color, e.g. "bg-[rgb(34,34,34)]". */
export function colorClass(prefix: "bg" | "text" | "border", value: string | null, fallback: string): string {
  if (!value) return fallback;
  return `${prefix}-[${value.replace(/\s+/g, "")}]`;
}

function hslOf(value: string | null): { h: number; s: number; l: number } | null {
  const rgba = value ? parseColor(value) : null;
  return rgba ? rgbToHsl(rgba.r, rgba.g, rgba.b) : null;
}

function fromHsl(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Derives a dark-mode counterpart for one semantic color role. Unlike a blind lightness
 * inversion, each role is pinned to a lightness range appropriate for dark themes regardless
 * of how light or dark the *original* extracted value happened to be - a light-mode surface
 * that was already dark (e.g. a dark header background) must still map to a dark surface in
 * dark mode, not flip to light. Hue/saturation are preserved from the real extracted color
 * so the result still reads as "the same brand", just retoned for a dark background.
 */
export function darkCounterpartFor(
  role: "surface" | "surfaceAlt" | "text" | "muted" | "accent",
  value: string | null,
  fallback: string,
): string {
  const hsl = hslOf(value);
  if (!hsl) return fallback;

  switch (role) {
    case "surface":
      return fromHsl(hsl.h, Math.min(hsl.s, 15), 9);
    case "surfaceAlt":
      return fromHsl(hsl.h, Math.min(hsl.s, 15), 16);
    case "text":
      return fromHsl(hsl.h, Math.min(hsl.s, 10), 95);
    case "muted":
      return fromHsl(hsl.h, Math.min(hsl.s, 10), 68);
    case "accent":
      return fromHsl(hsl.h, Math.max(hsl.s, 45), 70);
  }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      break;
    case gn:
      h = ((bn - rn) / d + 2) / 6;
      break;
    default:
      h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** Responsive Tailwind grid-cols classes: 1 column on mobile, scaling up to the observed column count. */
export function responsiveGridCols(columns: number): string {
  const target = Math.min(Math.max(columns, 1), 6);
  if (target <= 1) return "grid-cols-1";
  if (target === 2) return "grid-cols-1 sm:grid-cols-2";
  return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${target}`;
}

/** Responsive Tailwind flex-direction classes: stacked on mobile, matching the extracted direction from md up. */
export function responsiveFlexDirection(flexDirection: string): string {
  return flexDirection.startsWith("column") ? "flex-col" : "flex-col md:flex-row";
}

/** Tailwind arbitrary-value spacing utility using the exact extracted px value. */
export function spacingClass(prefix: "p" | "px" | "py" | "gap", px: number | null, fallback: string): string {
  if (px === null || px <= 0) return fallback;
  return `${prefix}-[${Math.round(px)}px]`;
}

/** Tailwind arbitrary-value font-size utility using the exact extracted px value. */
export function fontSizeClass(px: number | null, fallback: string): string {
  if (!px) return fallback;
  return `text-[${Math.round(px)}px]`;
}
