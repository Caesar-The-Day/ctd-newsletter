# Give you an admin account for the editorial panel

There are currently zero accounts in the backend, so no role can be granted yet. The fastest safe path: create your account once, and have it become admin automatically — no manual role wrangling afterwards.

## What happens

1. The sign-in page at `/auth` gets a "Create admin account" form (email + password) that only appears while no admin exists in the system. Once the first admin is created, the form disappears permanently and `/auth` is sign-in only.
2. Email confirmation is turned off for signup so the account works immediately — no inbox round-trip, no confirmation link.
3. The first account created is granted the `admin` role automatically by a database trigger. The trigger checks that no admin exists yet, so it can never be used to escalate a second account.
4. You land on `/admin/regions` straight after creating the account. The password is yours; you can change it later from the sign-in page.

You will still type an email and a password once, when creating the account — that is unavoidable, because Lovable Cloud accounts are always owned by a real credential. After that, the browser keeps you signed in and you won't be asked again.

## Security notes

- Nothing about the existing protections changes: RLS policies, edge-function admin checks, and storage write rules stay exactly as they are.
- The bootstrap trigger is one-shot by construction (`where not exists (select 1 from user_roles where role = 'admin')`), so it cannot grant admin to anyone once you exist.
- The signup form is gated on the same "no admin yet" check, queried through a small security-definer function that returns only a boolean.

## Technical details

- Migration: `public.admin_exists()` (security definer, returns boolean) and `public.bootstrap_first_admin()` trigger on `auth.users` insert that inserts an `admin` row into `public.user_roles` only when no admin exists.
- Auth config: `auto_confirm_email` enabled so signup returns a live session.
- `src/pages/Auth.tsx`: add a sign-up mode rendered only when `admin_exists()` returns false; call `supabase.auth.signUp` with `emailRedirectTo: window.location.origin`, then navigate to `/admin/regions`.
