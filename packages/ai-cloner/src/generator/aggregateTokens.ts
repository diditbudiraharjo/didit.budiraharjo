import type { SiteAnalysisInput } from "./types.js";
import { isNeutral, isTransparent } from "../utils/color.js";
import { darkCounterpartFor } from "./tokens.js";

export interface ThemeColors {
  brand: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  muted: string;
  border: string;
}

export interface SiteTokens {
  fontFamily: string;
  light: ThemeColors;
  dark: ThemeColors;
}

/** Aggregates every section's color/typography analysis across the whole site into one set of light + dark design tokens for globals.css. */
export function aggregateTokens(site: SiteAnalysisInput): SiteTokens {
  const backgroundCounts = new Map<string, number>();
  const textCounts = new Map<string, number>();
  const familyCounts = new Map<string, number>();

  for (const page of site.pages) {
    for (const section of page.sections) {
      for (const c of section.colors.palette) {
        if (isTransparent(c.value)) continue;
        const bucket = c.role === "background" ? backgroundCounts : c.role === "text" ? textCounts : null;
        if (bucket) bucket.set(c.value, (bucket.get(c.value) ?? 0) + c.count);
      }
      for (const f of section.typography.fontFamilies) {
        familyCounts.set(f.value, (familyCounts.get(f.value) ?? 0) + f.count);
      }
    }
  }

  const backgrounds = [...backgroundCounts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
  const texts = [...textCounts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
  const nonNeutralTexts = texts.filter((v) => !isNeutral(v));

  const surface = backgrounds[0] ?? "rgb(255, 255, 255)";
  const surfaceAlt = backgrounds[1] ?? "rgb(245, 245, 245)";
  const ink = texts[0] ?? "rgb(17, 17, 17)";
  const muted = texts[1] ?? "rgb(107, 114, 128)";
  const brand = nonNeutralTexts[0] ?? backgrounds.find((v) => !isNeutral(v)) ?? "rgb(79, 70, 229)";
  const border = "rgb(229, 231, 235)";

  const light: ThemeColors = { brand, surface, surfaceAlt, ink, muted, border };
  const dark: ThemeColors = {
    brand: darkCounterpartFor("accent", brand, "rgb(129, 140, 248)"),
    surface: darkCounterpartFor("surface", surface, "rgb(15, 15, 17)"),
    surfaceAlt: darkCounterpartFor("surfaceAlt", surfaceAlt, "rgb(31, 31, 35)"),
    ink: darkCounterpartFor("text", ink, "rgb(245, 245, 247)"),
    muted: darkCounterpartFor("muted", muted, "rgb(161, 161, 170)"),
    border: "rgb(39, 39, 42)",
  };

  const fontFamily = [...familyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "ui-sans-serif, system-ui, sans-serif";

  return { fontFamily, light, dark };
}
