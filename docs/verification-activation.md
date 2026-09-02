# Verification activation

The account verification page must never infer a completed check. Phone status
comes from the authenticated Supabase user, identity status comes from
server-managed app metadata updated by Stripe webhooks, and ownership review is
performed per listing.

## Phone verification

1. In Supabase, enable phone authentication.
2. Connect an approved SMS provider and configure rate limits and CAPTCHA.
3. Test the phone update, phone-change OTP, resend limits, and recovery behavior
   in a non-production account.

## Stripe Identity

1. Deploy the create-identity-verification and stripe-identity-webhook Supabase
   Edge Functions.
2. Set SITE_ORIGIN=https://owneronlycars.com, STRIPE_SECRET_KEY, and
   STRIPE_IDENTITY_WEBHOOK_SECRET as Edge Function secrets.
3. In Stripe, subscribe the webhook endpoint to Identity verification-session
   processing, verified, requires-input, canceled, and redacted events.
4. Verify webhook signatures and use Stripe test mode before switching to live
   Identity.
5. Confirm that only session ID, status, timestamps, failure category, and
   minimum approved fields are retained. Do not download raw ID images.

Stripe Identity session creation must remain server-side. The secret key must
never be placed in the website bundle or a public GitHub variable.
