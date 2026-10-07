# Serve every region at italy.caesartheday.com/<region>

## What's wrong
- The app is built to always live under `/regions/`. On load, any address without `/regions/` gets pushed to `/regions/<region>`. That's why italy.caesartheday.com/liguria turns into /regions/liguria.
- For Friuli, the new permanent redirect sends /regions/friuli-venezia-giulia back to /friuli-venezia-giulia, and then the app pushes it to /regions/ again. The two fight in a loop, so the page never loads.

## The fix
1. **Pick the address style from the domain the visitor is on**
   - italy.caesartheday.com (and the Lovable address): pages live at the root, e.g. `/liguria`. No `/regions/` is added.
   - www.caesartheday.com/regions/...: keeps working as it does now.
2. **Remove the automatic "push under /regions/" step** on the italy domain. Keep it only for local preview.
3. **One clean redirect rule on italy.caesartheday.com:** any `/regions/<anything>` permanently redirects to `/<anything>`. This replaces the Friuli-only rule, so old shared links for every region land on the clean address.
4. **Keep images, scripts and data loading on both domains.** Files stay where they are now, so nothing breaks on www.caesartheday.com/regions/.
5. **Canonical tags:** every page keeps pointing to `https://italy.caesartheday.com/<region>`, including when opened through www.caesartheday.com/regions/.

## Check after the change
- italy.caesartheday.com/liguria, /friuli-venezia-giulia and the homepage load without changing the address.
- italy.caesartheday.com/regions/liguria redirects once to /liguria.
- Admin pages, images, maps and email signup still work.
- Image check and type check pass. Then you publish/redeploy to put it live.

## Technical details
- `src/App.tsx`: `basename` is computed at runtime: `/regions` if `location.pathname` starts with `/regions`, otherwise `""`.
- `src/lib/basePath.ts`: the content prefix follows that same runtime base. Drop the bare-path → `/regions/` redirect, except on localhost.
- Vite `base` stays `/regions/`, so built assets resolve absolutely as `/regions/assets/...` on both hosts. `dist/index.html` at the root stays as the SPA fallback.
- `vercel.json`: swap the Friuli rule for `^/regions/(.*)$` → 301 `https://italy.caesartheday.com/$1`, put it before the filesystem handler, and exclude `/regions/assets|images|data|newsletters` plus file extensions so assets are still served.
- Update the base-path rule in `AGENTS.md`.
