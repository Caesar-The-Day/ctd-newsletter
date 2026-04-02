

## Fix Broken Eurochocolate Image

### What
Replace the broken external hotlinked image with the uploaded chocolate festival photo.

### Steps

1. **Copy uploaded image** to `public/images/umbria/eurochocolate.jpg`

2. **Update `src/components/sections/UmbriaChocolateCity.tsx` (line 394)**
   - Change `src` from `"https://www.poggiodegliolivi.com/wp-content/uploads/2021/09/4-1.jpg"` to `"/images/umbria/eurochocolate.jpg"`

### Files Modified
- `public/images/umbria/eurochocolate.jpg` (new -- copied from upload)
- `src/components/sections/UmbriaChocolateCity.tsx` (line 394)

