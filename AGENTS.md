
- Built files live under the /regions/ Vite base (output nested in dist/regions/); the Router basename is chosen at runtime (root on italy.caesartheday.com, /regions when the URL starts with it or in local dev), and src/lib/basePath.ts prefixes only file paths, never page links. Why: italy.caesartheday.com/<region> is canonical while www.caesartheday.com/regions/ still proxies the same build.

- Email sign-ups go through `EmailCapture` → the `vvv-subscribe` edge function, which forwards to the CaesarTheDay site's `newsletter-subscribe` with the `VVV_PARTNER_KEY` header. Why: one subscriber list lives on caesartheday.com; the key stays server-side.

- SEO canonicals, social URLs, sitemaps, and crawler links use `https://italy.caesartheday.com` with region slugs at the domain root. Why: this is the independently fetchable production host for every regional guide.

- Every regional healthcare section is preceded by the shared ERV voluntary-SSN enrollment-cost note. Why: the national minimum applies across regions and must stay consistent.
