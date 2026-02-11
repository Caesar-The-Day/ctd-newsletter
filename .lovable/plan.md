

## Fix: Veneto Editorial Intro Portrait

### Problem
The Veneto page uses `/images/shared/cesare-portrait.jpg` for the Editorial Intro portrait, while every other region uses the boat photo (`cesare-boat.jpg`).

### Fix
Update one line in `public/data/regions/italy/veneto.json`:
- **Line 22**: Change `"portrait": "/images/shared/cesare-portrait.jpg"` to `"portrait": "/images/shared/cesare-boat.jpg"`

### Files Changed
- **Updated**: `public/data/regions/italy/veneto.json` (1 line — portrait path only)

### Nothing Else Touched
No component code, no other region files, no config changes.
