# Implementation checklist and acceptance criteria

## Completed prototype

- [x] Branded responsive homepage with search and prominent seller action.
- [x] Block-based visual system inspired by the requested reference while preserving OwnerOnly branding.
- [x] Search/filter, vehicle detail, gallery, badges, approximate location, safety tips, report and contact controls.
- [x] How It Works, Trust & Safety, Seller Fees, About, FAQ, Terms placeholder, and Privacy placeholder.
- [x] Login, signup, verification status, dashboard, favorites, messages, settings, six-step listing wizard, and preview.
- [x] Original generated demo vehicle imagery; all seed records labeled demonstration data.
- [x] NHTSA adapter and non-fabricating mock NMVTIS adapter boundaries.
- [x] Metadata, social card, robots, sitemap, environment example, and typed environment reader.

## Production implementation gates

- [ ] Supabase schema, migrations, RLS, storage policies, seed data, and rollback plan pass automated tests.
- [ ] Stripe Identity session creation is authenticated/server-only; signed webhooks are idempotent; no raw ID/selfie images are stored or logged.
- [ ] Upload pipeline validates signatures/types/sizes/dimensions/count, strips metadata, re-encodes, and deletes ownership documents on schedule.
- [ ] Publish/message mutations deny unverified, suspended, blocked, or unauthorized users in server and RLS tests.
- [ ] Risk signals feed human review; no IP/score-only automatic ban; suspension and appeal workflows are audited.
- [ ] Messaging rate limits, off-platform warnings, suspicious-link handling, reports, blocks, and moderator actions pass unit/integration/E2E tests.
- [ ] VIN caching, failure handling, report source/timestamp display, structured data, sitemap lifecycle, and sold/expired removal are tested.
- [ ] CSP, secure headers, CSRF defenses where applicable, secret/PII log redaction, backup/restore, export/deletion, incident response, and moderation playbooks are verified.
- [ ] Mobile/tablet/desktop, keyboard, screen-reader labels, loading/empty/error/success states, lint, types, unit, integration, Playwright, and production build all pass.
- [ ] Counsel, privacy, security, moderation, vendor, retention, fee, insurance, and jurisdiction decisions receive owner approval.
