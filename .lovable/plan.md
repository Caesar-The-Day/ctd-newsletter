

# Use Uploaded Images for Lake Trasimeno Activities

## Summary
Copy the 10 uploaded images to the project and update the activity card image paths to use local files instead of blocked external URLs.

## Images to Copy

Copy all uploaded images to `public/images/umbria/trasimeno/`:

| Uploaded File | Destination Path | Activity |
|---------------|------------------|----------|
| `user-uploads://windsurfing.jpeg` | `public/images/umbria/trasimeno/windsurfing.jpeg` | Windsurfing & Kitesurfing |
| `user-uploads://kayaking.jpg` | `public/images/umbria/trasimeno/kayaking.jpg` | SUP & Kayaking |
| `user-uploads://sailing.jpg` | `public/images/umbria/trasimeno/sailing.jpg` | Sailing & Boating |
| `user-uploads://beaches.jpg` | `public/images/umbria/trasimeno/beaches.jpg` | Beaches & Swimming |
| `user-uploads://isola-maggiore.jpg` | `public/images/umbria/trasimeno/isola-maggiore.jpg` | Isola Maggiore |
| `user-uploads://isola-polvese.jpg` | `public/images/umbria/trasimeno/isola-polvese.jpg` | Isola Polvese |
| `user-uploads://cycling.jpeg` | `public/images/umbria/trasimeno/cycling.jpeg` | 58km Cycling Trail |
| `user-uploads://hiking.jpeg` | `public/images/umbria/trasimeno/hiking.jpeg` | Hiking Trails |
| `user-uploads://horseback.jpg` | `public/images/umbria/trasimeno/horseback.jpg` | Horseback Riding |
| `user-uploads://golf.jpg` | `public/images/umbria/trasimeno/golf.jpg` | Golf |

## Code Changes

**File: `src/components/sections/UmbriaLakeTrasimeno.tsx`**

Update the `imageUrl` property for each activity to use local paths:

### Water Activities (lines 17-36)
```tsx
const waterActivities: Activity[] = [
  {
    name: 'Windsurfing & Kitesurfing',
    // ...
    imageUrl: '/images/umbria/trasimeno/windsurfing.jpeg'
  },
  {
    name: 'SUP & Kayaking',
    // ...
    imageUrl: '/images/umbria/trasimeno/kayaking.jpg'
  },
  {
    name: 'Sailing & Boating',
    // ...
    imageUrl: '/images/umbria/trasimeno/sailing.jpg'
  },
  {
    name: 'Beaches & Swimming',
    // ...
    imageUrl: '/images/umbria/trasimeno/beaches.jpg'
  }
];
```

### Islands (lines 38-50)
```tsx
const islands: Activity[] = [
  {
    name: 'Isola Maggiore',
    // ...
    imageUrl: '/images/umbria/trasimeno/isola-maggiore.jpg'
  },
  {
    name: 'Isola Polvese',
    // ...
    imageUrl: '/images/umbria/trasimeno/isola-polvese.jpg'
  }
];
```

### Land Activities (lines 52-76)
```tsx
const landActivities: Activity[] = [
  {
    name: '58km Cycling Trail',
    // ...
    imageUrl: '/images/umbria/trasimeno/cycling.jpeg'
  },
  {
    name: 'Hiking Trails',
    // ...
    imageUrl: '/images/umbria/trasimeno/hiking.jpeg'
  },
  {
    name: 'Horseback Riding',
    // ...
    imageUrl: '/images/umbria/trasimeno/horseback.jpg'
  },
  {
    name: 'Golf',
    // ...
    imageUrl: '/images/umbria/trasimeno/golf.jpg'
  }
];
```

### Culture Activities (lines 78-102)
The remaining 4 activities (Medieval Villages, Wine Tasting, Birdwatching, Music Festivals) will keep the external URLs for now. Once you upload the remaining 4 images, I can update those as well.

## Files to Modify

| Action | Path |
|--------|------|
| Copy | 10 images to `public/images/umbria/trasimeno/` |
| Edit | `src/components/sections/UmbriaLakeTrasimeno.tsx` - update 10 imageUrl values |

## Waiting For

Please upload the remaining 4 images for the Culture tab:
- **Villages** - Medieval villages at night
- **Winery** - Wine tasting
- **Birdwatching** - La Valle oasis
- **Festival** - Music festivals

