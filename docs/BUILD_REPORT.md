# REA + Uber GH rebuild — verification report

## 1. REA install and MCP registration — verified

| Check | Command | Result |
|---|---|---|
| Node version | `node --version` | **v22.22.3** — satisfies `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` |
| Plan (dry run) | `rea-agents@latest setup --dry-run --client cursor` | 2 planned actions |
| Apply | `rea-agents@latest setup --yes --client cursor` | applied, 0 failures |
| MCP doctor | `rea-agents@latest mcp doctor --json` | `healthy: true` |
| Server identity | doctor / handshake | `name: rea`, `version: 6.7.0`, protocol `2025-11-25` |
| Tool inventory | doctor | **207/207 tools**, 6/6 prompts, no missing/unexpected/duplicates |
| Catalog digest | doctor | expected == observed `96d8f6e6…32441c` |
| Skill | `rea doctor` | `aligned`, skill v42, 207 tools |
| Registration | `rea doctor` | `aligned` → `npx -y rea-agents@6.7.0 mcp` |
| Independent handshake | `node scripts/verify-rea-mcp.mjs` | **PASS** — `serverInfo {"name":"rea","version":"6.7.0"}`, 207 tools |

Registration files:
- `/home/user/.cursor/mcp.json` → `mcpServers.rea`
- `.mcp.json` (repo root) → `mcpServers.rea` (stdio), so any MCP client opening this repo discovers it

`rea doctor` reports overall `healthy: false` only because the optional binary-analysis
providers (Ghidra / IDA / JADX / Kuna) are unset. None are required for web work.

## 2. Reverse engineering of https://www.uber.com/gh/en/

Captured from the live page (HEAD/HTML + rendered content):

- Section order: hero → "Ready to travel?" → "Explore what you can do with Uber"
  (6 tiles) → "How to request a ride" (5 steps) → "Planning your next getaway?"
  (City Hub) → "More ways to use Uber" → "Earn with Uber" → Uber for Business →
  "It's easier in the apps" (2 app cards) → language selector → footer.
- Header taxonomy: Ride / Drive / Business / About / Help + city chip + EN + Log in / Sign up.
- Footer taxonomy: Company / Products / Global citizenship / Travel + social + legal.
- Locale route: `/gh/en/` with deep links (`/gh/en/business/`) — reproduced with Next rewrites.
- Rider form: Pickup now / schedule, pickup + dropoff inputs, "See prices",
  "Log in to check your activity".
- Asset host patterns (`cn-geo1.uber.com`, `tb-static.uber.com`) are **not** hot-linked;
  original generated imagery is used instead.

Sandbox egress is allowlisted to npm / PyPI / GitHub, so REA's own headless-browser
capture cannot open `uber.com` from this container. Page structure was captured with the
browsing tools instead, and REA remains available for static analysis of any saved bundle.

## 3. Build — verified

`cd web && npm run build` → compiled successfully, **42 routes** prerendered.

HTTP checks (all 200): `/`, `/gh/en`, `/gh/en/business`, `/gh/en/help`, `/gh/en/cities/accra`,
`/gh/en/safety`, `/ride`, `/login`, `/signup`, `/activity`, `/account`, `/payments`,
`/reserve`, `/help`, `/drive`, `/business`, `/cities`, `/cities/kumasi`,
`/about/autonomous`, `/ride/teens`, `/legal/terms`; unknown paths return 404.

Rider store unit test (localStorage shim): initial → sign-in → add ride (5 rides) →
rate 5 → add card (3 methods) → profile update → sign-out. All persisted correctly.

## 4. Supabase — applied

Project `xmbkmdqaczlxkdarayyy` (migration `antiuber_rider_experience`), namespaced so it
cannot collide with the app already using the `public` schema:

`ride_profiles`, `ride_places`, `ride_rides`, `ride_payment_methods`, `ride_fares`
— RLS enabled, per-user policies, fares readable by anon, 4 seeded ride tiers.
Copy kept in `web/supabase/migrations/0001_rider_experience.sql`.

Auth: sign-ups are created server-side with `email_confirm: true` (the project requires
email confirmation and has no SMTP), so the flow completes without an inbox round-trip.

## 5. Vercel — deployed ✅

**Live:** https://antiuber-gh.vercel.app

| | |
|---|---|
| Project | `antiuber-gh` (`prj_leRz21WCZGzRE1Kx05NiXT3ngKDj`) |
| Repo / root | `ThaddeusHackz/ANTIUBER` · root directory `web` |
| Framework | Next.js (auto-detected) |
| Production ref | `main` @ `20b4909` → READY / PROMOTED |
| Env vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (encrypted), `NEXT_PUBLIC_SITE_URL` |

### What the "Access denied" actually was

Every earlier write failed because the calls were sent **with a `team_id`**. The same
endpoint succeeds without it — proven by `get_project`, which returned
*Access denied* with `team_id` and the full project JSON without it. Dropping the
parameter created the project, the env vars and both deployments on the first try.

### Runtime proof (not just a 200)

A temporary `/api/health` probe was promoted to production from this branch, called,
and then production was rolled back to `main`:

```json
{"ok":true,"runtime":"nodejs","region":"iad1","commit":"6da0d48",
 "config":{"supabaseUrl":true,"anonKey":true,"serviceRoleKey":true},
 "checks":{"anon":{"ok":true,"fares":4},"serviceRole":{"ok":true,"profiles":0}}}
```

So from Vercel's own runtime: the anon key reads the 4 fare tiers and the
service-role key authenticates. Demo login therefore performs a real Supabase sign-in
on the deployment (the local fallback is only used when the DB is unreachable).

### Deployment notes

- Preview deployments are SSO-protected (team default `all_except_custom_domains`);
  the production alias is public.
- Pushes create preview deployments automatically. Production is promoted by an
  explicit deployment of `main`.

## 6. Connectors

| Connector | Used |
|---|---|
| Supabase | schema, RLS, fares, auth + demo seeding |
| Vercel | project `antiuber-gh`, env vars, production deploy + rollback |
| Google Sheets / Notion / Drive / Dropbox / Gmail / Slack / Linear | available, not needed for this build — happy to wire (fares from Sheets, help centre from Notion, assets from Drive) |
