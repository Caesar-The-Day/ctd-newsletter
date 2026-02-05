

# Fix: Deploy All Undeployed Edge Functions

## Problem

Clicking "Create Veneto" calls the `scaffold-region` backend function, which returns a 404 because it was never deployed. This is the same issue that previously affected `generate-region-theme`.

## Root Cause

The function code exists at `supabase/functions/scaffold-region/index.ts` but was never deployed to the live environment.

## Fix

Deploy **all** backend functions that haven't been deployed yet. This prevents hitting the same 404 issue in later workflow steps (publishing, locking, image generation, etc.).

Functions to deploy:
- `scaffold-region` (the one currently failing)
- `publish-region`
- `region-lock`
- `set-active-region`
- `generate-region-images`

No code changes are needed -- the function implementations are correct. This is purely a deployment step.

## What Happens After

Once deployed, clicking "Create Veneto" in the wizard will:
1. Call `scaffold-region` successfully
2. Return the scaffolded region data (template JSON, registry entry, newsletter entry)
3. The frontend merges AI research data into the template
4. The region appears in the admin dashboard as a draft

