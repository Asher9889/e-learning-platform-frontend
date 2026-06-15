---
name: E-Learning LMS
description: Controlled Learning Management System for universities and institutions
colors:
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  card: oklch(1 0 0)
  card-foreground: oklch(0.145 0 0)
  primary: oklch(0.205 0 0)
  primary-foreground: oklch(0.985 0 0)
  secondary: oklch(0.97 0 0)
  secondary-foreground: oklch(0.205 0 0)
  muted: oklch(0.97 0 0)
  muted-foreground: oklch(0.556 0 0)
  accent: oklch(0.97 0 0)
  accent-foreground: oklch(0.205 0 0)
  destructive: oklch(0.577 0.245 27.325)
  border: oklch(0.922 0 0)
  input: oklch(0.922 0 0)
  ring: oklch(0.708 0 0)
  sidebar: oklch(0.985 0 0)
  sidebar-foreground: oklch(0.145 0 0)
  sidebar-accent: oklch(0.97 0 0)
  sidebar-accent-foreground: oklch(0.205 0 0)
  sidebar-border: oklch(0.922 0 0)
  sidebar-primary: oklch(0.205 0 0)
  sidebar-primary-foreground: oklch(0.985 0 0)
typography:
  display:
    fontFamily: Inter Variable, system-ui, sans-serif
    fontSize: clamp(2rem, 4vw, 3rem)
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline:
    fontFamily: Inter Variable, system-ui, sans-serif
    fontSize: clamp(1.25rem, 2vw, 1.5rem)
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  title:
    fontFamily: Inter Variable, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body:
    fontFamily: Inter Variable, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: normal
  label:
    fontFamily: Inter Variable, system-ui, sans-serif
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: normal
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
  "2xl": 1.125rem
  "3xl": 1.375rem
  "4xl": 1.625rem
spacing:
  "0": 0px
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "5": 1.25rem
  "6": 1.5rem
  "8": 2rem
  "10": 2.5rem
  "12": 3rem
  "16": 4rem
  "20": 5rem
  "24": 6rem
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: 0.625rem 1rem
    height: 2.25rem
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 0.5rem 0.75rem
    height: 2.25rem
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: 0.5rem 0.75rem
    height: 2.25rem
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 0.5rem 0.75rem
    height: 2.25rem
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: white
    rounded: "{rounded.md}"
    padding: 0.5rem 0.75rem
    height: 2.25rem
  input:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 0.5rem 0.625rem
    height: 2.25rem
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: 1rem
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: 9999px
    padding: 0.125rem 0.5rem
    height: 1.25rem
---

# Design System: E-Learning LMS

## 1. Overview

**Creative North Star: "The Scholarly Atelier"**

A precision workshop for institutional knowledge management — every surface, control, and panel is a tool, not a decoration. This system deliberately rejects the cluttered information density of legacy LMS platforms (Moodle, Blackboard classic) and the playful gamification of consumer ed-tech. Instead, it occupies a clear lane: authoritative without being cold, structured without being rigid.

The palette is intentionally restrained — near-black ink on pure-white canvas — because the content, not the chrome, does the work. Inter Variable in a single weight-driven hierarchy eliminates font-pairing decisions so designers focus on information architecture. Shadows are present but subdued, creating a subtle physical vocabulary without undermining the system's flat-by-nature foundation.

**Key Characteristics:**
- Monochromatic authority: zero-chroma neutral palette with a single color used for destructive states
- Single-family typography: Inter Variable across all roles, from display to label
- Tactile restraint: subtle shadows and hover lifts that communicate interactivity without decoration
- Institutional clarity: semantic color roles, consistent component vocabulary, no ambiguity

## 2. Colors

A strictly gray-scale palette where color carries semantic weight, not decoration. Zero chroma on all neutrals ensures the system communicates through hierarchy and spacing, not hue. The only chromatic note is the destructive red, which earns its color by being rare.

### Primary
- **Ink** (`oklch(0.205 0 0)`): Primary text, primary buttons, active sidebar items. The anchor — near-black with no warmth or coolness. Used wherever the system needs maximum authority.
- **Ink Foreground** (`oklch(0.985 0 0)`): Text on Ink backgrounds. Pure white, maximum contrast.

