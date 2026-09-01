# OwnerOnly Cars

**Cars from people, not lots.**

OwnerOnly Cars is a United States private-owner vehicle marketplace prototype.
It separates private-owner listings, Private Seller Auctions, and a directory of
independent public auto auctions. The public experience includes verification
explanations, safety guidance, fictional demonstration inventory, and the
OwnerOnly Journal.

## Local development

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Validation

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`

## GitHub Pages preview

The included GitHub Actions workflow creates a static export and deploys it to
GitHub Pages. It is intended for the public product preview and blog.

GitHub Pages cannot run the planned secure account, verification, upload,
messaging, moderation, payment, or live-auction backend. Those features remain
demonstrations until the production database, authentication, private storage,
webhooks, and server-side authorization are connected on server-capable hosting.

All current vehicle listings and private-auction bids are fictional
demonstration data.
