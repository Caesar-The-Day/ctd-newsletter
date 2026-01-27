

# Fix Missing Kayaking and Beaches Photos

## Problem
The SUP & Kayaking and Beaches & Swimming cards are missing their photos. While the files `kayaking.jpg` and `beaches.jpg` exist in `public/images/umbria/trasimeno/`, the images are failing to load (triggering the `onError` handler). This likely means the replacement upload from `kayaking-2.jpg` and `beaches-2.jpg` didn't properly copy over.

## Solution
Re-copy the uploaded images to overwrite the potentially corrupted files:

| Uploaded File | Destination |
|---------------|-------------|
| `user-uploads://kayaking-2.jpg` | `public/images/umbria/trasimeno/kayaking.jpg` |
| `user-uploads://beaches-2.jpg` | `public/images/umbria/trasimeno/beaches.jpg` |

## Files to Modify

| Action | Path |
|--------|------|
| Copy (overwrite) | `user-uploads://kayaking-2.jpg` → `public/images/umbria/trasimeno/kayaking.jpg` |
| Copy (overwrite) | `user-uploads://beaches-2.jpg` → `public/images/umbria/trasimeno/beaches.jpg` |

No code changes needed - the `imageUrl` paths in `UmbriaLakeTrasimeno.tsx` already point to the correct locations.

