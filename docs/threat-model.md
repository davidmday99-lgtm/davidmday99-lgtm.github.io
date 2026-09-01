# Threat model

## High-value assets

Government-identity results, ownership documents, legal names, contact information, exact location, authentication tokens, messages, moderation notes, audit logs, Stripe/Supabase credentials, and seller reputation.

## Main threats and controls

| Threat | Controls |
| --- | --- |
| Fake identity or stolen documents | Hosted Stripe Identity, matching selfie, webhook verification, manual review states, no raw image storage |
| Non-owner/dealer listing | Ownership-name/VIN comparison, attestation, configurable rolling limits, repeated VIN/photo/contact/device/account signals, human review and appeal |
| Account takeover | Strong auth, phone confirmation, session rotation, rate limits, breach/password controls, suspicious login response |
| OAuth callback or account-linking abuse | PKCE, state validation, exact redirect allow list, same-origin post-login paths, secure cookie sessions, authenticated identity linking, no custom email-only account merges |
| IDOR/RLS bypass | Server authorization on every mutation, deny-by-default RLS, UUIDs not treated as authorization, access-control tests |
| Malicious upload | Signature/type/size/dimension/count validation, metadata stripping, private staging, malware/image re-encode, random object names |
| Webhook replay/spoofing | Raw-body signature verification, timestamp tolerance, idempotency table, monotonic state transitions |
| Messaging scam/spam | Verification gate, rate limits, block enforcement, suspicious-link and off-platform warnings, reports, moderation |
| Fake or swapped CARFAX link | HTTPS-only CARFAX-domain allowlist, redirect revalidation, stored normalized URL, visible seller-provided label, VIN-match reminder, report control and periodic link checks |
| XSS/content injection | Length/schema validation, safe rendering, URL allow/deny policies, CSP, output encoding, sanitization where rich text is unavoidable |
| Privacy leakage | Approximate location, private contact channels/documents, minimized logs, retention jobs, export/deletion workflows |
| Insider misuse | Least privilege, short-lived access, immutable audit actions, case-based document access, dual control for sensitive exports |
| Fake “government” auction source | Official-agency provenance, contractor authorization evidence, human approval, visible source/verification date, report control |
| Malicious or broken auction URL | HTTPS allow policy, safe redirect/DNS/IP validation, link monitoring, change alerts, moderator review |
| SSRF through link checker/import | Block private/link-local/loopback/metadata ranges, re-resolve redirects, restrict ports, cap time and response size |
| Expired or timezone-wrong event | Store timezone-aware instants, test DST/offset behavior, scheduled expiration, retain audit history |
| Dealer/license-only event shown publicly | Public-access and license filters exclude restricted/unknown events by default; prominent “License Required” state |
| Auction payment phishing | No bid/payment form, external-link warning, never store auction credentials, official operator links only |
| CSV injection or mass corruption | Strict schema/size/row limits, formula neutralization, URL validation, preview, duplicate detection and transactional import |

## Non-goals and residual risk

Verification does not prove mechanical condition, eliminate social engineering, guarantee title validity in every jurisdiction, or make a transaction safe. Legal, operational, vendor, and security review remain necessary before launch.

Auction-directory inclusion is not affiliation, endorsement, inventory verification, title confirmation, condition reporting, or a vehicle guarantee.
