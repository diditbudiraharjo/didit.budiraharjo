---
name: matte design
description: Design with Purpose. Build with Intelligence.
colors:
  matte-black: "#0E0E0E"
  warm-white: "#F7F6F3"
  graphite: "#181715"
  graphite-raised: "#211F1C"
  hairline-on-dark: "#33312C"
  hairline-on-light: "#DDD9D1"
  stone-muted: "#8C877D"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Public Sans', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  hairline: "1px"
  sm: "2px"
  md: "4px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
  2xl: "160px"
components:
  button-primary:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.matte-black}"
    rounded: "{rounded.pill}"
    padding: "18px 40px"
  button-primary-hover:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.matte-black}"
    rounded: "{rounded.pill}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.pill}"
    padding: "18px 40px"
  card-surface:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.md}"
    padding: "32px"
---

# Design System: matte design

## 1. Overview

**Creative North Star: "The Signature in the Dark"**

matte design is a creative agency whose entire visual system is a single handwritten "M" signature mark, set loose in a near-black room. Everything else — type, imagery, motion — exists to give that signature room to breathe. Color strategy is **Drenched, Vercel-monochrome-reference**: matte black is the dominant surface across nearly the whole site, warm white is the singular contrast ink, and depth is carried entirely by tone, not hue — the same commitment Vercel makes to pure-black monochrome, not a timid neutral default. Confidence is expressed through scale (very large type), negative space (generous, unapologetic margins), and precision motion (3D and scroll choreography that feels engineered, not decorative). This is the visual register of trionn.com, rolfjensen.studio, izanami-official.com, and aboutluca.com: cinematic dark stages, oversized typographic statements, committed monochrome palettes, and interaction detail (magnetic buttons, cursor-aware 3D, scroll-scrubbed sequences) that rewards attention rather than shouting for it.

The system explicitly rejects the generic corporate/SaaS template: no identical icon+heading+text card grids, no gradient-clipped text, no tiny uppercase eyebrow stamped above every section, no stock-photo boardroom handshakes. It also rejects color as a crutch — there is no accent hue to reach for when hierarchy gets hard; hierarchy is solved with type scale, spacing, opacity, and motion timing instead.

**Key Characteristics:**
- Two-tone monochrome (matte black / warm white) — no third color is ever introduced
- Oversized, confident display type with tight negative tracking, generous line-height≈0.95 on display
- One recurring brand motif (the signature "M" mark) rendered in 3D, never diluted into a generic icon set
- Flat surfaces, no drop shadows — depth comes from layering, opacity, and grain, not elevation
- Choreographed motion: every section carries a deliberate scroll, pointer, or reveal behavior

## 2. Colors

A strict two-tone system: matte black rooms with warm-white ink, occasionally inverted. Every other value in the palette is a tonal step of black or white, never a new hue.

