# Make region drafts durable and concurrent

## Goal
Ensure every completed region wizard creates a persistent draft that appears immediately in Region Administration, while allowing any number of unpublished drafts to coexist and be worked on independently.

## Changes
- Move the final `regions` database write into the authenticated `scaffold-region` backend function so wizard completion is one durable operation instead of “generate in the function, then insert from the browser.”
- Validate the complete scaffold payload, build the merged region/climate content before submission, and use a conflict-safe insert that reports a clear error if the slug or issue number already exists.
- Return the saved database row from the function; only show “Region created” after persistence succeeds.
- Reload the admin list from the database after creation and show a clear save failure without closing the wizard, so generated work is not silently lost.
- Treat `activeRegion` as an editing-focus indicator only—not a restriction on how many draft rows may exist. Keep every draft unlocked and independently previewable/publishable.
- Replace static AI-instructions loading on the admin page with draft-aware state derived from the database/UI so creating a new draft does not hide or overwrite older drafts.
- Clarify the admin copy: multiple drafts can remain open; “Set Active” changes current focus without publishing, locking, or deleting any other draft.

## Recovery and verification
- Confirm the current database state before changes (Friuli exists; the failed Trentino-Alto Adige draft does not).
- Deploy the updated scaffold function and test creation with a disposable draft payload, verify it appears alongside Friuli, then remove the test row.
- Verify admin rendering and that switching active focus leaves all draft records intact.
- Because the completed Trentino wizard did not persist its generated payload, re-run its final creation step after the fix; the UI will preserve the wizard on any future save error.

## Technical details
- No new table is needed: `public.regions` already supports multiple rows with `status = 'draft'`.
- Database authorization remains enforced by existing admin checks and RLS; the backend function performs the privileged insert only after validating the caller’s admin role.
