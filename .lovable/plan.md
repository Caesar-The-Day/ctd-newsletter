## Root cause

`SevenPercentCTA` keeps per-region copy in a `REGION_COPY` map and **falls back to the Calabria entry** for any region not in the map. Piemonte's feature flags resolve to `"default"`, which has `show7PercentCTA: true` — so Piemonte renders the CTA using Calabria's copy. Editing Calabria therefore visibly changes Piemonte. Umbria has no flag entry either, so it also inherits `default` and shows the same Calabria-shaped CTA.

Lombardia and Veneto are already safe (`show7PercentCTA: false`). Puglia, Calabria, Molise correctly show the CTA.

## Fix (minimal, no component changes)

Flip the default so the 7% CTA is **opt-in per region**, and give Piemonte an explicit flag for clarity. Edit only `public/data/config/feature-flags.json`:

- `default.show7PercentCTA`: `true` → `false`
- Replace `"piemonte": "default"` with an explicit object that mirrors `default` but with `show7PercentCTA: false` (so future tweaks to `default` don't silently re-enable it on Piemonte).
- Leave `puglia`, `calabria`, `molise` as-is (`true`).
- Lombardia and Veneto stay `false`.
- Umbria has no entry today → with the new default it will be `false` too. (Confirms with user intent: 7% is a Southern-Italy program; Umbria doesn't qualify.)

No code changes to `SevenPercentCTA.tsx`, `RegionPage.tsx`, or the Calabria/Molise copy. The Calabria fallback inside `REGION_COPY` stays as a safety net but will no longer be reachable from a non-7% region.

## Why not the "region-agnostic" alternative

Making the CTA generic would erase the region-specific lines that make it persuasive (Tyrrhenian vs Ionian for Calabria, Termoli/Agnone for Molise, "nearly every Molise town qualifies", etc.). The flag fix preserves that targeted copy and is one JSON edit.

## Out of scope

- No edits to `SevenPercentCTA.tsx` copy.
- No changes to other CTAs, locked region content, or DB.
