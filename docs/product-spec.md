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
2. Create account, confirm phone, and complete Stripe Identity hosted government-ID document verification.
3. Create a six-step listing: VIN; facts and price; features, description, and optional seller-provided CARFAX link; photos; ownership document; review.
4. Decode VIN through NHTSA vPIC and preserve both raw response and seller-corrected non-authoritative fields.
5. Submit title or registration privately; moderator compares legal name and VIN.
6. Publish only after verification, attestation, automated screening, and required review.
7. Verified users message on-platform, save favorites, report, and block.
8. Visitors explore a separate Public Auto Auctions directory by state, region, format, source type, eligibility, licensing, vehicle, title, inspection, and confirmed closing information.
9. Verified private owners may create a timed vehicle auction with a starting bid and optional hidden reserve; verified buyers may place proxy-style maximum bids after the live bidding backend and final terms are approved.

## Public Auto Auctions directory

- Auction sources and events never enter private-owner listing results or receive private-owner verification badges.
- Official federal, state, county, city, police, sheriff, university, and public-agency sources have priority.
- A contractor appears only after an official agency identifies it as authorized.
- New sources require human approval. Dealer-only and license-restricted events are excluded from default public results; restricted events must say “License Required.”
- Unconfirmed schedules, fees, eligibility, license rules, inventory, title, inspection, payment, or pickup information displays “Not confirmed—check with the auction.”
- The Public Auto Auctions directory is informational only. OwnerOnly never accepts bids, deposits, payments, credentials, or passwords for those third-party events.
- All 50 states and Washington, D.C. have useful state guide pages and official-government directory links. Empty event schedules remain explicit rather than fabricated.

## Product principles

- Never describe the marketplace as scam-proof.
- Explain what every badge establishes and what it does not establish.
- Identity verification and vehicle ownership verification are separate.
- Public pages show approximate location only.
- Exact address, legal name, email, phone, document URL, raw risk data, and provider identifiers are never public.
- Initial MVP excludes payments, escrow, financing, shipping, inspection, tax, registration, and title-transfer services.
- Public-auction registration, bidding, deposits, premiums, payments, and pickup remain entirely with the official operator.
- Private Seller Auctions are a distinct OwnerOnly product. Seller identity and ownership review are required; reserve amounts remain private; fixed increments, proxy maximums, anti-shill controls, exact closing rules, and immutable bid auditing must be enforced server-side.
- Private Seller Auctions do not add payments, escrow, financing, shipping, inspection, tax, registration, or title transfer to the MVP.
- Independently operated auction brokers may appear only in a separate, clearly labeled section after their relationship to the underlying auction operator is verified. They never receive government-source or private-owner badges.
- No state-specific dealer threshold is hardcoded. Rules are configurable by jurisdiction and require legal review.
- Automated signals route cases to human review; IP address or score alone never causes an automatic ban.
- A seller-provided CARFAX link is optional third-party information, not an OwnerOnly verification badge. Public pages identify its source and tell buyers to confirm the report VIN.

## Verification meaning

| Check                       | Establishes                                                                  | Does not establish                                                         |
| --------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Government-ID document      | Submitted identity document passes the provider check                        | Vehicle ownership or a biometric match                                     |
| Title/registration review   | Seller name and VIN match current document                                   | Mechanical condition                                                       |
| NMVTIS provider report      | Available title, odometer, brand, salvage/total-loss, and certain theft data | Complete repair history                                                    |
| Seller-provided CARFAX link | The seller supplied a link hosted on a CARFAX domain                         | That the report is current, complete, authentic, or for the listed vehicle |

## Success criteria

- A visitor can understand the owner-only proposition and search in the first viewport.
- Every demo record is labeled as demonstration data.
- A badge explanation is reachable from each listing.
- Publishing and messaging gates are enforced server-side in production.
- WCAG 2.2 AA is the accessibility target.

## Material assumptions

- United States launch only; launch jurisdictions are not selected.
- Supabase and Stripe accounts, NMVTIS provider agreement, moderation staffing, fees, retention schedules, and final policies are not yet supplied.
- Current repository is a Vinext/React Sites prototype compatible with App Router conventions; private-auction inventory and bidding are fictional UI demonstrations until a production Supabase backend, authorization, atomic bidding, and realtime delivery are implemented.
