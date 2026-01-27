
# Fix: Add fb:app_id for Facebook Sharing

## The Issue

Facebook's Sharing Debugger requires the `fb:app_id` property to be present in Open Graph metadata. This is currently missing from:

1. **Vercel Edge Function** (`api/og.ts`) - serves OG data to social media crawlers
2. **index.html** - fallback static OG tags
3. **SEO.tsx** - React component for client-side meta tags

## What is fb:app_id?

The `fb:app_id` is a Facebook App ID that associates your website's shared content with a Facebook application. It enables:
- Enhanced link debugging in Facebook tools
- Access to Facebook Insights for shared links
- Better attribution of shares

## Solution

You'll need a **Facebook App ID** to add this property. If you don't have one:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Copy the App ID (a numeric string like `123456789012345`)

Once you have the App ID, I'll update three locations:

### 1. Vercel Edge Function (`api/og.ts`)

Add the `fb:app_id` meta tag to the generated HTML:

```html
<meta property="fb:app_id" content="YOUR_FB_APP_ID" />
```

### 2. index.html

Add the tag to the static HTML head section:

```html
<meta property="fb:app_id" content="YOUR_FB_APP_ID" />
```

### 3. SEO.tsx Component

Add the tag to the Helmet component for client-side rendering:

```tsx
<meta property="fb:app_id" content="YOUR_FB_APP_ID" />
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `api/og.ts` | Add `fb:app_id` meta tag in `generateHTML()` |
| `index.html` | Add `fb:app_id` meta tag in head section |
| `src/components/common/SEO.tsx` | Add `fb:app_id` meta tag in Helmet |

---

## Note on fb:app_id

While Facebook marks this as "required," links will still share without it — the debugger just warns about it. If you don't have or want a Facebook App ID, the warning can be safely ignored. However, adding it is recommended for:
- Better analytics on shared links
- Cleaner debugger output
- Future Facebook features

---

## Next Step

Do you have a Facebook App ID to use? If so, share it and I'll implement the fix. If not, I can proceed without it (Facebook sharing will still work, just with the debugger warning).
