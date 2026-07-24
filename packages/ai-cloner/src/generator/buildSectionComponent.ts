import type { AnimationAnalysis } from "../types.js";
import type { SectionAnalysisBundle } from "./types.js";
import { selectBlock } from "./selectBlock.js";

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

function parseSeconds(value: string): number {
  const first = value.split(",")[0]?.trim() ?? "";
  if (first.endsWith("ms")) return Number(first.slice(0, -2)) / 1000;
  if (first.endsWith("s")) return Number(first.slice(0, -1));
  return 0;
}

/** Animation same as the original site step: reuses the extracted transition/keyframe duration when present. */
function animationDurationFor(animation: AnimationAnalysis): number {
  const fromTransition = animation.transitions[0] ? parseSeconds(animation.transitions[0].duration) : 0;
  const fromKeyframe = animation.keyframeAnimations[0] ? parseSeconds(animation.keyframeAnimations[0].duration) : 0;
  const duration = fromTransition || fromKeyframe;
  return duration > 0 ? Math.min(duration, 1.5) : 0.6;
}

/**
 * Wraps a synthesized block in a motion.section (entrance animation timed from the site's
 * own extracted animation data) and the shared Container primitive.
 */
export function buildSectionComponent(section: SectionAnalysisBundle, componentName: string): string {
  const inner = selectBlock(section);
  const duration = animationDurationFor(section.animation);

  return [
    `"use client";`,
    "",
    `import { motion } from "framer-motion";`,
    `import { Button } from "../../ui/Button";`,
    `import { Card } from "../../ui/Card";`,
    `import { Container } from "../../ui/Container";`,
    `import { SectionHeading } from "../../ui/SectionHeading";`,
    `import { ThemeToggle } from "../../ui/ThemeToggle";`,
    "",
    `export function ${componentName}() {`,
    `  return (`,
    `    <motion.section`,
    `      initial={{ opacity: 0, y: 24 }}`,
    `      whileInView={{ opacity: 1, y: 0 }}`,
    `      viewport={{ once: true, amount: 0.2 }}`,
    `      transition={{ duration: ${duration}, ease: "easeOut" }}`,
    `    >`,
    `      <Container>`,
    indent(inner, 8),
    `      </Container>`,
    `    </motion.section>`,
    `  );`,
    `}`,
    "",
  ].join("\n");
}
