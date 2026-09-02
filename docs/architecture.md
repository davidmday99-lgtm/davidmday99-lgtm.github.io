# Architecture

## Target production architecture

- App Router TypeScript web application, deployable at the edge where supported.
- Tailwind CSS and accessible reusable components.
- Supabase PostgreSQL, Auth, row-level security, private Storage, and Realtime.
- Google OAuth through Supabase Auth using PKCE and minimum `openid`, email, and profile scopes; no Gmail-data access.
- Stripe Identity hosted government-ID document verification.
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
7. Google OAuth secrets stay in provider configuration, redirects use an exact allow list, and Google sign-in never bypasses phone, identity, ownership, suspension, or authorization checks.

## Data minimization

- Do not download Stripe ID images.
- Store Stripe session ID, state, timestamps, failure category, and minimum approved fields only.
- Ownership documents are private and auto-deleted after configured retention and resolved appeal window.
- Photo pipeline strips EXIF metadata and validates content signature, type, dimensions, size, and count.
- Logs redact secrets, exact contact data, document contents, raw provider payloads containing personal data, and sensitive moderation notes.

## Current prototype

The current build provides the complete public and account interface, Google sign-in preview, realistic fictional demo listings and private-auction previews, original imagery, verification explanations, NHTSA and NMVTIS adapter boundaries, SEO surfaces, and project documentation. Auth, persistence, uploads, webhooks, realtime auctions, moderation, and vendor calls remain intentionally unconnected until accounts and decisions are supplied.

## Private-seller auction subsystem

- Private auctions reference the existing verified seller, vehicle, ownership review, and approved listing; they never share records with the third-party Public Auto Auctions directory.
- Reserve amounts and bidder maximums are server-only values and never appear in public projections, logs, analytics, realtime payloads, or client-side source.
- Bid placement runs in one serializable database transaction: lock the auction, validate status/time/identity/blocks/increment/idempotency, update proxy standings, append the bid and audit event, then publish a redacted realtime update.
- Server time is authoritative. A qualified bid in the configured final window extends the auction consistently; the extension is recorded and visible.
- Sellers, household/connected accounts, moderators with access to the case, suspended users, and unverified users cannot bid. Risk signals route to review and never automatically ban on IP address alone.
- Live launch requires recovery testing, concurrency/load tests, auction monitoring, legal approval of binding-bid/cancellation terms, and a supported close/reopen procedure.

## Auction-directory subsystem

- Separate route namespace and record types prevent auction records from entering owner-listing queries.
- Official sources, events, locations, vehicles, verification logs, change alerts, and state guides use independent tables and publication states.
- Discovery/import writes only to a private moderation queue. Human approval is mandatory before publication.
- Source collection prefers official APIs, RSS, and structured feeds. Otherwise administrators maintain verified links; robots and source terms control whether retrieval is allowed.
- Link checks use outbound-request protections: HTTPS-only, DNS/IP validation, redirect limits, response-size limits, timeouts, content-type checks, and no access to private networks or cloud metadata.
- A scheduled expiration job hides events after the confirmed timezone-aware closing instant while retaining historical and audit records.
- The browser never receives moderator notes or unrestricted CSV imports. CSV validation is schema-strict, size-limited, formula-safe, and duplicate-aware.