### Secondary
- **Surface Tint** (`oklch(0.97 0 0)`): Secondary buttons, muted backgrounds, accent areas, sidebar accent. A whisper-gray that separates panels without competing with content.
- **Surface Tint Foreground** (`oklch(0.205 0 0)`): Text on Surface Tint backgrounds.

### Neutral
- **Canvas** (`oklch(1 0 0)`): Page and card backgrounds. Absolute white, the foundation everything sits on.
- **Body Ink** (`oklch(0.145 0 0)`): Body text, headings, and interactive labels. Very dark gray, not pure black — avoids the glare of #000 while maintaining 4.5:1+ contrast.
- **Muted Ink** (`oklch(0.556 0 0)`): Secondary text, placeholder text, descriptions. At 55.6% lightness on Canvas, this hits a deliberate secondary tier.
- **Divider** (`oklch(0.922 0 0)`): Borders, horizontal rules, input strokes. Light gray at 92.2% lightness — visible enough to define edges, subtle enough to recede.
- **Input Stroke** (`oklch(0.922 0 0)`): Input field borders, matching Divider in lightness.
- **Ring** (`oklch(0.708 0 0)`): Focus rings and outline indicators. Medium gray at 70.8% lightness — visible against all surface colors.

### Semantic
- **Signal Red** (`oklch(0.577 0.245 27.325)`): Destructive actions, errors, critical warnings. The only chromatic color in the system. Its rarity is the point.

### Chart (grayscale)
- Chart-1 through Chart-5 step from light gray to dark gray, intended as a baseline that implementations can substitute with accessible hues.

### Sidebar (light mode)
- **Sidebar Canvas** (`oklch(0.985 0 0)`): Slightly cooler than the main Canvas, creating an implicit panel separation at 98.5% lightness. No shadow needed.
- Sidebar tokens follow the same Ink / Surface Tint / Divider pattern as the main surface.

### Named Rules
**The Zero-Chroma Rule.** Neutrals carry zero chroma. No warm tint, no cool tint. The system's authority comes from clarity, not atmosphere.

**The Rare Color Rule.** Destructive red is the only chromatic color. It appears on ≤2% of any given screen. Its rarity is how it earns its communicative power.

### Dark Mode
The dark palette inverts the light palette on the same OKLCH axis: Canvas becomes `oklch(0.145 0 0)`, Ink becomes `oklch(0.985 0 0)`, and semantic relationships invert proportionally. The only addition is a blue-tinted sidebar primary (`oklch(0.488 0.243 264.376)`) to distinguish active navigation in dark context.

## 3. Typography

**Display Font:** Inter Variable (with system-ui, sans-serif fallback)
**Body Font:** Inter Variable (with system-ui, sans-serif fallback)

**Character:** A single-weight-axis sans-serif for every role — display to label — because product UI doesn't benefit from font pairing. Inter's variable axis (wght 300–800) provides enough range for hierarchy without introducing a second typeface's drama. The system reads as precise, calm, and engineered.

### Hierarchy
- **Display** (ExtraBold 800, `clamp(2rem, 4vw, 3rem)`, 1.1 line-height, -0.03em letter-spacing): Dashboard section titles, welcome messages, hero areas in the public home page. Fixed rem scale preferred for product surfaces; fluid clamp reserved for the public-facing landing page.
- **Headline** (Bold 700, `clamp(1.25rem, 2vw, 1.5rem)`, 1.2 line-height, -0.02em letter-spacing): Card titles, panel headers, modal titles. The primary structural heading.
- **Title** (Semibold 600, `1rem`, 1.4 line-height, -0.01em letter-spacing): Sidebar navigation items, table column headers, group labels within panels.
- **Body** (Regular 400, `0.875rem`, 1.6 line-height): All paragraph text, table cells, form labels. Max line length: 65–75ch for prose, unrestricted for data/tables.
- **Label** (Medium 500, `0.8125rem`, 1.25 line-height): Input labels, badge text, small metadata, data values in compact views.
- **Small** (Regular 400, `0.75rem`, 1.25 line-height): Captions, helper text, timestamp, footnote.
- **Monospace** (use `font-mono` for code blocks, API keys, UUIDs, file names — inherits system monospace via Tailwind).

