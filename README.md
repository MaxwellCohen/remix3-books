# Remix 3 Books

Goodreads catalog demo built with [Remix 3](https://remix.run) (the `remix` package: fetch router, server-rendered Remix components with `clientEntry` hydration and client navigation), Tailwind CSS v4, and Drizzle on Neon Postgres. Port of the shared "Books" app.

## Environment

Copy `.env.example` to `.env`.

- `POSTGRES_URL` — Postgres connection string. Leave empty to serve the built-in preview catalog.
- `API_DELAY_MS` — optional artificial server latency in milliseconds.

## Commands

- `pnpm dev` — dev server on port 3000 (Node, assets compiled on demand, Tailwind in watch mode)
- `pnpm start` — Node server in production mode (`PORT` env, default 3000; run `pnpm build:css` first)
- `pnpm build` — host build (needs a host flag, see below)
- `pnpm typecheck` — `tsc`

## Deployment

| Host | URL | Build flag |
| --- | --- | --- |
| Vercel | https://remix3-books.vercel.app | `VERCEL=1` (set by Vercel) |
| Netlify | https://remix3-books.netlify.app | `NETLIFY=1` |
| Cloudflare Workers | https://remix3-books.to-email-max.workers.dev | `CLOUDFLARE=1` (or `WORKERS_CI`, set by Workers Builds) |

Remix 3 has no build step or host adapters: its asset server compiles browser modules from source at request time, and the router is a plain `fetch(request)` handler. `scripts/build.ts` adapts that for serverless hosts:

- snapshots the asset server's production output (fingerprinted modules, import maps, preloads) into `dist/client` for the host CDN,
- bundles `router.fetch` with esbuild, swapping `app/assets.ts` for `app/assets.prebuilt.ts` (a manifest-backed `getScriptEntry`),
- writes the host layout: Vercel Build Output API (`.vercel/output`), a Netlify function (`dist/netlify/functions/server`), or a Worker with static assets (`dist/worker`, `dist/client`).

- `POSTGRES_URL` is set on every host (Vercel and Netlify environment variable, Cloudflare secret). Without it the app serves the preview catalog.
- Deploys: `pnpm deploy:vercel`, `pnpm deploy:netlify`, `pnpm deploy:cloudflare`.
