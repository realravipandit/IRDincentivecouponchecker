# Coupon Checker

An independent, unofficial web app for checking IRD Taxpayer Incentive
Gift Program coupon numbers against published prize draw winners.

Enter your 12-digit coupon and instantly see whether it's a match — or
browse all recently published draws directly.

> Not affiliated with IRD or the Government of Nepal. Doesn't register
> bills, collect personal data, or process prize claims.

## Features

- **Check coupon** — enter a 12-digit coupon number and check it
  against the latest published draws.
- **Winners** — browse all published draws, filterable by prize
  category.
- **About** — a plain-language explanation of the program and how this
  tool works.

Data is fetched live from a companion backend service, so results
always reflect the latest published draws.

## Running locally

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

You'll need the companion backend service running (locally or
deployed) for data to load — see its own README for setup.

## Building for production

```bash
npm run build
```

This produces a static `dist/` folder that can be served by any static
host — no server-side runtime required.

## Deploying

Works with any static hosting provider (Vercel, Netlify, Cloudflare
Pages, GitHub Pages, etc.):

1. Connect the repo, or upload the built `dist/` folder.
2. Set the build command to `npm run build` and the output directory
   to `dist`.
3. Set the `VITE_API_URL` environment variable to your backend's URL.
4. Once deployed, make sure your backend allows requests from your
   new frontend's origin.

## Disclaimer

This is an Independent, unofficial tool. Always confirm any win and
the claim process on the official IRD site before taking action.
