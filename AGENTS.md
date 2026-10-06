
- The app is served under the /regions/ sub-path (Vite base + Router basename); src/lib/basePath.ts prefixes root-relative content paths at runtime, and the build nests output in dist/regions/. Why: hosted at www.caesartheday.com/regions/ while content keeps plain /images/... paths.
