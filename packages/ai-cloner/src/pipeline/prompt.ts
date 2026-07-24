import type { Rect, SectionAnalysis } from "../types.js";

function topEntries<T extends { count: number }>(items: T[], n: number): T[] {
  return items.slice(0, n);
}

/** Step 16: turns one section's analysis into a natural-language prompt for regenerating it with AI. */
export function generateSectionPrompt(
  sectionId: string,
  tag: string,
  rect: Rect,
  analysis: SectionAnalysis,
): string {
  const { layout, typography, colors, spacing, animation, components } = analysis;

  const lines: string[] = [];
  lines.push(
    `Rebuild the "${sectionId}" section (a <${tag}> landmark, ~${Math.round(rect.width)}x${Math.round(
      rect.height,
    )}px) as a React component styled with Tailwind CSS and animated with Framer Motion.`,
  );
  lines.push("");

  lines.push("Layout:");
  lines.push(
    `- Container display: ${Object.entries(layout.containerDisplay)
      .map(([d, c]) => `${d} (${c})`)
      .join(", ") || "block"}; estimated ${layout.columns} column(s).`,
  );
  if (Object.keys(layout.flexDirections).length) {
    lines.push(`- Flex direction(s): ${Object.keys(layout.flexDirections).join(", ")}.`);
  }
  if (Object.keys(layout.justifyContent).length) {
    lines.push(`- justify-content: ${Object.keys(layout.justifyContent).join(", ")}.`);
  }
  if (Object.keys(layout.alignItems).length) {
    lines.push(`- align-items: ${Object.keys(layout.alignItems).join(", ")}.`);
  }
  lines.push(`- Average child element size: ${layout.averageElementWidth}x${layout.averageElementHeight}px.`);
  lines.push("");

  lines.push("Typography:");
  const families = topEntries(typography.fontFamilies, 3).map((f) => f.value);
  if (families.length) lines.push(`- Font family: ${families.join(" / ")}.`);
  if (typography.headingScale.length) lines.push(`- Heading sizes: ${typography.headingScale.join(", ")}.`);
  const bodySize = topEntries(typography.fontSizes, 1)[0];
  if (bodySize) lines.push(`- Dominant body font size: ${bodySize.value}, weight ${topEntries(typography.fontWeights, 1)[0]?.value ?? "400"}.`);
  lines.push("");

  lines.push("Colors:");
  if (colors.background) lines.push(`- Background: ${colors.background}.`);
  if (colors.text) lines.push(`- Text: ${colors.text}.`);
  if (colors.primary) lines.push(`- Accent/brand color: ${colors.primary}.`);
  lines.push("");

  lines.push("Spacing:");
  if (spacing.baseUnit) lines.push(`- Base spacing unit: ${spacing.baseUnit}px.`);
  if (spacing.scale.length) lines.push(`- Spacing scale observed: ${spacing.scale.join(", ")}px.`);
  lines.push("");

  if (animation.hasAnimation) {
    lines.push("Animation:");
    for (const t of topEntries(animation.transitions, 3)) {
      lines.push(`- Transition: ${t.property} ${t.duration} ${t.timingFunction} (${t.count} element(s)).`);
    }
    for (const a of topEntries(animation.keyframeAnimations, 3)) {
      lines.push(`- Keyframe animation: ${a.name} ${a.duration} (${a.count} element(s)).`);
    }
    lines.push("- Use Framer Motion (initial/whileInView/transition) to reproduce this on scroll-into-view.");
    lines.push("");
  }

  const componentList = [
    components.buttons ? `${components.buttons} button(s)` : null,
    components.cards ? `${components.cards} card(s)` : null,
    components.navs ? `${components.navs} nav element(s)` : null,
    components.forms ? `${components.forms} form(s)` : null,
    components.inputs ? `${components.inputs} input(s)` : null,
    components.headings ? `${components.headings} heading(s)` : null,
    components.images ? `${components.images} image(s)` : null,
    components.links ? `${components.links} link(s)` : null,
    components.lists ? `${components.lists} list(s)` : null,
  ].filter((v): v is string => v !== null);
  if (componentList.length) lines.push(`UI components detected: ${componentList.join(", ")}.`);
  if (components.detected.length) lines.push(`Named patterns detected: ${components.detected.join(", ")}.`);

  lines.push("");
  lines.push(
    "Match the extracted layout, typography, color, and spacing values as closely as possible; " +
      "use semantic HTML and accessible markup.",
  );

  return lines.join("\n");
}