### Primary
- **Matte Black** (#0E0E0E): the dominant surface — page background, dark sections, primary ink on light surfaces. Not a pure `#000`; it carries a faint warmth so it never reads as cold OLED-black.

### Neutral
- **Warm White** (#F7F6F3): primary ink on dark surfaces, and the background of light sections (contact/legal). Paired name intentionally: this is "paper", not "white" — a warm, slightly off-white that echoes the moodboard's paper tone.
- **Graphite** (#181715): raised surface on top of matte black — cards, the mobile-nav panel, input fields. One step lighter than the page background so structure reads without a border.
- **Graphite Raised** (#211F1C): hover/active state of Graphite surfaces.
- **Hairline on Dark** (#33312C): 1px dividers and borders on dark sections.
- **Hairline on Light** (#DDD9D1): 1px dividers and borders on light sections.
- **Stone Muted** (#8C877D): secondary/muted text — captions, meta labels, disabled states. This is the *only* approved "muted text" color; never drop body copy to a lighter, lower-contrast gray than this for readability's sake.

### Named Rules
**The Two-Tone Rule.** No third hue is ever introduced. Every color in the system is matte black, warm white, or a tonal step between them. If a section needs emphasis, reach for scale, weight, motion, or inversion — never a new color.

**The Inversion Rule.** Interactive elements invert against their surrounding surface: a primary button is always warm-white-on-black or matte-black-on-white, whichever contrasts with the section it sits in. Never a mid-tone button.

## 3. Typography

**Display Font:** Bricolage Grotesque (with system-ui fallback)
**Body Font:** Public Sans (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono

**Character:** The client's own moodboard specifies Satoshi/Poppins for the wordmark, but Satoshi's distribution (Fontshare, custom license, no Google Fonts / npm mirror) is unreachable from this build environment's font pipeline — self-hosting it wasn't possible here, so the display face was re-picked against the same brief in Bricolage Grotesque's favor: a geometric-but-humane variable grotesque with enough idiosyncrasy (its optical-size axis widens and softens at display sizes) to carry a one-line hero statement at 6rem without reading as a corporate wordmark, the same job Satoshi was chosen for. It is intentionally not Space Grotesk (the reflex-default geometric grotesque) or Poppins (too rounded/friendly for the moodboard's "Elegant, Professional, Trustworthy" tone). Public Sans is the contrast partner: a humanist, USWDS-grade neutral grotesque chosen specifically so it doesn't repeat Bricolage's geometric construction (two geometric sans-serifs side by side is the pairing failure mode) — paragraphs stay quiet and effortless to read against the display face's confidence. JetBrains Mono appears rarely and on purpose — index numbers on work items, footer coordinates, cursor state text — never as a section-eyebrow reflex; its faint technical register also nods honestly at "smart development," one of the agency's three services. **If Satoshi's font files become available later** (e.g. purchased/exported and dropped into `public/fonts`), swap the `next/font/google` Bricolage Grotesque import for a `next/font/local` Satoshi import — every other token in this system stays valid.

### Hierarchy
- **Display** (600, `clamp(2.75rem, 7vw, 6rem)`, line-height 0.95, letter-spacing -0.02em): hero headline and section-closing statements only. Ceiling is 6rem — never larger.
- **Headline** (600, `clamp(1.75rem, 3vw, 2.75rem)`, line-height 1.05, letter-spacing -0.015em): section titles (Services, Work, About, Contact).
- **Title** (600, 1.25rem, line-height 1.3, letter-spacing -0.01em): card/item titles inside a section (a single work item, a single service).
- **Body** (400, 1.0625rem, line-height 1.7): all paragraph copy. Max measure 65–75ch.
- **Label** (400, 0.75rem, letter-spacing 0.18em, uppercase, JetBrains Mono): rare utility text — work-index numbers, footer meta, cursor tags. Never repeated as a generic section eyebrow.

### Named Rules
**The One Display Face Rule.** Bricolage Grotesque is the only face used above 1.25rem. Introducing a second display face would fight the signature mark for attention.

## 4. Elevation

Flat by doctrine — this system uses no drop shadows. Depth is conveyed through surface layering (matte black → graphite → graphite-raised), opacity (70–90% overlays on scrim/gradient transitions), and a subtle grain texture on hero/CTA surfaces that keeps large flat black areas from looking like a dead pixel field. `backdrop-filter: blur()` is permitted in exactly one functional role — the sticky header once scrolled, and the mobile nav scrim — never as a decorative card treatment.

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow` anywhere in the system. If something needs to look "lifted", raise its surface tone (Graphite → Graphite Raised) instead.

## 5. Components

### Buttons
- **Shape:** fully rounded pill (`border-radius: 999px`) — the one rounded element in an otherwise sharp-cornered system, reserved for calls to action so it reads as "press me."
- **Primary:** Warm White background, Matte Black text, `padding: 18px 40px`, Bricolage Grotesque 600. Magnetic on hover (translates a few px toward the cursor) with a scale(0.98) on press.
- **Hover / Focus:** no color shift (Two-Tone Rule) — hover is communicated by the magnetic pointer-follow translation and a focus-visible ring in Warm White at 2px offset.
- **Ghost / Secondary:** transparent background, 1px Hairline border, Warm White text; on hover the border brightens to full Warm White.

### Cards / Containers
- **Corner Style:** sharp by default (`0–2px` radius) — the architectural counterpoint to the pill buttons. Work-grid tiles and service cards are edge-to-edge rectangles, echoing the moodboard's building photography.
- **Background:** Graphite on dark sections; hover lifts to Graphite Raised.
- **Shadow Strategy:** none (see Elevation). Separation comes from a 1px Hairline border only.
- **Internal Padding:** 32px (`spacing.lg`).

### Inputs / Fields
- **Style:** transparent background, 1px Hairline border, Warm White text, Bricolage Grotesque labels.
- **Focus:** border brightens to full Warm White; no glow, no color shift.
- **Error:** label and helper text switch to a slightly desaturated warm-white-on-black underline treatment — no red is introduced (Two-Tone Rule); error state is communicated by icon + copy, not color, to preserve WCAG-safe redundancy.

### Navigation
- Fixed header, transparent over the hero, gains a Matte Black/70% + blur backdrop once scrolled past the hero. Links are Warm White at 70% opacity, 100% on hover/active, JetBrains Mono index-style treatment reserved for the signature mark only. Mobile nav is a fullscreen Matte Black overlay with oversized Bricolage Grotesque links revealed in a staggered entrance.

### Signature Mark (Signature Component)
The hand-drawn "M" swoosh is the one recurring, non-negotiable motif — never redrawn as a generic icon, never recolored. In the hero it exists as a real 3D object (matte-finish extruded line, Warm White on Matte Black) that idles with a slow autonomous rotation, tilts toward the pointer, and advances its rotation as the user scrolls past the hero. Everywhere else (nav, footer, favicon) it appears flat, always Warm White on Matte Black or Matte Black on Warm White — never as a filled icon-style glyph.

## 6. Do's and Don'ts

### Do:
- **Do** keep the palette to Matte Black (#0E0E0E) and Warm White (#F7F6F3) plus their tonal steps only — no third hue, ever.
- **Do** give every animation (3D logo, GSAP scroll sequences, Framer Motion reveals) a `prefers-reduced-motion` fallback that crossfades or shows the end state instantly — content must never depend on the animation to become visible.
- **Do** use the pill radius only for buttons; keep cards, images, and tiles sharp-cornered.
- **Do** let the signature "M" mark be the only recurring iconographic motif — resist adding a generic icon set.

### Don't:
- **Don't** build generic corporate/SaaS template scaffolding: no identical icon+heading+text card grids, no gradient-clipped text, no tiny uppercase eyebrow ("ABOUT" / "01 · PROCESS") repeated above every section, no stock-photo boardroom handshakes.
- **Don't** introduce color-for-color's-sake — busy, multi-color, gradient-heavy surfaces are explicitly rejected; this is a strict matte-black/warm-white system.
- **Don't** ship a static, non-interactive section — every section carries a deliberate scroll, transition, or micro-interaction by brief requirement.
- **Don't** use `box-shadow` anywhere; depth comes from surface layering only (Flat-By-Default Rule).
- **Don't** drop muted/secondary text below Stone Muted (#8C877D) in lightness — that is the contrast floor, not a suggestion.
