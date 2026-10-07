
- The app is served under the /regions/ sub-path (Vite base + Router basename); src/lib/basePath.ts prefixes root-relative content paths at runtime, and the build nests output in dist/regions/. Why: hosted at www.caesartheday.com/regions/ while content keeps plain /images/... paths.

- Email sign-ups go through `EmailCapture` → the `vvv-subscribe` edge function, which forwards to the CaesarTheDay site's `newsletter-subscribe` with the `VVV_PARTNER_KEY` header. Why: one subscriber list lives on caesartheday.com; the key stays server-side.

- SEO canonicals, social URLs, sitemaps, and crawler links use `https://italy.caesartheday.com` with region slugs at the domain root. Why: this is the independently fetchable production host for every regional guide.

- Every regional healthcare section is preceded by the shared ERV voluntary-SSN enrollment-cost note. Why: the national minimum applies across regions and must stay consistent.
