# Google sign-in setup

The prototype shows Google sign-in on both Login and Sign Up. Keep the button disabled until the production Supabase project, public domain, callback route, and Google OAuth client are configured and tested.

## Production flow

1. Create separate Google Cloud OAuth projects for development and production.
2. Configure the Google consent screen for the OwnerOnly Cars name, verified domain, support email, homepage, privacy policy, and terms.
3. Request only `openid`, email, and basic profile scopes. Do not request Gmail, contacts, calendar, Drive, or offline Google API access.
4. Create a Web OAuth client. Add the exact application origins and the Supabase callback URL shown by the Google provider page in the Supabase dashboard.
5. Store the Google client ID and client secret only in the Google/Supabase provider configuration. Never expose the client secret in browser code or a `NEXT_PUBLIC_` variable.
6. Add the application callback route to Supabase's redirect allow list and use a PKCE server-side code exchange to create the cookie-backed session.
7. Redirect successful users to the intended same-origin page. Reject external `next` URLs to prevent open redirects.
8. Test cancel, denied-consent, duplicate-email, disabled-account, suspended-account, callback-replay, and provider-outage states.

## Product rules

- Say “Continue with Google,” not “attach Gmail.” A Google Account may use a non-Gmail address.
- Google authenticates the account only. Phone verification, Stripe identity verification, and vehicle-ownership review remain separate gates.
- Never ask for or store a Google password, Gmail contents, Google access token, or provider refresh token.
- Do not merge accounts with custom email-only logic. Use Supabase-supported identity linking and require an authenticated session before adding another sign-in method.
- Record only the minimum provider identity reference needed for account security and auditing.
