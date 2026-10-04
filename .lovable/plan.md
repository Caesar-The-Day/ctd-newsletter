# Plan: Tag Veni Vidi Vici email signups

## Goal
Every "Send me the next region" button on italy.caesartheday.com passes the tag `VVV Signup` to the newsletter page on caesartheday.com, so those subscribers are identifiable as Veni Vidi Vici readers.

## Change
- In `src/components/sections/NewsletterSignup.tsx`, append `tag=VVV%20Signup` to the signup URL alongside the existing UTM parameters.
- Resulting link: `https://www.caesartheday.com/newsletter?utm_source=veni-vidi-vici&utm_medium=referral&utm_campaign={region-slug|home}&tag=VVV%20Signup`
- This covers all placements automatically: the block after the intro and the one before the closing on every region page, plus the homepage block — they all share this one component.

## Verified current state
- `NewsletterSignup.tsx` builds the link via `withUtm('https://www.caesartheday.com/newsletter', campaign)` and is the only place newsletter signup links are generated.
- The crawler-rendered pages (`api/render.ts`) do not output newsletter signup links, so no change is needed there.

## Note
The tag only takes effect if the newsletter page on caesartheday.com (or your email provider behind it) reads the `tag` URL parameter. If it expects a different parameter name, tell me and I'll adjust.

## Verification
- Load a region page and the homepage in the preview, click/inspect the signup button, confirm the URL contains `tag=VVV%20Signup` and the UTM parameters.
