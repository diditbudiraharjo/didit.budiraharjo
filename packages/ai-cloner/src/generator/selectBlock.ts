import type { SectionAnalysisBundle } from "./types.js";
import { navbarBlock } from "./blocks/navbar.js";
import { heroBlock } from "./blocks/hero.js";
import { cardGridBlock } from "./blocks/cardGrid.js";
import { footerBlock } from "./blocks/footer.js";
import { formBlock } from "./blocks/form.js";
import { genericBlock } from "./blocks/generic.js";

/**
 * Picks which archetype to synthesize a section as, purely from its analysis stats (tag,
 * detected named patterns, component counts) - never from any captured markup, since none
 * is available to this generator.
 */
export function selectBlock(section: SectionAnalysisBundle): string {
  const { tag, components } = section;
  const detected = new Set(components.detected);

  if (tag === "nav" || detected.has("navbar") || (components.navs >= 1 && components.links >= 2)) {
    return navbarBlock(section);
  }
  if (tag === "footer" || detected.has("footer")) {
    return footerBlock(section);
  }
  if (components.forms >= 1 || components.inputs >= 2) {
    return formBlock(section);
  }
  if (
    detected.has("card-grid") ||
    detected.has("pricing-table") ||
    detected.has("testimonial") ||
    components.cards >= 2
  ) {
    return cardGridBlock(section);
  }
  if (detected.has("hero") || (tag === "header" && components.headings >= 1)) {
    return heroBlock(section);
  }
  return genericBlock(section);
}
