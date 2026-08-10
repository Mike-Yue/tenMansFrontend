# deca — tenMansFrontend

The web UI for the CS2 "ten mans" stats tracker. A single-page app that lists
players and matches, shows a player's aggregated stats, and renders a per-team
scoreboard for each match. It talks to the `tenMansBackend` service (separate
repo) over its JSON API.

## Tech

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **react-router** for client-side routing
- A hand-rolled `useAsync` hook + a small typed API client (no data-fetching library)

## Features

| Route | What it shows |
|---|---|
| `/users` | All players |
| `/users/:steamId` | A player's profile plus their aggregated all-time stats |
| `/matches` | All matches, with a season filter and a **"+ New match"** button (POSTs to the backend) |
| `/matches/:matchId` | Match details with a per-team scoreboard (K / D / A / K-D / MVPs) |

The API client (`src/api/`) preserves 64-bit Steam IDs, which exceed JavaScript's
safe-integer range, by parsing oversized integers as strings.

## Running locally

Requires **Node 20+** (this project builds with Vite 8).

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Pointing at a backend

The API base URL comes from `VITE_API_BASE_URL` (see `src/api/client.ts`):

- **`.env`** currently sets it to the deployed backend
  (`https://tenmansbackend.onrender.com`), so `npm run dev` talks to production by
  default.
- To develop against a **local backend** instead, create a **`.env.local`**
  (gitignored) with an empty value:

  ```bash
  VITE_API_BASE_URL=
  ```

  When it's empty, the app uses relative `/api` paths, which the Vite dev server
  proxies to `http://localhost:8080` (configured in `vite.config.ts`). Run the Go
  backend alongside it.

> `VITE_*` variables are read at build/startup, not via hot reload — restart the
> dev server after changing them.

## Building & deploying

```bash
npm run build   # outputs static files to dist/
```

The build is fully static, so it deploys as a **static site** (e.g. Render Static
Site, Vercel, Netlify) — not a web service. Two things the host needs:

1. Set `VITE_API_BASE_URL` to the backend's URL (baked in at build time).
2. Add an SPA rewrite — serve `index.html` for any unknown path — so deep links
   like `/matches/3` work on refresh. On Render: rewrite `/*` → `/index.html`.

The backend must allow this site's origin via its `CORS_ALLOWED_ORIGINS`.
