# Database schema plan

All tables use UUID primary keys, server-generated `created_at`/`updated_at`, foreign keys, and least-privilege RLS. Sensitive rows are never anonymously readable.

| Table | Purpose and important constraints |
| --- | --- |
| profiles | Auth user reference; chosen display name; approximate public location; private legal-name hash/reference |
| contact_verifications | Email/phone channel, state, attempt counters, verified timestamp; unique user + channel |
| identity_verifications | Provider session ID unique; state; timestamps; failure category; minimum approved fields; no raw images |
| ownership_verifications | Listing/VIN; private storage object reference; review state; expiry/deletion timestamp; reviewer |
| vehicles | Normalized VIN unique; original vPIC payload; decoded fields; seller-corrected descriptive fields |
| listings | Seller and vehicle; draft/review/published/paused/sold/expired/rejected state; approximate geography; price and facts |
| listing_photos | Listing; private staging/public derivative refs; order; content hash; dimensions; moderation state |
| favorites | Unique user + listing |
| conversations | One listing per conversation; state; rate-limit fields |
| conversation_members | Unique conversation + user; archived/read state |
| messages | Conversation; sender; sanitized body; suspicious-link/off-platform flags; created timestamp |
| reports | Reporter; target type/id; category; state; abuse controls |
| blocks | Unique blocker + blocked user; prevents future messages |
| moderation_cases | Target; risk score; human state; appeal linkage |
| moderation_actions | Append-only action, actor, reason, before/after references |
| marketplace_rules | Jurisdiction, rule key, typed value, effective range, approval metadata |
| audit_events | Append-only immutable event; actor; action; target; request correlation; tamper-evident hash chain |
| auction_sources | Official agency or authorized contractor, URLs, category, states, public access, license, format, verification, review schedule, private notes and approval audit |
| auction_events | Source, timezone-aware start/close, location, registration, eligibility, deposit, premium, payment, inspection, vehicle categories, title information and publication state |
| auction_locations | Source/event physical location, state, ZIP, timezone and approximate map coordinates |
| auction_vehicles | Optional source-supplied inventory linked only to an auction event; never to private-owner verification |
| source_verification_logs | Append-only link/source checks with actor, outcome and timestamp |
| source_change_alerts | Detected URL, terms, access, license, schedule or other changes awaiting review |
| state_auction_guides | State-specific reviewed content, publication state, review timestamp and approver |

## Required indexes and constraints

- VIN matches `^[A-HJ-NPR-Z0-9]{17}$` after normalization.
- Partial unique index prevents more than one active listing per VIN.
- Published listing search indexes: state, make/model/year, price, mileage, body style, fuel, drivetrain, title status, approximate geography, published timestamp.
- Message indexes: conversation + created timestamp; reports/cases: state + priority + created timestamp.
- No public policy may select unpublished listings, ownership documents, legal names, exact location, contact channels, moderation notes, or audit payloads.
- Auction-source canonical URL is unique after normalization. Event duplicate keys combine source, normalized title and confirmed time range.
- Auction events require an approved source; expired events leave public queries automatically but remain in historical/audit storage.
- Public auction queries exclude restricted, unknown-access, expired and unapproved events by default.

## RLS outline

- Anonymous: published non-sensitive listing projection only.
- Authenticated user: own profile, own drafts, own favorites, own conversation memberships.
- Verified user: may create conversations and messages when not blocked and listing is contactable.
- Moderator: explicit role plus server-side route check; scoped read for review queues.
- Administrator: explicit elevated role; all actions audited; service-role key never reaches browser.
