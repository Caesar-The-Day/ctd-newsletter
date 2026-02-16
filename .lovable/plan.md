

## Make Social Bot Routing Automatic for Future Regions

### Problem
Every time a new region is added to the OG Image Manager, someone must manually update the `vercel.json` regex to include the new slug. This was just forgotten for Veneto and will happen again.

### Solution
Replace the hardcoded region list in the `vercel.json` bot-detection route with a generic pattern that matches any valid region slug. The `api/og.ts` edge function already handles unknown slugs gracefully (returns site-wide defaults), so there is zero risk from broadening the match.

### Change

**File: `vercel.json` (line 7)**

Replace:
```
"src": "^/(piemonte|lombardia|puglia|umbria|veneto)(?:/)?$"
```

With:
```
"src": "^/([a-z][a-z0-9-]+)(?:/)?$"
```

This matches any lowercase slug (e.g., `/toscana`, `/sardegna`, `/le-marche`) and routes social bots to the OG edge function automatically. Regular browser users are unaffected -- only requests with a social bot user-agent header are intercepted.

No other files need to change. The `api/og.ts` function already queries the database by slug and falls back to site-wide defaults for any slug that does not have an entry yet.

### Why This Is Safe
- The route rule requires the social bot user-agent header, so normal visitors always get the SPA
- Unknown slugs return the generic "Veni. Vidi. Vici." OG metadata -- no errors
- Static asset paths (`/images/`, `/data/`, `/newsletters/`, files with extensions) are excluded by the later catch-all rule and never match this pattern
