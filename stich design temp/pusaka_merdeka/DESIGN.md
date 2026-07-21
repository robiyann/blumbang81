---
name: Pusaka Merdeka
colors:
  surface: '#f7fafd'
  surface-dim: '#d7dade'
  surface-bright: '#f7fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f8'
  surface-container: '#ebeef2'
  surface-container-high: '#e5e8ec'
  surface-container-highest: '#e0e3e6'
  on-surface: '#181c1f'
  on-surface-variant: '#5c403c'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eef1f5'
  outline: '#916f6b'
  outline-variant: '#e5bdb8'
  surface-tint: '#bd0f12'
  primary: '#a70009'
  on-primary: '#ffffff'
  primary-container: '#ce201c'
  on-primary-container: '#ffe5e1'
  inverse-primary: '#ffb4aa'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#505252'
  on-tertiary: '#ffffff'
  tertiary-container: '#686a6a'
  on-tertiary-container: '#eaebeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930006'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f7fafd'
  on-background: '#181c1f'
  surface-variant: '#e0e3e6'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 80px
  margin-mobile: 20px
  gutter: 24px
  section-gap: 120px
  component-padding: 1.5rem
---

## Brand & Style

The design system is built to celebrate the 81st Indonesian Independence Day with a "Professional-Patriotic" aesthetic. It balances the high-energy excitement of a national holiday with a structured, community-focused organization. The brand personality is proud, inclusive, and energetic.

The visual style follows a **Modern Corporate** approach with **Tactile** accents. It utilizes clean, sharp layouts to convey reliability and planning, while incorporating paper-like textures and traditional *umbul-umbul* (pennant) motifs to evoke a sense of festive community spirit. The emotional response should be one of "Gotong Royong" (communal cooperation)—organized, joyful, and deeply rooted in national identity.

## Colors

The palette is strictly patriotic, utilizing the "Sang Saka Merah Putih" (Red and White) as the primary engine of the UI.

- **Primary (Merah Semangat):** A vibrant, high-saturation red used for calls to action, headings, and significant brand markers.
- **Secondary (Putih Bersih):** Used for primary card surfaces and text on red backgrounds to maintain high legibility.
- **Background (Abu Terang):** A very light gray is used for the main page background to allow white cards to "pop" via subtle elevation.
- **Text (Charcoal):** A dark charcoal gray is preferred over pure black to keep the typography looking modern and professional while maintaining accessibility.

## Typography

The typography system uses **Plus Jakarta Sans** for its modern, friendly, and geometric Indonesian roots. Headlines are set with extra-bold weights to command attention, mirroring the boldness of independence.

For technical or data-driven details (like dates, times, or committee roles), **JetBrains Mono** is used sparingly as a label font to provide a clean, "organized" contrast to the fluid sans-serif body text. 

**Mobile Scaling:**
- `headline-xl` scales to `32px` on mobile.
- `headline-lg` scales to `24px` on mobile.
- Line heights are tightened on mobile to ensure compact information density.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Structured Celebration," meaning content is strictly aligned to a grid to maintain professionalism, but uses generous white space to prevent the red color from becoming overwhelming.

**Breakpoints:**
- **Desktop:** 1280px+ (Center-aligned fixed container).
- **Tablet:** 768px - 1279px (Fluid margins).
- **Mobile:** <767px (20px horizontal margins).

Spacing follows an 8px base unit. Sections are separated by large vertical gaps to allow the traditional decorative pennant elements to breathe between content blocks.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** Light gray (#F4F4F4) with a subtle grain texture to mimic paper.
- **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (10% opacity Charcoal) to create a sense of physical importance.
- **Level 2 (Active Elements):** Buttons and highlighted items use a primary red background.
- **Accents:** Traditional *umbul-umbul* (pennants) are treated as flat, vector overlays or "stickers" that appear to sit just above the surface without casting deep shadows, maintaining a modern, clean look.

## Shapes

The design system utilizes **Soft** geometry. While the overall vibe is professional and organized, slightly rounded corners (4px to 8px) prevent the UI from feeling too rigid or governmental.

- **Primary Buttons:** Soft rounded (4px) to maintain a modern, crisp edge.
- **Container Cards:** Large rounded (12px) to feel welcoming.
- **Decorative Elements:** The pennant accents use sharp, triangular geometries to remain true to traditional Indonesian festive decor.

## Components

### Buttons
- **Primary:** Solid Red background with White text. Bold weight. Minimal 4px border radius.
- **Secondary:** White background with Red border and Red text.
- **Tertiary:** Transparent background with Red text and an underline on hover.

### Cards
Cards must have a white background and a subtle 1px light gray border. They should include a "top-accent" line in primary red (4px thick) to tie into the flag theme.

### Timeline
The timeline component uses a horizontal thick charcoal line. Milestones are marked with red circular nodes. Important "Peak Events" are highlighted with a red glow or a larger radius.

### Decorative Accents
- **Umbul-umbul:** Red and white pennants should be used as border accents (top or bottom of sections) or as corner markers to frame photos.
- **Illustrations:** Use "Single-Line" style icons in Red to represent community activities (handshakes, torches, children) to keep the look sophisticated and not cluttered.

### Committee Lists
Organized in a hierarchical tree or grid. Use Charcoal backgrounds for high-level headers (Ketua) and Light Gray for sub-sections to create clear visual tiers.