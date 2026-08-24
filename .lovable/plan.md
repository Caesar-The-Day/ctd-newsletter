# Lazio Beyond Rome photo transitions

## Goal
Make the main landscape photo in `LazioBeyondRome` crossfade smoothly between the default category image and the specific lake photos (Bracciano, Bolsena, Albano, Vico). Make it obvious that the lake cards are clickable.

## What will change

### 1. Add animation library
- Install `framer-motion` so we can use `AnimatePresence` + `motion.img` for a proper crossfade.

### 2. Image transition
- Replace the current `<img key={displayImage} ... className="animate-fade-in" />` with a Framer Motion wrapper:
  - `AnimatePresence mode="wait"` (or `popLayout`) on the image container.
  - `motion.img` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}` and a shared `transition={{ duration: 0.35, ease: "easeInOut" }}`.
  - Use the image `src` as the `key` so the motion layer re-mounts and animates on change.
- Keep the existing caption overlay but animate it in sync with the image.

### 3. Clickable lake cards
- Add a small "View photo" / camera icon affordance to each lake card that has a photo.
- Use the existing `ring-2 ring-primary` selected state, but enhance it:
  - Add a subtle primary badge on selected cards: "Showing photo".
  - Add `hover:border-primary/50` and `hover:bg-muted/60` on clickable cards.
- Keep keyboard accessibility and `role="button"`/`tabIndex` as already implemented.

### 4. Verify
- Run `bun add framer-motion` (or npm/pnpm equivalent).
- Run the build to ensure no TypeScript errors from the new motion components.
- Test the `/lazio` route to confirm clicking a lake card fades to the specific photo and clicking again or switching tabs fades back to the default image.

## Files touched
- `package.json` / lockfile — add `framer-motion`.
- `src/components/sections/LazioBeyondRome.tsx` — image animation wrapper and card affordances.
