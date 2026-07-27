# Design System Document: The Architectural Lead

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Estate"**
The objective of this design system is to move real estate management away from cluttered, spreadsheet-style interfaces and toward a "High-End Editorial" experience. Think of this dashboard not as a database, but as a digital gallery of opportunities.

We break the "SaaS template" look by utilizing **intentional asymmetry** and **tonal depth**. Large, editorial-style typography (Manrope) creates a sense of authority and permanence, while the utilitarian body type (Inter) ensures high-speed readability. We replace rigid grid lines with breathing room and subtle shifts in surface color to define boundaries, creating a layout that feels fluid, professional, and bespoke.

---

## 2. Colors & Tonal Logic
The color palette is rooted in a professional deep teal (`primary: #004d64`), balanced by a sophisticated neutral foundation.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off major areas of the UI. Structure must be defined solely through background color shifts. 
- A sidebar should be `surface_container_low` sitting against a `surface` background.
- A content area should be `surface` with cards in `surface_container_lowest`. 

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. Use the surface-container tiers to create nested depth:
1.  **Level 0 (Base):** `surface` (#faf9fc) – The canvas.
2.  **Level 1 (Sectioning):** `surface_container_low` (#f4f3f6) – For sidebar or secondary content areas.
3.  **Level 2 (Interaction):** `surface_container_lowest` (#ffffff) – For the highest-priority cards or active work surfaces.
4.  **Level 3 (Emphasis):** `surface_container_high` (#e8e8eb) – For inactive or recessed elements like search bars or disabled states.

### The "Glass & Gradient" Rule
To elevate the aesthetic, floating elements (like modals or dropdowns) must use **Glassmorphism**. Apply `surface_container_lowest` at 80% opacity with a `backdrop-filter: blur(12px)`. 
For primary CTAs and lead-conversion highlights, use a subtle linear gradient transitioning from `primary` (#004d64) to `primary_container` (#006684) at a 135° angle.

---

## 3. Typography
We use a dual-font strategy to balance elegance with functionality.

*   **Display & Headlines (Manrope):** This is our "Editorial" voice. Use `display-lg` through `headline-sm` for hero metrics (e.g., total portfolio value) and page titles. The wide aperture of Manrope conveys transparency and modern luxury.
*   **Body & Labels (Inter):** This is our "Functional" voice. Use `body-md` for lead details and `label-md` for metadata. Inter provides the precision needed for dense data without sacrificing the minimalist aesthetic.

**Visual Hierarchy Tip:** Always pair a `headline-md` (Manrope) with a `label-sm` (Inter) in `on_surface_variant` to create a clear "Title/Subtitle" relationship that feels designed, not just typed.

---

## 4. Elevation & Depth
Traditional shadows are often too "heavy" for a minimalist real estate dashboard. We achieve hierarchy through **Tonal Layering**.

### The Layering Principle
Depth is achieved by stacking. Place a `surface_container_lowest` card on a `surface_container_low` background to create a soft, natural lift. No shadow is required for static cards.

### Ambient Shadows
When an element must "float" (e.g., a lead quick-view drawer), use an **Ambient Shadow**:
- **Color:** `on_surface` (#1a1c1e) at 5% opacity.
- **Blur:** 32px to 48px.
- **Spread:** -4px.
This mimics natural light and keeps the UI feeling airy.

### The "Ghost Border" Fallback
If a border is strictly required for accessibility (e.g., input fields), use a **Ghost Border**:
- **Token:** `outline_variant` (#bfc8cd) at 20% opacity.
- **Rule:** Never use 100% opaque borders for decorative containment.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (Primary to Primary-Container), white text, `rounded-md` (0.375rem).
*   **Secondary:** `surface_container_high` background with `on_surface` text. No border.
*   **Tertiary:** Ghost style; `on_primary_fixed_variant` text with no background until hover.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines. 
*   **Implementation:** Separate leads in a list using `spacing-6` (1.5rem) of vertical white space. Use a subtle background shift (`surface_container_lowest`) on hover to indicate interactivity.
*   **Rounding:** All cards must use `rounded-xl` (0.75rem) to soften the professional teal.

### Input Fields
*   **Logic:** Use `surface_container_low` for the input track. On focus, transition to `surface_container_lowest` with a Ghost Border in `primary`.
*   **Labels:** Use `label-md` in `on_surface_variant`, positioned 0.5rem above the input.

### Real-Estate Specific Components
*   **Lead Status Chips:** Use `secondary_container` with `on_secondary_container` text. Use `rounded-full` for a "pill" look that contrasts against the rectangular card structure.
*   **Property Preview Glass:** A small thumbnail of a property should have a `surface_container_lowest` overlay at the bottom using 60% opacity and blur to house the price/address.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-12` (3rem) or `spacing-16` (4rem) between major sections to allow the layout to "breathe."
- **Do** use `primary_fixed` (#bee9ff) for subtle highlights in data visualizations (e.g., trend lines).
- **Do** align editorial typography to a generous left margin to create a strong vertical axis.

### Don't
- **Don't** use pure black (#000000). Use `on_surface` (#1a1c1e) for all high-contrast text.
- **Don't** use `DEFAULT` or `sm` roundedness for large containers; it feels dated. Stick to `xl` (0.75rem) for cards.
- **Don't** use "Drop Shadows" on buttons. If a button needs to stand out, use color contrast and scale, not shadow.
- **Don't** use dividers. If you feel you need a line, try adding `spacing-8` instead.