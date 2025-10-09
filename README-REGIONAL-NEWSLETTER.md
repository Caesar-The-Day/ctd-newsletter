# CaesarTheDay Interactive Regional Newsletter

A production-ready, responsive, accessible web experience for retirees exploring Italian regions. Currently featuring **Piemonte** (Issue #7).

## Architecture

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with HSL color system
- **Animations**: Framer Motion principles + CSS transitions
- **Data**: Static JSON (easily upgradeable to Supabase)
- **Routing**: React Router (`/:region`)

## How to Add a New Region

1. **Create JSON file**: Duplicate `/public/data/piemonte.json` → `/public/data/{region}.json`
2. **Update content**: Edit all text, coordinates, and references
3. **Add images**: Place images in `/public/images/{region}/`
4. **Deploy**: URL becomes `/{region}` automatically

## Data Layer

All data comes from two JSON files:
- `/public/data/globals.json` - Brand, CTAs, social links
- `/public/data/{region}.json` - All regional content

To swap to Supabase later, just update `/src/utils/getRegionData.ts` functions.

## Key Features

- ✅ Parallax hero with ambient audio toggle
- ✅ Interactive wine personality quiz
- ✅ Cost-of-living calculator
- ✅ Recipe cards with expandable instructions
- ✅ Town galleries with image carousels
- ✅ Pros/cons accordion
- ✅ Inline CTAs throughout
- ✅ Social sharing integration
- ✅ Fully responsive & accessible
- ✅ SEO optimized

## Development

```bash
npm install
npm run dev
```

## Deployment

Deploy to Vercel, Netlify, or any static host. The app is fully static-generated.

## Customization

### Change Global CTAs
Edit `/public/data/globals.json` → `brand.ctas` array

### Update Brand Colors
Edit `/src/index.css` → CSS variables in `:root`

### Add/Remove Sections
Edit `/src/pages/RegionPage.tsx` - comment out or reorder sections

## Future: Supabase Integration

When ready to move to database:
1. Create tables matching JSON schema
2. Update `/src/utils/getRegionData.ts` to fetch from Supabase
3. Add admin panel for content management

All component props remain the same!

---

Built with ❤️ for retirement conquerors everywhere.
