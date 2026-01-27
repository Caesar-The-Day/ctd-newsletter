

# Update Lake Trasimeno Section

## Summary
Remove the misaligned lake polygon overlay from the map and replace placeholder image URLs with the provided external photo links.

## Changes

### 1. Remove Lake Polygon Overlay

**File: `src/components/sections/LakeTrasimenoMap.tsx`**

Remove the unused `lakePolygon` constant (lines 47-58) and the `L.polygon()` call that adds it to the map (lines 90-97). The MapTiler base layer already shows the lake clearly, so the overlay is unnecessary.

**Lines to remove:**
- Lines 47-58: `lakePolygon` constant definition
- Lines 90-97: `L.polygon(lakePolygon, {...}).addTo(map)` call

### 2. Update Activity Card Images

**File: `src/components/sections/UmbriaLakeTrasimeno.tsx`**

Replace placeholder paths with the provided external URLs:

| Activity | New Image URL |
|----------|---------------|
| Windsurfing & Kitesurfing | `https://www.umbriatourism.it/documents/20126/34101/sporttrasimeno%25283%25292.jpg/cf5af464-7ab4-fb64-bd0a-72a3ea24b09b?t=1583781669478&width=1080` |
| SUP & Kayaking | `https://www.experiencetrasimeno.it/wp-content/uploads/2022/04/canoaclub-montedellago.jpg` |
| Sailing & Boating | `https://www.portodelsole.it/wp-content/uploads/2018/02/barca_vela-2.jpg` |
| Beaches & Swimming | `https://www.italyreview.com/uploads/2/6/3/6/26365745/tuoro-sul-trasimeno-umbria-italy-1a_orig.jpg` |
| Isola Maggiore | `https://www.bellaumbria.net/wp-content/uploads/2017/07/Lago-Trasimeno_Isola-Maggiore_dall-altro2.jpg` |
| Isola Polvese | `https://www.bellaumbria.net/wp-content/uploads/2017/06/Trasimeno_Isola-Polvese_sentiero.jpg` |
| 58km Cycling Trail | `https://www.umbriatourism.it/documents/20126/338198/BikeCastiglioneLago/6f8a6116-e1ae-d681-7140-a53987097e6d?width=780` |
| Hiking Trails | `https://www.umbriatourism.it/documents/20126/342208/laviadeltrasimeno%282%29.jpg/bd0561d8-c1de-eee5-2b0f-5633b81b6558?width=1200` |
| Horseback Riding | `https://www.lagotrasimeno.net/media/cache/fe_gallery_md/uploads/images/photos/6299dd39cdc32853353871.jpg` |
| Golf | `https://www.lagotrasimeno.net/media/cache/fe_gallery_md/uploads/images/photos/63e3a4eb4a5a3394908521.jpg` |
| Medieval Villages | `https://www.tenutedelcerro.it/wp-content/uploads/2025/03/Trasimeno-di-notte.jpg` |
| Wine Tasting | `https://villagioiella.com/wp-content/uploads/2024/12/rsz_1umbria-torism-archive-lake-vineyard-vigneto-vino.webp` |
| Birdwatching | `https://www.lagotrasimeno.net/media/cache/fe_primary_image_small/uploads/images/activities/627d08d78b13a407729033.jpg` |
| Music Festivals | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjIcRLSgd7Nc63HP-2G1Y7xzoKL-Ymq_GAYQ&s` |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/sections/LakeTrasimenoMap.tsx` | Remove `lakePolygon` constant and `L.polygon()` call |
| `src/components/sections/UmbriaLakeTrasimeno.tsx` | Update all 14 `imageUrl` values with external URLs |

## Technical Notes

- The existing `onError` fallback in `ActivityCard` will handle any image loading failures gracefully
- External URLs are used directly; no local image files need to be created
- Town markers remain unchanged on the map

