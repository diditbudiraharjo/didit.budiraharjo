const RGB_RE = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(value: string): Rgba | null {
  const match = RGB_RE.exec(value.trim());
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] !== undefined ? Number(match[4]) : 1,
  };
}

export function isTransparent(value: string): boolean {
  const rgba = parseColor(value);
  return value.trim() === "transparent" || (rgba !== null && rgba.a === 0);
}

/** True for white/black/gray colors - useful for excluding "neutral" colors from a brand palette guess. */
export function isNeutral(value: string): boolean {
  const rgba = parseColor(value);
  if (!rgba) return false;
  const { r, g, b } = rgba;
  return Math.max(r, g, b) - Math.min(r, g, b) <= 12;
}
