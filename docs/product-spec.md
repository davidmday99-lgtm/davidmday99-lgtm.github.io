# OwnerOnly Cars product specification

## Purpose

OwnerOnly Cars is a United States marketplace where private vehicle owners advertise directly to buyers. Dealer, broker, reseller, and consignment inventory is prohibited. The brand promise is “Cars from people, not lots.”

## MVP users and permissions

- Public visitors may browse published listings and read safety content.
- Account holders must confirm email and phone.
- A user must pass identity verification before publishing or messaging.
- A seller must also pass vehicle-specific ownership review before publication.
- Moderators review ownership submissions, reports, risk signals, and appeals.
- Administrators configure marketplace rules; limits are policy inputs, not legal conclusions.

## Core flows

1. Browse and filter published private-owner listings.
2. Create account, confirm phone, and complete Stripe Identity hosted ID + selfie verification.
3. Create a six-step listing: VIN; facts and price; features and description; photos; ownership document; review.
4. Decode VIN through NHTSA vPIC and preserve both raw response and seller-corrected non-authoritative fields.
5. Submit title or registration privately; moderator compares legal name and VIN.
6. Publish only after verification, attestation, automated screening, and required review.
7. Verified users message on-platform, save favorites, report, and block.

## Product principles

- Never describe the marketplace as scam-proof.
- Explain what every badge establishes and what it does not establish.
- Identity verification and vehicle ownership verification are separate.
- Public pages show approximate location only.
- Exact address, legal name, email, phone, document URL, raw risk data, and provider identifiers are never public.
- Initial MVP excludes payments, escrow, financing, shipping, inspection, tax, registration, and title-transfer services.
- No state-specific dealer threshold is hardcoded. Rules are configurable by jurisdiction and require legal review.
- Automated signals route cases to human review; IP address or score alone never causes an automatic ban.

## Verification meaning

| Check | Establishes | Does not establish |
| --- | --- | --- |
| Government ID + selfie | User likely matches submitted ID | Vehicle ownership |
| Title/registration review | Seller name and VIN match current document | Mechanical condition |
| NMVTIS provider report | Available title, odometer, brand, salvage/total-loss, and certain theft data | Complete repair history |

## Success criteria

- A visitor can understand the owner-only proposition and search in the first viewport.
- Every demo record is labeled as demonstration data.
- A badge explanation is reachable from each listing.
- Publishing and messaging gates are enforced server-side in production.
- WCAG 2.2 AA is the accessibility target.

## Material assumptions

- United States launch only; launch jurisdictions are not selected.
- Supabase and Stripe accounts, NMVTIS provider agreement, moderation staffing, fees, retention schedules, and final policies are not yet supplied.
- Current repository is a Vinext/React Sites prototype compatible with App Router conventions; a production Supabase backend remains to be implemented.
