# Fix the "Active" pill following the active region

## What's happening

Clicking "Set Active" on Friuli shows a success toast but the pill stays on Liguria. Two confirmed causes:

1. In `AdminRegions.tsx`, `handleSetActive` only shows a toast and reloads data — it never updates the `activeRegion` state or the `active-region` value in browser storage. The only place that value gets written is the lock/unlock handler, which is why Liguria (last unlocked) stays marked Active.
2. The `set-active-region` backend function doesn't persist anything. It just echoes back a message and a suggested instructions payload, so there is no shared record of which region is active — the pill is driven purely by one browser's local storage.

## The fix

**Make the active region a real, stored value**

- Add an `app_settings` key/value table (admin-write, public-read) holding a single `active_region` row, with the required access grants and policies.
- `set-active-region` writes the chosen slug into that row (and clears it when the slug is null) instead of only echoing a message.
- Add the slug to the response so the client can trust the result.

**Make the admin page reflect it immediately**

- `handleSetActive` sets `activeRegion` state and browser storage on success, so the pill moves to Friuli the moment the toast appears.
- `loadData` reads the stored `active_region` from the backend as the source of truth and syncs local storage to it, so the pill is correct on reload and in any other browser or session.
- Keep the lock/unlock handler from silently hijacking the active region: unlocking a live region will prompt-free stop reassigning Active, since that is what caused the stale Liguria pill in the first place.

**Guard rails**

- Only one region can be Active at a time; setting a new one clears the previous.
- The Active banner at the top of the page and the per-row pill both read the same value.

## Technical notes

- New migration: `public.app_settings (key text primary key, value jsonb, updated_at timestamptz)`, `GRANT SELECT` to `anon`/`authenticated`, `GRANT ALL` to `service_role`, RLS on, public read policy, admin write policy via `has_role`.
- Edge function `supabase/functions/set-active-region/index.ts`: upsert into `app_settings` using the service role after the existing `requireAdmin` check; keep the current Zod body schema.
- `src/utils/regionApi.ts`: add a `getActiveRegion()` reader hitting `app_settings`.
- `src/pages/AdminRegions.tsx`: update `handleSetActive`, `loadData`, and remove the active-region write inside `handleToggleLock`.
