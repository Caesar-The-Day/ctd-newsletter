# Upgrade the "Italy is Calling" CTA Section

## Goal
Transform `RetirementBlueprintCTA.tsx` into a bold, click-worthy split-screen CTA that works for both the **Visto Facile** variant (shown in active regions) and the **Retirement Blueprint consultation** variant (shown in locked regions). Keep the existing Visto Facile link and the consultation link, but wrap them in a single high-impact visual design.

## Design Direction
- **Palette**: Ocean Deep (`#0c2340`, `#1a4a6e`, `#2d8a9e`, `#5cbdb9`) implemented through semantic HSL tokens, not hardcoded hexes.
- **Layout**: Split-screen card — visual panel on one side, headline + proof + button on the other.
- **Typography**: Keep the project's existing page fonts; emphasize headline weight and scale.
- **Energy**: High-contrast, premium, and decisive — a clear next step the user actually wants to click.

## Changes

### 1. Refactor `RetirementBlueprintCTA.tsx`
- Replace the current centered beige card with a unified split-screen component.
- Use a single container layout that conditionally swaps:
  - **Visual side**: Visto Facile logo/illustration or a Compass/Blueprint editorial image.
  - **Copy side**: Visto Facile-focused message or consultation-focused message.
- Preserve the `region` prop so the correct link and copy still render per region.

### 2. Visual Assets
- Generate a new editorial image for the **consultation** variant (e.g., Italian hill-town landscape with a subtle compass/blueprint overlay, or an inviting desk/passport scene).
- Keep the existing Visto Facile logo for the Visto Facile variant.
- Optimize both images with WebP/ responsive sizing if needed.

### 3. Copy & Proof Points
- Visto Facile variant headline: "Make Your Italian Move Official." (or similar strong action).
- Consultation variant headline: "Italy Is Calling — Build Your Real Timeline." (or similar).
- Add 2–3 short benefit bullets above the button to answer "why click?" (e.g., document checklists, consulate-specific guidance, timeline tracking).
- Add a small trust badge or micro-copy below the button (e.g., "Built for U.S. & Canadian applicants").

### 4. Button & Interactions
- Use a large, high-contrast primary button with clear label.
- Add hover-lift and subtle glow/shadow on the whole card.
- Keep the existing Intersection Observer scroll reveal.
- Add a small animated "arrow" or pulse indicator on hover to signal action.

### 5. Responsive Behavior
- Split-screen becomes stacked single-column on mobile.
- Ensure touch targets remain accessible and text stays readable.

## Outcome
A single, reusable CTA component that looks premium and exciting for both offers, drives clicks through stronger visual hierarchy, and remains consistent across all regions without changing the underlying link logic.
