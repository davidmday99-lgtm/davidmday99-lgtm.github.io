# Threat model

## High-value assets

Government-identity results, ownership documents, legal names, contact information, exact location, authentication tokens, messages, moderation notes, audit logs, Stripe/Supabase credentials, and seller reputation.

## Main threats and controls

| Threat | Controls |
| --- | --- |
| Fake identity or stolen documents | Hosted Stripe Identity, matching selfie, webhook verification, manual review states, no raw image storage |
| Non-owner/dealer listing | Ownership-name/VIN comparison, attestation, configurable rolling limits, repeated VIN/photo/contact/device/account signals, human review and appeal |
| Account takeover | Strong auth, phone confirmation, session rotation, rate limits, breach/password controls, suspicious login response |
| IDOR/RLS bypass | Server authorization on every mutation, deny-by-default RLS, UUIDs not treated as authorization, access-control tests |
| Malicious upload | Signature/type/size/dimension/count validation, metadata stripping, private staging, malware/image re-encode, random object names |
| Webhook replay/spoofing | Raw-body signature verification, timestamp tolerance, idempotency table, monotonic state transitions |
| Messaging scam/spam | Verification gate, rate limits, block enforcement, suspicious-link and off-platform warnings, reports, moderation |
| XSS/content injection | Length/schema validation, safe rendering, URL allow/deny policies, CSP, output encoding, sanitization where rich text is unavoidable |
| Privacy leakage | Approximate location, private contact channels/documents, minimized logs, retention jobs, export/deletion workflows |
| Insider misuse | Least privilege, short-lived access, immutable audit actions, case-based document access, dual control for sensitive exports |

## Non-goals and residual risk

Verification does not prove mechanical condition, eliminate social engineering, guarantee title validity in every jurisdiction, or make a transaction safe. Legal, operational, vendor, and security review remain necessary before launch.
