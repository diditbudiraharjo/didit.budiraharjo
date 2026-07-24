import type { AnimationAnalysis, ElementStyleSample } from "../../types.js";

function durationSeconds(value: string): number {
  const first = value.split(",")[0]?.trim() ?? "";
  if (first.endsWith("ms")) return Number(first.slice(0, -2)) / 1000;
  if (first.endsWith("s")) return Number(first.slice(0, -1));
  return 0;
}

/** Step 13: animation analysis - which elements transition/animate, and how. */
export function analyzeAnimation(elements: ElementStyleSample[]): AnimationAnalysis {
  const transitioning = elements.filter((e) => durationSeconds(e.transitionDuration) > 0);
  const animating = elements.filter((e) => e.animationName !== "none" && durationSeconds(e.animationDuration) > 0);

  const transitionGroups = new Map<string, { property: string; duration: string; timingFunction: string; count: number }>();
  for (const e of transitioning) {
    const property = e.transitionProperty.split(",")[0]?.trim() ?? "all";
    const key = `${property}|${e.transitionDuration}|${e.transitionTimingFunction}`;
    const existing = transitionGroups.get(key);
    if (existing) existing.count++;
    else transitionGroups.set(key, { property, duration: e.transitionDuration, timingFunction: e.transitionTimingFunction, count: 1 });
  }

  const animationGroups = new Map<string, { name: string; duration: string; count: number }>();
  for (const e of animating) {
    const name = e.animationName.split(",")[0]?.trim() ?? e.animationName;
    const key = `${name}|${e.animationDuration}`;
    const existing = animationGroups.get(key);
    if (existing) existing.count++;
    else animationGroups.set(key, { name, duration: e.animationDuration, count: 1 });
  }

  const transitions = [...transitionGroups.values()].sort((a, b) => b.count - a.count);
  const keyframeAnimations = [...animationGroups.values()].sort((a, b) => b.count - a.count);

  return { transitions, keyframeAnimations, hasAnimation: transitions.length > 0 || keyframeAnimations.length > 0 };
}
