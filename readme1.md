# Coupon Checker Frontend

React (Vite) rebuild of the coupon checker site — a "Check coupon" tab
with a 12-digit ticket-style input, a "Winners" tab listing all published
draws, and an "About" tab with the plain-language explanation and
disclaimer.

Data comes live from the [coupon-checker-backend](../coupon-checker-backend)
service (`GET /api/winners`) — there's no local `data.json` anymore.

## Design

Carried over from the original static build, unchanged:

- Light theme, indigo `#4338CA` primary, gold `#A5760A` reserved only for
  the "you won" reveal.
- Fraunces (headings) + IBM Plex Sans (body/UI) + IBM Plex Mono (coupon
  digits), loaded from Google Fonts.
- Dark mode via `prefers-color-scheme`, safe-area aware for notches/home
  indicators.
- Ticket/coupon visual metaphor: grouped digit boxes with a dashed
  perforation-style divider.
- The independent/unofficial disclaimer appears three times on purpose
  (footer, About page, inline in a win result) — don't consolidate these.

## Running locally

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Make sure `coupon-checker-backend` is running locally too (see its own
README), or point `VITE_API_URL` at your deployed backend URL.

## Building

```bash
npm run build
```

Outputs a static `dist/` folder — plain HTML/CSS/JS, no server needed to
serve it.

## Deploying

Any static host works. Easiest options:

- **Vercel** — import the repo, it auto-detects Vite, set the
  `VITE_API_URL` environment variable in the project settings to your
  backend's URL, deploy.
- **Netlify** — same idea: connect repo, build command `npm run build`,
  publish directory `dist`, set `VITE_API_URL` in site settings.
- **Cloudflare Pages / GitHub Pages** — also fine, same build output.

Whichever origin you end up on (e.g. `https://your-app.vercel.app`), set
that as `ALLOWED_ORIGIN` on the backend (see the backend's README) so
CORS is locked down to just your frontend.

## Structure

```
src/
├── main.jsx              entry point
├── App.jsx               page state (checker/winners/about) + data loading
├── App.css               all styles and design tokens
├── api.js                fetchWinners() — calls the backend
└── components/
    ├── Header.jsx        top nav
    ├── CheckerPage.jsx   12-digit ticket input + result reveal
    ├── WinnersPage.jsx   filterable draw list
    └── AboutPage.jsx     explanation + disclaimer
```
