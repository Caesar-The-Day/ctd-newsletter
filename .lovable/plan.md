# Fix: the seven new Liguria map towns never saved

The photos were sourced and are on disk (`imperia`, `diano-marina`, `andora`, `alassio`, `albenga-town`, `dolcedo`, `isolabona` under `public/images/liguria/`), and the credits file was updated. But the map itself still holds only the original 15 town markers — a fresh read of the Liguria record confirms the seven new entries are absent.

Cause: the write went to the database over the public (anonymous) key. The regions table only allows admins to update, so the request was accepted and changed nothing — no error surfaced. The map component reads its towns straight from that record, so it renders the old 15.

## The fix

1. Re-apply the seven town markers to the Liguria record using a privileged database write instead of the public key, appending to the existing `where.map.markers` list:
   - **Imperia** — Porto Maurizio's hill lanes plus Oneglia's olive-oil port; hospital, full services, cheaper than Sanremo.
   - **Diano Marina** — flat, sunny, walkable; sandy beach and a real year-round resident base.
   - **Andora** — quiet and low-rise with a direct rail stop and olive valleys behind.
   - **Alassio** — the most sheltered bay on the coast, the budello, long-standing foreign community.
   - **Albenga** — Roman city, medieval towers, the region's farming plain and best market, lowest coastal prices.
   - **Dolcedo** (inland) — ten minutes above Imperia; stone bridges, mills, Taggiasca terraces.
   - **Isolabona** (inland, Val Nervia) — between Dolceacqua and Apricale; Rossese vines and a castle ruin.
   Each carries its sourced photo and coordinates so it appears under the Cities & Towns toggle with a photo popup.
2. Re-read the record afterwards to confirm 22 markers are present, and check the rendered map in the preview rather than trusting the write.

## Note on the inland pair

"isolalunga" is read as **Isolabona** in Val Nervia — say the word if you meant a different village and it gets swapped.

## Technical detail

Single privileged SQL update on `regions.region_data` for `slug = 'liguria'`, appending to the `where.map.markers` array. No schema change, no component change — `InteractiveMap` already renders photo popups for town markers.
