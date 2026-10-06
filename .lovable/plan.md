# One email sign-up, captured on the page, tagged "VVV Signup"

## What happens today (confirmed)
- On region pages, the "Get the next region when it's published" box links visitors out to caesartheday.com/newsletter (The Rubicon Brief form).
- On the homepage, the "One new region a month." form doesn't save the email either. "Send me the next region" sends visitors to that same Rubicon Brief page, where they have to type everything again.
- caesartheday.com already saves subscribers to the list you see in /admin, and that list already supports tags and a source. But its sign-up step always saves an empty tag list, requires a name, and expects its own bot check. So it can't receive a tag from this site yet.

## What visitors will see
- The same blush "One new region a month." sign-up is used everywhere: on the homepage, after the editorial welcome on each guide, and just before the closing share section.
- Fields: First name and Your email, then "Send me the next region". Visitors stay on the page.
- After sending, the form is replaced by "You're in. The next region lands in your inbox." If the address is already subscribed: "You're already on the list." If the save fails, a short error appears and the form stays filled in.
- No more jumps to caesartheday.com to sign up.

## What you'll see in caesartheday.com /admin
Each new subscriber shows up in Subscribers with:
- source `veni-vidi-vici`
- tags `VVV Signup`, plus the region they signed up from (for example `VVV liguria`, or `VVV home` for the homepage)

They get the normal CaesarTheDay welcome email. You can filter by the `VVV Signup` tag.

## Two parts
1. **This site (I'll do it now):** a shared sign-up form used in all three places, plus a small backend step. That step checks the email, limits repeat attempts, and forwards the sign-up to caesartheday.com with a private key. The key never reaches the visitor's browser.
2. **caesartheday.com (separate project, needs one change there):** its sign-up step needs to accept sign-ups that carry the private key. For those, it skips its own bot check, keeps the `VVV` tags (only tags starting with "VVV" are allowed), and saves the source. I'll give you an exact instruction to paste into that project. Until it's applied, the form shows an error and nothing is lost on caesartheday.com.

You'll be asked once to create the shared private key. You'll then save the same value in both projects.

## Technical details
- New component `src/components/sections/EmailCapture.tsx` (props `campaign`, `variant`). It replaces `NewsletterSignup` on `RegionPage` (both slots) and the homepage `#signup` band. Uses the brand tokens, a visible label, and `aria-live` status messages. Delete `NewsletterSignup.tsx`.
- New edge function `supabase/functions/vvv-subscribe`:
  - Validates the body with Zod: email, firstName (1–80), campaign (slug pattern).
  - Uses a honeypot field and a per-IP rate limit.
  - POSTs to `https://rgxggzqtexujaoxvzwok.supabase.co/functions/v1/newsletter-subscribe` with `x-vvv-partner-key: VVV_PARTNER_KEY` and body `{ email, name, source: 'veni-vidi-vici', tags: ['VVV Signup', 'VVV <campaign>'] }`.
  - Maps `alreadySubscribed` and errors through to the form.
- New secret `VVV_PARTNER_KEY`: a shared value, created by you and stored in both projects.
- Cross-project change for caesartheday-web `newsletter-subscribe`:
  - If the `x-vvv-partner-key` header equals the env value (constant-time compare), skip Turnstile.
  - Accept `tags`, filtered to strings starting with `VVV` (max 3).
  - When the email already exists, merge the VVV tags into the existing row.
- The `tag=VVV%20Signup` link parameter is no longer used.
- Verify by submitting a test address from the preview and checking the response. The admin list check happens after the caesartheday.com change is live.
