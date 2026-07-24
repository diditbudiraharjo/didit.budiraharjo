import type { Page } from "playwright-core";
import type { ElementStyleSample } from "../types.js";

const MAX_ELEMENTS_PER_SECTION = 400;
const MAX_TEXT_LENGTH = 80;

/**
 * Captures a curated computed-style snapshot for every descendant of the element matching
 * `selector` - the raw material steps 9-14 (layout/typography/color/spacing/animation/
 * component analysis) run their aggregation over. Real getComputedStyle() reads, not
 * fabricated values.
 */
export async function sampleSectionStyles(
  page: Page,
  selector: string,
): Promise<ElementStyleSample[]> {
  return page.evaluate(
    ({ selector, maxElements, maxTextLength }) => {
      const root = document.querySelector(selector);
      if (!root) return [];

      const elements = [root, ...root.querySelectorAll("*")].slice(0, maxElements);

      return elements.map((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const directText = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent ?? "")
          .join(" ")
          .trim()
          .slice(0, maxTextLength);

        return {
          tag: el.tagName.toLowerCase(),
          classes: [...el.classList],
          text: directText,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          display: style.display,
          position: style.position,
          flexDirection: style.flexDirection,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          gap: style.gap,
          gridTemplateColumns: style.gridTemplateColumns,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textAlign: style.textAlign,
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          margin: style.margin,
          padding: style.padding,
          transitionProperty: style.transitionProperty,
          transitionDuration: style.transitionDuration,
          transitionTimingFunction: style.transitionTimingFunction,
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          opacity: style.opacity,
        };
      });
    },
    { selector, maxElements: MAX_ELEMENTS_PER_SECTION, maxTextLength: MAX_TEXT_LENGTH },
  );
}