### Named Rules
**The One Family Rule.** Inter Variable everywhere. No serif for headings, no mono for labels. The weight axis does all the hierarchy work.

## 4. Elevation

The system is flat by nature with restrained shadow depth. Most surfaces sit on the Canvas without lift. Shadows appear on hover (cards, buttons) and on interactive overlays (dropdowns, modals, tooltips) to signal that the user has moved into a temporary or elevated context. The shadow vocabulary uses small offsets and tight blurs — just enough to articulate depth without simulating physical height.

### Shadow Vocabulary
- **Hover Lift** (`0 2px 8px rgba(0,0,0,0.08)`): Card hover, button hover. The smallest legible lift — communicates interactivity without floatiness.
- **Elevated Panel** (`0 4px 16px rgba(0,0,0,0.1)`): Dropdowns, popovers, tooltips, floating menus. Medium offset, soft edge.
- **Modal Shadow** (`0 8px 32px rgba(0,0,0,0.15)`): Dialogs, sheets, side panels. Wide blur, deeper offset — the user has entered a separate interaction layer.

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit without shadows until interaction demands otherwise. Rest state is always flat.

## 5. Components

### Buttons
- **Shape:** Gently rounded corners (0.5rem / 8px radius). Compact padding with clear internal spacing.
- **Primary (Default):** Ink background (`oklch(0.205 0 0)`), Ink Foreground text, 0.625rem horizontal padding, 2.25rem height. Hover reduces opacity to 80% via a color-mix with the foreground. Focus-visible gets a 3px ring at Ring (`oklch(0.708 0 0)`) with 50% opacity. Active translates 1px down.
- **Outline:** Transparent background, 1px solid border at Border (`oklch(0.922 0 0)`), default text color. Hover applies Surface Tint background and shifts text to foreground. Selecting (aria-expanded) mirrors the hover state.
- **Secondary:** Surface Tint background, Secondary Foreground text. Hover applies a `color-mix(in oklch, var(--secondary), var(--foreground) 5%)` to darken subtly.
- **Ghost:** Transparent background. Hover applies Surface Tint. Active state mirrors hover.
- **Destructive:** Signal Red at 10% opacity background, Signal Red text. Hover doubles the opacity to 20%. The color communicates urgency.
- **Link:** Inherits the button's slot but renders as underlined text in Ink color — no padding, no border, no background.
- **Sizes:** xs (1.5rem), sm (2rem), default (2.25rem), lg (2.5rem), icon variants per size map.

### Inputs / Fields
- **Style:** Thin 1px stroke at Input Stroke (`oklch(0.922 0 0)`), transparent background, 0.5rem / 8px radius. Text at Body size (0.875rem).
- **Focus:** Stroke shifts to Ring (`oklch(0.708 0 0)`) with a 3px ring at 50% opacity. The transition animates color and box-shadow (`transition-[color,box-shadow]`).
- **Placeholder:** Muted Ink (`oklch(0.556 0 0)`) — 4.5:1 against the Canvas background.
- **Disabled:** 50% opacity, pointer-events: none, cursor: not-allowed.
- **Error:** Border switches to destructive alongside an aria-invalid ring — allows both validation visual and screen reader signaling.

### Cards / Containers
- **Corner Style:** Rounded-xl (0.875rem / 14px). A deliberate step up from button/input radius — cards feel contained rather than sharp.
- **Background:** Canvas (`oklch(1 0 0)` in light mode).
- **Shadow Strategy:** Flat at rest. Hover Lift shadow (`0 2px 8px rgba(0,0,0,0.08)`) on interaction.
- **Border:** 1px rim (ring-1) at `foreground/10` — barely there, but enough to separate card from Canvas.
- **Internal Padding:** 1rem (px-4) content area. Larger headings and footers may add vertical padding.
- **Footer:** Surface Tint background at 50% opacity with a top border — anchors actions and metadata to the bottom of the card.
- **Size variant:** `sm` reduces gap and padding by 0.25rem for compact contexts.

