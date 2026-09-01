# Architecture

## Target production architecture

- App Router TypeScript web application, deployable at the edge where supported.
- Tailwind CSS and accessible reusable components.
- Supabase PostgreSQL, Auth, row-level security, private Storage, and Realtime.
- Stripe Identity hosted document + matching-selfie verification.
- NHTSA vPIC adapter with successful-response caching.
- Approved NMVTIS provider behind a provider interface; mock adapter until contracted.
- Vitest for units/integrations and Playwright for protected-flow end-to-end tests.

## Trust boundaries

1. Browser is untrusted. It may request actions but never grants authorization.
2. Server validates session, account state, verification state, ownership, rate limit, and record scope for every mutation.
3. Supabase RLS is defense in depth and denies by default.
4. Stripe webhooks require signature verification and idempotency keys.
5. Private documents use a non-public bucket and short-lived signed URLs only inside authorized moderator workflows.
6. External VIN/history data is labeled with source and retrieval time; provider responses are never treated as seller authority.

## Data minimization

- Do not download Stripe ID or selfie images.
- Store Stripe session ID, state, timestamps, failure category, and minimum approved fields only.
- Ownership documents are private and auto-deleted after configured retention and resolved appeal window.
- Photo pipeline strips EXIF metadata and validates content signature, type, dimensions, size, and count.
- Logs redact secrets, exact contact data, document contents, raw provider payloads containing personal data, and sensitive moderation notes.

## Current prototype

The current build provides the complete public and account interface, realistic fictional demo listings, original imagery, verification explanations, NHTSA and NMVTIS adapter boundaries, SEO surfaces, and project documentation. Auth, persistence, uploads, webhooks, moderation, and vendor calls remain intentionally unconnected until accounts and decisions are supplied.
