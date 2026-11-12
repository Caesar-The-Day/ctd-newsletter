# Remove Caesar's opening from every guide

## What changes
- **Every region page:** the opening section with Caesar's portrait, signature and the personal intro is gone. The page goes from the hero photo straight to the email signup, then the map.
- **What search engines and AI tools see:** the opening is also taken out of the version of each page they read, so both versions match.
- **New regions:** building a new region in admin no longer writes an opening or asks the AI for one, and the admin editor stops showing the opening fields.
- **Your saved text stays.** Every region's opening, including the Friuli rewrite, stays saved and simply isn't shown. Bringing it back later only means switching the section back on.
- Page descriptions that already fall back to the first intro sentence keep working. Every live region already has its own description, so nothing visible changes there.

## Technical details
- `src/pages/RegionPage.tsx`: remove the `<EditorialIntro>` render and its import. Keep the `EditorialIntro.tsx` file unused for easy restore, or delete it (it is only used here).
- `api/render.ts`: drop the intro `<section>` block (around line 108).
- `supabase/functions/scaffold-region` and `research-region`: stop generating `intro.paragraphs`, portrait and signature. Keep an empty `intro` object so older readers and `RegionData` types don't break. Redeploy both functions.
- Admin editor: hide the intro fields if present.
- Update the project notes so the section list no longer includes the editorial intro.
- Locked regions: no region data is edited, only shared page code.
