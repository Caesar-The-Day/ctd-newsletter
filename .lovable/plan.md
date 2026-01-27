

# Fix San Feliciano Pin & CTA Hover Contrast

## Summary
Two quick fixes: correct the map pin coordinates for San Feliciano and improve the hover contrast on the Official Lake Trasimeno Guide button.

## Changes

### 1. Fix San Feliciano Coordinates

**File: `src/components/sections/LakeTrasimenoMap.tsx`**

Update line 41 with the correct coordinates:

| Property | Current | New |
|----------|---------|-----|
| coords | `[43.1081, 12.2167]` | `[43.11817653490088, 12.16777389466359]` |

### 2. Fix CTA Hover Contrast

**File: `src/components/sections/UmbriaLakeTrasimeno.tsx`**

The current button styling on line 242:
```tsx
className="border-blue-300 text-blue-700 hover:bg-blue-50"
```

The issue is that `hover:bg-blue-50` (very light blue background) combined with `text-blue-700` creates poor contrast when hovering. The fix is to add explicit hover text color for better contrast:

**Updated styling:**
```tsx
className="border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
```

This changes the hover state to a solid blue background with white text, matching the active tab styling for visual consistency.

## Files to Modify

| File | Line | Change |
|------|------|--------|
| `src/components/sections/LakeTrasimenoMap.tsx` | 41 | Update coords to `[43.11817653490088, 12.16777389466359]` |
| `src/components/sections/UmbriaLakeTrasimeno.tsx` | 242 | Change hover classes to `hover:bg-blue-600 hover:text-white hover:border-blue-600` |

