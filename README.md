# Highway Delite - Book Your Adventure

This repository is a Next.js (App Router) application for browsing and booking travel experiences. It includes a React + Tailwind UI, server API routes (using Next's route handlers), and a MongoDB backend using Mongoose.

Key features

- List, search and paginate experiences
- Experience details and date/time slot selection
- Bookings API with validation and total calculation
- Promo code validation endpoint

Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Mongoose + MongoDB
- Axios (client HTTP)

Quick status

- Project root: this README, package.json, tsconfig.json
- App code: `app/` (pages, API routes)
- Components: `components/`
- Models: `models/` (Mongoose schemas)
- DB helper: `lib/db.ts` (connects to MongoDB via MONGODB_URI)

Prerequisites

- Node.js 18+ (recommended)
- npm, pnpm or yarn
- A MongoDB instance (Atlas or local) and connection string

Environment variables
Create a `.env.local` in the project root and add at least:

```powershell
# .env.local example
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/highway-delite?retryWrites=true&w=majority"
# Optional: set a base URL for client usage
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Important: `lib/db.ts` requires `MONGODB_URI` and will throw when it is missing.

Install & run (development)

```powershell
# install deps
npm install

# start dev server
npm run dev

# build and run production locally
npm run build; npm start
```

Available npm scripts (from `package.json`)

- `dev` — start Next dev server
- `build` — build for production
- `start` — start built app
- `lint` — run eslint

Project structure (high level)

- `app/` — Next App Router routes and server handlers
  - `app/page.tsx` — homepage (experience listing + search)
  - `app/layout.tsx` — root layout, includes Analytics
  - `app/api/` — API route handlers (bookings, experiences, promo validation)
- `components/` — UI components (cards, header, date/time selector, etc.)
- `lib/` — helpers (database connection, utilities)
- `models/` — Mongoose models (`Experience`, `Booking`)
- `public/` — static assets (images)

API endpoints (from app/api)
The project exposes server endpoints under `/api` (Next route handlers). Key routes:

- `GET  /api/experiences` — list experiences (supports ?page=&limit=&search=)
- `GET  /api/experiences/:id` — experience detail
- `POST /api/experiences/:id/slots` — (slots endpoint present in repo) - slot related actions
- `POST /api/bookings` — create a booking
- `POST /api/promo/validate` — validate a promo code

(See `app/api/*/route.ts` files for exact request/response shapes.)

Notes about code & behavior

- DB: `lib/db.ts` uses `mongoose` and expects `MONGODB_URI` in environment. It also caches the connection on `global.mongoose` to avoid multiple connections in serverless environments.
- Models: `models/Experience.ts` and `models/Booking.ts` define schemas and indexes. Booking schema has pre-save hooks to compute subtotal/total.
- Client: `app/page.tsx` fetches `/api/experiences` with Axios and supports search + incremental load-more pagination. Components use `next/image` with `unoptimized` for some external images.

Developer tips

- If you develop locally without Atlas, run a local MongoDB (e.g., with Docker) and set `MONGODB_URI` to the connection string.



Deploying

- Vercel: this project works well on Vercel. Add `MONGODB_URI` to Vercel project environment variables. Use the `build` and `start` scripts as-is.
- Other hosts: ensure Node 18+ and the environment variable are provided and that outgoing network access to MongoDB is allowed.

Troubleshooting

- Error: `MONGODB_URI must be defined` — create `.env.local` and set `MONGODB_URI`.
- Image problems — `next/image` may require you to configure external domains in `next.config.js` if you want optimized images; the components already fall back to `unoptimized` for some external images.
- Next/Mongoose connection issues — check Atlas IP whitelist and credentials.

Contributing

- Open an issue or PR. Keep changes small and focused. Follow existing TypeScript and Tailwind patterns in components.

License

- This repo does not include a license file; add one if you intend to publish.

Contact

- If this project belongs to you, add maintainer contact or a link to the project board here.

---

If you want, I can also:

- add a small `scripts/seed.ts` seeder and a `scripts/README` for seeding sample data,
- add a `.env.example` file,
- or generate a short CONTRIBUTING.md.
  Tell me which of those you'd like next.