### Badges
- **Style:** Fully rounded pill (9999px radius). Compact — 1.25rem height, 0.5rem horizontal padding. Text at xs (0.75rem) Medium 500.
- **Variants mirror the button system:** Default (Ink bg / Ink Foreground), Secondary (Surface Tint), Destructive (Signal Red at 10% / Signal Red text), Outline (Border stroke / foreground), Ghost (Surface Tint on hover). Link variant with underline.

### Tables
- **Style:** Full-width, caption-bottom at sm (0.875rem). Rows separated by a single bottom border at Border. No alternating row colors — rely on hover highlight instead.
- **Hover:** Surface Tint at 50% opacity on row hover. Selected state applies a fuller Surface Tint.
- **Header:** Semibold 500, left-aligned, 2.5rem height, padding-right 0.5rem. No bottom border on the header itself — the border is on the header row.
- **Cell:** 0.5rem padding, consistent with the spacing scale. `whitespace-nowrap` by default.

### Navigation (Sidebar)
- **Style:** Compact vertical navigation with 0.5rem padding. Background at Sidebar Canvas (`oklch(0.985 0 0)` in light mode). Width 16rem expanded, 3rem collapsed.
- **Menu Item:** 2rem height, rounded-md (0.5rem radius). Default text at Sidebar Foreground. Hover applies Sidebar Accent background and shifts text to Sidebar Accent Foreground. Active state (current page) mirrors the hover state plus font-medium. Focus-visible shows a 2px ring at Sidebar Ring.
- **Group Labels:** xs (0.75rem) Medium 500 at 70% opacity of Sidebar Foreground. Collapsed state hides group labels.
- **Mobile:** Sheets at 18rem width for mobile nav. Desktop uses a persistent collapsible sidebar.

## 6. Do's and Don'ts

### Do:
- **Do** use the Ink/Canvas binary for maximum information hierarchy. Let spacing and weight separate content, not color.
- **Do** apply the Signal Red only for destructive actions, errors, and critical warnings. It should feel like an event.
- **Do** use Inter Variable across the entire UI. ExtraBold for page titles, Bold for card headers, Semibold for navigation, Regular for body — the weight axis is the full hierarchy.
- **Do** keep buttons compact (2.25rem default height). Product users are in flow; oversized buttons waste vertical space.
- **Do** use skeleton states for loading data. Avoid centering a spinner inside previously-empty content areas.
- **Do** check contrast: Body Ink (`oklch(0.145 0 0)`) on Canvas (`oklch(1 0 0)`) passes at 13.7:1. Always verify when layering muted colors.
- **Do** maintain consistent component vocabulary across every screen. If a button looks like a button in one place, it must look the same everywhere.

### Don't:
- **Don't** add chroma to neutrals. No warm tint, no cool tint. The Zero-Chroma Rule is inviolable.
- **Don't** use gradient text (`background-clip: text` with a gradient). It's decorative, never meaningful. Use weight or size for emphasis.
- **Don't** add border-left or border-right greater than 1px as a colored stripe on cards, list items, or callouts. Use full borders, background tints, or nothing.
- **Don't** use display fonts for UI labels, buttons, or data. Inter's weight axis handles all hierarchy needs.
- **Don't** introduce glassmorphism, animated blobs, or decorative blur effects. The system is flat and authoritative.
- **Don't** replicate the cluttered density of legacy LMS platforms (Moodle, Blackboard classic). Dense tables are fine when scannable; cluttered panels are never acceptable.
- **Don't** use cards when simpler affordances work. Nested cards are always wrong.
- **Don't** use modals as a first thought. Exhaust inline panels, progressive disclosure, side sheets, and expandable sections first.
- **Don't** use animated page-load sequences. Product loads into a task; don't make users watch it load.
- **Don't** apply accent color to decorative elements — accent is for primary actions, current selection, and state indicators only.
- **Don't** use value="999" or "9999" for z-index. Build from the semantic scale: dropdown (10) → sticky (20) → modal-backdrop (30) → modal (40) → toast (50) → tooltip (60).
