

## Fix Facebook OG Debugger for /veneto

### Root Cause

The Vercel routing rule that intercepts social media crawlers only matches four regions:

```
^/(piemonte|lombardia|puglia|umbria)(?:/)?$
```

Veneto is missing from this list. When Facebook's crawler visits `/veneto`, it bypasses the OG edge function entirely and receives the generic SPA shell (`index.html`) -- which has no Veneto-specific metadata.

### Fix

**File: `vercel.json` (line 7)**

Add `veneto` to the bot-detection route regex:

```
^/(piemonte|lombardia|puglia|umbria|veneto)(?:/)?$
```

This single change ensures Facebook, Twitter, LinkedIn, WhatsApp, and all other social crawlers get routed to the `/api/og` edge function, which already knows how to fetch Veneto's metadata from the database.

### Verification

After deploying, re-run the Facebook Sharing Debugger at:
`https://developers.facebook.com/tools/debug/?q=https://news.caesartheday.com/veneto`

It should now show the correct title, description, and OG image.

