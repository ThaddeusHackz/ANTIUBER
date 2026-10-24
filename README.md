# ANTIUBER — reverse-engineered Uber GH

A high-fidelity recreation of [uber.com/gh/en](https://www.uber.com/gh/en/) **and** the
authenticated rider experience, built after reverse-engineering the public page.

- **Live marketing site** — `/` and the locale route `/gh/en`
- **Rider app** — `/ride`, `/activity`, `/payments`, `/account`, `/reserve`, `/help`
- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- **Supabase** for auth, Postgres and RLS (`ride_*` tables)
- **REA MCP server** registered as `rea` for static analysis tooling

## Run it

```bash
cd web
cp .env.example .env.local   # add your Supabase keys
npm install
npm run dev                  # http://localhost:3000
```

`npm run dev` binds to `0.0.0.0:3000` for the sandbox preview.

Without network access to Supabase, the app automatically falls back to a
localStorage-backed demo rider so every screen stays explorable.

## Log in

Use **Log in → "Log in as demo rider"** for a seeded account with trip history,
saved places and a wallet. Real sign-ups go through Supabase Auth (confirmed
server-side so no email round-trip is required).

## Database

The schema lives in `web/supabase/migrations/`. It is namespaced with `ride_`
prefixes so it can co-exist with other tables in the shared project.

## REA

```bash
npx rea-agents@latest setup --dry-run     # show the plan
npx rea-agents@latest mcp doctor          # verify the server
node scripts/verify-rea-mcp.mjs           # independent JSON-RPC handshake
```

Registration: `.mcp.json` → `"rea": { "command": "npx", "args": ["-y", "rea-agents@6.7.0", "mcp"] }`

## Notice

Educational reverse-engineering demo. Not affiliated with, endorsed by, or
operated by Uber Technologies Inc. Uber and related marks are trademarks of
their respective owners; this build uses original imagery and a distinct wordmark.
