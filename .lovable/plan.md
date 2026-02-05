

# Manual Editing for Color Palette & Hero Image Prompt

## Overview

Currently, the wizard's Step 3 (Theme) and Step 4 (Images) are "generate and accept" only -- you cannot tweak HSL values or edit the hero image prompt. This plan adds manual override controls to both steps.

---

## Step 3: Editable Color Palette

After the AI generates a theme, expose editable HSL sliders/inputs for each color so you can fine-tune them.

### Changes to `ThemePreview.tsx`

Transform from a read-only preview into an interactive editor:

- Accept an `onThemeChange` callback prop
- Each color swatch (Primary, Secondary, Accent, Muted, Background, Foreground) gets expandable HSL inputs (H: 0-360, S: 0-100, L: 0-100)
- Clicking a swatch toggles its editor inline
- Live color preview updates as you type
- Gradient fields become editable text inputs
- "Reset to AI" button restores the original AI-generated values

### Layout

```text
+--[Primary]--+--[Secondary]--+--[Accent]--+--[Muted]--+--[Bg]--+--[Fg]--+
|  swatch     |   swatch      |  swatch    |  swatch   | swatch | swatch |
+---------------------------------------------------------------------------+
| H [___] S [___] L [___]   (shown when swatch is selected)               |
+---------------------------------------------------------------------------+
| Hero Gradient: [________________________] (editable text input)          |
| Warm Gradient: [________________________]                                |
+---------------------------------------------------------------------------+
| [Reset to AI Generated]                                                   |
+---------------------------------------------------------------------------+
```

### Changes to `RegionCreationWizard.tsx` (Step 3)

- Pass `onThemeChange` to `ThemePreview` so edits flow back to wizard state
- Store original AI theme for reset capability
- Remove the requirement that theme must be AI-generated to proceed (allow fully manual entry as fallback)

---

## Step 4: Editable Hero Image Prompt

Allow you to write or modify the hero image prompt before generating.

### Changes to `RegionCreationWizard.tsx` (Step 4)

**New state:**
- `heroImagePrompt` -- initialized from `research.heroImagePrompt` but independently editable
- `seasonalImagePrompts` -- initialized from `research.seasonalImagePrompts` but editable

**UI additions:**
- Editable textarea for the hero image prompt, pre-filled from AI research
- Collapsible section for seasonal prompts (spring, summer, autumn, winter) -- each with its own textarea
- The "Generate Images" button uses these local prompt values (not directly from research)
- If research hasn't been run, prompts start empty and you can write them from scratch

### Layout

```text
+-- Hero Image Prompt --------------------------------------------------+
| [textarea: pre-filled from AI or write your own]                      |
+-----------------------------------------------------------------------+
| > Seasonal Prompts (collapsible)                                      |
|   Spring: [textarea]                                                  |
|   Summer: [textarea]                                                  |
|   Autumn: [textarea]                                                  |
|   Winter: [textarea]                                                  |
+-----------------------------------------------------------------------+
| [Generate Images with AI]                                             |
+-----------------------------------------------------------------------+
```

### Changes to image generation handler

- `handleGenerateImages` reads from the local `heroImagePrompt` state instead of `research.heroImagePrompt`
- Remove the guard that requires research to exist -- allow generating images with just a manually-entered prompt
- The button is disabled only if the hero prompt is empty (not if research is missing)

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/admin/ThemePreview.tsx` | Add HSL input editors, gradient text inputs, `onThemeChange` callback, reset button |
| `src/components/admin/RegionCreationWizard.tsx` | Add `heroImagePrompt` + `seasonalImagePrompts` state; editable prompt textareas in Step 4; pass `onThemeChange` to ThemePreview in Step 3; store original AI theme for reset; relax guards on image generation |

No backend changes required -- the edge functions already accept the prompts as parameters.

