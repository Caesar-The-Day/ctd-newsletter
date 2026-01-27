

# Update Truffle Images with External Sources

## Summary
Replace the AI-generated truffle images with the user-provided external photo URLs for better authenticity.

## Changes Required

### File: `src/components/sections/UmbriaNorciaTable.tsx`

**1. Remove unused imports (lines 9-10):**
```typescript
// Remove these two imports
import blackTruffleImage from '@/assets/umbria/black-truffle.jpg';
import summerTruffleImage from '@/assets/umbria/summer-truffle.jpg';
```

**2. Update Black Truffle entry (around line 56):**
```typescript
// Change from:
image: blackTruffleImage

// To:
image: 'https://chefsmandala.com/wp-content/uploads/2018/03/Black-Truffle.jpg'
```

**3. Update Summer Truffle entry (around line 67):**
```typescript
// Change from:
image: summerTruffleImage

// To:
image: 'https://matteo-truffles.com/cdn/shop/products/tuberaestivum_4032x.jpg?v=1639082876'
```

## Result
- Black Truffle will display the Chef's Mandala photo (close-up of cut black truffle)
- Summer Truffle will display the Matteo Truffles photo (whole summer truffle)
- Other specialty images (prosciutto, capocollo, lentils, strangozzi) remain unchanged

## Note
The generated asset files (`black-truffle.jpg` and `summer-truffle.jpg`) can optionally be deleted from `src/assets/umbria/` since they'll no longer be used.

