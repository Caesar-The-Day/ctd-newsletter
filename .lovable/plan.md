

# Implement Global Google Analytics Tag

## Current State

Google Analytics (`G-6NPM83DF0C`) is currently loaded **conditionally** via `CookieConsent.tsx`:
- Only loads after user clicks "Accept" on the cookie banner
- Uses localStorage to remember consent
- This is a GDPR-compliant approach

## What You're Requesting

Add the gtag.js script **directly** to `index.html` so it loads on every page, regardless of cookie consent:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6NPM83DF0C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-6NPM83DF0C');
</script>
```

## Implementation

### File: `index.html`

Add the Google tag script inside the `<head>` section, after the meta tags:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NPM83DF0C"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-6NPM83DF0C');
  </script>
  
  <title>Veni. Vidi. Vici. | Your Guide to Conquering Retirement in Italy</title>
  <!-- ... rest of meta tags ... -->
</head>
```

---

## Important Consideration: Cookie Consent

By adding GA directly to `index.html`, analytics will load **before** the user consents to cookies. This has implications:

| Approach | Pros | Cons |
|----------|------|------|
| **Current (consent-first)** | GDPR compliant, respects user privacy | May miss some pageviews before consent |
| **Direct in index.html** | Captures all pageviews | May not be GDPR compliant in EU |

### Options:

1. **Replace consent-based loading**: Add to `index.html` and simplify `CookieConsent.tsx` to only handle advanced tracking (custom events, scroll depth)

2. **Keep both**: The `index.html` tag handles basic pageviews, while `CookieConsent.tsx` adds enhanced tracking after consent

I recommend **Option 2** — this gives you basic analytics immediately while respecting consent for enhanced tracking.

---

## File Changes Summary

| File | Change |
|------|--------|
| `index.html` | Add gtag.js script in head section |
| `CookieConsent.tsx` | Keep as-is for enhanced tracking (or simplify to remove duplicate GA loading) |

---

## Note

This change affects a Single Page Application (SPA). The gtag will fire once on initial load. For accurate page tracking in an SPA, you may also want to add virtual pageview tracking on route changes — but the existing `CookieConsent.tsx` already handles this with custom events like `region_view`.

